import type { BestListPickRef } from "@/lib/compare-best-summary";
import type { EntryIdentity } from "@/lib/entry-identity";
import {
  compareEntryFeaturedBestListLinks,
  compareEntryFeaturedComparisonLinks,
  compareEntryFeaturedUiState,
  type CompareEntryFeaturedUiState,
} from "@/lib/compare-entry-featured-ui-lib";

export type CompareEntryFeaturedInteractiveUiState = CompareEntryFeaturedUiState;

export function compareEntryFeaturedInteractiveUiState(
  comparisons: ReadonlyArray<{ slug: string; refs: string[] }>,
  lists: ReadonlyArray<{ slug: string; picks: BestListPickRef[] }>,
  catalog: EntryIdentity[],
): CompareEntryFeaturedInteractiveUiState {
  const ui = compareEntryFeaturedUiState(comparisons, lists, catalog);
  return {
    ...ui,
    hasFeaturedLinks: compareEntryFeaturedInteractiveShowsFeaturedLinks(
      comparisons,
      lists,
      catalog,
    ),
  };
}

export function compareEntryFeaturedInteractiveShowsFeaturedLinks(
  comparisons: ReadonlyArray<{ slug: string; refs: string[] }>,
  lists: ReadonlyArray<{ slug: string; picks: BestListPickRef[] }>,
  catalog: EntryIdentity[],
): boolean {
  return (
    compareEntryFeaturedComparisonLinks(comparisons, catalog).length > 0 ||
    compareEntryFeaturedBestListLinks(lists, catalog).length > 0
  );
}
