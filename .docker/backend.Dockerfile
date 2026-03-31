# Backend Dockerfile - Express API (Bun)
FROM oven/bun:1.3-alpine AS base

RUN apk add --no-cache dumb-init postgresql-client

WORKDIR /app

# Development stage
FROM base AS dev

COPY backend/package.json backend/bun.lock* ./
RUN bun install

USER root
EXPOSE 3000
CMD ["dumb-init", "bun", "run", "dev"]

# Build stage
FROM base AS build

COPY backend/package.json backend/bun.lock* ./
RUN bun install

COPY backend/src ./src
COPY backend/tsconfig.json ./

RUN bun run build

# Migration stage
FROM base AS migrate

COPY backend/package.json backend/bun.lock* ./
RUN bun install

COPY backend/src ./src
COPY backend/tsconfig.json ./
COPY backend/drizzle ./drizzle

CMD ["bun", "run", "migrate"]

# Production stage
FROM base AS prod

ENV NODE_ENV=production

COPY backend/package.json backend/bun.lock* ./
RUN bun install --production

COPY backend/src ./src
COPY backend/tsconfig.json ./

RUN mkdir -p uploads logs invoices && chown -R bun:bun /app

USER bun

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:3000/health || exit 1

CMD ["dumb-init", "bun", "run", "src/index.ts"]
