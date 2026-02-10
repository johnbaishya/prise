# ============================
# Stage 1: Build Stage
# ============================
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files first for caching
COPY package*.json ./

# Install all dependencies (dev + prod)
RUN npm install

# Copy all project files
COPY . .

# Build TypeScript into dist/
RUN npm run build

# ============================
# Stage 2: Production Stage
# ============================
FROM node:20-alpine AS prod

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy compiled code from build stage
COPY --from=build /app/dist ./dist

# Expose port
EXPOSE 3000

# Start production server
CMD ["npm", "start"]

# ============================
# Stage 3: Development Stage
# ============================
FROM node:20-alpine AS dev

WORKDIR /app

# Copy package files and install all deps (dev + prod)
COPY package*.json ./
RUN npm install

# Copy full source code
COPY . .

# Expose port
EXPOSE 3000

# Start dev server with nodemon
CMD ["npm", "run", "dev"]
