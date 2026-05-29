import { createApiFileRoute } from "@/lib/api/file-route";
import {
  normalizeCategory,
  looksLikeSubmissionIssue,
  parseIssueFormBody,
  slugify,
  submissionActivityState,
} from "@heyclaude/registry/submission";

import { submissionQueueQuerySchema } from "@/lib/api/contracts";
import { apiError, apiJson, createApiHandler, type InferApiQuery } from "@/lib/api/router";
import { logApiError, logApiWarn } from "@/lib/api-logs";
import { getCloudflareEnv } from "@/lib/cloudflare-env.server";

const GITHUB_API_VERSION = "2022-11-28";
const GITHUB_USER_AGENT = "HeyClaude/1.0 (+https://heyclau.de; JSONbored/awesome-claude)";
const DEFAULT_REPO = "JSONbored/awesome-claude";
const IMPORT_PR_PATTERN = /https:\/\/github\.com\/JSONbored\/awesome-claude\/pull\/\d+/i;

type GitHubLabel = string | { name?: string };

type GitHubIssue = {
  number: number;
  html_url: string;
  title: string;
  body?: string | null;
  user?: {
    login?: string;
    html_url?: string;
  } | null;
  labels?: GitHubLabel[];
  state: "open" | "closed";
  created_at: string;
  updated_at: string;
  closed_at?: string | null;
  comments_url?: string;
  pull_request?: unknown;
};

type GitHubComment = {
  body?: string | null;
  created_at?: string;
  createdAt?: string;
  user?: {
    login?: string;
  } | null;
  author?: {
    login?: string;
  } | null;
};

type GitHubTimelineEvent = {
  event?: string;
  created_at?: string;
  createdAt?: string;
  changes?: Record<string, unknown>;
};

function envValue(env: Record<string, unknown>, names: string[]) {
  for (const name of names) {
    const value = String(env[name] ?? process.env[name] ?? "").trim();
    if (value) return value;
  }
  return "";
}

function githubHeaders(token: string) {
  return {
    accept: "application/vnd.github+json",
    ...(token ? { authorization: `Bearer ${token}` } : {}),
    "user-agent": GITHUB_USER_AGENT,
    "x-github-api-version": GITHUB_API_VERSION,
  };
}

function labelNames(issue: GitHubIssue) {
  return (issue.labels ?? [])
    .map((label) => (typeof label === "string" ? label : String(label.name ?? "")))
    .map((label) => label.trim())
    .filter(Boolean);
}

function hasLabel(labels: string[], label: string) {
  const needle = label.toLowerCase();
  return labels.some((item) => item.toLowerCase() === needle);
}

function parseCategory(labels: string[], fields: Record<string, string>) {
  const communityLabel = labels.find((label) => label.toLowerCase().startsWith("community-"));
  if (communityLabel) {
    const category = normalizeCategory(communityLabel.slice("community-".length));
    if (category) return category;
  }
  return normalizeCategory(fields.category) || "unknown";
}

function parseSlug(issue: GitHubIssue, fields: Record<string, string>) {
  const explicit = String(fields.slug || "").trim();
  if (explicit) return explicit;
  const fromName = slugify(fields.name || issue.title.replace(/^submit\s+[^:]+:\s*/i, ""));
  return fromName || `issue-${issue.number}`;
}

function statusFor(issue: GitHubIssue, labels: string[]) {
  if (issue.state === "closed") {
    return hasLabel(labels, "import-pr-open") || hasLabel(labels, "accepted")
      ? "imported"
      : "closed";
  }
  if (hasLabel(labels, "needs-author-input")) return "needs_author_input";
  if (hasLabel(labels, "source-needs-verification")) {
    return "source_needs_verification";
  }
  if (hasLabel(labels, "stale-submission")) return "stale";
  if (hasLabel(labels, "import-pr-open")) return "import_pr_open";
  if (hasLabel(labels, "import-approved") || hasLabel(labels, "accepted")) {
    return "approved";
  }
  if (hasLabel(labels, "auto-import-eligible")) return "ready";
  if (hasLabel(labels, "needs-review")) return "in_review";
  return "queued";
}

function blockersFor(labels: string[]) {
  const blockers: string[] = [];
  if (hasLabel(labels, "needs-author-input")) {
    blockers.push("Author input is required before maintainers can import it.");
  }
  if (hasLabel(labels, "source-needs-verification")) {
    blockers.push("Source, provenance, or upstream availability needs verification.");
  }
  if (hasLabel(labels, "stale-submission")) {
    blockers.push("Submission is stale and may close without author follow-up.");
  }
  if (hasLabel(labels, "security")) {
    blockers.push("Security review label is present.");
  }
  if (hasLabel(labels, "blocked")) {
    blockers.push("Blocked label is present.");
  }
  return blockers;
}

function importPrFromText(value: string) {
  return value.match(IMPORT_PR_PATTERN)?.[0];
}

async function fetchGitHub<T>(url: string, token: string) {
  const response = await fetch(url, {
    headers: githubHeaders(token),
    signal: AbortSignal.timeout(8000),
  });
  const payload = (await response.json().catch(() => null)) as T | null;
  return { response, payload };
}

function withPerPage(url: string) {
  const parsed = new URL(url);
  if (!parsed.searchParams.has("per_page")) {
    parsed.searchParams.set("per_page", "100");
  }
  return parsed.toString();
}

function nextPageUrl(response: Response) {
  const link = response.headers.get("link");
  if (!link) return "";
  const match = link.match(/<([^>]+)>;\s*rel="next"/);
  return match?.[1] || "";
}

async function fetchGitHubPages<T>(url: string, token: string) {
  const items: T[] = [];
  let nextUrl = withPerPage(url);

  for (let page = 0; page < 10 && nextUrl; page += 1) {
    const { response, payload } = await fetchGitHub<T[]>(nextUrl, token);
    if (!response.ok || !Array.isArray(payload)) return items;
    items.push(...payload);
    nextUrl = nextPageUrl(response);
  }

  return items;
}

async function fetchIssueComments(issue: GitHubIssue, token: string) {
  if (!issue.comments_url) return [];
  try {
    return await fetchGitHubPages<GitHubComment>(issue.comments_url, token);
  } catch {
    return [];
  }
}

async function fetchIssueTimeline(repo: string, issueNumber: number, token: string) {
  try {
    return await fetchGitHubPages<GitHubTimelineEvent>(
      `https://api.github.com/repos/${repo}/issues/${issueNumber}/timeline`,
      token,
    );
  } catch {
    return [];
  }
}

function commentImportPr(comments: GitHubComment[]) {
  for (const comment of [...comments].reverse()) {
    const url = importPrFromText(String(comment.body || ""));
    if (url) return url;
  }
  return undefined;
}

function activityIssue(
  issue: GitHubIssue,
  comments: GitHubComment[],
  timeline: GitHubTimelineEvent[],
) {
  return {
    body: issue.body || "",
    createdAt: issue.created_at,
    updatedAt: issue.updated_at,
    author: issue.user?.login || "",
    comments,
    timeline,
  };
}

async function mapIssue(issue: GitHubIssue, repo: string, token: string) {
  const labels = labelNames(issue);
  const fields = parseIssueFormBody(issue.body || "");
  const status = statusFor(issue, labels);
  const [comments, timeline] = await Promise.all([
    fetchIssueComments(issue, token),
    fetchIssueTimeline(repo, issue.number, token),
  ]);
  const activity = submissionActivityState(activityIssue(issue, comments, timeline));
  const bodyImportPrUrl = importPrFromText(issue.body || "");
  const importPrUrl =
    bodyImportPrUrl ||
    (status === "import_pr_open" || status === "imported" ? commentImportPr(comments) : undefined);
  const blockers = blockersFor(labels);
  if (activity.authorCommentedWithoutBodyUpdate) {
    blockers.push("Author replied after review, but the issue body was not updated.");
  }

  return {
    number: issue.number,
    url: issue.html_url,
    title: issue.title,
    author: issue.user?.login || "unknown",
    ...(issue.user?.html_url ? { authorUrl: issue.user.html_url } : {}),
    category: parseCategory(labels, fields),
    slug: parseSlug(issue, fields),
    status,
    state: issue.state,
    labels,
    blockers,
    updatedAt: issue.updated_at,
    bodyFingerprint: activity.bodyFingerprint,
    bodyUpdatedAt: activity.bodyUpdatedAt,
    authorCommentedAfterReview: activity.authorCommentedAfterReview,
    authorCommentedWithoutBodyUpdate: activity.authorCommentedWithoutBodyUpdate,
    lastAuthorCommentAt: activity.lastAuthorCommentAt,
    createdAt: issue.created_at,
    closedAt: issue.closed_at ?? null,
    ...(importPrUrl ? { importPrUrl } : {}),
  };
}

async function listIssues(params: { repo: string; token: string; limit: number }) {
  const url = new URL(`https://api.github.com/repos/${params.repo}/issues`);
  url.searchParams.set("state", "all");
  url.searchParams.set("labels", "content-submission");
  url.searchParams.set("sort", "updated");
  url.searchParams.set("direction", "desc");
  url.searchParams.set("per_page", String(params.limit));

  const { response, payload } = await fetchGitHub<GitHubIssue[]>(url.toString(), params.token);
  if (!response.ok || !Array.isArray(payload)) {
    return {
      ok: false as const,
      status: response.status,
      issues: [],
      token: params.token,
    };
  }
  return {
    ok: true as const,
    status: response.status,
    token: params.token,
    issues: payload.filter((issue) => !issue.pull_request && looksLikeSubmissionIssue(issue)),
  };
}

async function getIssue(params: { repo: string; token: string; number: number }) {
  const { response, payload } = await fetchGitHub<GitHubIssue>(
    `https://api.github.com/repos/${params.repo}/issues/${params.number}`,
    params.token,
  );
  if (!response.ok || !payload || payload.pull_request) {
    return {
      ok: false as const,
      status: response.status,
      issue: null,
      token: params.token,
    };
  }
  const labels = labelNames(payload);
  if (!hasLabel(labels, "content-submission") || !looksLikeSubmissionIssue(payload)) {
    return {
      ok: false as const,
      status: 404,
      issue: null,
      token: params.token,
    };
  }
  return {
    ok: true as const,
    status: response.status,
    issue: payload,
    token: params.token,
  };
}

export const GET = createApiHandler("submissions.queue", async ({ request, query, requestId }) => {
  const parsed = query as InferApiQuery<typeof submissionQueueQuerySchema>;
  const env = getCloudflareEnv();
  const repo =
    envValue(env, ["GITHUB_SUBMISSIONS_REPO", "GITHUB_SUBMISSION_REPO", "GITHUB_REPOSITORY"]) ||
    DEFAULT_REPO;
  const token = envValue(env, [
    "GITHUB_SUBMISSIONS_TOKEN",
    "GITHUB_SUBMISSION_TOKEN",
    "GITHUB_TOKEN",
  ]);

  const result = parsed.number
    ? await getIssue({ repo, token, number: parsed.number })
    : await listIssues({ repo, token, limit: parsed.limit });

  if (!result.ok) {
    const code = parsed.number ? "submission_not_found" : "github_provider_error";
    if (result.status === 404) {
      logApiWarn(request, "submissions.queue.not_found", {
        repo,
        number: parsed.number,
      });
      return apiError(code, 404, { requestId });
    }
    logApiError(request, "submissions.queue.provider_error", {
      repo,
      status: result.status,
    });
    return apiError("provider_error", 502, { requestId });
  }

  const issues = "issue" in result ? [result.issue] : result.issues;
  const entries = [];
  for (const issue of issues) {
    if (issue) entries.push(await mapIssue(issue, repo, result.token));
  }

  return apiJson(
    {
      ok: true,
      generatedAt: new Date().toISOString(),
      repo,
      count: entries.length,
      entries,
    },
    { headers: { "cache-control": "public, max-age=60" } },
  );
});

export const Route = createApiFileRoute("/api/submissions/queue")({
  server: {
    handlers: {
      GET: async ({ request, params }) => GET(request, { params }),
    },
  },
});
