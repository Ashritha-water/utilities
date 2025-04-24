# ---------- Build Stage ----------
    FROM node:22-alpine AS builder

    WORKDIR /app
    
    # Copy dependencies and install them
    COPY package*.json ./
    RUN npm ci
    
    # Copy the source code
    COPY . .
    
    # Build the project (if using TypeScript or similar)
    RUN npm run build
    
    
    # ---------- Development Stage ----------
    FROM node:22-alpine
    
    WORKDIR /app
    
    # Copy only what’s needed from builder
    COPY --from=builder /app ./
    
    # Install only production dependencies if needed
    # or keep full install for development mode
    RUN npm ci
    
    EXPOSE 3001
    
    CMD ["npm", "run", "dev"]    