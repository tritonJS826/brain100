FROM postgres:16.2-alpine
COPY postgres/postgres-general.init.sql /docker-entrypoint-initdb.d/