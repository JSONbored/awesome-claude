/**
 * Feed request/IO layer built on top of the pure builders in `feeds-lib.ts`.
 *
 * The deterministic string/data layer (RSS/Atom envelope builders and registry
 * item selectors) lives in `@/lib/feeds-lib` and is re-exported below so the
 * public `@/lib/feeds` surface is unchanged for routes. This module adds the
 * parts that need the platform runtime: SHA-1 ETag hashing, conditional-GET
 * responses, live growth-surface trending, and feed-health aggregation.
 *
 * Feed bodies are deterministic for a given registry snapshot so that an ETag
 * derived from the body bytes is stable across requests. The dispatcher helper
 * `respondFeed` handles `If-None-Match` and emits cache headers.
 */
import { isFeedCurrent } from "@/lib/feed-freshness-lib";
import { getGrowthSurfaces } from "@/lib/growth-surfaces";
import { ifNoneMatchMatches } from "@/lib/http-cache";
import { CATEGORIES } from "@/types/registry";

import {
  buildAtom,
  buildRss,
  categoryItems,
  changelogStreamItems,
  type FeedItem,
  latestPubDate,
  SITE_NAME,
  SITE_TAGLINE,
  siteWideItems,
} from "@/lib/feeds-lib";

export {
  applySavedSearch,
  buildAtom,
  buildRss,
  categoryItems,
  changelogStreamItems,
  esc,
  FEED_CATEGORIES,
  type FeedItem,
  latestPubDate,
  origin,
  rfc822,
  type SavedSearchQuery,
  SITE_NAME,
  SITE_TAGLINE,
  siteWideItems,
} from "@/lib/feeds-lib";

/* --------- ETag + response helpers -------- */

async function sha1Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-1", bytes);
  let out = "";
  const view = new Uint8Array(buf);
  for (let i = 0; i < view.length; i++) out += view[i].toString(16).padStart(2, "0");
  return out;
}

export async function etagFor(body: string): Promise<string> {
  return `"${(await sha1Hex(body)).slice(0, 16)}"`;
}

const XML_CACHE = "public, max-age=300, stale-while-revalidate=3600";

/**
 * Send an XML feed body with conditional-GET support. Returns 304 when the
 * client's If-None-Match matches the body's ETag.
 */
export async function respondFeed(
  request: Request,
  body: string,
  lastBuilt: string,
  contentType = "application/rss+xml; charset=utf-8",
): Promise<Response> {
  const etag = await etagFor(body);
  const headers: Record<string, string> = {
    "Content-Type": contentType,
    "Cache-Control": XML_CACHE,
    ETag: etag,
    "Last-Modified": new Date(lastBuilt).toUTCString(),
  };
  if (ifNoneMatchMatches(request.headers.get("if-none-match"), etag)) {
    return new Response(null, { status: 304, headers });
  }
  return new Response(body, { headers });
}

/* --------- Live trending (growth surfaces) -------- */

export async function trendingItems(): Promise<FeedItem[]> {
  const surfaces = await getGrowthSurfaces();
  const hasLiveSignals =
    surfaces.communitySignalsAvailable || surfaces.votesAvailable || surfaces.intentEventsAvailable;
  if (!hasLiveSignals) return [];
  return surfaces.communityTrending.slice(0, 100).map((entry) => ({
    title: entry.title,
    link: `/entry/${entry.category}/${entry.slug}`,
    guid: `trending:${entry.category}/${entry.slug}`,
    pubDate: entry.dateAdded || new Date(0).toISOString(),
    description: entry.description,
    category: entry.category,
  }));
}

/* --------- Health metadata --------- */

export interface FeedHealth {
  id: string;
  title: string;
  url: string;
  itemCount: number;
  latestItemAt: string | null;
  lastBuilt: string;
  etag: string;
  isCurrent: boolean;
}

async function healthFor(
  id: string,
  title: string,
  url: string,
  items: FeedItem[],
  body: string,
): Promise<FeedHealth> {
  const latest = items.length > 0 ? latestPubDate(items) : null;
  return {
    id,
    title,
    url,
    itemCount: items.length,
    latestItemAt: latest,
    lastBuilt: latest ?? new Date(0).toISOString(),
    etag: await etagFor(body),
    isCurrent: isFeedCurrent(latest, Date.now()),
  };
}

/** Build the full health report for every feed the site exposes. */
export async function allFeedHealth(base: string): Promise<FeedHealth[]> {
  const out: FeedHealth[] = [];

  const site = siteWideItems();
  out.push(
    await healthFor(
      "feed",
      "Everything (RSS)",
      "/feed.xml",
      site,
      buildRss({
        title: SITE_NAME,
        description: SITE_TAGLINE,
        link: base,
        selfLink: `${base}/feed.xml`,
        items: site,
      }),
    ),
  );
  out.push(
    await healthFor(
      "atom",
      "Everything (Atom)",
      "/atom.xml",
      site,
      buildAtom({
        title: SITE_NAME,
        description: SITE_TAGLINE,
        link: base,
        selfLink: `${base}/atom.xml`,
        items: site,
      }),
    ),
  );

  for (const c of CATEGORIES) {
    const items = categoryItems(c.id);
    out.push(
      await healthFor(
        `category:${c.id}`,
        c.label,
        `/feeds/${c.id}.xml`,
        items,
        buildRss({
          title: c.label,
          description: c.blurb,
          link: base,
          selfLink: `${base}/feeds/${c.id}.xml`,
          items,
        }),
      ),
    );
  }

  for (const stream of ["release", "policy", "security"] as const) {
    const items = changelogStreamItems(stream);
    out.push(
      await healthFor(
        `changelog:${stream}`,
        `${stream[0].toUpperCase()}${stream.slice(1)} notes`,
        `/feeds/changelog-${stream}.xml`,
        items,
        buildRss({
          title: stream,
          description: stream,
          link: base,
          selfLink: `${base}/feeds/changelog-${stream}.xml`,
          items,
        }),
      ),
    );
  }

  const trending = await trendingItems();
  out.push(
    await healthFor(
      "trending",
      "Trending",
      "/feeds/trending.xml",
      trending,
      buildRss({
        title: `${SITE_NAME} trending`,
        description: "Registry entries with current public community, vote, and intent signals.",
        link: base,
        selfLink: `${base}/feeds/trending.xml`,
        items: trending,
      }),
    ),
  );

  return out;
}
