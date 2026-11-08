# ==============================================================================
# TOGOSERVE PRODUCTION FULL-STACK CONTAINER
# Hosts the React Frontend SPA and Express Backend API Gateway (with Auth & AI)
# ==============================================================================

FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy application source
COPY . .

# Build production frontend
RUN npm run build

# ==============================================================================
# Runner stage
# ==============================================================================
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install production and runtime dependencies
COPY package*.json ./
# tsx is required at runtime by NODE_OPTIONS=--import tsx; NODE_ENV=production
# otherwise causes npm ci to omit devDependencies and fail its own lifecycle.
RUN npm ci --include=dev
ENV NODE_OPTIONS="--import tsx"

# Copy build artifacts and server source
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./server.ts
COPY --from=builder /app/src ./src
COPY --from=builder /app/public ./public
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/vite.config.ts ./vite.config.ts

# Persistent data directory for secure auth storage and audit logs
RUN mkdir -p /app/data && chown -R node:node /app

USER node

EXPOSE 3000

CMD ["node", "server.ts"]
