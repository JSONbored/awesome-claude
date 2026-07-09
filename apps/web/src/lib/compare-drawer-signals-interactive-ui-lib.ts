import type { Entry } from "@/types/registry";
import { compareDrawerPresentationDivergingDecisionLabels } from "@/lib/compare-drawer-presentation-ui-lib";

export type CompareDrawerSignalsInteractiveUiState = {
  divergingDecisionLabels: Set<string>;
};

export function compareDrawerSignalsInteractiveDivergingDecisionLabels(
  entries: Entry[],
): Set<string> {
  return compareDrawerPresentationDivergingDecisionLabels(entries);
}

export function compareDrawerSignalsInteractiveUiState(
  entries: Entry[],
): CompareDrawerSignalsInteractiveUiState {
  return {
    divergingDecisionLabels: compareDrawerSignalsInteractiveDivergingDecisionLabels(entries),
  };
}
