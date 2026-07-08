// Pure per-tag summary view for the tags index, split out of the route so the
// count/sort derivation can be unit-tested without the tag dataset.

export type TagView = {
  slug: string;
  name: string;
  count: number;
  topCategory: string;
  categoryCount: number;
};

type TagGroupLike = {
  slug: string;
  name: string;
  entries: ReadonlyArray<{ category: string }>;
};

/** Summarize a tag group: entry count, most-common category (ties broken
 *  alphabetically), and the number of distinct categories. */
export function toTagView(group: TagGroupLike): TagView {
  const catCounts = new Map<string, number>();
  for (const entry of group.entries) {
    catCounts.set(entry.category, (catCounts.get(entry.category) ?? 0) + 1);
  }
  const sorted = [...catCounts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  return {
    slug: group.slug,
    name: group.name,
    count: group.entries.length,
    topCategory: sorted[0]?.[0] ?? "",
    categoryCount: sorted.length,
  };
}
