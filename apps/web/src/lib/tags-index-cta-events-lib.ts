/**
 * Pure tags index CTA analytics helpers.
 *
 * Maps tag index navigation and filter interactions to privacy-light event
 * names without embedding tag display names or filter query text.
 */

export const TAGS_INDEX_SURFACE = "tags-index";

export type TagsIndexTagVariant = "featured" | "pill";

export function tagsIndexTagSelectAnalyticsEvent(): string {
  return "tags_index_tag_select";
}

export function tagsIndexTagSelectAnalyticsData(
  tagSlug: string,
  entryCount: number,
  variant: TagsIndexTagVariant,
  topCategory?: string,
) {
  return {
    surface: TAGS_INDEX_SURFACE,
    tagSlug,
    entryCount,
    variant,
    ...(topCategory ? { topCategory } : {}),
  };
}

export function tagsIndexFilterAnalyticsEvent(): string {
  return "tags_index_filter";
}

export function tagsIndexFilterAnalyticsData(queryLength: number, matchCount: number) {
  return {
    surface: TAGS_INDEX_SURFACE,
    queryLength,
    matchCount,
  };
}

export function tagsIndexBrowseEgressAnalyticsEvent(): string {
  return "tags_index_browse_egress_click";
}

export function tagsIndexBrowseEgressAnalyticsData() {
  return {
    surface: TAGS_INDEX_SURFACE,
  };
}
