// Pure label for a scenario's score delta from the top, split out of the
// compare-scenario ranking panel so it can be unit-tested without React.

/**
 * Label for how far an item's score sits below the top: "Top score" at 0, a
 * `+N` string for a positive delta, and the raw (negative) number otherwise.
 */
export function scoreDeltaText(delta: number): string {
  if (delta === 0) return "Top score";
  if (delta > 0) return `+${delta}`;
  return `${delta}`;
}
