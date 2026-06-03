CREATE TABLE IF NOT EXISTS submission_prs_next (
  repo TEXT NOT NULL,
  number INTEGER NOT NULL,
  head_repo TEXT,
  head_ref TEXT,
  head_sha TEXT,
  base_ref TEXT NOT NULL,
  installation_id INTEGER,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (
    status IN ('queued', 'validation_pending', 'reviewing', 'merge_pending', 'merged', 'closed', 'manual', 'ignored', 'error_retryable')
  ),
  verdict TEXT CHECK (
    verdict IS NULL OR verdict IN ('merge', 'import', 'request_changes', 'close', 'manual', 'ignore')
  ),
  verdict_summary TEXT,
  import_pr_url TEXT,
  last_delivery_id TEXT,
  last_notification_key TEXT,
  next_review_at TEXT,
  attempt_count INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  last_check_summary TEXT,
  terminal_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (repo, number)
);

INSERT OR IGNORE INTO submission_prs_next
  (repo, number, head_repo, head_ref, base_ref, status, verdict, verdict_summary, import_pr_url, last_delivery_id, last_notification_key, next_review_at, attempt_count, last_error, last_check_summary, terminal_at, created_at, updated_at)
SELECT
  repo,
  number,
  head_repo,
  head_ref,
  base_ref,
  CASE
    WHEN status IN ('close', 'request_changes') THEN 'closed'
    WHEN status = 'ignore' THEN 'ignored'
    WHEN status = 'merge_accepted' THEN 'merge_pending'
    WHEN status = 'merged' THEN 'merged'
    WHEN status = 'manual' THEN 'manual'
    WHEN status = 'validation_pending' THEN 'validation_pending'
    WHEN status = 'queued' THEN 'queued'
    ELSE 'manual'
  END,
  verdict,
  verdict_summary,
  import_pr_url,
  last_delivery_id,
  last_notification_key,
  CASE
    WHEN status IN ('validation_pending', 'merge_accepted') THEN updated_at
    ELSE NULL
  END,
  0,
  NULL,
  CASE
    WHEN status = 'validation_pending' THEN verdict_summary
    ELSE NULL
  END,
  CASE
    WHEN status IN ('close', 'request_changes', 'ignore', 'merged', 'manual') THEN updated_at
    ELSE NULL
  END,
  created_at,
  updated_at
FROM submission_prs;

DROP TABLE submission_prs;

ALTER TABLE submission_prs_next RENAME TO submission_prs;

CREATE INDEX IF NOT EXISTS idx_submission_prs_status
  ON submission_prs (status, updated_at);

CREATE INDEX IF NOT EXISTS idx_submission_prs_next_review
  ON submission_prs (status, next_review_at, updated_at);
