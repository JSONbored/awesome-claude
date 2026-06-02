CREATE TABLE IF NOT EXISTS submission_drafts (
  id TEXT PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (
    status IN ('draft', 'auth_required', 'queued', 'pr_open')
  ),
  category TEXT NOT NULL,
  slug TEXT NOT NULL,
  target_path TEXT NOT NULL,
  branch_name TEXT NOT NULL,
  base_ref TEXT NOT NULL,
  fields_json TEXT NOT NULL,
  auth_state_hash TEXT,
  github_login TEXT,
  fork_full_name TEXT,
  pull_request_url TEXT,
  pull_request_number INTEGER,
  verdict TEXT CHECK (
    verdict IS NULL OR verdict IN ('import', 'request_changes', 'close', 'manual', 'ignore')
  ),
  verdict_summary TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_submission_drafts_status
  ON submission_drafts (status, updated_at);

CREATE INDEX IF NOT EXISTS idx_submission_drafts_pr
  ON submission_drafts (pull_request_number)
  WHERE pull_request_number IS NOT NULL;

CREATE TABLE IF NOT EXISTS submission_prs (
  repo TEXT NOT NULL,
  number INTEGER NOT NULL,
  head_repo TEXT,
  head_ref TEXT,
  base_ref TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (
    status IN ('queued', 'validation_pending', 'import_pr_open', 'import', 'request_changes', 'close', 'manual', 'ignore')
  ),
  verdict TEXT CHECK (
    verdict IS NULL OR verdict IN ('import', 'request_changes', 'close', 'manual', 'ignore')
  ),
  verdict_summary TEXT,
  import_pr_url TEXT,
  last_delivery_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (repo, number)
);

CREATE INDEX IF NOT EXISTS idx_submission_prs_status
  ON submission_prs (status, updated_at);

CREATE TABLE IF NOT EXISTS submission_audit (
  id TEXT PRIMARY KEY,
  target_key TEXT NOT NULL,
  event_type TEXT NOT NULL,
  decision TEXT,
  summary TEXT,
  r2_key TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS submission_user_tokens (
  draft_id TEXT PRIMARY KEY REFERENCES submission_drafts(id) ON DELETE CASCADE,
  encrypted_token TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  consumed_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_submission_user_tokens_expires
  ON submission_user_tokens (expires_at);
