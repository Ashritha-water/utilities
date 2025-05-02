# ---- Build Stage ----
    FROM node:22.14.0-alpine AS builder

    WORKDIR /app
    
    # Install deps
    COPY package*.json ./
    RUN npm install
    
    # Copy source
    COPY . .
    
    # Optional: run build script if applicable (e.g. TypeScript or transpile)
    # RUN npm run build
    
    # ---- Production Stage ----
    FROM node:22.14.0-alpine
    
    WORKDIR /app
    
    # Only copy production deps if needed
    COPY --from=builder /app/package*.json ./
    RUN npm install --omit=dev
    
    # Copy the final built app
    COPY --from=builder /app .
    
    # Expose default port
    EXPOSE 3008
    
    CMD ["npm", "run", "dev"]
    