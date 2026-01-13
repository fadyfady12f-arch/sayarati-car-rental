# Sayarati Car Rental - Makefile
# ================================

.PHONY: help install dev build start stop logs clean db-migrate db-seed

# Default target
help:
	@echo "Sayarati Car Rental - Available Commands"
	@echo "========================================="
	@echo ""
	@echo "Development:"
	@echo "  make install      - Install all dependencies"
	@echo "  make dev          - Start development environment (Docker)"
	@echo "  make dev-local    - Start development locally (without Docker)"
	@echo ""
	@echo "Production:"
	@echo "  make build        - Build production images"
	@echo "  make start        - Start production environment"
	@echo "  make stop         - Stop all containers"
	@echo ""
	@echo "Database:"
	@echo "  make db-migrate   - Run database migrations"
	@echo "  make db-seed      - Seed database with sample data"
	@echo "  make db-reset     - Reset database (WARNING: destroys data)"
	@echo ""
	@echo "Utilities:"
	@echo "  make logs         - View container logs"
	@echo "  make clean        - Remove all containers and volumes"
	@echo "  make shell-backend  - Open shell in backend container"
	@echo "  make shell-frontend - Open shell in frontend container"

# Install dependencies
install:
	@echo "Installing backend dependencies..."
	cd backend && npm install
	@echo "Installing frontend dependencies..."
	cd frontend && npm install
	@echo "Generating Prisma client..."
	cd backend && npx prisma generate
	@echo "Done!"

# Development with Docker
dev:
	@echo "Starting development environment..."
	docker-compose -f docker-compose.dev.yml up --build

# Development without Docker (local)
dev-local:
	@echo "Starting local development..."
	@echo "Make sure PostgreSQL and Redis are running locally!"
	@(cd backend && npm run dev) & (cd frontend && npm run dev)

# Build for production
build:
	@echo "Building production images..."
	docker-compose build

# Start production
start:
	@echo "Starting production environment..."
	docker-compose up -d

# Stop all containers
stop:
	@echo "Stopping containers..."
	docker-compose down
	docker-compose -f docker-compose.dev.yml down

# View logs
logs:
	docker-compose logs -f

logs-backend:
	docker-compose logs -f backend

logs-frontend:
	docker-compose logs -f frontend

# Database commands
db-migrate:
	@echo "Running database migrations..."
	cd backend && npx prisma migrate deploy

db-migrate-dev:
	@echo "Running development migrations..."
	cd backend && npx prisma migrate dev

db-seed:
	@echo "Seeding database..."
	cd backend && npx prisma db seed

db-reset:
	@echo "WARNING: This will delete all data!"
	@read -p "Are you sure? [y/N] " confirm && [ "$$confirm" = "y" ]
	cd backend && npx prisma migrate reset --force

db-studio:
	@echo "Opening Prisma Studio..."
	cd backend && npx prisma studio

# Shell access
shell-backend:
	docker-compose exec backend sh

shell-frontend:
	docker-compose exec frontend sh

shell-postgres:
	docker-compose exec postgres psql -U sayarati -d sayarati_db

# Clean up
clean:
	@echo "Removing all containers and volumes..."
	docker-compose down -v --remove-orphans
	docker-compose -f docker-compose.dev.yml down -v --remove-orphans
	@echo "Cleaning node_modules..."
	rm -rf backend/node_modules frontend/node_modules
	@echo "Done!"

# Type checking
typecheck:
	@echo "Type checking backend..."
	cd backend && npx tsc --noEmit
	@echo "Type checking frontend..."
	cd frontend && npx tsc --noEmit

# Linting
lint:
	@echo "Linting backend..."
	cd backend && npm run lint
	@echo "Linting frontend..."
	cd frontend && npm run lint

# Testing
test:
	@echo "Running backend tests..."
	cd backend && npm test
	@echo "Running frontend tests..."
	cd frontend && npm test

# Format code
format:
	@echo "Formatting code..."
	cd backend && npx prettier --write "src/**/*.ts"
	cd frontend && npx prettier --write "src/**/*.{ts,tsx}"
