/**
 * Tag-grouping surface.
 *
 * The pure grouping helpers live in `tags-lib.ts`. This module binds them to the
 * global `ENTRIES` dataset and keeps the memoized `getAllTagGroups()` cache, so
 * existing `@/lib/tags` imports stay unchanged.
 */
import { ENTRIES } from "@/data/entries";
import {
  buildTagGroups,
  computeRelatedTags,
  filterIndexableTagGroups,
  findTagGroup,
  type TagGroup,
} from "@/lib/tags-lib";

export { tagSlug } from "@/lib/tags-lib";
export type { TagGroup } from "@/lib/tags-lib";

let cache: TagGroup[] | null = null;

export function getAllTagGroups(): TagGroup[] {
  if (!cache) cache = buildTagGroups(ENTRIES);
  return cache;
}

export function getTagGroup(slug: string): TagGroup | undefined {
  return findTagGroup(getAllTagGroups(), slug);
}

// Tags with enough entries to be a non-thin, indexable hub.
export function getIndexableTagGroups(): TagGroup[] {
  return filterIndexableTagGroups(getAllTagGroups());
}

// Tags that most co-occur with this one across its entries — for "related topics" interlinking.
export function relatedTags(slug: string, limit = 8): TagGroup[] {
  return computeRelatedTags(getAllTagGroups(), slug, limit);
}
