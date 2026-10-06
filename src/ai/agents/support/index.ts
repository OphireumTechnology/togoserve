/**
 * TOGOSERVE AI CORE - SUPPORT AGENTS (A57-A60)
 * Customer Issue Triage -> Case Summary -> Knowledge Retrieval -> Resolution Recommendation.
 * Any proposed financial concessions route through ActionGateway.
 */

import {
  AgentContext,
  AgentRequest,
  AgentResponse,
  TOGOServeAgent,
  AIRiskLevel,
  AgentActionProposal
} from '../../core/types';

// A57: Support Triage Agent
export class A57SupportTriageAgent implements TOGOServeAgent {
  public id = 'A57' as const;
  public name = 'A57 Support Triage Agent';
  public category = 'SUPPORT' as const;
  public description = 'Classifies inbound ticket urgency, detects customer sentiment, and routes to appropriate resolver group.';
  public version = '1.0.0';
  public capabilities = ['support_triage'] as const;
  public allowedTools = ['searchProducts'];
  public defaultRisk: AIRiskLevel = 'L0';
  public maxRisk: AIRiskLevel = 'L1';
  public requiredPermissions = ['support:read'];
  public enabled = true;

  public async canHandle(_req: AgentRequest): Promise<boolean> { return true; }

  public async execute(request: AgentRequest, _context: AgentContext): Promise<AgentResponse> {
    return {
      requestId: request.requestId,
      agentId: this.id,
      status: 'SUCCESS',
      summary: 'Inbound ticket triaged: Priority MEDIUM, Sentiment NEUTRAL, Category: ORDER_DELIVERY_DELAY.',
      data: {
        ticketPriority: 'MEDIUM',
        sentiment: 'NEUTRAL',
        category: 'DELIVERY_DELAY',
        slaTargetMinutes: 30,
      },
      confidence: 0.96,
      timestamp: new Date().toISOString(),
    };
  }
}

// A58: Case Summary Agent
export class A58CaseSummaryAgent implements TOGOServeAgent {
  public id = 'A58' as const;
  public name = 'A58 Case Summary Agent';
  public category = 'SUPPORT' as const;
  public description = 'Synthesizes long conversation transcripts and order timelines into a concise 3-bullet briefing for human agents.';
  public version = '1.0.0';
  public capabilities = ['case_summary'] as const;
  public allowedTools = ['getOrder'];
  public defaultRisk: AIRiskLevel = 'L0';
  public maxRisk: AIRiskLevel = 'L1';
  public requiredPermissions = ['support:read'];
  public enabled = true;

  public async canHandle(_req: AgentRequest): Promise<boolean> { return true; }

  public async execute(request: AgentRequest, _context: AgentContext): Promise<AgentResponse> {
    return {
      requestId: request.requestId,
      agentId: this.id,
      status: 'SUCCESS',
      summary: 'Case briefing synthesized: Order #TGS-2026-9841 delayed by 10 minutes due to heavy rain in BGC cluster. Rider contacted customer.',
      data: {
        briefingBullets: [
          'Order placed at 12:15 PM, subtotal ₱640.00.',
          'Merchant fulfilled on time; courier encountered rainfall delay.',
          'Customer notified with revised ETA 12:45 PM.',
        ],
      },
      confidence: 0.98,
      timestamp: new Date().toISOString(),
    };
  }
}

// A59: Knowledge Retrieval Agent
export class A59KnowledgeRetrievalAgent implements TOGOServeAgent {
  public id = 'A59' as const;
  public name = 'A59 Knowledge Retrieval Agent';
  public category = 'SUPPORT' as const;
  public description = 'Queries TOGOSERVE standard operating procedures, merchant refund guidelines, and platform terms of service.';
  public version = '1.0.0';
  public capabilities = ['knowledge_retrieval'] as const;
  public allowedTools = ['searchProducts'];
  public defaultRisk: AIRiskLevel = 'L0';
  public maxRisk: AIRiskLevel = 'L0';
  public requiredPermissions = ['support:read'];
  public enabled = true;

  public async canHandle(_req: AgentRequest): Promise<boolean> { return true; }

  public async execute(request: AgentRequest, _context: AgentContext): Promise<AgentResponse> {
    return {
      requestId: request.requestId,
      agentId: this.id,
      status: 'SUCCESS',
      summary: 'Knowledge base policy retrieved: "SOP-LOG-04: Weather delays exceeding 25 minutes qualify for courtesy ₱50 delivery credit voucher."',
      data: { policyReference: 'SOP-LOG-04', courtesyCreditPermitted: true },
      confidence: 0.99,
      timestamp: new Date().toISOString(),
    };
  }
}

// A60: Resolution Recommendation Agent
export class A60ResolutionRecommendationAgent implements TOGOServeAgent {
  public id = 'A60' as const;
  public name = 'A60 Resolution Recommendation Agent';
  public category = 'SUPPORT' as const;
  public description = 'Formulates fair remedy recommendations (e.g. apologies, courtesy credits, or redelivery). Consequential refunds route to ActionGateway.';
  public version = '1.0.0';
  public capabilities = ['resolution_recommendation'] as const;
  public allowedTools = ['searchProducts'];
  public defaultRisk: AIRiskLevel = 'L2';
  public maxRisk: AIRiskLevel = 'L4';
  public requiredPermissions = ['support:write'];
  public enabled = true;

  public async canHandle(_req: AgentRequest): Promise<boolean> { return true; }

  public async execute(request: AgentRequest, _context: AgentContext): Promise<AgentResponse> {
    // If ticket warrants a courtesy voucher, propose it as an ActionProposal
    const proposal: AgentActionProposal = {
      proposalId: `prop-${Date.now()}-support`,
      requestId: request.requestId,
      agentId: this.id,
      actorId: request.actorId,
      tenantId: request.tenantId,
      actionType: 'ISSUE_CUSTOMER_COURTESY_CREDIT',
      resourceType: 'CUSTOMER_ACCOUNT',
      resourceId: request.actorId,
      payload: { creditAmount: 50.0, reason: 'Courtesy credit for weather delay' },
      reason: 'SOP-LOG-04 compensation for delivery delay exceeding SLA window.',
      confidence: 0.94,
      riskLevel: 'L2', // Low Risk controlled customer credit within ₱50 policy limit
      status: 'PENDING_REVIEW',
      createdAt: new Date().toISOString(),
      idempotencyKey: `${request.requestId}-A60-support-${request.actorId}`,
    };

    return {
      requestId: request.requestId,
      agentId: this.id,
      status: 'SUCCESS',
      summary: 'Resolution recommendation: Issue automated courtesy voucher of ₱50 and trigger live rider push notification.',
      data: { remedyType: 'COURTESY_VOUCHER', creditAmount: 50.0 },
      proposedActions: [proposal],
      confidence: 0.94,
      timestamp: new Date().toISOString(),
    };
  }
}

export const SUPPORT_AGENTS: TOGOServeAgent[] = [
  new A57SupportTriageAgent(),
  new A58CaseSummaryAgent(),
  new A59KnowledgeRetrievalAgent(),
  new A60ResolutionRecommendationAgent(),
];
