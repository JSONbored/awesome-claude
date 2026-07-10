import type { Entry } from "@/types/registry";
import {
  compareDrawerPresentationActionRowDiverges,
  compareDrawerPresentationDivergingDecisionLabels,
} from "@/lib/compare-drawer-presentation-ui-lib";
import { compareDrawerUiState, type CompareDrawerUiState } from "@/lib/compare-drawer-ui-lib";

export type { CompareDrawerUiState };
export type CompareDrawerUiInteractiveUiState = CompareDrawerUiState & {
  divergingDecisionLabels: Set<string>;
};

export function compareDrawerUiInteractiveDivergingDecisionLabels(items: Entry[]): Set<string> {
  return compareDrawerPresentationDivergingDecisionLabels(items);
}

export function compareDrawerUiInteractiveActionRowDiverges(items: Entry[]): boolean {
  return compareDrawerPresentationActionRowDiverges(items);
}

export function compareDrawerUiInteractiveUiState(
  items: Entry[],
): CompareDrawerUiInteractiveUiState {
  const drawerUi = compareDrawerUiState(items);
  return {
    ...drawerUi,
    actionRowDiverges: compareDrawerUiInteractiveActionRowDiverges(items),
    divergingDecisionLabels: compareDrawerUiInteractiveDivergingDecisionLabels(items),
  };
}
