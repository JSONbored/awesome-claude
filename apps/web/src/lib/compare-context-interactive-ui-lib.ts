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
