// Pure builder for a comparison page's schema.org ItemList JSON-LD, split out of
// the route head(). The ListItem mapping is delegated to the shared entry
// ItemList builder; a comparison lists every entry, so no cap is applied.

import { entryItemListJsonLd, type ItemListEntryRef } from "@/lib/entry-itemlist-jsonld-lib";

type ComparisonLike = {
  heading: string;
  seoDescription: string;
};

/** schema.org ItemList JSON-LD for a comparison's resolved entries (uncapped). */
export function comparisonItemListJsonLd(
  comparison: ComparisonLike,
  entries: ItemListEntryRef[],
  absoluteUrl: (path: string) => string,
) {
  return entryItemListJsonLd(
    comparison.heading,
    comparison.seoDescription,
    entries,
    absoluteUrl,
    Infinity,
  );
}
