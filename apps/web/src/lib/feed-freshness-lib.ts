// Pure feed-freshness check, split out of feeds.ts so the age threshold can be
// unit-tested with an injected `now` instead of the wall clock.

const DEFAULT_FRESHNESS_DAYS = 30;

/**
 * Whether a feed's latest item is still "current": its `latest` timestamp is
 * within `freshnessDays` of `now` (epoch ms). A missing/empty `latest` is not
 * current.
 */
export function isFeedCurrent(
  latest: string | null,
  now: number,
  freshnessDays = DEFAULT_FRESHNESS_DAYS,
): boolean {
  if (!latest) return false;
  const ageMs = now - new Date(latest).getTime();
  return ageMs <= freshnessDays * 24 * 60 * 60 * 1000;
}
