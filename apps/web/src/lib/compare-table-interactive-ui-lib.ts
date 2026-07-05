import type { Entry } from "@/types/registry";
import type { CompareTableActionCell } from "@/lib/compare-table-actions-ui-lib";
import { compareTableActionsInteractiveUiState } from "@/lib/compare-table-actions-interactive-ui-lib";
import { compareTableUiInteractiveUiState } from "@/lib/compare-table-ui-interactive-ui-lib";

export type CompareTableInteractiveUiState = {
  divergingDecisionLabels: Set<string>;
  renderNextActions: boolean;
  actionRowDiverges: boolean;
  actionCells: CompareTableActionCell[];
};

export function compareTableInteractiveUiState(
  entries: Entry[],
  showNextActions: boolean,
): CompareTableInteractiveUiState {
  const tableUi = compareTableUiInteractiveUiState(entries, showNextActions);
  const actions = compareTableActionsInteractiveUiState(entries, showNextActions);
  return {
    ...tableUi,
    actionCells: actions.actionCells,
  };
}
