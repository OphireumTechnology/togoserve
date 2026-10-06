/**
 * TOGOSERVE AI CORE - AGENT CONTEXT
 */

import { AgentContext, AgentRequest, AuditEvent } from './types';
import { TenantViolationError } from './errors';

export class AgentContextBuilder {
  public static createContext(
    request: AgentRequest,
    options?: {
      allowedTools?: string[];
      businessContext?: Record<string, any>;
      emitEvent?: (name: string, payload: any) => void;
      recordAudit?: (event: Omit<AuditEvent, 'id' | 'timestamp'>) => void;
      invokeTool?: <T = any>(toolId: string, input: any) => Promise<T>;
    }
  ): AgentContext {
    return {
      requestId: request.requestId,
      sessionId: request.sessionId,
      actorId: request.actorId,
      role: request.role,
      tenantId: request.tenantId,
      permissions: [...request.permissions],
      businessContext: options?.businessContext || {},
      allowedTools: options?.allowedTools || [],
      emitEvent: options?.emitEvent,
      recordAudit: options?.recordAudit,
      invokeTool: options?.invokeTool,
    };
  }

  /**
   * Asserts that the requested resource tenant matches the context tenant.
   * Prevents Merchant A from accessing Merchant B data.
   */
  public static assertTenantIsolation(context: AgentContext, resourceTenantId: string): void {
    // If resource is global/system or user has SUPER_ADMIN or ADMIN role across tenants
    if (resourceTenantId === 'global' || context.tenantId === 'global') {
      return;
    }
    if (context.role === 'SUPER_ADMIN' || context.role === 'ADMIN') {
      return;
    }
    if (context.tenantId !== resourceTenantId) {
      throw new TenantViolationError(resourceTenantId, context.tenantId);
    }
  }
}
