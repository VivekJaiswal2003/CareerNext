# Multi-stage build for Next.js 14 production on Google Cloud Run
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies first for better cache behavior.
COPY package.json package-lock.json* ./
RUN npm install

# Copy source and build the app.
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Install only production dependencies.
COPY package.json package-lock.json* ./
RUN npm install --production

# Copy the built application and static assets.
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/next-env.d.ts ./next-env.d.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs

EXPOSE 8080

CMD ["npm", "run", "start"]
