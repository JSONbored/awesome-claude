-- Retained for dev/prod migration history compatibility; 0001 also creates this
-- index for fresh databases.
CREATE INDEX IF NOT EXISTS idx_submission_user_tokens_expires
  ON submission_user_tokens (expires_at);
