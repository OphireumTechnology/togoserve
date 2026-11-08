/**
 * Legacy compatibility exports.
 * No simulated customer, merchant, payment or logistics records are supplied in production.
 * Replace consumers with authorized backend API reads before enabling transactions.
 */
import type { ProductItem, Order, PadalaShipment, AIActionProposal, InventoryItem, LedgerEntry, SupplierItem, FleetVehicle } from '../types';

export const INITIAL_PRODUCTS: ProductItem[] = [];
export const INITIAL_ORDERS: Order[] = [];
export const INITIAL_PADALA_SHIPMENTS: PadalaShipment[] = [];
export const INITIAL_AI_PROPOSALS: AIActionProposal[] = [];
export const INITIAL_INVENTORY: InventoryItem[] = [];
export const INITIAL_LEDGER: LedgerEntry[] = [];
export const INITIAL_SUPPLIERS: SupplierItem[] = [];
export const INITIAL_FLEET_VEHICLES: FleetVehicle[] = [];
