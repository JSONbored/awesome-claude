import type { Entry } from "@/types/registry";
import { compareInteractiveSearch } from "@/lib/compare-interactive-link";
import {
  compareSurfaceBannerTexts,
  compareSurfaceDecisionBannerText,
  compareSurfaceSummary,
} from "@/lib/compare-surface-summary-lib";

export function compareDossierEntries(entry: Entry, alternatives: Entry[]): Entry[] {
  return [entry, ...alternatives];
}

export function compareDossierSummary(entry: Entry, alternatives: Entry[]) {
  return compareSurfaceSummary(compareDossierEntries(entry, alternatives));
}

export function compareDossierDecisionBannerText(
  entry: Entry,
  alternatives: Entry[],
): string | null {
  return compareSurfaceDecisionBannerText(compareDossierEntries(entry, alternatives));
}

export function compareDossierActionBannerText(actionsDiverge: boolean): string | null {
  if (!actionsDiverge) return null;
  return "Next steps differ across entries — use the actions in the table below to copy install commands and source links per resource.";
}

export function compareDossierBannerTexts(entry: Entry, alternatives: Entry[]): string[] {
  const entries = compareDossierEntries(entry, alternatives);
  const summary = compareSurfaceSummary(entries);
  return compareSurfaceBannerTexts(entries, compareDossierActionBannerText(summary.actionsDiverge));
}

export function compareDossierInteractiveSearch(
  entry: Entry,
  alternatives: Entry[],
): { ids: string } | null {
  return compareInteractiveSearch(compareDossierEntries(entry, alternatives));
}
