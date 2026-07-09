// Pure builder for a platform+category ("for/<platform>/<category>") page's
// schema.org ItemList JSON-LD, split out of the route head() so the name/count
// and the first-30 slice cap can be unit-tested. The absolute-URL resolver is
// injected.

type PlatformCategoryEntryLike = {
  title: string;
  category: string;
  slug: string;
};

/**
 * schema.org ItemList JSON-LD for a platform+category's resources.
 * numberOfItems reflects the full set; itemListElement is capped at 30 entries.
 */
export function platformCategoryItemListJsonLd(
  platformLabel: string,
  categoryLabel: string,
  description: string,
  entries: PlatformCategoryEntryLike[],
  absoluteUrl: (path: string) => string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Claude ${categoryLabel} for ${platformLabel}`,
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
