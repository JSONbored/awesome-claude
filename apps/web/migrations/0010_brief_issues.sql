-- Weekly Brief issues: one persisted row per generated weekly brief.
-- The Friday generation cron writes a `draft`; a signed maintainer approval
-- moves it to `approved` with a scheduled send time; the send cron marks it
-- `sent`. `payload` is the JSON.stringify of buildWeeklyBrief()'s output.
CREATE TABLE IF NOT EXISTS brief_issues (
  number INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  period_through TEXT NOT NULL UNIQUE,
  payload TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'sent')),
  generated_at TEXT NOT NULL,
  scheduled_send_at TEXT,
  approved_at TEXT,
  sent_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Send cron scans for approved issues due to go out.
CREATE INDEX IF NOT EXISTS idx_brief_issues_status_send
  ON brief_issues (status, scheduled_send_at);

-- Public /brief reads the most recent published (sent/approved) issues.
CREATE INDEX IF NOT EXISTS idx_brief_issues_period
  ON brief_issues (period_through DESC);
