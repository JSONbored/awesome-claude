import { describe, expect, it } from "vitest";
import {
  compareDecisionBriefEntryAnalyticsData,
  compareDecisionBriefEntryAnalyticsEvent,
  compareDrawerDecisionBriefSurface,
  comparePageDecisionBriefSurface,
  compareScenarioRankingEntryAnalyticsData,
  compareScenarioRankingEntryAnalyticsEvent,
  parseComparePanelEntryRef,
} from "@/lib/compare-panel-entry-cta-events-lib";

describe("compare panel entry cta events lib", () => {
  it("builds privacy-light compare panel entry analytics payloads", () => {
    expect(comparePageDecisionBriefSurface()).toBe(
      "compare-page-decision-brief",
    );
    expect(compareDrawerDecisionBriefSurface()).toBe(
      "compare-drawer-decision-brief",
    );
    expect(compareDecisionBriefEntryAnalyticsEvent()).toBe(
      "compare_decision_brief_entry_click",
    );
    expect(
      compareDecisionBriefEntryAnalyticsData(
        comparePageDecisionBriefSurface(),
        "mcp/browser",
        1,
        "ready",
        88,
        3,
      ),
    ).toEqual({
      surface: "compare-page-decision-brief",
      entry: "mcp/browser",
      rank: 1,
      tone: "ready",
      score: 88,
      comparedCount: 3,
    });
    expect(compareScenarioRankingEntryAnalyticsEvent()).toBe(
      "compare_scenario_ranking_entry_click",
    );
    expect(
      compareScenarioRankingEntryAnalyticsData(
        "compare-drawer-scenario-ranking",
        "agents/foo",
        2,
        71,
        "safety-first",
        4,
      ),
    ).toEqual({
      surface: "compare-drawer-scenario-ranking",
      entry: "agents/foo",
      rank: 2,
      score: 71,
      scenario: "safety-first",
      comparedCount: 4,
    });
    expect(parseComparePanelEntryRef("mcp/browser")).toEqual({
      category: "mcp",
      slug: "browser",
    });
    expect(parseComparePanelEntryRef("invalid")).toBeNull();
  });
});
