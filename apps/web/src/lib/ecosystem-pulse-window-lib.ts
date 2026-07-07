/**
 * Pure "ecosystem pulse" recency window helper.
 *
 * Filters entries to the trailing 14-day window (by UTC day), independent of
 * time-of-day. It has no module state and no side effects — the reference
 * "now" is injectable — so it is unit-testable in isolation. The
 * `ecosystem-pulse-window.ts` module (`@/lib/ecosystem-pulse-window`)
 * re-exports this surface so existing importers stay unchanged.
 */

const DAY_MS = 24 * 60 * 60 * 1000;
const PULSE_WINDOW_DAYS = 14;

function utcDayTimestamp(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value);
  const time = date.getTime();
  if (!Number.isFinite(time)) return undefined;
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

export function filterRecentPulseEntries<T extends { date: string }>(
  entries: readonly T[],
  now: Date = new Date(),
) {
  const today = utcDayTimestamp(now);
  if (today === undefined) return [];

  const cutoff = today - (PULSE_WINDOW_DAYS - 1) * DAY_MS;
  return entries.filter((entry) => {
    const entryDay = utcDayTimestamp(entry.date);
    return entryDay !== undefined && entryDay >= cutoff && entryDay <= today;
  });
}
