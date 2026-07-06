import type { Entry } from "@/types/registry";
import type { BestListPickRef } from "@/lib/compare-best-summary";
import type { EntryIdentity } from "@/lib/entry-identity";
import {
  compareDossierInteractiveUiState,
  type CompareDossierInteractiveUiState,
} from "@/lib/compare-dossier-interactive-ui-lib";
import {
  compareEntryFeaturedInteractiveUiState,
  type CompareEntryFeaturedInteractiveUiState,
} from "@/lib/compare-entry-featured-interactive-ui-lib";

export type CompareEntryInteractiveUiState = {
  dossierUi: CompareDossierInteractiveUiState;
  featuredUi: CompareEntryFeaturedInteractiveUiState;
};

export function compareEntryInteractiveUiState(
  entry: Entry,
  alternatives: Entry[],
  comparisons: ReadonlyArray<{ slug: string; refs: string[] }>,
  lists: ReadonlyArray<{ slug: string; picks: BestListPickRef[] }>,
  catalog: EntryIdentity[],
): CompareEntryInteractiveUiState {
  return {
    dossierUi: compareDossierInteractiveUiState(entry, alternatives),
    featuredUi: compareEntryFeaturedInteractiveUiState(comparisons, lists, catalog),
  };
}
