// Pure builder for a category ("/<category>") page's schema.org ItemList
// JSON-LD, split out of the route head(). The ListItem mapping and the item cap
// are delegated to the shared entry ItemList builder.

import { entryItemListJsonLd, type ItemListEntryRef } from "@/lib/entry-itemlist-jsonld-lib";

/**
 * schema.org ItemList JSON-LD for a category's resources. numberOfItems reflects
 * the full set; itemListElement is capped at the first 30 entries.
 */
export function categoryItemListJsonLd(
  label: string,
  description: string,
  entries: ItemListEntryRef[],
  absoluteUrl: (path: string) => string,
) {
  return entryItemListJsonLd(`Claude ${label}`, description, entries, absoluteUrl);
}
