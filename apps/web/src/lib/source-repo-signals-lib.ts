import { parseGitHubRepoUrl as parseCanonicalGitHubRepoUrl } from "@heyclaude/registry/source-repo";

export const GITHUB_API_VERSION = "2022-11-28";
export const REQUEST_TIMEOUT_MS = 5000;
export const DEFAULT_REFRESH_LIMIT = 25;
export const REFRESH_STALE_MS = 24 * 60 * 60 * 1000;

type EntryWithRepoStats = {
  repoUrl?: string | null;
  githubStars?: number | null;
  githubForks?: number | null;
  repoUpdatedAt?: string | null;
  repoStats?: {
    repository?: string;
    url?: string;
    stars?: number | null;
    forks?: number | null;
    updatedAt?: string | null;
    appliesTo?: string;
    label?: string;
  };
};

export type SourceRepoSignal = {
  repo: string;
  stars: number | null;
  forks: number | null;
  repoUpdatedAt: string | null;
  fetchedAt: string;
  status: "ok" | "error";
  lastError: string | null;
};

export type SourceRepoSignalState = {
  available: boolean;
  signals: Map<string, SourceRepoSignal>;
};

type SourceRepoSignalRow = {
  repo: string;
  stars: number | null;
  forks: number | null;
  repo_updated_at: string | null;
  fetched_at: string;
  status: "ok" | "error";
  last_error: string | null;
};

export function parseGitHubRepoUrl(value: unknown) {
  // Delegate to the shared canonical parser (handles www., the scp/SSH short
  // form, and the git+/git:// schemes). The source-signal cache keys repos
  // case-insensitively, so lowercase the dedup key here.
  const parsed = parseCanonicalGitHubRepoUrl(value);
  if (!parsed) return null;

  const { owner, repo } = parsed;
  return { owner, repo, key: `${owner}/${repo}`.toLowerCase() };
}

function sourceRepoForEntry(entry: EntryWithRepoStats) {
  return parseGitHubRepoUrl(entry.repoUrl || entry.repoStats?.url);
}

export function normalizeSourceRepoSignalRow(row: SourceRepoSignalRow): SourceRepoSignal {
  return {
    repo: String(row.repo || "").toLowerCase(),
    stars: typeof row.stars === "number" ? row.stars : null,
    forks: typeof row.forks === "number" ? row.forks : null,
    repoUpdatedAt: row.repo_updated_at || null,
    fetchedAt: row.fetched_at,
    status: row.status === "error" ? "error" : "ok",
    lastError: row.last_error || null,
  };
}

export function collectSourceRepos(entries: readonly EntryWithRepoStats[]) {
  return [
    ...new Set(
      entries
        .map(sourceRepoForEntry)
        .filter((repo): repo is NonNullable<ReturnType<typeof sourceRepoForEntry>> => Boolean(repo))
        .map((repo) => repo.key),
    ),
  ].sort();
}

function stripVolatileRepoStats<T extends EntryWithRepoStats>(entry: T): T {
  const {
    githubStars: _githubStars,
    githubForks: _githubForks,
    repoUpdatedAt: _repoUpdatedAt,
    repoStats: _repoStats,
    ...rest
  } = entry;
  return rest as T;
}

export function applySourceRepoSignal<T extends EntryWithRepoStats>(
  entry: T,
  state: SourceRepoSignalState,
): T {
  const repo = sourceRepoForEntry(entry);
  if (!repo) return entry;
  if (!state.available) return entry;

  const signal = state.signals.get(repo.key);
  if (!signal) return stripVolatileRepoStats(entry);

  const hasSignal =
    typeof signal.stars === "number" ||
    typeof signal.forks === "number" ||
    Boolean(signal.repoUpdatedAt);
  if (!hasSignal) return stripVolatileRepoStats(entry);

  const repoStats = {
    ...(entry.repoStats ?? {}),
    repository: entry.repoStats?.repository ?? repo.key,
    url: entry.repoStats?.url ?? entry.repoUrl ?? `https://github.com/${repo.key}`,
    appliesTo: entry.repoStats?.appliesTo ?? "listing_source_repo",
    label: entry.repoStats?.label ?? "Source repo",
    ...(typeof signal.stars === "number" ? { stars: signal.stars } : {}),
    ...(typeof signal.forks === "number" ? { forks: signal.forks } : {}),
    ...(signal.repoUpdatedAt ? { updatedAt: signal.repoUpdatedAt } : {}),
  };

  return {
    ...entry,
    githubStars: signal.stars,
    githubForks: signal.forks,
    repoUpdatedAt: signal.repoUpdatedAt,
    repoStats,
  };
}

export function refreshLimit(value: unknown) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return DEFAULT_REFRESH_LIMIT;
  return Math.max(1, Math.min(100, Math.trunc(parsed)));
}

export function shouldRefreshSourceRepoSignal(signal: SourceRepoSignal | undefined, nowMs: number) {
  if (!signal) return true;
  if (signal.status === "error") return true;
  const fetchedMs = Date.parse(signal.fetchedAt);
  return !Number.isFinite(fetchedMs) || nowMs - fetchedMs > REFRESH_STALE_MS;
}
