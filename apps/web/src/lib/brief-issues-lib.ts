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
export function isMissingBriefIssuesInfra(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? "");
  return /no such table: brief_issues|no such table/i.test(message);
}

export function parseBriefIssueRow(row: BriefIssueRow | null): BriefIssue | null {
  if (!row) return null;
  let payload: Record<string, unknown> = {};
  try {
    payload = JSON.parse(row.payload) as Record<string, unknown>;
  } catch {
    payload = {};
  }
  return { ...row, payload };
}
