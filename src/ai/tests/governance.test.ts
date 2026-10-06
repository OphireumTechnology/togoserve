import test from 'node:test';
import assert from 'node:assert/strict';
import { ActionGateway } from '../gateway/ActionGateway';
import { AgentActionProposal, AgentContext } from '../core/types';
import { ApprovalService } from '../governance/ApprovalService';
import { AIPlatformError, PolicyViolationError } from '../core/errors';

test('ActionGateway: L4 financial proposal is gated to HITL', async () => {
  ApprovalService.reset();

  const proposal: AgentActionProposal = {
    proposalId: 'prop-test-l4-fin',
    requestId: 'req-fin-101',
    agentId: 'A46',
    actorId: 'usr-fin-01',
    tenantId: 'store-1',
    actionType: 'PROPOSE_FINANCIAL_SETTLEMENT_CORRECTION',
    resourceType: 'LEDGER_ENTRY',
    resourceId: 'ledg-889',
    payload: { correctionAmount: 500, direction: 'CREDIT_MERCHANT' },
    reason: 'Correction of duplicate fee',
    confidence: 0.95,
    riskLevel: 'L4',
    status: 'PENDING_REVIEW',
    createdAt: new Date().toISOString(),
  };

  const context: AgentContext = {
    requestId: 'req-fin-101',
    actorId: 'usr-fin-01',
    role: 'FINANCE',
    tenantId: 'store-1',
    permissions: ['finance:write'],
    allowedTools: [],
  };

  const result = await ActionGateway.processProposal(proposal, context);
  assert.equal(result.executed, false, 'L4 proposal must not auto-execute');
  assert.equal(result.requiresHITL, true);
  assert.ok(result.hitlRequest);
  assert.equal(result.hitlRequest?.status, 'PENDING');
});

test('ApprovalService: maker-checker role enforcement', () => {
  ApprovalService.reset();

  const proposal: AgentActionProposal = {
    proposalId: 'prop-po-test',
    requestId: 'req-po-1',
    agentId: 'A56',
    actorId: 'usr-merch-01',
    tenantId: 'store-1',
    actionType: 'PROPOSE_BINDING_PURCHASE_ORDER',
    resourceType: 'PURCHASE_ORDER',
    resourceId: 'po-101',
    payload: { totalValue: 4500 },
    reason: 'Restock flour',
    confidence: 0.9,
    riskLevel: 'L4',
    status: 'PENDING_REVIEW',
    createdAt: new Date().toISOString(),
  };

  const hitl = ApprovalService.routeToHITL(proposal, ['MERCHANT_OWNER', 'ADMIN', 'SUPER_ADMIN']);

  // Attempt review by unauthorized CUSTOMER role -> must throw
  assert.throws(
    () => {
      ApprovalService.reviewProposal(hitl.reviewId, {
        reviewId: hitl.reviewId,
        proposalId: proposal.proposalId,
        reviewerId: 'cust-unauth',
        reviewerRole: 'CUSTOMER',
        decision: 'APPROVED',
        notes: 'Trying to approve PO without permissions',
        timestamp: new Date().toISOString(),
      });
    },
    (err: any) => err instanceof AIPlatformError && err.code === 'UNAUTHORIZED_REVIEWER_ROLE'
  );

  // Valid review by MERCHANT_OWNER
  const approved = ApprovalService.reviewProposal(hitl.reviewId, {
    reviewId: hitl.reviewId,
    proposalId: proposal.proposalId,
    reviewerId: 'danilo-owner',
    reviewerRole: 'MERCHANT_OWNER',
    decision: 'APPROVED',
    notes: 'Authorized wholesale restock',
    timestamp: new Date().toISOString(),
  });

  assert.equal(approved.status, 'APPROVED');
  assert.equal(approved.proposal.status, 'APPROVED');
});

test('ActionGateway: Idempotency prevents double execution', async () => {
  ApprovalService.reset();

  const proposal: AgentActionProposal = {
    proposalId: 'prop-idempotent-test',
    requestId: 'req-idem-1',
    agentId: 'A60',
    actorId: 'support-agent-1',
    tenantId: 'cust-1',
    actionType: 'ISSUE_CUSTOMER_COURTESY_CREDIT',
    resourceType: 'CUSTOMER_ACCOUNT',
    resourceId: 'cust-1',
    payload: { creditAmount: 50 },
    reason: 'Delivery delay courtesy credit',
    confidence: 0.95,
    riskLevel: 'L2',
    status: 'PENDING_REVIEW',
    createdAt: new Date().toISOString(),
    idempotencyKey: 'idem-key-test-voucher-01',
  };

  const context: AgentContext = {
    requestId: 'req-idem-1',
    actorId: 'support-agent-1',
    role: 'SUPPORT',
    tenantId: 'cust-1',
    permissions: ['support:write'],
    allowedTools: [],
  };

  // First run: executes successfully
  const firstRun = await ActionGateway.processProposal(proposal, context);
  assert.equal(firstRun.executed, true);

  // Second run with same idempotency key: must throw DUPLICATE_EXECUTION
  await assert.rejects(
    async () => {
      await ActionGateway.processProposal(proposal, context);
    },
    (err: any) => err instanceof AIPlatformError && err.code === 'DUPLICATE_EXECUTION'
  );
});
