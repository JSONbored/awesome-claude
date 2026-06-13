import { base64UrlEncode } from "./security";
import { supersededReviewComment } from "./review";

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const PKCS8_PEM_HEADER = ["-----BEGIN", "PRIVATE", "KEY-----"].join(" ");
const RSA_PEM_HEADER = ["-----BEGIN", "RSA", "PRIVATE", "KEY-----"].join(" ");
const DEFAULT_GITHUB_TIMEOUT_MS = 15_000;
const MANAGED_LABELS: Record<string, { color: string; description: string }> = {
  "submission-under-review": {
    color: "fbca04",
    description: "Private submission gate is reviewing this item",
  },
  "submission-manual-review": {
    color: "5319e7",
    description:
      "Submission needs maintainer review before automation continues",
  },
  "submission-closed-by-gate": {
    color: "b60205",
    description: "Private submission gate closed this content PR",
  },
  "submission-merged-by-gate": {
    color: "0e8a16",
    description: "Private submission gate merged this content PR",
  },
  "category:agents": {
    color: "1d76db",
    description: "Submission category: agents",
  },
  "category:collections": {
    color: "1d76db",
    description: "Submission category: collections",
  },
  "category:commands": {
    color: "1d76db",
    description: "Submission category: commands",
  },
  "category:guides": {
    color: "1d76db",
    description: "Submission category: guides",
  },
  "category:hooks": {
    color: "1d76db",
    description: "Submission category: hooks",
  },
  "category:mcp": {
    color: "1d76db",
    description: "Submission category: MCP servers",
  },
  "category:rules": {
    color: "1d76db",
    description: "Submission category: rules",
  },
  "category:skills": {
    color: "1d76db",
    description: "Submission category: skills",
  },
  "category:statuslines": {
    color: "1d76db",
    description: "Submission category: statuslines",
  },
  "category:tools": {
    color: "1d76db",
    description: "Submission category: tools",
  },
};

export class GitHubApiError extends Error {
  status: number;
  rateLimitRemaining: number | null;
  rateLimitResetAt: string | null;
  retryAfterSeconds: number | null;

  constructor(
    status: number,
    message: string,
    options: {
      rateLimitRemaining?: number | null;
      rateLimitResetAt?: string | null;
      retryAfterSeconds?: number | null;
    } = {},
  ) {
    super(message);
    this.name = "GitHubApiError";
    this.status = status;
    this.rateLimitRemaining = options.rateLimitRemaining ?? null;
    this.rateLimitResetAt = options.rateLimitResetAt ?? null;
    this.retryAfterSeconds = options.retryAfterSeconds ?? null;
  }
}

function parseNumericHeader(value: string | null) {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function isGitHubRateLimitError(error: unknown) {
  if (!(error instanceof GitHubApiError)) return false;
  return (
    error.status === 403 &&
    (error.rateLimitRemaining === 0 ||
      /rate limit exceeded|secondary rate limit/i.test(error.message))
  );
}

export function githubRetryDelaySeconds(
  error: unknown,
  fallbackSeconds: number,
) {
  if (!(error instanceof GitHubApiError)) return fallbackSeconds;
  if (error.retryAfterSeconds && error.retryAfterSeconds > 0) {
    return Math.max(fallbackSeconds, error.retryAfterSeconds);
  }
  if (error.rateLimitResetAt) {
    const resetDelaySeconds = Math.ceil(
      (Date.parse(error.rateLimitResetAt) - Date.now()) / 1000,
    );
    if (Number.isFinite(resetDelaySeconds) && resetDelaySeconds > 0) {
      return Math.max(fallbackSeconds, resetDelaySeconds + 30);
    }
  }
  return fallbackSeconds;
}

export type GitHubRepo = {
  owner: string;
  repo: string;
};

export function parseRepo(value: string): GitHubRepo {
  const parts = value.trim().split("/");
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    throw new Error("Expected owner/repo repository name.");
  }
  const [owner, repo] = parts;
  return { owner, repo };
}

export function buildGitHubAppAuthorizeUrl(params: {
  clientId: string;
  callbackUrl: string;
  state: string;
}) {
  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", params.clientId);
  url.searchParams.set("redirect_uri", params.callbackUrl);
  url.searchParams.set("state", params.state);
  return url.toString();
}

function pemToArrayBuffer(pem: string) {
  if (pem.includes(RSA_PEM_HEADER)) {
    throw new Error(
      "GITHUB_APP_PRIVATE_KEY must be a PKCS#8 PEM block. Convert GitHub's RSA key with: openssl pkcs8 -topk8 -nocrypt -in github-app.pem -out github-app-pkcs8.pem",
    );
  }
  if (!pem.includes(PKCS8_PEM_HEADER)) {
    throw new Error("GITHUB_APP_PRIVATE_KEY must be a PKCS#8 PEM block.");
  }
  const base64 = pem
    .replace(/-----BEGIN [^-]+-----/g, "")
    .replace(/-----END [^-]+-----/g, "")
    .replace(/\s+/g, "");
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes.buffer;
}

export async function createGitHubAppJwt(params: {
  appId: string;
  privateKeyPem: string;
  now?: number;
}) {
  const now = Math.floor((params.now ?? Date.now()) / 1000);
  const header = base64UrlEncode(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64UrlEncode(
    JSON.stringify({
      iat: now - 60,
      exp: now + 9 * 60,
      iss: params.appId,
    }),
  );
  const input = `${header}.${payload}`;
  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(params.privateKeyPem),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    encoder.encode(input),
  );
  return `${input}.${base64UrlEncode(signature)}`;
}

export async function githubJson<T>(
  url: string,
  init: RequestInit & { token?: string; apiVersion?: string } = {},
) {
  const headers = new Headers(init.headers);
  headers.set("accept", "application/vnd.github+json");
  headers.set("user-agent", "heyclaude-submission-gate");
  headers.set("x-github-api-version", init.apiVersion || "2022-11-28");
  if (init.token) headers.set("authorization", `Bearer ${init.token}`);
  const response = await fetch(url, {
    ...init,
    headers,
    signal: init.signal || AbortSignal.timeout(DEFAULT_GITHUB_TIMEOUT_MS),
  });
  const text = await response.text();
  let payload: any = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }
  if (!response.ok) {
    const resetSeconds = parseNumericHeader(
      response.headers.get("x-ratelimit-reset"),
    );
    const resetAt = resetSeconds
      ? new Date(resetSeconds * 1000).toISOString()
      : null;
    throw new GitHubApiError(
      response.status,
      `GitHub API ${response.status}: ${payload?.message || text}`,
      {
        rateLimitRemaining: parseNumericHeader(
          response.headers.get("x-ratelimit-remaining"),
        ),
        rateLimitResetAt: resetAt,
        retryAfterSeconds: parseNumericHeader(
          response.headers.get("retry-after"),
        ),
      },
    );
  }
  if (text && !payload) {
    throw new GitHubApiError(
      response.status,
      "GitHub API returned invalid JSON.",
    );
  }
  return payload as T;
}

export async function exchangeGitHubUserCode(params: {
  clientId: string;
  clientSecret: string;
  code: string;
  callbackUrl: string;
}) {
  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      client_id: params.clientId,
      client_secret: params.clientSecret,
      code: params.code,
      redirect_uri: params.callbackUrl,
    }),
    signal: AbortSignal.timeout(DEFAULT_GITHUB_TIMEOUT_MS),
  });
  const text = await response.text();
  let payload: {
    access_token?: string;
    error?: string;
    error_description?: string;
  } = {};
  if (text) {
    try {
      payload = JSON.parse(text) as typeof payload;
    } catch {
      payload = {
        error_description: text.slice(0, 500),
      };
    }
  }
  if (!response.ok || !payload.access_token) {
    throw new Error(
      payload.error_description || payload.error || "GitHub auth failed.",
    );
  }
  return payload.access_token;
}

export async function getInstallationToken(params: {
  appId: string;
  privateKeyPem: string;
  installationId: number;
  apiVersion?: string;
}) {
  const jwt = await createGitHubAppJwt({
    appId: params.appId,
    privateKeyPem: params.privateKeyPem,
  });
  const payload = await githubJson<{ token: string }>(
    `https://api.github.com/app/installations/${params.installationId}/access_tokens`,
    {
      method: "POST",
      token: jwt,
      apiVersion: params.apiVersion,
    },
  );
  return payload.token;
}

export async function getRepositoryInstallationId(params: {
  appId: string;
  privateKeyPem: string;
  repo: GitHubRepo;
  apiVersion?: string;
}) {
  const jwt = await createGitHubAppJwt({
    appId: params.appId,
    privateKeyPem: params.privateKeyPem,
  });
  const payload = await githubJson<{ id?: number }>(
    `https://api.github.com/repos/${params.repo.owner}/${params.repo.repo}/installation`,
    {
      token: jwt,
      apiVersion: params.apiVersion,
    },
  );
  return Number(payload.id || 0);
}

export async function getPullRequest(params: {
  token: string;
  repo: GitHubRepo;
  number: number;
  apiVersion?: string;
}) {
  return githubJson<{
    number: number;
    title?: string;
    html_url?: string;
    state?: string;
    merged_at?: string | null;
    user?: { login?: string };
    draft?: boolean;
    base?: { ref?: string; repo?: { full_name?: string } };
    head?: {
      sha?: string;
      ref?: string;
      repo?: { full_name?: string };
    };
  }>(
    `https://api.github.com/repos/${params.repo.owner}/${params.repo.repo}/pulls/${params.number}`,
    {
      token: params.token,
      apiVersion: params.apiVersion,
    },
  );
}

export async function listIssueLabels(params: {
  token: string;
  repo: GitHubRepo;
  issueNumber: number;
  apiVersion?: string;
}) {
  return githubJson<Array<{ name?: string }>>(
    `https://api.github.com/repos/${params.repo.owner}/${params.repo.repo}/issues/${params.issueNumber}/labels?per_page=100`,
    {
      token: params.token,
      apiVersion: params.apiVersion,
    },
  );
}

export async function listPullRequestFiles(params: {
  token: string;
  repo: GitHubRepo;
  number: number;
  apiVersion?: string;
}) {
  type PullRequestFile = {
    filename?: string;
    status?: string;
    raw_url?: string;
    additions?: number;
    deletions?: number;
    changes?: number;
  };
  const files: PullRequestFile[] = [];
  const perPage = 100;

  for (let page = 1; page <= 30; page += 1) {
    const pageFiles = await githubJson<PullRequestFile[]>(
      `https://api.github.com/repos/${params.repo.owner}/${params.repo.repo}/pulls/${params.number}/files?per_page=${perPage}&page=${page}`,
      {
        token: params.token,
        apiVersion: params.apiVersion,
      },
    );
    files.push(...pageFiles);
    if (pageFiles.length < perPage) break;
  }

  return files;
}

export async function getRepositoryFileContent(params: {
  token: string;
  repo: GitHubRepo;
  path: string;
  ref: string;
  apiVersion?: string;
}) {
  const encodedPath = encodeContentPath(params.path);
  const payload = await githubJson<{
    type?: string;
    encoding?: string;
    content?: string;
  }>(
    `https://api.github.com/repos/${params.repo.owner}/${params.repo.repo}/contents/${encodedPath}?ref=${encodeURIComponent(params.ref)}`,
    {
      token: params.token,
      apiVersion: params.apiVersion,
    },
  );
  if (payload.type !== "file" || payload.encoding !== "base64") {
    throw new Error("GitHub content API did not return a base64 file blob.");
  }
  const binary = atob(String(payload.content || "").replace(/\s+/g, ""));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return decoder.decode(bytes);
}

export async function getRepositoryTree(params: {
  token: string;
  repo: GitHubRepo;
  ref: string;
  recursive?: boolean;
  apiVersion?: string;
}) {
  const suffix = params.recursive ? "?recursive=1" : "";
  return githubJson<{
    tree?: Array<{ path?: string; type?: string; sha?: string }>;
    truncated?: boolean;
  }>(
    `https://api.github.com/repos/${params.repo.owner}/${params.repo.repo}/git/trees/${encodeURIComponent(params.ref)}${suffix}`,
    {
      token: params.token,
      apiVersion: params.apiVersion,
    },
  );
}

export async function getRepositoryBlobText(params: {
  token: string;
  repo: GitHubRepo;
  sha: string;
  apiVersion?: string;
}) {
  const payload = await githubJson<{ encoding?: string; content?: string }>(
    `https://api.github.com/repos/${params.repo.owner}/${params.repo.repo}/git/blobs/${encodeURIComponent(params.sha)}`,
    {
      token: params.token,
      apiVersion: params.apiVersion,
    },
  );
  if (payload.encoding !== "base64") {
    throw new Error("GitHub blob API did not return base64 content.");
  }
  return atob(String(payload.content || "").replace(/\s+/g, ""));
}

type CheckRun = {
  name?: string;
  status?: string;
  conclusion?: string | null;
  html_url?: string;
  details_url?: string;
  started_at?: string | null;
  completed_at?: string | null;
};

type CommitStatus = {
  context?: string;
  state?: string;
  target_url?: string | null;
  description?: string | null;
  updated_at?: string | null;
};

export type CommitValidationState = {
  state: "pending" | "passed" | "failed";
  summary: string;
  checks: Array<{
    name: string;
    status: "missing" | "pending" | "passed" | "failed";
    details?: string;
  }>;
};

function sortNewestFirst<
  T extends {
    completed_at?: string | null;
    started_at?: string | null;
    updated_at?: string | null;
  },
>(values: T[]) {
  return [...values].sort((left, right) => {
    const leftTime = Date.parse(
      left.completed_at || left.updated_at || left.started_at || "",
    );
    const rightTime = Date.parse(
      right.completed_at || right.updated_at || right.started_at || "",
    );
    return (
      (Number.isFinite(rightTime) ? rightTime : 0) -
      (Number.isFinite(leftTime) ? leftTime : 0)
    );
  });
}

function latestNamedCheckRun(checkRuns: CheckRun[], name: string) {
  return sortNewestFirst(checkRuns.filter((run) => run.name === name))[0];
}

function latestStatusContext(statuses: CommitStatus[], context: string) {
  return sortNewestFirst(
    statuses.filter((status) => status.context === context),
  )[0];
}

export async function getCommitValidationState(params: {
  token: string;
  repo: GitHubRepo;
  ref: string;
  requiredChecks: string[];
  requiredStatusContexts?: string[];
  apiVersion?: string;
}): Promise<CommitValidationState> {
  const requiredChecks = params.requiredChecks.filter(Boolean);
  const requiredStatusContexts = (params.requiredStatusContexts || []).filter(
    Boolean,
  );
  const checkResults: CommitValidationState["checks"] = [];

  const checkRunsPayload = requiredChecks.length
    ? await githubJson<{ check_runs?: CheckRun[] }>(
        `https://api.github.com/repos/${params.repo.owner}/${params.repo.repo}/commits/${encodeURIComponent(params.ref)}/check-runs?filter=latest&per_page=100`,
        {
          token: params.token,
          apiVersion: params.apiVersion,
        },
      )
    : { check_runs: [] };
  const checkRuns = checkRunsPayload.check_runs || [];

  for (const name of requiredChecks) {
    const run = latestNamedCheckRun(checkRuns, name);
    if (!run) {
      checkResults.push({
        name,
        status: "missing",
        details: "has not reported yet",
      });
      continue;
    }
    if (run.status !== "completed") {
      checkResults.push({
        name,
        status: "pending",
        details: `is ${run.status || "pending"}`,
      });
      continue;
    }
    if (/superagent/i.test(name) && run.conclusion === "neutral") {
      checkResults.push({
        name,
        status: "passed",
        details: "concluded neutral",
      });
      continue;
    }
    if (run.conclusion !== "success") {
      checkResults.push({
        name,
        status: "failed",
        details: `concluded ${run.conclusion || "without success"}`,
      });
      continue;
    }
    checkResults.push({ name, status: "passed" });
  }

  if (requiredStatusContexts.length) {
    const statusPayload = await githubJson<{ statuses?: CommitStatus[] }>(
      `https://api.github.com/repos/${params.repo.owner}/${params.repo.repo}/commits/${encodeURIComponent(params.ref)}/status`,
      {
        token: params.token,
        apiVersion: params.apiVersion,
      },
    );
    const statuses = statusPayload.statuses || [];
    for (const context of requiredStatusContexts) {
      const status = latestStatusContext(statuses, context);
      if (!status) {
        checkResults.push({
          name: context,
          status: "missing",
          details: "has not reported yet",
        });
        continue;
      }
      if (status.state !== "success") {
        checkResults.push({
          name: context,
          status: status.state === "pending" ? "pending" : "failed",
          details: `is ${status.state || "unknown"}`,
        });
        continue;
      }
      checkResults.push({ name: context, status: "passed" });
    }
  }

  const failed = checkResults.filter((check) => check.status === "failed");
  if (failed.length) {
    return {
      state: "failed",
      summary: `Required validation failed: ${failed
        .map((check) => `${check.name} ${check.details || ""}`.trim())
        .join("; ")}.`,
      checks: checkResults,
    };
  }

  const pending = checkResults.filter(
    (check) => check.status === "missing" || check.status === "pending",
  );
  if (pending.length) {
    return {
      state: "pending",
      summary: `Waiting for required validation: ${pending
        .map((check) => `${check.name} ${check.details || ""}`.trim())
        .join("; ")}.`,
      checks: checkResults,
    };
  }

  return {
    state: "passed",
    summary: `Required validation passed: ${checkResults
      .map((check) => check.name)
      .join(", ")}.`,
    checks: checkResults,
  };
}

export async function listPullRequestsForCommit(params: {
  token: string;
  repo: GitHubRepo;
  sha: string;
  apiVersion?: string;
}) {
  return githubJson<
    Array<{
      number?: number;
      base?: { ref?: string; repo?: { full_name?: string } };
      head?: { sha?: string; ref?: string; repo?: { full_name?: string } };
    }>
  >(
    `https://api.github.com/repos/${params.repo.owner}/${params.repo.repo}/commits/${encodeURIComponent(params.sha)}/pulls`,
    {
      token: params.token,
      apiVersion: params.apiVersion,
    },
  );
}

export async function listOpenPullRequests(params: {
  token: string;
  repo: GitHubRepo;
  baseRef: string;
  apiVersion?: string;
}) {
  return githubJson<
    Array<{
      number?: number;
      title?: string;
      html_url?: string;
      created_at?: string;
      draft?: boolean;
      base?: { ref?: string; repo?: { full_name?: string } };
      head?: { sha?: string; ref?: string; repo?: { full_name?: string } };
    }>
  >(
    `https://api.github.com/repos/${params.repo.owner}/${params.repo.repo}/pulls?state=open&base=${encodeURIComponent(params.baseRef)}&sort=created&direction=asc&per_page=100`,
    {
      token: params.token,
      apiVersion: params.apiVersion,
    },
  );
}

export async function addLabels(params: {
  token: string;
  repo: GitHubRepo;
  issueNumber: number;
  labels: string[];
  apiVersion?: string;
}) {
  for (const label of params.labels) {
    await ensureManagedLabel({
      token: params.token,
      repo: params.repo,
      label,
      apiVersion: params.apiVersion,
    });
  }
  await githubJson(
    `https://api.github.com/repos/${params.repo.owner}/${params.repo.repo}/issues/${params.issueNumber}/labels`,
    {
      method: "POST",
      token: params.token,
      apiVersion: params.apiVersion,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ labels: params.labels }),
    },
  );
}

export async function removeLabels(params: {
  token: string;
  repo: GitHubRepo;
  issueNumber: number;
  labels: string[];
  apiVersion?: string;
}) {
  for (const label of params.labels) {
    try {
      await githubJson(
        `https://api.github.com/repos/${params.repo.owner}/${params.repo.repo}/issues/${params.issueNumber}/labels/${encodeURIComponent(label)}`,
        {
          method: "DELETE",
          token: params.token,
          apiVersion: params.apiVersion,
        },
      );
    } catch (error) {
      if (error instanceof GitHubApiError && error.status === 404) continue;
      throw error;
    }
  }
}

async function ensureManagedLabel(params: {
  token: string;
  repo: GitHubRepo;
  label: string;
  apiVersion?: string;
}) {
  const definition = MANAGED_LABELS[params.label];
  if (!definition) return;
  try {
    await githubJson(
      `https://api.github.com/repos/${params.repo.owner}/${params.repo.repo}/labels`,
      {
        method: "POST",
        token: params.token,
        apiVersion: params.apiVersion,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: params.label,
          color: definition.color,
          description: definition.description,
        }),
      },
    );
  } catch (error) {
    if (error instanceof GitHubApiError && error.status === 422) {
      await githubJson(
        `https://api.github.com/repos/${params.repo.owner}/${params.repo.repo}/labels/${encodeURIComponent(params.label)}`,
        {
          method: "PATCH",
          token: params.token,
          apiVersion: params.apiVersion,
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            color: definition.color,
            description: definition.description,
          }),
        },
      );
      return;
    }
    throw error;
  }
}

export async function upsertMarkerComment(params: {
  token: string;
  repo: GitHubRepo;
  issueNumber: number;
  marker: string;
  body: string;
  apiVersion?: string;
}) {
  const comments: Array<{
    id: number;
    body?: string;
    html_url?: string;
    user?: { login?: string; type?: string };
  }> = [];
  for (let page = 1; page <= 20; page += 1) {
    const pageComments = await githubJson<
      Array<{
        id: number;
        body?: string;
        html_url?: string;
        user?: { login?: string; type?: string };
      }>
    >(
      `https://api.github.com/repos/${params.repo.owner}/${params.repo.repo}/issues/${params.issueNumber}/comments?per_page=100&page=${page}`,
      {
        token: params.token,
        apiVersion: params.apiVersion,
      },
    );
    comments.push(...pageComments);
    if (pageComments.length < 100) break;
  }
  const markerComments = comments.filter((comment) =>
    comment.body?.includes(params.marker),
  );
  const botMarkerComments = markerComments.filter(
    (comment) => comment.user?.type === "Bot",
  );
  const existing = botMarkerComments.at(-1);
  const endpoint = existing
    ? `https://api.github.com/repos/${params.repo.owner}/${params.repo.repo}/issues/comments/${existing.id}`
    : `https://api.github.com/repos/${params.repo.owner}/${params.repo.repo}/issues/${params.issueNumber}/comments`;
  const canonical = await githubJson<{
    id: number;
    html_url?: string;
    user?: { login?: string; type?: string };
  }>(endpoint, {
    method: existing ? "PATCH" : "POST",
    token: params.token,
    apiVersion: params.apiVersion,
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ body: params.body }),
  });
  const supersededIds: number[] = [];
  for (const comment of botMarkerComments) {
    if (comment.id === canonical.id) continue;
    await githubJson(
      `https://api.github.com/repos/${params.repo.owner}/${params.repo.repo}/issues/comments/${comment.id}`,
      {
        method: "PATCH",
        token: params.token,
        apiVersion: params.apiVersion,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          body: supersededReviewComment(
            params.marker,
            canonical.html_url || existing?.html_url,
          ),
        }),
      },
    );
    supersededIds.push(comment.id);
  }
  return {
    id: canonical.id,
    url: canonical.html_url || existing?.html_url || "",
    supersededIds,
  };
}

export async function closeIssueOrPullRequest(params: {
  token: string;
  repo: GitHubRepo;
  issueNumber: number;
  apiVersion?: string;
}) {
  await githubJson(
    `https://api.github.com/repos/${params.repo.owner}/${params.repo.repo}/issues/${params.issueNumber}`,
    {
      method: "PATCH",
      token: params.token,
      apiVersion: params.apiVersion,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ state: "closed" }),
    },
  );
}

export async function approvePullRequest(params: {
  token: string;
  repo: GitHubRepo;
  number: number;
  body: string;
  apiVersion?: string;
}) {
  return githubJson<{ id?: number; html_url?: string }>(
    `https://api.github.com/repos/${params.repo.owner}/${params.repo.repo}/pulls/${params.number}/reviews`,
    {
      method: "POST",
      token: params.token,
      apiVersion: params.apiVersion,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        event: "APPROVE",
        body: params.body,
      }),
    },
  );
}

export async function mergePullRequest(params: {
  token: string;
  repo: GitHubRepo;
  number: number;
  expectedHeadSha: string;
  commitTitle: string;
  commitMessage: string;
  apiVersion?: string;
}) {
  return githubJson<{ sha?: string; merged?: boolean; message?: string }>(
    `https://api.github.com/repos/${params.repo.owner}/${params.repo.repo}/pulls/${params.number}/merge`,
    {
      method: "PUT",
      token: params.token,
      apiVersion: params.apiVersion,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        sha: params.expectedHeadSha,
        merge_method: "squash",
        commit_title: params.commitTitle,
        commit_message: params.commitMessage,
      }),
    },
  );
}

function base64Content(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function encodeContentPath(path: string) {
  return path.split("/").map(encodeURIComponent).join("/");
}

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function githubJsonOrNull<T>(
  url: string,
  init: RequestInit & { token?: string; apiVersion?: string } = {},
  nullStatuses = [404],
) {
  try {
    return await githubJson<T>(url, init);
  } catch (error) {
    if (
      error instanceof GitHubApiError &&
      nullStatuses.includes(error.status)
    ) {
      return null;
    }
    throw error;
  }
}

async function gitBranchSha(params: {
  repo: GitHubRepo;
  branch: string;
  token: string;
  apiVersion?: string;
}) {
  const ref = await githubJsonOrNull<{ object?: { sha?: string } }>(
    `https://api.github.com/repos/${params.repo.owner}/${params.repo.repo}/git/ref/heads/${params.branch}`,
    {
      token: params.token,
      apiVersion: params.apiVersion,
    },
  );
  return ref?.object?.sha || "";
}

async function syncForkBranch(params: {
  repo: GitHubRepo;
  branch: string;
  token: string;
  apiVersion?: string;
}) {
  await githubJsonOrNull(
    `https://api.github.com/repos/${params.repo.owner}/${params.repo.repo}/merge-upstream`,
    {
      method: "POST",
      token: params.token,
      apiVersion: params.apiVersion,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ branch: params.branch }),
    },
    [404, 409, 422],
  );
}

async function resolveForkBaseSha(params: {
  forkRepo: GitHubRepo;
  baseRef: string;
  fallbackBranch: string;
  token: string;
  apiVersion?: string;
}) {
  const forkBaseSha = await gitBranchSha({
    repo: params.forkRepo,
    branch: params.baseRef,
    token: params.token,
    apiVersion: params.apiVersion,
  });
  if (forkBaseSha) return forkBaseSha;

  await syncForkBranch({
    repo: params.forkRepo,
    branch: params.baseRef,
    token: params.token,
    apiVersion: params.apiVersion,
  });
  const syncedBaseSha = await gitBranchSha({
    repo: params.forkRepo,
    branch: params.baseRef,
    token: params.token,
    apiVersion: params.apiVersion,
  });
  if (syncedBaseSha) return syncedBaseSha;

  const fallbackSha = await gitBranchSha({
    repo: params.forkRepo,
    branch: params.fallbackBranch,
    token: params.token,
    apiVersion: params.apiVersion,
  });
  // If the fork lacks baseRef and merge-upstream cannot create it, this keeps
  // the PR flow moving but may produce broader diffs against the upstream base.
  if (fallbackSha) return fallbackSha;

  throw new Error("GitHub fork has no usable branch base for submission.");
}

export async function createUserForkContentPr(params: {
  userToken: string;
  publicRepo: string;
  baseRef: string;
  branchName: string;
  targetPath: string;
  content: string;
  title: string;
  body: string;
  apiVersion?: string;
}) {
  const upstream = parseRepo(params.publicRepo);
  const user = await githubJson<{ login: string }>(
    "https://api.github.com/user",
    {
      token: params.userToken,
      apiVersion: params.apiVersion,
    },
  );

  type ForkRepo = {
    full_name?: string;
    name?: string;
    default_branch?: string;
    owner?: { login?: string };
  };

  const createdFork = await githubJsonOrNull<ForkRepo>(
    `https://api.github.com/repos/${upstream.owner}/${upstream.repo}/forks`,
    {
      method: "POST",
      token: params.userToken,
      apiVersion: params.apiVersion,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ default_branch_only: false }),
    },
    [404, 422],
  );

  let forkFullName =
    createdFork?.full_name ||
    `${createdFork?.owner?.login || user.login}/${createdFork?.name || upstream.repo}`;
  let forkRepo = parseRepo(forkFullName);
  let forkDefaultBranch = createdFork?.default_branch || "main";
  let forkReady = false;
  const forkPollAttempts = 10;
  for (let attempt = 0; attempt < forkPollAttempts; attempt += 1) {
    const fork = await githubJsonOrNull<ForkRepo>(
      `https://api.github.com/repos/${forkRepo.owner}/${forkRepo.repo}`,
      {
        token: params.userToken,
        apiVersion: params.apiVersion,
      },
    );
    if (fork) {
      forkFullName =
        fork.full_name || `${forkRepo.owner}/${fork.name || forkRepo.repo}`;
      forkRepo = parseRepo(forkFullName);
      forkDefaultBranch = fork.default_branch || forkDefaultBranch;
      forkReady = true;
      break;
    }
    await sleep(3000);
  }
  if (!forkReady) {
    throw new Error(
      `GitHub fork was not ready for ${forkFullName} after ${forkPollAttempts} attempts.`,
    );
  }

  const head = `${forkRepo.owner}:${params.branchName}`;
  const existingPrs = await githubJson<
    Array<{ number: number; html_url: string }>
  >(
    `https://api.github.com/repos/${upstream.owner}/${upstream.repo}/pulls?state=open&head=${encodeURIComponent(head)}&base=${encodeURIComponent(params.baseRef)}`,
    {
      token: params.userToken,
      apiVersion: params.apiVersion,
    },
  );
  if (existingPrs[0]) {
    return {
      githubLogin: user.login,
      forkFullName,
      pullRequestUrl: existingPrs[0].html_url,
      pullRequestNumber: existingPrs[0].number,
    };
  }

  const forkBaseSha = await resolveForkBaseSha({
    forkRepo,
    baseRef: params.baseRef,
    fallbackBranch: forkDefaultBranch,
    token: params.userToken,
    apiVersion: params.apiVersion,
  });
  const encodedBranch = `heads/${params.branchName}`;
  const existingBranch = await githubJsonOrNull(
    `https://api.github.com/repos/${forkRepo.owner}/${forkRepo.repo}/git/ref/${encodedBranch}`,
    {
      token: params.userToken,
      apiVersion: params.apiVersion,
    },
  );

  if (existingBranch) {
    await githubJson(
      `https://api.github.com/repos/${forkRepo.owner}/${forkRepo.repo}/git/refs/${encodedBranch}`,
      {
        method: "PATCH",
        token: params.userToken,
        apiVersion: params.apiVersion,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sha: forkBaseSha, force: true }),
      },
    );
  } else {
    await githubJson(
      `https://api.github.com/repos/${forkRepo.owner}/${forkRepo.repo}/git/refs`,
      {
        method: "POST",
        token: params.userToken,
        apiVersion: params.apiVersion,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ref: `refs/heads/${params.branchName}`,
          sha: forkBaseSha,
        }),
      },
    );
  }

  const encodedTargetPath = encodeContentPath(params.targetPath);
  const existingFile = await githubJsonOrNull<{ sha?: string }>(
    `https://api.github.com/repos/${forkRepo.owner}/${forkRepo.repo}/contents/${encodedTargetPath}?ref=${encodeURIComponent(params.branchName)}`,
    {
      token: params.userToken,
      apiVersion: params.apiVersion,
    },
  );
  await githubJson(
    `https://api.github.com/repos/${forkRepo.owner}/${forkRepo.repo}/contents/${encodedTargetPath}`,
    {
      method: "PUT",
      token: params.userToken,
      apiVersion: params.apiVersion,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        message: params.title,
        content: base64Content(params.content),
        branch: params.branchName,
        ...(existingFile?.sha ? { sha: existingFile.sha } : {}),
      }),
    },
  );

  const pr = await githubJson<{ number: number; html_url: string }>(
    `https://api.github.com/repos/${upstream.owner}/${upstream.repo}/pulls`,
    {
      method: "POST",
      token: params.userToken,
      apiVersion: params.apiVersion,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title: params.title,
        body: params.body,
        head,
        base: params.baseRef,
        maintainer_can_modify: true,
      }),
    },
  );

  return {
    githubLogin: user.login,
    forkFullName,
    pullRequestUrl: pr.html_url,
    pullRequestNumber: pr.number,
  };
}
