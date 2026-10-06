/**
 * TOGOSERVE AI CORE - AGENT MEMORY
 * Controlled memory scopes: Request, Session, and Authorized Business Context.
 */

import { AgentContext } from './types';
import { TenantViolationError } from './errors';

export class AgentMemoryManager {
  private static sessionStore = new Map<string, { tenantId: string; actorId: string; entries: Record<string, any> }>();
  private static businessStore = new Map<string, Record<string, any>>(); // tenantId -> context

  /**
   * Session Memory: Store interaction state scoped to actor & tenant
   */
  public static setSessionValue(
    context: AgentContext,
    key: string,
    value: any
  ): void {
    const sessionId = context.sessionId || `session-${context.actorId}`;
    const existing = this.sessionStore.get(sessionId) || {
      tenantId: context.tenantId,
      actorId: context.actorId,
      entries: {},
    };

    if (existing.tenantId !== context.tenantId && context.tenantId !== 'global') {
      throw new TenantViolationError(existing.tenantId, context.tenantId);
    }

    existing.entries[key] = value;
    this.sessionStore.set(sessionId, existing);
  }

  public static getSessionValue<T = any>(
    context: AgentContext,
    key: string
  ): T | undefined {
    const sessionId = context.sessionId || `session-${context.actorId}`;
    const session = this.sessionStore.get(sessionId);
    if (!session) return undefined;

    if (session.tenantId !== context.tenantId && context.tenantId !== 'global' && context.role !== 'SUPER_ADMIN') {
      throw new TenantViolationError(session.tenantId, context.tenantId);
    }

    return session.entries[key] as T;
  }

  /**
   * Business Context: Tenant-authorized operational parameters
   */
  public static setBusinessContext(tenantId: string, context: Record<string, any>): void {
    this.businessStore.set(tenantId, {
      ...this.businessStore.get(tenantId),
      ...context,
    });
  }

  public static getBusinessContext(context: AgentContext): Record<string, any> {
    return this.businessStore.get(context.tenantId) || {};
  }

  public static clearSession(sessionId: string): void {
    this.sessionStore.delete(sessionId);
  }
}
