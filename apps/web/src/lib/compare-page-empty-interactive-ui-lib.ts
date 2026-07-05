import type { EntryIdentity } from "@/lib/entry-identity";
import {
  comparePageEmptyUiState,
  type ComparePageEmptyUiState,
} from "@/lib/compare-page-empty-ui-lib";

export type { ComparePageEmptyUiState };
export type ComparePageEmptyInteractiveUiState = ComparePageEmptyUiState;

export function comparePageEmptyInteractiveUiState(
  ids: string,
  comparisons: ReadonlyArray<{ slug: string; heading: string; refs: string[] }>,
  catalog: EntryIdentity[],
): ComparePageEmptyInteractiveUiState {
  return comparePageEmptyUiState(ids, comparisons, catalog);
}
