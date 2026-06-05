ALTER TABLE submission_prs
  ADD COLUMN comment_id INTEGER;

ALTER TABLE submission_prs
  ADD COLUMN comment_url TEXT;

ALTER TABLE submission_prs
  ADD COLUMN review_id INTEGER;

ALTER TABLE submission_prs
  ADD COLUMN schema_version INTEGER;

ALTER TABLE submission_prs
  ADD COLUMN formatter_version INTEGER;

ALTER TABLE submission_prs
  ADD COLUMN decision_id TEXT;

ALTER TABLE submission_prs
  ADD COLUMN confidence REAL;

ALTER TABLE submission_prs
  ADD COLUMN source_evidence_hash TEXT;
