import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  UserProfile,
  UserRole,
  ProductItem,
  CartItem,
  Order,
  PadalaShipment,
  AIActionProposal,
  InventoryItem,
  LedgerEntry,
  SupplierItem,
  FleetVehicle,
  CloudSyncState,
  OrderStatus,
  EnterpriseSession,
  EnterpriseLoginResponse
} from '../types';
import { AccessControlService } from '../auth/AccessControlService';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_PADALA_SHIPMENTS,
  INITIAL_AI_PROPOSALS,
  INITIAL_INVENTORY,
  INITIAL_LEDGER,
  INITIAL_SUPPLIERS,
  INITIAL_FLEET_VEHICLES
} from '../data/mockData';

export type ActivePortal =
  | 'landing'
  | 'marketplace'
  | 'customer'
  | 'padala'
  | 'merchant'
  | 'pos'
  | 'rider'
  | 'supplier'
  | 'fleet'
  | 'ai-center'
  | 'admin'
  | 'analytics';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface AppContextType {
  // Theme & Accessibility
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isHighContrast: boolean;
  toggleHighContrast: () => void;

  // View Navigation & Production Routes
  activePortal: ActivePortal;
  setActivePortal: (portal: ActivePortal) => void;

  // Auth & Roles
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  switchRole: (role: UserRole) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  loginWithGoogle: () => void;
  loginWithEmail: (email: string, role?: UserRole) => void;
  logout: () => void;

  // Enterprise Private Access & RBAC
  enterpriseSession: EnterpriseSession | null;
  isEnterpriseLoginOpen: boolean;
  setIsEnterpriseLoginOpen: (open: boolean) => void;
  loginEnterprise: (username: string, password: string) => Promise<EnterpriseLoginResponse>;
  verifyEnterpriseMFA: (mfaSessionToken: string, mfaCode: string) => Promise<EnterpriseLoginResponse>;
  revokeEnterpriseSession: () => Promise<void>;

  // Modals & Panels
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isShortcutsOpen: boolean;
  setIsShortcutsOpen: (open: boolean) => void;

  // Cloud Sync
  cloudSync: CloudSyncState;
  triggerManualSync: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: ProductItem, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;

  // Orders & State Machine
  orders: Order[];
  placeOrder: (paymentMethod: Order['paymentMethod'], address?: string, phone?: string) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;

  // TOGO Padala Shipments
  padalaShipments: PadalaShipment[];
  createPadalaShipment: (data: Omit<PadalaShipment, 'id' | 'trackingNumber' | 'createdAt' | 'status'>) => PadalaShipment;
  updatePadalaStatus: (shipmentId: string, status: PadalaShipment['status'], podSignedBy?: string) => void;

  // Inventory & Products
  products: ProductItem[];
  inventory: InventoryItem[];
  restockItem: (itemId: string, addQty: number) => void;

  // Suppliers & Fleet
  suppliers: SupplierItem[];
  fleetVehicles: FleetVehicle[];

  // Ledger
  ledger: LedgerEntry[];

  // AI & HITL
  aiProposals: AIActionProposal[];
  handleHITLDecision: (proposalId: string, decision: 'APPROVED' | 'REJECTED' | 'MODIFIED', comment?: string) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('togo_theme') === 'dark';
  });
  const [isHighContrast, setIsHighContrast] = useState<boolean>(false);

  // Initial Route Resolution from window.location.pathname
  const getInitialPortal = (): ActivePortal => {
    if (typeof window === 'undefined') return 'marketplace';
    const path = window.location.pathname.replace(/^\//, '').toLowerCase();
    if (['padala', 'merchant', 'pos', 'rider', 'supplier', 'fleet', 'analytics', 'admin'].includes(path)) {
      return path as ActivePortal;
    }
    if (path === 'ai' || path === 'ai-center') return 'ai-center';
    if (path === 'customer' || path === 'marketplace') return 'marketplace';
    if (path === 'landing' || path === '') return 'marketplace';
    return 'marketplace';
  };

  const [activePortal, setActivePortalState] = useState<ActivePortal>(getInitialPortal);

  const setActivePortal = (portal: ActivePortal) => {
    setActivePortalState(portal);
    if (typeof window !== 'undefined') {
      const urlPath = portal === 'landing' ? '/' : `/${portal}`;
      window.history.pushState(null, '', urlPath);
    }
  };

  // Enterprise Session state & Persistent Auth restoration
  const [enterpriseSession, setEnterpriseSession] = useState<EnterpriseSession | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem('togoserve_enterprise_session');
      if (stored) {
        const parsed = JSON.parse(stored) as EnterpriseSession;
        if (new Date(parsed.expiresAt).getTime() > Date.now()) {
          return parsed;
        }
        localStorage.removeItem('togoserve_enterprise_session');
      }
    } catch {
      // ignore JSON parse error
    }
    return null;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem('togoserve_enterprise_session');
      if (stored) {
        const parsed = JSON.parse(stored) as EnterpriseSession;
        if (new Date(parsed.expiresAt).getTime() > Date.now()) {
          return parsed.user;
        }
      }
    } catch {}
    return null; // Public unauthenticated visitor by default
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isEnterpriseLoginOpen, setIsEnterpriseLoginOpen] = useState(false);


  // Modals
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Sync state
  const [cloudSync, setCloudSync] = useState<CloudSyncState>({
    status: 'synced',
    lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    pendingChangesCount: 0,
  });

  // Domain data
  const [products] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [padalaShipments, setPadalaShipments] = useState<PadalaShipment[]>(INITIAL_PADALA_SHIPMENTS);
  const [aiProposals, setAiProposals] = useState<AIActionProposal[]>(INITIAL_AI_PROPOSALS);
  const [ledger, setLedger] = useState<LedgerEntry[]>(INITIAL_LEDGER);
  const [suppliers] = useState<SupplierItem[]>(INITIAL_SUPPLIERS);
  const [fleetVehicles] = useState<FleetVehicle[]>(INITIAL_FLEET_VEHICLES);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('togo_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('togo_theme', 'light');
    }
  }, [isDarkMode]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setActivePortalState(getInitialPortal());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Periodic background cloud synchronization
  useEffect(() => {
    const interval = setInterval(() => {
      setCloudSync(prev => ({ ...prev, status: 'syncing' }));
      setTimeout(() => {
        setCloudSync({
          status: 'synced',
          lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          pendingChangesCount: 0,
        });
      }, 900);
    }, 45000);

    return () => clearInterval(interval);
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      } else if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setIsShortcutsOpen(prev => !prev);
      } else if (e.altKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setIsDarkMode(prev => !prev);
      } else if (e.key === '1') {
        setActivePortal('marketplace');
      } else if (e.key === '2') {
        setActivePortal('padala');
      } else if (e.key === '3') {
        setActivePortal('merchant');
      } else if (e.key === '4') {
        setActivePortal('pos');
      } else if (e.key === '5') {
        setActivePortal('rider');
      } else if (e.key === '6') {
        setActivePortal('ai-center');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);
  const toggleHighContrast = () => setIsHighContrast(prev => !prev);

  const switchRole = (newRole: UserRole) => {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        role: newRole,
      });
      addToast('info', 'Workspace Role Updated', `Active role switched to ${newRole}`);
    }
  };

  const loginWithGoogle = () => {
    const user: UserProfile = {
      id: 'usr-customer-88',
      name: 'Verified Customer',
      email: 'customer@togoserve.com',
      role: 'CUSTOMER',
      provider: 'google',
      verified: true,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    };
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    addToast('success', 'OAuth Session Verified', 'Authenticated via Google Cloud Identity OAuth 2.0');
  };

  const loginWithEmail = (email: string, role: UserRole = 'CUSTOMER') => {
    const user: UserProfile = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name: email.split('@')[0],
      email: email,
      role: role,
      provider: 'email',
      verified: true,
    };
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    addToast('success', 'Session Established', `Authenticated as ${role}`);
  };

  const parseAuthResponse = async (res: Response): Promise<{ ok: boolean; data: any; error?: string }> => {
    const contentType = res.headers.get('content-type') || '';
    const isJson = contentType.toLowerCase().includes('application/json');

    if (!isJson) {
      const statusText = res.status ? `(HTTP ${res.status})` : '';
      return {
        ok: false,
        data: null,
        error: `Authentication service returned an unexpected HTML response ${statusText}. The production Express backend service is required to process enterprise authentication. Please ensure the full-stack server is running.`,
      };
    }

    try {
      const data = await res.json();
      return {
        ok: res.ok && Boolean(data.success),
        data,
        error: data?.error || (res.ok ? undefined : `Authentication request failed (HTTP ${res.status}).`),
      };
    } catch (err: any) {
      return {
        ok: false,
        data: null,
        error: `Failed to parse authentication server response: ${err.message || 'Invalid JSON format'}.`,
      };
    }
  };

  const loginEnterprise = async (username: string, password: string): Promise<EnterpriseLoginResponse> => {
    try {
      const res = await fetch('/api/auth/enterprise-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const { ok, data, error } = await parseAuthResponse(res);

      if (!ok || !data) {
        return { success: false, error: error || 'Authentication failed' };
      }

      if (data.requiresMfa) {
        return {
          success: true,
          requiresMfa: true,
          mfaSessionToken: data.mfaSessionToken,
          isEnrollment: data.isEnrollment,
          totpSecret: data.totpSecret,
          totpUri: data.totpUri,
        };
      }

      if (data.session) {
        setEnterpriseSession(data.session);
        setCurrentUser(data.session.user);
        localStorage.setItem('togoserve_enterprise_session', JSON.stringify(data.session));
        return { success: true, session: data.session };
      }

      return { success: false, error: 'Unexpected authentication server response format.' };
    } catch (err: any) {
      return {
        success: false,
        error: `Cannot connect to the TOGOSERVE Enterprise Authentication service (${err.message || 'Network unreachable'}). Ensure the Express server is running.`,
      };
    }
  };

  const verifyEnterpriseMFA = async (mfaSessionToken: string, mfaCode: string): Promise<EnterpriseLoginResponse> => {
    try {
      const res = await fetch('/api/auth/verify-mfa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mfaSessionToken, mfaCode }),
      });

      const { ok, data, error } = await parseAuthResponse(res);

      if (!ok || !data) {
        return { success: false, error: error || 'MFA verification failed' };
      }

      if (data.session) {
        setEnterpriseSession(data.session);
        setCurrentUser(data.session.user);
        localStorage.setItem('togoserve_enterprise_session', JSON.stringify(data.session));
        return { success: true, session: data.session };
      }

      return { success: false, error: 'Invalid MFA verification response format.' };
    } catch (err: any) {
      return {
        success: false,
        error: `Cannot connect to the TOGOSERVE Enterprise Authentication service for MFA validation (${err.message || 'Network unreachable'}).`,
      };
    }
  };

  const revokeEnterpriseSession = async () => {
    if (enterpriseSession?.token) {
      try {
        await fetch('/api/auth/revoke', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: enterpriseSession.token, reason: 'User sign-out' }),
        });
      } catch {
        // Continue clearing client session on network failure
      }
    }
    setEnterpriseSession(null);
    setCurrentUser(null);
    localStorage.removeItem('togoserve_enterprise_session');
    addToast('info', 'Enterprise Session Terminated', 'All revocable tokens invalidated.');
  };

  const logout = () => {
    if (enterpriseSession) {
      revokeEnterpriseSession();
    } else {
      setCurrentUser(null);
      addToast('info', 'Signed Out', 'You have signed out of TOGOSERVE');
    }
  };

  const triggerManualSync = () => {
    if (!AccessControlService.canTriggerCloudSync(currentUser)) {
      addToast(
        'error',
        'Authorization Denied',
        'Force Cloud Synchronization is restricted to INFRASTRUCTURE_ADMIN and SUPER_ADMIN.'
      );
      return;
    }
    setCloudSync(prev => ({ ...prev, status: 'syncing' }));
    setTimeout(() => {
      setCloudSync({
        status: 'synced',
        lastSyncedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        pendingChangesCount: 0,
      });
      addToast('success', 'Cloud Synced', 'All distributed entities synchronized to Firestore & Cloud Run');
    }, 700);
  };

  // Cart operations
  const addToCart = (product: ProductItem, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity }];
    });
    addToast('success', 'Added to Basket', `${product.name} (${quantity})`);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => (item.product.id === productId ? { ...item, quantity } : item)));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Orders State Machine
  const placeOrder = (
    paymentMethod: Order['paymentMethod'],
    address = 'Tower 2 Unit 1804, BGC, Taguig City',
    phone = '+63 917 555 0192'
  ): Order => {
    const subtotal = cartTotal;
    const deliveryFee = 65;
    const platformFee = 15;
    const discount = subtotal > 600 ? 50 : 0;
    const total = subtotal + deliveryFee + platformFee - discount;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `TGS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: currentUser?.id || 'cust-anon',
      customerName: currentUser?.name || 'Customer Account',
      customerAddress: address,
      customerPhone: phone,
      storeId: cart[0]?.product.storeId || 'store-1',
      storeName: cart[0]?.product.storeName || 'Aroma Bakehouse & Roastery',
      items: [...cart],
      subtotal,
      deliveryFee,
      platformFee,
      discount,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PAID',
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
      estimatedDeliveryMin: 25,
      riderName: 'Assigning nearest fleet rider...',
      trackingStep: 1,
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();

    const newLedger: LedgerEntry = {
      id: `ledg-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      orderNumber: newOrder.orderNumber,
      grossAmount: total,
      merchantPayable: +(subtotal * 0.85).toFixed(2),
      platformFee: platformFee + +(subtotal * 0.15).toFixed(2),
      deliveryFee: deliveryFee,
      riderEarnings: +(deliveryFee * 0.85).toFixed(2),
      status: 'PENDING',
    };
    setLedger(prev => [newLedger, ...prev]);

    addToast('success', 'Order Dispatched', `Order #${newOrder.orderNumber} sent to merchant!`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          const stepMap: Record<OrderStatus, number> = {
            CREATED: 0,
            PAYMENT_PENDING: 1,
            CONFIRMED: 2,
            MERCHANT_ACCEPTED: 3,
            PREPARING: 4,
            READY_FOR_PICKUP: 5,
            RIDER_ASSIGNED: 6,
            PICKED_UP: 7,
            IN_TRANSIT: 8,
            ARRIVED: 9,
            DELIVERED: 10,
            COMPLETED: 11,
            CANCELLED: 0,
            DISPUTED: 0,
          };
          return {
            ...ord,
            status: newStatus,
            trackingStep: stepMap[newStatus] || ord.trackingStep,
          };
        }
        return ord;
      })
    );
    addToast('info', 'Order Transition', `Order state changed to ${newStatus}`);
  };

  // Padala Logistics
  const createPadalaShipment = (
    data: Omit<PadalaShipment, 'id' | 'trackingNumber' | 'createdAt' | 'status'>
  ): PadalaShipment => {
    const shipment: PadalaShipment = {
      ...data,
      id: `padala-${Date.now()}`,
      trackingNumber: `PAD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'BOOKED',
      createdAt: new Date().toISOString(),
      otpCode: Math.floor(1000 + Math.random() * 9000).toString(),
      riderName: 'Assigning nearest fleet driver...',
    };

    setPadalaShipments(prev => [shipment, ...prev]);
    addToast('success', 'Booking Created', `Shipment #${shipment.trackingNumber} scheduled.`);
    return shipment;
  };

  const updatePadalaStatus = (
    shipmentId: string,
    status: PadalaShipment['status'],
    podSignedBy?: string
  ) => {
    setPadalaShipments(prev =>
      prev.map(s => {
        if (s.id === shipmentId) {
          return {
            ...s,
            status,
            ...(podSignedBy ? { podSignedBy } : {}),
          };
        }
        return s;
      })
    );
    addToast('info', 'Shipment Updated', `Status transitioned to ${status}`);
  };

  const restockItem = (itemId: string, addQty: number) => {
    setInventory(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          const newLevel = item.stockLevel + addQty;
          return {
            ...item,
            stockLevel: newLevel,
            status: newLevel <= item.minThreshold ? 'LOW_STOCK' : 'IN_STOCK',
            lastRestocked: new Date().toISOString().slice(0, 10),
          };
        }
        return item;
      })
    );
    addToast('success', 'Inventory Restocked', `Added +${addQty} units to stock`);
  };

  const handleHITLDecision = (
    proposalId: string,
    decision: 'APPROVED' | 'REJECTED' | 'MODIFIED',
    comment = ''
  ) => {
    setAiProposals(prev =>
      prev.map(p => {
        if (p.id === proposalId) {
          return {
            ...p,
            status: decision,
            reviewerId: currentUser?.name || 'ADMIN_USER',
            reviewComment: comment || `Action marked as ${decision}`,
          };
        }
        return p;
      })
    );
    addToast(
      decision === 'APPROVED' ? 'success' : decision === 'REJECTED' ? 'warning' : 'info',
      `HITL Decision: ${decision}`,
      `Proposal #${proposalId} governed and updated with audit record.`
    );
  };

  return (
    <AppContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        isHighContrast,
        toggleHighContrast,
        activePortal,
        setActivePortal,
        currentUser,
        setCurrentUser,
        switchRole,
        isAuthModalOpen,
        setIsAuthModalOpen,
        loginWithGoogle,
        loginWithEmail,
        logout,
        enterpriseSession,
        isEnterpriseLoginOpen,
        setIsEnterpriseLoginOpen,
        loginEnterprise,
        verifyEnterpriseMFA,
        revokeEnterpriseSession,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isShortcutsOpen,
        setIsShortcutsOpen,
        cloudSync,
        triggerManualSync,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartItemCount,
        orders,
        placeOrder,
        updateOrderStatus,
        padalaShipments,
        createPadalaShipment,
        updatePadalaStatus,
        products,
        inventory,
        restockItem,
        suppliers,
        fleetVehicles,
        ledger,
        aiProposals,
        handleHITLDecision,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
