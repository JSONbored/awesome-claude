/**
 * Pure compare decision brief and scenario ranking entry egress analytics helpers.
 *
 * Maps compare panel entry navigation to privacy-light event names without
 * embedding entry titles, recommendations, or rationale copy.
 */

import type { CompareBriefTone } from "@/lib/compare-decision-brief-lib";
import type { DeploymentRiskBand } from "@/lib/compare-deployment-risk-map-lib";
import type { MitigationPriorityTier } from "@/lib/compare-mitigation-priority-lib";
import type { OperationalFitTone } from "@/lib/compare-operational-fit-heatmap-lib";
import type { RolloutPresetId } from "@/lib/compare-rollout-readiness-lib";
import type { CompareScenarioId } from "@/lib/compare-scenario-ranking-lib";
import type { DeploymentRiskPresetId } from "@/lib/compare-deployment-risk-map-lib";
import type { MitigationPriorityPresetId } from "@/lib/compare-mitigation-priority-lib";
import type { OperationalFitPresetId } from "@/lib/compare-operational-fit-heatmap-lib";

export function comparePageDecisionBriefSurface(): string {
  return "compare-page-decision-brief";
}

export function compareDrawerDecisionBriefSurface(): string {
  return "compare-drawer-decision-brief";
}

export function compareDecisionBriefEntryAnalyticsEvent(): string {
  return "compare_decision_brief_entry_click";
}

export function compareDecisionBriefEntryAnalyticsData(
  surface: string,
  entryRef: string,
  rank: number,
  tone: CompareBriefTone,
  score: number,
  comparedCount: number,
) {
  return {
    surface,
    entry: entryRef,
    rank,
    tone,
    score,
    comparedCount,
  };
}

export function compareScenarioRankingEntryAnalyticsEvent(): string {
  return "compare_scenario_ranking_entry_click";
}

export function compareScenarioRankingEntryAnalyticsData(
  surface: string,
  entryRef: string,
  rank: number,
  score: number,
  scenario: CompareScenarioId,
  comparedCount: number,
) {
  return {
    surface,
    entry: entryRef,
    rank,
    score,
    scenario,
    comparedCount,
  };
}

export function compareRolloutReadinessEntryAnalyticsEvent(): string {
  return "compare_rollout_readiness_entry_click";
}

export function compareRolloutReadinessEntryAnalyticsData(
  surface: string,
  entryRef: string,
  preset: RolloutPresetId,
  tier: "ready" | "review" | "hold",
  score: number,
  blockerCount: number,
  comparedCount: number,
) {
  return {
    surface,
    entry: entryRef,
    preset,
    tier,
    score,
    blockerCount,
    comparedCount,
  };
}

export function compareOperationalFitEntryAnalyticsEvent(): string {
  return "compare_operational_fit_entry_click";
}

export function compareOperationalFitEntryAnalyticsData(
  surface: string,
  entryRef: string,
  preset: OperationalFitPresetId,
  fitTone: OperationalFitTone,
  totalScore: number,
  confidence: number,
  comparedCount: number,
) {
  return {
    surface,
    entry: entryRef,
    preset,
    fitTone,
    totalScore,
    confidence,
    comparedCount,
  };
}

export function compareDeploymentRiskEntryAnalyticsEvent(): string {
  return "compare_deployment_risk_entry_click";
}

export function compareDeploymentRiskEntryAnalyticsData(
  surface: string,
  entryRef: string,
  preset: DeploymentRiskPresetId,
  riskBand: DeploymentRiskBand,
  riskScore: number,
  confidenceScore: number,
  comparedCount: number,
) {
  return {
    surface,
    entry: entryRef,
    preset,
    riskBand,
    riskScore,
    confidenceScore,
    comparedCount,
  };
}

export function compareMitigationPriorityEntryAnalyticsEvent(): string {
  return "compare_mitigation_priority_entry_click";
}

export function compareMitigationPriorityEntryAnalyticsData(
  surface: string,
  entryRef: string,
  preset: MitigationPriorityPresetId,
  tier: MitigationPriorityTier,
  priorityScore: number,
  actionCount: number,
  comparedCount: number,
) {
  return {
    surface,
    entry: entryRef,
    preset,
    tier,
    priorityScore,
    actionCount,
    comparedCount,
  };
}

export function comparePageEvidenceGapsSurface(): string {
  return "compare-page-evidence-gaps";
}

export function compareDrawerEvidenceGapsSurface(): string {
  return "compare-drawer-evidence-gaps";
}

export function compareEvidenceGapsEntryAnalyticsEvent(): string {
  return "compare_evidence_gaps_entry_click";
}

export function compareEvidenceGapsEntryAnalyticsData(
  surface: string,
  entryRef: string,
  missingSignalCount: number,
  comparedCount: number,
) {
  return {
    surface,
    entry: entryRef,
    missingSignalCount,
    comparedCount,
  };
}

export function parseComparePanelEntryRef(
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

export type ComparePanelEntryDestination = {
  to: "/entry/$category/$slug";
  params: { category: string; slug: string };
};

/** Map a compare panel entry ref to an entry detail destination. */
export function comparePanelEntryDestination(
  category: string,
  slug: string,
): ComparePanelEntryDestination | null {
  const categoryId = category.trim();
  const entrySlug = slug.trim();
  switch (categoryId) {
    case "":
      return null;
    default:
      switch (entrySlug) {
        case "":
          return null;
        default:
          return {
            to: "/entry/$category/$slug",
            params: { category: categoryId, slug: entrySlug },
          };
      }
  }
}
