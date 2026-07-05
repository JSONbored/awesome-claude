import type { Entry } from "@/types/registry";
import { compareTableDivergingDecisionLabels } from "@/lib/compare-table-signals-ui-lib";

export type CompareTableSignalsInteractiveUiState = {
  divergingDecisionLabels: Set<string>;
};

export function compareTableSignalsInteractiveUiState(
  entries: Entry[],
): CompareTableSignalsInteractiveUiState {
  return {
    divergingDecisionLabels: new Set(compareTableDivergingDecisionLabels(entries)),
  };
}
