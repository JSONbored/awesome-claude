import type { Entry } from "@/types/registry";
import { compareDrawerEmptyStateHint, compareDrawerShareUrl } from "@/lib/compare-drawer-ui-lib";

export type CompareDrawerEmptyInteractiveUiState = {
  emptyHint: string;
  shareUrl: string;
};

export function compareDrawerEmptyInteractiveEmptyHint(): string {
  return compareDrawerEmptyStateHint();
}

export function compareDrawerEmptyInteractiveShareUrl(items: Entry[]): string {
  return compareDrawerShareUrl(items);
}

export function compareDrawerEmptyInteractiveUiState(
  items: Entry[],
): CompareDrawerEmptyInteractiveUiState {
  return {
    emptyHint: compareDrawerEmptyInteractiveEmptyHint(),
    shareUrl: compareDrawerEmptyInteractiveShareUrl(items),
  };
}
