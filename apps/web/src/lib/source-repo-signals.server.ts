import { parseAbbreviatedCount } from "@heyclaude/registry/presentation";
import {
  parseGitHubRepoUrl as parseCanonicalGitHubRepoUrl,
} from "@heyclaude/registry/source-repo";

import { getEnvString } from "@/lib/cloudflare-env.server";
import { chunk, inPlaceholders } from "@/lib/d1-batch";
import { getSiteDb, type D1DatabaseLike } from "@/lib/db";

const GITHUB_API_VERSION = "2022-11-28";
const REQUEST_TIMEOUT_MS = 5000;
const DEFAULT_REFRESH_LIMIT = 25;
const REFRESH_STALE_MS = 24 * 60 * 60 * 1000;

type Fetcher = typeof fetch;

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

function normalizeSignalRow(row: SourceRepoSignalRow): SourceRepoSignal {
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

export async function querySourceRepoSignals(db: D1DatabaseLike, repos: readonly string[]) {
  const uniqueRepos = [...new Set(repos.map((repo) => repo.toLowerCase()))];
  const signals = new Map<string, SourceRepoSignal>();
  if (!uniqueRepos.length) return signals;

  for (const batch of chunk(uniqueRepos)) {
    const placeholders = inPlaceholders(batch.length);
    const { results } = await db
      .prepare(
        `SELECT repo, stars, forks, repo_updated_at, fetched_at, status, last_error
         FROM source_repo_signals
         WHERE repo IN (${placeholders})`,
      )
      .bind(...batch)
      .all<SourceRepoSignalRow>();

    for (const row of results || []) {
      const signal = normalizeSignalRow(row);
      if (signal.repo) signals.set(signal.repo, signal);
    }
  }

  return signals;
}

export async function readSourceRepoSignalState(
  entries: readonly EntryWithRepoStats[],
): Promise<SourceRepoSignalState> {
  try {
    const db = getSiteDb();
    if (!db) return { available: false, signals: new Map() };
    return {
      available: true,
      signals: await querySourceRepoSignals(db, collectSourceRepos(entries)),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!message.includes("no such table: source_repo_signals") && !message.includes("SITE_DB")) {
      console.warn("[source-repo-signals] failed to read cache", error);
    }
    return { available: false, signals: new Map() };
  }
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

export async function applySourceRepoSignals<T extends EntryWithRepoStats>(entries: readonly T[]) {
  const state = await readSourceRepoSignalState(entries);
  return entries.map((entry) => applySourceRepoSignal(entry, state));
}

export async function applySourceRepoSignalToEntry<T extends EntryWithRepoStats>(entry: T | null) {
  if (!entry) return entry;
  const [withSignal] = await applySourceRepoSignals([entry]);
  return withSignal ?? entry;
}

async function fetchShieldsStars(repo: { owner: string; repo: string }, fetcher: Fetcher) {
  try {
    const response = await fetcher(
      `https://img.shields.io/github/stars/${repo.owner}/${repo.repo}.json`,
      { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) },
    );
    if (!response.ok) return null;
    const payload = (await response.json()) as { value?: string; message?: string };
    const stars = parseAbbreviatedCount(payload.value ?? payload.message);
    if (stars === null) return null;
    return { stars, forks: null, repoUpdatedAt: null };
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
  const token = getEnvString("GITHUB_TOKEN");
  if (token) headers.authorization = `Bearer ${token}`;

  const response = await fetcher(`https://api.github.com/repos/${owner}/${repo}`, {
    headers,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    const fallback = await fetchShieldsStars({ owner, repo }, fetcher);
    if (fallback) return fallback;
    throw new Error(`github_api_${response.status}`);
  }

  const data = (await response.json()) as Record<string, unknown>;
  return {
    stars: typeof data.stargazers_count === "number" ? data.stargazers_count : null,
    forks: typeof data.forks_count === "number" ? data.forks_count : null,
    repoUpdatedAt: typeof data.updated_at === "string" ? data.updated_at : null,
  };
}

export async function upsertSourceRepoSignalSuccess(
  db: D1DatabaseLike,
  repo: string,
  signal: {
    stars: number | null;
    forks: number | null;
    repoUpdatedAt: string | null;
  },
  fetchedAt: string,
) {
  await db
    .prepare(
      `INSERT INTO source_repo_signals
        (repo, stars, forks, repo_updated_at, fetched_at, status, last_error, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 'ok', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       ON CONFLICT(repo) DO UPDATE SET
         stars = excluded.stars,
         forks = excluded.forks,
         repo_updated_at = excluded.repo_updated_at,
         fetched_at = excluded.fetched_at,
         status = 'ok',
         last_error = NULL,
         updated_at = CURRENT_TIMESTAMP`,
    )
    .bind(repo, signal.stars, signal.forks, signal.repoUpdatedAt, fetchedAt)
    .run();
}

export async function upsertSourceRepoSignalFailure(
  db: D1DatabaseLike,
  repo: string,
  error: unknown,
  fetchedAt: string,
) {
  const message = error instanceof Error ? error.message : String(error || "unknown");
  await db
    .prepare(
      `INSERT INTO source_repo_signals
        (repo, fetched_at, status, last_error, created_at, updated_at)
       VALUES (?, ?, 'error', ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       ON CONFLICT(repo) DO UPDATE SET
         fetched_at = excluded.fetched_at,
         status = 'error',
         last_error = excluded.last_error,
         updated_at = CURRENT_TIMESTAMP`,
    )
    .bind(repo, fetchedAt, message.slice(0, 500))
    .run();
}

function refreshLimit(value: unknown) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return DEFAULT_REFRESH_LIMIT;
  return Math.max(1, Math.min(100, Math.trunc(parsed)));
}

function shouldRefresh(signal: SourceRepoSignal | undefined, nowMs: number) {
  if (!signal) return true;
  if (signal.status === "error") return true;
  const fetchedMs = Date.parse(signal.fetchedAt);
  return !Number.isFinite(fetchedMs) || nowMs - fetchedMs > REFRESH_STALE_MS;
}

export async function refreshSourceRepoSignalsForEntries(
  entries: readonly EntryWithRepoStats[],
  options: {
    db?: D1DatabaseLike | null;
    fetcher?: Fetcher;
    now?: Date;
    limit?: number;
  } = {},
) {
  const db = options.db === undefined ? getSiteDb() : options.db;
  if (!db) return { available: false, totalRepos: 0, refreshed: 0, failed: 0 };

  const repos = collectSourceRepos(entries);
  const existing = await querySourceRepoSignals(db, repos);
  const now = options.now ?? new Date();
  const fetchedAt = now.toISOString();
  const work = repos
    .filter((repo) => shouldRefresh(existing.get(repo), now.getTime()))
    .slice(0, refreshLimit(options.limit ?? getEnvString("SOURCE_REPO_SIGNAL_REFRESH_LIMIT")));

  let refreshed = 0;
  let failed = 0;
  const fetcher = options.fetcher ?? fetch;

  for (const batch of chunk(work, 4)) {
    await Promise.all(
      batch.map(async (repo) => {
        try {
          const signal = await fetchGitHubSourceSignal(repo, fetcher);
          await upsertSourceRepoSignalSuccess(db, repo, signal, fetchedAt);
          refreshed += 1;
        } catch (error) {
          await upsertSourceRepoSignalFailure(db, repo, error, fetchedAt);
          failed += 1;
        }
      }),
    );
  }

  return { available: true, totalRepos: repos.length, refreshed, failed };
}
