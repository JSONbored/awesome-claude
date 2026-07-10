import { describe, expect, it } from "vitest";

import {
  cleanGithubHandle,
  cleanGithubLogin,
  cleanRepository,
  escapeMarkdownText,
  formatGithubProfileLink,
  formatPullRequestLink,
} from "../scripts/lib/readme-refresh-format.mjs";

describe("escapeMarkdownText", () => {
  it("stringifies null/undefined to '' and trims", () => {
    expect(escapeMarkdownText(null)).toBe("");
    expect(escapeMarkdownText(undefined)).toBe("");
    expect(escapeMarkdownText("  hi  ")).toBe("hi");
  });

  it("neutralizes @ mentions and #-number references", () => {
    // the @/# entities are emitted first, then the generic escape pass
    // backslash-escapes the "#" inside those entities as well
    expect(escapeMarkdownText("@octocat")).toBe("&\\#64;octocat");
    expect(escapeMarkdownText("see #42")).toBe("see &\\#35;42");
    // a hash not followed by a digit is escaped as a normal special char
    expect(escapeMarkdownText("#tag")).toBe("\\#tag");
  });

  it("backslash-escapes markdown special characters", () => {
    expect(escapeMarkdownText("a*b_c")).toBe("a\\*b\\_c");
    expect(escapeMarkdownText("[x](y)")).toBe("\\[x\\]\\(y\\)");
  });

  it("collapses internal whitespace to single spaces", () => {
    expect(escapeMarkdownText("a\n\t  b   c")).toBe("a b c");
  });
});

describe("cleanGithubHandle", () => {
  it("returns '' for empty/blank input", () => {
    expect(cleanGithubHandle("")).toBe("");
    expect(cleanGithubHandle("   ")).toBe("");
    expect(cleanGithubHandle(null)).toBe("");
  });

  it("normalizes a bare or @-prefixed login", () => {
    expect(cleanGithubHandle("octocat")).toBe("@octocat");
    expect(cleanGithubHandle("@octocat")).toBe("@octocat");
  });

  it("accepts bot logins", () => {
    expect(cleanGithubHandle("dependabot[bot]")).toBe("@dependabot[bot]");
  });

  it("extracts the login from a github.com profile URL", () => {
    expect(cleanGithubHandle("https://github.com/octocat")).toBe("@octocat");
    expect(cleanGithubHandle("https://GitHub.com/octocat/foo")).toBe(
      "@octocat",
    );
  });

  it("returns '' for a github.com URL with no login segment", () => {
    expect(cleanGithubHandle("https://github.com/")).toBe("");
  });

  it("treats a non-github URL as a literal login and rejects it", () => {
    // "https://example.com/octocat" is not a valid login shape
    expect(cleanGithubHandle("https://example.com/octocat")).toBe("");
  });

  it("returns '' for invalid login characters", () => {
    expect(cleanGithubHandle("not a login")).toBe("");
    expect(cleanGithubHandle("-leadinghyphen")).toBe("");
  });
});

describe("cleanGithubLogin", () => {
  it("drops the leading @", () => {
    expect(cleanGithubLogin("octocat")).toBe("octocat");
    expect(cleanGithubLogin("@octocat")).toBe("octocat");
    expect(cleanGithubLogin("bad login")).toBe("");
  });
});

describe("cleanRepository", () => {
  it("passes through a valid owner/repo", () => {
    expect(cleanRepository("JSONbored/awesome-claude")).toBe(
      "JSONbored/awesome-claude",
    );
    expect(cleanRepository("  a/b  ")).toBe("a/b");
  });

  it("returns '' for a non-matching value", () => {
    expect(cleanRepository("no-slash")).toBe("");
    expect(cleanRepository("a/b/c")).toBe("");
    expect(cleanRepository("")).toBe("");
  });
});

describe("formatGithubProfileLink", () => {
  it("links a valid login", () => {
    expect(formatGithubProfileLink("octocat")).toBe(
      "[@octocat](https://github.com/octocat)",
    );
  });

  it("returns '' for an invalid login", () => {
    expect(formatGithubProfileLink("bad login")).toBe("");
    expect(formatGithubProfileLink("")).toBe("");
  });
});

describe("formatPullRequestLink", () => {
  it("returns '' without a number", () => {
    expect(formatPullRequestLink({})).toBe("");
    expect(formatPullRequestLink({ number: 0 })).toBe("");
  });

  it("returns '' when the number is not finite", () => {
    expect(formatPullRequestLink({ number: "abc" })).toBe("");
  });

  it("prefers a trusted github.com htmlUrl", () => {
    expect(
      formatPullRequestLink({
        number: 42,
        htmlUrl: "https://github.com/JSONbored/awesome-claude/pull/42",
      }),
    ).toBe("[#42](https://github.com/JSONbored/awesome-claude/pull/42)");
  });

  it("ignores a non-github htmlUrl and falls back to the repository", () => {
    expect(
      formatPullRequestLink({
        number: 42,
        repository: "JSONbored/awesome-claude",
        htmlUrl: "https://evil.example/JSONbored/awesome-claude/pull/42",
      }),
    ).toBe("[#42](https://github.com/JSONbored/awesome-claude/pull/42)");
  });

  it("ignores a malformed htmlUrl and falls back to the repository", () => {
    expect(
      formatPullRequestLink({
        number: 42,
        repository: "JSONbored/awesome-claude",
        htmlUrl: "not a url",
      }),
    ).toBe("[#42](https://github.com/JSONbored/awesome-claude/pull/42)");
  });

  it("returns the bare label when there is no usable repository", () => {
    expect(formatPullRequestLink({ number: 42 })).toBe("#42");
    expect(formatPullRequestLink({ number: 42, repository: "bogus" })).toBe(
      "#42",
    );
  });
});
