ALTER TABLE submission_prs
  ADD COLUMN last_error_code TEXT;

ALTER TABLE submission_prs
  ADD COLUMN last_retry_fingerprint TEXT;

ALTER TABLE submission_prs
  ADD COLUMN retry_fingerprint_count INTEGER NOT NULL DEFAULT 0;

ALTER TABLE submission_prs
  ADD COLUMN retry_exhausted_at TEXT;

ALTER TABLE submission_prs
  ADD COLUMN retry_exhausted_reason TEXT;

CREATE INDEX IF NOT EXISTS idx_submission_prs_retry_fingerprint
  ON submission_prs (status, last_error_code, last_retry_fingerprint, retry_fingerprint_count);
