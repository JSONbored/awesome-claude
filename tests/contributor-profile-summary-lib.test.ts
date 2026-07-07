import { describe, expect, it } from "vitest";

import {
  contributorCardSummary,
  contributorProfileStats,
} from "../apps/web/src/lib/contributor-profile-summary-lib";
import type { Contributor } from "../apps/web/src/types/registry";

function contributor(overrides: Partial<Contributor> = {}): Contributor {
  return { acceptedCount: 0, ...overrides } as Contributor;
}

describe("contributorProfileStats", () => {
  it("passes through acceptedCount and reads all optional fields", () => {
    expect(
      contributorProfileStats(
        contributor({
          acceptedCount: 5,
          reviewedCount: 3,
          sourceSubmissionCount: 2,
          categories: ["a", "b"] as unknown as Contributor["categories"],
        }),
      ),
    ).toEqual({ accepted: 5, reviewed: 3, sourceLinked: 2, categories: 2 });
  });

  it("defaults missing optional counts to zero", () => {
    expect(contributorProfileStats(contributor({ acceptedCount: 4 }))).toEqual({
      accepted: 4,
      reviewed: 0,
      sourceLinked: 0,
      categories: 0,
    });
  });

  it("counts categories by length", () => {
    expect(
      contributorProfileStats(
        contributor({
          categories: ["x", "y", "z"] as unknown as Contributor["categories"],
        }),
      ).categories,
    ).toBe(3);
  });
});

describe("contributorCardSummary", () => {
  it("always shows the accepted count", () => {
    expect(contributorCardSummary(contributor({ acceptedCount: 7 }))).toBe(
      "7 accepted",
    );
  });

  it("omits reviewed and source-linked when they are zero", () => {
    expect(
      contributorCardSummary(
        contributor({
          acceptedCount: 1,
          reviewedCount: 0,
          sourceSubmissionCount: 0,
        }),
      ),
    ).toBe("1 accepted");
  });

  it("appends reviewed and source-linked segments when present", () => {
    expect(
      contributorCardSummary(
        contributor({
          acceptedCount: 9,
          reviewedCount: 4,
          sourceSubmissionCount: 2,
        }),
      ),
    ).toBe("9 accepted · 4 reviewed · 2 source-linked");
  });

  it("includes reviewed but not source-linked when only reviewed is present", () => {
    expect(
      contributorCardSummary(
        contributor({ acceptedCount: 2, reviewedCount: 5 }),
      ),
    ).toBe("2 accepted · 5 reviewed");
  });
});
