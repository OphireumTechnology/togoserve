/**
 * TOGOSERVE AI CORE - SERVER-SIDE GEMINI API GATEWAY
 * Secure server-side proxy handling authenticated LLM inference requests.
 * Secrets are loaded from server environment variables (process.env.GEMINI_API_KEY) only.
 */

import express, { Request, Response } from 'express';
import { GeminiProvider } from '../ai/providers/GeminiProvider';
import { MockAIProvider } from '../ai/providers/MockAIProvider';
import { AIProvider } from '../ai/providers/AIProvider';

export function createAIRouter(): express.Router {
  const router = express.Router();
  router.use(express.json());

  // Determine active provider: use GeminiProvider if GEMINI_API_KEY present; else deterministic MockAIProvider
  let activeProvider: AIProvider;
  if (process.env.GEMINI_API_KEY) {
    activeProvider = new GeminiProvider(process.env.GEMINI_API_KEY);
  } else {
    activeProvider = new MockAIProvider();
  }

  // Health check endpoint
  router.get('/health', async (_req: Request, res: Response) => {
    try {
      const health = await activeProvider.healthCheck();
      res.json({
        status: 'ok',
        provider: health.provider,
        health,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      res.status(503).json({
        status: 'degraded',
        error: err.message,
        timestamp: new Date().toISOString(),
      });
    }
  });

  // Server-side generate endpoint (never exposes API key to client)
  router.post('/generate', async (req: Request, res: Response) => {
    const { prompt, systemInstruction } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Missing prompt in request body' });
    }

    try {
      const text = await activeProvider.generate(prompt, { systemInstruction });
      res.json({ text, provider: activeProvider.name, timestamp: new Date().toISOString() });
    } catch (err: any) {
      res.status(500).json({ error: err.message, provider: activeProvider.name });
    }
  });

  // Server-side structured generation endpoint
  router.post('/generate-structured', async (req: Request, res: Response) => {
    const { prompt, schemaDescription } = req.body;
    if (!prompt || !schemaDescription) {
      return res.status(400).json({ error: 'Missing prompt or schemaDescription' });
    }

    try {
      const data = await activeProvider.generateStructured(prompt, schemaDescription);
      res.json({ data, provider: activeProvider.name, timestamp: new Date().toISOString() });
    } catch (err: any) {
      res.status(500).json({ error: err.message, provider: activeProvider.name });
    }
  });

  return router;
}
