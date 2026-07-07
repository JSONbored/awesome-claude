/**
 * Shared D1 batching primitives for dynamic-state count queries.
 *
 * The pure helpers live in `d1-batch-lib.ts` (`@/lib/d1-batch-lib`). This module
 * re-exports that surface so existing `@/lib/d1-batch` importers stay unchanged.
 */
export {
  D1_SAFE_VARIABLE_BATCH_SIZE,
  chunk,
  inPlaceholders,
  targetPairConditions,
} from "@/lib/d1-batch-lib";
