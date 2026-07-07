import type { Entry } from "@/types/registry";
import type { EntryIdentity } from "@/lib/entry-identity";
import {
  compareFeaturedInteractiveLinkLabel,
  compareFeaturedInteractiveSearch,
  resolveComparisonRefs,
} from "@/lib/compare-featured-link";
import {
  compareSurfaceBannerTexts,
  compareSurfaceDecisionBannerText,
  compareSurfaceSummary,
} from "@/lib/compare-surface-summary-lib";

export type BestListPickRef = {
  ref: string;
};

export function compareBestSummary(entries: Entry[]) {
  return compareSurfaceSummary(entries);
}

export function compareBestDecisionBannerText(entries: Entry[]): string | null {
  return compareSurfaceDecisionBannerText(entries);
}

export function compareBestActionBannerText(actionsDiverge: boolean): string | null {
  if (!actionsDiverge) return null;
  return "Next steps differ across picks — use the actions in the table below to copy install commands and source links per resource.";
}

export function shouldShowBestCompareSection(entries: Entry[]): boolean {
  return entries.length >= 2;
}

export function compareBestBannerTexts(entries: Entry[]): string[] {
  if (!shouldShowBestCompareSection(entries)) return [];
  const summary = compareSurfaceSummary(entries);
  return compareSurfaceBannerTexts(entries, compareBestActionBannerText(summary.actionsDiverge));
}

export function compareBestListPickRefs(picks: BestListPickRef[]): string[] {
  return picks.map((pick) => pick.ref);
}

export function compareBestListInteractiveSearch(
  picks: BestListPickRef[],
  catalog: EntryIdentity[],
): { ids: string } | null {
  return compareFeaturedInteractiveSearch(compareBestListPickRefs(picks), catalog);
}

export function compareBestListInteractiveLinkLabel(
  picks: BestListPickRef[],
  catalog: EntryIdentity[],
): string {
  return compareFeaturedInteractiveLinkLabel(
    resolveComparisonRefs(compareBestListPickRefs(picks), catalog).length,
  );
}
