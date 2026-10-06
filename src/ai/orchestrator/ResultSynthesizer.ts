/**
 * TOGOSERVE AI CORE - RESULT SYNTHESIZER
 */

import { AgentActionProposal, AgentResponse } from '../core/types';

export class ResultSynthesizer {
  public static synthesize(
    requestId: string,
    responses: AgentResponse[]
  ): AgentResponse {
    if (responses.length === 0) {
      return {
        requestId,
        agentId: 'A00',
        status: 'FALLBACK',
        summary: 'No agents were executed for this request.',
        data: {},
        confidence: 0,
        timestamp: new Date().toISOString(),
      };
    }

    const summaries = responses.map((r) => `[${r.agentId}] ${r.summary}`).join(' | ');
    const mergedData: Record<string, any> = {};
    const allActions: AgentActionProposal[] = [];
    const allRecommendations: string[] = [];
    let confidenceSum = 0;

    for (const r of responses) {
      Object.assign(mergedData, { [r.agentId]: r.data });
      if (r.proposedActions) {
        allActions.push(...r.proposedActions);
      }
      if (r.recommendations) {
        allRecommendations.push(...r.recommendations);
      }
      confidenceSum += r.confidence;
    }

    return {
      requestId,
      agentId: 'A00',
      status: 'SUCCESS',
      summary: `Synthesized multi-agent coordination: ${summaries}`,
      data: mergedData,
      recommendations: Array.from(new Set(allRecommendations)),
      proposedActions: allActions.length > 0 ? allActions : undefined,
      confidence: +(confidenceSum / responses.length).toFixed(2),
      timestamp: new Date().toISOString(),
    };
  }
}
