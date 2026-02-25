# ── ETAPA 1: Builder ──────────────────────────────────────────
FROM node:22-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app

# Dependencias del API
COPY apps/api/package.json ./
COPY apps/api/tsconfig.json ./
RUN pnpm install

# Tipos compartidos del monorepo
COPY packages/types/src/ ./packages/types/src/

# Código fuente del API
COPY apps/api/src/ ./src/

# Compilar TypeScript → JavaScript
RUN pnpm build


# ── ETAPA 2: Production ───────────────────────────────────────
FROM node:22-alpine AS production

RUN npm install -g pnpm

WORKDIR /app

COPY --from=builder /app/package.json ./
RUN pnpm install --prod

COPY --from=builder /app/dist ./dist

EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000

CMD ["node", "dist/index.js"]

