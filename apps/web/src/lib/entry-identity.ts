export interface EntryIdentity {
  category: string;
  slug: string;
}

export function entryRef(entry: EntryIdentity) {
  return `${entry.category}/${entry.slug}`;
}

export function entryDomId(entry: EntryIdentity) {
  return `${entry.category}-${entry.slug}`;
}

export function sameEntry(left: EntryIdentity, right: EntryIdentity) {
  return left.category === right.category && left.slug === right.slug;
}

export function parseEntryRef(ref: string): EntryIdentity | null {
  const parts = ref.split("/");
  if (parts.length !== 2) return null;
  const [category, slug] = parts.map((part) => part.trim());
  if (!category || !slug) return null;
  return { category, slug };
}

/**
 * The canonical root-relative path for an entry's detail page.
 * Use this everywhere a URL path to an entry is needed so the pattern
 * `/entry/<category>/<slug>` stays consistent if the URL structure ever changes.
 *
 * @example entryPath({ category: "mcp", slug: "browser-mcp" }) // "/entry/mcp/browser-mcp"
 */
export function entryPath(entry: EntryIdentity): string {
  return `/entry/${entry.category}/${entry.slug}`;
}

/**
 * Sort a list of entries deterministically: primary sort by `category`
 * ascending, secondary by `slug` ascending. Useful for stable rendering order
 * and snapshot tests where insertion order must not affect the output.
 */
export function sortEntries<T extends EntryIdentity>(entries: readonly T[]): T[] {
  return [...entries].sort(
    (a, b) =>
      a.category.localeCompare(b.category) || a.slug.localeCompare(b.slug),
  );
}
