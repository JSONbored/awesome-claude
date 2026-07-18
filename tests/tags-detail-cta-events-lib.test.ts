import { describe, expect, it } from "vitest";
import {
  TAGS_DETAIL_NOTFOUND_SURFACE,
  TAGS_DETAIL_SURFACE,
  tagsDetailBrowseEgressAnalyticsData,
  tagsDetailBrowseEgressAnalyticsEvent,
  tagsDetailBrowseEgressDestination,
  tagsDetailNotFoundEgressAnalyticsData,
  tagsDetailNotFoundEgressAnalyticsEvent,
  tagsDetailNotFoundEgressDestination,
  tagsDetailRelatedSelectAnalyticsData,
  tagsDetailRelatedSelectAnalyticsEvent,
  tagsDetailRelatedSelectDestination,
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
    expect(tagsDetailBrowseEgressAnalyticsEvent()).toBe(
      "tags_detail_browse_egress_click",
    );
    expect(tagsDetailBrowseEgressAnalyticsData("postgres", 18)).toEqual({
      surface: TAGS_DETAIL_SURFACE,
      tagSlug: "postgres",
      entryCount: 18,
    });
  });

  it("maps tags detail destinations", () => {
    expect(tagsDetailRelatedSelectDestination("database")).toEqual({
      to: "/tags/$tag",
      params: { tag: "database" },
    });
    expect(tagsDetailRelatedSelectDestination("")).toBeNull();
    expect(tagsDetailBrowseEgressDestination("Postgres")).toEqual({
      to: "/browse",
      search: { q: "Postgres" },
    });
    expect(tagsDetailBrowseEgressDestination("  ")).toBeNull();
    expect(tagsDetailNotFoundEgressDestination("tags")).toEqual({
      to: "/tags",
    });
    expect(tagsDetailNotFoundEgressDestination("unknown")).toBeNull();
  });
});
