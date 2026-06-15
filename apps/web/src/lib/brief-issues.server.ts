import { getSiteDb } from "@/lib/db";

export type BriefIssueStatus = "draft" | "approved" | "sent";

export type BriefIssueRow = {
  number: number;
  slug: string;
  period_through: string;
  payload: string;
  status: BriefIssueStatus;
  generated_at: string;
  scheduled_send_at: string | null;
  approved_at: string | null;
  sent_at: string | null;
};

export type BriefIssue = Omit<BriefIssueRow, "payload"> & {
  payload: Record<string, unknown>;
};

// Fail open only for a not-yet-applied migration (the absent-binding case is
// already short-circuited by the getSiteDb() null guards before any query
// runs). Real D1 faults — constraint violations, syntax errors, timeouts — must
// still surface, so this matcher is deliberately narrow to "table not present".
function isMissingInfra(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? "");
  return /no such table: brief_issues|no such table/i.test(message);
}

function parseRow(row: BriefIssueRow | null): BriefIssue | null {
  if (!row) return null;
  let payload: Record<string, unknown> = {};
  try {
    payload = JSON.parse(row.payload) as Record<string, unknown>;
  } catch {
    payload = {};
  }
  return { ...row, payload };
}

/**
 * Persist a freshly generated weekly brief as a draft. Idempotent on the
 * period (a re-fired generation cron will not burn a second issue number or
 * overwrite an already-reviewed issue). Returns true when a row was written.
 */
export async function upsertBriefDraft(input: {
  slug: string;
  periodThrough: string;
  payload: unknown;
  generatedAt: string;
}): Promise<boolean> {
  const db = getSiteDb();
  if (!db) return false;
  try {
    const result = await db
      .prepare(
        `INSERT INTO brief_issues (slug, period_through, payload, status, generated_at)
         VALUES (?, ?, ?, 'draft', ?)
         ON CONFLICT(period_through) DO NOTHING`,
      )
      .bind(input.slug, input.periodThrough, JSON.stringify(input.payload), input.generatedAt)
      .run();
    return Boolean(result?.meta?.changes);
  } catch (error) {
    if (isMissingInfra(error)) return false;
    throw error;
  }
}

export async function getLatestPublishedBrief(): Promise<BriefIssue | null> {
  const db = getSiteDb();
  if (!db) return null;
  try {
    const row = await db
      .prepare(
        `SELECT * FROM brief_issues
         WHERE status IN ('approved', 'sent')
         ORDER BY period_through DESC LIMIT 1`,
      )
      .bind()
      .first<BriefIssueRow>();
    return parseRow(row);
  } catch (error) {
    if (isMissingInfra(error)) return null;
    throw error;
  }
}

export async function getBriefByNumber(number: number): Promise<BriefIssue | null> {
  const db = getSiteDb();
  if (!db || !Number.isInteger(number)) return null;
  try {
    const row = await db
      .prepare(
        `SELECT * FROM brief_issues
         WHERE number = ? AND status IN ('approved', 'sent') LIMIT 1`,
      )
      .bind(number)
      .first<BriefIssueRow>();
    return parseRow(row);
  } catch (error) {
    if (isMissingInfra(error)) return null;
    throw error;
  }
}

/** Published issues for the /brief archive list + sitemap. */
export async function listPublishedBriefs(limit = 24): Promise<BriefIssue[]> {
  const db = getSiteDb();
  if (!db) return [];
  try {
    const { results } = await db
      .prepare(
        `SELECT * FROM brief_issues
         WHERE status IN ('approved', 'sent')
         ORDER BY period_through DESC LIMIT ?`,
      )
      .bind(Math.max(1, Math.min(limit, 100)))
      .all<BriefIssueRow>();
    return (results ?? []).map(parseRow).filter((issue): issue is BriefIssue => issue !== null);
  } catch (error) {
    if (isMissingInfra(error)) return [];
    throw error;
  }
}
