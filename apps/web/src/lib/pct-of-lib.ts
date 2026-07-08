// Pure percentage helper, split out of the state-of-claude-tooling route so the
// divide-by-zero guard can be unit-tested.

/** `n` as a whole-number percentage of `total`, or 0 when `total` is 0. */
export function pctOf(n: number, total: number): number {
  return total ? Math.round((n / total) * 100) : 0;
}
