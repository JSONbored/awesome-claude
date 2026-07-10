/**
 * Pure browse decision panel preset analytics helpers.
 *
 * Maps adoption queue and decision confidence preset chip clicks to
 * privacy-light event names without embedding panel copy.
 */

export type BrowseDecisionPanelId = "adoption-queue" | "decision-confidence";

export function browseDecisionPresetSurface(panel: BrowseDecisionPanelId): string {
  return `browse-${panel}`;
}

export function browseDecisionPresetAnalyticsEvent(): string {
  return "browse_decision_preset_select";
}

export function browseDecisionPresetAnalyticsData(
  panel: BrowseDecisionPanelId,
  preset: string,
  resultCount: number,
) {
  return {
    surface: browseDecisionPresetSurface(panel),
    panel,
    preset,
    resultCount,
  };
}
