# ==============================================================================
# STAGE 1: Build Stage
# ==============================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies required for native modules if needed
RUN apk add --no-cache libc6-compat

# Copy package files for optimal Docker caching layer
COPY package.json package-lock.json ./

# Install dependencies deterministically
RUN npm ci

# Copy full application source
COPY . .

# Environment flag for production build
ENV NODE_ENV=production

# Build Astro static output (dist/)
RUN npm run build

# ==============================================================================
# STAGE 2: Production Web Server Stage (Nginx Alpine)
# ==============================================================================
FROM nginx:alpine AS runner

LABEL maintainer="SportivERF SRE Team <sre@sportiverf.com>"
LABEL description="Production container for SportivERF Astro Website"

# Install curl for container health checks
RUN apk add --no-cache curl

# Remove default Nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy built static site from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

# Set proper permissions for static asset directory
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

EXPOSE 80

# Container Healthcheck using local HTTP endpoint
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:80/health || exit 1

# Run Nginx in foreground (master process binds port 80 and manages worker processes as user nginx)
CMD ["nginx", "-g", "daemon off;"]
