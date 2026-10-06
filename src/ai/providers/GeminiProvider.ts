/**
 * TOGOSERVE AI CORE - GEMINI PROVIDER
 * Governed server-side provider utilizing Google GenAI SDK.
 */

import { GoogleGenAI } from '@google/genai';
import { AIProvider, GenerationOptions, ProviderHealth } from './AIProvider';
import { ProviderFailureError } from '../core/errors';

export class GeminiProvider implements AIProvider {
  public name = 'GeminiProvider';
  private aiClient: GoogleGenAI | null = null;
  private defaultModel = 'gemini-2.5-flash';

  constructor(apiKey?: string) {
    const key = apiKey || (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : undefined);
    if (key) {
      try {
        this.aiClient = new GoogleGenAI({ apiKey: key });
      } catch (err) {
        console.warn('[GeminiProvider] Initialization notice:', err);
      }
    }
  }

  public async generate(prompt: string, options?: GenerationOptions): Promise<string> {
    if (!this.aiClient) {
      throw new ProviderFailureError(
        this.name,
        'Server GEMINI_API_KEY is not configured or client is running in browser context. Graceful fallback active.'
      );
    }

    try {
      const response = await this.aiClient.models.generateContent({
        model: this.defaultModel,
        contents: prompt,
        config: {
          temperature: options?.temperature ?? 0.2,
          systemInstruction: options?.systemInstruction,
        },
      });

      return response.text || '';
    } catch (err: any) {
      throw new ProviderFailureError(this.name, err?.message || 'Gemini API call failed');
    }
  }

  public async generateStructured<T = any>(
    prompt: string,
    schemaDescription: string,
    options?: GenerationOptions
  ): Promise<T> {
    const structuredPrompt = `${prompt}\n\nYou must return strictly valid JSON matching this schema: ${schemaDescription}.\nDo not include code markdown formatting or explanation, only raw JSON.`;
    const rawText = await this.generate(structuredPrompt, options);

    try {
      // Clean possible markdown code fences if model returned them
      const cleanJson = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
      return JSON.parse(cleanJson) as T;
    } catch (parseError) {
      throw new ProviderFailureError(
        this.name,
        `Malformed structured response from Gemini: ${(parseError as Error).message}. Raw output: ${rawText.slice(0, 100)}...`
      );
    }
  }

  public async healthCheck(): Promise<ProviderHealth> {
    return {
      ok: Boolean(this.aiClient),
      provider: this.name,
      details: {
        model: this.defaultModel,
        configured: Boolean(this.aiClient),
      },
    };
  }
}
