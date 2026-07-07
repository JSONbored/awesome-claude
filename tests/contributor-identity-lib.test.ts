import { describe, expect, it } from "vitest";

import {
  authorMatchesSubmitter,
  contributorSlug,
} from "../apps/web/src/lib/contributor-identity-lib";

describe("contributorSlug", () => {
  it("lowercases the value", () => {
    expect(contributorSlug("Alice")).toBe("alice");
  });

  it("trims surrounding whitespace", () => {
    expect(contributorSlug("  alice  ")).toBe("alice");
  });

  it("strips a single leading @", () => {
    expect(contributorSlug("@alice")).toBe("alice");
  });

  it("collapses runs of non-alphanumerics into single dashes", () => {
    expect(contributorSlug("Foo   Bar")).toBe("foo-bar");
    expect(contributorSlug("a@#$b")).toBe("a-b");
  });

  it("strips leading and trailing dashes", () => {
    expect(contributorSlug("---lead-trail---")).toBe("lead-trail");
  });

  it("replaces separators like dots and underscores", () => {
    expect(contributorSlug("a.b_c")).toBe("a-b-c");
  });

  it("returns an empty string when nothing alphanumeric remains", () => {
    expect(contributorSlug("@@@")).toBe("");
    expect(contributorSlug("   ")).toBe("");
  });

  it("keeps digits", () => {
    expect(contributorSlug("User123")).toBe("user123");
  });
});

describe("authorMatchesSubmitter", () => {
  it("returns false when the author is missing", () => {
    expect(authorMatchesSubmitter(undefined, "alice")).toBe(false);
  });

  it("returns false when the submitter is missing", () => {
    expect(authorMatchesSubmitter("alice", undefined)).toBe(false);
  });

  it("returns false when both are missing", () => {
    expect(authorMatchesSubmitter()).toBe(false);
  });

  it("returns false for an empty-string author", () => {
    expect(authorMatchesSubmitter("", "alice")).toBe(false);
  });

  it("matches when the two normalize to the same slug", () => {
    expect(authorMatchesSubmitter("@Alice", "alice")).toBe(true);
    expect(authorMatchesSubmitter("Foo Bar", "foo-bar")).toBe(true);
  });

  it("does not match different contributors", () => {
    expect(authorMatchesSubmitter("alice", "bob")).toBe(false);
  });

  it("returns false when both normalize to an empty slug", () => {
    // Both present but slug to "" — an empty slug must never count as a match.
    expect(authorMatchesSubmitter("@@@", "###")).toBe(false);
  });
});
