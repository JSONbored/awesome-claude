/**
 * Pure D1 batching primitives for dynamic-state count queries.
 *
 * Votes, intent events, and community signals all read counts in small D1
 * batches to stay under the bound-variable limit and keep dynamic-state queries
 * reliable. The chunking loop and placeholder construction were duplicated in
 * each helper, which risked drift when one was updated and the others were not.
 * These helpers centralize the shared parts without changing query semantics or
 * response shapes.
 *
 * They have no module state and no side effects, so they are unit-testable in
 * isolation. `d1-batch.ts` (`@/lib/d1-batch`) re-exports this surface so
 * existing importers stay unchanged.
 */

/** Conservative batch size that keeps each prepared query well under D1's
 * bound-variable ceiling, even for the two-variable target-pair queries. */
export const D1_SAFE_VARIABLE_BATCH_SIZE = 25;

/**
 * Split `items` into contiguous chunks of at most `size` entries. An empty
 * input yields an empty array; callers should still guard the no-work case
 * before touching the database.
 */
export function chunk<T>(items: readonly T[], size: number = D1_SAFE_VARIABLE_BATCH_SIZE): T[][] {
  if (size <= 0) throw new RangeError("chunk size must be positive");
  const batches: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    batches.push(items.slice(index, index + size));
  }
  return batches;
}

/** Build a `?, ?, ...` placeholder list for a single-column `IN (...)` clause. */
export function inPlaceholders(count: number): string {
  return Array.from({ length: count }, () => "?").join(", ");
}

/**
 * Build the `WHERE` fragment for matching a batch of (kind, key) pairs, e.g.
 * `(target_kind = ? AND target_key = ?) OR (...)`. Returns an empty string for
 * an empty batch so callers can guard before binding values.
 */
export function targetPairConditions(count: number, kindColumn: string, keyColumn: string): string {
  return Array.from({ length: count }, () => `(${kindColumn} = ? AND ${keyColumn} = ?)`).join(
    " OR ",
  );
}
