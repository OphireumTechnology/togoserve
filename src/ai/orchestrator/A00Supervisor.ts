/**
 * TOGOSERVE AI CORE - A00 SUPERVISOR / AI ORCHESTRATOR
 * Master Orchestrator coordinating A01-A60.
 */

import {
  AgentContext,
  AgentRequest,
  AgentResponse,
  TOGOServeAgent,
  AIRiskLevel
} from '../core/types';
import { AgentRegistry } from '../core/AgentRegistry';
import { AgentExecutor } from '../core/AgentExecutor';
import { IntentClassifier } from './IntentClassifier';
import { AgentSelector } from './AgentSelector';
import { TaskDecomposer } from './TaskDecomposer';
import { ExecutionPlanner } from './ExecutionPlanner';
import { ResultSynthesizer } from './ResultSynthesizer';
import { AI_EVENT_NAMES } from '../core/constants';
import { AgentContextBuilder } from '../core/AgentContext';

export class A00Supervisor implements TOGOServeAgent {
  public id = 'A00' as const;
  public name = 'A00 Platform Supervisor & AI Orchestrator';
  public category = 'ORCHESTRATION' as const;
  public description =
    'Governed central orchestrator. Classifies domain intents, plans multi-agent tasks, executes parallel operations, and routes consequential proposals to ActionGateway.';
  public version = '2.0.0';
  public capabilities = [
    'orchestration',
    'multi_agent_planning',
    'query_understanding',
  ] as const;
  public allowedTools = [
    'searchProducts',
    'getMerchant',
    'getOrder',
    'getDelivery',
    'getInventory',
    'getSettlement',
    'getPadalaQuote',
    'getRiderAvailability',
  ];
  public defaultRisk: AIRiskLevel = 'L0';
  public maxRisk: AIRiskLevel = 'L3';
  public requiredPermissions: string[] = ['platform:orchestrate'];
  public enabled = true;

  public async canHandle(_request: AgentRequest): Promise<boolean> {
    return true; // A00 can inspect and route any incoming request
  }

  public async execute(
    request: AgentRequest,
    context: AgentContext
  ): Promise<AgentResponse> {
    const startTime = Date.now();
    context.emitEvent?.(AI_EVENT_NAMES.REQUEST_CREATED, { requestId: request.requestId, query: request.query });

    // 1. Classify Intent
    const classified = IntentClassifier.classify(request);
    context.emitEvent?.(AI_EVENT_NAMES.AGENT_SELECTED, { intent: classified.intent, domain: classified.domain });

    // 2. Select Specialized Agent(s)
    const selectedAgentIds = AgentSelector.selectAgents(request, classified);

    // 3. Decompose & Plan Execution Stages
    const subTasks = TaskDecomposer.decompose(request, classified, selectedAgentIds);
    const stages = ExecutionPlanner.createExecutionStages(subTasks);

    const registry = AgentRegistry.getInstance();
    const stageResponses: AgentResponse[] = [];

    // 4. Execute Stages
    for (const stage of stages) {
      const stagePromises = stage.tasks.map(async (task) => {
        const specialist = registry.get(task.agentId);
        if (!specialist || !specialist.enabled) {
          return null;
        }

        // Create scoped child context with tenant isolation
        const childContext = AgentContextBuilder.createContext(request, {
          allowedTools: registry.getAllowedTools(task.agentId),
          businessContext: context.businessContext,
          emitEvent: context.emitEvent,
          recordAudit: context.recordAudit,
          invokeTool: context.invokeTool,
        });

        context.emitEvent?.(AI_EVENT_NAMES.AGENT_STARTED, { agentId: task.agentId, taskId: task.taskId });

        try {
          const resp = await AgentExecutor.executeAgent(specialist, request, childContext);
          context.emitEvent?.(AI_EVENT_NAMES.AGENT_COMPLETED, { agentId: task.agentId, status: resp.status });
          return resp;
        } catch (err: any) {
          context.emitEvent?.(AI_EVENT_NAMES.AGENT_FAILED, { agentId: task.agentId, error: err.message });
          return {
            requestId: request.requestId,
            agentId: task.agentId,
            status: 'ERROR' as const,
            summary: `Agent execution failed: ${err.message}`,
            data: { error: err.message },
            confidence: 0,
            timestamp: new Date().toISOString(),
          };
        }
      });

      const results = await Promise.all(stagePromises);
      for (const r of results) {
        if (r) stageResponses.push(r);
      }
    }

    // 5. Synthesize Results
    const finalResponse = ResultSynthesizer.synthesize(request.requestId, stageResponses);
    finalResponse.executionTimeMs = Date.now() - startTime;

    // 6. Record Audit
    context.recordAudit?.({
      requestId: request.requestId,
      actorId: request.actorId,
      tenantId: request.tenantId,
      agentId: this.id,
      eventType: 'A00_ORCHESTRATION_COMPLETED',
      resourceType: 'ORCHESTRATION',
      resourceId: request.requestId,
      riskLevel: this.defaultRisk,
      metadata: {
        intent: classified.intent,
        domain: classified.domain,
        selectedAgents: selectedAgentIds,
        executionTimeMs: finalResponse.executionTimeMs,
      },
    });

    return finalResponse;
  }
}
