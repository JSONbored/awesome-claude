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

export function compareEntryInteractiveDossierUi(
  entry: Entry,
  alternatives: Entry[],
): CompareDossierInteractiveUiState {
  return compareDossierInteractiveUiState(entry, alternatives);
}

export function compareEntryInteractiveFeaturedUi(
  comparisons: ReadonlyArray<{ slug: string; refs: string[] }>,
  lists: ReadonlyArray<{ slug: string; picks: BestListPickRef[] }>,
  catalog: EntryIdentity[],
): CompareEntryFeaturedInteractiveUiState {
  return compareEntryFeaturedInteractiveUiState(comparisons, lists, catalog);
}

export function compareEntryInteractiveUiState(
  entry: Entry,
  alternatives: Entry[],
  comparisons: ReadonlyArray<{ slug: string; refs: string[] }>,
  lists: ReadonlyArray<{ slug: string; picks: BestListPickRef[] }>,
  catalog: EntryIdentity[],
): CompareEntryInteractiveUiState {
  return {
    dossierUi: compareEntryInteractiveDossierUi(entry, alternatives),
    featuredUi: compareEntryInteractiveFeaturedUi(comparisons, lists, catalog),
    hasFeaturedLinks: compareEntryInteractiveShowsFeaturedLinks(comparisons, lists, catalog),
    showDossierCompareSection: compareEntryInteractiveShowsDossierCompareSection(
      entry,
      alternatives,
    ),
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
