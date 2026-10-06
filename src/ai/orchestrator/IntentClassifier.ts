/**
 * TOGOSERVE AI CORE - INTENT CLASSIFIER
 */

import { AgentRequest } from '../core/types';

export interface ClassifiedIntent {
  domain:
    | 'CUSTOMER'
    | 'MERCHANT'
    | 'COMMERCE'
    | 'LOGISTICS'
    | 'RIDER'
    | 'FINANCE'
    | 'MARKETING'
    | 'PROCUREMENT'
    | 'SUPPORT'
    | 'GENERAL';
  intent: string;
  confidence: number;
  extractedEntities: Record<string, any>;
}

export class IntentClassifier {
  public static classify(request: AgentRequest): ClassifiedIntent {
    const q = (request.query || '').toLowerCase();

    // 1. Logistics / Padala
    if (q.includes('padala') || q.includes('package') || q.includes('parcel') || q.includes('shipment')) {
      return {
        domain: 'LOGISTICS',
        intent: 'PADALA_SHIPMENT_GUIDANCE',
        confidence: 0.95,
        extractedEntities: { isPadala: true },
      };
    }
    if (q.includes('dispatch') || q.includes('route') || q.includes('eta') || q.includes('delivery batch')) {
      return {
        domain: 'LOGISTICS',
        intent: 'LOGISTICS_DISPATCH_OPTIMIZATION',
        confidence: 0.92,
        extractedEntities: {},
      };
    }

    // 2. Rider
    if (q.includes('rider') || q.includes('earnings') || q.includes('e-pod') || q.includes('pickup trip')) {
      return {
        domain: 'RIDER',
        intent: 'RIDER_WORKFLOW_ASSIST',
        confidence: 0.93,
        extractedEntities: {},
      };
    }

    // 3. Finance
    if (q.includes('settlement') || q.includes('reconcil') || q.includes('payout') || q.includes('refund') || q.includes('ledger') || q.includes('commission')) {
      return {
        domain: 'FINANCE',
        intent: 'FINANCIAL_RECONCILIATION',
        confidence: 0.96,
        extractedEntities: {},
      };
    }

    // 4. Procurement
    if (q.includes('supplier') || q.includes('purchase order') || q.includes('reorder') || q.includes('wholesale')) {
      return {
        domain: 'PROCUREMENT',
        intent: 'PROCUREMENT_REORDER_PLAN',
        confidence: 0.94,
        extractedEntities: {},
      };
    }

    // 5. Merchant & Commerce
    if (q.includes('inventory') || q.includes('stock') || q.includes('restock')) {
      return {
        domain: 'MERCHANT',
        intent: 'INVENTORY_MANAGEMENT',
        confidence: 0.92,
        extractedEntities: {},
      };
    }
    if (q.includes('pricing') || q.includes('discount') || q.includes('margin') || q.includes('catalog')) {
      return {
        domain: 'MERCHANT',
        intent: 'MERCHANT_CATALOG_PRICING',
        confidence: 0.91,
        extractedEntities: {},
      };
    }

    // 6. Support
    if (q.includes('help') || q.includes('issue') || q.includes('complaint') || q.includes('support') || q.includes('ticket')) {
      return {
        domain: 'SUPPORT',
        intent: 'CUSTOMER_SUPPORT_TRIAGE',
        confidence: 0.94,
        extractedEntities: {},
      };
    }

    // 7. Customer Shopping & Cart
    if (q.includes('food') || q.includes('buy') || q.includes('order') || q.includes('cart') || q.includes('recommend') || q.includes('search')) {
      return {
        domain: 'CUSTOMER',
        intent: 'CUSTOMER_SHOPPING_SEARCH',
        confidence: 0.9,
        extractedEntities: {},
      };
    }

    return {
      domain: 'GENERAL',
      intent: 'GENERAL_INQUIRY',
      confidence: 0.8,
      extractedEntities: {},
    };
  }
}
