/**
 * Pure compare page scenario ranking analytics helpers.
 *
 * Maps scenario preset chip clicks to privacy-light event names without
 * embedding ranking copy or entry titles.
 */

import type { CompareScenarioId } from "@/lib/compare-scenario-ranking-lib";

export function comparePageScenarioSurface(): string {
  return "compare-page-scenario-ranking";
}

export function comparePageScenarioAnalyticsEvent(): string {
  return "compare_page_scenario_select";
}

export function comparePageScenarioAnalyticsData(
  scenario: CompareScenarioId,
  compareCount: number,
) {
  return {
    surface: comparePageScenarioSurface(),
    scenario,
    compareCount,
  };
}
