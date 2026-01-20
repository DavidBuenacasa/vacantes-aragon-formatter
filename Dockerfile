# --- ETAPA 1: Dependencias ---
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copiamos los archivos de definición. 
# El asterisco asegura que se copie package-lock.json si existe.
COPY package*.json ./

# Instalamos todas las dependencias (necesarias para el build)
RUN npm ci

# --- ETAPA 2: Construcción (Builder) ---
FROM node:20-alpine AS builder
WORKDIR /app

# Copiamos las dependencias instaladas de la etapa 'deps'
COPY --from=deps /app/node_modules ./node_modules
# Copiamos todo el resto del código fuente
COPY . .

# Desactivamos telemetría y compilamos
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# --- ETAPA 3: Ejecución (Runner) ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Seguridad: Usuario no-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Usamos la salida 'standalone' de Next.js (necesita config en next.config.mjs)
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]