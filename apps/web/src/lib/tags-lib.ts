/**
 * Pure tag-grouping helpers.
 *
 * Normalizes raw entry tags into slugged groups and derives related-topic
 * interlinks. Every function is parameterized on the entry list (or a
 * pre-built group list) it operates on — nothing here reads the global dataset
 * or memoizes, so given the same inputs the output is deterministic.
 *
 * The public surface (`tags.ts` / `@/lib/tags`) binds these to the `ENTRIES`
 * dataset and keeps the memoized `getAllTagGroups()` cache in the wrapper.
 */

import type { Entry } from "@/types/registry";

export function tagSlug(tag: string) {
  return tag
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type TagGroup = { slug: string; name: string; entries: Entry[] };

/** Build slugged tag groups from a set of entries, sorted by group size (desc). */
export function buildTagGroups(entries: Entry[]): TagGroup[] {
  const map = new Map<string, { entries: Entry[]; names: Map<string, number> }>();
  for (const entry of entries) {
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
  return [...map.entries()]
    .map(([slug, group]) => ({
      slug,
      // Canonical display name: most frequent raw casing (ties broken alphabetically).
      name: [...group.names.entries()].sort(
        (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
      )[0][0],
      entries: group.entries,
    }))
    .sort((a, b) => b.entries.length - a.entries.length);
}

export function findTagGroup(groups: TagGroup[], slug: string): TagGroup | undefined {
  return groups.find((group) => group.slug === slug);
}

// Tags with enough entries to be a non-thin, indexable hub.
export function filterIndexableTagGroups(groups: TagGroup[]): TagGroup[] {
  return groups.filter((group) => group.entries.length >= 2);
}

// Tags that most co-occur with this one across its entries — for "related topics" interlinking.
// Only returns indexable (>=2 entry) groups so we never link to thin/noindex tag pages.
export function computeRelatedTags(groups: TagGroup[], slug: string, limit = 8): TagGroup[] {
  const group = findTagGroup(groups, slug);
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
    .map(([s]) => findTagGroup(groups, s))
    .filter((g): g is TagGroup => Boolean(g) && (g as TagGroup).entries.length >= 2)
    .slice(0, limit);
}
