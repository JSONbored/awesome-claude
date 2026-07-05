import type { Entry } from "@/types/registry";
import { compareDrawerActionsDiverge } from "@/lib/compare-drawer-actions";
import { compareDrawerDivergingDecisionLabels } from "@/lib/compare-drawer-signals-ui-lib";

export type CompareDrawerPresentationState = {
  divergingDecisionLabels: Set<string>;
  actionRowDiverges: boolean;
};

export function compareDrawerPresentationState(items: Entry[]): CompareDrawerPresentationState {
  return {
    divergingDecisionLabels: new Set(compareDrawerDivergingDecisionLabels(items)),
    actionRowDiverges: compareDrawerActionsDiverge(items),
  };
}
