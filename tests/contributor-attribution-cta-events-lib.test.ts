import { describe, expect, it } from "vitest";
import {
  CONTRIBUTOR_ATTRIBUTION_SURFACE,
  contributorAttributionAnalyticsData,
  contributorAttributionAnalyticsEvent,
} from "@/lib/contributor-attribution-cta-events-lib";

describe("contributor attribution cta events lib", () => {
  it("builds contributor attribution navigation analytics", () => {
    expect(contributorAttributionAnalyticsEvent()).toBe(
      "contributor_attribution_click",
    );
    expect(
      contributorAttributionAnalyticsData("profile", "author", "alice"),
    ).toEqual({
      surface: CONTRIBUTOR_ATTRIBUTION_SURFACE,
      kind: "profile",
      role: "author",
      contributorSlug: "alice",
    });
    expect(
      contributorAttributionAnalyticsData("external", "submitter"),
    ).toEqual({
      surface: CONTRIBUTOR_ATTRIBUTION_SURFACE,
      kind: "external",
      role: "submitter",
      contributorSlug: null,
    });
    expect(
      contributorAttributionAnalyticsData("external", "identity", null),
    ).toEqual({
      surface: CONTRIBUTOR_ATTRIBUTION_SURFACE,
      kind: "external",
      role: "identity",
      contributorSlug: null,
    });
  });
});
