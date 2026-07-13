/**
 * Pure entry detail decision panel preset analytics helpers.
 *
 * Maps adoption/evidence/timeline/benchmark preset chip clicks to
 * privacy-light event names without embedding panel copy.
 */

import type { CompareBenchmarkPresetId } from "@/lib/entry-compare-benchmark-lib";
import type { CompareBenchmarkVerdict } from "@/lib/entry-compare-benchmark-lib";

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

export function detailCompareBenchmarkEntryAnalyticsEvent(): string {
  return "detail_compare_benchmark_entry_click";
}

export function detailCompareBenchmarkEntryAnalyticsData(
  fromCategory: string,
  fromSlug: string,
  peerEntryRef: string,
  preset: CompareBenchmarkPresetId,
  verdict: CompareBenchmarkVerdict,
  totalScore: number,
  delta: number,
  peerCount: number,
) {
  return {
    entry: detailDecisionPresetEntryKey(fromCategory, fromSlug),
    surface: detailDecisionPresetSurface("compare-benchmark"),
    peer: peerEntryRef,
    preset,
    verdict,
    totalScore,
    delta,
    peerCount,
  };
}

export function parseDetailEntryRef(entryRef: string): { category: string; slug: string } | null {
  const slash = entryRef.indexOf("/");
  if (slash <= 0 || slash >= entryRef.length - 1) {
    return null;
  }
  return {
    category: entryRef.slice(0, slash),
    slug: entryRef.slice(slash + 1),
  };
}
