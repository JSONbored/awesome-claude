import { parseAbbreviatedCount } from "@heyclaude/registry/presentation";

import { GITHUB_API_VERSION, REQUEST_TIMEOUT_MS } from "@/lib/source-repo-signals-lib";

type Fetcher = typeof fetch;

export function buildGitHubRepoApiUrl(owner: string, repo: string) {
  return `https://api.github.com/repos/${owner}/${repo}`;
}

export function buildShieldsStarsUrl(owner: string, repo: string) {
  return `https://img.shields.io/github/stars/${owner}/${repo}.json`;
}

export function parseGitHubRepoApiPayload(data: Record<string, unknown>) {
  if (data.private === true) throw new Error("github_api_private_repo");

  return {
    stars: typeof data.stargazers_count === "number" ? data.stargazers_count : null,
    forks: typeof data.forks_count === "number" ? data.forks_count : null,
    repoUpdatedAt: typeof data.updated_at === "string" ? data.updated_at : null,
  };
}

export function parseShieldsStarsPayload(payload: { value?: string; message?: string }) {
  const stars = parseAbbreviatedCount(payload.value ?? payload.message);
  if (stars === null) return null;
  return { stars, forks: null, repoUpdatedAt: null };
}

async function fetchShieldsStars(repo: { owner: string; repo: string }, fetcher: Fetcher) {
  try {
    const response = await fetcher(buildShieldsStarsUrl(repo.owner, repo.repo), {
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as { value?: string; message?: string };
    return parseShieldsStarsPayload(payload);
  } catch {
    return null;
  }
}

export async function fetchGitHubSourceSignal(repoKey: string, fetcher: Fetcher = fetch) {
  const [owner, repo] = repoKey.split("/");
  if (!owner || !repo) throw new Error(`invalid_repo:${repoKey}`);

  const headers: HeadersInit = {
    accept: "application/vnd.github+json",
    "user-agent": "heyclau.de-source-signals",
    "x-github-api-version": GITHUB_API_VERSION,
  };
  const response = await fetcher(buildGitHubRepoApiUrl(owner, repo), {
    headers,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    const fallback = await fetchShieldsStars({ owner, repo }, fetcher);
    if (fallback) return fallback;
    throw new Error(`github_api_${response.status}`);
  }

  const data = (await response.json()) as Record<string, unknown>;
  return parseGitHubRepoApiPayload(data);
}
