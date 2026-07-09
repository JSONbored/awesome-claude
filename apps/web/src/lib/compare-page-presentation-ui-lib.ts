import type { Entry } from "@/types/registry";
import { comparePageActionsDiverge } from "@/lib/compare-page-ui-lib";

export type ComparePagePresentationState = {
  actionRowDiverges: boolean;
};

export function comparePagePresentationActionRowDiverges(items: Entry[]): boolean {
  return comparePageActionsDiverge(items);
}

export function comparePagePresentationState(items: Entry[]): ComparePagePresentationState {
  return {
    actionRowDiverges: comparePagePresentationActionRowDiverges(items),
  };
}
