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

export type TagsIndexTagSelectDestination = {
  to: "/tags/$tag";
  params: { tag: string };
};

/** Map a tags-index tag slug to a tag hub destination. */
export function tagsIndexTagSelectDestination(
  tagSlug: string,
): TagsIndexTagSelectDestination | null {
  const slug = tagSlug.trim();
  switch (slug) {
    case "":
      return null;
    default:
      return { to: "/tags/$tag", params: { tag: slug } };
  }
}

export type TagsIndexBrowseEgressDestination = {
  to: "/browse";
};

/** Map a tags-index empty-state egress id to directory browse. */
export function tagsIndexBrowseEgressDestination(
  destination: string,
): TagsIndexBrowseEgressDestination | null {
  switch (destination) {
    case "browse":
      return { to: "/browse" };
    default:
      return null;
  }
}
