FROM node:20 AS deps

WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy prisma schema before install
COPY prisma ./prisma

# Install dependencies
RUN npm install

# ----------------------------

FROM node:20 AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

# Copy app source
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build Next.js app
RUN npm run build

# ----------------------------

FROM node:20 AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app .

EXPOSE 10000

CMD ["npm", "start"]
