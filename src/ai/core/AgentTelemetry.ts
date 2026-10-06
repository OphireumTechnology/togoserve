/**
 * TOGOSERVE AI CORE - AGENT TELEMETRY
 */

import { AgentId } from './types';

export interface TelemetryRecord {
  requestId: string;
  agentId: AgentId;
  durationMs: number;
  success: boolean;
  tokensUsed?: number;
  toolsInvokedCount: number;
  timestamp: string;
}

export class AgentTelemetry {
  private static records: TelemetryRecord[] = [];

  public static record(record: TelemetryRecord): void {
    this.records.push(record);
    if (this.records.length > 2000) {
      this.records.shift(); // Bound memory usage
    }
  }

  public static getMetrics(): {
    totalRequests: number;
    successRate: number;
    avgLatencyMs: number;
    agentStats: Record<string, { runs: number; failures: number; avgLatencyMs: number }>;
  } {
    if (this.records.length === 0) {
      return { totalRequests: 0, successRate: 100, avgLatencyMs: 0, agentStats: {} };
    }

    let successes = 0;
    let totalLatency = 0;
    const agentStats: Record<string, { runs: number; failures: number; latencySum: number }> = {};

    for (const r of this.records) {
      if (r.success) successes++;
      totalLatency += r.durationMs;

      if (!agentStats[r.agentId]) {
        agentStats[r.agentId] = { runs: 0, failures: 0, latencySum: 0 };
      }
      agentStats[r.agentId].runs++;
      if (!r.success) agentStats[r.agentId].failures++;
      agentStats[r.agentId].latencySum += r.durationMs;
    }

    const formattedStats: Record<string, { runs: number; failures: number; avgLatencyMs: number }> = {};
    for (const [agentId, stat] of Object.entries(agentStats)) {
      formattedStats[agentId] = {
        runs: stat.runs,
        failures: stat.failures,
        avgLatencyMs: Math.round(stat.latencySum / stat.runs),
      };
    }

    return {
      totalRequests: this.records.length,
      successRate: +((successes / this.records.length) * 100).toFixed(1),
      avgLatencyMs: Math.round(totalLatency / this.records.length),
      agentStats: formattedStats,
    };
  }

  public static clear(): void {
    this.records = [];
  }
}
