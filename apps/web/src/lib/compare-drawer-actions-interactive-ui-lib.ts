import type { Entry } from "@/types/registry";
import {
  compareDrawerActionCells,
  type CompareDrawerActionCell,
} from "@/lib/compare-drawer-actions-ui-lib";
import { compareDrawerPresentationActionRowDiverges } from "@/lib/compare-drawer-presentation-ui-lib";

export type CompareDrawerActionsInteractiveUiState = {
  actionRowDiverges: boolean;
  actionCells: CompareDrawerActionCell[];
};

export function compareDrawerActionsInteractiveActionRowDiverges(entries: Entry[]): boolean {
  return compareDrawerPresentationActionRowDiverges(entries);
}

export function compareDrawerActionsInteractiveActionCells(
  entries: Entry[],
): CompareDrawerActionCell[] {
  return compareDrawerActionCells(entries);
}

export function compareDrawerActionsInteractiveUiState(
  entries: Entry[],
): CompareDrawerActionsInteractiveUiState {
  return {
    actionRowDiverges: compareDrawerActionsInteractiveActionRowDiverges(entries),
    actionCells: compareDrawerActionsInteractiveActionCells(entries),
  };
}

export function compareDrawerActionsForEntry(entry: Entry, actionCells: CompareDrawerActionCell[]) {
  const entryKey = `${entry.category}:${entry.slug}`;
  return actionCells.find((cell) => cell.entryKey === entryKey)?.actions ?? [];
}
