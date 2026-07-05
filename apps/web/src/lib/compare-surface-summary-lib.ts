/**
 * Shared compare surface summary helpers.
 *
 * Builds decision and action divergence summaries for compare page and drawer
 * headers. Nothing here touches the network — given the same entry metadata
 * the output is deterministic.
 */

import type { Entry } from "@/types/registry";
import { compareActionsDiverge } from "@/lib/compare-entry-actions";
import {
  compareCuratedDecisionBannerText,
  type CompareDecisionSummary,
} from "@/lib/compare-curated-summary";
import { compareDecisionSummary } from "@/lib/compare-table-decision-rows";

export function compareSurfaceDecisionSummary(entries: Entry[]): CompareDecisionSummary {
  return compareDecisionSummary(entries);
}

export function compareSurfaceDecisionBannerText(entries: Entry[]): string | null {
  return compareCuratedDecisionBannerText(compareDecisionSummary(entries));
}

export function compareSurfaceSummary(entries: Entry[]): {
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

export function compareSurfaceBannerTexts(
  entries: Entry[],
  actionBannerText: string | null,
): string[] {
  const messages: string[] = [];
  const decisionText = compareSurfaceDecisionBannerText(entries);
  if (decisionText) messages.push(decisionText);
  if (actionBannerText) messages.push(actionBannerText);
  return messages;
}
