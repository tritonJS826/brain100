RAG SeRAG Service (FastAPI + pgvector + Gemini)

A minimal Retrieval-Augmented Generation (RAG) backend: ingest plain/markdown text, split it into chunks, embed with Gemini, store vectors in PostgreSQL via pgvector, search top-K by cosine similarity, and answer questions using retrieved context.

⸻

Features
* POST /ingest — chunk text (LangChain), embed (Gemini), store in Postgres (pgvector).
* POST /search — ANN search (cosine) over stored embeddings.
* POST /chat — strict RAG prompting: answer only from retrieved context (English).
* GET /health — liveness probe.
* OpenAPI/Swagger at http://localhost:8010/docs.

⸻

Requirements
* Python 3.12+ (for local runs)
* PostgreSQL 16/17 with pgvector extension
* A valid Gemini API key
* Migrations in ./migrations applied to your DB

For easiest startup, use Docker Compose below (brings up Postgres with pgvector and the API).

⸻

Quick Start (Docker Compose)

Works on macOS/Linux/Windows with Docker Desktop.

### 1.	Create .env in the repo root (next to docker-compose.yml):

**Database**

Inside containers we connect to the 'postgres' service by name:
* DATABASE_URL=postgresql://root:secret@postgres:5432/postgres

**Google Gemini**

Put your key here (or set GOOGLE_API_KEY env var in your shell)
* GEMINI_API_KEY=your_google_ai_key

**Models**

* EMBEDDING_MODEL=text-embedding-004      
* LLM_MODEL=gemini-2.5-flash              

**RAG parameters (tune as needed)**

* RAG_TOP_K=3 
* RAG_SCORE_THRESHOLD=0.15 
* RAG_CHUNK_SIZE=1000 
* RAG_CHUNK_OVERLAP=180

Note (macOS local Postgres): if you want the API (running on host) to connect to your host Postgres, use
DATABASE_URL=postgresql://USER:PASS@host.docker.internal:5432/DBNAME.
For Compose recommend the service name postgres.

### 2.	Start services:

> docker compose up -d --build

### 3.	Apply DB migrations (inside the API container):

> docker compose exec rag-service python -m app.db.migrate apply

Expected message: Migrations applied.

### 4.	Open Swagger:
http://localhost:8010/docs

⸻

Local Run (without Docker)

1.	Install system Postgres (16/17) with pgvector and create DB:

CREATE EXTENSION IF NOT EXISTS vector;

2.	Create .env (same keys as above), but point DATABASE_URL to your local DB:

* DATABASE_URL=postgresql://USER:PASS@127.0.0.1:5432/DBNAME
* GEMINI_API_KEY=your_google_ai_key
* EMBEDDING_MODEL=text-embedding-004
* LLM_MODEL=gemini-2.5-flash
* RAG_TOP_K=3
* RAG_SCORE_THRESHOLD=0.15
* RAG_CHUNK_SIZE=1000
* RAG_CHUNK_OVERLAP=180


3.	Create venv + install deps:

> python -m venv .venv
> source .venv/bin/activate
> pip install -r rag-service/requirements.txt  

4.	Apply migrations:

> python -m app.db.migrate apply

5.	Run API:

> uvicorn app.main:app --reload --port 8010


⸻

Database Initialization (what migrations do)

Ensures pgvector is enabled: CREATE EXTENSION IF NOT EXISTS vector;

Creates tables:
* rag_documents(document_id TEXT PK, title TEXT, source TEXT, created_at TIMESTAMPTZ)
* rag_chunks(id BIGSERIAL PK, document_id TEXT FK, chunk_index INT, title TEXT, content TEXT, content_hash TEXT UNIQUE, embedding VECTOR(768), created_at TIMESTAMPTZ, UNIQUE(document_id, chunk_index))

Creates ANN index (IVF-Flat) for cosine search:

* CREATE INDEX IF NOT EXISTS rag_chunks_embedding_ivfflat
  ON rag_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);


⸻

### Endpoints & Examples

1) Ingest

* POST /ingest 

Index a text document.

Body:

>{
  "title": "Company Knowledge Base (MVP)",
  "text": "Short rules and contacts.\nOur support works 9–18 CET. Contact: support@example.com. Refunds within 14 days.",
  "description": "Internal KB (optional)",
  "chunk_size": 1000,
  "chunk_overlap": 180
}

curl:

>curl -X POST http://localhost:8010/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Company Knowledge Base (MVP)",
    "text": "Short rules and contacts.\nOur support works 9–18 CET. Contact: support@example.com. Refunds within 14 days.",
    "chunk_size": 1000,
    "chunk_overlap": 180
  }'

Response (example):

>{
  "title": "Company Knowledge Base (MVP)",
  "total_chunks": 1,
  "embedded_chunks": 1,
  "inserted_chunks": 1,
  "db_chunks_after": 1,
  "vector_dim": 768,
  "content_hash": "…",
  "note": "Ingest completed: document upserted, previous chunks replaced."
}


⸻

2) Search

* POST /search

Vector similarity search (cosine).

Body:

>{
  "query": "What does the company knowledge base contain?",
  "top_k": 5,
  "score_threshold": 0.15
}

Response (example):

>{
  "query": "What does the company knowledge base contain?",
  "hits": [
    {
      "title": "Company Knowledge Base (MVP)",
      "chunk_index": 0,
      "content": "Short rules and contacts...",
      "score": 0.68
    }
  ]
}


⸻

3) Chat

* POST /chat 

RAG answer using retrieved chunks. 
If context is insufficient: “I don’t have enough information in the provided data.”

Body:

>{
  "question": "What does the company knowledge base contain?",
  "top_k": 3,
  "score_threshold": 0.15
}

Response (example):

>{
  "question": "What does the company knowledge base contain?",
  "answer": "The knowledge base contains short rules, contacts, and support information.",
  "sources": [
    { "title": "Company Knowledge Base (MVP)", "chunk_index": 0, "score": 0.68 }
  ]
}


⸻

4) Healthcheck

* GET /health → {"status":"ok"}

⸻

Verifying Data in DB (Docker)

>docker compose exec postgres psql -U root -d postgres -c "\dx"                  
> 
> docker compose exec postgres psql -U root -d postgres -c "\dt rag_*"            
> 
> docker compose exec postgres psql -U root -d postgres -c \
  "SELECT COUNT(*) AS docs FROM rag_documents; SELECT COUNT(*) AS chunks FROM rag_chunks;"


⸻

Tuning & Notes
* RAG_SCORE_THRESHOLD: similarity threshold; lower returns more hits (e.g., 0.10–0.20 typical for small corpora).
* Chunk size / overlap: recall vs. precision trade-off. Start with 1000/180.
* Index lists: IVF lists = 100 (migration default). Increase for larger corpora.




