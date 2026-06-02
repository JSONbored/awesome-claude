CREATE TABLE IF NOT EXISTS submission_prs_next (
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

INSERT OR IGNORE INTO submission_prs_next
  (repo, number, head_repo, head_ref, base_ref, status, verdict, verdict_summary, import_pr_url, last_delivery_id, created_at, updated_at)
SELECT
  repo, number, head_repo, head_ref, base_ref, status, verdict, verdict_summary, import_pr_url, last_delivery_id, created_at, updated_at
FROM submission_prs;

DROP TABLE submission_prs;

ALTER TABLE submission_prs_next RENAME TO submission_prs;

CREATE INDEX IF NOT EXISTS idx_submission_prs_status
  ON submission_prs (status, updated_at);
