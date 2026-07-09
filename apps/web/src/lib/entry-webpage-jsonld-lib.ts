// Pure builder for an entry detail page's schema.org WebPage JSON-LD, split out
// of the route head() so the field mapping (dateModified fallback, optional
// isBasedOn) can be unit-tested without rendering the route.

import type { Entry } from "@/types/registry";

/** schema.org WebPage JSON-LD for an entry at the given absolute url. */
export function entryWebPageJsonLd(entry: Entry, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: entry.title,
    description: entry.description,
    url,
    datePublished: entry.dateAdded,
    dateModified: entry.reviewedAt ?? entry.dateAdded,
    about: entry.category,
    author: { "@type": "Person", name: entry.author },
    ...(entry.sourceUrl ? { isBasedOn: entry.sourceUrl } : {}),
  };
}
