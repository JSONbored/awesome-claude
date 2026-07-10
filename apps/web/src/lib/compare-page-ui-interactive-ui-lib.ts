import type { Entry } from "@/types/registry";
import { comparePagePresentationActionRowDiverges } from "@/lib/compare-page-presentation-ui-lib";
import { comparePageUiState, type ComparePageUiState } from "@/lib/compare-page-ui-lib";

export type { ComparePageUiState };
export type ComparePageUiInteractiveUiState = ComparePageUiState;

export function comparePageUiInteractiveActionRowDiverges(items: Entry[]): boolean {
  return comparePagePresentationActionRowDiverges(items);
}

export function comparePageUiInteractiveUiState(items: Entry[]): ComparePageUiInteractiveUiState {
  const pageUi = comparePageUiState(items);
  return {
    ...pageUi,
    actionRowDiverges: comparePageUiInteractiveActionRowDiverges(items),
  };
}
