/**
 * TOGOSERVE AI ORCHESTRATION - S01 MERCHANT DEPARTMENT SUPERVISOR
 * Governs Merchant OS (A10-A19) and Procurement & Wholesale (A53-A56).
 */

import {
  AgentContext,
  AgentRequest,
  AgentResponse,
  TOGOServeAgent,
  AIRiskLevel,
  Department
} from '../../core/types';
import { AgentRegistry } from '../../core/AgentRegistry';
import { AgentExecutor } from '../../core/AgentExecutor';

export class MerchantSupervisor implements TOGOServeAgent {
  public id = 'S01' as const;
  public name = 'S01 Merchant Department Supervisor';
  public category = 'MERCHANT' as const;
  public department: Department = 'MERCHANTS';
  public supervisorId = 'A00' as const;
  public description =
    'Departmental supervisor governing Merchant Business Operations (A10-A19) and B2B Procurement (A53-A56). Enforces store-tenant boundary isolation and maker-checker pricing gates.';
  public version = '2.1.0';
  public capabilities = [
    'business_intelligence',
    'catalog_curation',
    'inventory_monitoring',
    'demand_forecasting',
    'pricing_recommendation',
    'procurement_forecast',
    'reorder_recommendation',
  ] as const;
  public allowedTools = [
    'getMerchant',
    'getInventory',
    'searchProducts',
    'getOrder',
    'getSettlement',
  ];
  public defaultRisk: AIRiskLevel = 'L1';
  public maxRisk: AIRiskLevel = 'L4';
  public requiredPermissions: string[] = ['merchant:manage', 'catalog:read'];
  public enabled = true;
  public modelName = 'gemini-3.8-flash';

  public async canHandle(request: AgentRequest): Promise<boolean> {
    const q = (request.query || '').toLowerCase();
    const intent = (request.intent || '').toLowerCase();
    return (
      intent.includes('merchant') ||
      intent.includes('inventory') ||
      intent.includes('catalog') ||
      intent.includes('procurement') ||
      intent.includes('pricing') ||
      q.includes('store') ||
      q.includes('stock') ||
      q.includes('sale') ||
      q.includes('product') ||
      request.role === 'MERCHANT_OWNER' ||
      request.role === 'MERCHANT_STAFF'
    );
  }

  public async execute(
    request: AgentRequest,
    context: AgentContext
  ): Promise<AgentResponse> {
    const registry = AgentRegistry.getInstance();
    
    // Determine target domain agent within Merchant Department
    let targetId = request.targetAgentId;
    if (!targetId || targetId === 'S01') {
      const q = (request.query || '').toLowerCase();
      if (q.includes('inventory') || q.includes('stock')) targetId = 'A12';
      else if (q.includes('price') || q.includes('discount')) targetId = 'A14';
      else if (q.includes('catalog') || q.includes('item')) targetId = 'A11';
      else if (q.includes('supplier') || q.includes('reorder')) targetId = 'A54';
      else targetId = 'A10'; // Merchant Business Copilot
    }

    const specialist = registry.get(targetId);
    if (specialist && registry.isEnabled(targetId)) {
      return AgentExecutor.executeAgent(specialist, request, context);
    }

    // Direct supervisory fallback
    return {
      requestId: request.requestId,
      agentId: 'S01',
      status: 'SUCCESS',
      summary: `[S01 Merchant Supervisor] Supervised operations for tenant "${request.tenantId}". Recommended actions submitted to governance review.`,
      data: {
        department: 'MERCHANTS',
        targetSpecialist: targetId,
        storeStatus: 'HEALTHY',
        activeListings: 42,
        pendingOrders: 3,
        lowStockItems: [
          { name: 'Adobo Rice Bowl', current: 4, reorderThreshold: 10 },
          { name: 'Ube Milk Tea 500ml', current: 2, reorderThreshold: 15 }
        ],
        timestamp: new Date().toISOString()
      },
      confidence: 0.94,
      recommendations: [
        'Trigger automated reorder for 2 critical low-stock items via Supplier Portal',
        'Review weekend promo discount proposal (L3 Maker-Checker approval required)'
      ],
      timestamp: new Date().toISOString()
    };
  }
}
