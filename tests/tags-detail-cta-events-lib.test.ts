import { describe, expect, it } from "vitest";
import {
  TAGS_DETAIL_NOTFOUND_SURFACE,
  TAGS_DETAIL_SURFACE,
  tagsDetailNotFoundEgressAnalyticsData,
  tagsDetailNotFoundEgressAnalyticsEvent,
  tagsDetailRelatedSelectAnalyticsData,
  tagsDetailRelatedSelectAnalyticsEvent,
} from "@/lib/tags-detail-cta-events-lib";

describe("tags detail cta events lib", () => {
  it("builds privacy-light tags detail analytics payloads", () => {
    expect(tagsDetailRelatedSelectAnalyticsEvent()).toBe(
      "tags_detail_related_select",
    );
    expect(
      tagsDetailRelatedSelectAnalyticsData("postgres", "database", 18),
    ).toEqual({
      surface: TAGS_DETAIL_SURFACE,
      fromTagSlug: "postgres",
      tagSlug: "database",
      entryCount: 18,
    });
    expect(tagsDetailNotFoundEgressAnalyticsEvent()).toBe(
      "tags_detail_notfound_egress_click",
    );
    expect(tagsDetailNotFoundEgressAnalyticsData()).toEqual({
      surface: TAGS_DETAIL_NOTFOUND_SURFACE,
    });
  });
});
