/**
 * Comparison tray UI surface.
 *
 * Pure helpers live in `comparison-tray-ui-lib.ts`. This module re-exports
 * that surface so existing `@/lib/comparison-tray-ui` imports stay stable.
 */
export type {
  ComparisonTrayChipSignals,
  ComparisonTrayUiState,
} from "@/lib/comparison-tray-ui-lib";
export {
  COMPARISON_TRAY_MAX_ITEMS,
  comparisonTrayChipSignals,
  comparisonTrayClearAriaLabel,
  comparisonTrayHintMessages,
  comparisonTraySecondaryHint,
  comparisonTrayTrustDivergenceBadgeLabel,
  comparisonTrayUiState,
} from "@/lib/comparison-tray-ui-lib";
