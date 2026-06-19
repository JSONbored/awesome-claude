import type { Entry } from "@/types/registry";

/**
 * Ecosystem statistics for the data report. (Stale-base variant — this branch
 * was cut before apps/web/src/lib/ecosystem-stats.ts existed on main, so this is
 * an add/add against the version main already ships.)
 */
export interface StatRow {
  label: string;
  count: number;
}

/** Count entries grouped by their declared category. */
export function categoryDistribution(entries: ReadonlyArray<Entry>): StatRow[] {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    const key = (entry.category ?? "unknown").trim() || "unknown";
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}
