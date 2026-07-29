// Pure builder for an entry detail page's schema.org WebPage JSON-LD, split out
// of the route head() so the field mapping (dateModified fallback, optional
// isBasedOn) can be unit-tested without rendering the route.

import type { Entry } from "@/types/registry";
import { sitemapEntryLastModified } from "@/lib/sitemap-policy";

type EntryWebPageFreshness = {
  contentUpdatedAt?: string | null;
  repoUpdatedAt?: string | null;
  verifiedAt?: string | null;
};

/** schema.org WebPage JSON-LD for an entry at the given absolute url. */
export function entryWebPageJsonLd(entry: Entry & EntryWebPageFreshness, url: string) {
  // Prefer content/repo freshness (same priority as sitemap lastmod / #5472),
  // then reviewedAt, then dateAdded — so dateModified stays at least as fresh
  // as the sitemap for the same URL (#5675).
  const dateModified =
    sitemapEntryLastModified({
      contentUpdatedAt: entry.contentUpdatedAt,
      repoUpdatedAt: entry.repoUpdatedAt,
      verifiedAt: entry.verifiedAt || entry.reviewedAt,
      dateAdded: entry.dateAdded,
    })?.toISOString() ??
    entry.reviewedAt ??
    entry.dateAdded;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: entry.title,
    description: entry.description,
    url,
    datePublished: entry.dateAdded,
    dateModified,
    about: entry.category,
    author: { "@type": "Person", name: entry.author },
    ...(entry.sourceUrl ? { isBasedOn: entry.sourceUrl } : {}),
  };
}
