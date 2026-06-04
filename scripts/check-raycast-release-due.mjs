#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

import {
  buildRaycastReleaseIssue,
  buildRaycastReleaseReport,
  latestSemverTag,
  RAYCAST_RELEASE_DUE_MARKER,
} from "./lib/release-watch-core.mjs";

const PACKAGE_JSON_PATH = "integrations/raycast/package.json";

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const packageJson = JSON.parse(readFileSync(PACKAGE_JSON_PATH, "utf8"));
  const latestTag = latestSemverTag(readTags("raycast-v*"), "raycast-v");
  const commits = readCommits(latestTag ? `${latestTag.tag}..HEAD` : "HEAD");
  const report = buildRaycastReleaseReport({
    latestTag,
    packageVersion: packageJson.version,
    commits,
  });

  if (args.output)
    writeFileSync(args.output, `${JSON.stringify(report, null, 2)}\n`);
  if (args.upsertIssue && report.due) {
    await upsertIssue({
      marker: RAYCAST_RELEASE_DUE_MARKER,
      issue: buildRaycastReleaseIssue(report),
      userAgent: "heyclaude-raycast-release-watch",
    });
  }
  if (args.json) process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (!args.json && !args.output) {
    process.stdout.write(
      report.due
        ? `Raycast update due: ${report.proposedVersion}\n`
        : "No Raycast update due.\n",
    );
  }
}

function parseArgs(argv) {
  const args = { json: false, output: null, upsertIssue: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--json") {
      args.json = true;
    } else if (arg === "--output") {
      args.output = argv[++index];
    } else if (arg === "--upsert-issue") {
      args.upsertIssue = true;
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }
  return args;
}

function readTags(pattern) {
  return git(["tag", "--list", pattern, "--sort=-v:refname"])
    .split("\n")
    .filter(Boolean);
}

function readCommits(revisionRange) {
  const format = "%x1e%H%x1f%s";
  return git([
    "log",
    "--reverse",
    "--no-merges",
    `--format=${format}`,
    revisionRange,
  ])
    .split("\x1e")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [sha, subject] = entry.split("\x1f");
      return {
        sha,
        subject: subject?.split("\n")[0] ?? "",
        files: readCommitFiles(sha),
      };
    });
}

function readCommitFiles(sha) {
  return git(["diff-tree", "--no-commit-id", "--name-only", "-r", sha])
    .split("\n")
    .filter(Boolean);
}

function git(args) {
  return execFileSync("git", args, { encoding: "utf8" });
}

async function upsertIssue({ marker, issue, userAgent }) {
  const repository = process.env.GITHUB_REPOSITORY;
  const token = process.env.GITHUB_TOKEN;
  if (!repository)
    throw new Error("GITHUB_REPOSITORY is required for --upsert-issue");
  if (!token) throw new Error("GITHUB_TOKEN is required for --upsert-issue");
  const [owner, repo] = repository.split("/");
  if (!owner || !repo)
    throw new Error(`Invalid GITHUB_REPOSITORY: ${repository}`);

  const existingIssue = await findExistingIssue({
    owner,
    repo,
    token,
    marker,
    userAgent,
  });
  if (existingIssue) {
    await githubRequest({
      token,
      userAgent,
      method: "PATCH",
      path: `/repos/${owner}/${repo}/issues/${existingIssue.number}`,
      body: {
        title: issue.title,
        body: issue.body,
        labels: issue.labels,
        assignees: issue.assignees,
      },
    });
    process.stdout.write(
      `Updated issue #${existingIssue.number}: ${issue.title}\n`,
    );
    return;
  }

  const created = await githubRequest({
    token,
    userAgent,
    method: "POST",
    path: `/repos/${owner}/${repo}/issues`,
    body: issue,
  });
  process.stdout.write(`Opened issue #${created.number}: ${issue.title}\n`);
}

async function findExistingIssue({ owner, repo, token, marker, userAgent }) {
  for (let page = 1; page <= 10; page += 1) {
    const issues = await githubRequest({
      token,
      userAgent,
      method: "GET",
      path: `/repos/${owner}/${repo}/issues?state=open&per_page=100&page=${page}`,
    });
    if (!Array.isArray(issues) || issues.length === 0) return null;
    const match = issues.find(
      (issue) =>
        !issue.pull_request &&
        typeof issue.body === "string" &&
        issue.body.includes(marker),
    );
    if (match) return match;
  }
  return null;
}

async function githubRequest({ token, userAgent, method, path, body }) {
  const response = await fetch(`https://api.github.com${path}`, {
    method,
    headers: {
      accept: "application/vnd.github+json",
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      "user-agent": userAgent,
      "x-github-api-version": "2022-11-28",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const message = payload?.message ?? response.statusText;
    throw new Error(
      `GitHub API ${method} ${path} failed: ${response.status} ${message}`,
    );
  }
  return payload;
}

const entrypointPath = process.argv[1] ? resolve(process.argv[1]) : "";
if (import.meta.url === pathToFileURL(entrypointPath).href) {
  main().catch((error) => {
    process.stderr.write(
      `${error instanceof Error ? error.message : String(error)}\n`,
    );
    process.exit(1);
  });
}
