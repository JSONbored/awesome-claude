import type { Entry } from "@/types/registry";
import { compareBestUiState, type CompareBestUiState } from "@/lib/compare-best-ui-lib";

export type CompareBestInteractiveUiState = CompareBestUiState;

export function compareBestInteractiveUiState(entries: Entry[]): CompareBestInteractiveUiState {
  return compareBestUiState(entries);
}
