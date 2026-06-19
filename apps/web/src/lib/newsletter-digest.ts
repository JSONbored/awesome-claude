// Selection logic for the weekly "new & notable" digest. Pure (no I/O) so it's
// unit-testable; the scheduled job feeds it getDirectoryEntries() + Date.now().

export type DigestCandidate = {
  title: string;
  category: string;
  slug: string;
  description?: string;
  cardDescription?: string;
  dateAdded?: string;
};

export type DigestItem = {
  title: string;
  category: string;
  slug: string;
  summary: string;
};

export type DigestSelectionOptions = {
  /** How far back to look for "new" entries. */
  windowDays?: number;
  /** Don't send a digest with fewer than this many items (skip thin weeks). */
  min?: number;
  /** Cap the digest to this many items. */
  max?: number;
};

const DAY_MS = 86_400_000;

/**
 * Pick the entries added within the last `windowDays`, newest first. Returns
 * null when there are fewer than `min` (the caller skips the send that week) so
 * the newsletter never goes out thin or empty.
 */
export function selectDigestEntries(
  entries: readonly DigestCandidate[],
  nowMs: number,
  options: DigestSelectionOptions = {},
): DigestItem[] | null {
  const windowDays = options.windowDays ?? 7;
  const min = options.min ?? 5;
  const max = options.max ?? 6;
  const cutoff = nowMs - windowDays * DAY_MS;

  const recent = entries
    .map((entry) => ({ entry, added: entry.dateAdded ? Date.parse(entry.dateAdded) : NaN }))
    .filter(({ added }) => Number.isFinite(added) && added >= cutoff && added <= nowMs)
    .sort((a, b) => b.added - a.added);

  if (recent.length < min) return null;

  return recent.slice(0, max).map(({ entry }) => ({
    title: entry.title,
    category: entry.category,
    slug: entry.slug,
    summary: (entry.cardDescription || entry.description || "").trim(),
  }));
}

/**
 * Group an ordered list of digest items by category, preserving the within-
 * category order of the input. Returns an array of `{ category, items }` pairs
 * sorted by the position of each category's first item in the original list,
 * so the grouping never reorders the digest relative to how `selectDigestEntries`
 * ranked it.
 *
 * Useful for rendering category headings in the newsletter template without
 * a separate sort pass.
 */
export function groupDigestByCategory(
  items: readonly DigestItem[],
): { category: string; items: DigestItem[] }[] {
  const orderMap = new Map<string, number>();
  const groupMap = new Map<string, DigestItem[]>();

  for (const item of items) {
    if (!groupMap.has(item.category)) {
      groupMap.set(item.category, []);
      orderMap.set(item.category, orderMap.size);
    }
    groupMap.get(item.category)!.push(item);
  }

  return [...groupMap.entries()]
    .sort((a, b) => (orderMap.get(a[0]) ?? 0) - (orderMap.get(b[0]) ?? 0))
    .map(([category, items]) => ({ category, items }));
}

/**
 * Count how many digest items belong to each category. Returns a map from
 * category key to count, including only categories present in `items`.
 * Useful for analytics and for deciding whether to add a "summary" header
 * that lists category counts.
 */
export function digestCategoryCounts(items: readonly DigestItem[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
  }
  return counts;
}
