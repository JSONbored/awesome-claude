import type { BestListPickRef } from "@/lib/compare-best-summary";
import type { EntryIdentity } from "@/lib/entry-identity";
import {
  compareEntryFeaturedUiState,
  type CompareEntryFeaturedUiState,
} from "@/lib/compare-entry-featured-ui-lib";

export type CompareEntryFeaturedInteractiveUiState = CompareEntryFeaturedUiState;

export function compareEntryFeaturedInteractiveUiState(
  comparisons: ReadonlyArray<{ slug: string; refs: string[] }>,
  lists: ReadonlyArray<{ slug: string; picks: BestListPickRef[] }>,
  catalog: EntryIdentity[],
): CompareEntryFeaturedInteractiveUiState {
  return compareEntryFeaturedUiState(comparisons, lists, catalog);
}
