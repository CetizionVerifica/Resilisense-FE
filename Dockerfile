# `web` image (ADR-011): static SPA served by Caddy behind kamal-proxy + Cloudflare. No AWS.
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json orval.config.ts ./
COPY api ./api
COPY src/lib/api-client.ts src/lib/auth-token.ts src/lib/problem.ts ./src/lib/
RUN npm ci --no-audit --no-fund
COPY . .
# API origin baked into the bundle, e.g. https://api.resilisense.org (empty = same origin).
ARG VITE_API_BASE_URL=""
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL} VITE_API_MOCKS=0
RUN npm run build

FROM caddy:2-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv
# Used in the CSP connect-src; set per environment by Kamal.
ENV API_ORIGIN=""
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/healthz || exit 1
