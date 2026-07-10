import type { BestListPickRef } from "@/lib/compare-best-summary";
import type { EntryIdentity } from "@/lib/entry-identity";
import {
  compareEntryFeaturedShowsFeaturedLinks,
  compareEntryFeaturedUiState,
  type CompareEntryFeaturedUiState,
} from "@/lib/compare-entry-featured-ui-lib";

export type CompareEntryFeaturedInteractiveUiState = CompareEntryFeaturedUiState;

export function compareEntryFeaturedInteractiveShowsFeaturedLinks(
  comparisons: ReadonlyArray<{ slug: string; refs: string[] }>,
  lists: ReadonlyArray<{ slug: string; picks: BestListPickRef[] }>,
  catalog: EntryIdentity[],
): boolean {
  return compareEntryFeaturedShowsFeaturedLinks(comparisons, lists, catalog);
}

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
