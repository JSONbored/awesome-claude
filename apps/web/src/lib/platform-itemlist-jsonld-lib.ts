// Pure builder for a platform ("for/<platform>") page's schema.org ItemList
// JSON-LD, split out of the route head(). The ListItem mapping and the item cap
// are delegated to the shared entry ItemList builder.

import { entryItemListJsonLd, type ItemListEntryRef } from "@/lib/entry-itemlist-jsonld-lib";

/**
 * schema.org ItemList JSON-LD for a platform's resources. numberOfItems reflects
 * the full set; itemListElement is capped at the first 30 entries.
 */
export function platformItemListJsonLd(
  label: string,
  description: string,
  entries: ItemListEntryRef[],
  absoluteUrl: (path: string) => string,
) {
  return entryItemListJsonLd(`Claude resources for ${label}`, description, entries, absoluteUrl);
}
