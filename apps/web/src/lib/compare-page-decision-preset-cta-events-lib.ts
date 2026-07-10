/**
 * Pure compare page decision panel preset analytics helpers.
 *
 * Maps rollout, fit, risk, and mitigation preset chip clicks to
 * privacy-light event names without embedding panel copy.
 */

export type ComparePageDecisionPanelId =
  | "rollout-readiness"
  | "operational-fit"
  | "deployment-risk"
  | "mitigation-priority";

export function comparePageDecisionPresetSurface(panel: ComparePageDecisionPanelId): string {
  return `compare-page-${panel}`;
}

export function comparePageDecisionPresetAnalyticsEvent(): string {
  return "compare_page_preset_select";
}

export function comparePageDecisionPresetAnalyticsData(
  panel: ComparePageDecisionPanelId,
  preset: string,
  compareCount: number,
) {
  return {
    surface: comparePageDecisionPresetSurface(panel),
    panel,
    preset,
    compareCount,
  };
}
