# ── ETAPA 1: Builder ──────────────────────────────────────────
# Usamos Node 22 Alpine como base — Alpine es una distro Linux
# minimalista (~5MB) vs la imagen completa (~900MB)
FROM node:22-alpine AS builder

# Instalar pnpm globalmente dentro del contenedor
RUN npm install -g pnpm

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar solo los archivos de dependencias primero
# Docker cachea esta capa — si no cambia package.json,
# no reinstala dependencias en el próximo build

# Las rutas ahora son relativas a la raíz del monorepo
COPY apps/api/package.json ./
COPY apps/api/tsconfig.json ./

# Instalar SOLO dependencias de producción + las de build
RUN pnpm install

# Copiar el código fuente
COPY src/ ./src/

# Compilar TypeScript → JavaScript en dist/
RUN pnpm build


# ── ETAPA 2: Production ───────────────────────────────────────
# Nueva imagen limpia — no hereda nada del builder
# excepto lo que copiemos explícitamente
FROM node:22-alpine AS production

RUN npm install -g pnpm

WORKDIR /app

# Copiar dependencias y código compilado desde el builder
COPY package.json ./
RUN pnpm install --prod

# Solo copiamos dist/ — sin TypeScript, sin código fuente
COPY --from=builder /app/dist ./dist

# Puerto que expone el contenedor (documentativo)
EXPOSE 3000

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=3000

# Comando que ejecuta el contenedor al iniciarse
CMD ["node", "dist/index.js"]
