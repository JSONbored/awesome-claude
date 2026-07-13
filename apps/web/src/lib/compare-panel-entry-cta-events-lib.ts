/**
 * Pure compare decision brief and scenario ranking entry egress analytics helpers.
 *
 * Maps compare panel entry navigation to privacy-light event names without
 * embedding entry titles, recommendations, or rationale copy.
 */

import type { CompareBriefTone } from "@/lib/compare-decision-brief-lib";
import type { CompareScenarioId } from "@/lib/compare-scenario-ranking-lib";

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
