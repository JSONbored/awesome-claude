import { describe, expect, it } from "vitest";

import {
  contributorCardSummary,
  contributorProfileStats,
  submitterAttributionFrom,
} from "../apps/web/src/lib/contributor-profile-summary-lib";
import type { Contributor, Entry } from "../apps/web/src/types/registry";

const contributor = (over: Partial<Contributor> = {}): Contributor =>
  ({
    slug: "ada",
    acceptedCount: 0,
    ...over,
  }) as Contributor;

describe("contributorProfileStats", () => {
  it("reads all counts when present", () => {
    expect(
      contributorProfileStats(
        contributor({
          acceptedCount: 7,
          reviewedCount: 4,
          sourceSubmissionCount: 2,
          categories: ["a", "b", "c"] as unknown as Contributor["categories"],
        }),
      ),
    ).toEqual({ accepted: 7, reviewed: 4, sourceLinked: 2, categories: 3 });
  });

  it("defaults nullish optional counts to 0", () => {
    expect(contributorProfileStats(contributor({ acceptedCount: 3 }))).toEqual({
      accepted: 3,
      reviewed: 0,
      sourceLinked: 0,
      categories: 0,
    });
  });
});

describe("contributorCardSummary", () => {
  it("shows only accepted when the other counts are zero", () => {
    expect(contributorCardSummary(contributor({ acceptedCount: 5 }))).toBe(
      "5 accepted",
    );
  });

  it("appends reviewed only when positive", () => {
    expect(
      contributorCardSummary(
        contributor({ acceptedCount: 5, reviewedCount: 2 }),
      ),
    ).toBe("5 accepted · 2 reviewed");
  });

  it("appends source-linked only when positive", () => {
    expect(
      contributorCardSummary(
        contributor({ acceptedCount: 5, sourceSubmissionCount: 3 }),
      ),
    ).toBe("5 accepted · 3 source-linked");
  });

  it("joins every part in order when all are positive", () => {
    expect(
      contributorCardSummary(
        contributor({
          acceptedCount: 5,
          reviewedCount: 2,
          sourceSubmissionCount: 3,
        }),
      ),
    ).toBe("5 accepted · 2 reviewed · 3 source-linked");
  });
});

describe("submitterAttributionFrom", () => {
  const entry = (
    over: Partial<Entry> = {},
  ): Pick<Entry, "submittedBy" | "submittedByUrl"> =>
    ({ submittedBy: "Grace", ...over }) as Entry;

  it("returns undefined when there is no submitter", () => {
    expect(
      submitterAttributionFrom(entry({ submittedBy: undefined }), null),
    ).toBeUndefined();
    expect(
      submitterAttributionFrom(entry({ submittedBy: "" }), null),
    ).toBeUndefined();
  });

  it("prefers a known contributor", () => {
    expect(
      submitterAttributionFrom(entry({ submittedByUrl: "https://x.example" }), {
        slug: "grace",
      }),
    ).toEqual({ kind: "contributor", slug: "grace", label: "Grace" });
  });

  it("falls back to an external link when a URL is present", () => {
    expect(
      submitterAttributionFrom(
        entry({ submittedByUrl: "https://x.example" }),
        null,
      ),
    ).toEqual({ kind: "external", href: "https://x.example", label: "Grace" });
  });

  it("falls back to a plain label when there is no contributor or URL", () => {
    expect(submitterAttributionFrom(entry(), undefined)).toEqual({
      kind: "plain",
      label: "Grace",
    });
  });
});
