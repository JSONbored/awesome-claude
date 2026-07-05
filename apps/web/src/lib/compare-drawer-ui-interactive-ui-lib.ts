import type { Entry } from "@/types/registry";
import { compareDrawerUiState, type CompareDrawerUiState } from "@/lib/compare-drawer-ui-lib";

export type { CompareDrawerUiState };
export type CompareDrawerUiInteractiveUiState = CompareDrawerUiState;

export function compareDrawerUiInteractiveUiState(
  items: Entry[],
): CompareDrawerUiInteractiveUiState {
  return compareDrawerUiState(items);
}
