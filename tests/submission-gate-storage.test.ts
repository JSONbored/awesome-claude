import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  consumeDraftUserToken,
  createDraft,
  getDraft,
  getDraftUserToken,
  getPrState,
  insertAudit,
  listDuePrStates,
  listRecentPrStates,
  listTerminalPrStatesForReconciliation,
  markPrNotificationSent,
  storeDraftUserToken,
  updateDraftAuthState,
  updateDraftStatus,
  upsertPrState,
  verifyDraftState,
} from "../apps/submission-gate/src/storage";
import { sha256Hex } from "../apps/submission-gate/src/security";

type QueryCall = {
  sql: string;
  binds: unknown[];
};

function createFakeDb(
  options: {
    first?: unknown[];
    all?: unknown[];
    run?: unknown[];
  } = {},
) {
  const calls: QueryCall[] = [];
  const first = [...(options.first ?? [])];
  const all = [...(options.all ?? [])];
  const run = [...(options.run ?? [])];
  const db = {
    prepare(sql: string) {
      const call: QueryCall = { sql, binds: [] };
      calls.push(call);
      return {
        bind(...binds: unknown[]) {
          call.binds = binds;
          return this;
        },
        async run() {
          return run.shift() ?? { meta: { changes: 1 } };
        },
        async first() {
          return first.shift() ?? null;
        },
        async all() {
          return all.shift() ?? { results: [] };
        },
      };
    },
  };
  return { db: db as unknown as D1Database, calls };
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("submission gate storage helpers", () => {
  it("stores drafts with hashed auth state and verifies state in constant-shape comparisons", async () => {
    const authHash = await sha256Hex("auth-state");
    const { db, calls } = createFakeDb({
      first: [
        {
          id: "draft_1",
          fieldsJson: '{"title":"Example"}',
          authStateHash: authHash,
        },
        { authStateHash: authHash },
        { authStateHash: null },
      ],
    });

    await createDraft(db, {
      id: "draft_1",
      status: "draft",
      category: "mcp",
      slug: "example",
      targetPath: "content/mcp/example.mdx",
      branchName: "heyclaude/submit-mcp-example",
      baseRef: "main",
      fields: { title: "Example" },
      authState: "auth-state",
    });

    expect(calls[0].sql).toContain("INSERT INTO submission_drafts");
    expect(calls[0].binds).toContain(authHash);
    expect(calls[0].binds).not.toContain("auth-state");
    await expect(getDraft(db, "draft_1")).resolves.toMatchObject({
      id: "draft_1",
      fieldsJson: '{"title":"Example"}',
    });
    await expect(verifyDraftState(db, "draft_1", "auth-state")).resolves.toBe(
      true,
    );
    await expect(verifyDraftState(db, "draft_1", "wrong-state")).resolves.toBe(
      false,
    );
  });

  it("updates draft auth, token lifecycle, and status patch fields", async () => {
    const { db, calls } = createFakeDb({
      first: [
        { encryptedToken: "encrypted-token" },
        { encryptedToken: "peek-token" },
      ],
    });

    await updateDraftAuthState(db, "draft_1", "next-state");
    await storeDraftUserToken(db, {
      draftId: "draft_1",
      encryptedToken: "encrypted-token",
      ttlSeconds: 10,
    });
    await expect(consumeDraftUserToken(db, "draft_1")).resolves.toBe(
      "encrypted-token",
    );
    await expect(getDraftUserToken(db, "draft_1")).resolves.toBe("peek-token");
    await updateDraftStatus(db, "draft_1", "submitted", {
      githubLogin: "octo",
      forkFullName: "octo/awesome-claude",
      pullRequestUrl: "https://github.com/JSONbored/awesome-claude/pull/1",
      pullRequestNumber: 1,
      verdict: "merge",
      verdictSummary: "Accepted",
    });

    expect(
      calls.some((call) => call.sql.includes("UPDATE submission_drafts")),
    ).toBe(true);
    const tokenInsert = calls.find((call) =>
      call.sql.includes("INSERT INTO submission_user_tokens"),
    );
    expect(tokenInsert?.binds).toContain("encrypted-token");
    expect(tokenInsert?.binds).toContain("2026-01-01T00:01:00.000Z");
    const statusUpdate = calls.at(-1);
    expect(statusUpdate?.binds).toEqual([
      "submitted",
      "octo",
      "octo/awesome-claude",
      "https://github.com/JSONbored/awesome-claude/pull/1",
      1,
      "merge",
      "Accepted",
      "2026-01-01T00:00:00.000Z",
      "draft_1",
    ]);
  });

  it("upserts PR state with terminal timestamps, retry metadata, and clear flags", async () => {
    const { db, calls } = createFakeDb();

    await upsertPrState(db, {
      repo: "JSONbored/awesome-claude",
      number: 42,
      headRepo: "contributor/awesome-claude",
      headRef: "submission/example",
      headSha: "abc123",
      baseRef: "main",
      installationId: 123,
      status: "closed",
      verdict: "close",
      verdictSummary: "Closed by gate",
      deliveryId: "delivery-1",
      lastReviewKey: "review-key",
      nextReviewAt: null,
      incrementAttempt: true,
      lastError: "not enough source evidence",
      lastCheckSummary: "validate-content failed",
      commentId: 1001,
      commentUrl:
        "https://github.com/JSONbored/awesome-claude/pull/42#issuecomment-1001",
      reviewId: 1002,
      schemaVersion: 2,
      formatterVersion: 5,
      decisionId: "decision-1",
      confidence: 0.92,
      sourceEvidenceHash: "source-hash",
      lastErrorCode: "source_evidence_conflict",
      lastRetryFingerprint: "fingerprint",
      retryFingerprintCount: 2,
      retryExhaustedAt: "2026-01-01T00:00:00.000Z",
      retryExhaustedReason: "budget exhausted",
      preserveRetryState: true,
    });

    const first = calls[0];
    expect(first.sql).toContain("INSERT INTO submission_prs");
    expect(first.binds).toContain("2026-01-01T00:00:00.000Z");
    expect(first.binds).toContain("source_evidence_conflict");
    expect(first.binds.slice(-3)).toEqual([1, 1, 1]);

    await upsertPrState(db, {
      repo: "JSONbored/awesome-claude",
      number: 42,
      baseRef: "main",
      status: "queued",
      resetAttemptCount: true,
      clearLastCheckSummary: true,
      clearVerdict: true,
      clearTerminal: true,
    });
    const second = calls[1];
    expect(second.binds).toContain("queued");
    expect(second.binds).toContain(1);
  });

  it("reads, lists, marks notifications, and inserts audit rows with bounded defaults", async () => {
    const prState = {
      repo: "JSONbored/awesome-claude",
      number: 42,
      status: "queued",
    };
    const { db, calls } = createFakeDb({
      first: [prState],
      all: [
        { results: [prState] },
        { results: [prState] },
        { results: [prState] },
      ],
    });

    await expect(
      getPrState(db, { repo: "JSONbored/awesome-claude", number: 42 }),
    ).resolves.toBe(prState);
    await expect(
      listDuePrStates(db, {
        nowIso: "2026-01-01T00:00:00.000Z",
        staleBeforeIso: "2025-12-31T23:30:00.000Z",
        queuedStaleBeforeIso: "2025-12-31T23:59:00.000Z",
        reviewingStaleBeforeIso: "2025-12-31T23:57:00.000Z",
      }),
    ).resolves.toEqual({ results: [prState] });
    await expect(listRecentPrStates(db, {})).resolves.toEqual({
      results: [prState],
    });
    await expect(
      listTerminalPrStatesForReconciliation(db, {}),
    ).resolves.toEqual({
      results: [prState],
    });
    await markPrNotificationSent(db, {
      repo: "JSONbored/awesome-claude",
      number: 42,
      notificationKey: "42:closed:comment",
    });
    await insertAudit(db, {
      id: "audit-1",
      targetKey: "JSONbored/awesome-claude#42",
      eventType: "decision",
      decision: "manual",
      summary: "Manual review required",
      r2Key: "submission-gate/audit-1.json",
    });

    expect(
      calls.find((call) => call.sql.includes("LIMIT ?"))?.binds.at(-1),
    ).toBe(25);
    expect(calls.at(-2)?.binds).toEqual([
      "42:closed:comment",
      "2026-01-01T00:00:00.000Z",
      "JSONbored/awesome-claude",
      42,
    ]);
    expect(calls.at(-1)?.sql).toContain("INSERT INTO submission_audit");
  });
});
