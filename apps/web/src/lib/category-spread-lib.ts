// Pure top-categories summary for a set of entries, split out of the tag detail
// route so the count/sort/label resolution can be unit-tested.

import { categoryLabels } from "@/lib/site";
import { CATEGORIES, type Entry } from "@/types/registry";

/**
 * The `limit` most-common category labels among `entries`, most-frequent first.
 * A category id resolves to its `categoryLabels` label, else the `CATEGORIES`
 * label, else the raw id.
 */
export function categorySpread(entries: Entry[], limit = 3): string[] {
  const counts = new Map<string, number>();
  for (const e of entries) counts.set(e.category, (counts.get(e.category) ?? 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => categoryLabels[id] ?? CATEGORIES.find((c) => c.id === id)?.label ?? id);
}
