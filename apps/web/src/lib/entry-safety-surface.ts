/**
 * Entry safety & privacy surface exports.
 */

export type {
  EntrySafetySurfaceState,
  SafetyKindSummary,
  SafetyRiskKind,
  SafetySurfaceItem,
  SafetySurfaceSource,
} from "@/lib/entry-safety-surface-lib";
export {
  SAFETY_RISK_KIND_LABEL,
  classifySafetyNote,
  entrySafetySurfaceState,
} from "@/lib/entry-safety-surface-lib";
