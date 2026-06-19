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
