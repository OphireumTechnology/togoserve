/**
 * TOGOSERVE AI CORE - AGENT EXECUTOR
 * Executes an individual agent safely with context isolation, timeouts, and metrics.
 */

import { AgentContext, AgentRequest, AgentResponse, TOGOServeAgent } from './types';
import { AgentExecutionError, AIPlatformError } from './errors';
import { AgentRegistry } from './AgentRegistry';
import { DEFAULT_TIMEOUT_MS } from './constants';

export class AgentExecutor {
  public static async executeAgent(
    agent: TOGOServeAgent,
    request: AgentRequest,
    context: AgentContext,
    timeoutMs = DEFAULT_TIMEOUT_MS
  ): Promise<AgentResponse> {
    if (!agent.enabled) {
      throw new AIPlatformError(`Agent ${agent.id} is currently disabled`, 'AGENT_DISABLED');
    }

    // Context tool scoping
    const scopedContext: AgentContext = {
      ...context,
      allowedTools: agent.allowedTools.filter((t) => context.allowedTools.includes(t)),
    };

    const startTime = Date.now();
    const registry = AgentRegistry.getInstance();

    try {
      // Execute with timeout promise race
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new AgentExecutionError(agent.id, `Operation timed out after ${timeoutMs}ms`)),
          timeoutMs
        )
      );

      const executionPromise = agent.execute(request, scopedContext);
      const response = await Promise.race([executionPromise, timeoutPromise]);

      const durationMs = Date.now() - startTime;
      response.executionTimeMs = durationMs;

      registry.recordRun(agent.id, true, durationMs);
      return response;
    } catch (err: any) {
      const durationMs = Date.now() - startTime;
      registry.recordRun(agent.id, false, durationMs);

      if (err instanceof AgentExecutionError || err instanceof AIPlatformError) {
        throw err;
      }
      throw new AgentExecutionError(agent.id, err?.message || 'Unknown internal agent execution error', {
        originalError: String(err),
      });
    }
  }
}
