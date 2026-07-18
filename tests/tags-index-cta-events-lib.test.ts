import { describe, expect, it } from "vitest";
import {
  TAGS_INDEX_SURFACE,
  tagsIndexBrowseEgressAnalyticsData,
  tagsIndexBrowseEgressAnalyticsEvent,
  tagsIndexBrowseEgressDestination,
  tagsIndexFilterAnalyticsData,
  tagsIndexFilterAnalyticsEvent,
  tagsIndexTagSelectAnalyticsData,
  tagsIndexTagSelectAnalyticsEvent,
  tagsIndexTagSelectDestination,
} from "@/lib/tags-index-cta-events-lib";

describe("tags index cta events lib", () => {
  it("builds privacy-light tags index analytics payloads", () => {
    expect(tagsIndexTagSelectAnalyticsEvent()).toBe("tags_index_tag_select");
    expect(
      tagsIndexTagSelectAnalyticsData("postgres", 42, "featured", "mcp"),
    ).toEqual({
      surface: TAGS_INDEX_SURFACE,
      tagSlug: "postgres",
      entryCount: 42,
      variant: "featured",
      topCategory: "mcp",
    });
    expect(tagsIndexTagSelectAnalyticsData("browser", 8, "pill")).toEqual({
      surface: TAGS_INDEX_SURFACE,
      tagSlug: "browser",
      entryCount: 8,
      variant: "pill",
    });
    expect(tagsIndexFilterAnalyticsEvent()).toBe("tags_index_filter");
    expect(tagsIndexFilterAnalyticsData(5, 12)).toEqual({
      surface: TAGS_INDEX_SURFACE,
      queryLength: 5,
      matchCount: 12,
    });
    expect(tagsIndexBrowseEgressAnalyticsEvent()).toBe(
      "tags_index_browse_egress_click",
    );
    expect(tagsIndexBrowseEgressAnalyticsData()).toEqual({
      surface: TAGS_INDEX_SURFACE,
    });
  });

  it("maps tags index destinations", () => {
    expect(tagsIndexTagSelectDestination("postgres")).toEqual({
      to: "/tags/$tag",
      params: { tag: "postgres" },
    });
    expect(tagsIndexTagSelectDestination("")).toBeNull();
    expect(tagsIndexBrowseEgressDestination("browse")).toEqual({
      to: "/browse",
    });
    expect(tagsIndexBrowseEgressDestination("unknown")).toBeNull();
  });
});
