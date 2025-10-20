FROM postgres:16

RUN apt-get update \
 && apt-get install -y --no-install-recommends postgresql-16-cron \
 && rm -rf /var/lib/apt/lists/*

COPY postgres/postgres-general.init.sql /docker-entrypoint-initdb.d/