import { describe, expect, it } from "vitest";
import {
  CONTRIBUTOR_PROFILE_SURFACE,
  QUALITY_QUEUE_SURFACE,
  STATE_REPORT_SURFACE,
  VALIDATORS_ATTENTION_SURFACE,
  VALIDATORS_RECENT_REVIEWED_SURFACE,
  contributorProfileEntryAnalyticsData,
  contributorProfileEntryAnalyticsEvent,
  insightsPageEntryDestination,
  qualityQueueEntryAnalyticsData,
  qualityQueueEntryAnalyticsEvent,
  stateReportEntryAnalyticsData,
  stateReportEntryAnalyticsEvent,
  validatorsAttentionEntryAnalyticsData,
  validatorsAttentionEntryAnalyticsEvent,
  validatorsRecentReviewedEntryAnalyticsData,
  validatorsRecentReviewedEntryAnalyticsEvent,
} from "@/lib/insights-page-entry-cta-events-lib";

describe("insights page entry cta events lib", () => {
  it("builds privacy-light contributor profile entry egress analytics", () => {
    expect(contributorProfileEntryAnalyticsEvent()).toBe(
      "contributor_profile_entry_click",
    );
    expect(
      contributorProfileEntryAnalyticsData(
        "mcp",
        "browser",
        "alice",
        "submitted-authored",
        1,
        4,
      ),
    ).toEqual({
      entry: "mcp/browser",
      surface: CONTRIBUTOR_PROFILE_SURFACE,
      contributorSlug: "alice",
      role: "submitted-authored",
      rowIndex: 1,
      rowCount: 4,
    });
  });

  it("builds privacy-light quality queue entry egress analytics", () => {
    expect(qualityQueueEntryAnalyticsEvent()).toBe("quality_queue_entry_click");
    expect(
      qualityQueueEntryAnalyticsData(
        "skills",
        "demo",
        "improvement",
        42,
        0,
        10,
      ),
    ).toEqual({
      entry: "skills/demo",
      surface: QUALITY_QUEUE_SURFACE,
      queueId: "improvement",
      score: 42,
      rowIndex: 0,
      rowCount: 10,
    });
  });

  it("builds privacy-light validators entry egress analytics", () => {
    expect(validatorsAttentionEntryAnalyticsEvent()).toBe(
      "validators_attention_entry_click",
    );
    expect(
      validatorsAttentionEntryAnalyticsData("agents", "foo", "MCP", 2, 5),
    ).toEqual({
      entry: "agents/foo",
      surface: VALIDATORS_ATTENTION_SURFACE,
      expertiseId: "MCP",
      rowIndex: 2,
      rowCount: 5,
    });
    expect(validatorsRecentReviewedEntryAnalyticsEvent()).toBe(
      "validators_recent_reviewed_entry_click",
    );
    expect(
      validatorsRecentReviewedEntryAnalyticsData("hooks", "bar", 3, 12),
    ).toEqual({
      entry: "hooks/bar",
      surface: VALIDATORS_RECENT_REVIEWED_SURFACE,
      rowIndex: 3,
      rowCount: 12,
    });
  });

  it("builds privacy-light state report entry egress analytics", () => {
    expect(stateReportEntryAnalyticsEvent()).toBe("state_report_entry_click");
    expect(
      stateReportEntryAnalyticsData("mcp", "browser", "mcp-servers", 0, 10),
    ).toEqual({
      entry: "mcp/browser",
      surface: STATE_REPORT_SURFACE,
      reportId: "mcp-servers",
      rowIndex: 0,
      rowCount: 10,
    });
  });

  it("maps insights page entry destinations", () => {
    expect(insightsPageEntryDestination("mcp", "browser")).toEqual({
      to: "/entry/$category/$slug",
      params: { category: "mcp", slug: "browser" },
    });
    expect(insightsPageEntryDestination("", "browser")).toBeNull();
    expect(insightsPageEntryDestination("mcp", "")).toBeNull();
  });
});
