import { base64UrlEncode } from "./security";

const encoder = new TextEncoder();
const PKCS8_PEM_HEADER = ["-----BEGIN", "PRIVATE", "KEY-----"].join(" ");
const RSA_PEM_HEADER = ["-----BEGIN", "RSA", "PRIVATE", "KEY-----"].join(" ");

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
  const response = await fetch(url, { ...init, headers });
  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new GitHubApiError(
      response.status,
      `GitHub API ${response.status}: ${payload?.message || text}`,
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
    owner?: { login?: string };
  };

  const createdFork = await githubJsonOrNull<ForkRepo>(
    `https://api.github.com/repos/${upstream.owner}/${upstream.repo}/forks`,
    {
      method: "POST",
      token: params.userToken,
      apiVersion: params.apiVersion,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ default_branch_only: true }),
    },
    [404, 422],
  );

  let forkFullName =
    createdFork?.full_name ||
    `${createdFork?.owner?.login || user.login}/${createdFork?.name || upstream.repo}`;
  let forkRepo = parseRepo(forkFullName);
  let forkReady = false;
  for (let attempt = 0; attempt < 10; attempt += 1) {
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
      forkReady = true;
      break;
    }
    await sleep(3000);
  }
  if (!forkReady) {
    throw new Error(`GitHub fork was not ready for ${forkFullName}.`);
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

  const baseRef = await githubJson<{ object: { sha: string } }>(
    `https://api.github.com/repos/${upstream.owner}/${upstream.repo}/git/ref/heads/${params.baseRef}`,
    {
      token: params.userToken,
      apiVersion: params.apiVersion,
    },
  );
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
        body: JSON.stringify({ sha: baseRef.object.sha, force: true }),
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
          sha: baseRef.object.sha,
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
