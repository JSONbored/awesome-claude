import type { Entry } from "@/types/registry";
import { compareDrawerEmptyStateHint, compareDrawerShareUrl } from "@/lib/compare-drawer-ui-lib";

export type CompareDrawerEmptyInteractiveUiState = {
  emptyHint: string;
  shareUrl: string;
};

export function compareDrawerEmptyInteractiveUiState(
  items: Entry[],
): CompareDrawerEmptyInteractiveUiState {
  return {
    emptyHint: compareDrawerEmptyStateHint(),
    shareUrl: compareDrawerShareUrl(items),
  };
}
