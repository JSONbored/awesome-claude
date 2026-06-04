export const MCP_RELEASE_DUE_MARKER = "<!-- heyclaude:mcp-release-due -->";
export const RAYCAST_RELEASE_DUE_MARKER =
  "<!-- heyclaude:raycast-release-due -->";

export function latestSemverTag(tags, prefix) {
  const matches = tags
    .map((tag) => {
      const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const match = new RegExp(
        `^${escapedPrefix}(\\d+)\\.(\\d+)\\.(\\d+)$`,
      ).exec(tag);
      if (!match) return null;
      const [, major, minor, patch] = match;
      return {
        tag,
        version: `${major}.${minor}.${patch}`,
        parts: [Number(major), Number(minor), Number(patch)],
      };
    })
    .filter(Boolean);

  matches.sort((left, right) => {
    for (let index = 0; index < 3; index += 1) {
      const delta = right.parts[index] - left.parts[index];
      if (delta) return delta;
    }
    return left.tag.localeCompare(right.tag);
  });

  return matches[0] ?? null;
}

export function isVersionAhead(version, baseline) {
  const left = parseSemver(version);
  const right = parseSemver(baseline);
  if (!left || !right) return false;
  for (let index = 0; index < 3; index += 1) {
    if (left[index] > right[index]) return true;
    if (left[index] < right[index]) return false;
  }
  return false;
}

export function relevantCommits(commits, pathPrefixes) {
  return commits.filter((commit) =>
    commit.files.some((file) =>
      pathPrefixes.some(
        (prefix) => file === prefix || file.startsWith(`${prefix}/`),
      ),
    ),
  );
}

export function buildMcpReleaseReport({
  latestTag,
  packageVersion,
  publishedVersion,
  commits,
}) {
  const relevant = relevantCommits(commits, [
    "packages/mcp",
    "packages/registry",
    "scripts/validate-mcp-package.mjs",
    "scripts/validate-mcp-release.sh",
    "tests/mcp-cli.test.ts",
    "tests/mcp-server.test.ts",
    ".github/workflows/mcp-package.yml",
    ".github/workflows/publish-mcp-npm.yml",
  ]);
  const packageAhead = publishedVersion
    ? isVersionAhead(packageVersion, publishedVersion)
    : false;

  return {
    kind: "mcp",
    due: packageAhead || relevant.length > 0,
    proposedVersion: packageVersion,
    latestTag: latestTag?.tag ?? null,
    latestTagVersion: latestTag?.version ?? null,
    packageVersion,
    publishedVersion,
    commits: relevant,
    packageAhead,
  };
}

export function buildRaycastReleaseReport({
  latestTag,
  packageVersion,
  commits,
}) {
  const relevant = relevantCommits(commits, [
    "integrations/raycast",
    "scripts/validate-raycast-feed.mjs",
    "tests/registry-artifacts.test.ts",
    ".github/workflows/raycast-extension.yml",
  ]);

  return {
    kind: "raycast",
    due: relevant.length > 0,
    proposedVersion: packageVersion,
    latestTag: latestTag?.tag ?? null,
    latestTagVersion: latestTag?.version ?? null,
    packageVersion,
    publishedVersion: null,
    commits: relevant,
    packageAhead: false,
  };
}

export function buildMcpReleaseIssue(report) {
  return buildReleaseIssue({
    report,
    marker: MCP_RELEASE_DUE_MARKER,
    title: `MCP release due: ${report.proposedVersion}`,
    packageLabel: "@heyclaude/mcp",
    checklist: [
      "Run the MCP package validation workflow.",
      "Run the manual npm publish workflow after checks pass.",
      "Verify the npm package and GitHub release tag after publish.",
    ],
  });
}

export function buildRaycastReleaseIssue(report) {
  return buildReleaseIssue({
    report,
    marker: RAYCAST_RELEASE_DUE_MARKER,
    title: `Raycast update due: ${report.proposedVersion}`,
    packageLabel: "Raycast extension",
    checklist: [
      "Run the Raycast extension validation workflow.",
      "Review store metadata, screenshots, and changelog.",
      "Submit the updated extension upstream when the validation package is clean.",
    ],
  });
}

function buildReleaseIssue({ report, marker, title, packageLabel, checklist }) {
  const commitPreviewLimit = 25;
  const commitPreview = report.commits.slice(-commitPreviewLimit);
  const omittedCommitCount = Math.max(
    0,
    report.commits.length - commitPreview.length,
  );
  const commitLines = commitPreview.length
    ? commitPreview.map(
        (commit) =>
          `- ${commit.sha.slice(0, 7)} ${escapeMarkdown(commit.subject)}`,
      )
    : ["- No relevant commits detected."];
  if (omittedCommitCount) {
    commitLines.unshift(
      `- ${omittedCommitCount} older relevant commits omitted from this summary.`,
    );
  }
  const fileLines = [
    ...new Set(report.commits.flatMap((commit) => commit.files)),
  ]
    .slice(0, 40)
    .map((file) => `- \`${file}\``);

  return {
    title,
    assignees: ["JSONbored"],
    body: [
      marker,
      "",
      "## Summary",
      "",
      `${packageLabel} appears to need a release/update pass.`,
      "",
      "## Current State",
      "",
      `- Proposed version: \`${report.proposedVersion}\``,
      `- Latest release tag: \`${report.latestTag ?? "none"}\``,
      `- Published version: \`${report.publishedVersion ?? "n/a"}\``,
      `- Relevant unreleased commits: \`${report.commits.length}\``,
      "",
      "## Relevant Commits",
      "",
      ...commitLines,
      "",
      "## Changed Files",
      "",
      ...(fileLines.length ? fileLines : ["- No relevant files detected."]),
      "",
      "## Checklist",
      "",
      ...checklist.map((item) => `- [ ] ${item}`),
      "",
      "This issue is maintained by the release-watch workflow. It should be updated in place instead of opening duplicate release reminders.",
      "",
    ].join("\n"),
  };
}

function parseSemver(value) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(String(value || "").trim());
  if (!match) return null;
  return match.slice(1).map(Number);
}

function escapeMarkdown(value) {
  return String(value || "")
    .replace(/\\/g, "\\\\")
    .replace(/\|/g, "\\|");
}
