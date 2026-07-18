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

export type EntryDetailTagSelectDestination = {
  to: "/tags/$tag";
  params: { tag: string };
};

/** Map a tag slug to a tags hub destination. */
export function entryDetailTagSelectDestination(
  tagSlug: string,
): EntryDetailTagSelectDestination | null {
  const slug = tagSlug.trim();
  switch (slug) {
    case "":
      return null;
    default:
      return { to: "/tags/$tag", params: { tag: slug } };
  }
}

export type EntryDetailCategoryHubDestination = {
  to: "/$category";
  params: { category: string };
};

/** Map an entry category to its category hub destination. */
export function entryDetailCategoryHubDestination(
  category: string,
): EntryDetailCategoryHubDestination | null {
  const id = category.trim();
  switch (id) {
    case "":
      return null;
    default:
      return { to: "/$category", params: { category: id } };
  }
}
