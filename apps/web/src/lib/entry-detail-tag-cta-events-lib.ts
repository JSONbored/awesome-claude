/**
 * Pure entry detail tag and category-hub egress analytics helpers.
 *
 * Maps overview tag chips and "More in {category}" navigation to privacy-light
 * event names without embedding tag labels or entry titles.
 */

export const ENTRY_DETAIL_TAGS_SURFACE = "detail-tags";
export const ENTRY_DETAIL_RELATED_SURFACE = "detail-related";

export function entryDetailTagEntryKey(category: string, slug: string): string {
  return `${category}/${slug}`;
}

export function entryDetailTagAnalyticsEvent(): string {
  return "detail_tag_click";
}

export function entryDetailTagAnalyticsData(
  category: string,
  slug: string,
  tagSlug: string,
  rowIndex: number,
  tagCount: number,
) {
  return {
    entry: entryDetailTagEntryKey(category, slug),
    surface: ENTRY_DETAIL_TAGS_SURFACE,
    tagSlug,
    rowIndex,
    tagCount,
  };
}

export function entryDetailCategoryHubAnalyticsEvent(): string {
  return "detail_category_hub_click";
}

export function entryDetailCategoryHubAnalyticsData(category: string, slug: string) {
  return {
    entry: entryDetailTagEntryKey(category, slug),
    surface: ENTRY_DETAIL_RELATED_SURFACE,
    category,
  };
}
