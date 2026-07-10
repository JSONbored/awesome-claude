import type { Entry } from "@/types/registry";
import {
  comparePagePresentationState,
  type ComparePagePresentationState,
} from "@/lib/compare-page-presentation-ui-lib";

export type { ComparePagePresentationState };
export type ComparePagePresentationUiInteractiveUiState = ComparePagePresentationState;

export function comparePagePresentationUiInteractivePresentationState(
  items: Entry[],
): ComparePagePresentationUiInteractiveUiState {
  return comparePagePresentationState(items);
}

export function comparePagePresentationUiInteractiveUiState(
  items: Entry[],
): ComparePagePresentationUiInteractiveUiState {
  return comparePagePresentationUiInteractivePresentationState(items);
}
