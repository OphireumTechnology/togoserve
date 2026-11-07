/**
 * TOGOSERVE FULL-STACK SERVER
 * Express server hosting secure server-side AI API proxy and mounting Vite in development.
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createAIRouter } from './src/server/aiServer';
import { createAuthRouter } from './src/server/authServer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  // CORS & Security headers
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Mount server-side authentication & AI API gateways
  app.use('/api/auth', createAuthRouter());
  app.use('/api/ai', createAIRouter());

  // Strict API 404 handler - guarantees API requests NEVER fall through to index.html
  app.all('/api/*', (req, res) => {
    res.status(404).json({
      success: false,
      error: `API route ${req.method} ${req.path} not found. Ensure the Express authentication service is active.`,
      status: 404,
      timestamp: new Date().toISOString(),
    });
  });

  if (!isProd) {
    // In development: mount Vite middlewares
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production: serve static build for non-API client routes
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[TOGOSERVE] Platform running on http://0.0.0.0:${PORT} (Node.js runtime)`);
  });
}

startServer().catch((err) => {
  console.error('[TOGOSERVE] Failed to start server:', err);
  process.exit(1);
});
