import { describe, expect, it } from "vitest";
import {
  compareDecisionBriefEntryAnalyticsData,
  compareDecisionBriefEntryAnalyticsEvent,
  compareDeploymentRiskEntryAnalyticsData,
  compareDeploymentRiskEntryAnalyticsEvent,
  compareDrawerDecisionBriefSurface,
  compareDrawerEvidenceGapsSurface,
  compareEvidenceGapsEntryAnalyticsData,
  compareEvidenceGapsEntryAnalyticsEvent,
  compareMitigationPriorityEntryAnalyticsData,
  compareMitigationPriorityEntryAnalyticsEvent,
  compareOperationalFitEntryAnalyticsData,
  compareOperationalFitEntryAnalyticsEvent,
  comparePageDecisionBriefSurface,
  comparePageEvidenceGapsSurface,
  compareRolloutReadinessEntryAnalyticsData,
  compareRolloutReadinessEntryAnalyticsEvent,
  compareScenarioRankingEntryAnalyticsData,
  compareScenarioRankingEntryAnalyticsEvent,
  comparePanelEntryDestination,
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
    expect(compareRolloutReadinessEntryAnalyticsEvent()).toBe(
      "compare_rollout_readiness_entry_click",
    );
    expect(
      compareRolloutReadinessEntryAnalyticsData(
        "compare-page-rollout-readiness",
        "mcp/browser",
        "team",
        "review",
        76,
        1,
        3,
      ),
    ).toEqual({
      surface: "compare-page-rollout-readiness",
      entry: "mcp/browser",
      preset: "team",
      tier: "review",
      score: 76,
      blockerCount: 1,
      comparedCount: 3,
    });
    expect(compareOperationalFitEntryAnalyticsEvent()).toBe(
      "compare_operational_fit_entry_click",
    );
    expect(
      compareOperationalFitEntryAnalyticsData(
        "compare-drawer-operational-fit",
        "agents/foo",
        "rapid-adoption",
        "mixed",
        64,
        72,
        4,
      ),
    ).toEqual({
      surface: "compare-drawer-operational-fit",
      entry: "agents/foo",
      preset: "rapid-adoption",
      fitTone: "mixed",
      totalScore: 64,
      confidence: 72,
      comparedCount: 4,
    });
    expect(compareDeploymentRiskEntryAnalyticsEvent()).toBe(
      "compare_deployment_risk_entry_click",
    );
    expect(
      compareDeploymentRiskEntryAnalyticsData(
        "compare-page-deployment-risk",
        "hooks/bar",
        "security",
        "high",
        82,
        55,
        2,
      ),
    ).toEqual({
      surface: "compare-page-deployment-risk",
      entry: "hooks/bar",
      preset: "security",
      riskBand: "high",
      riskScore: 82,
      confidenceScore: 55,
      comparedCount: 2,
    });
    expect(compareMitigationPriorityEntryAnalyticsEvent()).toBe(
      "compare_mitigation_priority_entry_click",
    );
    expect(
      compareMitigationPriorityEntryAnalyticsData(
        "compare-drawer-mitigation-priority",
        "skills/baz",
        "security-first",
        "urgent",
        91,
        3,
        4,
      ),
    ).toEqual({
      surface: "compare-drawer-mitigation-priority",
      entry: "skills/baz",
      preset: "security-first",
      tier: "urgent",
      priorityScore: 91,
      actionCount: 3,
      comparedCount: 4,
    });
    expect(parseComparePanelEntryRef("mcp/browser")).toEqual({
      category: "mcp",
      slug: "browser",
    });
    expect(parseComparePanelEntryRef("invalid")).toBeNull();
    expect(comparePanelEntryDestination("mcp", "browser")).toEqual({
      to: "/entry/$category/$slug",
      params: { category: "mcp", slug: "browser" },
    });
    expect(comparePanelEntryDestination("", "browser")).toBeNull();
    expect(comparePanelEntryDestination("mcp", "")).toBeNull();
    expect(comparePageEvidenceGapsSurface()).toBe("compare-page-evidence-gaps");
    expect(compareDrawerEvidenceGapsSurface()).toBe(
      "compare-drawer-evidence-gaps",
    );
    expect(compareEvidenceGapsEntryAnalyticsEvent()).toBe(
      "compare_evidence_gaps_entry_click",
    );
    expect(
      compareEvidenceGapsEntryAnalyticsData(
        comparePageEvidenceGapsSurface(),
        "mcp/browser",
        3,
        4,
      ),
    ).toEqual({
      surface: "compare-page-evidence-gaps",
      entry: "mcp/browser",
      missingSignalCount: 3,
      comparedCount: 4,
    });
  });
});
