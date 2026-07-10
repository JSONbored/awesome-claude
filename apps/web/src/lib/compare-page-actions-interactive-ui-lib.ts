import type { Entry } from "@/types/registry";
import {
  comparePageActionCells,
  type ComparePageActionCell,
} from "@/lib/compare-page-actions-ui-lib";
import { comparePagePresentationActionRowDiverges } from "@/lib/compare-page-presentation-ui-lib";

export type ComparePageActionsInteractiveUiState = {
  actionRowDiverges: boolean;
  actionCells: ComparePageActionCell[];
};

export function comparePageActionsInteractiveActionRowDiverges(entries: Entry[]): boolean {
  return comparePagePresentationActionRowDiverges(entries);
}

export function comparePageActionsInteractiveActionCells(
  entries: Entry[],
): ComparePageActionCell[] {
  return comparePageActionCells(entries);
}

export function comparePageActionsInteractiveUiState(
  entries: Entry[],
): ComparePageActionsInteractiveUiState {
  return {
    actionRowDiverges: comparePageActionsInteractiveActionRowDiverges(entries),
    actionCells: comparePageActionsInteractiveActionCells(entries),
  };
}

export function comparePageActionsForEntry(entry: Entry, actionCells: ComparePageActionCell[]) {
  const entryKey = `${entry.category}:${entry.slug}`;
  return actionCells.find((cell) => cell.entryKey === entryKey)?.actions ?? [];
}
