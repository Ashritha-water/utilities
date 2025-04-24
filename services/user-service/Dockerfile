FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependencies and install them
COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

# ---------- Development Stage ----------
FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app ./

RUN npm ci

EXPOSE 3005

CMD [ "npm", "run", "dev" ]