// Pure builder for an entry detail page's schema.org WebPage JSON-LD, split out
// of the route head() so the field mapping (dateModified fallback, optional
// isBasedOn) can be unit-tested without rendering the route.

import type { Entry } from "@/types/registry";
import { safeSitemapDate } from "@/lib/sitemap-policy";

/** Freshness fields that live on the raw registry snapshot (not client Entry). */
export type EntryWebPageFreshness = {
  contentUpdatedAt?: string | null;
  repoUpdatedAt?: string | null;
  verifiedAt?: string | null;
};

/**
 * dateModified for entry WebPage JSON-LD: prefer the same content/repo/verified
 * priority the sitemap uses for lastmod (#5472 / #5675), then fall back to the
 * historical reviewedAt ?? dateAdded mapping when those signals are absent.
 */
export function entryWebPageDateModified(
  entry: Pick<Entry, "dateAdded"> & { reviewedAt?: string } & EntryWebPageFreshness,
): string {
  const fresh = entry.contentUpdatedAt || entry.repoUpdatedAt || entry.verifiedAt || null;
  if (fresh && safeSitemapDate(fresh)) return fresh;
  return entry.reviewedAt ?? entry.dateAdded;
}

/** schema.org WebPage JSON-LD for an entry at the given absolute url. */
export function entryWebPageJsonLd(entry: Entry & EntryWebPageFreshness, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: entry.title,
    description: entry.description,
    url,
    datePublished: entry.dateAdded,
    dateModified: entryWebPageDateModified(entry),
    about: entry.category,
    author: { "@type": "Person", name: entry.author },
    ...(entry.sourceUrl ? { isBasedOn: entry.sourceUrl } : {}),
  };
}
