/**
 * TOGOSERVE AI CORE - DOMAIN TOOLS
 */

import { AgentTool } from '../core/types';
import { ToolRegistry } from './ToolRegistry';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_INVENTORY, INITIAL_LEDGER } from '../../data/mockData';

// 1. searchProducts
export const searchProductsTool: AgentTool = {
  toolId: 'searchProducts',
  description: 'Search active marketplace catalog items with filters by category, text, or store.',
  readOnly: true,
  requiredPermissions: ['catalog:read', 'customer:read'],
  minimumRisk: 'L0',
  maximumRisk: 'L1',
  requiresHITL: false,
  execute: async (input: { query?: string; category?: string; storeId?: string }) => {
    let results = INITIAL_PRODUCTS;
    if (input.query) {
      const q = input.query.toLowerCase();
      results = results.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (input.category && input.category !== 'All') {
      results = results.filter((p) => p.category === input.category);
    }
    if (input.storeId) {
      results = results.filter((p) => p.storeId === input.storeId);
    }
    return { count: results.length, products: results.slice(0, 10) };
  },
};

// 2. getMerchant
export const getMerchantTool: AgentTool = {
  toolId: 'getMerchant',
  description: 'Retrieve verified merchant store profile, business hours, and operational status.',
  readOnly: true,
  requiredPermissions: ['merchant:read', 'customer:read'],
  minimumRisk: 'L0',
  maximumRisk: 'L0',
  requiresHITL: false,
  execute: async (input: { storeId: string }) => {
    return {
      storeId: input.storeId || 'store-1',
      name: 'Aroma Bakehouse & Roastery',
      rating: 4.9,
      status: 'OPEN',
      address: 'BGC High Street, Taguig City',
      operatingHours: '07:00 - 22:00',
    };
  },
};

// 3. getOrder
export const getOrderTool: AgentTool = {
  toolId: 'getOrder',
  description: 'Retrieve order timeline, items, fulfillment status, and payment summary.',
  readOnly: true,
  requiredPermissions: ['order:read', 'customer:read', 'merchant:read'],
  minimumRisk: 'L0',
  maximumRisk: 'L1',
  requiresHITL: false,
  execute: async (input: { orderNumber?: string; orderId?: string }) => {
    const order = INITIAL_ORDERS.find(
      (o) => o.orderNumber === input.orderNumber || o.id === input.orderId
    ) || INITIAL_ORDERS[0];
    return { order };
  },
};

// 4. getDelivery
export const getDeliveryTool: AgentTool = {
  toolId: 'getDelivery',
  description: 'Fetch telemetry for active delivery trip, courier GPS distance, and estimated arrival.',
  readOnly: true,
  requiredPermissions: ['logistics:read', 'customer:read'],
  minimumRisk: 'L0',
  maximumRisk: 'L1',
  requiresHITL: false,
  execute: async (_input: { orderId?: string; shipmentId?: string }) => {
    return {
      courierName: 'Marcus Ramirez',
      vehicle: 'MOTORCYCLE',
      currentStatus: 'IN_TRANSIT',
      etaMinutes: 14,
      distanceRemainingKm: 2.3,
    };
  },
};

// 5. getInventory
export const getInventoryTool: AgentTool = {
  toolId: 'getInventory',
  description: 'Inspect live stock balances, reorder thresholds, and unit costs for store inventory.',
  readOnly: true,
  requiredPermissions: ['inventory:read', 'merchant:read'],
  minimumRisk: 'L0',
  maximumRisk: 'L1',
  requiresHITL: false,
  execute: async (input: { sku?: string; lowStockOnly?: boolean }) => {
    let items = INITIAL_INVENTORY;
    if (input.lowStockOnly) {
      items = items.filter((i) => i.status === 'LOW_STOCK');
    }
    if (input.sku) {
      items = items.filter((i) => i.sku === input.sku);
    }
    return { totalItems: items.length, inventory: items };
  },
};

// 6. getSettlement
export const getSettlementTool: AgentTool = {
  toolId: 'getSettlement',
  description: 'Examine merchant net payout balance, withholdings, and ledger settlement status.',
  readOnly: true,
  requiredPermissions: ['finance:read'],
  minimumRisk: 'L1',
  maximumRisk: 'L2',
  requiresHITL: false,
  execute: async (_input: { tenantId?: string }) => {
    return {
      pendingSettlementTotal: 18450.0,
      settledThisWeek: 94200.0,
      recentEntries: INITIAL_LEDGER.slice(0, 5),
    };
  },
};

// 7. getPadalaQuote
export const getPadalaQuoteTool: AgentTool = {
  toolId: 'getPadalaQuote',
  description: 'Calculate authoritative TOGO Padala shipping quote based on weight, volume, and vehicle.',
  readOnly: true,
  requiredPermissions: ['logistics:read', 'customer:read'],
  minimumRisk: 'L0',
  maximumRisk: 'L1',
  requiresHITL: false,
  execute: async (input: { weightKg: number; lengthCm: number; widthCm: number; heightCm: number; vehicle: string }) => {
    const volumetricWeight = (input.lengthCm * input.widthCm * input.heightCm) / 5000;
    const billableWeight = Math.max(input.weightKg, volumetricWeight);
    const baseRate = input.vehicle === 'CAR' ? 140 : 60;
    const estimatedDistanceKm = 8.5;
    const perKmRate = input.vehicle === 'CAR' ? 18 : 10;
    const totalQuote = baseRate + (estimatedDistanceKm * perKmRate);

    return {
      billableWeightKg: +billableWeight.toFixed(2),
      quoteAmount: Math.round(totalQuote),
      currency: 'PHP',
      vehicleAssigned: input.vehicle || 'MOTORCYCLE',
    };
  },
};

// 8. getRiderAvailability
export const getRiderAvailabilityTool: AgentTool = {
  toolId: 'getRiderAvailability',
  description: 'Check active fleet rider pool density in target dispatch cluster.',
  readOnly: true,
  requiredPermissions: ['logistics:read', 'dispatch:read'],
  minimumRisk: 'L0',
  maximumRisk: 'L1',
  requiresHITL: false,
  execute: async (input: { zone?: string }) => {
    return {
      zone: input.zone || 'BGC_CENTRAL',
      availableRidersCount: 8,
      avgPickupEtaMin: 5,
    };
  },
};

export function registerDomainTools(): void {
  const registry = ToolRegistry.getInstance();
  const tools = [
    searchProductsTool,
    getMerchantTool,
    getOrderTool,
    getDeliveryTool,
    getInventoryTool,
    getSettlementTool,
    getPadalaQuoteTool,
    getRiderAvailabilityTool,
  ];

  for (const t of tools) {
    if (!registry.has(t.toolId)) {
      registry.register(t);
    }
  }
}
