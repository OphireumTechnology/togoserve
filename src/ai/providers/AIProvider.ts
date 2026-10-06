/**
 * TOGOSERVE AI CORE - AI PROVIDER ABSTRACTION
 */

export interface GenerationOptions {
  temperature?: number;
  maxTokens?: number;
  systemInstruction?: string;
  timeoutMs?: number;
}

export interface ProviderHealth {
  ok: boolean;
  provider: string;
  details?: Record<string, any>;
}

export interface AIProvider {
  name: string;
  generate(prompt: string, options?: GenerationOptions): Promise<string>;
  generateStructured<T = any>(
    prompt: string,
    schemaDescription: string,
    options?: GenerationOptions
  ): Promise<T>;
  healthCheck(): Promise<ProviderHealth>;
}
