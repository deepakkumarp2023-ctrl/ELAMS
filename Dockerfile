# ═══════════════════════════════════════════
# ELAMS — Dockerfile (Backend)
# Multi-stage build for production efficiency
# ═══════════════════════════════════════════

# ── Stage 1: Builder ────────────────────────
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first (layer caching optimization)
COPY server/package*.json ./

# Install all dependencies (including dev)
RUN npm ci

# Copy source code
COPY server/ .

# ── Stage 2: Production ─────────────────────
FROM node:20-alpine AS production

# Security: create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S elams -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY server/package*.json ./

# Install production dependencies only
RUN npm ci --production && \
    npm cache clean --force

# Copy application code from builder
COPY --from=builder /app .

# Set ownership to non-root user
RUN chown -R elams:nodejs /app

# Switch to non-root user
USER elams

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Start the application
CMD ["node", "index.js"]
