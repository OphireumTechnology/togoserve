/**
 * TOGOSERVE AI CORE - POLICY ENGINE
 * Code-configured, versioned business rules enforcing operational boundaries.
 */

import { AgentActionProposal, AgentContext } from '../core/types';
import { PolicyViolationError } from '../core/errors';

export interface PolicyEvaluationResult {
  policyName: string;
  version: string;
  passed: boolean;
  reason: string;
}

export class PolicyEngine {
  private static version = '1.2.0';

  public static evaluate(
    proposal: AgentActionProposal,
    context: AgentContext
  ): PolicyEvaluationResult[] {
    const results: PolicyEvaluationResult[] = [];

    // 1. Tenant Isolation Policy
    if (proposal.tenantId !== context.tenantId && context.tenantId !== 'global' && context.role !== 'SUPER_ADMIN') {
      throw new PolicyViolationError('TENANT_ISOLATION', `Tenant mismatch: proposal=${proposal.tenantId}, actor=${context.tenantId}`);
    }
    results.push({
      policyName: 'TENANT_ISOLATION_POLICY',
      version: this.version,
      passed: true,
      reason: 'Tenant boundaries verified.',
    });

    // 2. Financial Refund & Adjustment Policy
    if (proposal.actionType.includes('FINANCIAL') || proposal.actionType.includes('REFUND')) {
      const amount = Number(proposal.payload?.correctionAmount || proposal.payload?.refundAmount || 0);
      if (amount > 10000) {
        throw new PolicyViolationError('FINANCIAL_CAP', `Single AI adjustment of ₱${amount} exceeds max allowable limit (₱10,000)`);
      }
      results.push({
        policyName: 'FINANCIAL_ADJUSTMENT_POLICY',
        version: this.version,
        passed: true,
        reason: `Financial adjustment of ₱${amount} is within platform ceiling. Mandatory HITL required.`,
      });
    }

    // 3. Dynamic Pricing Margin Policy
    if (proposal.actionType.includes('PRICING')) {
      const margin = Number(proposal.payload?.marginPct || 0);
      if (margin < 30) {
        throw new PolicyViolationError('MINIMUM_MARGIN_POLICY', `Proposed price results in margin ${margin}% which violates minimum 30% safety floor`);
      }
      results.push({
        policyName: 'PRICING_MARGIN_POLICY',
        version: this.version,
        passed: true,
        reason: `Target margin ${margin}% satisfies merchant threshold (> 30%).`,
      });
    }

    // 4. Courtesy Credit Voucher Policy
    if (proposal.actionType.includes('COURTESY_CREDIT')) {
      const credit = Number(proposal.payload?.creditAmount || 0);
      if (credit > 100) {
        throw new PolicyViolationError('COURTESY_CREDIT_POLICY', `Courtesy compensation ₱${credit} exceeds max limit of ₱100`);
      }
      results.push({
        policyName: 'COURTESY_CREDIT_POLICY',
        version: this.version,
        passed: true,
        reason: `Courtesy compensation ₱${credit} complies with SOP-LOG-04.`,
      });
    }

    return results;
  }
}
