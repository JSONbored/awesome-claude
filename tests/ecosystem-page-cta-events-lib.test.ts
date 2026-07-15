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
  ecosystemMatrixCellAnalyticsData,
  ecosystemMatrixCellAnalyticsEvent,
  ecosystemMatrixClientFocusAnalyticsData,
  ecosystemMatrixClientFocusAnalyticsEvent,
  ecosystemMatrixCsvAnalyticsData,
  ecosystemMatrixCsvAnalyticsEvent,
  ecosystemMatrixDocAnalyticsData,
  ecosystemMatrixDocAnalyticsEvent,
  ecosystemMatrixFocusClearAnalyticsData,
  ecosystemMatrixFocusClearAnalyticsEvent,
  ecosystemMatrixSupportFocusAnalyticsData,
  ecosystemMatrixSupportFocusAnalyticsEvent,
  ecosystemFeedPathAnalyticsData,
  ecosystemFeedPathAnalyticsEvent,
  ecosystemSetupClientAnalyticsData,
  ecosystemSetupClientAnalyticsEvent,
  ecosystemSetupDocAnalyticsData,
  ecosystemSetupDocAnalyticsEvent,
  ecosystemQuickStartCopyAnalyticsData,
  ecosystemQuickStartCopyAnalyticsEvent,
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

  it("builds ecosystem compatibility matrix analytics", () => {
    expect(ecosystemMatrixCellAnalyticsEvent()).toBe(
      "ecosystem_matrix_cell_click",
    );
    expect(
      ecosystemMatrixCellAnalyticsData("cursor", "native", 1, 3, 7, 7),
    ).toEqual({
      surface: ECOSYSTEM_PAGE_SURFACE,
      clientId: "cursor",
      support: "native",
      rowIndex: 1,
      columnIndex: 3,
      capabilityCount: 7,
      clientCount: 7,
    });
    expect(ecosystemMatrixClientFocusAnalyticsEvent()).toBe(
      "ecosystem_matrix_client_focus_click",
    );
    expect(ecosystemMatrixClientFocusAnalyticsData("web", true, 7)).toEqual({
      surface: ECOSYSTEM_PAGE_SURFACE,
      clientId: "web",
      active: true,
      clientCount: 7,
    });
    expect(ecosystemMatrixSupportFocusAnalyticsEvent()).toBe(
      "ecosystem_matrix_support_focus_click",
    );
    expect(
      ecosystemMatrixSupportFocusAnalyticsData("adapter", true, 7),
    ).toEqual({
      surface: ECOSYSTEM_PAGE_SURFACE,
      support: "adapter",
      active: true,
      clientCount: 7,
    });
    expect(ecosystemMatrixFocusClearAnalyticsEvent()).toBe(
      "ecosystem_matrix_focus_clear_click",
    );
    expect(ecosystemMatrixFocusClearAnalyticsData(true, false)).toEqual({
      surface: ECOSYSTEM_PAGE_SURFACE,
      hadClientFocus: true,
      hadSupportFocus: false,
    });
    expect(ecosystemMatrixCsvAnalyticsEvent()).toBe(
      "ecosystem_matrix_csv_click",
    );
    expect(ecosystemMatrixCsvAnalyticsData(7, 7)).toEqual({
      surface: ECOSYSTEM_PAGE_SURFACE,
      capabilityCount: 7,
      clientCount: 7,
    });
    expect(ecosystemMatrixDocAnalyticsEvent()).toBe(
      "ecosystem_matrix_doc_click",
    );
    expect(ecosystemMatrixDocAnalyticsData("cursor", "native", 2, 4)).toEqual({
      surface: ECOSYSTEM_PAGE_SURFACE,
      clientId: "cursor",
      support: "native",
      rowIndex: 2,
      columnIndex: 4,
    });
  });

  it("builds ecosystem setup and feed navigation analytics", () => {
    expect(ecosystemSetupClientAnalyticsEvent()).toBe(
      "ecosystem_setup_client_click",
    );
    expect(
      ecosystemSetupClientAnalyticsData("cursor", "mcp-host", 2, 9),
    ).toEqual({
      surface: ECOSYSTEM_PAGE_SURFACE,
      clientId: "cursor",
      surfaceType: "mcp-host",
      rowIndex: 2,
      clientCount: 9,
    });
    expect(ecosystemSetupDocAnalyticsEvent()).toBe("ecosystem_setup_doc_click");
    expect(ecosystemSetupDocAnalyticsData("web", "web", "internal")).toEqual({
      surface: ECOSYSTEM_PAGE_SURFACE,
      clientId: "web",
      surfaceType: "web",
      destination: "internal",
    });
    expect(ecosystemFeedPathAnalyticsEvent()).toBe("ecosystem_feed_path_click");
    expect(
      ecosystemFeedPathAnalyticsData("ecosystem-feed.json", "json", 0, 6),
    ).toEqual({
      surface: ECOSYSTEM_PAGE_SURFACE,
      feedKey: "ecosystem-feed.json",
      contentType: "json",
      rowIndex: 0,
      feedCount: 6,
    });
    expect(ecosystemQuickStartCopyAnalyticsEvent()).toBe(
      "ecosystem_quick_start_copy_click",
    );
    expect(ecosystemQuickStartCopyAnalyticsData("mcp-run", 1, 3)).toEqual({
      surface: ECOSYSTEM_PAGE_SURFACE,
      action: "mcp-run",
      rowIndex: 1,
      quickStartCount: 3,
    });
  });
});
