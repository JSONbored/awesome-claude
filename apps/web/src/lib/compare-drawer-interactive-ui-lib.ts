import type { Entry } from "@/types/registry";
import {
  compareDrawerEmptyStateHint,
  compareDrawerShareUrl,
  compareDrawerUiState,
  type CompareDrawerUiState,
} from "@/lib/compare-drawer-ui-lib";

export type CompareDrawerInteractiveUiState = {
  drawerUi: CompareDrawerUiState;
  emptyHint: string;
  shareUrl: string;
};

export function compareDrawerInteractiveUiState(items: Entry[]): CompareDrawerInteractiveUiState {
  return {
    drawerUi: compareDrawerUiState(items),
    emptyHint: compareDrawerEmptyStateHint(),
    shareUrl: compareDrawerShareUrl(items),
  };
}
