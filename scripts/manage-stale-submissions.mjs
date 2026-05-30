import {
  buildSubmissionQueue,
  looksLikeSubmissionIssue,
  validateSubmission,
} from "@heyclaude/registry/submission";
import {
  SUBMISSION_NEEDS_AUTHOR_INPUT_LABEL,
  SUBMISSION_SOURCE_NEEDS_VERIFICATION_LABEL,
  SUBMISSION_STALE_LABEL,
  SUBMISSION_VALIDATION_LABEL_DEFINITIONS,
} from "@heyclaude/registry/submission-labels";
import { lookup } from "node:dns/promises";
import net from "node:net";
import { pathToFileURL } from "node:url";

const apiBaseUrl = "https://api.github.com";
const marker = "<!-- heyclaude-stale-submission -->";
const managedLabels = new Set([
  SUBMISSION_NEEDS_AUTHOR_INPUT_LABEL,
  SUBMISSION_SOURCE_NEEDS_VERIFICATION_LABEL,
  SUBMISSION_STALE_LABEL,
]);

function hasFlag(flag) {
  return process.argv.includes(flag);
}

function argValue(flag) {
  const idx = process.argv.indexOf(flag);
  if (idx < 0) return "";
  return process.argv[idx + 1] ?? "";
}

function repoParts() {
  const raw = argValue("--repo") || process.env.GITHUB_REPOSITORY || "";
  const [owner, repo] = raw.split("/");
  if (!owner || !repo) {
    throw new Error("Set GITHUB_REPOSITORY or pass --repo owner/name.");
  }
  return { owner, repo };
}

async function githubJson(path, options = {}) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN is required.");
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      accept: "application/vnd.github+json",
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      "user-agent": "heyclaude-submission-stale-manager",
      "x-github-api-version": "2022-11-28",
      ...(options.headers || {}),
    },
  });
  if (response.status === 204) return null;
  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new Error(
      `GitHub API ${options.method || "GET"} ${path} failed with ${response.status}: ${text}`,
    );
  }
  return payload;
}

async function githubPaginate(path) {
  const output = [];
  for (let page = 1; ; page += 1) {
    const separator = path.includes("?") ? "&" : "?";
    const payload = await githubJson(
      `${path}${separator}per_page=100&page=${page}`,
    );
    if (!Array.isArray(payload) || payload.length === 0) break;
    output.push(...payload);
    if (payload.length < 100) break;
  }
  return output;
}

async function ensureLabels(owner, repo) {
  for (const [name, definition] of Object.entries(
    SUBMISSION_VALIDATION_LABEL_DEFINITIONS,
  )) {
    const path = `/repos/${owner}/${repo}/labels/${encodeURIComponent(name)}`;
    try {
      await githubJson(path, {
        method: "PATCH",
        body: JSON.stringify(definition),
      });
    } catch (error) {
      if (!String(error.message).includes("404")) throw error;
      await githubJson(`/repos/${owner}/${repo}/labels`, {
        method: "POST",
        body: JSON.stringify({ name, ...definition }),
      });
    }
  }
}

async function addLabels(owner, repo, issueNumber, labels) {
  if (!labels.length) return;
  await githubJson(`/repos/${owner}/${repo}/issues/${issueNumber}/labels`, {
    method: "POST",
    body: JSON.stringify({ labels }),
  });
}

async function listComments(owner, repo, issueNumber) {
  return githubPaginate(
    `/repos/${owner}/${repo}/issues/${issueNumber}/comments`,
  );
}

async function listTimeline(owner, repo, issueNumber) {
  return githubPaginate(
    `/repos/${owner}/${repo}/issues/${issueNumber}/timeline`,
  );
}

async function upsertReminder(owner, repo, issueNumber, body) {
  const comments = await listComments(owner, repo, issueNumber);
  const existing = comments.find((comment) => comment.body?.includes(marker));
  if (existing) {
    await githubJson(`/repos/${owner}/${repo}/issues/comments/${existing.id}`, {
      method: "PATCH",
      body: JSON.stringify({ body }),
    });
    return;
  }
  await githubJson(`/repos/${owner}/${repo}/issues/${issueNumber}/comments`, {
    method: "POST",
    body: JSON.stringify({ body }),
  });
}

async function closeIssue(owner, repo, issueNumber) {
  await githubJson(`/repos/${owner}/${repo}/issues/${issueNumber}`, {
    method: "PATCH",
    body: JSON.stringify({
      state: "closed",
      state_reason: "not_planned",
    }),
  });
}

function reminderBody(entry) {
  const lines = [
    marker,
    "Thanks for submitting this entry. The validation queue still needs author input before maintainers can review it for import.",
    "",
    "Please edit the original issue body with the missing or corrected fields shown in the validation report. Comments are useful for discussion, but they do not update the validation source of truth or reset the stale timer. After you update the issue body, the submission validator will rerun automatically.",
  ];
  if (entry.errors.length) {
    lines.push("", "Current blockers:");
    for (const error of entry.errors) lines.push(`- ${error}`);
  }
  lines.push(
    "",
    "If there is no issue-body update after the stale window, maintainers may close this issue as not planned. You can reopen or resubmit when the missing details are ready.",
  );
  return lines.join("\n");
}

function closeBody(entry) {
  const lines = [
    marker,
    "Closing this submission as not planned because it has been waiting on author input past the stale window.",
    "",
    "This is not a rejection of the project. Please reopen this issue or submit a new one when the missing fields or source details are ready in the issue body.",
  ];
  if (entry.errors.length) {
    lines.push("", "Last known blockers:");
    for (const error of entry.errors) lines.push(`- ${error}`);
  }
  return lines.join("\n");
}

export function planStaleSubmissionAction(entry, sourceCheckLabels = []) {
  const existingLabels = new Set(entry.labels);
  const labels = new Set([...entry.recommendedLabels, ...sourceCheckLabels]);
  const nextLabels = [...labels].filter(
    (label) => managedLabels.has(label) && !existingLabels.has(label),
  );
  const shouldRemind =
    (entry.status === "stale_reminder_due" ||
      entry.status === "close_eligible") &&
    !existingLabels.has(SUBMISSION_STALE_LABEL);
  const shouldClose =
    entry.status === "close_eligible" &&
    existingLabels.has(SUBMISSION_STALE_LABEL);

  return {
    issue: entry.number,
    status: entry.status,
    labels: nextLabels,
    remind: shouldRemind,
    close: shouldClose,
  };
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

async function hydrateIssueActivity(owner, repo, issue) {
  const normalized = normalizeIssue(issue);
  if (!looksLikeSubmissionIssue(normalized)) return null;
  const [comments, timeline] = await Promise.all([
    listComments(owner, repo, issue.number).catch(() => []),
    listTimeline(owner, repo, issue.number).catch(() => []),
  ]);
  return {
    ...normalized,
    comments,
    timeline,
  };
}

function isPrivateOrReservedIpv4(address) {
  const parts = address.split(".").map((part) => Number(part));
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part))) {
    return true;
  }
  const [a, b] = parts;
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    a >= 224 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 0) ||
    (a === 192 && b === 168) ||
    (a === 198 && (b === 18 || b === 19))
  );
}

function isPrivateOrReservedIpv6(address) {
  const normalized = address.toLowerCase();
  return (
    normalized === "::" ||
    normalized === "::1" ||
    normalized.startsWith("fc") ||
    normalized.startsWith("fd") ||
    normalized.startsWith("fe8") ||
    normalized.startsWith("fe9") ||
    normalized.startsWith("fea") ||
    normalized.startsWith("feb")
  );
}

export function isPublicIpAddress(address) {
  const family = net.isIP(address);
  if (family === 4) return !isPrivateOrReservedIpv4(address);
  if (family === 6) return !isPrivateOrReservedIpv6(address);
  return false;
}

async function safePublicHttpsUrl(value) {
  let parsed;
  try {
    parsed = new URL(String(value || ""));
  } catch {
    return "";
  }

  if (parsed.protocol !== "https:" || parsed.username || parsed.password) {
    return "";
  }

  const hostname = parsed.hostname.toLowerCase();
  if (
    !hostname ||
    hostname === "localhost" ||
    hostname.endsWith(".localhost")
  ) {
    return "";
  }

  if (net.isIP(hostname)) {
    return isPublicIpAddress(hostname) ? parsed.toString() : "";
  }

  try {
    const records = await lookup(hostname, { all: true, verbatim: false });
    if (
      !records.length ||
      records.some((record) => !isPublicIpAddress(record.address))
    ) {
      return "";
    }
  } catch {
    return "";
  }

  return parsed.toString();
}

async function fetchUrlForVerification(url, method) {
  let currentUrl = await safePublicHttpsUrl(url);
  if (!currentUrl) return null;

  for (let redirectCount = 0; redirectCount <= 3; redirectCount += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch(currentUrl, {
        method,
        redirect: "manual",
        signal: controller.signal,
      });
      if (
        response.status >= 300 &&
        response.status < 400 &&
        response.headers.has("location")
      ) {
        const nextUrl = new URL(
          response.headers.get("location"),
          currentUrl,
        ).toString();
        currentUrl = await safePublicHttpsUrl(nextUrl);
        if (!currentUrl) return null;
        continue;
      }
      return response;
    } finally {
      clearTimeout(timeout);
    }
  }

  return null;
}

export async function urlNeedsVerification(url) {
  if (!url) return false;
  try {
    let response = await fetchUrlForVerification(url, "HEAD");
    if (!response) return false;
    if (response.status === 405 || response.status === 403) {
      response = await fetchUrlForVerification(url, "GET");
    }
    return response?.status === 404 || response?.status === 410;
  } catch {
    return false;
  }
}

async function submissionSourceCheckLabels(issue) {
  const report = validateSubmission(issue);
  const urls = [
    report.fields.github_url,
    report.fields.docs_url,
    report.fields.download_url,
  ].filter(Boolean);
  for (const url of urls) {
    if (await urlNeedsVerification(url)) {
      return [SUBMISSION_SOURCE_NEEDS_VERIFICATION_LABEL];
    }
  }
  return [];
}

async function main() {
  const apply = hasFlag("--apply");
  const now = argValue("--now") || new Date().toISOString();
  const { owner, repo } = repoParts();
  const rawIssues = (
    await githubPaginate(`/repos/${owner}/${repo}/issues?state=open`)
  ).filter((issue) => !issue.pull_request);
  const issues = [];
  for (const issue of rawIssues) {
    const hydrated = await hydrateIssueActivity(owner, repo, issue);
    if (hydrated) issues.push(hydrated);
  }
  const queue = buildSubmissionQueue(issues, { now });
  const issuesByNumber = new Map(issues.map((issue) => [issue.number, issue]));

  if (apply) await ensureLabels(owner, repo);

  const actions = [];
  for (const entry of queue.entries) {
    const sourceCheckLabels = entry.number
      ? await submissionSourceCheckLabels(issuesByNumber.get(entry.number))
      : [];
    const action = planStaleSubmissionAction(entry, sourceCheckLabels);
    actions.push(action);

    if (!apply || !entry.number) continue;
    await addLabels(owner, repo, entry.number, action.labels);
    if (action.remind) {
      await upsertReminder(owner, repo, entry.number, reminderBody(entry));
    }
    if (action.close) {
      await upsertReminder(owner, repo, entry.number, closeBody(entry));
      await closeIssue(owner, repo, entry.number);
    }
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        mode: apply ? "apply" : "dry-run",
        now,
        count: queue.count,
        summary: queue.summary,
        actions,
      },
      null,
      2,
    ),
  );
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
