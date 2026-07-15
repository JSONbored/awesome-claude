import { describe, expect, it } from "vitest";
import {
  TOOLS_PAGE_SURFACE,
  toolsPageBrowseAnalyticsData,
  toolsPageBrowseAnalyticsEvent,
  toolsPageSubmitAnalyticsData,
  toolsPageSubmitAnalyticsEvent,
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
});
