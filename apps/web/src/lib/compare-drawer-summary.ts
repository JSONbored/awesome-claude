import type { Entry } from "@/types/registry";
import { compareActionsDiverge } from "@/lib/compare-entry-actions";
import {
  compareCuratedDecisionBannerText,
  type CompareDecisionSummary,
} from "@/lib/compare-curated-summary";
import { compareDecisionSummary } from "@/lib/compare-table-decision-rows";

export function compareDrawerDecisionSummary(entries: Entry[]): CompareDecisionSummary {
  return compareDecisionSummary(entries);
}

export function compareDrawerDecisionBannerText(entries: Entry[]): string | null {
  return compareCuratedDecisionBannerText(compareDecisionSummary(entries));
}

export function compareDrawerActionBannerText(actionsDiverge: boolean): string | null {
  if (!actionsDiverge) return null;
  return "Next steps differ across this comparison — review install, source, and claim actions per entry.";
}

export function compareDrawerSummary(entries: Entry[]): {
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

export function compareDrawerBannerTexts(entries: Entry[]): string[] {
  const summary = compareDrawerSummary(entries);
  const messages: string[] = [];
  const decisionText = compareDrawerDecisionBannerText(entries);
  const actionText = compareDrawerActionBannerText(summary.actionsDiverge);
  if (decisionText) messages.push(decisionText);
  if (actionText) messages.push(actionText);
  return messages;
}
