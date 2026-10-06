/**
 * TOGOSERVE AI CORE - TYPE CONTRACTS
 * Strongly typed definitions for A00-A60 Multi-Agent Platform.
 */

import { UserRole } from '../../types';
export type { UserRole };

export type AgentId =
  | 'A00'
  | `A0${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`
  | `A${1 | 2 | 3 | 4 | 5}${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`
  | 'A60'
  | (string & {}); // Extensible for future namespaces (TRUST, SECURITY, etc.)

export type AgentCategory =
  | 'ORCHESTRATION'
  | 'CUSTOMER'
  | 'MERCHANT'
  | 'COMMERCE'
  | 'LOGISTICS'
  | 'RIDER'
  | 'FINANCE'
  | 'MARKETING'
  | 'PROCUREMENT'
  | 'SUPPORT'
  | 'TRUST'
  | 'SECURITY'
  | 'AUDIT'
  | 'GOVERNANCE'
  | 'PLATFORM';

export type AIRiskLevel = 'L0' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5';

export type AgentCapability =
  | 'product_discovery'
  | 'merchant_discovery'
  | 'category_navigation'
  | 'shopping_guidance'
  | 'semantic_search'
  | 'query_understanding'
  | 'filters_ranking'
  | 'product_recommendations'
  | 'reorder_suggestions'
  | 'personalization'
  | 'cart_explanation'
  | 'cart_availability'
  | 'substitution_suggestions'
  | 'order_status'
  | 'order_explanation'
  | 'delivery_tracking'
  | 'delivery_triage'
  | 'shipment_guidance'
  | 'package_requirements'
  | 'vehicle_recommendations'
  | 'padala_quotes'
  | 'loyalty_points'
  | 'promotions_inquiry'
  | 'support_triage'
  | 'faq_guidance'
  | 'case_creation'
  | 'business_intelligence'
  | 'catalog_curation'
  | 'inventory_monitoring'
  | 'demand_forecasting'
  | 'pricing_recommendation'
  | 'campaign_suggestions'
  | 'sales_analytics'
  | 'customer_insights'
  | 'fulfillment_analysis'
  | 'merchant_growth'
  | 'search_ranking'
  | 'product_classification'
  | 'duplicate_detection'
  | 'catalog_quality'
  | 'content_moderation'
  | 'availability_tracking'
  | 'promotion_eligibility'
  | 'dispatch_optimization'
  | 'route_recommendation'
  | 'eta_prediction'
  | 'vehicle_matching'
  | 'delivery_batching'
  | 'fleet_optimization'
  | 'logistics_demand_forecasting'
  | 'delivery_anomaly'
  | 'padala_logistics'
  | 'zone_intelligence'
  | 'rider_assistance'
  | 'rider_earnings'
  | 'rider_performance'
  | 'payment_monitoring'
  | 'reconciliation'
  | 'settlement_analysis'
  | 'cod_reconciliation'
  | 'revenue_forecast'
  | 'commission_analysis'
  | 'financial_anomaly'
  | 'customer_segmentation'
  | 'campaign_recommendation'
  | 'marketing_content'
  | 'loyalty_optimization'
  | 'retention_modeling'
  | 'ad_optimization'
  | 'procurement_forecast'
  | 'reorder_recommendation'
  | 'supplier_comparison'
  | 'purchase_planning'
  | 'case_summary'
  | 'knowledge_retrieval'
  | 'resolution_recommendation'
  | 'orchestration'
  | 'multi_agent_planning';

export interface AgentRequest {
  requestId: string;
  sessionId?: string;
  actorId: string;
  role: UserRole;
  tenantId: string; // e.g. store-1, global, customer-id
  permissions: string[];
  query: string;
  intent?: string;
  targetAgentId?: AgentId;
  parameters?: Record<string, any>;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface AgentResponse {
  requestId: string;
  agentId: AgentId;
  status: 'SUCCESS' | 'PARTIAL' | 'BLOCKED' | 'ERROR' | 'FALLBACK';
  summary: string;
  data: Record<string, any>;
  recommendations?: string[];
  proposedActions?: AgentActionProposal[];
  confidence: number;
  warnings?: string[];
  citations?: string[];
  executionTimeMs?: number;
  timestamp: string;
}

export interface AgentDecision {
  decisionId: string;
  requestId: string;
  agentId: AgentId;
  decisionType: string;
  summary: string;
  confidence: number;
  riskLevel: AIRiskLevel;
  timestamp: string;
}

export interface AgentActionProposal {
  proposalId: string;
  requestId: string;
  agentId: AgentId;
  actorId: string;
  tenantId: string;
  actionType: string;
  resourceType: string;
  resourceId: string;
  payload: Record<string, any>;
  reason: string;
  confidence: number;
  riskLevel: AIRiskLevel;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'MODIFIED' | 'AUTO_EXECUTED';
  createdAt: string;
  reviewerId?: string;
  reviewComment?: string;
  idempotencyKey?: string;
}

export interface ActionDecision {
  allowed: boolean;
  actionType: string;
  riskLevel: AIRiskLevel;
  requiresHITL: boolean;
  reasons: string[];
  idempotencyKey: string;
  requiredRole?: UserRole[];
}

export interface HITLRequest {
  reviewId: string;
  proposalId: string;
  risk: AIRiskLevel;
  reason: string;
  requestedBy: string;
  requiredRole: UserRole[];
  status: 'PENDING' | 'APPROVED' | 'MODIFIED' | 'REJECTED' | 'EXPIRED';
  reviewerId?: string;
  decision?: 'APPROVED' | 'MODIFIED' | 'REJECTED';
  reviewNotes?: string;
  modifiedPayload?: Record<string, any>;
  createdAt: string;
  reviewedAt?: string;
}

export interface HITLDecision {
  reviewId: string;
  proposalId: string;
  reviewerId: string;
  reviewerRole: UserRole;
  decision: 'APPROVED' | 'MODIFIED' | 'REJECTED';
  notes: string;
  modifiedPayload?: Record<string, any>;
  timestamp: string;
}

export interface AgentTool<TInput = any, TOutput = any> {
  toolId: string;
  description: string;
  readOnly: boolean;
  requiredPermissions: string[];
  minimumRisk: AIRiskLevel;
  maximumRisk: AIRiskLevel;
  requiresHITL: boolean;
  inputSchema?: Record<string, any>;
  outputSchema?: Record<string, any>;
  execute: (input: TInput, context: AgentContext) => Promise<TOutput>;
}

export interface AgentToolCall {
  callId: string;
  toolId: string;
  input: Record<string, any>;
  output?: Record<string, any>;
  status: 'SUCCESS' | 'FAILURE' | 'BLOCKED';
  durationMs: number;
  error?: string;
}

export interface AuditEvent {
  id: string;
  requestId: string;
  actorId: string;
  tenantId: string;
  agentId?: AgentId;
  eventType: string;
  resourceType: string;
  resourceId: string;
  riskLevel?: AIRiskLevel;
  policyResult?: string;
  hitlResult?: string;
  metadata: Record<string, any>;
  timestamp: string;
}

export interface AgentContext {
  requestId: string;
  sessionId?: string;
  actorId: string;
  role: UserRole;
  tenantId: string;
  permissions: string[];
  businessContext?: Record<string, any>;
  allowedTools: string[];
  emitEvent?: (eventName: string, payload: any) => void;
  recordAudit?: (event: Omit<AuditEvent, 'id' | 'timestamp'>) => void;
  invokeTool?: <T = any>(toolId: string, input: any) => Promise<T>;
}

export interface TOGOServeAgent {
  id: AgentId;
  name: string;
  category: AgentCategory;
  description: string;
  version: string;
  capabilities: readonly AgentCapability[] | AgentCapability[];
  allowedTools: string[];
  defaultRisk: AIRiskLevel;
  maxRisk: AIRiskLevel;
  requiredPermissions: string[];
  enabled: boolean;

  canHandle(request: AgentRequest): Promise<boolean>;
  execute(request: AgentRequest, context: AgentContext): Promise<AgentResponse>;
}

export interface AgentRegistrationMetadata {
  id: AgentId;
  name: string;
  category: AgentCategory;
  description: string;
  version: string;
  capabilities: readonly AgentCapability[] | AgentCapability[];
  allowedTools: string[];
  defaultRisk: AIRiskLevel;
  maxRisk: AIRiskLevel;
  requiredPermissions: string[];
  enabled: boolean;
  lastRun?: string;
  successCount: number;
  failureCount: number;
  averageLatencyMs: number;
}
