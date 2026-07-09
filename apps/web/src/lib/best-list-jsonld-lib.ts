// Pure builder for a "best list" page's schema.org ItemList JSON-LD, split out
// of the route head() so the pick mapping can be unit-tested. The absolute-URL
// resolver and the ref->title lookup are injected to keep the builder pure.

type BestListLike = {
  title: string;
  subtitle: string;
  picks: Array<{ ref: string }>;
};

/** schema.org ItemList JSON-LD for a best list's ordered picks. */
export function bestListItemListJsonLd(
  list: BestListLike,
  absoluteUrl: (path: string) => string,
  resolveTitle: (ref: string) => string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: list.title,
    description: list.subtitle,
    numberOfItems: list.picks.length,
    itemListElement: list.picks.map((pick, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: resolveTitle(pick.ref),
      url: absoluteUrl(`/entry/${pick.ref}`),
    })),
  };
}
