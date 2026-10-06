/**
 * TOGOSERVE AI CORE - ACTION GATEWAY
 * Mandatory single-entry gateway executing consequential agent action proposals.
 */

import { AgentActionProposal, AgentContext, HITLRequest } from '../core/types';
import { ActionValidator, PermissionGuard } from './ActionValidator';
import { PolicyEngine } from '../governance/PolicyEngine';
import { RiskEngine } from '../governance/RiskEngine';
import { ApprovalService } from '../governance/ApprovalService';
import { AIPlatformError } from '../core/errors';
import {
  FinanceDomainService,
  InventoryDomainService,
  OrderDomainService,
  PurchaseOrderDomainService,
  DomainExecutionResult
} from './DomainServiceAdapters';
import { AI_EVENT_NAMES } from '../core/constants';

export interface ActionGatewayResult {
  executed: boolean;
  requiresHITL: boolean;
  hitlRequest?: HITLRequest;
  executionResult?: DomainExecutionResult;
  reason?: string;
  idempotencyKey: string;
}

export class ActionGateway {
  public static async processProposal(
    proposal: AgentActionProposal,
    context: AgentContext
  ): Promise<ActionGatewayResult> {
    const idempotencyKey =
      proposal.idempotencyKey ||
      `${proposal.requestId}-${proposal.proposalId}-${proposal.actionType}`;

    context.emitEvent?.(AI_EVENT_NAMES.ACTION_PROPOSED, { proposalId: proposal.proposalId, actionType: proposal.actionType });

    // 1. Schema Validation
    ActionValidator.validate(proposal);

    // 2. Authenticated Actor & Tenant Validation
    ActionValidator.validateActorAndTenant(proposal, context);

    // 3. RBAC Permission Check
    const hasPermission = PermissionGuard.checkPermission(proposal, context);
    if (!hasPermission) {
      context.emitEvent?.(AI_EVENT_NAMES.ACTION_BLOCKED, { proposalId: proposal.proposalId, reason: 'RBAC_FORBIDDEN' });
      throw new AIPlatformError(
        `Role "${context.role}" lacks permissions for action ${proposal.actionType}`,
        'FORBIDDEN_ACTION'
      );
    }

    // 4. Policy Engine Evaluation
    PolicyEngine.evaluate(proposal, context);
    context.emitEvent?.(AI_EVENT_NAMES.ACTION_VALIDATED, { proposalId: proposal.proposalId });

    // 5. Risk Assessment
    const riskAssessment = RiskEngine.assessRisk(proposal);
    proposal.riskLevel = riskAssessment.riskLevel;

    // 6. HITL Routing for High/Critical Risk (L4, L5)
    if (riskAssessment.requiresHITL) {
      const hitlRequest = ApprovalService.routeToHITL(proposal, riskAssessment.requiredRoles);
      context.emitEvent?.(AI_EVENT_NAMES.ACTION_HITL_REQUIRED, {
        proposalId: proposal.proposalId,
        reviewId: hitlRequest.reviewId,
        risk: proposal.riskLevel,
      });

      context.recordAudit?.({
        requestId: proposal.requestId,
        actorId: context.actorId,
        tenantId: context.tenantId,
        agentId: proposal.agentId,
        eventType: 'ACTION_GATED_HITL',
        resourceType: proposal.resourceType,
        resourceId: proposal.resourceId,
        riskLevel: proposal.riskLevel,
        hitlResult: 'PENDING_REVIEW',
        metadata: { hitlRequest, reason: proposal.reason },
      });

      return {
        executed: false,
        requiresHITL: true,
        hitlRequest,
        reason: `Consequential action requires human review (${proposal.riskLevel}): ${riskAssessment.reasons.join(', ')}`,
        idempotencyKey,
      };
    }

    // 7. Auto Execution for Authorized L0-L3 Actions
    ApprovalService.markExecuted(idempotencyKey);
    const domainResult = await this.dispatchToDomainService(proposal);

    proposal.status = 'AUTO_EXECUTED';
    context.emitEvent?.(AI_EVENT_NAMES.ACTION_EXECUTED, { proposalId: proposal.proposalId });

    context.recordAudit?.({
      requestId: proposal.requestId,
      actorId: context.actorId,
      tenantId: context.tenantId,
      agentId: proposal.agentId,
      eventType: 'ACTION_AUTO_EXECUTED',
      resourceType: proposal.resourceType,
      resourceId: proposal.resourceId,
      riskLevel: proposal.riskLevel,
      metadata: { executionResult: domainResult },
    });

    return {
      executed: true,
      requiresHITL: false,
      executionResult: domainResult,
      idempotencyKey,
    };
  }

  /**
   * Executes a proposal that has been APPROVED via HITL
   */
  public static async executeApprovedProposal(
    proposal: AgentActionProposal,
    context: AgentContext
  ): Promise<DomainExecutionResult> {
    const idempotencyKey =
      proposal.idempotencyKey ||
      `${proposal.requestId}-${proposal.proposalId}-${proposal.actionType}`;

    ApprovalService.markExecuted(idempotencyKey);
    const domainResult = await this.dispatchToDomainService(proposal);

    context.emitEvent?.(AI_EVENT_NAMES.ACTION_EXECUTED, { proposalId: proposal.proposalId });
    context.recordAudit?.({
      requestId: proposal.requestId,
      actorId: context.actorId,
      tenantId: context.tenantId,
      agentId: proposal.agentId,
      eventType: 'ACTION_APPROVED_AND_EXECUTED',
      resourceType: proposal.resourceType,
      resourceId: proposal.resourceId,
      riskLevel: proposal.riskLevel,
      hitlResult: 'APPROVED',
      metadata: { executionResult: domainResult },
    });

    return domainResult;
  }

  private static async dispatchToDomainService(
    proposal: AgentActionProposal
  ): Promise<DomainExecutionResult> {
    switch (proposal.actionType) {
      case 'PROPOSE_FINANCIAL_SETTLEMENT_CORRECTION':
        return FinanceDomainService.executeLedgerCorrection(proposal.resourceId, proposal.payload);

      case 'PROPOSE_BINDING_PURCHASE_ORDER':
        return PurchaseOrderDomainService.executeCreatePurchaseOrder(proposal.resourceId, proposal.payload);

      case 'RESTOCK_INVENTORY':
        return InventoryDomainService.executeRestock(proposal.resourceId, proposal.payload);

      default:
        return OrderDomainService.executeOrderAdjustment(proposal.resourceId, proposal.payload);
    }
  }
}
