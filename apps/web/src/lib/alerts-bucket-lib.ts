// Pure recency-bucketing for the alerts dropdown, split out of
// alerts-dropdown.tsx so the date boundaries can be unit-tested with an
// injected `now` (no reliance on the real clock).

export type AlertBucket = "Today" | "This week" | "Earlier";

const DAY_MS = 86_400_000;

/**
 * Group an alert by its ISO `date` into a recency bucket relative to `now`
 * (epoch ms): within the last day → "Today", within the last 7 days →
 * "This week", otherwise "Earlier". Unparseable dates fall into "Earlier".
 */
export function alertBucket(dateIso: string, now: number): AlertBucket {
  const t = Date.parse(dateIso);
  if (t > now - DAY_MS) return "Today";
  if (t > now - 7 * DAY_MS) return "This week";
  return "Earlier";
}
