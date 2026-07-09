// Pure builder for a category ("/<category>") page's schema.org ItemList
// JSON-LD, split out of the route head() so the name/count and the first-30
// slice cap can be unit-tested. The absolute-URL resolver is injected.

type CategoryEntryLike = {
  title: string;
  category: string;
  slug: string;
};

/**
 * schema.org ItemList JSON-LD for a category's resources. numberOfItems reflects
 * the full set; itemListElement is capped at the first 30 entries.
 */
export function categoryItemListJsonLd(
  label: string,
  description: string,
  entries: CategoryEntryLike[],
  absoluteUrl: (path: string) => string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Claude ${label}`,
    description,
    numberOfItems: entries.length,
    itemListElement: entries.slice(0, 30).map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.title,
      url: absoluteUrl(`/entry/${entry.category}/${entry.slug}`),
    })),
  };
}
