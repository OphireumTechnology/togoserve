/**
 * TOGOSERVE AI CORE - EXECUTION PLANNER
 */

import { PlannedSubTask } from './TaskDecomposer';

export interface ExecutionStage {
  stageIndex: number;
  tasks: PlannedSubTask[];
}

export class ExecutionPlanner {
  public static createExecutionStages(tasks: PlannedSubTask[]): ExecutionStage[] {
    const stageMap = new Map<number, PlannedSubTask[]>();

    for (const task of tasks) {
      const group = task.parallelGroup;
      if (!stageMap.has(group)) {
        stageMap.set(group, []);
      }
      stageMap.get(group)!.push(task);
    }

    return Array.from(stageMap.entries())
      .sort(([a], [b]) => a - b)
      .map(([stageIndex, stageTasks]) => ({
        stageIndex,
        tasks: stageTasks,
      }));
  }
}
