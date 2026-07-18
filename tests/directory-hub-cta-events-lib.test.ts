import { describe, expect, it } from "vitest";
import {
  BEST_INDEX_SURFACE,
  CATEGORY_HUB_NOTFOUND_SURFACE,
  CATEGORY_HUB_SURFACE,
  PLATFORM_CATEGORY_NOTFOUND_SURFACE,
  PLATFORM_CATEGORY_SURFACE,
  PLATFORM_HUB_NOTFOUND_SURFACE,
  PLATFORM_HUB_SURFACE,
  PLATFORM_INDEX_SURFACE,
  bestIndexListAnalyticsData,
  bestIndexListAnalyticsEvent,
  bestIndexListDestination,
  categoryHubBrowseAnalyticsData,
  categoryHubBrowseAnalyticsEvent,
  categoryHubBrowseDestination,
  categoryHubNotFoundEgressAnalyticsData,
  categoryHubNotFoundEgressAnalyticsEvent,
  categoryHubNotFoundEgressDestination,
  categoryHubSeeAllAnalyticsData,
  categoryHubSeeAllAnalyticsEvent,
  categoryHubSeeAllDestination,
  platformCategoryCategoryAnalyticsData,
  platformCategoryCategoryAnalyticsEvent,
  platformCategoryCategoryDestination,
  platformCategoryNotFoundEgressAnalyticsData,
  platformCategoryNotFoundEgressAnalyticsEvent,
  platformCategoryNotFoundEgressDestination,
  platformCategoryPlatformAnalyticsData,
  platformCategoryPlatformAnalyticsEvent,
  platformCategoryPlatformDestination,
  platformHubBrowseAnalyticsData,
  platformHubBrowseAnalyticsEvent,
  platformHubBrowseDestination,
  platformHubNotFoundEgressAnalyticsData,
  platformHubNotFoundEgressAnalyticsEvent,
  platformHubNotFoundEgressDestination,
  platformHubSectionAnalyticsData,
  platformHubSectionAnalyticsEvent,
  platformHubSectionDestination,
  platformIndexSelectAnalyticsData,
  platformIndexSelectAnalyticsEvent,
  platformIndexSelectDestination,
} from "@/lib/directory-hub-cta-events-lib";

describe("directory hub cta events lib", () => {
  it("builds category hub navigation analytics", () => {
    expect(categoryHubBrowseAnalyticsEvent()).toBe("category_hub_browse_click");
    expect(categoryHubBrowseAnalyticsData("mcp", 42)).toEqual({
      surface: CATEGORY_HUB_SURFACE,
      category: "mcp",
      entryCount: 42,
    });
    expect(categoryHubSeeAllAnalyticsEvent()).toBe(
      "category_hub_see_all_click",
    );
    expect(categoryHubSeeAllAnalyticsData("skills", 18)).toEqual({
      surface: CATEGORY_HUB_SURFACE,
      category: "skills",
      entryCount: 18,
    });
    expect(categoryHubNotFoundEgressAnalyticsEvent()).toBe(
      "category_hub_notfound_egress_click",
    );
    expect(categoryHubNotFoundEgressAnalyticsData()).toEqual({
      surface: CATEGORY_HUB_NOTFOUND_SURFACE,
    });
  });

  it("maps category hub destinations", () => {
    expect(categoryHubBrowseDestination("mcp")).toEqual({
      to: "/browse",
      search: { category: "mcp" },
    });
    expect(categoryHubBrowseDestination("   ")).toBeNull();
    expect(categoryHubSeeAllDestination("skills")).toEqual({
      to: "/browse",
      search: { category: "skills" },
    });
    expect(categoryHubSeeAllDestination("")).toBeNull();
    expect(categoryHubNotFoundEgressDestination("browse")).toEqual({
      to: "/browse",
    });
    expect(categoryHubNotFoundEgressDestination("unknown")).toBeNull();
  });

  it("builds best index list navigation analytics", () => {
    expect(bestIndexListAnalyticsEvent()).toBe("best_index_list_click");
    expect(bestIndexListAnalyticsData("mcp-servers", 8, 1, 6)).toEqual({
      surface: BEST_INDEX_SURFACE,
      listSlug: "mcp-servers",
      pickCount: 8,
      rowIndex: 1,
      listCount: 6,
    });
  });

  it("maps best index list destinations", () => {
    expect(bestIndexListDestination("mcp-servers")).toEqual({
      to: "/best/$slug",
      params: { slug: "mcp-servers" },
    });
    expect(bestIndexListDestination("")).toBeNull();
  });

  it("builds platform index navigation analytics", () => {
    expect(platformIndexSelectAnalyticsEvent()).toBe("platform_index_select");
    expect(platformIndexSelectAnalyticsData("claude-code", 120, 0, 7)).toEqual({
      surface: PLATFORM_INDEX_SURFACE,
      platformId: "claude-code",
      entryCount: 120,
      rowIndex: 0,
      platformCount: 7,
    });
  });

  it("maps platform index destinations", () => {
    expect(platformIndexSelectDestination("claude-code")).toEqual({
      to: "/for/$platform",
      params: { platform: "claude-code" },
    });
    expect(platformIndexSelectDestination("  ")).toBeNull();
  });

  it("builds platform hub page navigation analytics", () => {
    expect(platformHubBrowseAnalyticsEvent()).toBe("platform_hub_browse_click");
    expect(platformHubBrowseAnalyticsData("cursor", 88)).toEqual({
      surface: PLATFORM_HUB_SURFACE,
      platformId: "cursor",
      entryCount: 88,
    });
    expect(platformHubNotFoundEgressAnalyticsEvent()).toBe(
      "platform_hub_notfound_egress_click",
    );
    expect(platformHubNotFoundEgressAnalyticsData()).toEqual({
      surface: PLATFORM_HUB_NOTFOUND_SURFACE,
    });
    expect(platformHubSectionAnalyticsEvent()).toBe(
      "platform_hub_section_click",
    );
    expect(platformHubSectionAnalyticsData("cursor", "mcp", 6, 1, 4)).toEqual({
      surface: PLATFORM_HUB_SURFACE,
      platformId: "cursor",
      category: "mcp",
      sectionEntryCount: 6,
      rowIndex: 1,
      sectionCount: 4,
    });
    expect(platformCategoryPlatformAnalyticsEvent()).toBe(
      "platform_category_platform_click",
    );
    expect(platformCategoryPlatformAnalyticsData("cursor", "mcp", 12)).toEqual({
      surface: PLATFORM_CATEGORY_SURFACE,
      platformId: "cursor",
      category: "mcp",
      entryCount: 12,
    });
    expect(platformCategoryCategoryAnalyticsEvent()).toBe(
      "platform_category_category_click",
    );
    expect(platformCategoryCategoryAnalyticsData("cursor", "mcp", 12)).toEqual({
      surface: PLATFORM_CATEGORY_SURFACE,
      platformId: "cursor",
      category: "mcp",
      entryCount: 12,
    });
    expect(platformCategoryNotFoundEgressAnalyticsEvent()).toBe(
      "platform_category_notfound_egress_click",
    );
    expect(platformCategoryNotFoundEgressAnalyticsData()).toEqual({
      surface: PLATFORM_CATEGORY_NOTFOUND_SURFACE,
    });
  });

  it("maps platform hub and platform-category destinations", () => {
    expect(platformHubBrowseDestination("cursor")).toEqual({
      to: "/browse",
      search: { platform: "cursor" },
    });
    expect(platformHubBrowseDestination("")).toBeNull();
    expect(platformHubNotFoundEgressDestination("platforms")).toEqual({
      to: "/for",
    });
    expect(platformHubNotFoundEgressDestination("unknown")).toBeNull();
    expect(platformHubSectionDestination("cursor", "mcp")).toEqual({
      to: "/for/$platform/$category",
      params: { platform: "cursor", category: "mcp" },
    });
    expect(platformHubSectionDestination("", "mcp")).toBeNull();
    expect(platformHubSectionDestination("cursor", "")).toBeNull();
    expect(platformCategoryPlatformDestination("cursor")).toEqual({
      to: "/for/$platform",
      params: { platform: "cursor" },
    });
    expect(platformCategoryPlatformDestination("")).toBeNull();
    expect(platformCategoryCategoryDestination("mcp")).toEqual({
      to: "/$category",
      params: { category: "mcp" },
    });
    expect(platformCategoryCategoryDestination("")).toBeNull();
    expect(platformCategoryNotFoundEgressDestination("platforms")).toEqual({
      to: "/for",
    });
    expect(platformCategoryNotFoundEgressDestination("unknown")).toBeNull();
  });
});
