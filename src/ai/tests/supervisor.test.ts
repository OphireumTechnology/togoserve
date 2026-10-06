import test from 'node:test';
import assert from 'node:assert/strict';
import { bootstrapAgentRegistry } from '../agents';
import { A00Supervisor } from '../orchestrator/A00Supervisor';
import { AgentContextBuilder } from '../core/AgentContext';
import { AgentRequest } from '../core/types';
import { registerDomainTools } from '../tools/domainTools';

test('A00Supervisor: intent classification and multi-agent execution', async () => {
  bootstrapAgentRegistry();
  registerDomainTools();

  const supervisor = new A00Supervisor();

  // Test Customer Food Inquiry
  const customerReq: AgentRequest = {
    requestId: 'req-test-101',
    actorId: 'cust-1',
    role: 'CUSTOMER',
    tenantId: 'store-1',
    permissions: ['customer:read'],
    query: 'I need dinner for five people under ₱1,500 with artisan bread and burgers.',
    timestamp: new Date().toISOString(),
  };

  const context = AgentContextBuilder.createContext(customerReq, {
    allowedTools: supervisor.allowedTools,
  });

  const response = await supervisor.execute(customerReq, context);
  assert.equal(response.status, 'SUCCESS');
  assert.equal(response.agentId, 'A00');
  assert.ok(response.summary.includes('Synthesized multi-agent coordination'));
  assert.ok(response.confidence > 0.8);
});

test('A00Supervisor: Logistics & Padala dispatch inquiry', async () => {
  bootstrapAgentRegistry();
  const supervisor = new A00Supervisor();

  const padalaReq: AgentRequest = {
    requestId: 'req-padala-202',
    actorId: 'cust-2',
    role: 'CUSTOMER',
    tenantId: 'global',
    permissions: ['customer:read'],
    query: 'Send 3kg express parcel shipment from BGC to Makati via motorcycle.',
    timestamp: new Date().toISOString(),
  };

  const context = AgentContextBuilder.createContext(padalaReq, {
    allowedTools: supervisor.allowedTools,
  });

  const response = await supervisor.execute(padalaReq, context);
  assert.equal(response.status, 'SUCCESS');
  assert.ok(response.summary.includes('A07') || response.summary.includes('A35'));
});
