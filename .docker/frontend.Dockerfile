# Frontend Dockerfile - Vue 3 (100% Bun)
FROM oven/bun:1.3-alpine AS base
WORKDIR /app

# Development stage
FROM base AS dev

RUN apk add --no-cache dumb-init

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY --chown=root:root frontend/package.json frontend/bun.lock* ./
RUN bun install

USER root
EXPOSE 3010

CMD ["dumb-init", "bun", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3010"]

# Build stage — install + build in same stage so .bin symlinks stay intact
FROM base AS build

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY frontend/package.json frontend/bun.lock* ./
RUN bun install
COPY frontend/ ./
RUN bun ./node_modules/vue-tsc/bin/vue-tsc.js --noEmit && bun ./node_modules/vite/bin/vite.js build

# Production stage - static files served by nginx (Traefik handles routing)
FROM nginx:alpine AS prod

COPY --from=build /app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY .docker/nginx/frontend-prod.conf /etc/nginx/conf.d/default.conf

EXPOSE 3010

# NO healthcheck — Traefik must register this container immediately on start
CMD ["nginx", "-g", "daemon off;"]
