import type { Entry } from "@/types/registry";
import {
  compareDossierBannerTexts,
  compareDossierInteractiveSearch,
} from "@/lib/compare-dossier-summary";
import { compareInteractiveLinkLabel } from "@/lib/compare-interactive-link";

export function compareDossierHeaderBannerTexts(entry: Entry, alternatives: Entry[]): string[] {
  return compareDossierBannerTexts(entry, alternatives);
}

export function compareDossierInteractiveCompareSearch(
  entry: Entry,
  alternatives: Entry[],
): { ids: string } | null {
  return compareDossierInteractiveSearch(entry, alternatives);
}

export function compareDossierInteractiveLinkLabel(comparedCount: number): string {
  return compareInteractiveLinkLabel(comparedCount);
}

export function compareDossierShowCompareSection(alternatives: Entry[]): boolean {
  return alternatives.length > 0;
}

export type CompareDossierUiState = {
  showCompareSection: boolean;
  bannerTexts: string[];
  interactiveSearch: { ids: string } | null;
  interactiveLinkLabel: string;
};

export function compareDossierUiState(entry: Entry, alternatives: Entry[]): CompareDossierUiState {
  const comparedCount = alternatives.length + 1;
  return {
    showCompareSection: alternatives.length > 0,
    bannerTexts: compareDossierBannerTexts(entry, alternatives),
    interactiveSearch: compareDossierInteractiveSearch(entry, alternatives),
    interactiveLinkLabel: compareInteractiveLinkLabel(comparedCount),
  };
}
