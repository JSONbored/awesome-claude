import { describe, expect, it, vi } from "vitest";
import type { Entry } from "@/types/registry";

function fixture(overrides: Partial<Entry> = {}): Entry {
  return {
    category: "mcp",
    slug: "fixture-entry",
    title: "Fixture Entry",
    description: "Fixture description",
    author: "JSONbored",
    tags: [],
    platforms: ["claude-code"],
    installType: "manual",
    trust: "review",
    source: "unverified",
    dateAdded: "2026-01-01",
    ...overrides,
  } as Entry;
}

vi.mock("@/data/entries", () => ({
  ENTRIES: [
    fixture({
      slug: "import-pr-only",
      author: "Distinct Author",
      submittedBy: "import-submitter",
      importPrUrl: "https://github.com/org/repo/pull/1",
      submittedByUrl: "https://github.com/import-submitter",
    }),
    fixture({
      slug: "split-authors",
      author: "Split Author",
      submittedBy: "split-submitter",
      authorProfileUrl: "https://github.com/split-author",
      sourceSubmissionUrl: "https://github.com/org/repo",
      submittedByUrl: "https://github.com/split-submitter",
    }),
    fixture({
      slug: "reviewed-entry",
      author: "reviewer",
      submittedBy: "reviewer",
      reviewedBy: "reviewer",
      submittedByUrl: "https://github.com/reviewer",
    }),
    fixture({
      slug: "skip-invalid-slug",
      author: "!!!",
      submittedBy: "!!!",
    }),
    fixture({
      slug: "at-handle-submitter",
      author: "at-handle",
      submittedBy: "@at-handle",
      submittedByUrl: "https://github.com/at-handle",
    }),
  ],
}));

import {
  CONTRIBUTORS,
  authorMatchesSubmitter,
  contributorAcceptedEntryRole,
  contributorForSubmitter,
  contributorForVerifiedAuthor,
  contributorMatchesIdentity,
  contributorSlug,
  findContributorForIdentity,
  getContributor,
} from "../apps/web/src/data/contributors";

describe("contributors attribution aggregation", () => {
  it("builds submitter and distinct author profiles from fixture entries", () => {
    expect(getContributor("import-submitter")?.sourceSubmissionCount).toBe(1);
    expect(getContributor("distinct-author")?.sourceSubmissionCount ?? 0).toBe(
      0,
    );
    expect(getContributor("split-author")?.github).toBe(
      "https://github.com/split-author",
    );
    expect(getContributor("reviewer")?.reviewedCount).toBe(1);
    expect(getContributor("at-handle")?.handle).toBe("at-handle");
    expect(
      CONTRIBUTORS.some((contributor) => contributor.slug === "invalid"),
    ).toBe(false);
  });

  it("handles contributor identity guardrails", () => {
    const contributor = {
      slug: "jane-doe",
      handle: "janedoe",
      name: "Jane Doe",
      github: "https://github.com/janedoe",
      acceptedCount: 1,
    };

    expect(
      contributorAcceptedEntryRole(
        contributor,
        fixture({ author: "Other", submittedBy: "Someone else" }),
      ),
    ).toBeUndefined();
    expect(findContributorForIdentity()).toBeUndefined();
    expect(findContributorForIdentity("")).toBeUndefined();
    expect(contributorForVerifiedAuthor()).toBeUndefined();
    expect(contributorForVerifiedAuthor("author-only")).toBeUndefined();
    expect(
      contributorForVerifiedAuthor(undefined, "submitter-only"),
    ).toBeUndefined();
    expect(contributorForSubmitter({})).toBeUndefined();
    expect(contributorForSubmitter({ submittedBy: undefined })).toBeUndefined();
    expect(authorMatchesSubmitter()).toBe(false);
    expect(authorMatchesSubmitter("author-only")).toBe(false);
    expect(authorMatchesSubmitter(undefined, "submitter-only")).toBe(false);
    expect(contributorMatchesIdentity(contributor, "!!!")).toBe(false);
    expect(contributorSlug("!!!")).toBe("");
  });
});
