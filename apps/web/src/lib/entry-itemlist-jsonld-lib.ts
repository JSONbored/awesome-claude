// Shared builder for the schema.org ItemList JSON-LD that hub pages (tag,
// category, platform, comparison, ...) emit over a list of registry entries.
// Each page supplies its own list name/description; the ListItem mapping,
// 1-based positions, numberOfItems and the item cap live here so they are
// defined and tested once. The absolute-URL resolver is injected.

export type ItemListEntryRef = {
  title: string;
  category: string;
  slug: string;
};

/** Default number of ListItems emitted; numberOfItems still reflects the full set. */
export const DEFAULT_ITEM_LIST_CAP = 30;

/**
 * schema.org ItemList JSON-LD over registry entries. `numberOfItems` reflects the
 * full set; `itemListElement` is capped at `cap` entries (pass Infinity for all).
 */
export function entryItemListJsonLd(
  name: string,
  description: string,
  entries: ItemListEntryRef[],
  absoluteUrl: (path: string) => string,
  cap: number = DEFAULT_ITEM_LIST_CAP,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    description,
    numberOfItems: entries.length,
    itemListElement: entries.slice(0, cap).map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.title,
      url: absoluteUrl(`/entry/${entry.category}/${entry.slug}`),
    })),
  };
}
