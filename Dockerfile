# Stage 1: Build
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
COPY .env .env
RUN npm install

# Copy source code
COPY . .

# Build the Astro project
RUN npm run build

# Stage 2: Production
FROM node:22-alpine AS runner

# Install a minimal production server
WORKDIR /app

# Copy output from build stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.env .env
# Reinstall only production dependencies
RUN npm install --omit=dev

# Expose default Astro port
EXPOSE 4321

# Start the Astro production server
CMD ["node", "./dist/server/entry.mjs"]
