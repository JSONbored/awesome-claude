// Pure helpers for the RSS/Atom feed routes: absolutize item links against the
// request origin and derive the feed's last-built timestamp. Split out so the
// link handling and empty-feed fallback can be unit-tested without the route.

/** Prefix each relative item link with the base origin; absolute links pass through. */
export function absolutizeFeedLinks<T extends { link: string }>(items: T[], base: string): T[] {
  return items.map((item) =>
    item.link.startsWith("http") ? item : { ...item, link: `${base}${item.link}` },
  );
}

/** The newest item's pubDate, or the epoch ISO string for an empty feed. */
export function feedLastBuilt(items: Array<{ pubDate: string }>): string {
  if (items.length === 0) return new Date(0).toISOString();
  return items.reduce((acc, item) => (item.pubDate > acc ? item.pubDate : acc), items[0].pubDate);
}
