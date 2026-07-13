/**
 * Pure browse decision panel entry egress analytics helpers.
 *
 * Maps adoption-queue and decision-confidence entry navigation to privacy-light
 * event names without embedding entry titles, blockers, or signal labels.
 */

import type { BrowseAdoptionPresetId, BrowseAdoptionTier } from "@/lib/browse-adoption-queue-lib";
import type {
  BrowseConfidenceBand,
  BrowseConfidencePresetId,
} from "@/lib/browse-decision-confidence-lib";

export const BROWSE_ADOPTION_QUEUE_SURFACE = "browse-adoption-queue";
export const BROWSE_DECISION_CONFIDENCE_SURFACE = "browse-decision-confidence";

export function browseAdoptionQueueEntryAnalyticsEvent(): string {
  return "browse_adoption_queue_entry_click";
}

export function browseAdoptionQueueEntryAnalyticsData(
  entryRef: string,
  preset: BrowseAdoptionPresetId,
  tier: BrowseAdoptionTier,
  readinessScore: number,
  blockerCount: number,
) {
  return {
    surface: BROWSE_ADOPTION_QUEUE_SURFACE,
    entry: entryRef,
    preset,
    tier,
    readinessScore,
    blockerCount,
  };
}

export function browseDecisionConfidenceEntryAnalyticsEvent(): string {
  return "browse_decision_confidence_entry_click";
}

export function browseDecisionConfidenceEntryAnalyticsData(
  entryRef: string,
  preset: BrowseConfidencePresetId,
  band: BrowseConfidenceBand,
  confidenceScore: number,
  missingSignalCount: number,
) {
  return {
    surface: BROWSE_DECISION_CONFIDENCE_SURFACE,
    entry: entryRef,
    preset,
    band,
    confidenceScore,
    missingSignalCount,
  };
}

export function parseBrowseDecisionPanelEntryRef(
  entryRef: string,
): { category: string; slug: string } | null {
  const slash = entryRef.indexOf("/");
  if (slash <= 0 || slash >= entryRef.length - 1) {
    return null;
  }
  return {
    category: entryRef.slice(0, slash),
    slug: entryRef.slice(slash + 1),
  };
}
