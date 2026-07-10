import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

import categorySpec from "@heyclaude/registry/category-spec";
import { parseSafeFrontmatter } from "@heyclaude/registry/frontmatter";

import {
  escapeMarkdownText,
  formatGithubProfileLink,
  formatPullRequestLink,
} from "./lib/readme-refresh-format.mjs";

const categoryOrder = categorySpec.categoryOrder;
const categoryRank = new Map(
  categoryOrder.map((category, index) => [category, index]),
);
const readmeLinePrefix = "- **[";
const readmeUrlPrefix = "https://heyclau.de/";
const readmeEntryRoutePrefix = "entry/";
const readmeUrlSuffix = ")** - ";

function formatReadmeEntryLink(change, frontmatter = {}) {
  const title = escapeMarkdownText(frontmatter.title || change.title);
  if (!change.category || !change.slug) return title;

  return `[${title}](https://heyclau.de/entry/${encodeURIComponent(
    change.category,
  )}/${encodeURIComponent(change.slug)})`;
}

function parseReadmeEntryLine(line) {
  if (!line.startsWith(readmeLinePrefix)) return null;

  const titleStart = readmeLinePrefix.length;
  const titleEnd = line.indexOf("](", titleStart);
  if (titleEnd < titleStart) return null;

  const urlStart = titleEnd + 2;
  const urlEnd = line.indexOf(readmeUrlSuffix, urlStart);
  if (urlEnd < urlStart) return null;

  const title = line.slice(titleStart, titleEnd);
  const url = line.slice(urlStart, urlEnd);
  if (!url.startsWith(readmeUrlPrefix)) return null;

  let route = url.slice(readmeUrlPrefix.length);
  if (route.startsWith(readmeEntryRoutePrefix)) {
    route = route.slice(readmeEntryRoutePrefix.length);
  }
  const separator = route.indexOf("/");
  if (separator <= 0 || separator === route.length - 1) return null;

  const category = route.slice(0, separator);
  const slug = route.slice(separator + 1);
  if (slug.includes("/")) return null;

  const description = line.slice(urlEnd + readmeUrlSuffix.length);
  return {
    title,
    category,
    slug,
    description,
    key: `${category}/${slug}`,
  };
}

function parseReadmeDiffLine(line) {
  if (line.startsWith("+++") || line.startsWith("---")) return null;
  if (!line.startsWith("+") && !line.startsWith("-")) return null;

  const diffKind = line.startsWith("+") ? "added" : "removed";
  const entry = parseReadmeEntryLine(line.slice(1));
  return entry ? { ...entry, diffKind } : null;
}

function countAddedReadmeCatalogLines(diffText) {
  return String(diffText || "")
    .split("\n")
    .filter((rawLine) => {
      const line = rawLine.replace(/\r$/, "");
      return (
        line.startsWith("+") &&
        !line.startsWith("+++") &&
        line.slice(1).startsWith(readmeLinePrefix)
      );
    }).length;
}

export function extractReadmeEntryChanges(diffText) {
  const removed = new Map();
  const added = new Map();

  for (const rawLine of String(diffText || "").split("\n")) {
    const parsed = parseReadmeDiffLine(rawLine.replace(/\r$/, ""));
    if (!parsed) continue;

    if (parsed.diffKind === "removed") {
      removed.set(parsed.key, parsed);
    } else {
      added.set(parsed.key, parsed);
    }
  }

  return [...added.values()]
    .map((entry) => ({
      title: entry.title,
      category: entry.category,
      slug: entry.slug,
      description: entry.description,
      key: entry.key,
      changeType: removed.has(entry.key) ? "updated" : "added",
    }))
    .sort((a, b) => {
      const categoryDelta =
        (categoryRank.get(a.category) ?? Number.MAX_SAFE_INTEGER) -
        (categoryRank.get(b.category) ?? Number.MAX_SAFE_INTEGER);
      if (categoryDelta !== 0) return categoryDelta;
      return a.title.localeCompare(b.title);
    });
}

export function assertReadmeEntryExtraction(diffText, changes) {
  const addedCatalogLineCount = countAddedReadmeCatalogLines(diffText);
  const parsedChangeCount = changes.length;
  if (addedCatalogLineCount !== parsedChangeCount) {
    throw new Error(
      `README diff includes ${addedCatalogLineCount} added catalog entry line(s), but ${parsedChangeCount} parsed change(s) were produced. Update the README refresh parser before publishing a misleading accumulator summary.`,
    );
  }
}

function getReadmeDiff(repoRoot) {
  return execFileSync("git", ["diff", "--unified=0", "--", "README.md"], {
    cwd: repoRoot,
    encoding: "utf8",
  });
}

function latestCommitForPath(repoRoot, relativePath) {
  try {
    return execFileSync(
      "git",
      ["log", "-n", "1", "--format=%H", "--", relativePath],
      {
        cwd: repoRoot,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      },
    ).trim();
  } catch {
    return "";
  }
}

function addedCommitForPath(repoRoot, relativePath) {
  try {
    return execFileSync(
      "git",
      ["log", "-n", "1", "--diff-filter=A", "--format=%H", "--", relativePath],
      {
        cwd: repoRoot,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      },
    ).trim();
  } catch {
    return "";
  }
}

function commitForReadmeChange(repoRoot, relativePath, changeType) {
  if (changeType === "added") {
    return (
      addedCommitForPath(repoRoot, relativePath) ||
      latestCommitForPath(repoRoot, relativePath)
    );
  }

  return latestCommitForPath(repoRoot, relativePath);
}

async function fetchAssociatedPullRequest({ repository, commitSha, token }) {
  if (!repository || !commitSha || !token) return null;

  const response = await fetch(
    `https://api.github.com/repos/${repository}/commits/${commitSha}/pulls`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
  );

  if (!response.ok) {
    console.warn(
      `Could not resolve associated PR for ${commitSha}: ${response.status} ${response.statusText}`,
    );
    return null;
  }

  const pullRequests = await response.json();
  if (!Array.isArray(pullRequests) || pullRequests.length === 0) {
    return null;
  }

  return (
    pullRequests.find((pullRequest) => pullRequest.merged_at) ?? pullRequests[0]
  );
}

function readContentFrontmatter(repoRoot, change) {
  const categoryDir = path.join(repoRoot, "content", change.category);
  const directRelativePath = path.join(
    "content",
    change.category,
    `${change.slug}.mdx`,
  );
  const directPath = path.join(repoRoot, directRelativePath);

  let relativePath = directRelativePath;
  let contentPath = directPath;

  if (!fs.existsSync(contentPath)) {
    if (!fs.existsSync(categoryDir)) {
      throw new Error(
        `README entry ${change.key} does not map to ${directRelativePath}.`,
      );
    }

    const candidate = fs.readdirSync(categoryDir).find((name) => {
      if (!name.endsWith(".mdx")) return false;
      {
        const source = fs.readFileSync(path.join(categoryDir, name), "utf8");
        const { data } = parseSafeFrontmatter(source);
        return String(data.slug ?? name.replace(/\.mdx$/, "")) === change.slug;
      }
    });

    if (!candidate) {
      throw new Error(
        `README entry ${change.key} does not map to ${directRelativePath}.`,
      );
    }

    relativePath = path.join("content", change.category, candidate);
    contentPath = path.join(repoRoot, relativePath);
  }

  const { data } = parseSafeFrontmatter(fs.readFileSync(contentPath, "utf8"));
  return { relativePath, data };
}

export function summarizeReadmeEntryChange({
  change,
  frontmatter = {},
  associatedPullRequest = null,
  repository = "",
}) {
  const action = change.changeType === "updated" ? "Updated" : "Added";
  const title = formatReadmeEntryLink(change, frontmatter);
  const sourceSubmissionNumber = frontmatter.sourceSubmissionNumber;
  const pullRequestNumber =
    frontmatter.importPrNumber ?? associatedPullRequest?.number;
  const pullRequestLink = formatPullRequestLink({
    number: pullRequestNumber,
    repository,
    htmlUrl:
      pullRequestNumber === associatedPullRequest?.number
        ? associatedPullRequest?.html_url
        : "",
  });
  const contributor = frontmatter.submittedBy
    ? formatGithubProfileLink(frontmatter.submittedBy)
    : formatGithubProfileLink(associatedPullRequest?.user?.login);

  const pieces = [`${action} ${title} content submission`];
  if (pullRequestLink) pieces.push(`(${pullRequestLink})`);
  if (contributor) pieces.push(`by ${contributor}`);
  if (sourceSubmissionNumber) {
    pieces.push(`via submission #${sourceSubmissionNumber}`);
  }

  return pieces.join(" ");
}

export async function resolveReadmeEntryChange(change, options = {}) {
  const repoRoot = options.repoRoot ?? process.cwd();
  const { relativePath, data } = readContentFrontmatter(repoRoot, change);
  const repository = options.repository ?? process.env.GITHUB_REPOSITORY;
  const commitSha = commitForReadmeChange(
    repoRoot,
    relativePath,
    change.changeType,
  );
  const associatedPullRequest = await fetchAssociatedPullRequest({
    repository,
    commitSha,
    token: options.token ?? process.env.GITHUB_TOKEN,
  });

  return {
    ...change,
    relativePath,
    commitSha,
    associatedPullRequest,
    summary: summarizeReadmeEntryChange({
      change,
      frontmatter: data,
      associatedPullRequest,
      repository,
    }),
  };
}

export function buildReadmeRefreshBody(resolvedChanges) {
  const count = resolvedChanges.length;
  const contentLines = resolvedChanges.length
    ? resolvedChanges.map((change) => `- ${change.summary}`).join("\n")
    : "- No individual catalog entries were detected from the README diff.";

  return `## Summary
Automated README refresh after content or generator changes on \`main\`. This PR intentionally reuses the \`automation/readme-refresh\` branch, so pending README changes accumulate in one reviewable PR instead of creating one PR per accepted content item.

## Pending content included (${count})
${contentLines}

## What changed
- Regenerated \`README.md\` from repository content.

## Why
- Keep README listing in sync without manual maintenance.
`;
}

function parseArgs(argv) {
  const args = {
    output: ".github/readme-refresh-body.md",
    repoRoot: process.cwd(),
    diffFile: "",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--output") {
      args.output = argv[++index];
    } else if (arg === "--repo-root") {
      args.repoRoot = argv[++index];
    } else if (arg === "--diff-file") {
      args.diffFile = argv[++index];
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return args;
}

export async function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const repoRoot = path.resolve(args.repoRoot);
  const outputPath = path.resolve(repoRoot, args.output);
  const diffText = args.diffFile
    ? fs.readFileSync(path.resolve(repoRoot, args.diffFile), "utf8")
    : getReadmeDiff(repoRoot);
  const changes = extractReadmeEntryChanges(diffText);
  assertReadmeEntryExtraction(diffText, changes);
  const resolvedChanges = [];

  for (const change of changes) {
    resolvedChanges.push(await resolveReadmeEntryChange(change, { repoRoot }));
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, buildReadmeRefreshBody(resolvedChanges));
  console.log(`Wrote ${path.relative(repoRoot, outputPath)}`);
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  await main();
}
