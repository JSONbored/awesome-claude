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
    for (const tag of entry.tags ?? []) {
      const slug = tagSlug(tag);
      if (!slug) continue;
      let group = map.get(slug);
      if (!group) {
        group = { entries: [], names: new Map() };
        map.set(slug, group);
      }
      group.entries.push(entry);
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
