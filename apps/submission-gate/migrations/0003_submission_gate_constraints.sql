PRAGMA foreign_keys = off;

DROP TABLE IF EXISTS submission_user_tokens_next;

CREATE TABLE submission_user_tokens_next (
  draft_id TEXT PRIMARY KEY REFERENCES submission_drafts(id) ON DELETE CASCADE,
  encrypted_token TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  consumed_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

INSERT OR REPLACE INTO submission_user_tokens_next
  (draft_id, encrypted_token, expires_at, consumed_at, created_at, updated_at)
SELECT draft_id, encrypted_token, expires_at, consumed_at, created_at, updated_at
FROM submission_user_tokens
WHERE draft_id IN (SELECT id FROM submission_drafts);

DROP TABLE submission_user_tokens;

ALTER TABLE submission_user_tokens_next RENAME TO submission_user_tokens;

DROP TABLE IF EXISTS idempotency_keys_next;

CREATE TABLE idempotency_keys_next (
  target_key TEXT NOT NULL,
  key TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (target_key, key)
);

INSERT OR IGNORE INTO idempotency_keys_next (target_key, key, created_at)
SELECT target_key, key, created_at
FROM idempotency_keys;

DROP TABLE idempotency_keys;

ALTER TABLE idempotency_keys_next RENAME TO idempotency_keys;

CREATE INDEX IF NOT EXISTS idx_idempotency_keys_target
  ON idempotency_keys (target_key);

PRAGMA foreign_keys = on;
