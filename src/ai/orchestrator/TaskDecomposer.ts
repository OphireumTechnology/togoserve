/**
 * TOGOSERVE AI CORE - TASK DECOMPOSER
 */

import { AgentId, AgentRequest } from '../core/types';
import { ClassifiedIntent } from './IntentClassifier';

export interface PlannedSubTask {
  taskId: string;
  agentId: AgentId;
  description: string;
  dependsOn?: string[];
  parallelGroup: number;
}

export class TaskDecomposer {
  public static decompose(
    request: AgentRequest,
    _classified: ClassifiedIntent,
    selectedAgentIds: AgentId[]
  ): PlannedSubTask[] {
    return selectedAgentIds.map((agentId, index) => ({
      taskId: `task-${request.requestId}-${agentId}`,
      agentId,
      description: `Execute ${agentId} for request: ${request.query.slice(0, 50)}`,
      parallelGroup: index === 0 ? 0 : 1, // First task runs then dependent parallel tasks
      dependsOn: index > 0 && selectedAgentIds.length > 2 ? [`task-${request.requestId}-${selectedAgentIds[0]}`] : undefined,
    }));
  }
}
