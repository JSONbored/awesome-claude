ALTER TABLE idempotency_keys ADD COLUMN expires_at TEXT;

UPDATE idempotency_keys
SET expires_at = datetime(created_at, '+48 hours')
WHERE expires_at IS NULL OR expires_at = '';

CREATE INDEX IF NOT EXISTS idx_idempotency_keys_expires
  ON idempotency_keys (expires_at);
