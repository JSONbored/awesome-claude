import type { Entry } from "@/types/registry";
import type { BestListPickRef } from "@/lib/compare-best-summary";
import type { EntryIdentity } from "@/lib/entry-identity";
import {
  compareDossierInteractiveShowCompareSection,
  compareDossierInteractiveUiState,
  type CompareDossierInteractiveUiState,
} from "@/lib/compare-dossier-interactive-ui-lib";
import {
  compareEntryFeaturedInteractiveShowsFeaturedLinks,
  compareEntryFeaturedInteractiveUiState,
  type CompareEntryFeaturedInteractiveUiState,
} from "@/lib/compare-entry-featured-interactive-ui-lib";

export type CompareEntryInteractiveUiState = {
  dossierUi: CompareDossierInteractiveUiState;
  featuredUi: CompareEntryFeaturedInteractiveUiState;
  hasFeaturedLinks: boolean;
  showDossierCompareSection: boolean;
};

export function compareEntryInteractiveUiState(
  entry: Entry,
  alternatives: Entry[],
  comparisons: ReadonlyArray<{ slug: string; refs: string[] }>,
  lists: ReadonlyArray<{ slug: string; picks: BestListPickRef[] }>,
  catalog: EntryIdentity[],
): CompareEntryInteractiveUiState {
  const dossierUi = compareDossierInteractiveUiState(entry, alternatives);
  const featuredUi = compareEntryFeaturedInteractiveUiState(comparisons, lists, catalog);
  return {
    dossierUi,
    featuredUi,
    hasFeaturedLinks: compareEntryFeaturedInteractiveShowsFeaturedLinks(
      comparisons,
      lists,
      catalog,
    ),
    showDossierCompareSection: compareDossierInteractiveShowCompareSection(entry, alternatives),
  };
}

export function compareEntryInteractiveShowsFeaturedLinks(
  comparisons: ReadonlyArray<{ slug: string; refs: string[] }>,
  lists: ReadonlyArray<{ slug: string; picks: BestListPickRef[] }>,
  catalog: EntryIdentity[],
): boolean {
  return compareEntryFeaturedInteractiveShowsFeaturedLinks(comparisons, lists, catalog);
}

export function compareEntryInteractiveShowsDossierCompareSection(
  entry: Entry,
  alternatives: Entry[],
): boolean {
  return compareDossierInteractiveShowCompareSection(entry, alternatives);
}
