// Pure builder for a platform+category ("for/<platform>/<category>") page's
// schema.org ItemList JSON-LD, split out of the route head(). The ListItem
// mapping is delegated to the shared entry ItemList builder; the page renders
// every matching entry, so no cap is applied (same escape hatch as comparison
// pages / #5593).

import { entryItemListJsonLd, type ItemListEntryRef } from "@/lib/entry-itemlist-jsonld-lib";

/**
 * schema.org ItemList JSON-LD for a platform+category's resources.
 * numberOfItems and itemListElement both reflect the full set rendered on the page.
 */
export function platformCategoryItemListJsonLd(
  platformLabel: string,
  categoryLabel: string,
  description: string,
  entries: ItemListEntryRef[],
  absoluteUrl: (path: string) => string,
) {
  return entryItemListJsonLd(
    `Claude ${categoryLabel} for ${platformLabel}`,
    description,
    entries,
    absoluteUrl,
    Infinity,
  );
}
