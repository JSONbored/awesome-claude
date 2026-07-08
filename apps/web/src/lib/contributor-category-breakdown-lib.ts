// Pure per-category tally for a contributor's entries, split out of the
// contributor detail route so the counting/sorting can be unit-tested.

import type { Category, Entry } from "@/types/registry";

/**
 * Count a contributor's entries by category, returned most-frequent first with
 * ties broken alphabetically by category id.
 */
export function categoryBreakdown(entries: Entry[]): Array<{ category: Category; count: number }> {
  const counts = new Map<Category, number>();
  for (const entry of entries) {
    counts.set(entry.category, (counts.get(entry.category) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((left, right) => right.count - left.count || left.category.localeCompare(right.category));
}
