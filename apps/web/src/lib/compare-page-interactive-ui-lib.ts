import type { Entry } from "@/types/registry";
import type { EntryIdentity } from "@/lib/entry-identity";
import type { ComparePageActionCell } from "@/lib/compare-page-actions-ui-lib";
import { comparePageActionsInteractiveUiState } from "@/lib/compare-page-actions-interactive-ui-lib";
import {
  comparePageEmptyInteractiveUiState,
  type ComparePageEmptyUiState,
} from "@/lib/compare-page-empty-interactive-ui-lib";
import {
  comparePageUiInteractiveUiState,
  type ComparePageUiState,
} from "@/lib/compare-page-ui-interactive-ui-lib";

export type ComparePageInteractiveUiState = {
  pageUi: ComparePageUiState;
  emptyUi: ComparePageEmptyUiState;
  actionRowDiverges: boolean;
  actionCells: ComparePageActionCell[];
};

export function comparePageInteractiveUiState(
  items: Entry[],
  ids: string,
  comparisons: ReadonlyArray<{ slug: string; heading: string; refs: string[] }>,
  catalog: EntryIdentity[],
): ComparePageInteractiveUiState {
  const pageUi = comparePageUiInteractiveUiState(items);
  const actions = comparePageActionsInteractiveUiState(items);
  return {
    pageUi,
    emptyUi: comparePageEmptyInteractiveUiState(ids, comparisons, catalog),
    actionRowDiverges: pageUi.actionRowDiverges,
    actionCells: actions.actionCells,
  };
}
