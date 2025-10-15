"""
 How to run this test locally (no .env.test required)

1. Start Postgres:
   docker start brain100-pg 2>/dev/null || \
   docker run --name brain100-pg -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d \
     postgres:16 -c shared_preload_libraries=pg_stat_statements

2. Create test DB and enable extension:
   docker exec -it brain100-pg psql -U postgres -c "CREATE DATABASE brain100_test;" || true
   docker exec -it brain100-pg psql -U postgres -d brain100_test \
     -c "CREATE EXTENSION IF NOT EXISTS pg_stat_statements;"

3. Set env vars (temporary for this shell):
   export DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/brain100_test
   export PRISMA_DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/brain100_test
   export BASE_URL=http://testserver

4. Sync Prisma schema (optional):
   prisma generate && prisma db push

5. Run the test:
   pytest -q app/tests/test_stats_top_sql.py::test_stats_top_sql_works

 Works without .env.test.
If pg_stat_statements is not installed, the test will be skipped automatically.
"""

import pytest

from httpx import AsyncClient, ASGITransport
from app.main import app
from app.settings import settings
from app.db import db


async def _pgss_installed() -> bool:
    """Checking pg_stat_statements was installed into current db."""
    try:
        rows = await db.query_raw(
            "SELECT COUNT(*)::int AS n FROM pg_extension WHERE extname = 'pg_stat_statements';"
        )
        return rows and rows[0]["n"] > 0
    except Exception:
        return False


@pytest.mark.asyncio
async def test_stats_top_sql_works():
    await db.connect()

    if not await _pgss_installed():
        await db.disconnect()
        pytest.skip("pg_stat_statements is not installed in this database")

    for i in range(15):
        await db.query_raw("SELECT $1::int AS x;", i)
    for _ in range(5):
        await db.query_raw("SELECT now();")

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url=settings.base_url) as client:
        r = await client.get(
            "/br-general/stats/top-sql?limit=5&sort_by=total&min_calls=1"
        )
        assert r.status_code == 200, r.text
        data = r.json()
        assert "items" in data and isinstance(data["items"], list)
        assert len(data["items"]) <= 5
        if data["items"]:
            row = data["items"][0]
            for k in ("query", "calls", "total_ms", "mean_ms"):
                assert k in row

        r2 = await client.get("/br-general/stats/top-sql?limit=3&sort_by=calls")
        assert r2.status_code == 200, r2.text

        r3 = await client.get("/br-general/stats/top-sql?sort_by=bad")
        assert r3.status_code in (400, 422)

    await db.disconnect()
