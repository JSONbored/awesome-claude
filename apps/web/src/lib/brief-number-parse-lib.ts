// Pure parser for the brief route's numeric `:number` param, split out of the
// route so the strict digits-only check can be unit-tested.

/**
 * Parse a strictly-numeric string to a number, or `NaN` for anything that is
 * not all ASCII digits (empty, signs, decimals, or trailing characters).
 */
export function parseBriefNumber(value: string): number {
  return /^\d+$/.test(value) ? Number(value) : NaN;
}
