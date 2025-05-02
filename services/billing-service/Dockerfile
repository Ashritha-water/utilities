# ---------- Build Stage ----------
    FROM node:22-alpine AS builder

    WORKDIR /app
    
    COPY package*.json ./
    RUN npm ci
    
    COPY . .
    RUN npm run build
    
    
    # ---------- Production Stage ----------
    FROM node:22-alpine
    
    WORKDIR /app
    
    COPY --from=builder /app/dist ./dist
    COPY --from=builder /app/package*.json ./
    
    RUN npm ci --only=production
    
    ENV NODE_ENV=production
    EXPOSE 3000
    
    CMD ["node", "dist/index.js"]    