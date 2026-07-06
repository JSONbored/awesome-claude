import { getSiteDb } from "@/lib/db";
import {
  isMissingBriefIssuesInfra,
  parseBriefIssueRow,
  type BriefIssue,
  type BriefIssueRow,
  type BriefIssueStatus,
} from "@/lib/brief-issues-lib";

export type { BriefIssue, BriefIssueRow, BriefIssueStatus };

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
    if (isMissingBriefIssuesInfra(error)) return false;
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
    return parseBriefIssueRow(row);
  } catch (error) {
    if (isMissingBriefIssuesInfra(error)) return null;
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
    return parseBriefIssueRow(row);
  } catch (error) {
    if (isMissingBriefIssuesInfra(error)) return null;
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
    return (results ?? [])
      .map(parseBriefIssueRow)
      .filter((issue): issue is BriefIssue => issue !== null);
  } catch (error) {
    if (isMissingBriefIssuesInfra(error)) return [];
    throw error;
  }
}

/** The most recent draft awaiting review (for the maintainer preview email). */
export async function getLatestDraft(): Promise<BriefIssue | null> {
  const db = getSiteDb();
  if (!db) return null;
  try {
    const row = await db
      .prepare(
        `SELECT * FROM brief_issues
         WHERE status = 'draft' ORDER BY period_through DESC LIMIT 1`,
      )
      .bind()
      .first<BriefIssueRow>();
    return parseBriefIssueRow(row);
  } catch (error) {
    if (isMissingBriefIssuesInfra(error)) return null;
    throw error;
  }
}

/**
 * Approve a draft and schedule its send. Only a `draft` can be approved (so a
 * replayed approval link can't reschedule an already-sent issue). Returns true
 * when a row transitioned to `approved`.
 */
export async function approveBrief(
  number: number,
  scheduledSendAt: string,
  note = "",
): Promise<boolean> {
  const db = getSiteDb();
  if (!db || !Number.isInteger(number)) return false;
  // Optional maintainer note, merged into the payload so the audience send and
  // the public /brief render it. Bounded; empty leaves the payload unchanged.
  const trimmedNote = String(note ?? "")
    .replace(/\r\n/g, "\n")
    .trim()
    .slice(0, 600);
  try {
    const result = await db
      .prepare(
        `UPDATE brief_issues
         SET status = 'approved', scheduled_send_at = ?, approved_at = ?,
             payload = json_set(payload, '$.note', ?),
             updated_at = CURRENT_TIMESTAMP
         WHERE number = ? AND status = 'draft'`,
      )
      .bind(scheduledSendAt, new Date().toISOString(), trimmedNote, number)
      .run();
    return Boolean(result?.meta?.changes);
  } catch (error) {
    if (isMissingBriefIssuesInfra(error)) return false;
    throw error;
  }
}

/** Approved issues whose scheduled send time has arrived (for the send cron). */
export async function getDueApprovedBriefs(nowIso: string): Promise<BriefIssue[]> {
  const db = getSiteDb();
  if (!db) return [];
  try {
    const { results } = await db
      .prepare(
        `SELECT * FROM brief_issues
         WHERE status = 'approved' AND scheduled_send_at IS NOT NULL
           AND scheduled_send_at <= ?
         ORDER BY period_through ASC LIMIT 5`,
      )
      .bind(nowIso)
      .all<BriefIssueRow>();
    return (results ?? [])
      .map(parseBriefIssueRow)
      .filter((issue): issue is BriefIssue => issue !== null);
  } catch (error) {
    if (isMissingBriefIssuesInfra(error)) return [];
    throw error;
  }
}

/** Mark an approved issue as sent. Guarded so a re-run cannot double-send. */
export async function markBriefSent(number: number): Promise<boolean> {
  const db = getSiteDb();
  if (!db || !Number.isInteger(number)) return false;
  try {
    const result = await db
      .prepare(
        `UPDATE brief_issues
         SET status = 'sent', sent_at = ?, updated_at = CURRENT_TIMESTAMP
         WHERE number = ? AND status = 'approved'`,
      )
      .bind(new Date().toISOString(), number)
      .run();
    return Boolean(result?.meta?.changes);
  } catch (error) {
    if (isMissingBriefIssuesInfra(error)) return false;
    throw error;
  }
}
