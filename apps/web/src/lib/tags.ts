import { ENTRIES } from "@/data/entries";
import type { Entry } from "@/types/registry";

export function tagSlug(tag: string) {
  return tag
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type TagGroup = { slug: string; name: string; entries: Entry[] };

let cache: TagGroup[] | null = null;

export function getAllTagGroups(): TagGroup[] {
  if (cache) return cache;
  const map = new Map<string, { entries: Entry[]; names: Map<string, number> }>();
  for (const entry of ENTRIES) {
    // An entry can carry multiple raw tags that normalize to the same slug
    // (e.g. "AI" and "ai"); count it once per slug so group sizes stay accurate.
    const seenSlugs = new Set<string>();
    for (const tag of entry.tags ?? []) {
      const slug = tagSlug(tag);
      if (!slug) continue;
      let group = map.get(slug);
      if (!group) {
        group = { entries: [], names: new Map() };
        map.set(slug, group);
      }
      if (!seenSlugs.has(slug)) {
        group.entries.push(entry);
        seenSlugs.add(slug);
      }
      group.names.set(tag, (group.names.get(tag) ?? 0) + 1);
    }
  }
  cache = [...map.entries()]
    .map(([slug, group]) => ({
      slug,
      // Canonical display name: most frequent raw casing (ties broken alphabetically).
      name: [...group.names.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0][0],
      entries: group.entries,
    }))
    .sort((a, b) => b.entries.length - a.entries.length);
  return cache;
}

export function getTagGroup(slug: string): TagGroup | undefined {
  return getAllTagGroups().find((group) => group.slug === slug);
}

// Tags with enough entries to be a non-thin, indexable hub.
export function getIndexableTagGroups(): TagGroup[] {
  return getAllTagGroups().filter((group) => group.entries.length >= 2);
}

// Tags that most co-occur with this one across its entries — for "related topics" interlinking.
// Only returns indexable (>=2 entry) groups so we never link to thin/noindex tag pages.
export function relatedTags(slug: string, limit = 8): TagGroup[] {
  const group = getTagGroup(slug);
  if (!group) return [];
  const counts = new Map<string, number>();
  for (const entry of group.entries) {
    for (const tag of entry.tags ?? []) {
      const s = tagSlug(tag);
      if (s === group.slug) continue;
      counts.set(s, (counts.get(s) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([s]) => getTagGroup(s))
    .filter((g): g is TagGroup => Boolean(g) && (g as TagGroup).entries.length >= 2)
    .slice(0, limit);
}
