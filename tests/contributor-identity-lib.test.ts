import { describe, expect, it } from "vitest";

import {
  authorMatchesSubmitter,
  contributorSlug,
} from "../apps/web/src/lib/contributor-identity-lib";

describe("contributorSlug", () => {
  it("lowercases the value", () => {
    expect(contributorSlug("JohnDoe")).toBe("johndoe");
  });

  it("strips a leading @ handle marker", () => {
    expect(contributorSlug("@octocat")).toBe("octocat");
  });

  it("only strips a single leading @", () => {
    expect(contributorSlug("@@octocat")).toBe("octocat");
  });

  it("trims surrounding whitespace before slugifying", () => {
    expect(contributorSlug("  Jane Roe  ")).toBe("jane-roe");
  });

  it("replaces runs of non-alphanumeric characters with a single dash", () => {
    expect(contributorSlug("john   doe")).toBe("john-doe");
    expect(contributorSlug("john__doe")).toBe("john-doe");
  });

  it("keeps digits", () => {
    expect(contributorSlug("user123")).toBe("user123");
  });

  it("strips leading and trailing dashes", () => {
    expect(contributorSlug("--john--")).toBe("john");
  });

  it("collapses interior separators while stripping edges", () => {
    expect(contributorSlug("  .John. .Doe.  ")).toBe("john-doe");
  });

  it("returns an empty string for symbol-only input", () => {
    expect(contributorSlug("@#$%")).toBe("");
  });

  it("returns an empty string for a lone @ marker", () => {
    expect(contributorSlug("@")).toBe("");
  });

  it("returns an empty string for empty input", () => {
    expect(contributorSlug("")).toBe("");
  });

  it("leaves an already-normalized slug unchanged", () => {
    expect(contributorSlug("code-review")).toBe("code-review");
  });
});

describe("authorMatchesSubmitter", () => {
  it("returns true when both slugs are equal", () => {
    expect(authorMatchesSubmitter("John Doe", "john-doe")).toBe(true);
  });

  it("returns true when the @ handle normalizes to the same slug", () => {
    expect(authorMatchesSubmitter("@alice", "alice")).toBe(true);
  });

  it("returns false when the slugs differ", () => {
    expect(authorMatchesSubmitter("alice", "bob")).toBe(false);
  });

  it("returns false when author is missing", () => {
    expect(authorMatchesSubmitter(undefined, "bob")).toBe(false);
  });

  it("returns false when submittedBy is missing", () => {
    expect(authorMatchesSubmitter("alice", undefined)).toBe(false);
  });

  it("returns false when author is an empty string", () => {
    expect(authorMatchesSubmitter("", "bob")).toBe(false);
  });

  it("returns false when submittedBy is an empty string", () => {
    expect(authorMatchesSubmitter("alice", "")).toBe(false);
  });

  it("returns false when both inputs are missing", () => {
    expect(authorMatchesSubmitter()).toBe(false);
  });

  it("returns false when both inputs slugify to empty strings", () => {
    expect(authorMatchesSubmitter("@#$%", "!!!")).toBe(false);
  });
});
