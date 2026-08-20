# =============================================================================
# 🧠 NeuroEval v2.0 - Dockerfile Multi-stage Build
# =============================================================================
# Otimizado para: Produção ( menores layers, imagem final ~100MB )
# =============================================================================

# =============================================================================
# Stage 1: Builder (Dependencies & Build)
# =============================================================================
FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache bash git

# Instalar dependências (inclui devDeps para o build do Next.js)
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

# Copiar código e fazer o build do Next.js
COPY . .
RUN npm run build

# =============================================================================
# Stage 2: Production (Runtime)
# =============================================================================
FROM node:20-alpine AS production

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copiar artefatos do build
COPY --from=builder --chown=appuser:appgroup /app/public* ./public/
COPY --from=builder --chown=appuser:appgroup /app/.next/standalone ./
COPY --from=builder --chown=appuser:appgroup /app/.next/static ./.next/static

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

USER appuser

# Usar o servidor standalone do Next.js
CMD ["node", "server.js"]

HEALTHCHECK --interval=30s --timeout=5s \
  --start-period=30s \
  --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1