import { describe, expect, it } from "vitest";
import {
  BRIEF_HUB_SURFACE,
  BRIEF_ISSUE_SURFACE,
  briefEntryAnalyticsEvent,
  briefHubEntryAnalyticsData,
  briefHubIssueAnalyticsData,
  briefHubIssueAnalyticsEvent,
  briefHubLatestIssueAnalyticsData,
  briefHubLatestIssueAnalyticsEvent,
  briefHubStaticIssueAnalyticsData,
  briefHubStaticIssueAnalyticsEvent,
  briefIssueEntryAnalyticsData,
  briefIssueHubAnalyticsData,
  briefIssueHubAnalyticsEvent,
  parseBriefEntryRef,
  briefHubIssueDestination,
  briefIssueHubDestination,
} from "@/lib/brief-entry-cta-events-lib";

describe("brief entry cta events lib", () => {
  it("parses brief entry refs from paths and slugs", () => {
    expect(parseBriefEntryRef("mcp/browser")).toBe("mcp/browser");
    expect(parseBriefEntryRef("/entry/skills/demo")).toBe("skills/demo");
    expect(parseBriefEntryRef("https://heyclau.de/entry/agents/foo")).toBe(
      "agents/foo",
    );
    expect(parseBriefEntryRef("invalid")).toBeNull();
  });

  it("builds privacy-light brief hub entry egress analytics", () => {
    expect(briefEntryAnalyticsEvent()).toBe("brief_entry_click");
    expect(
      briefHubEntryAnalyticsData("mcp/browser", "new-entries", 0, 6),
    ).toEqual({
      entry: "mcp/browser",
      surface: BRIEF_HUB_SURFACE,
      sectionId: "new-entries",
      rowIndex: 0,
      rowCount: 6,
    });
  });

  it("builds privacy-light brief issue entry egress analytics", () => {
    expect(
      briefIssueEntryAnalyticsData("skills/demo", "sourceBacked", 2, 5, 12),
    ).toEqual({
      entry: "skills/demo",
      surface: BRIEF_ISSUE_SURFACE,
      sectionId: "sourceBacked",
      rowIndex: 2,
      rowCount: 5,
      issueNumber: 12,
    });
  });

  it("builds privacy-light brief hub and issue navigation analytics", () => {
    expect(briefIssueHubAnalyticsEvent()).toBe("brief_issue_hub_click");
    expect(briefIssueHubAnalyticsData(12, "breadcrumb")).toEqual({
      surface: BRIEF_ISSUE_SURFACE,
      issueNumber: 12,
      source: "breadcrumb",
    });
    expect(briefIssueHubAnalyticsData(null, "not-found")).toEqual({
      surface: BRIEF_ISSUE_SURFACE,
      issueNumber: null,
      source: "not-found",
    });
    expect(briefHubIssueAnalyticsEvent()).toBe("brief_hub_issue_click");
    expect(briefHubIssueAnalyticsData(8, 1, 12)).toEqual({
      surface: BRIEF_HUB_SURFACE,
      issueNumber: 8,
      rowIndex: 1,
      issueCount: 12,
    });
    expect(briefHubLatestIssueAnalyticsEvent()).toBe(
      "brief_hub_latest_issue_click",
    );
    expect(briefHubLatestIssueAnalyticsData(12, 18)).toEqual({
      surface: BRIEF_HUB_SURFACE,
      issueNumber: 12,
      entryCount: 18,
    });
    expect(briefHubStaticIssueAnalyticsEvent()).toBe(
      "brief_hub_static_issue_click",
    );
    expect(briefHubStaticIssueAnalyticsData(10, 2, 5)).toEqual({
      surface: BRIEF_HUB_SURFACE,
      issueNumber: 10,
      rowIndex: 2,
      issueCount: 5,
    });
  });

  it("maps brief hub and issue destinations", () => {
    expect(briefHubIssueDestination(12)).toEqual({
      to: "/brief/$number",
      params: { number: "12" },
    });
    expect(briefHubIssueDestination("")).toBeNull();
    expect(briefIssueHubDestination("brief")).toEqual({ to: "/brief" });
    expect(briefIssueHubDestination("unknown")).toBeNull();
  });
});
