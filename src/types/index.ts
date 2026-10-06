export type UserRole =
  | 'CUSTOMER'
  | 'MERCHANT_OWNER'
  | 'MERCHANT_STAFF'
  | 'RIDER'
  | 'DISPATCHER'
  | 'FINANCE'
  | 'SUPPORT'
  | 'ADMIN'
  | 'SUPER_ADMIN';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  provider: 'google' | 'email' | 'enterprise';
  verified: boolean;
  storeId?: string;
  riderVehicle?: string;
}

export type OrderStatus =
  | 'CREATED'
  | 'PAYMENT_PENDING'
  | 'CONFIRMED'
  | 'MERCHANT_ACCEPTED'
  | 'PREPARING'
  | 'READY_FOR_PICKUP'
  | 'RIDER_ASSIGNED'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'ARRIVED'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'DISPUTED';

export interface ProductItem {
  id: string;
  name: string;
  storeId: string;
  storeName: string;
  category: string;
  price: number;
  originalPrice?: number;
  stock: number;
  sku: string;
  image: string;
  description: string;
  popular?: boolean;
  rating: number;
  reviewsCount: number;
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  storeId: string;
  storeName: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  platformFee: number;
  discount: number;
  total: number;
  paymentMethod: 'CARD' | 'E_WALLET' | 'COD' | 'TOGO_PAY';
  paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED';
  status: OrderStatus;
  createdAt: string;
  estimatedDeliveryMin: number;
  riderName?: string;
  riderPhone?: string;
  trackingStep: number;
}

export type VehicleType = 'MOTORCYCLE' | 'CAR' | 'MPV' | 'VAN' | 'PICKUP' | 'TRUCK';

export interface PadalaShipment {
  id: string;
  trackingNumber: string;
  senderName: string;
  senderPhone: string;
  pickupAddress: string;
  recipientName: string;
  recipientPhone: string;
  dropoffAddress: string;
  packageType: 'DOCUMENTS' | 'FOOD_PARCEL' | 'ELECTRONICS' | 'CLOTHING' | 'FRAGILE' | 'HEAVY_CARGO';
  weightKg: number;
  dimensionsCm: { length: number; width: number; height: number };
  vehicle: VehicleType;
  quoteAmount: number;
  distanceKm: number;
  serviceType: 'EXPRESS' | 'SAME_DAY' | 'SCHEDULED';
  status: 'QUOTE' | 'BOOKED' | 'DISPATCHED' | 'PICKED_UP' | 'IN_TRANSIT' | 'ARRIVED' | 'DELIVERED';
  createdAt: string;
  riderName?: string;
  riderPhone?: string;
  otpCode?: string;
  podSignedBy?: string;
}

export type AIRiskLevel = 'L0' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5';

export interface AIActionProposal {
  id: string;
  agentId: string;
  agentName: string;
  agentCategory: 'COMMERCE' | 'LOGISTICS' | 'FINANCE' | 'SUPPORT' | 'GOVERNANCE';
  actionType: string;
  riskLevel: AIRiskLevel;
  confidenceScore: number;
  targetEntity: string;
  description: string;
  proposedChanges: Record<string, any>;
  impactAnalysis: string;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'MODIFIED' | 'AUTO_EXECUTED';
  timestamp: string;
  reviewerId?: string;
  reviewComment?: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  category: string;
  stockLevel: number;
  minThreshold: number;
  unitCost: number;
  retailPrice: number;
  supplier: string;
  lastRestocked: string;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
}

export interface LedgerEntry {
  id: string;
  timestamp: string;
  orderNumber: string;
  grossAmount: number;
  merchantPayable: number;
  platformFee: number;
  deliveryFee: number;
  riderEarnings: number;
  status: 'SETTLED' | 'PENDING' | 'HOLD';
}

export interface CloudSyncState {
  status: 'idle' | 'syncing' | 'synced' | 'error';
  lastSyncedAt: string;
  pendingChangesCount: number;
}

export interface SupplierItem {
  id: string;
  name: string;
  category: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  rating: number;
  activePurchaseOrders: number;
  deliveryLeadDays: number;
  minimumOrderValue: number;
  verified: boolean;
}

export interface FleetVehicle {
  id: string;
  plateNumber: string;
  vehicleType: VehicleType;
  model: string;
  driverName: string;
  driverPhone: string;
  status: 'ACTIVE' | 'MAINTENANCE' | 'DISPATCHED' | 'STANDBY';
  capacityKg: number;
  currentZone: string;
  lastInspection: string;
  todayDeliveries: number;
}

