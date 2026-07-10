import type { Entry } from "@/types/registry";
import {
  compareDossierHeaderBannerTexts,
  compareDossierInteractiveCompareSearch,
  compareDossierInteractiveLinkLabel,
  compareDossierShowCompareSection,
  type CompareDossierUiState,
} from "@/lib/compare-dossier-ui-lib";

export type CompareDossierInteractiveUiState = CompareDossierUiState;

export function compareDossierInteractiveShowCompareSection(
  _entry: Entry,
  alternatives: Entry[],
): boolean {
  return compareDossierShowCompareSection(alternatives);
}

export function compareDossierInteractiveUiState(
  entry: Entry,
  alternatives: Entry[],
): CompareDossierInteractiveUiState {
  return {
    showCompareSection: compareDossierInteractiveShowCompareSection(entry, alternatives),
    bannerTexts: compareDossierHeaderBannerTexts(entry, alternatives),
    interactiveSearch: compareDossierInteractiveCompareSearch(entry, alternatives),
    interactiveLinkLabel: compareDossierInteractiveLinkLabel(alternatives.length + 1),
  };
}
