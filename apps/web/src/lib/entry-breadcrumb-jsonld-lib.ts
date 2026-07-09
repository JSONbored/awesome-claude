// Pure builder for an entry detail page's schema.org BreadcrumbList JSON-LD,
// split out of the route head() so the Directory > category > entry trail can be
// unit-tested. The absolute-URL resolver is injected to keep the builder pure.

import type { Entry } from "@/types/registry";

/** schema.org BreadcrumbList JSON-LD: Directory > category > entry. */
export function entryBreadcrumbJsonLd(
  entry: Entry,
  url: string,
  absoluteUrl: (path: string) => string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Directory", item: absoluteUrl("/browse") },
      {
        "@type": "ListItem",
        position: 2,
        name: entry.category,
        item: absoluteUrl(`/${entry.category}`),
      },
      { "@type": "ListItem", position: 3, name: entry.title, item: url },
    ],
  };
}
