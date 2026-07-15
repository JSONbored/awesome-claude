import { describe, expect, it } from "vitest";
import {
  ECOSYSTEM_PAGE_SURFACE,
  ecosystemApiDocsAnalyticsData,
  ecosystemApiDocsAnalyticsEvent,
  ecosystemHarnessBrowseAnalyticsData,
  ecosystemHarnessBrowseAnalyticsEvent,
  ecosystemIntegrationCardAnalyticsData,
  ecosystemIntegrationCardAnalyticsEvent,
  ecosystemKindFilterAnalyticsData,
  ecosystemKindFilterAnalyticsEvent,
  ecosystemSectionAnalyticsData,
  ecosystemSectionAnalyticsEvent,
} from "@/lib/ecosystem-page-cta-events-lib";

describe("ecosystem page cta events lib", () => {
  it("builds ecosystem page API docs and section navigation analytics", () => {
    expect(ecosystemApiDocsAnalyticsEvent()).toBe("ecosystem_api_docs_click");
    expect(ecosystemApiDocsAnalyticsData(6, 4)).toEqual({
      surface: ECOSYSTEM_PAGE_SURFACE,
      integrationCount: 6,
      liveIntegrationCount: 4,
    });
    expect(ecosystemSectionAnalyticsEvent()).toBe("ecosystem_section_click");
    expect(ecosystemSectionAnalyticsData("coverage", 2, 6)).toEqual({
      surface: ECOSYSTEM_PAGE_SURFACE,
      sectionId: "coverage",
      rowIndex: 2,
      sectionCount: 6,
    });
  });

  it("builds ecosystem integrations grid navigation analytics", () => {
    expect(ecosystemKindFilterAnalyticsEvent()).toBe(
      "ecosystem_kind_filter_click",
    );
    expect(ecosystemKindFilterAnalyticsData("mcp-server", 2)).toEqual({
      surface: ECOSYSTEM_PAGE_SURFACE,
      kindFilter: "mcp-server",
      matchCount: 2,
    });
    expect(ecosystemIntegrationCardAnalyticsEvent()).toBe(
      "ecosystem_integration_card_click",
    );
    expect(
      ecosystemIntegrationCardAnalyticsData(
        "raycast",
        0,
        6,
        "all",
        "live",
        "extension",
      ),
    ).toEqual({
      surface: ECOSYSTEM_PAGE_SURFACE,
      integrationSlug: "raycast",
      rowIndex: 0,
      visibleCount: 6,
      kindFilter: "all",
      status: "live",
      kind: "extension",
    });
  });

  it("builds ecosystem harness browse analytics", () => {
    expect(ecosystemHarnessBrowseAnalyticsEvent()).toBe(
      "ecosystem_harness_browse_click",
    );
    expect(
      ecosystemHarnessBrowseAnalyticsData("cursor", 420, 31, 3, 7),
    ).toEqual({
      surface: ECOSYSTEM_PAGE_SURFACE,
      platformId: "cursor",
      entryCount: 420,
      coveragePct: 31,
      rowIndex: 3,
      harnessCount: 7,
    });
  });
});
