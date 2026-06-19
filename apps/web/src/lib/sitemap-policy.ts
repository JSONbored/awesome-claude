import type { DirectoryEntry } from "@/lib/content.server";

export function safeSitemapDate(value?: string | null) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

/**
 * Whether an entry's detail page should be advertised in the sitemap.
 *
 * Every category — including `tools` — is advertised unless the entry explicitly
 * opts out with `robotsIndex:false`. `tools` were previously excluded as
 * thin-by-design commercial listings, but they draw substantial organic search
 * demand, so we now advertise their canonical `/entry/tools/<slug>` pages and
 * gate quality per-entry via `robotsIndex` instead. Accepts any entry-shaped
 * object so both the server `DirectoryEntry` and the client registry `Entry`
 * satisfy it.
 */
export function isSitemapIndexableEntry(entry: {
  category: string;
  robotsIndex?: boolean;
}) {
  return entry.robotsIndex !== false;
}

export function sitemapEntryLastModified(entry: DirectoryEntry) {
  return safeSitemapDate(
    entry.contentUpdatedAt || entry.repoUpdatedAt || entry.verifiedAt || entry.dateAdded,
  );
}
