/**
 * TOGOSERVE ENTERPRISE ACCESS CONTROL SERVICE
 * Centralized Role-Based Access Control (RBAC) and Permission Governance.
 * 
 * Enforces separation between:
 * - PUBLIC ENVIRONMENT: Marketplace, Padala tracking, Customer self-service.
 * - PRIVATE ENTERPRISE ENVIRONMENT: Merchant OS, Fleet, Logistics, Finance, AI Command, Admin.
 */

import { UserProfile, UserRole } from '../types';

export interface RoleMetadata {
  role: UserRole;
  title: string;
  department: 'EXECUTIVE' | 'SECURITY' | 'INFRASTRUCTURE' | 'AI' | 'FINANCE' | 'MERCHANT' | 'LOGISTICS' | 'OPERATIONS' | 'PUBLIC';
  requiresMFA: boolean;
  clearanceLevel: 1 | 2 | 3 | 4 | 5; // 5 is highest (SUPER_ADMIN)
  badgeColor: string;
  description: string;
}

export const ENTERPRISE_ROLES: Record<UserRole, RoleMetadata> = {
  SUPER_ADMIN: {
    role: 'SUPER_ADMIN',
    title: 'Master Enterprise Administrator',
    department: 'EXECUTIVE',
    requiresMFA: true,
    clearanceLevel: 5,
    badgeColor: '#F4B400',
    description: 'Root access across all operational dashboards, AI governance, cloud infrastructure, and security.',
  },
  SECURITY_ADMIN: {
    role: 'SECURITY_ADMIN',
    title: 'Security Operations Officer',
    department: 'SECURITY',
    requiresMFA: true,
    clearanceLevel: 4,
    badgeColor: '#D64545',
    description: 'Manages audit trails, session revocation, credential policies, and compliance enforcement.',
  },
  INFRASTRUCTURE_ADMIN: {
    role: 'INFRASTRUCTURE_ADMIN',
    title: 'Cloud Infrastructure Engineer',
    department: 'INFRASTRUCTURE',
    requiresMFA: true,
    clearanceLevel: 4,
    badgeColor: '#4A90E2',
    description: 'Controls cloud synchronization, database persistence, server health, and platform scaling.',
  },
  AI_SUPERVISOR: {
    role: 'AI_SUPERVISOR',
    title: 'Autonomous Systems Supervisor',
    department: 'AI',
    requiresMFA: true,
    clearanceLevel: 4,
    badgeColor: '#9B51E0',
    description: 'Supervises A00 orchestrator, departmental supervisors, agent lifecycles, and HITL approvals.',
  },
  FINANCE_ADMIN: {
    role: 'FINANCE_ADMIN',
    title: 'Chief Financial Controller',
    department: 'FINANCE',
    requiresMFA: true,
    clearanceLevel: 4,
    badgeColor: '#16845B',
    description: 'Controls corporate ledgers, merchant disbursements, gateway settlements, and financial policies.',
  },
  MERCHANT_ADMIN: {
    role: 'MERCHANT_ADMIN',
    title: 'Merchant Principal / Manager',
    department: 'MERCHANT',
    requiresMFA: false,
    clearanceLevel: 3,
    badgeColor: '#F4B400',
    description: 'Controls store settings, product inventory, staff accounts, and POS terminal configurations.',
  },
  MERCHANT_STAFF: {
    role: 'MERCHANT_STAFF',
    title: 'Merchant Store Cashier / Staff',
    department: 'MERCHANT',
    requiresMFA: false,
    clearanceLevel: 2,
    badgeColor: '#EBEEEE',
    description: 'Handles in-store POS register transactions, orders, and item status.',
  },
  LOGISTICS_ADMIN: {
    role: 'LOGISTICS_ADMIN',
    title: 'Logistics & Fleet Director',
    department: 'LOGISTICS',
    requiresMFA: false,
    clearanceLevel: 3,
    badgeColor: '#F4B400',
    description: 'Oversees Padala logistics, rider dispatch routing, fleet telematics, and SLA metrics.',
  },
  RIDER: {
    role: 'RIDER',
    title: 'Certified Courier Partner',
    department: 'LOGISTICS',
    requiresMFA: false,
    clearanceLevel: 2,
    badgeColor: '#F4B400',
    description: 'Operates field delivery app, accepts orders, handles POD signatures, and GPS updates.',
  },
  ANALYST: {
    role: 'ANALYST',
    title: 'Executive Business Analyst',
    department: 'OPERATIONS',
    requiresMFA: false,
    clearanceLevel: 3,
    badgeColor: '#2E2E2E',
    description: 'Read-only access to platform GMV, performance metrics, conversion funnels, and reports.',
  },
  CUSTOMER_SUPPORT: {
    role: 'CUSTOMER_SUPPORT',
    title: 'Customer Resolution Specialist',
    department: 'OPERATIONS',
    requiresMFA: false,
    clearanceLevel: 2,
    badgeColor: '#4A90E2',
    description: 'Handles customer claims, ticket escalations, Padala investigations, and dispute mediation.',
  },
  CLIENT: {
    role: 'CLIENT',
    title: 'Corporate B2B Client',
    department: 'OPERATIONS',
    requiresMFA: false,
    clearanceLevel: 2,
    badgeColor: '#D9C39A',
    description: 'Bulk logistics portal, recurring delivery agreements, and enterprise invoices.',
  },
  // Legacy / UI aliases
  CUSTOMER: {
    role: 'CUSTOMER',
    title: 'Verified Customer',
    department: 'PUBLIC',
    requiresMFA: false,
    clearanceLevel: 1,
    badgeColor: '#EBEEEE',
    description: 'Consumer shopping, ordering, and package tracking.',
  },
  MERCHANT_OWNER: {
    role: 'MERCHANT_OWNER',
    title: 'Merchant Owner (Legacy)',
    department: 'MERCHANT',
    requiresMFA: false,
    clearanceLevel: 3,
    badgeColor: '#F4B400',
    description: 'Full merchant permissions (aliased to MERCHANT_ADMIN).',
  },
  DISPATCHER: {
    role: 'DISPATCHER',
    title: 'Fleet Dispatcher (Legacy)',
    department: 'LOGISTICS',
    requiresMFA: false,
    clearanceLevel: 3,
    badgeColor: '#F4B400',
    description: 'Fleet logistics operations (aliased to LOGISTICS_ADMIN).',
  },
  FINANCE: {
    role: 'FINANCE',
    title: 'Finance Staff (Legacy)',
    department: 'FINANCE',
    requiresMFA: false,
    clearanceLevel: 3,
    badgeColor: '#16845B',
    description: 'Financial operations (aliased to FINANCE_ADMIN).',
  },
  SUPPORT: {
    role: 'SUPPORT',
    title: 'Support Agent (Legacy)',
    department: 'OPERATIONS',
    requiresMFA: false,
    clearanceLevel: 2,
    badgeColor: '#4A90E2',
    description: 'Customer support operations (aliased to CUSTOMER_SUPPORT).',
  },
  ADMIN: {
    role: 'ADMIN',
    title: 'Administrator (Legacy)',
    department: 'EXECUTIVE',
    requiresMFA: true,
    clearanceLevel: 4,
    badgeColor: '#F4B400',
    description: 'General administrator access.',
  },
};

/**
 * Access Matrix: Portals to Allowed Roles
 */
export const PORTAL_ACCESS_RULES: Record<string, {
  name: string;
  isPrivate: boolean;
  allowedRoles: UserRole[];
  description: string;
}> = {
  landing: {
    name: 'Platform Overview',
    isPrivate: false,
    allowedRoles: [], // open to public
    description: 'Public introduction to TOGOSERVE ecosystem.',
  },
  marketplace: {
    name: 'Customer Marketplace',
    isPrivate: false,
    allowedRoles: [], // open to public
    description: 'Public customer shopping, merchant storefronts, and ordering.',
  },
  customer: {
    name: 'Customer Account',
    isPrivate: true,
    allowedRoles: ['CUSTOMER', 'CLIENT', 'SUPER_ADMIN'],
    description: 'Authenticated customer profile and order history; server must enforce record ownership.',
  },
  padala: {
    name: 'TOGO Padala Express',
    isPrivate: false,
    allowedRoles: [], // public booking & tracking
    description: 'Express door-to-door courier dispatch and real-time parcel tracking.',
  },
  merchant: {
    name: 'Merchant OS Command Center',
    isPrivate: true,
    allowedRoles: ['MERCHANT_ADMIN', 'MERCHANT_OWNER', 'MERCHANT_STAFF', 'SUPER_ADMIN'],
    description: 'Merchant inventory, live store orders, kitchen display, and settlement statements.',
  },
  pos: {
    name: 'Point of Sale (POS) Terminal',
    isPrivate: true,
    allowedRoles: ['MERCHANT_ADMIN', 'MERCHANT_OWNER', 'MERCHANT_STAFF', 'SUPER_ADMIN'],
    description: 'Retail counter checkout, barcode scanning, cash drawers, and instant receipts.',
  },
  rider: {
    name: 'Rider & Courier Hub',
    isPrivate: true,
    allowedRoles: ['RIDER', 'LOGISTICS_ADMIN', 'DISPATCHER', 'SUPER_ADMIN'],
    description: 'Field delivery workflow, order acceptance, earnings dashboard, and POD.',
  },
  fleet: {
    name: 'Fleet Logistics & Telematics',
    isPrivate: true,
    allowedRoles: ['LOGISTICS_ADMIN', 'DISPATCHER', 'SUPER_ADMIN'],
    description: 'Live courier telemetry, active route optimization, and zone SLA monitoring.',
  },
  supplier: {
    name: 'B2B Wholesale Procurement',
    isPrivate: true,
    allowedRoles: ['MERCHANT_ADMIN', 'MERCHANT_OWNER', 'FINANCE_ADMIN', 'FINANCE', 'CLIENT', 'SUPER_ADMIN'],
    description: 'Wholesale inventory catalog, supplier POs, and bulk invoice management.',
  },
  'ai-center': {
    name: 'A00 AI Supervisor Command Center',
    isPrivate: true,
    allowedRoles: ['AI_SUPERVISOR', 'SUPER_ADMIN'],
    description: 'Autonomous multi-agent orchestration, HITL approval queue, and telemetry.',
  },
  admin: {
    name: 'Master Enterprise Administration',
    isPrivate: true,
    allowedRoles: ['SUPER_ADMIN', 'SECURITY_ADMIN', 'INFRASTRUCTURE_ADMIN', 'ADMIN'],
    description: 'Platform infrastructure, user access governance, security policies, and audits.',
  },
  analytics: {
    name: 'Executive Analytics & Telemetry',
    isPrivate: true,
    allowedRoles: ['ANALYST', 'FINANCE_ADMIN', 'FINANCE', 'MERCHANT_ADMIN', 'MERCHANT_OWNER', 'SUPER_ADMIN'],
    description: 'Real-time GMV, transaction volumes, conversion funnels, and executive reports.',
  },
};

export class AccessControlService {
  /**
   * Check if user is allowed to access a given portal
   */
  public static canAccessPortal(
    user: UserProfile | null,
    portal: string
  ): { allowed: boolean; reason?: string; requiresEnterpriseLogin?: boolean } {
    const rule = PORTAL_ACCESS_RULES[portal];

    // Fail closed for unknown portals: newly added internal routes must be explicitly classified.
    if (!rule) {
      return { allowed: false, reason: 'Unregistered portal. Access denied pending security classification.' };
    }
    if (!rule.isPrivate) {
      return { allowed: true };
    }

    // Portal is private: user must be authenticated
    if (!user) {
      return {
        allowed: false,
        requiresEnterpriseLogin: true,
        reason: `The "${rule.name}" is restricted to authenticated enterprise personnel. Please log in with your TOGOSERVE corporate credentials.`,
      };
    }

    // Check if user role matches allowed roles
    if (rule.allowedRoles.includes(user.role)) {
      return { allowed: true };
    }

    // Specific role denial explanation
    return {
      allowed: false,
      requiresEnterpriseLogin: false,
      reason: `Access Denied: Your current role (${user.role}) does not have clearance for "${rule.name}". Required role: ${rule.allowedRoles.join(', ')}.`,
    };
  }

  /**
   * Check if user can trigger manual cloud synchronization
   * Strict requirement: Restricted to INFRASTRUCTURE_ADMIN and SUPER_ADMIN
   */
  public static canTriggerCloudSync(user: UserProfile | null): boolean {
    if (!user) return false;
    return user.role === 'SUPER_ADMIN' || user.role === 'INFRASTRUCTURE_ADMIN';
  }

  /**
   * Check if user role requires mandatory MFA
   */
  public static requiresMFA(role: UserRole): boolean {
    const meta = ENTERPRISE_ROLES[role];
    return meta ? meta.requiresMFA : false;
  }

  /**
   * Get accessible portals for a given user
   */
  public static getAccessiblePortals(user: UserProfile | null): string[] {
    return Object.entries(PORTAL_ACCESS_RULES)
      .filter(([_, rule]) => {
        if (!rule.isPrivate) return true;
        if (!user) return false;
        return rule.allowedRoles.includes(user.role);
      })
      .map(([id]) => id);
  }
}
