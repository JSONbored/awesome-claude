import type { Entry } from "@/types/registry";
import { comparePageActionsDiverge } from "@/lib/compare-page-actions-ui-lib";

export type ComparePagePresentationState = {
  actionRowDiverges: boolean;
};

export function comparePagePresentationState(items: Entry[]): ComparePagePresentationState {
  return {
    actionRowDiverges: comparePageActionsDiverge(items),
  };
}
