# ── ETAPA 1: Builder ──────────────────────────────────────────
FROM node:22-alpine AS builder

# 👇 NUEVO: ARG para secretos en tiempo de construcción
ARG DATABASE_URL

RUN npm install -g pnpm

WORKDIR /app

# Dependencias del API y configuración
COPY apps/api/package.json ./
COPY apps/api/tsconfig.json ./

# 👇 NUEVO: Copiamos Prisma ANTES de instalar para poder generarlo
COPY apps/api/prisma ./prisma

RUN pnpm install

# Tipos compartidos del monorepo (¡Tu toque maestro!)
COPY packages/types/src/ ./packages/types/src/

# 👇 NUEVO: Generamos el motor de la base de datos (Prisma Client)
RUN pnpm dlx prisma generate

# Código fuente del API
COPY apps/api/src/ ./src/

# Compilar TypeScript → JavaScript
RUN pnpm build


# ── ETAPA 2: Production ───────────────────────────────────────
FROM node:22-alpine AS production

RUN npm install -g pnpm

WORKDIR /app

# 👇 NUEVO: ENV para variables en tiempo de ejecución (Producción real)
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/package.json ./

# 👇 NUEVO: Con Prisma es vital copiar el node_modules del builder
# porque el cliente de base de datos se compila ahí adentro.
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["node", "dist/index.js"]
