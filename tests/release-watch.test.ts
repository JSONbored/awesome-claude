import { describe, expect, it } from "vitest";

import {
  buildMcpReleaseIssue,
  buildMcpReleaseReport,
  buildRaycastReleaseIssue,
  buildRaycastReleaseReport,
  isTrustedReleaseWatchIssue,
  latestSemverTag,
  MCP_RELEASE_DUE_MARKER,
  RAYCAST_RELEASE_DUE_MARKER,
  readReleaseWatchConfig,
} from "../scripts/lib/release-watch-core.mjs";

describe("release watch", () => {
  it("selects the latest strict semver tag for a release family", () => {
    expect(
      latestSemverTag(
        ["mcp-v0.2.9", "mcp-v0.3.0-beta.1", "mcp-v0.3.0", "v9.9.9"],
        "mcp-v",
      ),
    ).toMatchObject({
      tag: "mcp-v0.3.0",
      version: "0.3.0",
    });
  });

  it("reports an MCP release when the package is ahead of npm", () => {
    const report = buildMcpReleaseReport({
      latestTag: { tag: "mcp-v0.2.0", version: "0.2.0" },
      packageVersion: "0.3.0",
      publishedVersion: "0.2.0",
      commits: [
        {
          sha: "0123456789abcdef",
          subject: "fix(mcp): improve registry payload",
          files: ["packages/mcp/src/registry.js"],
        },
      ],
    });

    expect(report).toMatchObject({
      due: true,
      proposedVersion: "0.3.0",
      packageAhead: true,
    });
    const issue = buildMcpReleaseIssue(report);
    expect(issue.labels).toEqual(["release", "mcp"]);
    expect(issue.assignees).toEqual(["JSONbored"]);
    expect(issue.body).toContain(MCP_RELEASE_DUE_MARKER);
  });

  it("loads release assignees from shared workflow config", () => {
    const config = readReleaseWatchConfig();

    expect(config.assignees).toEqual(["JSONbored"]);
  });

  it("filters Raycast release checks to Raycast-relevant files", () => {
    const report = buildRaycastReleaseReport({
      latestTag: { tag: "raycast-v1.0.0", version: "1.0.0" },
      packageVersion: "1.0.0",
      commits: [
        {
          sha: "aaaaaaaaaaaaaaaa",
          subject: "docs(readme): update intro",
          files: ["README.md"],
        },
        {
          sha: "bbbbbbbbbbbbbbbb",
          subject: "fix(raycast): harden feed parser",
          files: ["integrations/raycast/src/feed.ts"],
        },
      ],
    });

    expect(report.due).toBe(true);
    expect(report.commits).toHaveLength(1);
    expect(report.commits[0].subject).toBe("fix(raycast): harden feed parser");
    const issue = buildRaycastReleaseIssue(report, {
      config: { assignees: ["release-maintainer"] },
    });
    expect(issue.labels).toEqual(["release", "raycast"]);
    expect(issue.assignees).toEqual(["release-maintainer"]);
    expect(issue.body).toContain(RAYCAST_RELEASE_DUE_MARKER);
  });

  it("only trusts existing release-watch issues from automation or trusted labels", () => {
    expect(
      isTrustedReleaseWatchIssue(
        {
          body: MCP_RELEASE_DUE_MARKER,
          user: { login: "contributor" },
          labels: [],
        },
        ["release", "mcp"],
      ),
    ).toBe(false);
    expect(
      isTrustedReleaseWatchIssue(
        {
          body: MCP_RELEASE_DUE_MARKER,
          user: { login: "github-actions[bot]" },
          labels: [],
        },
        ["release", "mcp"],
      ),
    ).toBe(true);
    expect(
      isTrustedReleaseWatchIssue(
        {
          body: MCP_RELEASE_DUE_MARKER,
          user: { login: "maintainer-triaged" },
          labels: [{ name: "release" }, { name: "mcp" }],
        },
        ["release", "mcp"],
      ),
    ).toBe(true);
  });

  it("escapes backslashes and pipes in commit subjects before issue upserts", () => {
    const report = buildMcpReleaseReport({
      latestTag: { tag: "mcp-v0.2.0", version: "0.2.0" },
      packageVersion: "0.3.0",
      publishedVersion: "0.2.0",
      commits: [
        {
          sha: "cccccccccccccccc",
          subject: "fix(mcp): handle path \\tmp | fallback",
          files: ["packages/mcp/src/registry.js"],
        },
      ],
    });

    expect(buildMcpReleaseIssue(report).body).toContain(
      "fix(mcp): handle path \\\\tmp \\| fallback",
    );
  });
});
