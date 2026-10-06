/**
 * TOGOSERVE AI CORE - ERROR DEFINITIONS
 */

export class AIPlatformError extends Error {
  public code: string;
  public details?: Record<string, any>;

  constructor(message: string, code = 'AI_PLATFORM_ERROR', details?: Record<string, any>) {
    super(message);
    this.name = 'AIPlatformError';
    this.code = code;
    this.details = details;
  }
}

export class AgentExecutionError extends AIPlatformError {
  constructor(agentId: string, message: string, details?: Record<string, any>) {
    super(`[${agentId}] Execution failed: ${message}`, 'AGENT_EXECUTION_ERROR', { agentId, ...details });
    this.name = 'AgentExecutionError';
  }
}

export class PolicyViolationError extends AIPlatformError {
  constructor(policyName: string, reason: string, details?: Record<string, any>) {
    super(`Policy violation [${policyName}]: ${reason}`, 'POLICY_VIOLATION_ERROR', { policyName, reason, ...details });
    this.name = 'PolicyViolationError';
  }
}

export class TenantViolationError extends AIPlatformError {
  constructor(requestedTenant: string, actualTenant: string) {
    super(
      `Cross-tenant access violation: requested=${requestedTenant}, authorized=${actualTenant}`,
      'TENANT_VIOLATION_ERROR',
      { requestedTenant, actualTenant }
    );
    this.name = 'TenantViolationError';
  }
}

export class UnauthorizedToolError extends AIPlatformError {
  constructor(agentId: string, toolId: string, requiredPermission?: string) {
    super(
      `Agent ${agentId} is not authorized to invoke tool ${toolId}${requiredPermission ? ` (missing ${requiredPermission})` : ''}`,
      'UNAUTHORIZED_TOOL_ERROR',
      { agentId, toolId, requiredPermission }
    );
    this.name = 'UnauthorizedToolError';
  }
}

export class ProviderFailureError extends AIPlatformError {
  constructor(providerName: string, message: string, details?: Record<string, any>) {
    super(`AI Provider [${providerName}] failure: ${message}`, 'PROVIDER_FAILURE_ERROR', { providerName, ...details });
    this.name = 'ProviderFailureError';
  }
}

export class HITLRequiredError extends AIPlatformError {
  public proposalId: string;
  public riskLevel: string;

  constructor(proposalId: string, riskLevel: string, reason: string) {
    super(`Action proposal #${proposalId} requires Human-in-the-Loop review (${riskLevel}): ${reason}`, 'HITL_REQUIRED_ERROR', {
      proposalId,
      riskLevel,
      reason,
    });
    this.name = 'HITLRequiredError';
    this.proposalId = proposalId;
    this.riskLevel = riskLevel;
  }
}
