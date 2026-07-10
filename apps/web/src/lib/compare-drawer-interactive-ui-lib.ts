import type { Entry } from "@/types/registry";
import type { CompareDrawerActionCell } from "@/lib/compare-drawer-actions-ui-lib";
import {
  compareDrawerActionsInteractiveActionCells,
  compareDrawerActionsInteractiveActionRowDiverges,
} from "@/lib/compare-drawer-actions-interactive-ui-lib";
import {
  compareDrawerEmptyInteractiveEmptyHint,
  compareDrawerEmptyInteractiveShareUrl,
} from "@/lib/compare-drawer-empty-interactive-ui-lib";
import { compareSingleItemHintText } from "@/lib/compare-empty-guidance-lib";
import {
  compareDrawerUiInteractiveDivergingDecisionLabels,
  compareDrawerUiInteractiveUiState,
  type CompareDrawerUiState,
} from "@/lib/compare-drawer-ui-interactive-ui-lib";

export type CompareDrawerInteractiveUiState = {
  drawerUi: CompareDrawerUiState;
  emptyHint: string;
  singleItemHint: string | null;
  shareUrl: string;
  divergingDecisionLabels: Set<string>;
  actionRowDiverges: boolean;
  actionCells: CompareDrawerActionCell[];
};

export function compareDrawerInteractiveEmptyHint(items: Entry[]): string {
  return compareDrawerEmptyInteractiveEmptyHint();
}

export function compareDrawerInteractiveShareUrl(items: Entry[]): string {
  return compareDrawerEmptyInteractiveShareUrl(items);
}

export function compareDrawerInteractiveSingleItemHint(itemCount: number): string | null {
  return compareSingleItemHintText(itemCount);
}

export function compareDrawerInteractiveUiState(items: Entry[]): CompareDrawerInteractiveUiState {
  const { divergingDecisionLabels, ...drawerUi } = compareDrawerUiInteractiveUiState(items);
  return {
    drawerUi,
    emptyHint: compareDrawerInteractiveEmptyHint(items),
    singleItemHint: compareDrawerInteractiveSingleItemHint(items.length),
    shareUrl: compareDrawerInteractiveShareUrl(items),
    divergingDecisionLabels: compareDrawerUiInteractiveDivergingDecisionLabels(items),
    actionRowDiverges: compareDrawerActionsInteractiveActionRowDiverges(items),
    actionCells: compareDrawerActionsInteractiveActionCells(items),
  };
}
