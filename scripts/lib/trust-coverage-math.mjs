// Pure presence/aggregation helpers behind scripts/report-trust-coverage.mjs:
// testing whether a field carries a value, computing rounded/exact percentages,
// and counting list members matching a predicate. Split out so the arithmetic
// can be unit-tested without the report's registry reads.

/** True when value is a non-empty array, or a non-blank scalar. */
export const has = (value) =>
  Array.isArray(value)
    ? value.length > 0
    : value !== undefined && value !== null && String(value).trim() !== "";

/** count/total as a whole-number percentage; 0 when total is 0. */
export const pct = (count, total) =>
  total === 0 ? 0 : Math.round((count / total) * 100);

/** count/total as an exact (unrounded) percentage; 0 when total is 0. */
export const exactPct = (count, total) =>
  total === 0 ? 0 : (count / total) * 100;

/** Number of list members satisfying the predicate. */
export const countWhere = (list, fn) => list.filter(fn).length;
