CREATE INDEX IF NOT EXISTS idx_submission_audit_target
  ON submission_audit (target_key);
