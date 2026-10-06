/**
 * TOGOSERVE AI CORE - MOCK AI PROVIDER
 * Deterministic provider for repeatable unit tests and offline testing.
 */

import { AIProvider, GenerationOptions, ProviderHealth } from './AIProvider';

export class MockAIProvider implements AIProvider {
  public name = 'MockAIProvider';
  private shouldFail = false;
  private customResponses = new Map<string, any>();

  public setFailMode(fail: boolean): void {
    this.shouldFail = fail;
  }

  public setMockResponse(keySubstring: string, response: any): void {
    this.customResponses.set(keySubstring.toLowerCase(), response);
  }

  public clearMockResponses(): void {
    this.customResponses.clear();
    this.shouldFail = false;
  }

  public async generate(prompt: string, _options?: GenerationOptions): Promise<string> {
    if (this.shouldFail) {
      throw new Error('Simulated MockAIProvider outage');
    }

    for (const [key, val] of this.customResponses.entries()) {
      if (prompt.toLowerCase().includes(key)) {
        return typeof val === 'string' ? val : JSON.stringify(val);
      }
    }

    return `[MockAIProvider] Synthesized response for prompt query: ${prompt.slice(0, 60)}...`;
  }

  public async generateStructured<T = any>(
    prompt: string,
    _schemaDescription: string,
    _options?: GenerationOptions
  ): Promise<T> {
    if (this.shouldFail) {
      throw new Error('Simulated MockAIProvider outage');
    }

    for (const [key, val] of this.customResponses.entries()) {
      if (prompt.toLowerCase().includes(key)) {
        return val as T;
      }
    }

    // Default structured fallback matching AgentResponse data payload
    const defaultData = {
      summary: `Automated deterministic evaluation for query`,
      data: { evaluated: true, querySample: prompt.slice(0, 40) },
      confidence: 0.95,
      recommendations: ['Verified by TOGOSERVE Mock Engine'],
    };

    return defaultData as unknown as T;
  }

  public async healthCheck(): Promise<ProviderHealth> {
    return {
      ok: !this.shouldFail,
      provider: this.name,
      details: { mode: 'deterministic_mock', mockCount: this.customResponses.size },
    };
  }
}
