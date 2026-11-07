/**
 * TOGOSERVE AI RAG KNOWLEDGE BASE
 * In-memory enterprise semantic index for operational policies, SLAs, merchant compliance, and courier guidelines.
 */

export interface KnowledgeDocument {
  id: string;
  title: string;
  category: 'LOGISTICS' | 'MERCHANT' | 'FINANCE' | 'CUSTOMER' | 'GOVERNANCE';
  lastUpdated: string;
  content: string;
  tags: string[];
}

export interface KnowledgeSearchResult {
  document: KnowledgeDocument;
  score: number;
  matchedKeywords: string[];
}

export class KnowledgeService {
  private static instance: KnowledgeService;
  private documents: KnowledgeDocument[] = [
    {
      id: 'DOC-LOG-01',
      title: 'TOGO Padala Courier SLA & Vehicle Specification Card',
      category: 'LOGISTICS',
      lastUpdated: '2026-11-01',
      tags: ['padala', 'courier', 'vehicle', 'dimensions', 'sla', 'express'],
      content: `
TOGO Padala operates nationwide in the Philippines with 3 primary vehicle tiers:
1. Motorcycle (125cc-150cc): Max weight 20kg. Dimensions: 40cm x 40cm x 40cm. Base fare: ₱60 for first 2km + ₱8/km thereafter. Ideal for documents, parcels, food, apparel.
2. Sedan / MPV: Max weight 200kg-300kg. Dimensions: 100cm x 80cm x 80cm. Base fare: ₱150 for first 3km + ₱18/km thereafter. Ideal for multiple boxes, catering, fragile electronics.
3. Light Truck (Closed Van): Max weight 1,000kg. Dimensions: 200cm x 150cm x 150cm. Base fare: ₱500 for first 5km + ₱35/km thereafter.
SLA commitments: NCR Express pickup within 15 minutes of rider acceptance. Standard intracity dropoff within 45-60 minutes.
Weather Contingency: In heavy rainfall (PAGASA Signal 1), an automated 1.2x surge cap applies, and speed safety limits reduce max ETA by +15 minutes.
      `.trim()
    },
    {
      id: 'DOC-MERCH-02',
      title: 'Merchant Onboarding, Catalog Compliance & T+1 Settlement Policy',
      category: 'MERCHANT',
      lastUpdated: '2026-10-28',
      tags: ['merchant', 'settlement', 'payout', 'commission', 'catalog'],
      content: `
1. Commission Rates: TOGOSERVE standard platform fee is 2.5% for general commerce and 5.0% for managed food delivery.
2. Settlement Schedule: Automated T+1 bank transfer or digital wallet (Maya/GCash) payout daily at 10:00 AM PHT for all transactions completed prior to 23:59 PHT on the preceding day.
3. Catalog Standards: High-resolution product images (min 800x800px) on clean neutral background. Mandatory allergen and nutritional labeling for Food & Beverage categories.
4. Stock Discrepancies: If an item is ordered but out of stock, merchant has 3 minutes to suggest an AI-verified substitute or full automated refund is initiated.
      `.trim()
    },
    {
      id: 'DOC-PADALA-03',
      title: 'TOGO Express & Padala Prohibited Items List',
      category: 'LOGISTICS',
      lastUpdated: '2026-11-04',
      tags: ['padala', 'prohibited', 'safety', 'compliance', 'dangerous goods'],
      content: `
The following items are strictly prohibited from shipment via TOGO Padala:
1. Hazardous materials, flammable chemicals, fireworks, toxic substances, and explosives.
2. Unregistered firearms, ammunition, bladed weapons, and military equipment.
3. Currency, bullion, negotiable checks, and precious jewelry exceeding ₱10,000 without declared high-value transit insurance.
4. Illicit narcotics, prescription drugs without accompanying doctor prescription and BIR invoice.
5. Live animals or improperly packaged raw meat lacking cold-chain certification.
Violation Protocol: Package will be quarantined at nearest regional hub, local authorities notified, and sender account permanently suspended.
      `.trim()
    },
    {
      id: 'DOC-FIN-04',
      title: 'Financial Reconciliation, Dispute Resolution & COD Handover Protocols',
      category: 'FINANCE',
      lastUpdated: '2026-11-05',
      tags: ['finance', 'reconciliation', 'cod', 'dispute', 'refund'],
      content: `
1. Cash-on-Delivery (COD) Reconciliation: Riders must remit accumulated daily cash collections into the TOGOSERVE automated escrow account via 7-Eleven / GCash / Maya within 12 hours of shift completion.
2. Variance Thresholds: Daily variance > ₱50.00 triggers an automated audit flag (A41/A43) requiring supervisor review.
3. Customer Refund Windows: Order cancellation with 100% refund is permitted within 2 minutes of placement or before restaurant preparation commences. Damaged goods claims require photo verification within 24 hours of delivery.
4. Maker-Checker Approvals: Any manual balance adjustment exceeding ₱1,000 PHP requires L3/L4 dual authorization by Finance Manager.
      `.trim()
    },
    {
      id: 'DOC-GOV-05',
      title: 'AI Multi-Agent Governance & Maker-Checker Risk Tiering (L0-L5)',
      category: 'GOVERNANCE',
      lastUpdated: '2026-11-06',
      tags: ['governance', 'risk', 'maker-checker', 'security', 'approval', 'hitl'],
      content: `
Risk classification across the TOGOSERVE 60-agent workforce:
- L0 (Informational / Read-Only): Product search, FAQ answers, delivery status readouts. Autonomous execution allowed.
- L1 (Low Risk Recommendations): Suggested reorder quantities, personalized shopping picks. Autonomous execution allowed.
- L2 (Moderate Contextual Changes): Draft campaign text, non-binding merchant tips. Autonomous execution allowed.
- L3 (Financial & Resource Decisions): Price adjustments > 5%, refund approval < ₱2,500, delivery route reassignment. Requires 1 human approval.
- L4 (High Consequence Mutations): Batch merchant payouts, large refunds > ₱2,500, rider disciplinary flag. Requires 2 human approvals (Maker-Checker).
- L5 (Critical Infrastructure Operations): Schema updates, emergency stop toggle, permission grant escalation. System Administrator and Senior Executive dual keys required.
      `.trim()
    }
  ];

  private constructor() {}

  public static getInstance(): KnowledgeService {
    if (!KnowledgeService.instance) {
      KnowledgeService.instance = new KnowledgeService();
    }
    return KnowledgeService.instance;
  }

  public listDocuments(): KnowledgeDocument[] {
    return [...this.documents];
  }

  public getDocument(id: string): KnowledgeDocument | undefined {
    return this.documents.find((d) => d.id === id);
  }

  public search(query: string, maxResults: number = 3): KnowledgeSearchResult[] {
    if (!query || query.trim().length === 0) {
      return this.documents.slice(0, maxResults).map((doc) => ({
        document: doc,
        score: 1.0,
        matchedKeywords: []
      }));
    }

    const queryTokens = query
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((t) => t.length > 2);

    const scored = this.documents.map((doc) => {
      let score = 0;
      const matchedKeywords: string[] = [];
      const titleLower = doc.title.toLowerCase();
      const contentLower = doc.content.toLowerCase();
      const tagsLower = doc.tags.map((t) => t.toLowerCase());

      for (const token of queryTokens) {
        if (titleLower.includes(token)) {
          score += 5;
          matchedKeywords.push(token);
        }
        if (tagsLower.some((tag) => tag.includes(token))) {
          score += 4;
          if (!matchedKeywords.includes(token)) matchedKeywords.push(token);
        }
        if (contentLower.includes(token)) {
          score += 1;
          if (!matchedKeywords.includes(token)) matchedKeywords.push(token);
        }
      }

      return {
        document: doc,
        score,
        matchedKeywords
      };
    });

    return scored
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults);
  }
}
