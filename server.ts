/**
 * TOGOSERVE FULL-STACK SERVER
 * Express server hosting secure server-side AI API proxy and mounting Vite in development.
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createAIRouter } from './src/server/aiServer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  // Mount server-side AI API gateway
  app.use('/api/ai', createAIRouter());

  if (!isProd) {
    // In development: mount Vite middlewares
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production: serve static build
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
