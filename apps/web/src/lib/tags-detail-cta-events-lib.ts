/**
 * Pure tags detail CTA analytics helpers.
 *
 * Maps tag hub related-topic navigation and not-found egress to privacy-light
 * event names without embedding tag display names or entry titles.
 */

export const TAGS_DETAIL_SURFACE = "tags-detail";
export const TAGS_DETAIL_NOTFOUND_SURFACE = "tags-detail-notfound";

export function tagsDetailRelatedSelectAnalyticsEvent(): string {
  return "tags_detail_related_select";
}

export function tagsDetailRelatedSelectAnalyticsData(
  fromTagSlug: string,
  tagSlug: string,
  entryCount: number,
) {
  return {
    surface: TAGS_DETAIL_SURFACE,
    fromTagSlug,
    tagSlug,
    entryCount,
  };
}

export function tagsDetailNotFoundEgressAnalyticsEvent(): string {
  return "tags_detail_notfound_egress_click";
}

export function tagsDetailNotFoundEgressAnalyticsData() {
  return {
    surface: TAGS_DETAIL_NOTFOUND_SURFACE,
  };
}

export function tagsDetailBrowseEgressAnalyticsEvent(): string {
  return "tags_detail_browse_egress_click";
}

export function tagsDetailBrowseEgressAnalyticsData(tagSlug: string, entryCount: number) {
  return {
    surface: TAGS_DETAIL_SURFACE,
    tagSlug,
    entryCount,
  };
}

export type TagsDetailRelatedSelectDestination = {
  to: "/tags/$tag";
  params: { tag: string };
};

/** Map a related-tag slug to a tag hub destination. */
export function tagsDetailRelatedSelectDestination(
  tagSlug: string,
): TagsDetailRelatedSelectDestination | null {
  const slug = tagSlug.trim();
  switch (slug) {
    case "":
      return null;
    default:
      return { to: "/tags/$tag", params: { tag: slug } };
  }
}

export type TagsDetailBrowseEgressDestination = {
  to: "/browse";
  search: { q: string };
};

/** Map a tags-detail browse CTA to a directory search destination. */
export function tagsDetailBrowseEgressDestination(
  query: string,
): TagsDetailBrowseEgressDestination | null {
  const q = query.trim();
  switch (q) {
    case "":
      return null;
    default:
      return { to: "/browse", search: { q } };
  }
}

export type TagsDetailNotFoundEgressDestination = {
  to: "/tags";
};

/** Map a tags-detail not-found egress id to the tags index. */
export function tagsDetailNotFoundEgressDestination(
  destination: string,
): TagsDetailNotFoundEgressDestination | null {
  switch (destination) {
    case "tags":
      return { to: "/tags" };
    default:
      return null;
  }
}
