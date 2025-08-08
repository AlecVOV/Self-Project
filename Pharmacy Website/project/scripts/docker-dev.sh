#!/bin/bash

set -e

echo "Setting up MediPharm with Docker..."

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

print_success "Docker and Docker Compose are installed"

print_status "Creating necessary directories..."
mkdir -p uploads logs ssl

if [ ! -f .env ]; then
    print_status "Creating .env file for Docker..."
    cat > .env << EOL
# Docker Development Environment

# Database
DATABASE_URL="file:./dev.db"

# JWT Configuration
JWT_SECRET="docker-dev-jwt-secret-$(openssl rand -hex 16)"
JWT_REFRESH_SECRET="docker-dev-refresh-secret-$(openssl rand -hex 16)"
JWT_EXPIRES_IN="1h"
JWT_REFRESH_EXPIRES_IN="7d"

# App Configuration
NODE_ENV="development"
NUXT_PUBLIC_API_BASE="/api"
NUXT_PUBLIC_APP_NAME="MediPharm"

# File Upload
UPLOAD_DIR="./public/uploads"
MAX_FILE_SIZE="10485760"

# Redis
REDIS_URL="redis://redis-dev:6379"

# Admin Account
ADMIN_EMAIL="admin@pharmacy.com"
ADMIN_PASSWORD="admin123"
EOL
    print_success ".env file created"
fi

print_status "Stopping existing containers..."
docker-compose -f docker-compose.dev.yml down

print_status "Building and starting Docker services..."
docker-compose -f docker-compose.dev.yml up -d --build

print_status "Waiting for services to be ready..."
sleep 30

if docker-compose -f docker-compose.dev.yml ps | grep -q "Up"; then
    print_success "Services are running!"
else
    print_error "Some services failed to start. Check logs with: docker compose -f docker-compose.dev.yml logs"
    exit 1
fi

print_success "Docker development environment is ready!"

echo ""
echo "  Application: http://localhost:3000"
echo "  Prisma Studio: http://localhost:5555"
echo "  Redis: localhost:6379"
echo ""
echo "  docker compose -f docker-compose.dev.yml logs -f        # View logs"
echo "  docker compose -f docker-compose.dev.yml restart       # Restart services"
echo "  docker compose -f docker-compose.dev.yml down          # Stop services"
echo "  docker compose -f docker-compose.dev.yml exec app-dev sh  # Access container"
echo ""
echo "  Admin: admin@pharmacy.com / admin123"
echo "  Customer: customer@example.com / customer123"
