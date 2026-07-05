import type { Entry } from "@/types/registry";
import { compareDrawerDivergingDecisionLabels } from "@/lib/compare-drawer-signals-ui-lib";

export type CompareDrawerSignalsInteractiveUiState = {
  divergingDecisionLabels: Set<string>;
};

export function compareDrawerSignalsInteractiveUiState(
  entries: Entry[],
): CompareDrawerSignalsInteractiveUiState {
  return {
    divergingDecisionLabels: new Set(compareDrawerDivergingDecisionLabels(entries)),
  };
}
