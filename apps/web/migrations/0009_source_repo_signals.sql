CREATE TABLE IF NOT EXISTS source_repo_signals (
  repo TEXT PRIMARY KEY,
  stars INTEGER,
  forks INTEGER,
  repo_updated_at TEXT,
  fetched_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ok' CHECK (status IN ('ok', 'error')),
  last_error TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_source_repo_signals_status_fetch
  ON source_repo_signals (status, fetched_at);
