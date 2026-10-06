/**
 * TOGOSERVE AI CORE - ACTION VALIDATOR & GUARDS
 */

import { AgentActionProposal, AgentContext } from '../core/types';
import { AIPlatformError, TenantViolationError } from '../core/errors';

export class ActionValidator {
  public static validate(proposal: AgentActionProposal): void {
    if (!proposal.proposalId) {
      throw new AIPlatformError('Proposal missing proposalId', 'INVALID_PROPOSAL_SCHEMA');
    }
    if (!proposal.agentId) {
      throw new AIPlatformError('Proposal missing agentId', 'INVALID_PROPOSAL_SCHEMA');
    }
    if (!proposal.actionType) {
      throw new AIPlatformError('Proposal missing actionType', 'INVALID_PROPOSAL_SCHEMA');
    }
    if (!proposal.resourceType || !proposal.resourceId) {
      throw new AIPlatformError('Proposal missing target resource reference', 'INVALID_PROPOSAL_SCHEMA');
    }
    if (!proposal.payload || typeof proposal.payload !== 'object') {
      throw new AIPlatformError('Proposal payload must be an object', 'INVALID_PROPOSAL_SCHEMA');
    }
    if (!['L0', 'L1', 'L2', 'L3', 'L4', 'L5'].includes(proposal.riskLevel)) {
      throw new AIPlatformError(`Invalid riskLevel: ${proposal.riskLevel}`, 'INVALID_RISK_LEVEL');
    }
  }

  public static validateActorAndTenant(
    proposal: AgentActionProposal,
    context: AgentContext
  ): void {
    if (!context.actorId) {
      throw new AIPlatformError('Unauthenticated actor context', 'UNAUTHENTICATED');
    }
    if (proposal.tenantId !== context.tenantId && context.tenantId !== 'global' && context.role !== 'SUPER_ADMIN') {
      throw new TenantViolationError(proposal.tenantId, context.tenantId);
    }
  }
}

export class PermissionGuard {
  private static rolePermissions: Record<string, string[]> = {
    CUSTOMER: ['customer:read', 'order:create', 'padala:book'],
    MERCHANT_OWNER: ['merchant:read', 'merchant:write', 'inventory:read', 'inventory:write', 'catalog:read', 'catalog:write'],
    MERCHANT_STAFF: ['merchant:read', 'inventory:read', 'order:read'],
    RIDER: ['rider:read', 'rider:write', 'logistics:read'],
    DISPATCHER: ['logistics:read', 'logistics:write', 'dispatch:read', 'dispatch:write'],
    FINANCE: ['finance:read', 'finance:write', 'ledger:read', 'ledger:write'],
    SUPPORT: ['support:read', 'support:write', 'order:read', 'customer:read'],
    ADMIN: ['*'],
    SUPER_ADMIN: ['*'],
  };

  public static checkPermission(proposal: AgentActionProposal, context: AgentContext): boolean {
    const permissions = this.rolePermissions[context.role] || [];
    if (permissions.includes('*')) return true;

    // Financial action requires finance or admin
    if (proposal.actionType.includes('FINANCIAL') || proposal.actionType.includes('SETTLEMENT')) {
      return permissions.includes('finance:write');
    }

    // Purchase order requires merchant or admin
    if (proposal.actionType.includes('PURCHASE_ORDER')) {
      return permissions.includes('merchant:write');
    }

    // Pricing adjustment requires merchant
    if (proposal.actionType.includes('PRICING')) {
      return permissions.includes('merchant:write');
    }

    // Courtesy voucher requires support or admin
    if (proposal.actionType.includes('COURTESY_CREDIT')) {
      return permissions.includes('support:write');
    }

    return true;
  }
}
