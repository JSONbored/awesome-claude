import { describe, expect, it } from "vitest";
import {
  BRIEF_HUB_SURFACE,
  BRIEF_ISSUE_SURFACE,
  briefEntryAnalyticsEvent,
  briefHubEntryAnalyticsData,
  briefIssueEntryAnalyticsData,
  parseBriefEntryRef,
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
});
