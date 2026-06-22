import { describe, expect, it } from "vitest";

import {
  applySourceRepoSignal,
  applySourceRepoSignalToEntry,
  collectSourceRepos,
  fetchGitHubSourceSignal,
  parseGitHubRepoUrl,
  querySourceRepoSignals,
  readSourceRepoSignalState,
  refreshSourceRepoSignalsForEntries,
  type SourceRepoSignalState,
} from "../apps/web/src/lib/source-repo-signals.server";

type Row = {
  repo: string;
  stars: number | null;
  forks: number | null;
  repo_updated_at: string | null;
  fetched_at: string;
  status: "ok" | "error";
  last_error: string | null;
};

class FakeD1 {
  rows = new Map<string, Row>();

  prepare(query: string) {
    return {
      bind: (...values: unknown[]) => ({
        all: async <T>() => {
          if (!query.includes("FROM source_repo_signals")) {
            return { results: [] as T[] };
          }
          const results = values
            .map((repo) => this.rows.get(String(repo)))
            .filter(Boolean) as T[];
          return { results };
        },
        first: async <T>() => null as T | null,
        run: async () => {
          if (query.includes("VALUES (?, ?, 'error'")) {
            const [repo, fetchedAt, lastError] = values;
            const key = String(repo);
            const existing = this.rows.get(key);
            this.rows.set(key, {
              repo: key,
              stars: existing?.stars ?? null,
              forks: existing?.forks ?? null,
              repo_updated_at: existing?.repo_updated_at ?? null,
              fetched_at: String(fetchedAt),
              status: "error",
              last_error: String(lastError),
            });
          } else {
            const [repo, stars, forks, repoUpdatedAt, fetchedAt] = values;
            const key = String(repo);
            this.rows.set(key, {
              repo: key,
              stars: typeof stars === "number" ? stars : null,
              forks: typeof forks === "number" ? forks : null,
              repo_updated_at:
                typeof repoUpdatedAt === "string" ? repoUpdatedAt : null,
              fetched_at: String(fetchedAt),
              status: "ok",
              last_error: null,
            });
          }
          return { success: true, meta: { changes: 1 } };
        },
      }),
    };
  }
}

describe("source repo signals", () => {
  it("parses GitHub repo URLs without treating volatile stats as source", () => {
    expect(parseGitHubRepoUrl("https://github.com/OpenAI/whisper.git")).toEqual(
      {
        owner: "OpenAI",
        repo: "whisper",
        key: "openai/whisper",
      },
    );
    expect(parseGitHubRepoUrl("https://example.com/OpenAI/whisper")).toBeNull();
    // The www. alias resolves to the same repo as the bare github.com host.
    expect(parseGitHubRepoUrl("https://www.github.com/OpenAI/whisper")).toEqual(
      {
        owner: "OpenAI",
        repo: "whisper",
        key: "openai/whisper",
      },
    );
    // Only a leading www. is stripped — other subdomains stay rejected.
    expect(
      parseGitHubRepoUrl("https://gist.github.com/OpenAI/whisper"),
    ).toBeNull();
  });

  it("strips stale generated stats when the cache is available but empty", () => {
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map(),
    };
    const entry = applySourceRepoSignal(
      {
        category: "tools",
        slug: "example",
        repoUrl: "https://github.com/example/tool",
        githubStars: 10,
        githubForks: 2,
        repoUpdatedAt: "2026-01-01T00:00:00Z",
        repoStats: {
          repository: "example/tool",
          url: "https://github.com/example/tool",
          stars: 10,
          forks: 2,
          updatedAt: "2026-01-01T00:00:00Z",
        },
      },
      state,
    );

    expect(entry).not.toHaveProperty("githubStars");
    expect(entry).not.toHaveProperty("githubForks");
    expect(entry).not.toHaveProperty("repoUpdatedAt");
    expect(entry).not.toHaveProperty("repoStats");
    expect(entry.repoUrl).toBe("https://github.com/example/tool");
    expect(applySourceRepoSignal({ title: "No repo" }, state)).toEqual({
      title: "No repo",
    });
    expect(
      applySourceRepoSignal(
        {
          repoUrl: "https://github.com/example/tool",
          githubStars: 1,
        },
        { available: false, signals: new Map() },
      ),
    ).toMatchObject({ githubStars: 1 });
  });

  it("overlays cached source signals without changing source provenance", () => {
    const state: SourceRepoSignalState = {
      available: true,
      signals: new Map([
        [
          "example/tool",
          {
            repo: "example/tool",
            stars: 42,
            forks: 7,
            repoUpdatedAt: "2026-06-02T00:00:00Z",
            fetchedAt: "2026-06-02T01:00:00Z",
            status: "ok",
            lastError: null,
          },
        ],
      ]),
    };

    expect(
      applySourceRepoSignal(
        {
          title: "Example",
          repoUrl: "https://github.com/example/tool",
        },
        state,
      ),
    ).toMatchObject({
      title: "Example",
      repoUrl: "https://github.com/example/tool",
      githubStars: 42,
      githubForks: 7,
      repoUpdatedAt: "2026-06-02T00:00:00Z",
      repoStats: {
        repository: "example/tool",
        url: "https://github.com/example/tool",
        stars: 42,
        forks: 7,
        updatedAt: "2026-06-02T00:00:00Z",
        appliesTo: "listing_source_repo",
        label: "Source repo",
      },
    });
  });

  it("refreshes bounded D1 cache rows from GitHub", async () => {
    const db = new FakeD1();
    const result = await refreshSourceRepoSignalsForEntries(
      [{ repoUrl: "https://github.com/example/tool" }],
      {
        db,
        now: new Date("2026-06-02T12:00:00Z"),
        fetcher: async () =>
          new Response(
            JSON.stringify({
              stargazers_count: 123,
              forks_count: 9,
              updated_at: "2026-06-02T11:00:00Z",
            }),
            { status: 200 },
          ),
      },
    );

    expect(result).toMatchObject({
      available: true,
      totalRepos: 1,
      refreshed: 1,
      failed: 0,
    });
    const signals = await querySourceRepoSignals(db, ["example/tool"]);
    expect(signals.get("example/tool")).toMatchObject({
      stars: 123,
      forks: 9,
      repoUpdatedAt: "2026-06-02T11:00:00Z",
      status: "ok",
    });
    expect(await querySourceRepoSignals(db, [])).toEqual(new Map());
  });

  it("preserves last good values when upstream refresh fails", async () => {
    const db = new FakeD1();
    db.rows.set("example/tool", {
      repo: "example/tool",
      stars: 50,
      forks: 5,
      repo_updated_at: "2026-06-01T00:00:00Z",
      fetched_at: "2026-06-01T00:00:00Z",
      status: "ok",
      last_error: null,
    });

    const result = await refreshSourceRepoSignalsForEntries(
      [{ repoUrl: "https://github.com/example/tool" }],
      {
        db,
        now: new Date("2026-06-03T12:00:00Z"),
        fetcher: async () => new Response("nope", { status: 503 }),
      },
    );

    expect(result).toMatchObject({ refreshed: 0, failed: 1 });
    expect(db.rows.get("example/tool")).toMatchObject({
      stars: 50,
      forks: 5,
      repo_updated_at: "2026-06-01T00:00:00Z",
      status: "error",
    });
  });

  it("does not send configured GitHub tokens for content-controlled repo lookups", async () => {
    const previousToken = process.env.GITHUB_TOKEN;
    process.env.GITHUB_TOKEN = "secret-token";
    const seenHeaders: HeadersInit[] = [];

    try {
      await fetchGitHubSourceSignal("example/tool", async (_url, init) => {
        seenHeaders.push(init?.headers ?? {});
        return new Response(
          JSON.stringify({
            private: false,
            stargazers_count: 10,
            forks_count: 2,
            updated_at: "2026-06-02T11:00:00Z",
          }),
          { status: 200 },
        );
      });
    } finally {
      if (previousToken === undefined) {
        delete process.env.GITHUB_TOKEN;
      } else {
        process.env.GITHUB_TOKEN = previousToken;
      }
    }

    expect(seenHeaders).toHaveLength(1);
    expect(JSON.stringify(seenHeaders[0]).toLowerCase()).not.toContain(
      "authorization",
    );
  });

  it("rejects private GitHub repository payloads before caching", async () => {
    const db = new FakeD1();
    const result = await refreshSourceRepoSignalsForEntries(
      [{ repoUrl: "https://github.com/example/private-tool" }],
      {
        db,
        now: new Date("2026-06-02T12:00:00Z"),
        fetcher: async () =>
          new Response(
            JSON.stringify({
              private: true,
              stargazers_count: 123,
              forks_count: 9,
              updated_at: "2026-06-02T11:00:00Z",
            }),
            { status: 200 },
          ),
      },
    );

    expect(result).toMatchObject({ refreshed: 0, failed: 1 });
    expect(db.rows.get("example/private-tool")).toMatchObject({
      stars: null,
      forks: null,
      repo_updated_at: null,
      status: "error",
      last_error: "github_api_private_repo",
    });
  });

  it("falls back to Shields stars when GitHub is unavailable", async () => {
    let call = 0;
    const signal = await fetchGitHubSourceSignal("example/tool", async () => {
      call += 1;
      if (call === 1) return new Response("unavailable", { status: 503 });
      return new Response(JSON.stringify({ value: "1.2k" }), { status: 200 });
    });

    expect(signal).toEqual({
      stars: 1200,
      forks: null,
      repoUpdatedAt: null,
    });
  });

  it("collects repo keys, handles empty runtime state, and skips fresh cache rows", async () => {
    expect(
      collectSourceRepos([
        { repoUrl: "https://github.com/Example/Tool" },
        { repoStats: { url: "git@github.com:example/tool.git" } },
        { repoUrl: "https://example.com/not-github" },
      ]),
    ).toEqual(["example/tool"]);

    await expect(readSourceRepoSignalState([])).resolves.toEqual({
      available: false,
      signals: new Map(),
    });
    await expect(applySourceRepoSignalToEntry(null)).resolves.toBeNull();
    await expect(
      applySourceRepoSignalToEntry({
        title: "Runtime entry",
        repoUrl: "https://github.com/example/tool",
      }),
    ).resolves.toMatchObject({
      title: "Runtime entry",
      repoUrl: "https://github.com/example/tool",
    });

    const db = new FakeD1();
    db.rows.set("example/tool", {
      repo: "example/tool",
      stars: 50,
      forks: 5,
      repo_updated_at: "2026-06-01T00:00:00Z",
      fetched_at: "2026-06-03T00:00:00Z",
      status: "ok",
      last_error: null,
    });
    await expect(
      refreshSourceRepoSignalsForEntries(
        [
          { repoUrl: "https://github.com/example/tool" },
          { repoUrl: "https://github.com/example/other" },
        ],
        {
          db,
          now: new Date("2026-06-03T12:00:00Z"),
          limit: 1,
          fetcher: async () =>
            new Response(
              JSON.stringify({
                stargazers_count: 7,
                forks_count: 1,
                updated_at: "2026-06-03T11:00:00Z",
              }),
            ),
        },
      ),
    ).resolves.toMatchObject({
      available: true,
      totalRepos: 2,
      refreshed: 1,
      failed: 0,
    });
    expect(db.rows.get("example/tool")?.stars).toBe(50);
    expect(db.rows.get("example/other")?.stars).toBe(7);
    await expect(
      refreshSourceRepoSignalsForEntries(
        [{ repoUrl: "https://github.com/example/tool" }],
        { db: null },
      ),
    ).resolves.toEqual({
      available: false,
      totalRepos: 0,
      refreshed: 0,
      failed: 0,
    });
  });

  it("classifies GitHub source signal failures and sparse payloads", async () => {
    await expect(fetchGitHubSourceSignal("missing-slash")).rejects.toThrow(
      "invalid_repo",
    );
    await expect(
      fetchGitHubSourceSignal("example/tool", async () => {
        throw new Error("offline");
      }),
    ).rejects.toThrow("offline");
    await expect(
      fetchGitHubSourceSignal("example/tool", async () => {
        return new Response(JSON.stringify({ message: "n/a" }), {
          status: 503,
        });
      }),
    ).rejects.toThrow("github_api_503");
    let fallbackCall = 0;
    await expect(
      fetchGitHubSourceSignal("example/tool", async () => {
        fallbackCall += 1;
        if (fallbackCall === 1) {
          return new Response("unavailable", { status: 503 });
        }
        throw new Error("shields offline");
      }),
    ).rejects.toThrow("github_api_503");
    await expect(
      fetchGitHubSourceSignal(
        "example/tool",
        async () => new Response(JSON.stringify({}), { status: 200 }),
      ),
    ).resolves.toEqual({
      stars: null,
      forks: null,
      repoUpdatedAt: null,
    });
  });
});
