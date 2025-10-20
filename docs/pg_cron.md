# pg_cron — Setup & Runbook

## Prereqs
- PostgreSQL 16.x
- Preload setting: `shared_preload_libraries = 'pg_stat_statements,pg_cron'`
- Target DB has extensions: `pg_stat_statements`, `pg_cron`

## Quick Start (docker compose, local)
```bash
# check pg_cron availability in the image
docker compose -f local.docker.docker-compose.yml exec br-postgres-general \
  psql -U root -d phototours_db -c \
  "SELECT name, default_version FROM pg_available_extensions WHERE name='pg_cron';"

# enable preload (if not enabled yet)
docker compose -f local.docker.docker-compose.yml exec br-postgres-general \
  psql -U root -d postgres -c \
  "ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements,pg_cron';"
docker compose -f local.docker.docker-compose.yml restart br-postgres-general

# (recommended) set default DB for cron jobs
docker compose -f local.docker.docker-compose.yml exec br-postgres-general \
  psql -U root -d postgres -c "ALTER SYSTEM SET cron.database_name = 'phototours_db';"
docker compose -f local.docker.docker-compose.yml restart br-postgres-general

# install extensions in phototours_db
docker compose -f local.docker.docker-compose.yml exec br-postgres-general \
  psql -U root -d phototours_db -c "CREATE EXTENSION IF NOT EXISTS pg_stat_statements;"
docker compose -f local.docker.docker-compose.yml exec br-postgres-general \
  psql -U root -d phototours_db -c "CREATE EXTENSION IF NOT EXISTS pg_cron;"
