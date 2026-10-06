/**
 * TOGOSERVE AI CORE - AUDIT SERVICE
 * Immutable trace recorder for every AI decision, policy check, and action.
 */

import { AuditEvent } from '../core/types';

export class AIAuditService {
  private static events: AuditEvent[] = [];

  public static record(event: Omit<AuditEvent, 'id' | 'timestamp'>): AuditEvent {
    // Sanitize metadata to prevent secret leakage
    const sanitizedMetadata = this.sanitize(event.metadata);

    const fullEvent: AuditEvent = {
      ...event,
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      metadata: sanitizedMetadata,
      timestamp: new Date().toISOString(),
    };

    this.events.unshift(fullEvent);
    if (this.events.length > 2000) {
      this.events.pop();
    }

    return fullEvent;
  }

  public static getEvents(filter?: {
    agentId?: string;
    tenantId?: string;
    requestId?: string;
    limit?: number;
  }): AuditEvent[] {
    let result = this.events;
    if (filter?.agentId) {
      result = result.filter((e) => e.agentId === filter.agentId);
    }
    if (filter?.tenantId && filter.tenantId !== 'global') {
      result = result.filter((e) => e.tenantId === filter.tenantId);
    }
    if (filter?.requestId) {
      result = result.filter((e) => e.requestId === filter.requestId);
    }
    return result.slice(0, filter?.limit || 100);
  }

  public static clear(): void {
    this.events = [];
  }

  private static sanitize(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;

    const forbiddenKeys = ['password', 'token', 'secret', 'apikey', 'auth', 'privatekey', 'bearer'];
    const cleaned: Record<string, any> = Array.isArray(obj) ? [] : {};

    for (const [k, v] of Object.entries(obj)) {
      if (forbiddenKeys.some((f) => k.toLowerCase().includes(f))) {
        cleaned[k] = '[REDACTED_BY_AUDIT_SECURITY]';
      } else if (typeof v === 'object' && v !== null) {
        cleaned[k] = this.sanitize(v);
      } else {
        cleaned[k] = v;
      }
    }

    return cleaned;
  }
}
