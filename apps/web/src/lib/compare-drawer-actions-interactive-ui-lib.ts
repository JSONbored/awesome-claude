import type { Entry } from "@/types/registry";
import {
  compareDrawerActionCells,
  compareDrawerActionsDiverge,
  type CompareDrawerActionCell,
} from "@/lib/compare-drawer-actions-ui-lib";

export type CompareDrawerActionsInteractiveUiState = {
  actionRowDiverges: boolean;
  actionCells: CompareDrawerActionCell[];
};

export function compareDrawerActionsInteractiveUiState(
  entries: Entry[],
): CompareDrawerActionsInteractiveUiState {
  return {
    actionRowDiverges: compareDrawerActionsDiverge(entries),
    actionCells: compareDrawerActionCells(entries),
  };
}

export function compareDrawerActionsForEntry(entry: Entry, actionCells: CompareDrawerActionCell[]) {
  const entryKey = `${entry.category}:${entry.slug}`;
  return actionCells.find((cell) => cell.entryKey === entryKey)?.actions ?? [];
}
