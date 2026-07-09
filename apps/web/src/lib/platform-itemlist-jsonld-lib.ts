// Pure builder for a platform ("for/<platform>") page's schema.org ItemList
// JSON-LD, split out of the route head() so the label/count/slice-cap behavior
// can be unit-tested. The absolute-URL resolver is injected.

type PlatformEntryLike = {
  title: string;
  category: string;
  slug: string;
};

/**
 * schema.org ItemList JSON-LD for a platform's resources. numberOfItems reflects
 * the full set; itemListElement is capped at the first 30 entries.
 */
export function platformItemListJsonLd(
  label: string,
  description: string,
  entries: PlatformEntryLike[],
  absoluteUrl: (path: string) => string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Claude resources for ${label}`,
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
