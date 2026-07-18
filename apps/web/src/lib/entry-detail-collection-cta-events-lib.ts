/**
 * Pure entry detail collection item egress analytics helpers.
 *
 * Maps included-entry navigation from collection metadata to privacy-light
 * event names without embedding entry titles or collection copy.
 */

export const ENTRY_DETAIL_COLLECTION_ITEMS_SURFACE = "detail-collection-items";

export function entryDetailCollectionEntryKey(category: string, slug: string): string {
  return `${category}/${slug}`;
}

export function entryDetailCollectionEntryAnalyticsEvent(): string {
  return "detail_collection_entry_click";
}

export function entryDetailCollectionEntryAnalyticsData(
  fromCategory: string,
  fromSlug: string,
  peerEntryRef: string,
  itemIndex: number,
  itemCount: number,
) {
  return {
    entry: entryDetailCollectionEntryKey(fromCategory, fromSlug),
    surface: ENTRY_DETAIL_COLLECTION_ITEMS_SURFACE,
    peer: peerEntryRef,
    itemIndex,
    itemCount,
  };
}

export type EntryDetailCollectionEntryDestination = {
  to: "/entry/$category/$slug";
  params: { category: string; slug: string };
};

/** Map a collection peer ref to an entry detail destination. */
export function entryDetailCollectionEntryDestination(
  category: string,
  slug: string,
): EntryDetailCollectionEntryDestination | null {
  const categoryId = category.trim();
  const entrySlug = slug.trim();
  switch (categoryId) {
    case "":
      return null;
    default:
      switch (entrySlug) {
        case "":
          return null;
        default:
          return {
            to: "/entry/$category/$slug",
            params: { category: categoryId, slug: entrySlug },
          };
      }
  }
}
