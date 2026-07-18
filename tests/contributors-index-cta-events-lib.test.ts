import { describe, expect, it } from "vitest";
import {
  CONTRIBUTORS_INDEX_SURFACE,
  contributorsIndexFeaturedProfileAnalyticsData,
  contributorsIndexFeaturedProfileAnalyticsEvent,
  contributorsIndexGithubAnalyticsData,
  contributorsIndexGithubAnalyticsEvent,
  contributorsIndexProfileAnalyticsData,
  contributorsIndexProfileAnalyticsEvent,
  contributorsIndexStatAnalyticsData,
  contributorsIndexStatAnalyticsEvent,
  contributorsIndexStatDestination,
  contributorsIndexSubmitAnalyticsData,
  contributorsIndexSubmitAnalyticsEvent,
  contributorsIndexProfileDestination,
  contributorsIndexSubmitDestination,
} from "@/lib/contributors-index-cta-events-lib";

describe("contributors index cta events lib", () => {
  it("builds contributors index profile card analytics", () => {
    expect(contributorsIndexProfileAnalyticsEvent()).toBe(
      "contributors_index_profile_click",
    );
    expect(contributorsIndexProfileAnalyticsData("alice", 12, 0, 24)).toEqual({
      surface: CONTRIBUTORS_INDEX_SURFACE,
      contributorSlug: "alice",
      acceptedCount: 12,
      rowIndex: 0,
      contributorCount: 24,
    });
  });

  it("builds contributors index submit CTA analytics", () => {
    expect(contributorsIndexSubmitAnalyticsEvent()).toBe(
      "contributors_index_submit_click",
    );
    expect(contributorsIndexSubmitAnalyticsData(24, 310)).toEqual({
      surface: CONTRIBUTORS_INDEX_SURFACE,
      contributorCount: 24,
      totalAccepted: 310,
    });
  });

  it("builds contributors index GitHub egress analytics", () => {
    expect(contributorsIndexGithubAnalyticsEvent()).toBe(
      "contributors_index_github_click",
    );
    expect(
      contributorsIndexGithubAnalyticsData("alice", 12, "featured", null, 24),
    ).toEqual({
      surface: CONTRIBUTORS_INDEX_SURFACE,
      contributorSlug: "alice",
      acceptedCount: 12,
      variant: "featured",
      rowIndex: null,
      contributorCount: 24,
    });
    expect(
      contributorsIndexGithubAnalyticsData("bob", 4, "card", 2, 24),
    ).toEqual({
      surface: CONTRIBUTORS_INDEX_SURFACE,
      contributorSlug: "bob",
      acceptedCount: 4,
      variant: "card",
      rowIndex: 2,
      contributorCount: 24,
    });
  });

  it("maps contributors index headline stats and featured profile egress", () => {
    expect(contributorsIndexStatAnalyticsEvent()).toBe(
      "contributors_index_stat_click",
    );
    expect(
      contributorsIndexStatAnalyticsData("contributors", 24, 24, 310),
    ).toEqual({
      surface: CONTRIBUTORS_INDEX_SURFACE,
      statId: "contributors",
      value: 24,
      contributorCount: 24,
      totalAccepted: 310,
    });
    expect(contributorsIndexStatDestination("contributors")).toEqual({
      to: "/contributors",
      hash: "contributor-grid",
    });
    expect(contributorsIndexStatDestination("accepted-entries")).toEqual({
      to: "/browse",
    });
    expect(contributorsIndexStatDestination("unknown")).toBeNull();
    expect(contributorsIndexFeaturedProfileAnalyticsEvent()).toBe(
      "contributors_index_featured_profile_click",
    );
    expect(
      contributorsIndexFeaturedProfileAnalyticsData("alice", 12, 24),
    ).toEqual({
      surface: CONTRIBUTORS_INDEX_SURFACE,
      contributorSlug: "alice",
      acceptedCount: 12,
      contributorCount: 24,
    });
  });

  it("maps contributors index profile and submit destinations", () => {
    expect(contributorsIndexProfileDestination("alice")).toEqual({
      to: "/contributors/$slug",
      params: { slug: "alice" },
    });
    expect(contributorsIndexProfileDestination("")).toBeNull();
    expect(contributorsIndexSubmitDestination("submit")).toEqual({
      to: "/submit",
    });
    expect(contributorsIndexSubmitDestination("unknown")).toBeNull();
  });
});
