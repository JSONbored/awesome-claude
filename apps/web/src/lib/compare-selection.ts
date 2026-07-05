/**
 * Compare-selection surface.
 *
 * The pure selection helpers live in `compare-selection-lib.ts`. This module
 * re-exports that surface so existing `@/lib/compare-selection` imports stay
 * unchanged.
 */
export {
  hasCompareItem,
  toggleCompareItem,
  serializeCompareItems,
  resolveCompareParam,
} from "@/lib/compare-selection-lib";
