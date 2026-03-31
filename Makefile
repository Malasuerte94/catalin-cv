# catalin-ene - Docker Makefile
# Usage: make [target]

.PHONY: help dev dev-up dev-down sync logs dev-logs-backend clean-images status status-prod deploy restart-prod stop-prod logs-prod db-migrate db-generate-migration add add-fe clean-modules db-seed db-truncate vite-reset db-push db-wipe db-wipe-prod generate-admin generate-admin-prod

DOCKER_COMPOSE := $(shell if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then echo "docker compose"; elif command -v docker-compose >/dev/null 2>&1; then echo "docker-compose"; else echo ""; fi)

ifdef SUDO
    DOCKER_COMPOSE := $(SUDO) $(DOCKER_COMPOSE)
endif

detect-docker-compose:
	@if [ -z "$(DOCKER_COMPOSE)" ]; then \
		echo "❌ Docker Compose not found"; \
		exit 1; \
	fi

check-docker-permissions:
	@if ! $(DOCKER_COMPOSE) version >/dev/null 2>&1; then \
		echo "❌ Docker permission denied"; \
		echo "Run: sudo usermod -aG docker $$USER && newgrp docker"; \
		exit 1; \
	fi

help:
	@echo "catalin-ene Commands"
	@echo ""
	@echo "Development:"
	@echo "  dev              - Start dev environment (first time / full rebuild)"
	@echo "  dev-up           - Start dev containers (with build)"
	@echo "  dev-down         - Stop dev containers"
	@echo "  sync             - Sync node_modules to local for IDE"
	@echo "  add PKG=name     - Add package to backend"
	@echo "  add-fe PKG=name  - Add package to frontend"
	@echo "  logs             - View logs"
	@echo "  status           - Check dev service status"
	@echo "  db-migrate       - Run DB migrations"
	@echo "  db-generate-migration - Generate new migration"
	@echo "  db-seed          - Seed DB with Romanian sample data"
	@echo "  db-truncate      - Truncate bookings and invoices tables"
	@echo "  db-wipe          - Wipe database (drop all tables)"
	@echo "  generate-admin   - Create admin (Usage: make generate-admin EMAIL=... PASSWORD=...)"
	@echo "  db-push          - Push schema changes to database (no data loss)"
	@echo ""
	@echo "Production:"
	@echo "  deploy           - Full deploy (pull, build, migrate, start)"
	@echo "  restart-prod     - Restart production services"
	@echo "  status-prod      - Check production service status"
	@echo "  logs-prod        - View production logs"
	@echo "  stop-prod        - Stop production containers"
	@echo "  db-wipe-prod     - Wipe production database (drop all tables)"
	@echo "  generate-admin-prod - Create admin on prod (Usage: make generate-admin-prod EMAIL=... PASSWORD=...)"
	@echo ""
	@echo "Maintenance:"
	@echo "  clean-images     - Remove unused Docker images"
	@echo "  clean-modules    - Fix corrupted node_modules"
	@echo ""

dev: detect-docker-compose
	@echo "🚀 Starting catalin-ene dev environment..."
	@sudo rm -rf backend/node_modules frontend/node_modules 2>/dev/null || true
	@mkdir -p backend/uploads && chmod 777 backend/uploads 2>/dev/null || true
	@echo "🗄️  Starting database..."
	@DOCKER_BUILDKIT=1 $(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.dev.yml --env-file .env up -d --build postgres
	@echo "⏳ Waiting for database..."
	@sleep 8
	@echo "🚀 Starting all services..."
	@DOCKER_BUILDKIT=1 $(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.dev.yml --env-file .env up -d --build
	@sleep 5
	@echo "🔄 Syncing node_modules for IDE..."
	@$(MAKE) sync
	@echo ""
	@echo "✅ Ready!"
	@echo "   🌐 App:      http://localhost"
	@echo "   🔧 API:      http://localhost/api"
	@echo "   📊 Backend:  http://localhost:3000"
	@echo "   🎨 Frontend: http://localhost:3010"
	@echo "   📦 Portainer: http://localhost/portainer"
	@echo ""
	@$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.dev.yml ps

dev-up: detect-docker-compose
	@echo "🚀 Starting catalin-ene dev environment..."
	@DOCKER_BUILDKIT=1 $(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.dev.yml --env-file .env up -d --build
	@echo "⏳ Installing dependencies..."
	@$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.dev.yml exec -T backend sh -c "cd /app && bun install" || true
	@$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.dev.yml exec -T frontend sh -c "cd /app && bun install" || true
	@echo "✅ http://localhost"

dev-down: detect-docker-compose
	@echo "🛑 Stopping catalin-ene dev environment..."
	@$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.dev.yml down
	@echo "✅ Stopped."

sync: detect-docker-compose
	@echo "🔄 Syncing node_modules..."
	@sudo rm -rf backend/node_modules frontend/node_modules 2>/dev/null || true
	@mkdir -p backend/node_modules frontend/node_modules
	@$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.dev.yml exec -T backend tar -cf - -C /app node_modules 2>/dev/null | tar -xf - -C backend/ || echo "⚠️  Backend not running"
	@$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.dev.yml exec -T frontend tar -cf - -C /app node_modules 2>/dev/null | tar -xf - -C frontend/ || echo "⚠️  Frontend not running"
	@echo "✅ Synced!"

logs: detect-docker-compose
	@$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.dev.yml logs -f

dev-logs-backend: detect-docker-compose
	@$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.dev.yml logs --tail=100 -f backend

db-migrate: detect-docker-compose
	@echo "🔄 Running migrations..."
	@$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.dev.yml exec backend bun run migrate

db-seed: detect-docker-compose
	@echo "🌱 Seeding database with Romanian sample data..."
	@$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.dev.yml --env-file .env exec -T postgres psql -U catalin_ene -d catalin_ene_dev < backend/drizzle/seed.sql
	@echo "✅ Database seeded!"

db-truncate: detect-docker-compose
	@echo "🗑️  Truncating all transactional data (except essential system tables)..."
	@$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.dev.yml --env-file .env exec -T postgres psql -U catalin_ene -d catalin_ene_dev -c "TRUNCATE TABLE invoices, bookings, reviews, ical_blocked_dates, ical_feeds, unit_blocked_days, unit_pricing_rules, units, properties RESTART IDENTITY CASCADE;"
	@echo "✅ Database truncated!"

db-wipe: detect-docker-compose
	@echo "💥 Wiping all tables from database..."
	@$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.dev.yml --env-file .env exec -T postgres sh -c 'psql -U "$$POSTGRES_USER" -d "$$POSTGRES_DB" -c "DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public; DROP SCHEMA IF EXISTS drizzle CASCADE; GRANT ALL ON SCHEMA public TO \"$$POSTGRES_USER\"; GRANT ALL ON SCHEMA public TO public;"'
	@echo "✅ Database wiped clean! Run '\''make db-migrate'\'' to recreate schema."

generate-admin: detect-docker-compose
	@if [ -z "$(EMAIL)" ] || [ -z "$(PASSWORD)" ]; then echo "Usage: make generate-admin EMAIL=admin@example.com PASSWORD=secret"; exit 1; fi
	@echo "👤 Creating admin user..."
	@$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.dev.yml exec backend bun run db:generate-admin --email=$(EMAIL) --password=$(PASSWORD)

db-backup: detect-docker-compose
	@echo "🗄️  Creating database backup..."
	@mkdir -p backups
	@$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.dev.yml --env-file .env exec -T postgres pg_dump -U catalin_ene catalin_ene_dev > backups/backup_$$(date +%Y%m%d_%H%M%S).sql
	@rm -f backups/latest.sql && ln -sf $$(ls -t backups/backup_*.sql | head -n 1 | xargs basename) backups/latest.sql
	@echo "✅ Backup created in backups/ latest is backups/latest.sql"

db-restore: detect-docker-compose
	@if [ ! -f backups/latest.sql ]; then echo "❌ backups/latest.sql not found!"; exit 1; fi
	@echo "🔄 Restoring latest database backup..."
	@$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.dev.yml --env-file .env exec -T postgres psql -U catalin_ene -d catalin_ene_dev < backups/latest.sql
	@echo "✅ Database restored!"

db-restore-name: detect-docker-compose
	@if [ -z "$(NAME)" ]; then echo "Usage: make db-restore-name NAME=backup_YYYYMMDD_HHMMSS.sql"; exit 1; fi
	@if [ ! -f backups/$(NAME) ]; then echo "❌ backups/$(NAME) not found!"; exit 1; fi
	@echo "🔄 Restoring database backup: $(NAME)..."
	@$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.dev.yml --env-file .env exec -T postgres psql -U catalin_ene -d catalin_ene_dev < backups/$(NAME)
	@echo "✅ Database restored from $(NAME)!"

# Production DB Commands
db-backup-prod: detect-docker-compose
	@if [ ! -f .env.prod ]; then echo "❌ .env.prod not found!"; exit 1; fi
	@echo "🗄️  Creating production database backup..."
	@mkdir -p backups/prod
	@export $$(grep -v '^#' .env.prod | xargs) && \
	$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.prod exec -T postgres pg_dump -U $$DB_USER $$DB_NAME > backups/prod/backup_prod_$$(date +%Y%m%d_%H%M%S).sql
	@rm -f backups/prod/latest_prod.sql && ln -sf $$(ls -t backups/prod/backup_prod_*.sql | head -n 1 | xargs basename) backups/prod/latest_prod.sql
	@echo "✅ Production backup created in backups/prod/ latest is backups/prod/latest_prod.sql"

db-restore-prod: detect-docker-compose
	@if [ ! -f .env.prod ]; then echo "❌ .env.prod not found!"; exit 1; fi
	@if [ ! -f backups/prod/latest_prod.sql ]; then echo "❌ backups/prod/latest_prod.sql not found!"; exit 1; fi
	@echo "🔄 Restoring latest production database backup..."
	@export $$(grep -v '^#' .env.prod | xargs) && \
	$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.prod exec -T postgres psql -U $$DB_USER -d $$DB_NAME < backups/prod/latest_prod.sql
	@echo "✅ Production database restored!"

db-restore-name-prod: detect-docker-compose
	@if [ -z "$(NAME)" ]; then echo "Usage: make db-restore-name-prod NAME=backup_prod_YYYYMMDD_HHMMSS.sql"; exit 1; fi
	@if [ ! -f .env.prod ]; then echo "❌ .env.prod not found!"; exit 1; fi
	@if [ ! -f backups/prod/$(NAME) ]; then echo "❌ backups/prod/$(NAME) not found!"; exit 1; fi
	@echo "🔄 Restoring production database backup: $(NAME)..."
	@export $$(grep -v '^#' .env.prod | xargs) && \
	$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.prod exec -T postgres psql -U $$DB_USER -d $$DB_NAME < backups/prod/$(NAME)
	@echo "✅ Production database restored from $(NAME)!"

db-generate-migration: detect-docker-compose
	@echo "📝 Generating migration..."
	@$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.dev.yml exec backend bun run migrate:generate

add: detect-docker-compose
	@if [ -z "$(PKG)" ]; then echo "Usage: make add PKG=package-name"; exit 1; fi
	@$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.dev.yml exec backend bun add $(PKG)
	@$(MAKE) sync

add-fe: detect-docker-compose
	@if [ -z "$(PKG)" ]; then echo "Usage: make add-fe PKG=package-name"; exit 1; fi
	@$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.dev.yml exec frontend bun add $(PKG)
	@$(MAKE) sync

status: detect-docker-compose
	@$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.dev.yml ps

clean-images:
	@docker image prune -f
	@docker image prune -a -f --filter "until=24h"
	@echo "✅ Cleanup complete!"

vite-reset: detect-docker-compose
	@echo "🔄 Clearing Vite cache..."
	@$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.dev.yml exec -T frontend sh -c "rm -rf /app/node_modules/.vite" || true
	@$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.dev.yml restart frontend
	@echo "✅ Vite cache cleared — hard-refresh your browser (Ctrl+Shift+R)"

clean-modules: detect-docker-compose
	@$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.dev.yml down
	@docker volume rm catalin-ene_backend_node_modules 2>/dev/null || true
	@docker volume rm catalin-ene_frontend_node_modules 2>/dev/null || true
	@DOCKER_BUILDKIT=1 $(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.dev.yml build --no-cache backend frontend
	@$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.dev.yml up -d
	@sleep 10
	@$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.dev.yml exec -T backend sh -c "cd /app && bun install" || true
	@$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.dev.yml exec -T frontend sh -c "cd /app && bun install" || true
	@$(MAKE) sync
	@echo "✅ node_modules cleaned and reinstalled!"

db-push: detect-docker-compose
	@echo "📝 Pushing schema changes to database..."
	@$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.dev.yml exec backend bunx drizzle-kit push
	@echo "✅ Schema pushed!"

# Production
deploy: detect-docker-compose check-docker-permissions
	@if [ ! -f .env.prod ]; then echo "❌ .env.prod not found!"; exit 1; fi
	@docker network inspect webproxy >/dev/null 2>&1 || (echo "❌ webproxy network not found — start the Traefik stack first" && exit 1)
	@git pull || echo "⚠️  Git pull failed"
	@mkdir -p backend/uploads backend/invoices logs && chmod 777 backend/uploads backend/invoices logs
	@$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.prod down --remove-orphans 2>/dev/null || true
	@DOCKER_BUILDKIT=1 $(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.prod build --no-cache --parallel backend frontend migrate
	@$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.prod up -d postgres redis
	@sleep 10
	@$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.prod run --rm migrate || echo "⚠️  Migration failed"
	@$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.prod up -d
	@echo "✅ Deployed!"

status-prod: detect-docker-compose
	@$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.prod ps

logs-prod: detect-docker-compose
	@$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.prod logs -f

restart-prod: detect-docker-compose check-docker-permissions
	@$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.prod restart
	@echo "✅ Restarted!"

stop-prod: detect-docker-compose
	@$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.prod down
	@echo "✅ Production stopped!"

db-truncate-prod: detect-docker-compose
	@echo "🗑️  Truncating all transactional data on production..."
	@$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.prod exec -T postgres sh -c 'psql -U "$$POSTGRES_USER" -d "$$POSTGRES_DB" -c "TRUNCATE TABLE invoices, bookings, reviews, ical_blocked_dates, ical_feeds, unit_blocked_days, unit_pricing_rules, units, properties RESTART IDENTITY CASCADE;"'
	@echo "✅ Production database truncated!"

db-wipe-prod: detect-docker-compose
	@echo "💥 Wiping all tables from production database..."
	@$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.prod exec -T postgres sh -c 'psql -U "$$POSTGRES_USER" -d "$$POSTGRES_DB" -c "DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public; DROP SCHEMA IF EXISTS drizzle CASCADE; GRANT ALL ON SCHEMA public TO \"$$POSTGRES_USER\"; GRANT ALL ON SCHEMA public TO public;"'
	@echo "✅ Production database wiped clean!"

generate-admin-prod: detect-docker-compose
	@if [ -z "$(EMAIL)" ] || [ -z "$(PASSWORD)" ]; then echo "Usage: make generate-admin-prod EMAIL=admin@example.com PASSWORD=secret"; exit 1; fi
	@echo "👤 Creating admin user on production..."
	@$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.prod exec backend bun run db:generate-admin --email=$(EMAIL) --password=$(PASSWORD)
