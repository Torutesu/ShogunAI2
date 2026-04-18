-- SHOGUN v2 schema (PGLite + pgvector)
-- Append-only event log. All derived data reconstructable from events.

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ts              TIMESTAMPTZ NOT NULL,
  duration_ms     INTEGER,
  kind            TEXT NOT NULL CHECK (kind IN ('screen','audio','input','system')),
  source          TEXT NOT NULL,
  app             TEXT,
  window_title    TEXT,
  url             TEXT,
  content         TEXT NOT NULL,
  content_hash    TEXT NOT NULL,
  confidence      REAL NOT NULL CHECK (confidence >= 0.0 AND confidence <= 1.0),
  meta            JSONB NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_events_ts      ON events (ts DESC);
CREATE INDEX idx_events_kind_ts ON events (kind, ts DESC);
CREATE INDEX idx_events_app_ts  ON events (app, ts DESC);
CREATE INDEX idx_events_hash    ON events (content_hash);

CREATE TABLE entities (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type          TEXT NOT NULL CHECK (type IN ('person','project','file','url','org')),
  canonical     TEXT NOT NULL,
  aliases       TEXT[] NOT NULL DEFAULT '{}',
  meta          JSONB NOT NULL DEFAULT '{}',
  first_seen    TIMESTAMPTZ NOT NULL,
  last_seen     TIMESTAMPTZ NOT NULL,
  mention_count INTEGER NOT NULL DEFAULT 0,
  UNIQUE (type, canonical)
);

CREATE TABLE event_entities (
  event_id  UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
  role      TEXT,
  PRIMARY KEY (event_id, entity_id, role)
);

CREATE TABLE embeddings (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id   UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  chunk_idx  INTEGER NOT NULL,
  chunk_text TEXT NOT NULL,
  embedding  VECTOR(1024) NOT NULL,
  model      TEXT NOT NULL,
  UNIQUE (event_id, chunk_idx, model)
);

CREATE INDEX idx_embeddings_hnsw
  ON embeddings USING hnsw (embedding vector_cosine_ops);

CREATE TABLE summaries (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  span       TEXT NOT NULL CHECK (span IN ('session','hour','day','week','brief')),
  span_start TIMESTAMPTZ NOT NULL,
  span_end   TIMESTAMPTZ NOT NULL,
  title      TEXT NOT NULL,
  body       TEXT NOT NULL,
  highlights JSONB NOT NULL,
  entity_ids UUID[] NOT NULL DEFAULT '{}',
  model      TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (span, span_start)
);

CREATE TABLE actions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requested_at TIMESTAMPTZ NOT NULL,
  intent       TEXT NOT NULL,
  plan         JSONB NOT NULL,
  tool_calls   JSONB NOT NULL,
  status       TEXT NOT NULL CHECK (status IN ('pending','running','done','failed','cancelled')),
  result       TEXT,
  error        TEXT,
  finished_at  TIMESTAMPTZ
);

CREATE TABLE pipeline_stats (
  id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket  TIMESTAMPTZ NOT NULL,
  stage   TEXT NOT NULL CHECK (stage IN ('capture','normalize','store','index','summarize')),
  ok      INTEGER NOT NULL DEFAULT 0,
  failed  INTEGER NOT NULL DEFAULT 0,
  dropped INTEGER NOT NULL DEFAULT 0,
  p50_ms  INTEGER,
  p95_ms  INTEGER,
  UNIQUE (bucket, stage)
);

CREATE TABLE licenses (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  jwt          TEXT NOT NULL,
  plan         TEXT NOT NULL CHECK (plan IN ('trial','monthly','annual')),
  expires_at   TIMESTAMPTZ NOT NULL,
  installed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  device_id    TEXT NOT NULL
);

CREATE TABLE settings (
  key        TEXT PRIMARY KEY,
  value      JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
