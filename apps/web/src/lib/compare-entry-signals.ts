/**
 * Compare entry signals surface.
 *
 * Pure compare signal helpers live in `compare-entry-signals-lib.ts`. This
 * module re-exports that surface so existing `@/lib/compare-entry-signals`
 * imports stay unchanged.
 */
export type { CompareSignalTone, CompareSignalValue } from "@/lib/compare-entry-signals-lib";
export {
  COMPARE_DECISION_ROWS,
  compareSignalToneClass,
  compareSignalsDiverge,
  decisionRowDiverges,
  packageTrustCompareSignal,
  resolveCompareSignal,
  reviewCompareSignal,
  sourceProvenanceCompareSignal,
  submitterCompareSignal,
} from "@/lib/compare-entry-signals-lib";
