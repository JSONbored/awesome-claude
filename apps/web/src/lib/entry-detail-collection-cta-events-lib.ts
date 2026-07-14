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
