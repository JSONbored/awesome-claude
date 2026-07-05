import type { Entry } from "@/types/registry";
import { divergingDecisionRowLabels } from "@/lib/compare-table-decision-rows";
import {
  compareTableActionsDiverge,
  shouldRenderCompareTableActions,
} from "@/lib/compare-table-actions";

export type CompareTablePresentationState = {
  divergingDecisionLabels: Set<string>;
  renderNextActions: boolean;
  actionRowDiverges: boolean;
};

export function compareTablePresentationState(
  entries: Entry[],
  showNextActions: boolean,
): CompareTablePresentationState {
  const renderNextActions = shouldRenderCompareTableActions(entries, showNextActions);
  return {
    divergingDecisionLabels: new Set(divergingDecisionRowLabels(entries)),
    renderNextActions,
    actionRowDiverges: renderNextActions && compareTableActionsDiverge(entries),
  };
}
