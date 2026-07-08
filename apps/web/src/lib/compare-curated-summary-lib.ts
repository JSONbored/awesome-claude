import type { Entry } from "@/types/registry";
import { compareDecisionSummary } from "@/lib/compare-table-decision-rows-lib";
import {
  compareSurfaceBannerTexts,
  compareSurfaceSummary,
} from "@/lib/compare-surface-summary-lib";

export type CompareDecisionSummary = ReturnType<typeof compareDecisionSummary>;

export type CompareCuratedSummary = {
  comparedCount: number;
  decision: CompareDecisionSummary;
  actionsDiverge: boolean;
  hasAnyDivergence: boolean;
};

export function compareCuratedSummary(entries: Entry[]): CompareCuratedSummary {
  return compareSurfaceSummary(entries);
}

export function compareCuratedDecisionBannerText(decision: CompareDecisionSummary): string | null {
  if (decision.divergingCount === 0) return null;
  const signalWord = decision.divergingCount === 1 ? "signal" : "signals";
  return `${decision.divergingCount} trust ${signalWord} differ across this comparison (${decision.divergingLabels.join(", ")}).`;
}

export function compareCuratedActionBannerText(actionsDiverge: boolean): string | null {
  if (!actionsDiverge) return null;
  return "Next steps differ across entries — open the interactive comparison to compare install/config copy, source links, API JSON, and LLM/MCP handoff links per resource.";
}

export function compareCuratedBannerTexts(entries: Entry[]): string[] {
  const summary = compareSurfaceSummary(entries);
  return compareSurfaceBannerTexts(entries, compareCuratedActionBannerText(summary.actionsDiverge));
}
