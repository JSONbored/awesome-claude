CREATE INDEX IF NOT EXISTS idx_submission_user_tokens_expires
  ON submission_user_tokens (expires_at);
