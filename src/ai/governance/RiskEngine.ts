/**
 * TOGOSERVE AI CORE - RISK ENGINE
 * Classifies operational and financial risk (L0-L5) and determines HITL routing.
 */

import { AgentActionProposal, AIRiskLevel, UserRole } from '../core/types';
import { HITL_MANDATORY_RISK_LEVELS } from '../core/constants';

export interface RiskAssessment {
  riskLevel: AIRiskLevel;
  riskScore: number;
  requiresHITL: boolean;
  requiredRoles: UserRole[];
  reasons: string[];
}

export class RiskEngine {
  public static assessRisk(proposal: AgentActionProposal): RiskAssessment {
    const reasons: string[] = [];
    let riskLevel: AIRiskLevel = proposal.riskLevel;
    let riskScore = 0.2;
    let requiredRoles: UserRole[] = ['ADMIN', 'SUPER_ADMIN'];

    // 1. High-risk financial operations
    if (
      proposal.actionType.includes('FINANCIAL') ||
      proposal.actionType.includes('SETTLEMENT') ||
      proposal.actionType.includes('REFUND')
    ) {
      riskLevel = 'L4';
      riskScore = 0.85;
      requiredRoles = ['FINANCE', 'ADMIN', 'SUPER_ADMIN'];
      reasons.push('Direct financial balance adjustment or payment ledger mutation.');
    }

    // 2. High-risk binding purchase orders
    if (proposal.actionType.includes('PURCHASE_ORDER')) {
      riskLevel = 'L4';
      riskScore = 0.8;
      requiredRoles = ['MERCHANT_OWNER', 'ADMIN', 'SUPER_ADMIN'];
      reasons.push('Financially binding purchase order requiring merchant owner authorization.');
    }

    // 3. Critical security or account restrictions
    if (
      proposal.actionType.includes('ACCOUNT_RESTRICTION') ||
      proposal.actionType.includes('SECURITY_OVERRIDE') ||
      proposal.actionType.includes('SUSPEND')
    ) {
      riskLevel = 'L5';
      riskScore = 0.98;
      requiredRoles = ['SUPER_ADMIN', 'ADMIN'];
      reasons.push('Critical privilege and account suspension risk.');
    }

    // 4. Controlled operational actions
    if (proposal.actionType.includes('PRICING')) {
      riskLevel = 'L3';
      riskScore = 0.55;
      requiredRoles = ['MERCHANT_OWNER', 'MERCHANT_STAFF', 'ADMIN'];
      reasons.push('Controlled pricing modification with margin verification.');
    }

    // 5. Low risk courtesy vouchers
    if (proposal.actionType.includes('COURTESY_CREDIT')) {
      riskLevel = 'L2';
      riskScore = 0.3;
      requiredRoles = ['SUPPORT', 'ADMIN'];
      reasons.push('Low-risk courtesy credit within authorized policy ceiling.');
    }

    const requiresHITL = HITL_MANDATORY_RISK_LEVELS.includes(riskLevel);

    return {
      riskLevel,
      riskScore,
      requiresHITL,
      requiredRoles,
      reasons,
    };
  }
}
