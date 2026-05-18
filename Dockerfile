FROM node:20-alpine AS deps

WORKDIR /app

# Required for Prisma on Alpine
RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./

# Copy prisma schema BEFORE npm install
COPY prisma ./prisma

# Install dependencies
RUN npm install

# ----------------------------

FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

# Copy application
COPY . .

# Generate prisma client + build app
RUN npx prisma generate && npm run build

# ----------------------------

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app .

EXPOSE 3000

CMD ["npm", "start"]
