// Pure builder for a tag page's schema.org ItemList JSON-LD, split out of the
// route head() so the name/count can be unit-tested. The ListItem mapping is
// delegated to the shared entry ItemList builder; the page renders every tagged
// entry, so no cap is applied (same escape hatch as comparison pages / #5593).

import { entryItemListJsonLd, type ItemListEntryRef } from "@/lib/entry-itemlist-jsonld-lib";

/**
 * schema.org ItemList JSON-LD for a tag's resources. numberOfItems and
 * itemListElement both reflect the full set rendered on the page.
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
    Infinity,
  );
}
