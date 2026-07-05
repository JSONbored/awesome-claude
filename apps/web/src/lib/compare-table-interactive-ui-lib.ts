import type { Entry } from "@/types/registry";
import {
  compareTableUiInteractiveUiState,
  type CompareTablePresentationState,
} from "@/lib/compare-table-ui-interactive-ui-lib";

export type CompareTableInteractiveUiState = CompareTablePresentationState;

export function compareTableInteractiveUiState(
  entries: Entry[],
  showNextActions: boolean,
): CompareTableInteractiveUiState {
  return compareTableUiInteractiveUiState(entries, showNextActions);
}
