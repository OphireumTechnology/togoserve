/**
 * TOGOSERVE AI CORE - CONSTANTS & POLICIES
 */

import { AIRiskLevel } from './types';

export const AI_RISK_LEVELS: Record<AIRiskLevel, {
  label: string;
  description: string;
  requiresHITL: boolean;
  requiresMakerChecker: boolean;
}> = {
  L0: {
    label: 'L0 • Read / Explain',
    description: 'Read-only context generation and explanation. Unrestricted safe execution.',
    requiresHITL: false,
    requiresMakerChecker: false,
  },
  L1: {
    label: 'L1 • Recommendation',
    description: 'Advisory insights for humans. No database state modifications.',
    requiresHITL: false,
    requiresMakerChecker: false,
  },
  L2: {
    label: 'L2 • Authorized Low-Risk',
    description: 'Minor route adjustments, standard search ranking, non-financial updates.',
    requiresHITL: false,
    requiresMakerChecker: false,
  },
  L3: {
    label: 'L3 • Controlled Operations',
    description: 'Operational scheduling, inventory restock alerts, dynamic bounds adjustments.',
    requiresHITL: false,
    requiresMakerChecker: false,
  },
  L4: {
    label: 'L4 • Financial & Account (HITL)',
    description: 'Refunds > ₱500, merchant settlement corrections, purchase orders, balance mutations.',
    requiresHITL: true,
    requiresMakerChecker: true,
  },
  L5: {
    label: 'L5 • Critical Security & Privilege (HITL)',
    description: 'Account suspension, credential reset, security overrides, privilege escalations.',
    requiresHITL: true,
    requiresMakerChecker: true,
  },
};

export const HITL_MANDATORY_RISK_LEVELS: AIRiskLevel[] = ['L4', 'L5'];

export const AI_EVENT_NAMES = {
  REQUEST_CREATED: 'ai.request.created',
  AGENT_SELECTED: 'ai.agent.selected',
  AGENT_STARTED: 'ai.agent.started',
  AGENT_COMPLETED: 'ai.agent.completed',
  AGENT_FAILED: 'ai.agent.failed',
  ACTION_PROPOSED: 'ai.action.proposed',
  ACTION_VALIDATED: 'ai.action.validated',
  ACTION_BLOCKED: 'ai.action.blocked',
  ACTION_HITL_REQUIRED: 'ai.action.hitl_required',
  ACTION_APPROVED: 'ai.action.approved',
  ACTION_MODIFIED: 'ai.action.modified',
  ACTION_REJECTED: 'ai.action.rejected',
  ACTION_EXECUTED: 'ai.action.executed',
  PROVIDER_FAILED: 'ai.provider.failed',
} as const;

export const DEFAULT_TIMEOUT_MS = 15000;
