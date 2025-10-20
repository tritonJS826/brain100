\c mastersway_db

-- preload
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements,pg_cron';

-- pg_stat_statements
ALTER SYSTEM SET pg_stat_statements.max = '10000';
ALTER SYSTEM SET pg_stat_statements.track = 'all';
-- pg_cron
ALTER SYSTEM SET cron.database_name = 'phototours_db';

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
CREATE EXTENSION IF NOT EXISTS pg_cron;