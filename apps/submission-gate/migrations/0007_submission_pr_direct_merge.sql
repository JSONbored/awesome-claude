CREATE TABLE IF NOT EXISTS submission_drafts_next (
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
    verdict IS NULL OR verdict IN ('merge', 'import', 'request_changes', 'close', 'manual', 'ignore')
  ),
  verdict_summary TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

INSERT OR IGNORE INTO submission_drafts_next
  (id, status, category, slug, target_path, branch_name, base_ref, fields_json, auth_state_hash, github_login, fork_full_name, pull_request_url, pull_request_number, verdict, verdict_summary, created_at, updated_at)
SELECT
  id, status, category, slug, target_path, branch_name, base_ref, fields_json, auth_state_hash, github_login, fork_full_name, pull_request_url, pull_request_number, verdict, verdict_summary, created_at, updated_at
FROM submission_drafts;

DROP TABLE submission_drafts;

ALTER TABLE submission_drafts_next RENAME TO submission_drafts;

CREATE INDEX IF NOT EXISTS idx_submission_drafts_status
  ON submission_drafts (status, updated_at);

CREATE INDEX IF NOT EXISTS idx_submission_drafts_pr
  ON submission_drafts (pull_request_number)
  WHERE pull_request_number IS NOT NULL;

CREATE TABLE IF NOT EXISTS submission_prs_next (
  repo TEXT NOT NULL,
  number INTEGER NOT NULL,
  head_repo TEXT,
  head_ref TEXT,
  base_ref TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (
    status IN ('queued', 'validation_pending', 'merge_accepted', 'merged', 'import_running', 'import_failed', 'import_pr_open', 'import', 'request_changes', 'close', 'manual', 'ignore')
  ),
  verdict TEXT CHECK (
    verdict IS NULL OR verdict IN ('merge', 'import', 'request_changes', 'close', 'manual', 'ignore')
  ),
  verdict_summary TEXT,
  import_pr_url TEXT,
  last_delivery_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (repo, number)
);

INSERT OR IGNORE INTO submission_prs_next
  (repo, number, head_repo, head_ref, base_ref, status, verdict, verdict_summary, import_pr_url, last_delivery_id, created_at, updated_at)
SELECT
  repo, number, head_repo, head_ref, base_ref, status, verdict, verdict_summary, import_pr_url, last_delivery_id, created_at, updated_at
FROM submission_prs;

DROP TABLE submission_prs;

ALTER TABLE submission_prs_next RENAME TO submission_prs;

CREATE INDEX IF NOT EXISTS idx_submission_prs_status
  ON submission_prs (status, updated_at);
