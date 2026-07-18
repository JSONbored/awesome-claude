import { describe, expect, it } from "vitest";
import {
  TOOLS_PAGE_SURFACE,
  toolsPageBrowseAnalyticsData,
  toolsPageBrowseAnalyticsEvent,
  toolsPageChromeDestination,
  toolsPageSubmitAnalyticsData,
  toolsPageSubmitAnalyticsEvent,
  toolsPageTagAnalyticsData,
  toolsPageTagAnalyticsEvent,
  toolsPageTagDestination,
} from "@/lib/tools-page-cta-events-lib";

describe("tools page cta events lib", () => {
  it("builds tools page browse egress analytics", () => {
    expect(toolsPageBrowseAnalyticsEvent()).toBe("tools_page_browse_click");
    expect(toolsPageBrowseAnalyticsData(18)).toEqual({
      surface: TOOLS_PAGE_SURFACE,
      toolCount: 18,
    });
  });

  it("builds tools page submit CTA analytics", () => {
    expect(toolsPageSubmitAnalyticsEvent()).toBe("tools_page_submit_click");
    expect(toolsPageSubmitAnalyticsData(18)).toEqual({
      surface: TOOLS_PAGE_SURFACE,
      toolCount: 18,
    });
  });

  it("maps tools page chrome and tag destinations", () => {
    expect(toolsPageChromeDestination("browse")).toEqual({ to: "/browse" });
    expect(toolsPageChromeDestination("submit")).toEqual({
      to: "/tools/submit",
    });
    expect(toolsPageChromeDestination("unknown")).toBeNull();
    expect(toolsPageTagAnalyticsEvent()).toBe("tools_page_tag_click");
    expect(toolsPageTagAnalyticsData("mcp", "cursor", 18)).toEqual({
      surface: TOOLS_PAGE_SURFACE,
      tagSlug: "mcp",
      toolSlug: "cursor",
      toolCount: 18,
    });
    expect(toolsPageTagDestination("MCP Servers")).toEqual({
      to: "/tags/$tag",
      params: { tag: "mcp-servers" },
    });
    expect(toolsPageTagDestination("   ")).toBeNull();
  });
});
