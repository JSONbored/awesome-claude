import { base64UrlEncode } from "./security";

const encoder = new TextEncoder();
const PKCS8_PEM_HEADER = ["-----BEGIN", "PRIVATE", "KEY-----"].join(" ");
const RSA_PEM_HEADER = ["-----BEGIN", "RSA", "PRIVATE", "KEY-----"].join(" ");
const DEFAULT_GITHUB_TIMEOUT_MS = 15_000;

class GitHubApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "GitHubApiError";
    this.status = status;
  }
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
    throw new GitHubApiError(
      response.status,
      `GitHub API ${response.status}: ${payload?.message || text}`,
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
  });
  const payload = (await response.json()) as {
    access_token?: string;
    error?: string;
    error_description?: string;
  };
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

export async function addLabels(params: {
  token: string;
  repo: GitHubRepo;
  issueNumber: number;
  labels: string[];
  apiVersion?: string;
}) {
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

export async function upsertMarkerComment(params: {
  token: string;
  repo: GitHubRepo;
  issueNumber: number;
  marker: string;
  body: string;
  apiVersion?: string;
}) {
  const comments: Array<{ id: number; body?: string }> = [];
  for (let page = 1; page <= 20; page += 1) {
    const pageComments = await githubJson<Array<{ id: number; body?: string }>>(
      `https://api.github.com/repos/${params.repo.owner}/${params.repo.repo}/issues/${params.issueNumber}/comments?per_page=100&page=${page}`,
      {
        token: params.token,
        apiVersion: params.apiVersion,
      },
    );
    comments.push(...pageComments);
    if (pageComments.length < 100) break;
  }
  const existing = comments.find((comment) =>
    comment.body?.includes(params.marker),
  );
  const endpoint = existing
    ? `https://api.github.com/repos/${params.repo.owner}/${params.repo.repo}/issues/comments/${existing.id}`
    : `https://api.github.com/repos/${params.repo.owner}/${params.repo.repo}/issues/${params.issueNumber}/comments`;
  await githubJson(endpoint, {
    method: existing ? "PATCH" : "POST",
    token: params.token,
    apiVersion: params.apiVersion,
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ body: params.body }),
  });
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
