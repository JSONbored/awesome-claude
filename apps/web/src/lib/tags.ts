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
  const map = new Map<string, TagGroup>();
  for (const entry of ENTRIES) {
    for (const tag of entry.tags ?? []) {
      const slug = tagSlug(tag);
      if (!slug) continue;
      const group = map.get(slug);
      if (group) group.entries.push(entry);
      else map.set(slug, { slug, name: tag, entries: [entry] });
    }
  }
  cache = [...map.values()].sort((a, b) => b.entries.length - a.entries.length);
  return cache;
}

export function getTagGroup(slug: string): TagGroup | undefined {
  return getAllTagGroups().find((group) => group.slug === slug);
}

// Tags with enough entries to be a non-thin, indexable hub.
export function getIndexableTagGroups(): TagGroup[] {
  return getAllTagGroups().filter((group) => group.entries.length >= 2);
}
