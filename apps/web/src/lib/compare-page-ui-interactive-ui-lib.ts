import type { Entry } from "@/types/registry";
import { comparePageUiState, type ComparePageUiState } from "@/lib/compare-page-ui-lib";

export type { ComparePageUiState };
export type ComparePageUiInteractiveUiState = ComparePageUiState;

export function comparePageUiInteractiveUiState(items: Entry[]): ComparePageUiInteractiveUiState {
  return comparePageUiState(items);
}
