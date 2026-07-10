import type { Entry } from "@/types/registry";
import {
  compareTablePresentationState,
  type CompareTablePresentationState,
} from "@/lib/compare-table-ui-lib";

export type { CompareTablePresentationState };
export type CompareTableUiInteractiveUiState = CompareTablePresentationState;

export function compareTableUiInteractivePresentationState(
  entries: Entry[],
  showNextActions: boolean,
): CompareTableUiInteractiveUiState {
  return compareTablePresentationState(entries, showNextActions);
}

export function compareTableUiInteractiveUiState(
  entries: Entry[],
  showNextActions: boolean,
): CompareTableUiInteractiveUiState {
  return compareTableUiInteractivePresentationState(entries, showNextActions);
}
