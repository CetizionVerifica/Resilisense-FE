# Build stage
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install -f

# Copy all files
COPY . .

# Build app
RUN npm run build

# Production stage
FROM nginx:alpine

# Install dependencies
RUN apk add --no-cache bash

# Copy built files from build stage to nginx serve directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy configuration script
COPY ./nginx-config.sh /docker-entrypoint.d/
RUN chmod +x /docker-entrypoint.d/nginx-config.sh

# Expose port 80
EXPOSE 80

# Environment variable for backend URL
ENV EC2_BACKEND_URL=http://localhost:8080

# Start nginx with our custom script
CMD ["/docker-entrypoint.d/nginx-config.sh"]