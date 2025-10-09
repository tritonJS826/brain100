# Stats API — Top SQL (v1.1)

## Endpoint: `/br-general/stats/top-sql`

### Method
`GET`

### Auth Required
No — this is a **public technical endpoint**

---

### Description
Returns the **top N heaviest SQL queries** recorded by PostgreSQL using the `pg_stat_statements` extension.  
Useful for database performance monitoring and profiling.

---

### Query Parameters

| Parameter | Type | Default | Range | Description |
|------------|------|----------|--------|--------------|
| `limit` | int | 20 | 1–100 | Number of queries to return |
| `sort_by` | str | `"total"` | — | Sort by: `total` (total exec time), `mean` (average exec time), `io` (I/O time), or `calls` (number of calls) |
| `min_calls` | int | 1 | 1–1000 | Minimum number of calls required to include a query (filters out noise) |

---

### Example Requests

**Top by total execution time**
```bash
curl "http://localhost:8000/br-general/stats/top-sql?limit=5&sort_by=total"
```

**Top by average execution time (filter rare queries)**
```bash
curl "http://localhost:8000/br-general/stats/top-sql?limit=5&sort_by=mean&min_calls=5"
```

**Top by number of calls**
```bash
curl "http://localhost:8000/br-general/stats/top-sql?limit=10&sort_by=calls"
```

**Top by I/O (read/write time)**
```bash
curl "http://localhost:8000/br-general/stats/top-sql?limit=5&sort_by=io"
```