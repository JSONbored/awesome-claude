import type { Entry } from "@/types/registry";
import {
  compareTablePresentationState,
  type CompareTablePresentationState,
} from "@/lib/compare-table-ui-lib";

export type CompareTableInteractiveUiState = CompareTablePresentationState;

export function compareTableInteractiveUiState(
  entries: Entry[],
  showNextActions: boolean,
): CompareTableInteractiveUiState {
  return compareTablePresentationState(entries, showNextActions);
}
