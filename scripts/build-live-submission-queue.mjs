import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

import {
  buildSubmissionQueue,
  looksLikeSubmissionIssue,
} from "@heyclaude/registry/submission";

const defaultRepo = "JSONbored/awesome-claude";

function argValue(flag) {
  const idx = process.argv.indexOf(flag);
  if (idx < 0) return "";
  return process.argv[idx + 1] ?? "";
}

function usage() {
  return [
    "Usage: node scripts/build-live-submission-queue.mjs [--repo owner/name] [--output reports/submission-queue.json] [--now <iso>]",
    "",
    "Fetches live GitHub issues with gh, hydrates comments/timeline edits, writes the queue JSON, and prints a concise maintainer table.",
  ].join("\n");
}

function runGh(args, options = {}) {
  const result = spawnSync("gh", args, {
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 32,
    ...options,
  });
  if (result.error?.code === "ENOENT") {
    throw new Error(
      "GitHub CLI not found. Install gh and authenticate before running pnpm submission:queue:live.",
    );
  }
  if (result.status !== 0) {
    const stderr = String(result.stderr || "").trim();
    throw new Error(
      stderr || `gh ${args.join(" ")} failed with exit ${result.status}`,
    );
  }
  return String(result.stdout || "");
}

function runGhJson(args) {
  const output = runGh(args);
  return output.trim() ? JSON.parse(output) : null;
}

function ensureGhAuth() {
  runGh(["--version"]);
  const result = spawnSync(
    "gh",
    ["auth", "status", "--hostname", "github.com"],
    {
      encoding: "utf8",
      maxBuffer: 1024 * 1024,
    },
  );
  if (result.error?.code === "ENOENT") {
    throw new Error(
      "GitHub CLI not found. Install gh and authenticate before running pnpm submission:queue:live.",
    );
  }
  if (result.status !== 0) {
    throw new Error(
      "GitHub CLI is not authenticated for github.com. Run gh auth login, then retry pnpm submission:queue:live.",
    );
  }
}

function flattenGhPages(payload) {
  if (!Array.isArray(payload)) return [];
  if (payload.every((item) => Array.isArray(item))) return payload.flat();
  return payload;
}

function ghApiPaginated(repo, suffix) {
  const payload = runGhJson([
    "api",
    "--paginate",
    "--slurp",
    `repos/${repo}/${suffix}`,
  ]);
  return flattenGhPages(payload);
}

function ghApiPaginatedOptional(repo, suffix) {
  try {
    return ghApiPaginated(repo, suffix);
  } catch {
    return [];
  }
}

function normalizeIssue(issue) {
  return {
    number: issue.number,
    title: issue.title,
    body: issue.body || "",
    url: issue.html_url,
    updatedAt: issue.updated_at,
    createdAt: issue.created_at,
    author: issue.user?.login || "",
    labels: issue.labels || [],
  };
}

async function main() {
  if (process.argv.includes("--help") || process.argv.includes("-h")) {
    console.log(usage());
    return;
  }

  ensureGhAuth();

  const repo =
    argValue("--repo") || process.env.GITHUB_REPOSITORY || defaultRepo;
  const outputPath =
    argValue("--output") || path.join("reports", "submission-queue.json");
  const now = argValue("--now") || new Date().toISOString();
  const rawIssues = ghApiPaginated(repo, "issues?state=open&per_page=100")
    .filter((issue) => !issue.pull_request)
    .map(normalizeIssue)
    .filter(looksLikeSubmissionIssue);

  const issues = [];
  for (const issue of rawIssues) {
    issues.push({
      ...issue,
      comments: ghApiPaginatedOptional(
        repo,
        `issues/${issue.number}/comments?per_page=100`,
      ),
      timeline: ghApiPaginatedOptional(
        repo,
        `issues/${issue.number}/timeline?per_page=100`,
      ),
    });
  }

  const queue = buildSubmissionQueue(issues, { now });
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(queue, null, 2)}\n`);

  const relativeOutput = path.relative(process.cwd(), outputPath);
  console.log(
    `Wrote ${queue.count} submission queue entries to ${relativeOutput}`,
  );
  console.log(
    `ready=${queue.summary.ready} needs_author_input=${queue.summary.needsAuthorInput} stale=${queue.summary.stale} close_eligible=${queue.summary.closeEligible} skipped=${queue.summary.skipped}`,
  );
  console.log("");
  console.log(
    "Issue  Group                Status                    Action                    Body edited           Author follow-up  Title",
  );
  console.log(
    "-----  -------------------  ------------------------  ------------------------  --------------------  ----------------  -----",
  );
  for (const entry of queue.entries) {
    const title =
      entry.title.length > 58 ? `${entry.title.slice(0, 55)}...` : entry.title;
    console.log(
      [
        `#${String(entry.number ?? "-").padEnd(4)}`,
        String(entry.triageGroup || "-").padEnd(19),
        String(entry.status || "-").padEnd(24),
        String(entry.nextAction || "-").padEnd(24),
        String(entry.bodyUpdatedAt || "-")
          .slice(0, 19)
          .padEnd(20),
        String(
          entry.authorCommentedWithoutBodyUpdate ? "body edit needed" : "-",
        )
          .slice(0, 16)
          .padEnd(16),
        title,
      ].join("  "),
    );
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
