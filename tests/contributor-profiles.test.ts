import { describe, expect, it, vi } from "vitest";
import type { Contributor } from "@/types/registry";
import * as contributors from "@/data/contributors";
import {
  contributorCardSummary,
  contributorProfileStats,
  submitterAttribution,
} from "@/lib/contributor-profile-summary";

function contributor(overrides: Partial<Contributor> = {}): Contributor {
  return {
    slug: "example",
    handle: "example",
    name: "Example",
    acceptedCount: 3,
    ...overrides,
  };
}

describe("contributor profile summary", () => {
  it("summarizes contributor stats for profile cards", () => {
    expect(contributorProfileStats(contributor())).toEqual({
      accepted: 3,
      reviewed: 0,
      sourceLinked: 0,
      categories: 0,
    });
    expect(
      contributorProfileStats(
        contributor({
          reviewedCount: 2,
          sourceSubmissionCount: 1,
          categories: [{ category: "mcp", count: 2 }],
        }),
      ),
    ).toEqual({
      accepted: 3,
      reviewed: 2,
      sourceLinked: 1,
      categories: 1,
    });
  });

  it("builds browse card summaries with optional review and source credit", () => {
    expect(contributorCardSummary(contributor())).toBe("3 accepted");
    expect(
      contributorCardSummary(
        contributor({ reviewedCount: 4, sourceSubmissionCount: 2 }),
      ),
    ).toBe("3 accepted · 4 reviewed · 2 source-linked");
  });

  it("resolves submitter attribution to contributor, external, or plain labels", () => {
    const spy = vi.spyOn(contributors, "contributorForSubmitter");

    spy.mockReturnValue(
      contributor({ slug: "linked-submitter", handle: "linked-submitter" }),
    );
    expect(
      submitterAttribution({
        submittedBy: "linked-submitter",
        submittedByUrl: "https://github.com/linked-submitter",
      }),
    ).toEqual({
      kind: "contributor",
      slug: "linked-submitter",
      label: "linked-submitter",
    });

    spy.mockReturnValue(undefined);
    expect(
      submitterAttribution({
        submittedBy: "external-only",
        submittedByUrl: "https://example.com/external-only",
      }),
    ).toEqual({
      kind: "external",
      href: "https://example.com/external-only",
      label: "external-only",
    });

    expect(
      submitterAttribution({
        submittedBy: "plain-submitter",
      }),
    ).toEqual({
      kind: "plain",
      label: "plain-submitter",
    });
    expect(submitterAttribution({})).toBeUndefined();

    spy.mockRestore();
  });
});
