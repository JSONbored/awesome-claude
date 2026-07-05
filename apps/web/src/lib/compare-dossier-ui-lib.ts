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
