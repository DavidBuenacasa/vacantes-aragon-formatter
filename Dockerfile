# --- ETAPA 1: Dependencias ---
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copiamos archivos de configuración de npm
COPY package*.json ./
# Instalamos TODO (necesario para compilar)
RUN npm ci

# --- ETAPA 2: Constructor (Builder) ---
FROM node:20-alpine AS builder
WORKDIR /app
# Traemos los módulos instalados
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Desactivamos telemetría y generamos el build
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# --- ETAPA 3: Ejecución (Runner) ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Creamos usuario de seguridad
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# COPIAMOS SOLO LO QUE EL MODO STANDALONE NECESITA
# No hace falta npm install aquí
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

# El servidor se arranca con el archivo generado por Next.js
CMD ["node", "server.js"]