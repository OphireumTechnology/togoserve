import test from 'node:test';
import assert from 'node:assert/strict';
import { AgentRegistry } from '../core/AgentRegistry';
import { bootstrapAgentRegistry, ALL_AGENTS } from '../agents';

test('AgentRegistry: registers all A00-A60 agents without duplicates', () => {
  const registry = bootstrapAgentRegistry();
  const registered = registry.list();

  // Exactly 61 agents (A00 + A01 through A60)
  assert.equal(registered.length, 61, `Expected 61 registered agents, got ${registered.length}`);

  // Assert A00 exists
  const a00 = registry.get('A00');
  assert.ok(a00, 'A00 Supervisor must exist');
  assert.equal(a00.category, 'ORCHESTRATION');

  // Verify all A01 through A60 exist
  const idSet = new Set<string>();
  for (let i = 1; i <= 60; i++) {
    const id = i < 10 ? `A0${i}` : `A${i}`;
    const agent = registry.get(id);
    assert.ok(agent, `Agent ${id} must be registered`);
    assert.equal(agent.id, id);
    assert.ok(agent.name.length > 0, `Agent ${id} must have a name`);
    assert.ok(agent.capabilities.length > 0, `Agent ${id} must declare capabilities`);
    assert.ok(agent.allowedTools !== undefined, `Agent ${id} must define allowed tools array`);
    assert.ok(['L0', 'L1', 'L2', 'L3', 'L4', 'L5'].includes(agent.defaultRisk), `Agent ${id} must have valid default risk`);

    assert.ok(!idSet.has(id), `Duplicate agent ID detected: ${id}`);
    idSet.add(id);
  }
});

test('AgentRegistry: enable, disable, and category filtering', () => {
  const registry = bootstrapAgentRegistry();

  const logisticsAgents = registry.getByCategory('LOGISTICS');
  assert.equal(logisticsAgents.length, 10, 'Must have 10 logistics agents (A27-A36)');

  const financeAgents = registry.getByCategory('FINANCE');
  assert.equal(financeAgents.length, 7, 'Must have 7 finance agents (A40-A46)');

  // Test enable/disable
  assert.equal(registry.isEnabled('A12'), true);
  registry.disable('A12');
  assert.equal(registry.isEnabled('A12'), false);
  registry.enable('A12');
  assert.equal(registry.isEnabled('A12'), true);
});
