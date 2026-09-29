# ---- 1. Dependencias ----
FROM docker.io/library/node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# npm install respeta package-lock.json; se usa en lugar de "npm ci" porque el lock
# generado en glibc omite dependencias opcionales de sharp para Alpine (musl)
RUN npm install --no-audit --no-fund

# ---- 2. Build (valida las preguntas y genera las páginas estáticas) ----
FROM docker.io/library/node:24-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1 \
    NEXT_OUTPUT=standalone
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- 3. Imagen final mínima ----
FROM docker.io/library/node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 -G nodejs nextjs
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
