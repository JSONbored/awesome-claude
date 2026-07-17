import { describe, expect, it } from "vitest";
import {
  CONTRIBUTOR_PROFILE_SURFACE,
  contributorProfileCategoryAnalyticsData,
  contributorProfileCategoryAnalyticsEvent,
  contributorProfileGithubAnalyticsData,
  contributorProfileGithubAnalyticsEvent,
  contributorProfileIndexAnalyticsData,
  contributorProfileIndexAnalyticsEvent,
  contributorProfilePeerAnalyticsData,
  contributorProfilePeerAnalyticsEvent,
  contributorProfileSubmitAnalyticsData,
  contributorProfileSubmitAnalyticsEvent,
  contributorProfileSubmitterAnalyticsData,
  contributorProfileSubmitterAnalyticsEvent,
  contributorProfileTraceEgressAnalyticsData,
  contributorProfileTraceEgressAnalyticsEvent,
  contributorProfileStatAnalyticsData,
  contributorProfileStatAnalyticsEvent,
  contributorProfileStatDestination,
} from "@/lib/contributor-profile-cta-events-lib";

describe("contributor profile cta events lib", () => {
  it("builds contributor profile index egress analytics", () => {
    expect(contributorProfileIndexAnalyticsEvent()).toBe(
      "contributor_profile_index_click",
    );
    expect(contributorProfileIndexAnalyticsData("alice", 12)).toEqual({
      surface: CONTRIBUTOR_PROFILE_SURFACE,
      contributorSlug: "alice",
      acceptedCount: 12,
    });
  });

  it("builds contributor profile category hub analytics", () => {
    expect(contributorProfileCategoryAnalyticsEvent()).toBe(
      "contributor_profile_category_click",
    );
    expect(contributorProfileCategoryAnalyticsData("alice", "mcp", 5)).toEqual({
      surface: CONTRIBUTOR_PROFILE_SURFACE,
      contributorSlug: "alice",
      category: "mcp",
      categoryEntryCount: 5,
    });
  });

  it("builds contributor profile submit and peer navigation analytics", () => {
    expect(contributorProfileSubmitAnalyticsEvent()).toBe(
      "contributor_profile_submit_click",
    );
    expect(contributorProfileSubmitAnalyticsData("alice", 12)).toEqual({
      surface: CONTRIBUTOR_PROFILE_SURFACE,
      contributorSlug: "alice",
      acceptedCount: 12,
    });
    expect(contributorProfilePeerAnalyticsEvent()).toBe(
      "contributor_profile_peer_click",
    );
    expect(contributorProfilePeerAnalyticsData("alice", "bob", 1, 8)).toEqual({
      surface: CONTRIBUTOR_PROFILE_SURFACE,
      contributorSlug: "alice",
      peerSlug: "bob",
      rowIndex: 1,
      peerCount: 8,
    });
    expect(contributorProfileSubmitterAnalyticsEvent()).toBe(
      "contributor_profile_submitter_click",
    );
    expect(
      contributorProfileSubmitterAnalyticsData(
        "alice",
        "bob",
        "submitted",
        2,
        6,
      ),
    ).toEqual({
      surface: CONTRIBUTOR_PROFILE_SURFACE,
      contributorSlug: "alice",
      peerSlug: "bob",
      role: "submitted",
      rowIndex: 2,
      rowCount: 6,
    });
    expect(contributorProfileGithubAnalyticsEvent()).toBe(
      "contributor_profile_github_click",
    );
    expect(contributorProfileGithubAnalyticsData("alice", 12)).toEqual({
      surface: CONTRIBUTOR_PROFILE_SURFACE,
      contributorSlug: "alice",
      acceptedCount: 12,
    });
    expect(contributorProfileTraceEgressAnalyticsEvent()).toBe(
      "contributor_profile_trace_egress_click",
    );
    expect(
      contributorProfileTraceEgressAnalyticsData(
        "alice",
        "import-pr",
        "authored",
        1,
        4,
      ),
    ).toEqual({
      surface: CONTRIBUTOR_PROFILE_SURFACE,
      contributorSlug: "alice",
      destination: "import-pr",
      role: "authored",
      rowIndex: 1,
      rowCount: 4,
    });
  });

  it("builds contributor profile headline stat analytics and destinations", () => {
    expect(contributorProfileStatAnalyticsEvent()).toBe(
      "contributor_profile_stat_click",
    );
    expect(
      contributorProfileStatAnalyticsData("alice", "accepted", 12),
    ).toEqual({
      surface: CONTRIBUTOR_PROFILE_SURFACE,
      contributorSlug: "alice",
      statId: "accepted",
      count: 12,
    });
    expect(
      contributorProfileStatAnalyticsData("alice", "source-linked", 9),
    ).toEqual({
      surface: CONTRIBUTOR_PROFILE_SURFACE,
      contributorSlug: "alice",
      statId: "source-linked",
      count: 9,
    });
    expect(contributorProfileStatDestination("accepted")).toEqual({
      to: "/contributors/$slug",
      hash: "accepted",
    });
    expect(contributorProfileStatDestination("reviewed")).toEqual({
      to: "/contributors/$slug",
      hash: "reviewed",
    });
    expect(contributorProfileStatDestination("categories")).toEqual({
      to: "/contributors/$slug",
      hash: "category-credits",
    });
    expect(contributorProfileStatDestination("source-linked")).toEqual({
      to: "/browse",
      search: { signal: "source-backed" },
    });
  });
});
