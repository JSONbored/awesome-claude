import type { Entry } from "@/types/registry";
import { compareDrawerEmptyStateHint, compareDrawerShareUrl } from "@/lib/compare-drawer-ui-lib";
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
  return {
    drawerUi: compareDrawerUiInteractiveUiState(items),
    emptyHint: compareDrawerEmptyStateHint(),
    shareUrl: compareDrawerShareUrl(items),
  };
}
