import type { Entry } from "@/types/registry";
import type { CompareTableActionCell } from "@/lib/compare-table-actions-ui-lib";
import { compareTableActionsInteractiveUiState } from "@/lib/compare-table-actions-interactive-ui-lib";
import { compareTableSignalsInteractiveUiState } from "@/lib/compare-table-signals-interactive-ui-lib";

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
  const signals = compareTableSignalsInteractiveUiState(entries);
  const actions = compareTableActionsInteractiveUiState(entries, showNextActions);
  return {
    divergingDecisionLabels: signals.divergingDecisionLabels,
    renderNextActions: actions.renderNextActions,
    actionRowDiverges: actions.actionRowDiverges,
    actionCells: actions.actionCells,
  };
}
