import test from 'node:test';
import assert from 'node:assert/strict';
import { bootstrapAgentRegistry } from '../agents';
import { AgentRegistry, PRIORITY_12_AGENTS } from '../core/AgentRegistry';
import { A00Supervisor } from '../orchestrator/A00Supervisor';
import { MerchantSupervisor } from '../orchestrator/supervisors/MerchantSupervisor';
import { LogisticsSupervisor } from '../orchestrator/supervisors/LogisticsSupervisor';
import { AdminSupervisor } from '../orchestrator/supervisors/AdminSupervisor';
import { KnowledgeService } from '../rag/KnowledgeService';
import { AgentContextBuilder } from '../core/AgentContext';
import { AgentRequest } from '../core/types';
import { registerDomainTools } from '../tools/domainTools';

test('Hierarchy: registers S01, S02, S03 departmental supervisors and maps departments', () => {
  const registry = bootstrapAgentRegistry();

  const s01 = registry.get('S01');
  const s02 = registry.get('S02');
  const s03 = registry.get('S03');

  assert.ok(s01, 'S01 Merchant Supervisor should be registered');
  assert.ok(s02, 'S02 Logistics Supervisor should be registered');
  assert.ok(s03, 'S03 Admin Supervisor should be registered');

  // Verify departmental agent indexing
  const merchantAgents = registry.getByDepartment('MERCHANTS');
  const logisticsAgents = registry.getByDepartment('LOGISTICS');
  const adminAgents = registry.getByDepartment('ADMINISTRATION');

  assert.ok(merchantAgents.length >= 14, 'Merchants department should include A10-A19 + A53-A56 + S01');
  assert.ok(logisticsAgents.length >= 13, 'Logistics department should include A27-A36 + A37-A39 + S02');
  assert.ok(adminAgents.length >= 35, 'Administration department should include A00, S03, A01-A09, A20-A26, A40-A46, A47-A52, A57-A60');
});

test('Lifecycle: Priority 12 Foundational Agents initialized in Shadow Mode (TESTING)', () => {
  const registry = bootstrapAgentRegistry();

  for (const agentId of PRIORITY_12_AGENTS) {
    const meta = registry.getMetadata(agentId);
    assert.ok(meta, `Agent ${agentId} should have metadata`);
    assert.equal(meta.lifecycleStatus, 'TESTING', `Priority agent ${agentId} should be in TESTING (shadow mode)`);
    assert.equal(meta.enabled, true, `Priority agent ${agentId} should be enabled for shadow execution`);
  }
});

test('Safety: Quarantine isolation revokes operational execution privileges', () => {
  const registry = bootstrapAgentRegistry();

  // Quarantine A14 Pricing Optimizer
  registry.quarantineAgent('A14', 'Simulated safety testing of pricing bounds');
  assert.equal(registry.isEnabled('A14'), false, 'Quarantined agent must not be enabled');
  
  const meta = registry.getMetadata('A14');
  assert.equal(meta?.lifecycleStatus, 'QUARANTINED');
  assert.ok(meta?.quarantineReason?.includes('Simulated safety testing'));

  // Restore
  registry.setLifecycleStatus('A14', 'TESTING');
  assert.equal(registry.isEnabled('A14'), true, 'Restored agent should be enabled again');
});

test('Emergency Stop: Halts all agents and causes A00 to return BLOCKED', async () => {
  const registry = bootstrapAgentRegistry();
  registerDomainTools();
  const supervisor = new A00Supervisor();

  // Activate Emergency Stop
  registry.emergencyStopAll('Incident testing emergency halt');
  assert.equal(registry.isEmergencyStopped(), true);
  assert.equal(registry.isEnabled('A01'), false);
  assert.equal(registry.isEnabled('A27'), false);

  const req: AgentRequest = {
    requestId: 'req-emergency-halt',
    actorId: 'admin-1',
    role: 'ADMIN',
    tenantId: 'global',
    permissions: ['admin:all'],
    query: 'Process daily vendor batch disbursements',
    timestamp: new Date().toISOString(),
  };

  const context = AgentContextBuilder.createContext(req, {
    allowedTools: supervisor.allowedTools,
  });

  const response = await supervisor.execute(req, context);
  assert.equal(response.status, 'BLOCKED', 'A00 must block queries while Emergency Stop is active');
  assert.ok(response.summary.includes('Platform operation halted'));

  // Resume
  registry.resumeAll();
  assert.equal(registry.isEmergencyStopped(), false);
  assert.equal(registry.isEnabled('A01'), true);
});

test('KnowledgeService: RAG retrieval returns accurate courier SLAs and policies', () => {
  const rag = KnowledgeService.getInstance();

  // Test padala motorcycle limits
  const padalaResults = rag.search('motorcycle weight dimensions padala');
  assert.ok(padalaResults.length > 0);
  assert.ok(padalaResults[0].document.content.includes('20kg'));
  assert.ok(padalaResults[0].document.content.includes('40cm x 40cm x 40cm'));

  // Test merchant T+1 settlement
  const settlementResults = rag.search('merchant settlement commission T+1');
  assert.ok(settlementResults.length > 0);
  assert.ok(settlementResults[0].document.content.includes('2.5%'));
  assert.ok(settlementResults[0].document.content.includes('T+1'));

  // Test prohibited items
  const prohibitedResults = rag.search('prohibited hazardous materials narcotics');
  assert.ok(prohibitedResults.length > 0);
  assert.ok(prohibitedResults[0].document.content.includes('Hazardous materials'));
});
