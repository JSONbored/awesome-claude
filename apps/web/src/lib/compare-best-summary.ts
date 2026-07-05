import type { Entry } from "@/types/registry";
import type { EntryIdentity } from "@/lib/entry-identity";
import {
  compareFeaturedInteractiveLinkLabel,
  compareFeaturedInteractiveSearch,
  resolveComparisonRefs,
} from "@/lib/compare-featured-link";
import {
  compareCuratedDecisionBannerText,
  compareCuratedSummary,
  type CompareDecisionSummary,
} from "@/lib/compare-curated-summary";
import { compareDecisionSummary } from "@/lib/compare-table-decision-rows";

export type BestListPickRef = {
  ref: string;
};

export function compareBestSummary(entries: Entry[]): {
  comparedCount: number;
  decision: CompareDecisionSummary;
  actionsDiverge: boolean;
  hasAnyDivergence: boolean;
} {
  return compareCuratedSummary(entries);
}

export function compareBestDecisionBannerText(entries: Entry[]): string | null {
  return compareCuratedDecisionBannerText(compareDecisionSummary(entries));
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
  const summary = compareBestSummary(entries);
  const messages: string[] = [];
  const decisionText = compareBestDecisionBannerText(entries);
  const actionText = compareBestActionBannerText(summary.actionsDiverge);
  if (decisionText) messages.push(decisionText);
  if (actionText) messages.push(actionText);
  return messages;
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
