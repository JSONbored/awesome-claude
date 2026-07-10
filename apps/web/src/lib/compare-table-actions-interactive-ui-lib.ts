import type { Entry } from "@/types/registry";
import {
  compareTableActionCells,
  type CompareTableActionCell,
} from "@/lib/compare-table-actions-ui-lib";
import {
  compareTablePresentationActionRowDiverges,
  compareTablePresentationRenderNextActions,
} from "@/lib/compare-table-ui-lib";

export type CompareTableActionsInteractiveUiState = {
  renderNextActions: boolean;
  actionRowDiverges: boolean;
  actionCells: CompareTableActionCell[];
};

export function compareTableActionsInteractiveRenderNextActions(
  entries: Entry[],
  showNextActions: boolean,
): boolean {
  return compareTablePresentationRenderNextActions(entries, showNextActions);
}

export function compareTableActionsInteractiveActionRowDiverges(
  entries: Entry[],
  showNextActions: boolean,
): boolean {
  return compareTablePresentationActionRowDiverges(entries, showNextActions);
}

export function compareTableActionsInteractiveActionCells(
  entries: Entry[],
): CompareTableActionCell[] {
  return compareTableActionCells(entries);
}

export function compareTableActionsInteractiveUiState(
  entries: Entry[],
  showNextActions: boolean,
): CompareTableActionsInteractiveUiState {
  return {
    renderNextActions: compareTableActionsInteractiveRenderNextActions(entries, showNextActions),
    actionRowDiverges: compareTableActionsInteractiveActionRowDiverges(entries, showNextActions),
    actionCells: compareTableActionsInteractiveActionCells(entries),
  };
}

export function compareTableActionsForEntry(entry: Entry, actionCells: CompareTableActionCell[]) {
  const entryKey = `${entry.category}:${entry.slug}`;
  return actionCells.find((cell) => cell.entryKey === entryKey)?.actions ?? [];
}
