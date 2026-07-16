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
