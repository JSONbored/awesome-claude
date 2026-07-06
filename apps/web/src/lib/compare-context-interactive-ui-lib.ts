import type { Entry } from "@/types/registry";
import { compareContextSelectionParam, compareContextShareUrl } from "@/lib/compare-context-ui-lib";

export type CompareContextInteractiveUiState = {
  selectionParam: string;
  shareUrl: string;
};

export function compareContextInteractiveUiState(items: Entry[]): CompareContextInteractiveUiState {
  return {
    selectionParam: compareContextSelectionParam(items),
    shareUrl: compareContextShareUrl(items),
  };
}

/** True when hydrated selection differs from the live compare tray selection. */
export function compareContextSelectionChanged(next: Entry[], current: Entry[]): boolean {
  return (
    compareContextInteractiveUiState(next).selectionParam !==
    compareContextInteractiveUiState(current).selectionParam
  );
}

export function compareContextInteractiveSelectionParam(items: Entry[]): string {
  return compareContextInteractiveUiState(items).selectionParam;
}

export function compareContextInteractiveShareUrl(items: Entry[]): string {
  return compareContextInteractiveUiState(items).shareUrl;
}
