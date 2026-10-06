/**
 * TOGOSERVE AI CORE - HITL ROUTER & APPROVAL SERVICE
 * Maker-Checker governed human review workflow for L4/L5 actions.
 */

import {
  AgentActionProposal,
  HITLDecision,
  HITLRequest,
  UserRole
} from '../core/types';
import { AIPlatformError } from '../core/errors';

export class ApprovalService {
  private static pendingReviews = new Map<string, HITLRequest>();
  private static proposals = new Map<string, AgentActionProposal>();
  private static executedProposals = new Set<string>(); // Idempotency check

  public static routeToHITL(
    proposal: AgentActionProposal,
    requiredRoles: UserRole[] = ['ADMIN', 'SUPER_ADMIN']
  ): HITLRequest {
    const reviewId = `hitl-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const hitlRequest: HITLRequest = {
      reviewId,
      proposalId: proposal.proposalId,
      risk: proposal.riskLevel,
      reason: proposal.reason,
      requestedBy: proposal.agentId,
      requiredRole: requiredRoles,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    this.pendingReviews.set(reviewId, hitlRequest);
    this.proposals.set(proposal.proposalId, proposal);
    return hitlRequest;
  }

  public static getPendingReviews(): HITLRequest[] {
    return Array.from(this.pendingReviews.values()).filter((r) => r.status === 'PENDING');
  }

  public static getAllReviews(): HITLRequest[] {
    return Array.from(this.pendingReviews.values());
  }

  public static getProposal(proposalId: string): AgentActionProposal | undefined {
    return this.proposals.get(proposalId);
  }

  public static reviewProposal(
    reviewId: string,
    decision: HITLDecision
  ): { status: 'APPROVED' | 'MODIFIED' | 'REJECTED'; proposal: AgentActionProposal } {
    const review = this.pendingReviews.get(reviewId);
    if (!review) {
      throw new AIPlatformError(`HITL Review ${reviewId} not found`, 'REVIEW_NOT_FOUND');
    }

    if (review.status !== 'PENDING') {
      throw new AIPlatformError(`HITL Review ${reviewId} has already been resolved (${review.status})`, 'ALREADY_RESOLVED');
    }

    // Role check: reviewer must satisfy requiredRole or be SUPER_ADMIN
    if (!review.requiredRole.includes(decision.reviewerRole) && decision.reviewerRole !== 'SUPER_ADMIN') {
      throw new AIPlatformError(
        `Reviewer role "${decision.reviewerRole}" does not satisfy required approval role(s): ${review.requiredRole.join(', ')}`,
        'UNAUTHORIZED_REVIEWER_ROLE'
      );
    }

    const proposal = this.proposals.get(review.proposalId);
    if (!proposal) {
      throw new AIPlatformError(`Target proposal ${review.proposalId} not found`, 'PROPOSAL_NOT_FOUND');
    }

    review.status = decision.decision;
    review.reviewerId = decision.reviewerId;
    review.decision = decision.decision;
    review.reviewNotes = decision.notes;
    review.reviewedAt = new Date().toISOString();

    if (decision.decision === 'MODIFIED' && decision.modifiedPayload) {
      proposal.payload = { ...proposal.payload, ...decision.modifiedPayload };
      review.modifiedPayload = decision.modifiedPayload;
      proposal.status = 'MODIFIED';
    } else if (decision.decision === 'APPROVED') {
      proposal.status = 'APPROVED';
    } else {
      proposal.status = 'REJECTED';
    }

    proposal.reviewerId = decision.reviewerId;
    proposal.reviewComment = decision.notes;

    return { status: decision.decision, proposal };
  }

  public static markExecuted(idempotencyKey: string): void {
    if (this.executedProposals.has(idempotencyKey)) {
      throw new AIPlatformError(`Action already executed with key: ${idempotencyKey}`, 'DUPLICATE_EXECUTION');
    }
    this.executedProposals.add(idempotencyKey);
  }

  public static isExecuted(idempotencyKey: string): boolean {
    return this.executedProposals.has(idempotencyKey);
  }

  public static reset(): void {
    this.pendingReviews.clear();
    this.proposals.clear();
    this.executedProposals.clear();
  }
}
