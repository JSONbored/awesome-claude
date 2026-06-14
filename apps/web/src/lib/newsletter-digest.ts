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
