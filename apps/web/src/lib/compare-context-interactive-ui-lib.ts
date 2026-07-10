import type { Entry } from "@/types/registry";
import { compareContextSelectionParam, compareContextShareUrl } from "@/lib/compare-context-ui-lib";

export type CompareContextInteractiveUiState = {
  selectionParam: string;
  shareUrl: string;
};

export function compareContextInteractiveSelectionParam(items: Entry[]): string {
  return compareContextSelectionParam(items);
}

export function compareContextInteractiveShareUrl(items: Entry[]): string {
  return compareContextShareUrl(items);
}

export function compareContextInteractiveUiState(items: Entry[]): CompareContextInteractiveUiState {
  return {
    selectionParam: compareContextInteractiveSelectionParam(items),
    shareUrl: compareContextInteractiveShareUrl(items),
  };
}

/** True when hydrated selection differs from the live compare tray selection. */
export function compareContextSelectionChanged(next: Entry[], current: Entry[]): boolean {
  return (
    compareContextInteractiveSelectionParam(next) !==
    compareContextInteractiveSelectionParam(current)
  );
}
