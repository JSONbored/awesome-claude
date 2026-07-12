import { describe, expect, it } from "vitest";

import {
  commentMatchesHeadSha,
  deploymentQueries,
  headSha,
  prNumber,
  previewCandidatesFromEnv,
} from "../scripts/lib/preview-url-event.mjs";

describe("previewCandidatesFromEnv", () => {
  it("lists the three standard env candidates", () => {
    const candidates = previewCandidatesFromEnv({
      PREVIEW_DEPLOYMENT_URL: "a",
      CLOUDFLARE_PREVIEW_URL: "c",
    });
    expect(candidates).toHaveLength(3);
    expect(candidates.map((candidate) => candidate.source)).toEqual([
      "PREVIEW_DEPLOYMENT_URL",
      "DEPLOYMENT_PREVIEW_BASE_URL",
      "CLOUDFLARE_PREVIEW_URL",
    ]);
    expect(candidates[0].url).toBe("a");
  });

  it("appends the shared dev worker only when explicitly allowed", () => {
    const candidates = previewCandidatesFromEnv({
      ALLOW_SHARED_DEV_WORKER_PREVIEW: "1",
      CLOUDFLARE_DEV_WORKER_URL: "dev",
    });
    expect(candidates).toHaveLength(4);
    expect(candidates[3]).toEqual({
      url: "dev",
      source: "CLOUDFLARE_DEV_WORKER_URL",
    });
  });
});

describe("deploymentQueries", () => {
  it("prefers the PR head sha/ref and includes env-derived queries", () => {
    const queries = deploymentQueries(
      { pull_request: { head: { sha: "abc", ref: "feature" } } },
      {
        GITHUB_HEAD_REF: "feature",
        GITHUB_REF_NAME: "main",
        GITHUB_SHA: "def",
      },
    );
    expect(queries).toEqual([
      { sha: "abc" },
      { ref: "feature" },
      { ref: "feature" },
      { ref: "main" },
      { sha: "def" },
    ]);
  });

  it("drops absent sources", () => {
    expect(deploymentQueries({}, {})).toEqual([]);
    expect(deploymentQueries({}, { GITHUB_SHA: "x" })).toEqual([{ sha: "x" }]);
  });
});

describe("headSha", () => {
  it("uses the PR head sha, then GITHUB_SHA, then ''", () => {
    expect(headSha({ pull_request: { head: { sha: "abc" } } }, {})).toBe("abc");
    expect(headSha({}, { GITHUB_SHA: "def" })).toBe("def");
    expect(headSha({}, {})).toBe("");
  });
});

describe("prNumber", () => {
  it("reads pull_request.number, then event.number", () => {
    expect(prNumber({ pull_request: { number: 12 } }, {})).toBe(12);
    expect(prNumber({ number: 34 }, {})).toBe(34);
  });

  it("parses refs/pull/<n>/ from GITHUB_REF when no event number", () => {
    expect(prNumber({}, { GITHUB_REF: "refs/pull/56/merge" })).toBe(56);
  });

  it("returns null when nothing resolves", () => {
    expect(prNumber({}, {})).toBeNull();
    expect(prNumber({}, { GITHUB_REF: "refs/heads/main" })).toBeNull();
  });
});

describe("commentMatchesHeadSha", () => {
  const event = { pull_request: { head: { sha: "ABCDEF1234567890" } } };

  it("passes everything through when there is no head sha", () => {
    expect(commentMatchesHeadSha("anything", {}, {})).toBe(true);
  });

  it("matches the full sha or a 7/8-char prefix, case-insensitively", () => {
    expect(commentMatchesHeadSha("build abcdef1234567890 ok", event, {})).toBe(
      true,
    );
    expect(commentMatchesHeadSha("commit ABCDEF12", event, {})).toBe(true);
    expect(commentMatchesHeadSha("commit abcdef1", event, {})).toBe(true);
  });

  it("does not match an unrelated body", () => {
    expect(commentMatchesHeadSha("no sha here", event, {})).toBe(false);
  });

  it("never matches on a too-short sha (all candidates under 7 chars)", () => {
    const shortShaEvent = { pull_request: { head: { sha: "abc" } } };
    expect(commentMatchesHeadSha("abc appears here", shortShaEvent, {})).toBe(
      false,
    );
  });

  it("treats a missing comment body as empty (no match)", () => {
    expect(commentMatchesHeadSha(null, event, {})).toBe(false);
    expect(commentMatchesHeadSha(undefined, event, {})).toBe(false);
  });
});
