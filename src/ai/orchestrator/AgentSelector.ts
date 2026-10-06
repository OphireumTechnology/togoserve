/**
 * TOGOSERVE AI CORE - AGENT SELECTOR
 */

import { AgentId, AgentRequest } from '../core/types';
import { ClassifiedIntent } from './IntentClassifier';
import { AgentRegistry } from '../core/AgentRegistry';

export class AgentSelector {
  public static selectAgents(
    request: AgentRequest,
    classified: ClassifiedIntent
  ): AgentId[] {
    // If request explicitly specifies a target agent
    if (request.targetAgentId) {
      const reg = AgentRegistry.getInstance();
      if (reg.get(request.targetAgentId)) {
        return [request.targetAgentId];
      }
    }

    switch (classified.domain) {
      case 'LOGISTICS':
        if (classified.intent === 'PADALA_SHIPMENT_GUIDANCE') {
          return ['A07', 'A35'];
        }
        return ['A27', 'A29'];

      case 'CUSTOMER':
        if (request.query.toLowerCase().includes('cart')) {
          return ['A04'];
        }
        if (request.query.toLowerCase().includes('track') || request.query.toLowerCase().includes('status')) {
          return ['A05', 'A06'];
        }
        return ['A01', 'A02', 'A03'];

      case 'MERCHANT':
        if (classified.intent === 'INVENTORY_MANAGEMENT') {
          return ['A12', 'A13'];
        }
        if (classified.intent === 'MERCHANT_CATALOG_PRICING') {
          return ['A11', 'A14'];
        }
        return ['A10'];

      case 'FINANCE':
        return ['A41', 'A46'];

      case 'RIDER':
        return ['A37', 'A38'];

      case 'PROCUREMENT':
        return ['A54', 'A55'];

      case 'SUPPORT':
        return ['A57', 'A59', 'A60'];

      case 'COMMERCE':
        return ['A20', 'A25'];

      default:
        return ['A01'];
    }
  }
}
