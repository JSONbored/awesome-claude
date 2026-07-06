import type { Entry } from "@/types/registry";
import { shouldShowBestCompareSection } from "@/lib/compare-best-summary";
import { compareBestUiState, type CompareBestUiState } from "@/lib/compare-best-ui-lib";

export type CompareBestInteractiveUiState = CompareBestUiState;

export function compareBestInteractiveUiState(entries: Entry[]): CompareBestInteractiveUiState {
  const ui = compareBestUiState(entries);
  return {
    ...ui,
    showCompareSection: compareBestInteractiveShowCompareSection(entries),
  };
}

export function compareBestInteractiveShowCompareSection(entries: Entry[]): boolean {
  return shouldShowBestCompareSection(entries);
}
