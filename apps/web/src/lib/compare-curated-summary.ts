import type { Entry } from "@/types/registry";
import { compareActionsDiverge } from "@/lib/compare-entry-actions";
import { compareDecisionSummary } from "@/lib/compare-table-decision-rows";

export type CompareDecisionSummary = ReturnType<typeof compareDecisionSummary>;

export type CompareCuratedSummary = {
  comparedCount: number;
  decision: CompareDecisionSummary;
  actionsDiverge: boolean;
  hasAnyDivergence: boolean;
};

export function compareCuratedSummary(entries: Entry[]): CompareCuratedSummary {
  const decision = compareDecisionSummary(entries);
  const actionsDiverge = compareActionsDiverge(entries);
  return {
    comparedCount: entries.length,
    decision,
    actionsDiverge,
    hasAnyDivergence: decision.divergingCount > 0 || actionsDiverge,
  };
}

export function compareCuratedDecisionBannerText(decision: CompareDecisionSummary): string | null {
  if (decision.divergingCount === 0) return null;
  const signalWord = decision.divergingCount === 1 ? "signal" : "signals";
  return `${decision.divergingCount} trust ${signalWord} differ across this comparison (${decision.divergingLabels.join(", ")}).`;
}

export function compareCuratedActionBannerText(actionsDiverge: boolean): string | null {
  if (!actionsDiverge) return null;
  return "Next steps differ across entries — open the interactive comparison to copy install commands and source links per resource.";
}

export function compareCuratedBannerTexts(entries: Entry[]): string[] {
  const summary = compareCuratedSummary(entries);
  const messages: string[] = [];
  const decisionText = compareCuratedDecisionBannerText(summary.decision);
  const actionText = compareCuratedActionBannerText(summary.actionsDiverge);
  if (decisionText) messages.push(decisionText);
  if (actionText) messages.push(actionText);
  return messages;
}
