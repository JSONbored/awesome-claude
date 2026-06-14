import type { DirectoryEntry } from "@/lib/content.server";

export function safeSitemapDate(value?: string | null) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

/**
 * Whether an entry's detail page should be advertised in the sitemap.
 *
 * `tools` entries are commercial listings (routed to the website lead flows per
 * AGENTS.md) and are thin-by-design, so we keep them crawlable via internal links
 * but do not advertise them in the sitemap. Anything explicitly `robotsIndex:false`
 * is excluded too. Accepts any entry-shaped object so both the server
 * `DirectoryEntry` and the client registry `Entry` satisfy it.
 */
export function isSitemapIndexableEntry(entry: {
  category: string;
  robotsIndex?: boolean;
}) {
  return entry.category !== "tools" && entry.robotsIndex !== false;
}

export function sitemapEntryLastModified(entry: DirectoryEntry) {
  return safeSitemapDate(
    entry.contentUpdatedAt || entry.repoUpdatedAt || entry.verifiedAt || entry.dateAdded,
  );
}
