import { getEnvString } from "@/lib/cloudflare-env.server";
import { chunk, inPlaceholders } from "@/lib/d1-batch";
import { getSiteDb, type D1DatabaseLike } from "@/lib/db";
import {
  applySourceRepoSignal,
  collectSourceRepos,
  normalizeSourceRepoSignalRow,
  parseGitHubRepoUrl,
  refreshLimit,
  shouldRefreshSourceRepoSignal,
  type SourceRepoSignal,
  type SourceRepoSignalState,
} from "@/lib/source-repo-signals-lib";
import { fetchGitHubSourceSignal } from "@/lib/source-repo-signals-fetch-lib";

export type { SourceRepoSignal, SourceRepoSignalState };
export {
  applySourceRepoSignal,
  collectSourceRepos,
  parseGitHubRepoUrl,
} from "@/lib/source-repo-signals-lib";
export { fetchGitHubSourceSignal } from "@/lib/source-repo-signals-fetch-lib";

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

type SourceRepoSignalRow = {
  repo: string;
  stars: number | null;
  forks: number | null;
  repo_updated_at: string | null;
  fetched_at: string;
  status: "ok" | "error";
  last_error: string | null;
};

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
      const signal = normalizeSourceRepoSignalRow(row);
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

export async function applySourceRepoSignals<T extends EntryWithRepoStats>(entries: readonly T[]) {
  const state = await readSourceRepoSignalState(entries);
  return entries.map((entry) => applySourceRepoSignal(entry, state));
}

export async function applySourceRepoSignalToEntry<T extends EntryWithRepoStats>(entry: T | null) {
  if (!entry) return entry;
  const [withSignal] = await applySourceRepoSignals([entry]);
  return withSignal ?? entry;
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
    .filter((repo) => shouldRefreshSourceRepoSignal(existing.get(repo), now.getTime()))
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
