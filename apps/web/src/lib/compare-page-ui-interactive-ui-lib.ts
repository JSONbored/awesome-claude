import type { Entry } from "@/types/registry";
import { comparePagePresentationState } from "@/lib/compare-page-presentation-ui-lib";
import { comparePageUiState, type ComparePageUiState } from "@/lib/compare-page-ui-lib";

export type { ComparePageUiState };
export type ComparePageUiInteractiveUiState = ComparePageUiState;

export function comparePageUiInteractiveUiState(items: Entry[]): ComparePageUiInteractiveUiState {
  const pageUi = comparePageUiState(items);
  const presentation = comparePagePresentationState(items);
  return {
    ...pageUi,
    actionRowDiverges: presentation.actionRowDiverges,
  };
}
