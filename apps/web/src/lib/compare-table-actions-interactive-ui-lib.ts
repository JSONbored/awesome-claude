import type { Entry } from "@/types/registry";
import {
  compareTableActionCells,
  compareTableActionsDiverge,
  shouldRenderCompareTableActions,
  type CompareTableActionCell,
} from "@/lib/compare-table-actions-ui-lib";

export type CompareTableActionsInteractiveUiState = {
  renderNextActions: boolean;
  actionRowDiverges: boolean;
  actionCells: CompareTableActionCell[];
};

export function compareTableActionsInteractiveUiState(
  entries: Entry[],
  showNextActions: boolean,
): CompareTableActionsInteractiveUiState {
  const renderNextActions = shouldRenderCompareTableActions(entries, showNextActions);
  return {
    renderNextActions,
    actionRowDiverges: renderNextActions && compareTableActionsDiverge(entries),
    actionCells: compareTableActionCells(entries),
  };
}

export function compareTableActionsForEntry(entry: Entry, actionCells: CompareTableActionCell[]) {
  const entryKey = `${entry.category}:${entry.slug}`;
  return actionCells.find((cell) => cell.entryKey === entryKey)?.actions ?? [];
}
