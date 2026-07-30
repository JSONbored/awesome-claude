export type TrendingWindowId = "7d" | "30d" | "all";

export const TRENDING_WINDOW_OPTIONS: Array<{ id: TrendingWindowId; label: string }> = [
  { id: "all", label: "All time" },
  { id: "30d", label: "30 days" },
  { id: "7d", label: "7 days" },
];

/** ISO date (YYYY-MM-DD) cutoff for a window, or null when unfiltered. */
export function trendingWindowCutoffIso(
  window: TrendingWindowId,
  nowMs: number = Date.now(),
): string | null {
  if (window === "all") return null;
  const days = window === "7d" ? 7 : 30;
  const d = new Date(nowMs);
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

/** True when entry.dateAdded is on/after the window cutoff (string YYYY-MM-DD compare). */
export function entryMatchesTrendingWindow(
  entry: { dateAdded?: string | null },
  window: TrendingWindowId,
  nowMs: number = Date.now(),
): boolean {
  const cutoff = trendingWindowCutoffIso(window, nowMs);
  if (!cutoff) return true;
  const added = String(entry.dateAdded ?? "").slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(added)) return false;
  return added >= cutoff;
}
