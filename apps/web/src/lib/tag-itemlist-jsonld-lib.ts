// Pure builder for a tag page's schema.org ItemList JSON-LD, split out of the
// route head() so the name/count and the first-30 slice cap can be unit-tested.
// The ListItem mapping is delegated to the shared entry ItemList builder.

import { entryItemListJsonLd, type ItemListEntryRef } from "@/lib/entry-itemlist-jsonld-lib";

/**
 * schema.org ItemList JSON-LD for a tag's resources. numberOfItems reflects the
 * full set; itemListElement is capped at the first 30 entries.
 */
export function tagItemListJsonLd(
  tagName: string,
  description: string,
  entries: ItemListEntryRef[],
  absoluteUrl: (path: string) => string,
) {
  return entryItemListJsonLd(
    `Claude resources tagged ${tagName}`,
    description,
    entries,
    absoluteUrl,
  );
}
