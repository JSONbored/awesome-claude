import type { Entry } from "@/types/registry";
import { compareActionsDiverge } from "@/lib/compare-entry-actions";
import {
  compareCuratedDecisionBannerText,
  type CompareDecisionSummary,
} from "@/lib/compare-curated-summary";
import { compareDecisionSummary } from "@/lib/compare-table-decision-rows";

export const COMPARE_PAGE_SURFACE = "compare-page";

export function comparePageDecisionSummary(entries: Entry[]): CompareDecisionSummary {
  return compareDecisionSummary(entries);
}

export function comparePageDecisionBannerText(entries: Entry[]): string | null {
  return compareCuratedDecisionBannerText(compareDecisionSummary(entries));
}

export function comparePageActionBannerText(actionsDiverge: boolean): string | null {
  if (!actionsDiverge) return null;
  return "Next steps differ across this comparison — review install, source, and claim actions in the table below.";
}

export function comparePageSummary(entries: Entry[]): {
  comparedCount: number;
  decision: CompareDecisionSummary;
  actionsDiverge: boolean;
  hasAnyDivergence: boolean;
} {
  const decision = compareDecisionSummary(entries);
  const actionsDiverge = compareActionsDiverge(entries);
  return {
    comparedCount: entries.length,
    decision,
    actionsDiverge,
    hasAnyDivergence: decision.divergingCount > 0 || actionsDiverge,
  };
}

export function comparePageBannerTexts(entries: Entry[]): string[] {
  const summary = comparePageSummary(entries);
  const messages: string[] = [];
  const decisionText = comparePageDecisionBannerText(entries);
  const actionText = comparePageActionBannerText(summary.actionsDiverge);
  if (decisionText) messages.push(decisionText);
  if (actionText) messages.push(actionText);
  return messages;
}
