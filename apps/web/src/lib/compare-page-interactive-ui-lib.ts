import type { Entry } from "@/types/registry";
import type { EntryIdentity } from "@/lib/entry-identity";
import {
  comparePageEmptyUiState,
  type ComparePageEmptyUiState,
} from "@/lib/compare-page-empty-ui-lib";
import { comparePageUiState, type ComparePageUiState } from "@/lib/compare-page-ui-lib";

export type ComparePageInteractiveUiState = {
  pageUi: ComparePageUiState;
  emptyUi: ComparePageEmptyUiState;
};

export function comparePageInteractiveUiState(
  items: Entry[],
  ids: string,
  comparisons: ReadonlyArray<{ slug: string; heading: string; refs: string[] }>,
  catalog: EntryIdentity[],
): ComparePageInteractiveUiState {
  return {
    pageUi: comparePageUiState(items),
    emptyUi: comparePageEmptyUiState(ids, comparisons, catalog),
  };
}
