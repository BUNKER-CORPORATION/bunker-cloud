FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built files
COPY dist/ ./dist/

# Create non-root user
RUN addgroup -g 1001 bunker && adduser -u 1001 -G bunker -s /bin/sh -D bunker
USER bunker

# Environment
ENV NODE_ENV=production
ENV API_PORT=3000
ENV API_HOST=0.0.0.0

EXPOSE 3000

CMD ["node", "dist/index.js"]
