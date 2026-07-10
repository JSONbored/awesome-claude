import type { Entry } from "@/types/registry";
import type { CompareTableActionCell } from "@/lib/compare-table-actions-ui-lib";
import { compareTableActionsInteractiveUiState } from "@/lib/compare-table-actions-interactive-ui-lib";
import { compareTableUiInteractivePresentationState } from "@/lib/compare-table-ui-interactive-ui-lib";

export type CompareTableInteractiveUiState = {
  divergingDecisionLabels: Set<string>;
  renderNextActions: boolean;
  actionRowDiverges: boolean;
  actionCells: CompareTableActionCell[];
};

export function compareTableInteractiveDivergingDecisionLabels(
  entries: Entry[],
  showNextActions: boolean,
): Set<string> {
  return compareTableUiInteractivePresentationState(entries, showNextActions)
    .divergingDecisionLabels;
}

export function compareTableInteractiveRenderNextActions(
  entries: Entry[],
  showNextActions: boolean,
): boolean {
  return compareTableActionsInteractiveUiState(entries, showNextActions).renderNextActions;
}

export function compareTableInteractiveActionRowDiverges(
  entries: Entry[],
  showNextActions: boolean,
): boolean {
  return compareTableActionsInteractiveUiState(entries, showNextActions).actionRowDiverges;
}

export function compareTableInteractiveActionCells(
  entries: Entry[],
  showNextActions: boolean,
): CompareTableActionCell[] {
  return compareTableActionsInteractiveUiState(entries, showNextActions).actionCells;
}

export function compareTableInteractiveUiState(
  entries: Entry[],
  showNextActions: boolean,
): CompareTableInteractiveUiState {
  return {
    divergingDecisionLabels: compareTableInteractiveDivergingDecisionLabels(
      entries,
      showNextActions,
    ),
    renderNextActions: compareTableInteractiveRenderNextActions(entries, showNextActions),
    actionRowDiverges: compareTableInteractiveActionRowDiverges(entries, showNextActions),
    actionCells: compareTableActionsInteractiveUiState(entries, showNextActions).actionCells,
  };
}
