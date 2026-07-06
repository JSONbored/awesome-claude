import type { Entry } from "@/types/registry";
import { compareDrawerPresentationState } from "@/lib/compare-drawer-presentation-ui-lib";
import { compareDrawerUiState, type CompareDrawerUiState } from "@/lib/compare-drawer-ui-lib";

export type { CompareDrawerUiState };
export type CompareDrawerUiInteractiveUiState = CompareDrawerUiState & {
  divergingDecisionLabels: Set<string>;
};

export function compareDrawerUiInteractiveUiState(
  items: Entry[],
): CompareDrawerUiInteractiveUiState {
  const drawerUi = compareDrawerUiState(items);
  const presentation = compareDrawerPresentationState(items);
  return {
    ...drawerUi,
    actionRowDiverges: presentation.actionRowDiverges,
    divergingDecisionLabels: presentation.divergingDecisionLabels,
  };
}
