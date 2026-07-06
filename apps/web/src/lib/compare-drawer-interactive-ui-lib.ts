import type { Entry } from "@/types/registry";
import type { CompareDrawerActionCell } from "@/lib/compare-drawer-actions-ui-lib";
import { compareDrawerActionsInteractiveUiState } from "@/lib/compare-drawer-actions-interactive-ui-lib";
import { compareDrawerEmptyInteractiveUiState } from "@/lib/compare-drawer-empty-interactive-ui-lib";
import { compareDrawerPresentationUiInteractiveUiState } from "@/lib/compare-drawer-presentation-ui-interactive-ui-lib";
import {
  compareDrawerUiInteractiveUiState,
  type CompareDrawerUiState,
} from "@/lib/compare-drawer-ui-interactive-ui-lib";

export type CompareDrawerInteractiveUiState = {
  drawerUi: CompareDrawerUiState;
  emptyHint: string;
  shareUrl: string;
  divergingDecisionLabels: Set<string>;
  actionRowDiverges: boolean;
  actionCells: CompareDrawerActionCell[];
};

export function compareDrawerInteractiveUiState(items: Entry[]): CompareDrawerInteractiveUiState {
  const emptyUi = compareDrawerEmptyInteractiveUiState(items);
  const drawerUi = compareDrawerUiInteractiveUiState(items);
  const presentation = compareDrawerPresentationUiInteractiveUiState(items);
  const actions = compareDrawerActionsInteractiveUiState(items);
  return {
    drawerUi,
    emptyHint: emptyUi.emptyHint,
    shareUrl: emptyUi.shareUrl,
    divergingDecisionLabels: presentation.divergingDecisionLabels,
    actionRowDiverges: drawerUi.actionRowDiverges,
    actionCells: actions.actionCells,
  };
}
