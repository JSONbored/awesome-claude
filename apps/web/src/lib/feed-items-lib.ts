// Pure helpers for the RSS/Atom feed routes: absolutize item links against the
// request origin and derive the feed's last-built timestamp. Split out so the
// link handling and empty-feed fallback can be unit-tested without the route.

import { EMPTY_FEED_LAST_BUILT } from "@/lib/feeds-lib";

/** Prefix each relative item link with the base origin; absolute links pass through. */
export function absolutizeFeedLinks<T extends { link: string }>(items: T[], base: string): T[] {
  return items.map((item) =>
    item.link.startsWith("http") ? item : { ...item, link: `${base}${item.link}` },
  );
}

/** The newest item's pubDate, or the shared empty-feed fallback (so the health
 *  `lastBuilt` agrees with the RSS/Atom body's `lastBuildDate`) for an empty feed. */
export function feedLastBuilt(items: Array<{ pubDate: string }>): string {
  if (items.length === 0) return EMPTY_FEED_LAST_BUILT;
  return items.reduce((acc, item) => (item.pubDate > acc ? item.pubDate : acc), items[0].pubDate);
}
