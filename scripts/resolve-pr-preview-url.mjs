#!/usr/bin/env node
import fs from "node:fs";
import { pathToFileURL } from "node:url";

const githubUrlPattern = /^https:\/\/github\.com\//i;
const blockedPreviewHosts = new Set([
  "app.coderabbit.ai",
  "canary.discord.com",
  "coderabbit.ai",
  "discord.com",
  "discordapp.com",
  "ptb.discord.com",
  "superagent.sh",
]);
const nonDeploymentSourcePattern =
  /(?:coderabbit|superagent|contributor trust|pipelock|codeql|trunk|security scan|repo scan)/i;

// A preview URL for this project must be a HeyClaude PRODUCTION host. This
// Cloudflare account hosts several unrelated projects, so GitHub
// deployment/status lookups can surface a sibling project's URL (e.g.
// gittensory.aethereal.dev) — running the artifact contract against that is
// wrong. Accept only the production site and Cloudflare Workers Builds preview
// aliases for the prod worker (<version>-heyclaude-prod.<subdomain>.workers.dev).
// Deliberately excludes the retired dev worker (heyclaude-dev.*.workers.dev and
// dev.heyclau.de).
function isHeyClaudePreviewHost(hostname) {
  const host = String(hostname || "").toLowerCase();
  return (
    host === "heyclau.de" ||
    host === "www.heyclau.de" ||
    (host.endsWith(".workers.dev") && host.includes("heyclaude-prod"))
  );
}

export function normalizeBaseUrl(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:" && url.protocol !== "http:") return "";
    url.pathname = url.pathname.replace(/\/+$/, "");
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return "";
  }
}

export function selectPreviewUrl(candidates) {
  for (const candidate of candidates) {
    const url = normalizeBaseUrl(candidate?.url || candidate);
    if (!url) continue;
    if (githubUrlPattern.test(url)) continue;
    if (nonDeploymentSourcePattern.test(String(candidate?.source || ""))) {
      continue;
    }
    try {
      const parsed = new URL(url);
      if (blockedPreviewHosts.has(parsed.hostname.toLowerCase())) continue;
      if (!isHeyClaudePreviewHost(parsed.hostname)) continue;
    } catch {
      continue;
    }
    return {
      url,
      source: candidate?.source || "candidate",
    };
  }
  return null;
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const next = argv[index + 1];
    args[key] = next && !next.startsWith("--") ? next : "1";
    if (args[key] === next) index += 1;
  }
  return args;
}

function readGithubEvent(eventPath) {
  if (!eventPath || !fs.existsSync(eventPath)) return {};
  return JSON.parse(fs.readFileSync(eventPath, "utf8"));
}

function previewCandidatesFromEnv(env = process.env) {
  const candidates = [
    { url: env.PREVIEW_DEPLOYMENT_URL, source: "PREVIEW_DEPLOYMENT_URL" },
    {
      url: env.DEPLOYMENT_PREVIEW_BASE_URL,
      source: "DEPLOYMENT_PREVIEW_BASE_URL",
    },
    { url: env.CLOUDFLARE_PREVIEW_URL, source: "CLOUDFLARE_PREVIEW_URL" },
  ];
  if (env.ALLOW_SHARED_DEV_WORKER_PREVIEW === "1") {
    candidates.push({
      url: env.CLOUDFLARE_DEV_WORKER_URL,
      source: "CLOUDFLARE_DEV_WORKER_URL",
    });
  }
  return candidates;
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function githubJson(pathname, env = process.env) {
  const token = env.GITHUB_TOKEN;
  const repository = env.GITHUB_REPOSITORY;
  if (!token || !repository) return null;
  const apiBase = String(
    env.GITHUB_API_URL || "https://api.github.com",
  ).replace(/\/$/, "");
  const response = await fetch(`${apiBase}/repos/${repository}${pathname}`, {
    headers: {
      accept: "application/vnd.github+json",
      authorization: `Bearer ${token}`,
      "x-github-api-version": "2022-11-28",
    },
  });
  if (!response.ok) {
    throw new Error(`GitHub API ${pathname} returned ${response.status}`);
  }
  return response.json();
}

function deploymentQueries(event, env = process.env) {
  const pullRequest = event.pull_request || {};
  return [
    pullRequest.head?.sha ? { sha: pullRequest.head.sha } : null,
    pullRequest.head?.ref ? { ref: pullRequest.head.ref } : null,
    env.GITHUB_HEAD_REF ? { ref: env.GITHUB_HEAD_REF } : null,
    env.GITHUB_REF_NAME ? { ref: env.GITHUB_REF_NAME } : null,
    env.GITHUB_SHA ? { sha: env.GITHUB_SHA } : null,
  ].filter(Boolean);
}

function headSha(event, env = process.env) {
  const pullRequest = event.pull_request || {};
  return pullRequest.head?.sha || env.GITHUB_SHA || "";
}

export async function resolveFromGithubDeployments(event, env = process.env) {
  const seen = new Set();
  for (const query of deploymentQueries(event, env)) {
    const params = new URLSearchParams({ per_page: "100", ...query });
    const key = params.toString();
    if (seen.has(key)) continue;
    seen.add(key);
    const deployments = await githubJson(`/deployments?${params}`, env);
    if (!Array.isArray(deployments)) continue;
    for (const deployment of deployments) {
      const statuses = await githubJson(
        `/deployments/${deployment.id}/statuses?per_page=20`,
        env,
      );
      const statusCandidates = Array.isArray(statuses)
        ? statuses
            .filter((status) => status.state === "success")
            .flatMap((status) => [
              {
                url: status.environment_url,
                source: `github-deployment:${deployment.environment || deployment.id}`,
              },
              {
                url: status.target_url,
                source: `github-deployment:${deployment.environment || deployment.id}`,
              },
            ])
        : [];
      const selected = selectPreviewUrl(statusCandidates);
      if (selected) return selected;
    }
  }
  return null;
}

export async function resolveFromGithubStatuses(event, env = process.env) {
  const sha = headSha(event, env);
  if (!sha) return null;

  const combined = await githubJson(`/commits/${sha}/status`, env);
  const statusCandidates = Array.isArray(combined?.statuses)
    ? combined.statuses
        .filter((status) => status.state === "success")
        .flatMap((status) => [
          {
            url: status.environment_url,
            source: `github-status:${status.context || "status"}`,
          },
          {
            url: status.target_url,
            source: `github-status:${status.context || "status"}`,
          },
        ])
    : [];
  const selectedStatus = selectPreviewUrl(statusCandidates);
  if (selectedStatus) return selectedStatus;

  const checkRuns = await githubJson(
    `/commits/${sha}/check-runs?per_page=100`,
    env,
  );
  const checkCandidates = Array.isArray(checkRuns?.check_runs)
    ? checkRuns.check_runs
        .filter(
          (checkRun) =>
            checkRun.status === "completed" &&
            checkRun.conclusion === "success",
        )
        .flatMap((checkRun) => [
          {
            url: checkRun.details_url,
            source: `github-check:${checkRun.name || "check-run"}`,
          },
          {
            url: checkRun.output?.summary,
            source: `github-check:${checkRun.name || "check-run"}`,
          },
        ])
    : [];
  return selectPreviewUrl(checkCandidates);
}

function prNumber(event, env = process.env) {
  const fromEvent = event?.pull_request?.number ?? event?.number;
  if (fromEvent) return Number(fromEvent);
  // refs/pull/<n>/merge (or /head) when no event file is present.
  const match = String(env.GITHUB_REF || "").match(/refs\/pull\/(\d+)\//);
  return match ? Number(match[1]) : null;
}

// Cloudflare Workers Builds publishes per-PR preview URLs ONLY in a pull-request COMMENT (by
// cloudflare-workers-and-pages[bot]) — never as a GitHub deployment, commit status, or check-run. So the
// deployment/status/check-run lookups above can never find it; this reads the comment. Prefer the stable
// "Branch Preview URL" (always points at the latest successful branch deploy, so it's correct even when the
// PR head is a commit Workers Builds skipped via build-watch-paths) and fall back to the per-commit URL.
export async function resolveFromPrComments(event, env = process.env) {
  const pr = prNumber(event, env);
  if (!pr) return null;
  const comments = await githubJson(`/issues/${pr}/comments?per_page=100`, env);
  if (!Array.isArray(comments)) return null;
  const branch = [];
  const commit = [];
  const anchor =
    /<a\s+href=['"]([^'"]+)['"]\s*>\s*([^<]*?Preview URL)\s*<\/a>/gi;
  for (const comment of comments) {
    // EXACT bot login only — the `[bot]` suffix is GitHub-reserved and unspoofable, so a public-repo user
    // with "cloudflare" in their name can't post a comment with a spoofed preview URL (Superagent P2). This
    // mirrors the same hardening in reviewbot's capture.ts findPreviewUrlFromPrComments.
    if ((comment?.user?.login ?? "") !== "cloudflare-workers-and-pages[bot]")
      continue;
    const body = String(comment.body || "");
    let match;
    while ((match = anchor.exec(body)) !== null) {
      const url = match[1];
      const label = match[2].toLowerCase();
      if (label.includes("branch"))
        branch.push({ url, source: "cf-comment:branch" });
      else if (label.includes("commit"))
        commit.push({ url, source: "cf-comment:commit" });
    }
  }
  return selectPreviewUrl([...branch, ...commit]);
}

async function resolvePreviewUrlOnce(args, env = process.env) {
  const explicit = selectPreviewUrl([
    { url: args["base-url"], source: "cli" },
    ...previewCandidatesFromEnv(env),
  ]);
  if (explicit) return explicit;

  const event = readGithubEvent(args["event-path"] || env.GITHUB_EVENT_PATH);
  const fromDeployments = await resolveFromGithubDeployments(event, env);
  if (fromDeployments) return fromDeployments;

  // Cloudflare Workers Builds reports the preview URL via a PR comment, so try that before statuses/checks.
  const fromComments = await resolveFromPrComments(event, env);
  if (fromComments) return fromComments;

  return resolveFromGithubStatuses(event, env);
}

function writeOutput(file, values) {
  const body = Object.entries(values)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");
  fs.appendFileSync(file, `${body}\n`);
}

export async function resolvePreviewUrl(args, env = process.env) {
  const waitSeconds = Math.max(
    0,
    Number(args["wait-seconds"] || env.PR_PREVIEW_WAIT_SECONDS || 0),
  );
  const pollSeconds = Math.max(
    1,
    Number(args["poll-seconds"] || env.PR_PREVIEW_POLL_SECONDS || 15),
  );
  const deadline = Date.now() + waitSeconds * 1000;

  while (true) {
    const selected = await resolvePreviewUrlOnce(args, env);
    if (selected) return selected;
    if (Date.now() >= deadline) return null;
    console.log(`No PR preview URL resolved yet. Waiting ${pollSeconds}s...`);
    await sleep(pollSeconds * 1000);
  }
}

export async function main(argv = process.argv.slice(2), env = process.env) {
  const args = parseArgs(argv);
  const selected = await resolvePreviewUrl(args, env);
  const allowMissing = args["allow-missing"] === "1";
  if (!selected) {
    if (allowMissing) {
      console.log("No PR preview URL resolved.");
      return null;
    }
    throw new Error(
      "Could not resolve a PR preview URL from the deploy step, preview env vars, or GitHub deployment statuses.",
    );
  }

  const outputFile = args.output || env.GITHUB_OUTPUT;
  if (outputFile) {
    writeOutput(outputFile, {
      "base-url": selected.url,
      source: selected.source,
    });
  }
  console.log(`Resolved PR preview URL: ${selected.url} (${selected.source})`);
  return selected;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
