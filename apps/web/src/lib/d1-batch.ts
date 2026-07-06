/**
 * Shared D1 batching primitives for dynamic-state count queries.
 *
 * The implementation lives in `d1-batch-lib.ts`; this module is a thin
 * re-export so existing `@/lib/d1-batch` imports stay unchanged.
 */
export {
  chunk,
  D1_SAFE_VARIABLE_BATCH_SIZE,
  inPlaceholders,
  targetPairConditions,
} from "@/lib/d1-batch-lib";
