// Pure builder for a comparison page's schema.org ItemList JSON-LD, split out of
// the route head() so the entry mapping can be unit-tested. The absolute-URL
// resolver is injected to keep the builder pure.

type ComparisonLike = {
  heading: string;
  seoDescription: string;
};

type ComparisonEntryLike = {
  title: string;
  category: string;
  slug: string;
};

/** schema.org ItemList JSON-LD for a comparison's resolved entries. */
export function comparisonItemListJsonLd(
  comparison: ComparisonLike,
  entries: ComparisonEntryLike[],
  absoluteUrl: (path: string) => string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: comparison.heading,
    description: comparison.seoDescription,
    numberOfItems: entries.length,
    itemListElement: entries.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.title,
      url: absoluteUrl(`/entry/${entry.category}/${entry.slug}`),
    })),
  };
}
