import type { Entry } from "@/types/registry";
import { compareActionsDiverge } from "@/lib/compare-entry-actions";
import {
  compareCuratedDecisionBannerText,
  type CompareDecisionSummary,
} from "@/lib/compare-curated-summary";
import { compareDecisionSummary } from "@/lib/compare-table-decision-rows";

export function compareDossierEntries(entry: Entry, alternatives: Entry[]): Entry[] {
  return [entry, ...alternatives];
}

export function compareDossierSummary(
  entry: Entry,
  alternatives: Entry[],
): {
  comparedCount: number;
  decision: CompareDecisionSummary;
  actionsDiverge: boolean;
  hasAnyDivergence: boolean;
} {
  const entries = compareDossierEntries(entry, alternatives);
  const decision = compareDecisionSummary(entries);
  const actionsDiverge = compareActionsDiverge(entries);
  return {
    comparedCount: entries.length,
    decision,
    actionsDiverge,
    hasAnyDivergence: decision.divergingCount > 0 || actionsDiverge,
  };
}

export function compareDossierDecisionBannerText(
  entry: Entry,
  alternatives: Entry[],
): string | null {
  return compareCuratedDecisionBannerText(
    compareDecisionSummary(compareDossierEntries(entry, alternatives)),
  );
}

export function compareDossierActionBannerText(actionsDiverge: boolean): string | null {
  if (!actionsDiverge) return null;
  return "Next steps differ across entries — use the actions in the table below to copy install commands and source links per resource.";
}

export function compareDossierBannerTexts(entry: Entry, alternatives: Entry[]): string[] {
  const summary = compareDossierSummary(entry, alternatives);
  const messages: string[] = [];
  const decisionText = compareDossierDecisionBannerText(entry, alternatives);
  const actionText = compareDossierActionBannerText(summary.actionsDiverge);
  if (decisionText) messages.push(decisionText);
  if (actionText) messages.push(actionText);
  return messages;
}
