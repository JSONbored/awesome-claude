import type { Entry } from "@/types/registry";
import { compareDrawerUiActionsDiverge } from "@/lib/compare-drawer-ui-lib";
import { compareDrawerDivergingDecisionLabels } from "@/lib/compare-drawer-signals-ui-lib";

export type CompareDrawerPresentationState = {
  divergingDecisionLabels: Set<string>;
  actionRowDiverges: boolean;
};

export function compareDrawerPresentationDivergingDecisionLabels(items: Entry[]): Set<string> {
  return new Set(compareDrawerDivergingDecisionLabels(items));
}

export function compareDrawerPresentationActionRowDiverges(items: Entry[]): boolean {
  return compareDrawerUiActionsDiverge(items);
}

export function compareDrawerPresentationState(items: Entry[]): CompareDrawerPresentationState {
  return {
    divergingDecisionLabels: compareDrawerPresentationDivergingDecisionLabels(items),
    actionRowDiverges: compareDrawerPresentationActionRowDiverges(items),
  };
}
