import type { Entry } from "@/types/registry";
import { divergingDecisionRowLabels } from "@/lib/compare-table-decision-rows";
import {
  compareTableActionsDiverge,
  shouldRenderCompareTableActions,
} from "@/lib/compare-table-actions";

export type CompareTablePresentationState = {
  divergingDecisionLabels: Set<string>;
  renderNextActions: boolean;
  actionRowDiverges: boolean;
};

export function compareTablePresentationDivergingDecisionLabels(entries: Entry[]): Set<string> {
  return new Set(divergingDecisionRowLabels(entries));
}

export function compareTablePresentationRenderNextActions(
  entries: Entry[],
  showNextActions: boolean,
): boolean {
  return shouldRenderCompareTableActions(entries, showNextActions);
}

export function compareTablePresentationActionRowDiverges(
  entries: Entry[],
  showNextActions: boolean,
): boolean {
  return (
    compareTablePresentationRenderNextActions(entries, showNextActions) &&
    compareTableActionsDiverge(entries)
  );
}

export function compareTablePresentationState(
  entries: Entry[],
  showNextActions: boolean,
): CompareTablePresentationState {
  return {
    divergingDecisionLabels: compareTablePresentationDivergingDecisionLabels(entries),
    renderNextActions: compareTablePresentationRenderNextActions(entries, showNextActions),
    actionRowDiverges: compareTablePresentationActionRowDiverges(entries, showNextActions),
  };
}
