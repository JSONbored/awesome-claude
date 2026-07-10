/**
 * Pure compare drawer scenario ranking analytics helpers.
 *
 * Maps scenario preset chip clicks to privacy-light event names without
 * embedding ranking copy or entry titles.
 */

import type { CompareScenarioId } from "@/lib/compare-scenario-ranking-lib";

export function compareDrawerScenarioSurface(): string {
  return "compare-drawer-scenario-ranking";
}

export function compareDrawerScenarioAnalyticsEvent(): string {
  return "compare_drawer_scenario_select";
}

export function compareDrawerScenarioAnalyticsData(
  scenario: CompareScenarioId,
  compareCount: number,
) {
  return {
    surface: compareDrawerScenarioSurface(),
    scenario,
    compareCount,
  };
}
