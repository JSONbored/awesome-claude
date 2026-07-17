import { describe, expect, it } from "vitest";

import {
  GitHubApiError,
  githubRetryDelaySeconds,
  isGitHubRateLimitError,
} from "../apps/submission-gate/src/github";

describe("submission-gate isGitHubRateLimitError", () => {
  it("ignores values that are not GitHub API errors", () => {
    expect(isGitHubRateLimitError(new Error("boom"))).toBe(false);
    expect(isGitHubRateLimitError("rate limit exceeded")).toBe(false);
    expect(isGitHubRateLimitError(undefined)).toBe(false);
  });

  it("detects an exhausted rate-limit budget on a 403", () => {
    expect(
      isGitHubRateLimitError(
        new GitHubApiError(403, "forbidden", { rateLimitRemaining: 0 }),
      ),
    ).toBe(true);
  });

  it("detects primary and secondary rate limits from the message", () => {
    expect(
      isGitHubRateLimitError(
        new GitHubApiError(403, "API rate limit exceeded for user", {
          rateLimitRemaining: 5,
        }),
      ),
    ).toBe(true);
    expect(
      isGitHubRateLimitError(
        new GitHubApiError(403, "You have exceeded a secondary rate limit", {
          rateLimitRemaining: 5,
        }),
      ),
    ).toBe(true);
  });

  it("ignores other 403s and rate-limit wording on non-403 statuses", () => {
    expect(
      isGitHubRateLimitError(
        new GitHubApiError(403, "resource not accessible", {
          rateLimitRemaining: 5,
        }),
      ),
    ).toBe(false);
    expect(
      isGitHubRateLimitError(new GitHubApiError(404, "rate limit exceeded")),
    ).toBe(false);
  });
});

describe("submission-gate githubRetryDelaySeconds", () => {
  it("falls back for non-GitHub errors and bare API errors", () => {
    expect(githubRetryDelaySeconds(new Error("boom"), 7)).toBe(7);
    expect(githubRetryDelaySeconds(new GitHubApiError(403, "m"), 7)).toBe(7);
  });

  it("honors retry-after when it exceeds the fallback", () => {
    expect(
      githubRetryDelaySeconds(
        new GitHubApiError(403, "m", { retryAfterSeconds: 99 }),
        7,
      ),
    ).toBe(99);
  });

  it("keeps the fallback when retry-after is shorter", () => {
    expect(
      githubRetryDelaySeconds(
        new GitHubApiError(403, "m", { retryAfterSeconds: 2 }),
        7,
      ),
    ).toBe(7);
  });

  it("derives a padded delay from a future rate-limit reset", () => {
    const resetAt = new Date(Date.now() + 60_000).toISOString();
    const delay = githubRetryDelaySeconds(
      new GitHubApiError(403, "m", { rateLimitResetAt: resetAt }),
      7,
    );
    expect(delay).toBeGreaterThan(60);
    expect(delay).toBeLessThanOrEqual(91);
  });

  it("falls back for past or unparseable rate-limit resets", () => {
    const past = new Date(Date.now() - 60_000).toISOString();
    expect(
      githubRetryDelaySeconds(
        new GitHubApiError(403, "m", { rateLimitResetAt: past }),
        7,
      ),
    ).toBe(7);
    expect(
      githubRetryDelaySeconds(
        new GitHubApiError(403, "m", { rateLimitResetAt: "not-a-date" }),
        7,
      ),
    ).toBe(7);
  });
});
