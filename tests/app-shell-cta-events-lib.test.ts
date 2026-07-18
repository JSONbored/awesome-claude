import { describe, expect, it } from "vitest";
import {
  APP_SHELL_SURFACE,
  appShellCategoryAnalyticsData,
  appShellCategoryAnalyticsEvent,
  appShellCategoryDestination,
  appShellFeedChipAnalyticsData,
  appShellFeedChipAnalyticsEvent,
  appShellFeedChipHrefDestination,
  appShellFooterLinkAnalyticsData,
  appShellFooterLinkAnalyticsEvent,
  appShellHeaderAnalyticsData,
  appShellHeaderAnalyticsEvent,
  appShellHeaderSubmitDestination,
  appShellLegalAnalyticsData,
  appShellLegalAnalyticsEvent,
  appShellLegalRouteDestination,
  appShellNavAnalyticsData,
  appShellNavAnalyticsEvent,
  appShellNavRouteDestination,
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
    expect(appShellHeaderAnalyticsData("menu")).toEqual({
      surface: APP_SHELL_SURFACE,
      action: "menu",
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

  it("maps app shell header submit destination", () => {
    expect(appShellHeaderSubmitDestination("submit")).toEqual({
      to: "/submit",
    });
    expect(appShellHeaderSubmitDestination("")).toBeNull();
    expect(appShellHeaderSubmitDestination("unknown")).toBeNull();
  });

  it("maps app shell legal route destinations", () => {
    expect(appShellLegalRouteDestination("legal")).toEqual({ to: "/legal" });
    expect(appShellLegalRouteDestination("privacy")).toEqual({
      to: "/legal",
      hash: "privacy",
    });
    expect(appShellLegalRouteDestination("")).toBeNull();
    expect(appShellLegalRouteDestination("unknown")).toBeNull();
  });

  it("maps app shell feed chip href destinations", () => {
    expect(appShellFeedChipHrefDestination("rss")).toEqual({
      href: "/feed.xml",
    });
    expect(appShellFeedChipHrefDestination("atom")).toEqual({
      href: "/atom.xml",
    });
    expect(appShellFeedChipHrefDestination("json")).toEqual({
      href: "/data/feeds/index.json",
    });
    expect(appShellFeedChipHrefDestination("llms")).toEqual({
      href: "/llms.txt",
    });
    expect(appShellFeedChipHrefDestination("")).toBeNull();
    expect(appShellFeedChipHrefDestination("unknown")).toBeNull();
  });

  it("maps app shell category destinations", () => {
    expect(appShellCategoryDestination("mcp")).toEqual({
      to: "/$category",
      params: { category: "mcp" },
    });
    expect(appShellCategoryDestination("")).toBeNull();
    expect(appShellCategoryDestination("   ")).toBeNull();
  });

  it("maps app shell nav route destinations", () => {
    expect(appShellNavRouteDestination("/browse")).toEqual({ to: "/browse" });
    expect(appShellNavRouteDestination("/trending")).toEqual({
      to: "/trending",
    });
    expect(appShellNavRouteDestination("/best")).toEqual({ to: "/best" });
    expect(appShellNavRouteDestination("/quality")).toEqual({ to: "/quality" });
    expect(appShellNavRouteDestination("/ecosystem")).toEqual({
      to: "/ecosystem",
    });
    expect(appShellNavRouteDestination("/jobs")).toEqual({ to: "/jobs" });
    expect(appShellNavRouteDestination("/tags")).toEqual({ to: "/tags" });
    expect(appShellNavRouteDestination("/for")).toEqual({ to: "/for" });
    expect(appShellNavRouteDestination("/compare")).toEqual({ to: "/compare" });
    expect(appShellNavRouteDestination("/validators")).toEqual({
      to: "/validators",
    });
    expect(appShellNavRouteDestination("/state-of-claude-tooling")).toEqual({
      to: "/state-of-claude-tooling",
    });
    expect(appShellNavRouteDestination("/integrations")).toEqual({
      to: "/integrations",
    });
    expect(appShellNavRouteDestination("/integrations/mcp-server")).toEqual({
      to: "/integrations/$slug",
      params: { slug: "mcp-server" },
    });
    expect(appShellNavRouteDestination("/api-docs")).toEqual({
      to: "/api-docs",
    });
    expect(appShellNavRouteDestination("/feeds")).toEqual({ to: "/feeds" });
    expect(appShellNavRouteDestination("/submit")).toEqual({ to: "/submit" });
    expect(appShellNavRouteDestination("/claim")).toEqual({ to: "/claim" });
    expect(appShellNavRouteDestination("/contributors")).toEqual({
      to: "/contributors",
    });
    expect(appShellNavRouteDestination("/about")).toEqual({ to: "/about" });
    expect(appShellNavRouteDestination("/changelog")).toEqual({
      to: "/changelog",
    });
    expect(appShellNavRouteDestination("/brief")).toEqual({ to: "/brief" });
    expect(appShellNavRouteDestination("/advertise")).toEqual({
      to: "/advertise",
    });
    expect(appShellNavRouteDestination("/subscriptions")).toEqual({
      to: "/subscriptions",
    });
    expect(appShellNavRouteDestination("")).toBeNull();
    expect(appShellNavRouteDestination("/unknown")).toBeNull();
  });
});
