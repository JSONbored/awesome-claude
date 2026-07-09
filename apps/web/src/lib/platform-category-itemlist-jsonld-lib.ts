// Pure builder for a platform+category ("for/<platform>/<category>") page's
// schema.org ItemList JSON-LD, split out of the route head(). The ListItem
// mapping and the item cap are delegated to the shared entry ItemList builder.

import { entryItemListJsonLd, type ItemListEntryRef } from "@/lib/entry-itemlist-jsonld-lib";

/**
 * schema.org ItemList JSON-LD for a platform+category's resources.
 * numberOfItems reflects the full set; itemListElement is capped at 30 entries.
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
  );
}
