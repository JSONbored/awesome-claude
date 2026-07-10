import type { Entry } from "@/types/registry";
import {
  compareDrawerPresentationState,
  type CompareDrawerPresentationState,
} from "@/lib/compare-drawer-presentation-ui-lib";

export type { CompareDrawerPresentationState };
export type CompareDrawerPresentationUiInteractiveUiState = CompareDrawerPresentationState;

export function compareDrawerPresentationUiInteractivePresentationState(
  items: Entry[],
): CompareDrawerPresentationUiInteractiveUiState {
  return compareDrawerPresentationState(items);
}

export function compareDrawerPresentationUiInteractiveUiState(
  items: Entry[],
): CompareDrawerPresentationUiInteractiveUiState {
  return compareDrawerPresentationUiInteractivePresentationState(items);
}
