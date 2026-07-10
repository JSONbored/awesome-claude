import type { Entry } from "@/types/registry";
import { compareTablePresentationDivergingDecisionLabels } from "@/lib/compare-table-ui-lib";

export type CompareTableSignalsInteractiveUiState = {
  divergingDecisionLabels: Set<string>;
};

export function compareTableSignalsInteractiveDivergingDecisionLabels(
  entries: Entry[],
): Set<string> {
  return compareTablePresentationDivergingDecisionLabels(entries);
}

export function compareTableSignalsInteractiveUiState(
  entries: Entry[],
): CompareTableSignalsInteractiveUiState {
  return {
    divergingDecisionLabels: compareTableSignalsInteractiveDivergingDecisionLabels(entries),
  };
}
