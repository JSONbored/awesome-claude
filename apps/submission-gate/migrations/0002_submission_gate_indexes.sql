CREATE INDEX IF NOT EXISTS idx_submission_audit_target
  ON submission_audit (target_key);

CREATE INDEX IF NOT EXISTS idx_idempotency_keys_target
  ON idempotency_keys (target_key);
