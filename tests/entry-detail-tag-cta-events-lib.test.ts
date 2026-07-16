import { describe, expect, it } from "vitest";
import {
  ENTRY_DETAIL_RELATED_SURFACE,
  ENTRY_DETAIL_TAGS_SURFACE,
  entryDetailCategoryHubAnalyticsData,
  entryDetailCategoryHubAnalyticsEvent,
  entryDetailTagAnalyticsData,
  entryDetailTagAnalyticsEvent,
} from "@/lib/entry-detail-tag-cta-events-lib";

describe("entry detail tag cta events lib", () => {
  it("builds privacy-light tag and category hub egress analytics", () => {
    expect(entryDetailTagAnalyticsEvent()).toBe("detail_tag_click");
    expect(
      entryDetailTagAnalyticsData("mcp", "browser", "browser", 0, 5),
    ).toEqual({
      entry: "mcp/browser",
      surface: ENTRY_DETAIL_TAGS_SURFACE,
      tagSlug: "browser",
      rowIndex: 0,
      tagCount: 5,
    });
    expect(entryDetailCategoryHubAnalyticsEvent()).toBe(
      "detail_category_hub_click",
    );
    expect(entryDetailCategoryHubAnalyticsData("skills", "demo")).toEqual({
      entry: "skills/demo",
      surface: ENTRY_DETAIL_RELATED_SURFACE,
      category: "skills",
    });
  });
});
