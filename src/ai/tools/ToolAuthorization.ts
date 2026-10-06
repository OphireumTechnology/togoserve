/**
 * TOGOSERVE AI CORE - TOOL AUTHORIZATION & EXECUTOR
 */

import { AgentContext, AgentTool, AgentToolCall } from '../core/types';
import { UnauthorizedToolError } from '../core/errors';
import { ToolRegistry } from './ToolRegistry';

export class ToolAuthorization {
  public static verifyAuthorization(
    tool: AgentTool,
    context: AgentContext
  ): void {
    // 1. Verify tool is in the context's allowed tools list
    if (!context.allowedTools.includes(tool.toolId)) {
      throw new UnauthorizedToolError(context.role, tool.toolId, 'Not in allowedTools');
    }

    // 2. Verify role permissions
    for (const perm of tool.requiredPermissions) {
      if (!context.permissions.includes(perm) && !context.permissions.includes('*') && context.role !== 'SUPER_ADMIN') {
        throw new UnauthorizedToolError(context.role, tool.toolId, perm);
      }
    }
  }
}

export class ToolExecutor {
  public static async executeTool<TInput = any, TOutput = any>(
    toolId: string,
    input: TInput,
    context: AgentContext
  ): Promise<TOutput> {
    const registry = ToolRegistry.getInstance();
    const tool = registry.get(toolId);

    if (!tool) {
      throw new Error(`Tool "${toolId}" not found in ToolRegistry`);
    }

    // Authorize invocation
    ToolAuthorization.verifyAuthorization(tool, context);

    const startTime = Date.now();
    try {
      const output = await tool.execute(input, context);
      const durationMs = Date.now() - startTime;

      const callRecord: AgentToolCall = {
        callId: `call-${Date.now()}`,
        toolId,
        input: (input as any) || {},
        output: (output as any) || {},
        status: 'SUCCESS',
        durationMs,
      };

      context.recordAudit?.({
        requestId: context.requestId,
        actorId: context.actorId,
        tenantId: context.tenantId,
        eventType: 'TOOL_INVOKED',
        resourceType: 'TOOL',
        resourceId: toolId,
        metadata: callRecord,
      });

      return output;
    } catch (err: any) {
      const durationMs = Date.now() - startTime;
      context.recordAudit?.({
        requestId: context.requestId,
        actorId: context.actorId,
        tenantId: context.tenantId,
        eventType: 'TOOL_FAILED',
        resourceType: 'TOOL',
        resourceId: toolId,
        metadata: { error: err.message, durationMs },
      });
      throw err;
    }
  }
}
