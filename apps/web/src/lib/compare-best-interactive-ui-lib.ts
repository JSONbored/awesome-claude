import type { Entry } from "@/types/registry";
import {
  compareBestShowCompareSection,
  compareBestUiState,
  type CompareBestUiState,
} from "@/lib/compare-best-ui-lib";

export type CompareBestInteractiveUiState = CompareBestUiState;

export function compareBestInteractiveShowCompareSection(entries: Entry[]): boolean {
  return compareBestShowCompareSection(entries);
}

export function compareBestInteractiveUiState(entries: Entry[]): CompareBestInteractiveUiState {
  const ui = compareBestUiState(entries);
  return {
    ...ui,
    showCompareSection: compareBestInteractiveShowCompareSection(entries),
  };
}
