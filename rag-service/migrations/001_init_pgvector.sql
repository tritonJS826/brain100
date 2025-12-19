-- Initialize pgvector and minimal RAG schema (documents + chunks with embeddings)

-- Enable pgvector (safe if already enabled)
CREATE EXTENSION IF NOT EXISTS vector;

-- Gemini text-embedding-004 uses 768-dimension vectors.

-- Documents registry (external, stable ID is convenient for idempotent ingest)
CREATE TABLE IF NOT EXISTS rag_documents (
  document_id   TEXT PRIMARY KEY,
  title         TEXT NOT NULL,
  source        TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Chunks with embeddings
CREATE TABLE IF NOT EXISTS rag_chunks (
  id            BIGSERIAL PRIMARY KEY,
  document_id   TEXT NOT NULL REFERENCES rag_documents(document_id) ON DELETE CASCADE,
  chunk_index   INT  NOT NULL,                -- position of the chunk within document
  title         TEXT,                         -- optional, duplicates doc title for convenience
  content       TEXT NOT NULL,                -- raw chunk text
  content_hash  TEXT NOT NULL,                -- idempotency key to avoid duplicates
  embedding     VECTOR(768) NOT NULL,         -- pgvector column (cosine search)
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT rag_chunks_doc_idx_unique UNIQUE (document_id, chunk_index),
  CONSTRAINT rag_chunks_content_hash_unique UNIQUE (content_hash)
);

-- ANN index for fast top-K cosine search (IVF-Flat)
CREATE INDEX IF NOT EXISTS rag_chunks_embedding_ivfflat
  ON rag_chunks
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Helpful secondary indexes
CREATE INDEX IF NOT EXISTS rag_chunks_document_id_idx ON rag_chunks(document_id);
CREATE INDEX IF NOT EXISTS rag_chunks_created_at_idx  ON rag_chunks(created_at);