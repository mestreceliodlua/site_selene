# =============================================================================
# 🧠 NeuroEval v2.0 - Dockerfile Multi-stage Build
# =============================================================================
# Otimizado para: Produção ( menores layers, imagem final ~100MB )
# =============================================================================

# =============================================================================
# Stage 1: Builder (Dependencies & Build)
# =============================================================================
FROM node:20-alpine AS builder

# Definir diretório de trabalho
WORKDIR /app

# Instalar dependências do sistema necessárias para node-alpine
# (tiff, fontconfig para Chart.js, bash para scripts)
RUN apk add --no-cache \
    bash \
    git

# Copiar arquivos de package (melhor camada de cache)
COPY package.json package-lock.json* ./

# Instalar dependências de produção e dev
# --ignore-scripts para evitar scripts postinstall desnecessários
RUN npm config set legacy-peer-deps true && \
    npm install --frozen-lockfile 2>/dev/null && \
    npm prune --production 2>/dev/null

# =============================================================================
# Stage 2: Dependencies (Dev Dependencies)
# =============================================================================
# Copiar apenas devDependencies necessários para testes
COPY package.json ./
RUN npm install --frozen-lockfile 2>/dev/null

# =============================================================================
# Stage 3: Production (Runtime)
# =============================================================================
FROM node:20-alpine AS production

# Criar usuário não-root para segurança
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copiar apenas o necessário do builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Copy application code
COPY --chown=appuser:appgroup . .

# Definir ambiente de produção
ENV NODE_ENV=production
ENV PORT=3000

# Expor porta
EXPOSE 3000

# Definir usuário não-root
USER appuser

# Comando de inicialização
CMD ["npm", "run", "dev"]

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
  --start-period=10s \
  --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1