import type { Entry } from "@/types/registry";
import { compareDrawerEmptyInteractiveUiState } from "@/lib/compare-drawer-empty-interactive-ui-lib";
import {
  compareDrawerUiInteractiveUiState,
  type CompareDrawerUiState,
} from "@/lib/compare-drawer-ui-interactive-ui-lib";

export type CompareDrawerInteractiveUiState = {
  drawerUi: CompareDrawerUiState;
  emptyHint: string;
  shareUrl: string;
};

export function compareDrawerInteractiveUiState(items: Entry[]): CompareDrawerInteractiveUiState {
  const emptyUi = compareDrawerEmptyInteractiveUiState(items);
  return {
    drawerUi: compareDrawerUiInteractiveUiState(items),
    emptyHint: emptyUi.emptyHint,
    shareUrl: emptyUi.shareUrl,
  };
}
