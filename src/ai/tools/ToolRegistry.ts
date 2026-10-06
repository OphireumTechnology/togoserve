/**
 * TOGOSERVE AI CORE - TOOL REGISTRY
 */

import { AgentTool } from '../core/types';
import { AIPlatformError } from '../core/errors';

export class ToolRegistry {
  private static instance: ToolRegistry;
  private tools = new Map<string, AgentTool>();

  private constructor() {}

  public static getInstance(): ToolRegistry {
    if (!ToolRegistry.instance) {
      ToolRegistry.instance = new ToolRegistry();
    }
    return ToolRegistry.instance;
  }

  public register(tool: AgentTool): void {
    if (this.tools.has(tool.toolId)) {
      throw new AIPlatformError(`Tool ${tool.toolId} already registered`, 'DUPLICATE_TOOL');
    }
    this.tools.set(tool.toolId, tool);
  }

  public get(toolId: string): AgentTool | undefined {
    return this.tools.get(toolId);
  }

  public list(): AgentTool[] {
    return Array.from(this.tools.values());
  }

  public has(toolId: string): boolean {
    return this.tools.has(toolId);
  }
}
