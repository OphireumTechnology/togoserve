/**
 * TOGOSERVE AI CORE - AGENT MASTER EXPORT
 * Collects and registers all A00-A60 agents into AgentRegistry.
 */

import { TOGOServeAgent } from '../core/types';
import { AgentRegistry } from '../core/AgentRegistry';
import { A00Supervisor } from '../orchestrator/A00Supervisor';
import { CUSTOMER_AGENTS } from './customer';
import { MERCHANT_AGENTS } from './merchant';
import { COMMERCE_AGENTS } from './commerce';
import { LOGISTICS_AGENTS } from './logistics';
import { RIDER_AGENTS } from './rider';
import { FINANCE_AGENTS } from './finance';
import { MARKETING_AGENTS } from './marketing';
import { PROCUREMENT_AGENTS } from './procurement';
import { SUPPORT_AGENTS } from './support';

export const ALL_AGENTS: TOGOServeAgent[] = [
  new A00Supervisor(),
  ...CUSTOMER_AGENTS,
  ...MERCHANT_AGENTS,
  ...COMMERCE_AGENTS,
  ...LOGISTICS_AGENTS,
  ...RIDER_AGENTS,
  ...FINANCE_AGENTS,
  ...MARKETING_AGENTS,
  ...PROCUREMENT_AGENTS,
  ...SUPPORT_AGENTS,
];

/**
 * Bootstraps all A00-A60 agents into the singleton AgentRegistry.
 */
export function bootstrapAgentRegistry(): AgentRegistry {
  const registry = AgentRegistry.getInstance();
  for (const agent of ALL_AGENTS) {
    if (!registry.get(agent.id)) {
      registry.register(agent);
    }
  }
  return registry;
}
