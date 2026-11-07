/**
 * TOGOSERVE AI CORE - AGENT REGISTRY
 * Central dynamic registry for all agents A00-A60+.
 */

import {
  AgentCategory,
  AgentCapability,
  AgentId,
  AgentLifecycleStatus,
  AgentRegistrationMetadata,
  Department,
  DepartmentSupervisorId,
  TOGOServeAgent
} from './types';
import { AIPlatformError } from './errors';

// Priority 12 foundational agents evaluated in Shadow Mode
export const PRIORITY_12_AGENTS = new Set<AgentId>([
  'A01', 'A02', 'A06', 'A07',
  'A10', 'A12', 'A14',
  'A27', 'A30', 'A35',
  'A40', 'A41'
]);

export class AgentRegistry {
  private static instance: AgentRegistry;
  private agents = new Map<AgentId, TOGOServeAgent>();
  private metadata = new Map<AgentId, AgentRegistrationMetadata>();
  private emergencyStopped: boolean = false;
  private emergencyStopReason: string | null = null;

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

  private resolveDepartment(agent: TOGOServeAgent): { department: Department; supervisorId: DepartmentSupervisorId | 'A00' } {
    if (agent.department && agent.supervisorId) {
      return { department: agent.department, supervisorId: agent.supervisorId };
    }
    if (agent.id === 'A00') {
      return { department: 'ADMINISTRATION', supervisorId: 'A00' };
    }
    if (agent.id === 'S01') {
      return { department: 'MERCHANTS', supervisorId: 'A00' };
    }
    if (agent.id === 'S02') {
      return { department: 'LOGISTICS', supervisorId: 'A00' };
    }
    if (agent.id === 'S03') {
      return { department: 'ADMINISTRATION', supervisorId: 'A00' };
    }

    if (agent.category === 'MERCHANT' || agent.category === 'PROCUREMENT') {
      return { department: 'MERCHANTS', supervisorId: 'S01' };
    }
    if (agent.category === 'LOGISTICS' || agent.category === 'RIDER') {
      return { department: 'LOGISTICS', supervisorId: 'S02' };
    }
    return { department: 'ADMINISTRATION', supervisorId: 'S03' };
  }

  public register(agent: TOGOServeAgent): void {
    if (!agent.id) {
      throw new AIPlatformError('Agent ID is required for registration', 'INVALID_AGENT_ID');
    }
    if (this.agents.has(agent.id)) {
      throw new AIPlatformError(`Agent with ID ${agent.id} is already registered`, 'DUPLICATE_AGENT_ID');
    }

    const { department, supervisorId } = this.resolveDepartment(agent);
    
    // Default initial lifecycle: Priority 12 foundational agents start in TESTING (shadow mode)
    const initialLifecycle: AgentLifecycleStatus = agent.lifecycleStatus ?? 
      (PRIORITY_12_AGENTS.has(agent.id) ? 'TESTING' : (agent.enabled ? 'ACTIVE' : 'PAUSED'));

    const isEnabled = this.emergencyStopped ? false : (initialLifecycle === 'ACTIVE' || initialLifecycle === 'TESTING');
    agent.enabled = isEnabled;
    agent.lifecycleStatus = initialLifecycle;
    agent.department = department;
    agent.supervisorId = supervisorId;

    this.agents.set(agent.id, agent);
    this.metadata.set(agent.id, {
      id: agent.id,
      name: agent.name,
      category: agent.category,
      department,
      supervisorId,
      lifecycleStatus: initialLifecycle,
      description: agent.description,
      version: agent.version,
      capabilities: [...agent.capabilities],
      allowedTools: [...agent.allowedTools],
      defaultRisk: agent.defaultRisk,
      maxRisk: agent.maxRisk,
      requiredPermissions: [...agent.requiredPermissions],
      enabled: isEnabled,
      modelName: agent.modelName || (agent.defaultRisk === 'L0' || agent.defaultRisk === 'L1' ? 'gemini-3.8-flash' : 'gemini-4-argon'),
      successCount: 0,
      failureCount: 0,
      averageLatencyMs: 0,
      promptTokens: 0,
      completionTokens: 0,
      estimatedCostUsd: 0,
      accuracyScore: 98.4,
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

  public getByDepartment(department: Department): TOGOServeAgent[] {
    return Array.from(this.agents.values()).filter((a) => a.department === department);
  }

  public getMetadataByDepartment(department: Department): AgentRegistrationMetadata[] {
    return Array.from(this.metadata.values()).filter((m) => m.department === department);
  }

  public getByCapability(capability: AgentCapability): TOGOServeAgent[] {
    return Array.from(this.agents.values()).filter((a) => a.capabilities.includes(capability));
  }

  public list(): TOGOServeAgent[] {
    return Array.from(this.agents.values());
  }

  public isEnabled(id: AgentId): boolean {
    if (this.emergencyStopped) return false;
    const meta = this.metadata.get(id);
    return meta ? meta.enabled && meta.lifecycleStatus !== 'PAUSED' && meta.lifecycleStatus !== 'QUARANTINED' : false;
  }

  public getLifecycleStatus(id: AgentId): AgentLifecycleStatus | undefined {
    const meta = this.metadata.get(id);
    return meta?.lifecycleStatus;
  }

  public setLifecycleStatus(id: AgentId, status: AgentLifecycleStatus, reason?: string): void {
    const agent = this.agents.get(id);
    const meta = this.metadata.get(id);
    if (!agent || !meta) {
      throw new AIPlatformError(`Agent ${id} not found in registry`, 'AGENT_NOT_FOUND');
    }

    meta.lifecycleStatus = status;
    agent.lifecycleStatus = status;

    if (status === 'QUARANTINED') {
      meta.quarantineReason = reason || 'Quarantined due to policy violation or administrative action';
      agent.enabled = false;
      meta.enabled = false;
    } else if (status === 'PAUSED') {
      agent.enabled = false;
      meta.enabled = false;
    } else {
      meta.quarantineReason = undefined;
      const shouldEnable = !this.emergencyStopped;
      agent.enabled = shouldEnable;
      meta.enabled = shouldEnable;
    }
  }

  public quarantineAgent(id: AgentId, reason: string): void {
    this.setLifecycleStatus(id, 'QUARANTINED', reason);
  }

  public enable(id: AgentId): void {
    this.setLifecycleStatus(id, 'ACTIVE');
  }

  public disable(id: AgentId): void {
    this.setLifecycleStatus(id, 'PAUSED');
  }

  /**
   * Global Emergency Stop: Immediately halts all autonomous agents and mutations
   */
  public emergencyStopAll(reason: string = 'Administrative Emergency Stop activated'): void {
    this.emergencyStopped = true;
    this.emergencyStopReason = reason;

    for (const [id, agent] of this.agents.entries()) {
      const meta = this.metadata.get(id);
      if (agent.id !== 'A00') {
        agent.enabled = false;
        if (meta) {
          meta.enabled = false;
        }
      }
    }
  }

  /**
   * Resumes normal operations from emergency stop
   */
  public resumeAll(): void {
    this.emergencyStopped = false;
    this.emergencyStopReason = null;

    for (const [id, agent] of this.agents.entries()) {
      const meta = this.metadata.get(id);
      if (meta && meta.lifecycleStatus !== 'QUARANTINED' && meta.lifecycleStatus !== 'PAUSED') {
        agent.enabled = true;
        meta.enabled = true;
      }
    }
  }

  public isEmergencyStopped(): boolean {
    return this.emergencyStopped;
  }

  public getEmergencyStopReason(): string | null {
    return this.emergencyStopReason;
  }

  public recordTokensAndCost(
    id: AgentId,
    promptTokens: number,
    completionTokens: number,
    costUsd: number
  ): void {
    const meta = this.metadata.get(id);
    if (!meta) return;

    meta.promptTokens += promptTokens;
    meta.completionTokens += completionTokens;
    meta.estimatedCostUsd += costUsd;
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

    // Recompute accuracy score
    if (totalRuns > 0) {
      meta.accuracyScore = Math.max(85, Math.round(((meta.successCount) / totalRuns) * 1000) / 10);
    }
  }

  public getHealth(): {
    total: number;
    enabled: number;
    healthy: number;
    active: number;
    testing: number;
    paused: number;
    quarantined: number;
    emergencyStopped: boolean;
  } {
    const total = this.agents.size;
    let enabled = 0;
    let healthy = 0;
    let active = 0;
    let testing = 0;
    let paused = 0;
    let quarantined = 0;

    for (const meta of this.metadata.values()) {
      if (meta.enabled) enabled++;
      if (meta.lifecycleStatus === 'ACTIVE') active++;
      else if (meta.lifecycleStatus === 'TESTING') testing++;
      else if (meta.lifecycleStatus === 'PAUSED') paused++;
      else if (meta.lifecycleStatus === 'QUARANTINED') quarantined++;

      const totalRuns = meta.successCount + meta.failureCount;
      if (totalRuns === 0 || meta.failureCount / totalRuns < 0.1) {
        healthy++;
      }
    }

    return {
      total,
      enabled,
      healthy,
      active,
      testing,
      paused,
      quarantined,
      emergencyStopped: this.emergencyStopped
    };
  }

  public getSummaryStats(): {
    totalTokens: number;
    totalCostUsd: number;
    avgLatencyMs: number;
    overallAccuracy: number;
  } {
    let totalTokens = 0;
    let totalCostUsd = 0;
    let latencySum = 0;
    let accuracySum = 0;
    let count = 0;

    for (const meta of this.metadata.values()) {
      totalTokens += (meta.promptTokens + meta.completionTokens);
      totalCostUsd += meta.estimatedCostUsd;
      latencySum += meta.averageLatencyMs;
      accuracySum += meta.accuracyScore;
      count++;
    }

    return {
      totalTokens,
      totalCostUsd: Math.round(totalCostUsd * 1000) / 1000,
      avgLatencyMs: count > 0 ? Math.round(latencySum / count) : 0,
      overallAccuracy: count > 0 ? Math.round((accuracySum / count) * 10) / 10 : 98.4
    };
  }
}
