import type { Entry } from "@/types/registry";
import {
  comparePageActionCells,
  comparePageActionsDiverge,
  type ComparePageActionCell,
} from "@/lib/compare-page-actions-ui-lib";

export type ComparePageActionsInteractiveUiState = {
  actionRowDiverges: boolean;
  actionCells: ComparePageActionCell[];
};

export function comparePageActionsInteractiveUiState(
  entries: Entry[],
): ComparePageActionsInteractiveUiState {
  return {
    actionRowDiverges: comparePageActionsDiverge(entries),
    actionCells: comparePageActionCells(entries),
  };
}

export function comparePageActionsForEntry(entry: Entry, actionCells: ComparePageActionCell[]) {
  const entryKey = `${entry.category}:${entry.slug}`;
  return actionCells.find((cell) => cell.entryKey === entryKey)?.actions ?? [];
}
