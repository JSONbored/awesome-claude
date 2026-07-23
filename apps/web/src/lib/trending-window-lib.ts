/**
 * Trending list time-window helpers.
 *
 * The `/trending` search param `window` (7d | 30d | all) filters the loaded
 * ranking by entry `dateAdded`. Real engagement-windowed scoring lives on the
 * API side later; this keeps the client control honest and visible today.
 */

export type TrendingWindow = "7d" | "30d" | "all";

export const TRENDING_WINDOW_OPTIONS = [
  { id: "7d" as const, label: "7 days" },
  { id: "30d" as const, label: "30 days" },
  { id: "all" as const, label: "All time" },
] as const;

const DAY_MS = 86_400_000;

export function trendingWindowDays(window: TrendingWindow): number | null {
  switch (window) {
    case "7d":
      return 7;
    case "30d":
      return 30;
    case "all":
      return null;
    default:
      return null;
  }
}

export type TrendingWindowCandidate = {
  dateAdded?: string | null;
};

/**
 * Keep entries whose `dateAdded` falls within the selected window.
 * `all` returns the input order unchanged. Entries without a parseable
 * `dateAdded` are dropped from finite windows (kept for `all`).
 */
export function filterTrendingRowsByWindow<T extends TrendingWindowCandidate>(
  rows: readonly T[],
  window: TrendingWindow,
  nowMs: number = Date.now(),
): T[] {
  const days = trendingWindowDays(window);
  if (days === null) return [...rows];

  const cutoff = nowMs - days * DAY_MS;
  return rows.filter((entry) => {
    const added = entry.dateAdded ? Date.parse(entry.dateAdded) : Number.NaN;
    return Number.isFinite(added) && added >= cutoff && added <= nowMs;
  });
}

/**
 * Prefer window-filtered ranking rows; when a finite window matches nothing
 * in the loaded set, use a caller-supplied recent-fallback list (e.g. newest
 * directory additions) so the control still produces a visible row set.
 */
export function resolveTrendingWindowRows<T extends TrendingWindowCandidate>(
  fetchedRows: readonly T[],
  recentFallback: readonly T[],
  window: TrendingWindow,
  nowMs: number = Date.now(),
): T[] {
  if (window === "all") return [...fetchedRows];
  const filtered = filterTrendingRowsByWindow(fetchedRows, window, nowMs);
  return filtered.length > 0 ? filtered : [...recentFallback];
}

/** Build a shareable `/trending` path, omitting default `window=all`. */
export function trendingSharePath(window: TrendingWindow, category: string): string {
  const params = new URLSearchParams();
  if (window !== "all") params.set("window", window);
  if (category) params.set("category", category);
  const query = params.toString();
  return query ? `/trending?${query}` : "/trending";
}
