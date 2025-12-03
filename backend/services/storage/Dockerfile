# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Add non-root user
RUN addgroup -g 1001 -S bunker && \
    adduser -S bunker -u 1001 -G bunker

COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force

COPY --from=builder /app/dist ./dist

RUN chown -R bunker:bunker /app

USER bunker

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget -qO- http://127.0.0.1:3000/health || exit 1

CMD ["node", "dist/index.js"]
