import { describe, expect, it } from "vitest";
import {
  APP_SHELL_SURFACE,
  appShellCategoryAnalyticsData,
  appShellCategoryAnalyticsEvent,
  appShellFeedChipAnalyticsData,
  appShellFeedChipAnalyticsEvent,
  appShellFooterLinkAnalyticsData,
  appShellFooterLinkAnalyticsEvent,
  appShellHeaderAnalyticsData,
  appShellHeaderAnalyticsEvent,
  appShellLegalAnalyticsData,
  appShellLegalAnalyticsEvent,
  appShellNavAnalyticsData,
  appShellNavAnalyticsEvent,
} from "@/lib/app-shell-cta-events-lib";

describe("app shell cta events lib", () => {
  it("builds app shell navigation analytics", () => {
    expect(appShellNavAnalyticsEvent()).toBe("app_shell_nav_click");
    expect(appShellNavAnalyticsData("/browse", "desktop")).toEqual({
      surface: APP_SHELL_SURFACE,
      destination: "/browse",
      source: "desktop",
      sectionId: null,
    });
    expect(appShellNavAnalyticsData("/feeds", "mobile", "api-mcp")).toEqual({
      surface: APP_SHELL_SURFACE,
      destination: "/feeds",
      source: "mobile",
      sectionId: "api-mcp",
    });
    expect(appShellHeaderAnalyticsEvent()).toBe("app_shell_header_click");
    expect(appShellHeaderAnalyticsData("submit")).toEqual({
      surface: APP_SHELL_SURFACE,
      action: "submit",
    });
    expect(appShellFeedChipAnalyticsEvent()).toBe("app_shell_feed_chip_click");
    expect(appShellFeedChipAnalyticsData("llms")).toEqual({
      surface: APP_SHELL_SURFACE,
      feed: "llms",
    });
    expect(appShellFooterLinkAnalyticsEvent()).toBe(
      "app_shell_footer_link_click",
    );
    expect(appShellFooterLinkAnalyticsData("product", "/trending")).toEqual({
      surface: APP_SHELL_SURFACE,
      columnId: "product",
      destination: "/trending",
    });
    expect(appShellCategoryAnalyticsEvent()).toBe("app_shell_category_click");
    expect(appShellCategoryAnalyticsData("mcp", 2, 9)).toEqual({
      surface: APP_SHELL_SURFACE,
      category: "mcp",
      rowIndex: 2,
      categoryCount: 9,
    });
    expect(appShellLegalAnalyticsEvent()).toBe("app_shell_legal_click");
    expect(appShellLegalAnalyticsData("privacy")).toEqual({
      surface: APP_SHELL_SURFACE,
      destination: "privacy",
    });
  });
});
