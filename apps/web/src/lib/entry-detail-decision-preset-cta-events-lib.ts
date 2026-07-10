/**
 * Pure entry detail decision panel preset analytics helpers.
 *
 * Maps adoption/evidence/timeline/benchmark preset chip clicks to
 * privacy-light event names without embedding panel copy.
 */

export type DetailDecisionPanelId =
  | "adoption-plan"
  | "evidence-matrix"
  | "decision-timeline"
  | "compare-benchmark";

export function detailDecisionPresetEntryKey(category: string, slug: string): string {
  return `${category}/${slug}`;
}

export function detailDecisionPresetSurface(panel: DetailDecisionPanelId): string {
  return `detail-${panel}`;
}

export function detailDecisionPresetAnalyticsEvent(): string {
  return "detail_decision_preset_select";
}

export function detailDecisionPresetAnalyticsData(
  category: string,
  slug: string,
  panel: DetailDecisionPanelId,
  preset: string,
) {
  return {
    entry: detailDecisionPresetEntryKey(category, slug),
    surface: detailDecisionPresetSurface(panel),
    panel,
    preset,
  };
}
