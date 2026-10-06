/**
 * TOGOSERVE AI CORE - AGENT REGISTRY
 * Central dynamic registry for all agents A00-A60+.
 */

import {
  AgentCategory,
  AgentCapability,
  AgentId,
  AgentRegistrationMetadata,
  TOGOServeAgent
} from './types';
import { AIPlatformError } from './errors';

export class AgentRegistry {
  private static instance: AgentRegistry;
  private agents = new Map<AgentId, TOGOServeAgent>();
  private metadata = new Map<AgentId, AgentRegistrationMetadata>();

  private constructor() {}

  public static getInstance(): AgentRegistry {
    if (!AgentRegistry.instance) {
      AgentRegistry.instance = new AgentRegistry();
    }
    return AgentRegistry.instance;
  }

  /**
   * Reset instance (primarily for isolated test fixtures)
   */
  public static resetInstance(): void {
    AgentRegistry.instance = new AgentRegistry();
  }

  public register(agent: TOGOServeAgent): void {
    if (!agent.id) {
      throw new AIPlatformError('Agent ID is required for registration', 'INVALID_AGENT_ID');
    }
    if (this.agents.has(agent.id)) {
      throw new AIPlatformError(`Agent with ID ${agent.id} is already registered`, 'DUPLICATE_AGENT_ID');
    }

    this.agents.set(agent.id, agent);
    this.metadata.set(agent.id, {
      id: agent.id,
      name: agent.name,
      category: agent.category,
      description: agent.description,
      version: agent.version,
      capabilities: [...agent.capabilities],
      allowedTools: [...agent.allowedTools],
      defaultRisk: agent.defaultRisk,
      maxRisk: agent.maxRisk,
      requiredPermissions: [...agent.requiredPermissions],
      enabled: agent.enabled ?? true,
      successCount: 0,
      failureCount: 0,
      averageLatencyMs: 0,
    });
  }

  public unregister(id: AgentId): boolean {
    this.metadata.delete(id);
    return this.agents.delete(id);
  }

  public get(id: AgentId): TOGOServeAgent | undefined {
    return this.agents.get(id);
  }

  public getByCategory(category: AgentCategory): TOGOServeAgent[] {
    return Array.from(this.agents.values()).filter((a) => a.category === category);
  }

  public getByCapability(capability: AgentCapability): TOGOServeAgent[] {
    return Array.from(this.agents.values()).filter((a) => a.capabilities.includes(capability));
  }

  public list(): TOGOServeAgent[] {
    return Array.from(this.agents.values());
  }

  public isEnabled(id: AgentId): boolean {
    const meta = this.metadata.get(id);
    return meta ? meta.enabled : false;
  }

  public enable(id: AgentId): void {
    const agent = this.agents.get(id);
    const meta = this.metadata.get(id);
    if (!agent || !meta) {
      throw new AIPlatformError(`Agent ${id} not found in registry`, 'AGENT_NOT_FOUND');
    }
    agent.enabled = true;
    meta.enabled = true;
  }

  public disable(id: AgentId): void {
    const agent = this.agents.get(id);
    const meta = this.metadata.get(id);
    if (!agent || !meta) {
      throw new AIPlatformError(`Agent ${id} not found in registry`, 'AGENT_NOT_FOUND');
    }
    agent.enabled = false;
    meta.enabled = false;
  }

  public getMetadata(id: AgentId): AgentRegistrationMetadata | undefined {
    return this.metadata.get(id);
  }

  public getAllMetadata(): AgentRegistrationMetadata[] {
    return Array.from(this.metadata.values());
  }

  public getAllowedTools(id: AgentId): string[] {
    const agent = this.agents.get(id);
    return agent ? [...agent.allowedTools] : [];
  }

  public recordRun(id: AgentId, success: boolean, latencyMs: number): void {
    const meta = this.metadata.get(id);
    if (!meta) return;

    if (success) {
      meta.successCount += 1;
    } else {
      meta.failureCount += 1;
    }

    const totalRuns = meta.successCount + meta.failureCount;
    meta.averageLatencyMs = Math.round(
      (meta.averageLatencyMs * (totalRuns - 1) + latencyMs) / totalRuns
    );
    meta.lastRun = new Date().toISOString();
  }

  public getHealth(): { total: number; enabled: number; healthy: number } {
    const total = this.agents.size;
    let enabled = 0;
    let healthy = 0;

    for (const meta of this.metadata.values()) {
      if (meta.enabled) enabled++;
      const totalRuns = meta.successCount + meta.failureCount;
      if (totalRuns === 0 || meta.failureCount / totalRuns < 0.1) {
        healthy++;
      }
    }

    return { total, enabled, healthy };
  }
}
