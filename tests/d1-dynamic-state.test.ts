import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

import type { D1DatabaseLike, D1RunResult } from "../apps/web/src/lib/db";
import {
  getFallbackClientVotes,
  getFallbackVoteCounts,
  isValidEntryKey,
  queryVoteCounts,
  queryVotesByClient,
  safeVoteCounts,
  toggleVote,
} from "../apps/web/src/lib/votes";
import {
  getFallbackCommunitySignalCounts,
  normalizeCommunitySignalTarget,
  queryCommunitySignalCounts,
} from "../apps/web/src/lib/community-signals";
import {
  getFallbackIntentEventCounts,
  queryIntentEventCounts,
  safeIntentEventCounts,
} from "../apps/web/src/lib/intent-events";
import {
  D1_SAFE_VARIABLE_BATCH_SIZE,
  chunk,
  inPlaceholders,
  targetPairConditions,
} from "../apps/web/src/lib/d1-batch";
import {
  buildPublicJobsIndex,
  normalizeJobLocation,
  queryActiveJobs,
} from "../apps/web/src/lib/jobs";
import {
  REQUIRED_JOB_COLUMNS,
  checkJobsSchema,
  getJobsHealth,
  updateAdminJobState,
  upsertAdminJob,
} from "../apps/web/src/lib/job-admin";
import { repoRoot } from "./helpers/registry-fixtures";
import { nextLeadStatus } from "@heyclaude/registry/commercial";

type QueryResult = Record<string, unknown>;

class FakeD1 implements D1DatabaseLike {
  voteCounts = new Map<string, number>();
  votesByClient = new Set<string>();
  jobRows: QueryResult[] = [];
  communitySignalRows: Array<{
    target_kind: string;
    target_key: string;
    signal_type: string;
    client_id: string;
  }> = [];
  intentEventRows: Array<{
    entry_key: string;
    event_type: string;
    created_at: string;
  }> = [];
  runCalls: Array<{ query: string; values: unknown[] }> = [];
  allCalls: Array<{ query: string; values: unknown[] }> = [];

  prepare(query: string) {
    return {
      bind: (...values: unknown[]) => ({
        first: async <T = QueryResult>() => this.first<T>(query, values),
        run: async () => this.run(query, values),
        all: async <T = QueryResult>() => ({
          results: this.all<T>(query, values),
        }),
      }),
    };
  }

  private first<T>(query: string, values: unknown[]) {
    if (query.includes("SELECT upvote_count FROM votes_entries")) {
      const key = String(values[0]);
      return {
        upvote_count: this.voteCounts.get(key) ?? 0,
      } as T;
    }
    if (query.includes("SELECT 1 AS voted FROM votes_by_client")) {
      const [key, clientId] = values.map(String);
      return this.votesByClient.has(`${key}:${clientId}`)
        ? ({ voted: 1 } as T)
        : null;
    }
    if (
      query.includes("FROM jobs_listings") &&
      query.includes("WHERE slug = ?")
    ) {
      const slug = String(values[0]);
      return (this.jobRows.find((row) => row.slug === slug) ?? null) as T;
    }
    return null;
  }

  private run(query: string, values: unknown[]): D1RunResult {
    this.runCalls.push({ query, values });
    if (query.includes("INSERT OR IGNORE INTO votes_entries")) {
      const key = String(values[0]);
      if (!this.voteCounts.has(key)) this.voteCounts.set(key, 0);
      return { success: true, meta: { changes: 1 } };
    }
    if (query.includes("INSERT OR IGNORE INTO votes_by_client")) {
      const [key, clientId] = values.map(String);
      const voteKey = `${key}:${clientId}`;
      const existed = this.votesByClient.has(voteKey);
      this.votesByClient.add(voteKey);
      return { success: true, meta: { changes: existed ? 0 : 1 } };
    }
    if (
      query.includes("UPDATE votes_entries SET upvote_count = upvote_count + 1")
    ) {
      const key = String(values[0]);
      this.voteCounts.set(key, (this.voteCounts.get(key) ?? 0) + 1);
      return { success: true, meta: { changes: 1 } };
    }
    if (query.includes("DELETE FROM votes_by_client")) {
      const [key, clientId] = values.map(String);
      const voteKey = `${key}:${clientId}`;
      const existed = this.votesByClient.delete(voteKey);
      return { success: true, meta: { changes: existed ? 1 : 0 } };
    }
    if (query.includes("CASE WHEN upvote_count > 0")) {
      const key = String(values[0]);
      this.voteCounts.set(
        key,
        Math.max(0, (this.voteCounts.get(key) ?? 0) - 1),
      );
      return { success: true, meta: { changes: 1 } };
    }
    if (query.includes("INSERT INTO jobs_listings")) {
      const slug = String(values[0]);
      if (!this.jobRows.some((row) => row.slug === slug)) {
        this.jobRows.push({
          slug,
          title: values[1],
          company_name: values[2],
          company_url: values[3],
          location_text: values[4],
          summary: values[5],
          description_md: values[6],
          employment_type: values[7],
          compensation_summary: values[8],
          equity_summary: values[9],
          bonus_summary: values[10],
          benefits_json: values[11],
          responsibilities_json: values[12],
          requirements_json: values[13],
          apply_url: values[14],
          tier: values[15],
          status: values[16],
          source: values[17],
          source_kind: values[18],
          source_url: values[19],
          first_seen_at: values[20],
          last_checked_at: values[21],
          source_checked_at: values[22],
          stale_check_count: values[23],
          curation_note: values[24],
          paid_placement_expires_at: values[25],
          claimed_employer: values[26],
          posted_by_email: values[27],
          posted_at: values[28],
          expires_at: values[29],
          is_remote: values[30],
          is_worldwide: values[31],
        });
      }
      return { success: true, meta: { changes: 1 } };
    }
    if (query.includes("UPDATE jobs_listings")) {
      const slug = String(values.at(-1));
      return {
        success: true,
        meta: {
          changes: this.jobRows.some((row) => row.slug === slug) ? 1 : 0,
        },
      };
    }
    return { success: true, meta: { changes: 0 } };
  }

  private all<T>(query: string, values: unknown[]) {
    this.allCalls.push({ query, values });
    if (query.includes("PRAGMA table_info(jobs_listings)")) {
      return REQUIRED_JOB_COLUMNS.map((name) => ({ name })) as T[];
    }
    if (query.includes("COUNT(*) AS count FROM jobs_listings")) {
      const counts = new Map<string, number>();
      for (const row of this.jobRows) {
        const status = String(row.status || "unknown");
        counts.set(status, (counts.get(status) ?? 0) + 1);
      }
      return [...counts].map(([status, count]) => ({ status, count })) as T[];
    }
    if (query.includes("FROM jobs_listings")) {
      const hasOffset = query.includes("OFFSET ?");
      const limit = Number(
        values.at(hasOffset ? -2 : -1) ?? this.jobRows.length,
      );
      const offset = hasOffset ? Number(values.at(-1) ?? 0) : 0;
      return this.jobRows.slice(offset, offset + limit) as T[];
    }
    if (query.includes("FROM votes_entries")) {
      const keys = values.map(String);
      return keys
        .filter((key) => this.voteCounts.has(key))
        .map((key) => ({
          entry_key: key,
          upvote_count: this.voteCounts.get(key) ?? 0,
        })) as T[];
    }
    if (query.includes("FROM votes_by_client")) {
      const [clientId, ...keys] = values.map(String);
      return keys
        .filter((key) => this.votesByClient.has(`${key}:${clientId}`))
        .map((key) => ({ entry_key: key })) as T[];
    }
    if (query.includes("FROM community_signals")) {
      const targets = new Set<string>();
      for (let index = 0; index < values.length; index += 2) {
        targets.add(`${String(values[index])}:${String(values[index + 1])}`);
      }
      const grouped = new Map<string, number>();
      for (const row of this.communitySignalRows) {
        const target = `${row.target_kind}:${row.target_key}`;
        if (!targets.has(target)) continue;
        const groupKey = `${row.target_kind}\u0000${row.target_key}\u0000${row.signal_type}`;
        grouped.set(groupKey, (grouped.get(groupKey) ?? 0) + 1);
      }
      return [...grouped].map(([key, count]) => {
        const [target_kind, target_key, signal_type] = key.split("\u0000");
        return { target_kind, target_key, signal_type, count };
      }) as T[];
    }
    if (query.includes("FROM intent_events")) {
      const keys = new Set(values.slice(0, -1).map(String));
      const grouped = new Map<string, number>();
      for (const row of this.intentEventRows) {
        if (!keys.has(row.entry_key)) continue;
        const groupKey = `${row.entry_key}\u0000${row.event_type}`;
        grouped.set(groupKey, (grouped.get(groupKey) ?? 0) + 1);
      }
      return [...grouped].map(([key, count]) => {
        const [entry_key, event_type] = key.split("\u0000");
        return { entry_key, event_type, count };
      }) as T[];
    }
    return [];
  }
}

describe("D1 dynamic state helpers", () => {
  it("validates entry keys and provides zero-count fallback state", () => {
    expect(isValidEntryKey("agents:example-agent")).toBe(true);
    expect(isValidEntryKey("../bad")).toBe(false);
    expect(getFallbackVoteCounts(["agents:example-agent"])).toEqual({
      "agents:example-agent": 0,
    });
    expect(getFallbackClientVotes(["agents:example-agent"])).toEqual({
      "agents:example-agent": false,
    });
  });

  it("toggles votes without relying on historical seed data", async () => {
    const db = new FakeD1();
    const key = "agents:example-agent";
    const clientId = "client-12345";

    await expect(queryVoteCounts(db, [key])).resolves.toEqual({ [key]: 0 });
    await expect(queryVotesByClient(db, [key], clientId)).resolves.toEqual({
      [key]: false,
    });

    await expect(
      toggleVote({ db, entryKey: key, clientId, vote: true }),
    ).resolves.toEqual({
      count: 1,
      voted: true,
    });
    await expect(queryVoteCounts(db, [key])).resolves.toEqual({ [key]: 1 });
    await expect(queryVotesByClient(db, [key], clientId)).resolves.toEqual({
      [key]: true,
    });

    await expect(
      toggleVote({ db, entryKey: key, clientId, vote: false }),
    ).resolves.toEqual({
      count: 0,
      voted: false,
    });
  });

  it("queries batch community signal counts without exposing clients", async () => {
    const db = new FakeD1();
    db.communitySignalRows = [
      {
        target_kind: "entry",
        target_key: "entry:mcp/example-server",
        signal_type: "used",
        client_id: "client-a",
      },
      {
        target_kind: "entry",
        target_key: "entry:mcp/example-server",
        signal_type: "used",
        client_id: "client-b",
      },
      {
        target_kind: "entry",
        target_key: "entry:mcp/example-server",
        signal_type: "works",
        client_id: "client-a",
      },
      {
        target_kind: "tool",
        target_key: "tool:cursor",
        signal_type: "broken",
        client_id: "client-c",
      },
    ];

    await expect(
      queryCommunitySignalCounts(db, [
        { targetKind: "entry", targetKey: "entry:mcp/example-server" },
        { targetKind: "tool", targetKey: "tool:cursor" },
      ]),
    ).resolves.toEqual({
      "entry:mcp/example-server": { used: 2, works: 1, broken: 0 },
      "tool:cursor": { used: 0, works: 0, broken: 1 },
    });
  });

  it("shares D1 batching primitives across dynamic-state helpers", () => {
    expect(D1_SAFE_VARIABLE_BATCH_SIZE).toBe(25);

    expect(chunk([])).toEqual([]);
    expect(chunk(["a", "b"], 5)).toEqual([["a", "b"]]);
    expect(chunk(["a", "b", "c"], 2)).toEqual([["a", "b"], ["c"]]);
    expect(
      chunk(Array.from({ length: 60 }, (_, i) => i)).map((b) => b.length),
    ).toEqual([25, 25, 10]);
    expect(() => chunk(["a"], 0)).toThrow(RangeError);

    expect(inPlaceholders(0)).toBe("");
    expect(inPlaceholders(1)).toBe("?");
    expect(inPlaceholders(3)).toBe("?, ?, ?");

    expect(targetPairConditions(0, "target_kind", "target_key")).toBe("");
    expect(targetPairConditions(1, "target_kind", "target_key")).toBe(
      "(target_kind = ? AND target_key = ?)",
    );
    expect(targetPairConditions(2, "target_kind", "target_key")).toBe(
      "(target_kind = ? AND target_key = ?) OR (target_kind = ? AND target_key = ?)",
    );
  });

  it("splits oversized vote and intent reads into safe D1 batches", async () => {
    const db = new FakeD1();
    const keys = Array.from(
      { length: D1_SAFE_VARIABLE_BATCH_SIZE + 5 },
      (_, index) => `agents:entry-${index}`,
    );

    const voteCounts = await queryVoteCounts(db, keys);
    expect(Object.keys(voteCounts)).toHaveLength(keys.length);
    const voteBatches = db.allCalls.filter((call) =>
      call.query.includes("FROM votes_entries"),
    );
    expect(voteBatches).toHaveLength(2);
    expect(voteBatches[0].values).toHaveLength(D1_SAFE_VARIABLE_BATCH_SIZE);
    expect(voteBatches[1].values).toHaveLength(5);

    db.allCalls = [];
    const intentCounts = await queryIntentEventCounts(db, keys);
    expect(Object.keys(intentCounts)).toHaveLength(keys.length);
    // Each intent batch appends the window-days bind after the key placeholders.
    const intentBatches = db.allCalls.filter((call) =>
      call.query.includes("FROM intent_events"),
    );
    expect(intentBatches).toHaveLength(2);
    expect(intentBatches[0].values).toHaveLength(
      D1_SAFE_VARIABLE_BATCH_SIZE + 1,
    );
    expect(intentBatches[1].values).toHaveLength(6);
  });

  it("dedupes inputs and returns empty state without touching D1", async () => {
    const db = new FakeD1();

    await expect(
      queryIntentEventCounts(db, ["mcp:a", "mcp:a", ""]),
    ).resolves.toEqual({
      "mcp:a": { copy: 0, open: 0, install: 0, download: 0, vote: 0 },
    });
    expect(
      db.allCalls.filter((call) => call.query.includes("FROM intent_events")),
    ).toHaveLength(1);

    db.allCalls = [];
    await expect(queryIntentEventCounts(db, [])).resolves.toEqual({});
    await expect(queryVoteCounts(db, [])).resolves.toEqual({});
    await expect(queryCommunitySignalCounts(db, [])).resolves.toEqual({});
    expect(db.allCalls).toHaveLength(0);

    await expect(
      queryCommunitySignalCounts(db, [
        { targetKind: "tool", targetKey: "tool:cursor" },
        { targetKind: "tool", targetKey: "tool:cursor" },
      ]),
    ).resolves.toEqual({
      "tool:cursor": { used: 0, works: 0, broken: 0 },
    });
    expect(
      db.allCalls.filter((call) =>
        call.query.includes("FROM community_signals"),
      ),
    ).toHaveLength(1);
  });

  it("normalizes community signal target kind and key together", () => {
    expect(
      normalizeCommunitySignalTarget("entry", "entry:mcp/example-server"),
    ).toEqual({
      targetKind: "entry",
      targetKey: "entry:mcp/example-server",
    });
    expect(normalizeCommunitySignalTarget("tool", "tool:cursor")).toEqual({
      targetKind: "tool",
      targetKey: "tool:cursor",
    });

    expect(normalizeCommunitySignalTarget("entry", "tool:cursor")).toBeNull();
    expect(
      normalizeCommunitySignalTarget("tool", "entry:mcp/example-server"),
    ).toBeNull();
    expect(
      normalizeCommunitySignalTarget("entry", "entry:missing-slug"),
    ).toBeNull();
    expect(
      normalizeCommunitySignalTarget("tool", "tool:cursor/extra"),
    ).toBeNull();
  });

  it("aggregates 30-day intent events by entry key", async () => {
    const db = new FakeD1();
    db.intentEventRows = [
      {
        entry_key: "mcp:example-server",
        event_type: "copy",
        created_at: "2026-05-01T00:00:00Z",
      },
      {
        entry_key: "mcp:example-server",
        event_type: "install",
        created_at: "2026-05-01T00:00:00Z",
      },
      {
        entry_key: "mcp:example-server",
        event_type: "install",
        created_at: "2026-05-02T00:00:00Z",
      },
    ];

    await expect(
      queryIntentEventCounts(db, ["mcp:example-server"]),
    ).resolves.toEqual({
      "mcp:example-server": {
        copy: 1,
        open: 0,
        install: 2,
        download: 0,
        vote: 0,
      },
    });
  });

  it("returns zero dynamic discovery fallbacks when D1 is unavailable", async () => {
    expect(
      getFallbackCommunitySignalCounts([
        { targetKind: "entry", targetKey: "entry:mcp/example-server" },
      ]),
    ).toEqual({
      "entry:mcp/example-server": { used: 0, works: 0, broken: 0 },
    });
    expect(getFallbackIntentEventCounts(["mcp:example-server"])).toEqual({
      "mcp:example-server": {
        copy: 0,
        open: 0,
        install: 0,
        download: 0,
        vote: 0,
      },
    });
    await expect(safeVoteCounts(["mcp:example-server"])).resolves.toEqual({
      available: false,
      counts: { "mcp:example-server": 0 },
    });
    await expect(
      safeIntentEventCounts(["mcp:example-server"]),
    ).resolves.toEqual({
      available: false,
      counts: {
        "mcp:example-server": {
          copy: 0,
          open: 0,
          install: 0,
          download: 0,
          vote: 0,
        },
      },
    });
  });

  it("returns explicit empty jobs state unless active D1 rows exist", async () => {
    const db = new FakeD1();

    await expect(queryActiveJobs(db)).resolves.toEqual([]);

    db.jobRows = [
      {
        slug: "ai-systems-engineer",
        title: "AI Systems Engineer",
        company_name: "Example Co",
        company_url: "https://example.com",
        location_text: "European Union",
        summary:
          "Build Claude-native workflow systems for a reviewed jobs board listing with source verification, production integrations, and developer-facing automation ownership.",
        description_md:
          "## Role details\n\nOwn AI systems across product integrations and workflow automation for a team shipping Claude-native developer infrastructure. This reviewed detail gives candidates enough context about the product surface, source verification expectations, and collaboration model before they continue to the employer application page.",
        employment_type: "Full-time",
        posted_at: "2026-04-26T00:00:00Z",
        compensation_summary: "$150k-$190k",
        equity_summary: "Offered",
        bonus_summary: "Performance bonus eligible",
        benefits_json: JSON.stringify(["Health benefits", "Remote work"]),
        responsibilities_json: JSON.stringify([
          "Ship Claude and MCP workflow integrations.",
          "Maintain source-verified role details as the employer page changes.",
          "Partner with product teams on AI-native developer automation.",
        ]),
        requirements_json: JSON.stringify([
          "Professional TypeScript or backend engineering experience.",
          "Comfort working with LLM applications and developer tooling.",
          "Strong written communication for reviewed public role pages.",
        ]),
        apply_url: "https://example.com/jobs/ai-systems-engineer",
        tier: "featured",
        status: "active",
        source: "manual",
        source_kind: "employer_submitted",
        source_url: "https://example.com/jobs/ai-systems-engineer",
        first_seen_at: "2026-04-26T00:00:00Z",
        last_checked_at: "2026-04-27T00:00:00Z",
        source_checked_at: "2026-04-27T00:00:00Z",
        stale_check_count: 0,
        curation_note: null,
        paid_placement_expires_at: "2026-05-26T00:00:00Z",
        claimed_employer: 1,
        posted_by_email: "jobs@example.com",
        expires_at: "2026-05-26T00:00:00Z",
        is_remote: 1,
        is_worldwide: 1,
      },
    ];

    await expect(queryActiveJobs(db)).resolves.toMatchObject([
      {
        slug: "ai-systems-engineer",
        title: "AI Systems Engineer",
        company: "Example Co",
        companyUrl: "https://example.com",
        location: "EU (European Union)",
        featured: true,
        sponsored: false,
        sourceKind: "employer_submitted",
        claimedEmployer: true,
        paidPlacementExpiresAt: "2026-05-26T00:00:00Z",
        descriptionMd:
          "## Role details\n\nOwn AI systems across product integrations and workflow automation for a team shipping Claude-native developer infrastructure. This reviewed detail gives candidates enough context about the product surface, source verification expectations, and collaboration model before they continue to the employer application page.",
        compensation: "$150k-$190k",
        equity: "Offered",
        bonus: "Performance bonus eligible",
        benefits: ["Health benefits", "Remote work"],
        responsibilities: [
          "Ship Claude and MCP workflow integrations.",
          "Maintain source-verified role details as the employer page changes.",
          "Partner with product teams on AI-native developer automation.",
        ],
        requirements: [
          "Professional TypeScript or backend engineering experience.",
          "Comfort working with LLM applications and developer tooling.",
          "Strong written communication for reviewed public role pages.",
        ],
      },
    ]);

    const publicIndex = buildPublicJobsIndex(
      await queryActiveJobs(db),
      "https://heyclau.de",
    );
    expect(publicIndex).toMatchObject({
      schemaVersion: 1,
      kind: "jobs-index",
      count: 1,
      entries: [
        {
          slug: "ai-systems-engineer",
          webUrl: "https://heyclau.de/jobs/ai-systems-engineer",
          sourceLabel: "Employer submitted",
          applySourceLabel: "External apply",
          lastVerifiedAt: "2026-04-27T00:00:00Z",
          labels: expect.arrayContaining([
            "Featured",
            "Claimed employer",
            "Remote",
            "Compensation listed",
          ]),
        },
      ],
    });
    expect(publicIndex.entries[0]).not.toHaveProperty("postedByEmail");
    expect(publicIndex.entries[0]).not.toHaveProperty("paidPlacementExpiresAt");
  });

  it("normalizes job locations without re-wrapping abbreviations", () => {
    expect(normalizeJobLocation("European Union")).toBe("EU (European Union)");
    expect(normalizeJobLocation("EU (European Union)")).toBe(
      "EU (European Union)",
    );
    expect(normalizeJobLocation("EU (EU (European Union))")).toBe(
      "EU (European Union)",
    );
    expect(
      normalizeJobLocation("San Francisco, California, United States"),
    ).toBe("San Francisco, CA, US");
    expect(normalizeJobLocation("Remote (EU)")).toBe("Remote (EU)");
  });

  it("keeps active D1 rows out of public jobs when depth and source truth are too weak", async () => {
    const db = new FakeD1();
    db.jobRows = [
      {
        slug: "shallow-curated-role",
        title: "Shallow Curated Role",
        company_name: "Example Co",
        company_url: "https://example.com",
        location_text: "Remote",
        summary: "Too thin.",
        description_md: null,
        employment_type: "Full-time",
        posted_at: "2026-04-28",
        compensation_summary: null,
        equity_summary: null,
        bonus_summary: null,
        benefits_json: null,
        responsibilities_json: null,
        requirements_json: null,
        apply_url: "https://example.com/jobs/shallow-curated-role",
        tier: "free",
        status: "active",
        source: "curated",
        source_kind: "official_ats",
        source_url: "https://example.com/jobs/shallow-curated-role",
        first_seen_at: "2026-04-28",
        last_checked_at: "2026-04-28",
        source_checked_at: "2026-04-28",
        stale_check_count: 0,
        curation_note: null,
        paid_placement_expires_at: null,
        claimed_employer: 0,
        posted_by_email: null,
        expires_at: null,
        is_remote: 1,
        is_worldwide: 0,
      },
    ];

    await expect(queryActiveJobs(db)).resolves.toEqual([]);
  });

  it("checks jobs schema and updates private reviewed job rows through admin helpers", async () => {
    const db = new FakeD1();
    await expect(checkJobsSchema(db)).resolves.toMatchObject({
      ok: true,
      missingColumns: [],
      requiredMigration: "0008_jobs_compensation_metadata.sql",
    });
    await expect(getJobsHealth(db)).resolves.toMatchObject({
      ok: true,
      counts: {},
    });

    await upsertAdminJob(db, {
      slug: "reviewed-ai-engineer",
      title: "Reviewed AI Engineer",
      companyName: "Example Co",
      companyUrl: "https://example.com",
      locationText: "Remote",
      summary:
        "Build reviewed Claude workflow systems with source verification, external apply links, and private D1-backed publication state.",
      compensationSummary: "$150k-$190k",
      equitySummary: "Offered",
      bonusSummary: "Performance bonus eligible",
      benefits: ["Health benefits", "Remote work"],
      applyUrl: "https://example.com/jobs/reviewed-ai-engineer",
      tier: "featured",
      status: "pending_review",
      source: "manual",
      sourceKind: "employer_submitted",
      sourceUrl: "https://example.com/jobs/reviewed-ai-engineer",
      responsibilities: ["Ship integrations"],
      requirements: ["TypeScript"],
      claimedEmployer: true,
      isRemote: true,
      isWorldwide: true,
    });
    expect(db.runCalls.at(-1)?.query).toContain("ON CONFLICT(slug)");
    expect(db.runCalls.at(-1)?.values).toContain("reviewed-ai-engineer");

    await updateAdminJobState(db, {
      slug: "reviewed-ai-engineer",
      action: "revalidate",
      checkedAt: "2026-04-28T00:00:00.000Z",
      expiresAt: null,
    });
    expect(db.runCalls.at(-1)?.query).toContain("stale_check_count = 0");
    expect(db.runCalls.at(-1)?.query).toContain("expires_at = CASE");
    expect(db.runCalls.at(-1)?.values).toContain("2026-04-28T00:00:00.000Z");
    expect(db.runCalls.at(-1)?.values).toContain(null);

    await updateAdminJobState(db, {
      slug: "reviewed-ai-engineer",
      action: "stale",
      checkedAt: "2026-04-29T00:00:00.000Z",
    });
    expect(db.runCalls.at(-1)?.query).toContain("stale_pending_review");

    await expect(
      updateAdminJobState(db, {
        slug: "missing-role",
        action: "close",
      }),
    ).rejects.toMatchObject({ name: "JobNotFoundError" });
  });

  it("blocks paid job activation until reviewed rows meet publication quality", async () => {
    const db = new FakeD1();
    db.jobRows = [
      {
        slug: "thin-sponsored-role",
        title: "Thin Sponsored Role",
        company_name: "Example Co",
        company_url: "https://example.com",
        location_text: "Remote",
        summary: "Too short.",
        description_md: null,
        employment_type: null,
        posted_at: null,
        compensation_summary: null,
        equity_summary: null,
        bonus_summary: null,
        benefits_json: null,
        responsibilities_json: null,
        requirements_json: null,
        apply_url: "https://example.com/jobs/thin-sponsored-role",
        tier: "sponsored",
        status: "pending_review",
        source: "manual",
        source_kind: "employer_submitted",
        source_url: "https://example.com/jobs/thin-sponsored-role",
        first_seen_at: null,
        last_checked_at: null,
        source_checked_at: null,
        stale_check_count: 0,
        curation_note: null,
        paid_placement_expires_at: null,
        claimed_employer: 0,
        posted_by_email: "jobs@example.com",
        expires_at: null,
        is_remote: 1,
        is_worldwide: 0,
      },
    ];

    await expect(
      updateAdminJobState(db, {
        slug: "thin-sponsored-role",
        action: "activate",
      }),
    ).rejects.toMatchObject({
      errors: expect.arrayContaining([
        expect.stringContaining("300+ characters of original role detail"),
      ]),
    });

    db.jobRows = [
      {
        ...db.jobRows[0],
        summary:
          "Build Claude-native developer workflow infrastructure for teams shipping production AI systems, with strong ownership over integrations and product quality.",
        description_md:
          "Own the public-facing role detail for a paid HeyClaude listing. This description explains the team context, product surface, AI workflow responsibilities, developer tooling expectations, source verification, and why the role matters to the Claude and MCP ecosystem. It is intentionally long enough to support useful search snippets and truthful JobPosting structured data.",
        employment_type: "Full-time",
        posted_at: "2026-04-28",
        compensation_summary: "$150K – $190K",
        benefits_json: JSON.stringify(["Health benefits", "Remote work"]),
        responsibilities_json: JSON.stringify([
          "Build production integrations for Claude and MCP developer workflows.",
          "Partner with product and customer teams to prioritize high-signal automation work.",
          "Maintain source-verified listing details as the role evolves.",
        ]),
        requirements_json: JSON.stringify([
          "Professional TypeScript or backend engineering experience.",
          "Comfort working with LLM applications and developer tooling.",
          "Strong written communication for technical product surfaces.",
        ]),
        last_checked_at: "2026-04-28",
        source_checked_at: "2026-04-28",
        expires_at: "2026-05-28",
      },
    ];

    await updateAdminJobState(db, {
      slug: "thin-sponsored-role",
      action: "activate",
      checkedAt: "2026-04-28T00:00:00.000Z",
    });
    expect(db.runCalls.at(-1)?.query).toContain("status = ?");
    expect(db.runCalls.at(-1)?.values).toContain("active");
  });

  it("keeps dynamic-state migrations aligned with votes, jobs, leads, intent events, and community signals", () => {
    const migrationsDir = path.join(repoRoot, "apps/web/migrations");
    const votes = fs.readFileSync(
      path.join(migrationsDir, "0001_votes.sql"),
      "utf8",
    );
    const jobs = fs.readFileSync(
      path.join(migrationsDir, "0002_jobs.sql"),
      "utf8",
    );
    const jobsCuration = fs.readFileSync(
      path.join(migrationsDir, "0006_jobs_curation_and_claims.sql"),
      "utf8",
    );
    const jobsCompensation = fs.readFileSync(
      path.join(migrationsDir, "0008_jobs_compensation_metadata.sql"),
      "utf8",
    );
    const leads = fs.readFileSync(
      path.join(migrationsDir, "0003_commercial_leads.sql"),
      "utf8",
    );
    const intents = fs.readFileSync(
      path.join(migrationsDir, "0004_intent_events.sql"),
      "utf8",
    );
    const signals = fs.readFileSync(
      path.join(migrationsDir, "0005_community_signals.sql"),
      "utf8",
    );

    expect(votes).toContain("votes_entries");
    expect(jobs).toContain("jobs_listings");
    expect(jobs).toContain("pending_review");
    expect(jobsCuration).toContain("stale_pending_review");
    expect(jobsCuration).toContain("official_ats");
    expect(jobsCuration).toContain("paid_placement_expires_at");
    expect(jobsCompensation).toContain("equity_summary");
    expect(jobsCompensation).toContain("benefits_json");
    expect(jobs).toContain("is_worldwide");
    expect(leads).toContain("listing_leads");
    expect(jobsCuration).toContain("'claim'");
    expect(leads).toContain("commercial_placements");
    expect(intents).toContain("intent_events");
    expect(intents).toContain("copy");
    expect(intents).toContain("open");
    expect(signals).toContain("community_signals");
    expect(signals).toContain("used");
    expect(signals).toContain("works");
    expect(signals).toContain("broken");
  });

  it("enforces lead status transitions used by D1-backed admin review", () => {
    let status = "new";
    status = nextLeadStatus(status, "review");
    expect(status).toBe("pending_review");
    status = nextLeadStatus(status, "approve");
    expect(status).toBe("approved");
    status = nextLeadStatus(status, "activate");
    expect(status).toBe("active");
    status = nextLeadStatus(status, "expire");
    expect(status).toBe("expired");
  });
});
