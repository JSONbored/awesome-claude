/**
 * Pure compare drawer decision panel preset analytics helpers.
 *
 * Maps rollout, fit, risk, and mitigation preset chip clicks to
 * privacy-light event names without embedding panel copy.
 */

export type CompareDrawerDecisionPanelId =
  | "rollout-readiness"
  | "operational-fit"
  | "deployment-risk"
  | "mitigation-priority";

export function compareDrawerDecisionPresetSurface(panel: CompareDrawerDecisionPanelId): string {
  return `compare-drawer-${panel}`;
}

export function compareDrawerDecisionPresetAnalyticsEvent(): string {
  return "compare_drawer_preset_select";
}

export function compareDrawerDecisionPresetAnalyticsData(
  panel: CompareDrawerDecisionPanelId,
  preset: string,
  compareCount: number,
) {
  return {
    surface: compareDrawerDecisionPresetSurface(panel),
    panel,
    preset,
    compareCount,
  };
}
