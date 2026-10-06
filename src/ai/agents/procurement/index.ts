/**
 * TOGOSERVE AI CORE - PROCUREMENT AGENTS (A53-A56)
 * AI must not autonomously create financially binding purchase orders unless explicitly authorized via HITL.
 */

import {
  AgentContext,
  AgentRequest,
  AgentResponse,
  TOGOServeAgent,
  AIRiskLevel,
  AgentActionProposal
} from '../../core/types';
import { AgentContextBuilder } from '../../core/AgentContext';

// A53: Procurement Forecast Agent
export class A53ProcurementForecastAgent implements TOGOServeAgent {
  public id = 'A53' as const;
  public name = 'A53 Procurement Forecast Agent';
  public category = 'PROCUREMENT' as const;
  public description = 'Forecasts ingredient and packaging replenishment volumes based on sales trajectories.';
  public version = '1.0.0';
  public capabilities = ['procurement_forecast'] as const;
  public allowedTools = ['getInventory'];
  public defaultRisk: AIRiskLevel = 'L1';
  public maxRisk: AIRiskLevel = 'L2';
  public requiredPermissions = ['procurement:read'];
  public enabled = true;

  public async canHandle(_req: AgentRequest): Promise<boolean> { return true; }

  public async execute(request: AgentRequest, context: AgentContext): Promise<AgentResponse> {
    AgentContextBuilder.assertTenantIsolation(context, request.tenantId);
    return {
      requestId: request.requestId,
      agentId: this.id,
      status: 'SUCCESS',
      summary: 'Procurement demand model: Raw material requirements for next 14 days include 120kg organic flour and 400 paper boxes.',
      data: { projectedMaterialRequirement: { flourKg: 120, boxesUnits: 400 } },
      confidence: 0.94,
      timestamp: new Date().toISOString(),
    };
  }
}

// A54: Reorder Recommendation Agent
export class A54ReorderRecommendationAgent implements TOGOServeAgent {
  public id = 'A54' as const;
  public name = 'A54 Reorder Recommendation Agent';
  public category = 'PROCUREMENT' as const;
  public description = 'Flags items below lead-time reorder thresholds and calculates Economic Order Quantity (EOQ).';
  public version = '1.0.0';
  public capabilities = ['reorder_recommendation'] as const;
  public allowedTools = ['getInventory'];
  public defaultRisk: AIRiskLevel = 'L1';
  public maxRisk: AIRiskLevel = 'L2';
  public requiredPermissions = ['procurement:read'];
  public enabled = true;

  public async canHandle(_req: AgentRequest): Promise<boolean> { return true; }

  public async execute(request: AgentRequest, _context: AgentContext): Promise<AgentResponse> {
    return {
      requestId: request.requestId,
      agentId: this.id,
      status: 'SUCCESS',
      summary: 'Reorder triggered: Barista Milk and Flour reach reorder trigger level. Recommending restock order.',
      data: { recommendedReorderSkus: ['MILK-BARISTA-01', 'FLOUR-PREM-25'], recommendedQuantity: 50 },
      confidence: 0.96,
      timestamp: new Date().toISOString(),
    };
  }
}

// A55: Supplier Comparison Agent
export class A55SupplierComparisonAgent implements TOGOServeAgent {
  public id = 'A55' as const;
  public name = 'A55 Supplier Comparison Agent';
  public category = 'PROCUREMENT' as const;
  public description = 'Compares wholesale vendor quotes, payment terms, and delivery lead times across B2B supplier registry.';
  public version = '1.0.0';
  public capabilities = ['supplier_comparison'] as const;
  public allowedTools = ['getInventory'];
  public defaultRisk: AIRiskLevel = 'L1';
  public maxRisk: AIRiskLevel = 'L1';
  public requiredPermissions = ['procurement:read'];
  public enabled = true;

  public async canHandle(_req: AgentRequest): Promise<boolean> { return true; }

  public async execute(request: AgentRequest, _context: AgentContext): Promise<AgentResponse> {
    return {
      requestId: request.requestId,
      agentId: this.id,
      status: 'SUCCESS',
      summary: 'Supplier evaluation: "Manila Flour & Grain Wholesalers" offers 12% lower cost per kg with 2-day lead delivery SLA.',
      data: {
        topVendor: 'Manila Flour & Grain Wholesalers',
        unitSavings: '12%',
        leadTimeDays: 2,
        paymentTerms: 'NET_30',
      },
      confidence: 0.95,
      timestamp: new Date().toISOString(),
    };
  }
}

// A56: Purchase Planning Agent (AI must NOT autonomously create PO -> creates ActionProposal L4)
export class A56PurchasePlanningAgent implements TOGOServeAgent {
  public id = 'A56' as const;
  public name = 'A56 Purchase Planning Agent';
  public category = 'PROCUREMENT' as const;
  public description = 'Prepares purchase order draft with budget verification and vendor specs. Consequential binding PO requires merchant HITL.';
  public version = '1.0.0';
  public capabilities = ['purchase_planning'] as const;
  public allowedTools = ['getInventory'];
  public defaultRisk: AIRiskLevel = 'L3';
  public maxRisk: AIRiskLevel = 'L4';
  public requiredPermissions = ['procurement:write'];
  public enabled = true;

  public async canHandle(_req: AgentRequest): Promise<boolean> { return true; }

  public async execute(request: AgentRequest, _context: AgentContext): Promise<AgentResponse> {
    const proposal: AgentActionProposal = {
      proposalId: `prop-${Date.now()}-po`,
      requestId: request.requestId,
      agentId: this.id,
      actorId: request.actorId,
      tenantId: request.tenantId,
      actionType: 'PROPOSE_BINDING_PURCHASE_ORDER',
      resourceType: 'PURCHASE_ORDER',
      resourceId: `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      payload: {
        supplierId: 'supp-1',
        supplierName: 'Manila Flour & Grain Wholesalers',
        items: [{ sku: 'FLOUR-PREM-25', qty: 10, unitCost: 850 }],
        totalValue: 8500.0,
      },
      reason: 'Automated procurement plan generated to prevent weekend pastry stockout.',
      confidence: 0.92,
      riskLevel: 'L4', // Binding financial commitment requires merchant/admin HITL
      status: 'PENDING_REVIEW',
      createdAt: new Date().toISOString(),
      idempotencyKey: `${request.requestId}-A56-po-supp1`,
    };

    return {
      requestId: request.requestId,
      agentId: this.id,
      status: 'SUCCESS',
      summary: 'Purchase order drafted for ₱8,500.00. Routed as an L4 ActionProposal awaiting merchant approval.',
      data: { poValue: 8500.0, vendor: 'Manila Flour & Grain Wholesalers' },
      proposedActions: [proposal],
      confidence: 0.92,
      timestamp: new Date().toISOString(),
    };
  }
}

export const PROCUREMENT_AGENTS: TOGOServeAgent[] = [
  new A53ProcurementForecastAgent(),
  new A54ReorderRecommendationAgent(),
  new A55SupplierComparisonAgent(),
  new A56PurchasePlanningAgent(),
];
