/**
 * Pure ecosystem-pulse windowing helper.
 *
 * `filterRecentPulseEntries` keeps only the dated entries that fall within the
 * trailing 14-day UTC window (inclusive of both the cutoff day and today),
 * comparing on UTC calendar-day boundaries so the result is stable regardless of
 * the caller's local timezone. Everything here is deterministic given an
 * injectable `now`; the public surface (`ecosystem-pulse-window.ts` /
 * `@/lib/ecosystem-pulse-window`) re-exports the helper below.
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
