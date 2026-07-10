import type { Entry } from "@/types/registry";
import type { EntryIdentity } from "@/lib/entry-identity";
import type { ComparePageActionCell } from "@/lib/compare-page-actions-ui-lib";
import { comparePageActionCells } from "@/lib/compare-page-actions-ui-lib";
import {
  comparePageEmptyInteractiveUiState,
  type ComparePageEmptyUiState,
} from "@/lib/compare-page-empty-interactive-ui-lib";
import { comparePagePresentationActionRowDiverges } from "@/lib/compare-page-presentation-ui-lib";
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

export function comparePageInteractivePageUi(items: Entry[]): ComparePageUiState {
  return comparePageUiInteractiveUiState(items);
}

export function comparePageInteractiveEmptyUi(
  ids: string,
  comparisons: ReadonlyArray<{ slug: string; heading: string; refs: string[] }>,
  catalog: EntryIdentity[],
): ComparePageEmptyUiState {
  return comparePageEmptyInteractiveUiState(ids, comparisons, catalog);
}

export function comparePageInteractiveActionRowDiverges(items: Entry[]): boolean {
  return comparePagePresentationActionRowDiverges(items);
}

export function comparePageInteractiveActionCells(items: Entry[]): ComparePageActionCell[] {
  return comparePageActionCells(items);
}

export function comparePageInteractiveUiState(
  items: Entry[],
  ids: string,
  comparisons: ReadonlyArray<{ slug: string; heading: string; refs: string[] }>,
  catalog: EntryIdentity[],
): ComparePageInteractiveUiState {
  return {
    pageUi: comparePageInteractivePageUi(items),
    emptyUi: comparePageInteractiveEmptyUi(ids, comparisons, catalog),
    actionRowDiverges: comparePageInteractiveActionRowDiverges(items),
    actionCells: comparePageInteractiveActionCells(items),
  };
}
