# ===========================================
# BUNKER CLOUD - Auth Service Dockerfile
# ===========================================

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S bunker && \
    adduser -S bunker -u 1001 -G bunker

# Install production dependencies only
COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force

# Copy built files
COPY --from=builder /app/dist ./dist

# Set ownership
RUN chown -R bunker:bunker /app

# Switch to non-root user
USER bunker

# Environment
ENV NODE_ENV=production
ENV API_PORT=3000

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget -qO- http://127.0.0.1:3000/health > /dev/null || exit 1

# Start
CMD ["node", "dist/index.js"]
