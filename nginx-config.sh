#!/bin/sh

# Default to localhost if EC2_BACKEND_URL is not set
BACKEND_URL=${EC2_BACKEND_URL:-http://localhost:8080}

# Create the nginx config with the correct backend URL
cat > /etc/nginx/conf.d/default.conf << EOF
server {
    listen 80;
    server_name _;
    
    # Root location for React app
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files \$uri \$uri/ /index.html;
    }
    
    # Proxy API requests to your EC2 backend
    location /api/ {
        proxy_pass ${BACKEND_URL}/api/;

        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Proxy GraphQL requests to your EC2 backend
    location /graphql {
        proxy_pass ${BACKEND_URL}/graphql;

        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Proxy public file requests to your EC2 backend
    location /public/ {
        proxy_pass ${BACKEND_URL}/public/;

        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Start nginx
exec nginx -g 'daemon off;'