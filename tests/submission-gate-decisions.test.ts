import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { LABELS } from "../apps/submission-gate/src/constants";
import {
  SourceEvidenceRetryableError,
  checksForDecision,
  decisionMetadata,
  decisionStatus,
  decisionWithReviewContext,
  duplicateConflictRetryableContradicted,
  duplicateEvidenceConflictDecision,
  duplicateEvidenceConflictExhaustedDecision,
  duplicateReviewSummaryLine,
  gateCheckStatus,
  hasPrivateReviewErrorCode,
  isoBefore,
  isTimeoutError,
  nextReviewForError,
  nextReviewForStatus,
  normalizeOneShotDecision,
  normalizeRetryFingerprintPart,
  privateEvidenceClaimsDeadSourceUrl,
  privateEvidenceMatchesReachableSourceUrl,
  privateSourceHardFailureContradicted,
  privateStrictDuplicateContradicted,
  retryBackoffSecondsForCount,
  retryBudgetForCode,
  retryDelayForError,
  retryDelayForMergeError,
  retryErrorCode,
  retryExhaustedDecision,
  retryExhaustedStorageMetadata,
  retryFingerprintForDecision,
  retryStateForDecision,
  retryablePrecheckDecision,
  retryableTargetErrorDecision,
  retryableValidationReadDecision,
  sourceEvidenceUrlCandidates,
  sourceEvidenceConflictDecision,
  sourceEvidenceConflictExhaustedDecision,
  truncateForQueue,
} from "../apps/submission-gate/src/decisions";
import { GitHubApiError } from "../apps/submission-gate/src/github";
import type {
  ContentDuplicateReview,
  ContentDuplicateSignals,
} from "../apps/submission-gate/src/duplicates";
import type { GateDecision } from "../apps/submission-gate/src/review";
import type { SourceEvidenceReport } from "../apps/submission-gate/src/source-evidence";

const baseDecision = (overrides: Partial<GateDecision> = {}): GateDecision => ({
  verdict: "manual",
  labels: [LABELS.manual],
  summary: "needs maintainer attention",
  ...overrides,
});

const sourceEvidence = (
  overrides: Partial<SourceEvidenceReport> = {},
): SourceEvidenceReport => ({
  status: "passed",
  hash: "source-hash",
  urls: [
    {
      role: "canonical",
      url: "https://example.com/source",
      finalUrl: "https://example.com/source/",
      status: "passed",
      outcome: "reachable",
      httpStatus: 200,
    },
  ],
  checkedAt: "2026-01-01T00:00:00.000Z",
  ...overrides,
});

const duplicateReview = (
  overrides: Partial<ContentDuplicateReview> = {},
): ContentDuplicateReview => ({
  submitted: {
    title: "New MCP",
    slug: "new-mcp",
    category: "mcp",
    canonicalUrls: ["https://example.com/source"],
    repoUrls: ["https://github.com/example/new-mcp"],
    domainKeys: ["example.com"],
    normalizedTitle: "new mcp",
  } satisfies ContentDuplicateSignals,
  strictDuplicate: null,
  relatedCandidates: [],
  ...overrides,
});

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("submission gate decision invariants", () => {
  it("normalizes validation checks and terminal decision statuses", () => {
    expect(decisionStatus("merge")).toBe("merge_pending");
    expect(decisionStatus("manual")).toBe("manual");
    expect(decisionStatus("ignore")).toBe("ignored");
    expect(decisionStatus("close")).toBe("closed");

    expect(gateCheckStatus("missing")).toBe("pending");
    expect(gateCheckStatus("PASSED")).toBe("passed");
    expect(gateCheckStatus("unexpected")).toBe("unknown");
    expect(
      checksForDecision({
        checks: [
          { name: "validate-content", status: "missing" },
          { name: "coverage", status: "failed", details: "Codecov patch" },
        ],
      }),
    ).toEqual([
      { name: "validate-content", status: "pending", details: undefined },
      { name: "coverage", status: "failed", details: "Codecov patch" },
    ]);
  });

  it("adds deterministic review context without overwriting explicit decisions", () => {
    expect(
      decisionWithReviewContext(baseDecision(), {
        scope: {
          filePath: "content/mcp/example.mdx",
          category: "mcp",
          slug: "example",
          status: "added",
        },
        validation: {
          checks: [{ name: "required-pr-gate", status: "passed" }],
        },
      }),
    ).toMatchObject({
      scope: {
        filePath: "content/mcp/example.mdx",
        category: "mcp",
        slug: "example",
        status: "added",
      },
      checks: [{ name: "required-pr-gate", status: "passed" }],
    });

    expect(
      decisionWithReviewContext(
        baseDecision({
          scope: { filePath: "already-set.mdx" },
          checks: [{ name: "private-review", status: "failed" }],
        }),
        {
          scope: {
            filePath: "content/mcp/example.mdx",
            category: "mcp",
            slug: "example",
            status: "added",
          },
          validation: {
            checks: [{ name: "required-pr-gate", status: "passed" }],
          },
        },
      ),
    ).toMatchObject({
      scope: { filePath: "already-set.mdx" },
      checks: [{ name: "private-review", status: "failed" }],
    });
  });

  it("normalizes one-shot request-changes decisions into close decisions", () => {
    expect(
      normalizeOneShotDecision(
        baseDecision({
          verdict: "request_changes",
          labels: ["needs-work"],
          summary: "Fix missing safety notes.",
        }),
      ),
    ).toMatchObject({
      verdict: "close",
      close: true,
      labels: [LABELS.close],
    });

    expect(
      normalizeOneShotDecision(
        baseDecision({ verdict: "close", labels: [], summary: "Not a fit." }),
      ),
    ).toMatchObject({
      verdict: "close",
      close: true,
      labels: [LABELS.close],
    });

    const accepted = baseDecision({
      verdict: "merge",
      labels: [LABELS.merged],
    });
    expect(normalizeOneShotDecision(accepted)).toBe(accepted);
  });

  it("tracks retry fingerprints, budgets, backoff, and exhaustion metadata", () => {
    const decision = baseDecision({
      errors: [
        {
          code: "source_evidence_conflict",
          retryable: true,
          message: "private source failure contradicted deterministic evidence",
        },
      ],
      sourceEvidenceHash: "hash-a",
      summary: "source evidence conflicted",
    });

    expect(retryErrorCode(decision)).toBe("source_evidence_conflict");
    expect(retryBudgetForCode("source_evidence_conflict")).toBe(2);
    expect(retryBudgetForCode("unknown_code")).toBe(3);
    expect(retryBackoffSecondsForCount(0)).toBe(60);
    expect(retryBackoffSecondsForCount(99)).toBe(1_800);
    expect(retryFingerprintForDecision(decision)).toContain(
      "source_evidence_conflict:source:hash-a",
    );

    const first = retryStateForDecision(
      null,
      {
        repoFullName: "JSONbored/awesome-claude",
        number: 123,
        baseRef: "main",
        headSha: "abc",
      },
      decision,
    );
    expect(first).toMatchObject({
      code: "source_evidence_conflict",
      count: 1,
      maxAttempts: 2,
      exhausted: false,
      nextReviewAt: "2026-01-01T00:01:00.000Z",
    });

    const exhausted = retryStateForDecision(
      {
        headSha: "abc",
        lastErrorCode: first.code,
        lastRetryFingerprint: first.fingerprint,
        retryFingerprintCount: 2,
      },
      {
        repoFullName: "JSONbored/awesome-claude",
        number: 123,
        baseRef: "main",
        headSha: "abc",
      },
      decision,
    );
    expect(exhausted).toMatchObject({
      count: 3,
      maxAttempts: 2,
      exhausted: true,
      nextReviewAt: "2026-01-01T00:05:00.000Z",
    });

    const manual = retryExhaustedDecision(decision, exhausted);
    expect(manual).toMatchObject({
      verdict: "manual",
      labels: [LABELS.manual],
      retryState: exhausted,
    });
    expect(retryExhaustedStorageMetadata(manual)).toMatchObject({
      lastErrorCode: "source_evidence_conflict",
      retryFingerprintCount: 2,
      retryExhaustedAt: "2026-01-01T00:00:00.000Z",
    });
    expect(retryExhaustedStorageMetadata(baseDecision())).toEqual({});
    expect(
      hasPrivateReviewErrorCode(decision, "source_evidence_conflict"),
    ).toBe(true);
    expect(hasPrivateReviewErrorCode(decision, "missing")).toBe(false);
    expect(normalizeRetryFingerprintPart(" a\n b\t c ", 5)).toBe("a b c");
  });

  it("keeps retryable precheck and target errors machine-classifiable", () => {
    const report = sourceEvidence({ hash: "timed-out-source" });
    expect(
      retryablePrecheckDecision(
        new SourceEvidenceRetryableError("source evidence timed out", report),
      ),
    ).toMatchObject({
      errors: [{ code: "source_evidence_timeout", retryable: true }],
      sourceEvidenceHash: "timed-out-source",
    });

    expect(
      retryablePrecheckDecision(new Error("operation timed out")),
    ).toMatchObject({
      errors: [{ code: "source_evidence_timeout", retryable: true }],
    });
    expect(
      retryablePrecheckDecision(
        new GitHubApiError(403, "rate limit exceeded", {
          rateLimitRemaining: 0,
          retryAfterSeconds: 90,
        }),
      ),
    ).toMatchObject({
      errors: [{ code: "github_rate_limited", retryable: true }],
    });
    expect(retryablePrecheckDecision(new Error("not retryable"))).toBeNull();
    expect(
      retryableTargetErrorDecision(
        new GitHubApiError(403, "rate limit exceeded", {
          rateLimitRemaining: 0,
          retryAfterSeconds: 120,
        }),
      ),
    ).toMatchObject({
      errors: [{ code: "github_rate_limited", retryable: true }],
    });
    expect(retryableTargetErrorDecision(new Error("boom"))).toMatchObject({
      errors: [{ code: "github_api_unavailable", retryable: true }],
    });
    expect(
      retryableTargetErrorDecision(new Error("operation timed out")),
    ).toMatchObject({
      errors: [{ code: "github_api_unavailable", retryable: true }],
    });
    expect(
      retryableValidationReadDecision(
        new GitHubApiError(403, "rate limit exceeded", {
          rateLimitRemaining: 0,
          retryAfterSeconds: 45,
        }),
      ),
    ).toMatchObject({
      errors: [{ code: "github_rate_limited", retryable: true }],
    });
    expect(retryableValidationReadDecision("missing status API")).toMatchObject(
      {
        errors: [{ code: "github_api_unavailable", retryable: true }],
      },
    );
    expect(isTimeoutError(new DOMException("aborted", "AbortError"))).toBe(
      true,
    );
    expect(nextReviewForStatus("validation_pending")).toBe(
      "2026-01-01T00:01:30.000Z",
    );
    expect(nextReviewForStatus("merge_pending")).toBe(
      "2026-01-01T00:00:30.000Z",
    );
    expect(nextReviewForStatus("error_retryable")).toBe(
      "2026-01-01T00:01:00.000Z",
    );
    expect(nextReviewForStatus("manual")).toBeNull();
    expect(isoBefore(60)).toBe("2025-12-31T23:59:00.000Z");
    const rateLimited = new GitHubApiError(403, "rate limit exceeded", {
      rateLimitRemaining: 0,
      retryAfterSeconds: 1200,
    });
    expect(retryDelayForError(rateLimited)).toBe(1200);
    expect(retryDelayForError(new Error("offline"))).toBe(60);
    expect(retryDelayForMergeError(rateLimited)).toBe(1200);
    expect(retryDelayForMergeError(new Error("offline"))).toBe(30);
    expect(nextReviewForError(new Error("offline"))).toBe(
      "2026-01-01T00:01:00.000Z",
    );
  });

  it("escalates private-review conflicts when deterministic evidence contradicts them", () => {
    const source = sourceEvidence();
    const sourceClose = baseDecision({
      verdict: "close",
      reasonCode: "source_hard_failure",
      evidence: [
        {
          ruleId: "source_url_reachability",
          url: "https://example.com/source/",
          httpStatus: "404",
          outcome: "not found",
        },
      ],
    });
    expect(privateSourceHardFailureContradicted(sourceClose, source)).toBe(
      true,
    );
    expect(
      privateSourceHardFailureContradicted(
        { ...sourceClose, reasonCode: "strict_duplicate" },
        source,
      ),
    ).toBe(false);

    const duplicate = duplicateReview({
      relatedCandidates: [
        {
          type: "same_domain",
          existing: { filePath: "content/mcp/related.mdx", label: "Related" },
        },
      ],
    });
    const duplicateClose = baseDecision({
      verdict: "close",
      reasonCode: "strict_duplicate",
    });
    expect(privateStrictDuplicateContradicted(duplicateClose, duplicate)).toBe(
      true,
    );
    expect(
      duplicateConflictRetryableContradicted(
        baseDecision({
          errors: [{ code: "duplicate_evidence_conflict", retryable: true }],
        }),
        duplicate,
      ),
    ).toBe(true);
    expect(duplicateReviewSummaryLine(duplicate)).toBe(
      "no strict duplicate; 1 related candidate(s)",
    );

    expect(sourceEvidenceConflictDecision(sourceClose, source)).toMatchObject({
      errors: [{ code: "source_evidence_conflict", retryable: true }],
      sourceEvidenceHash: "source-hash",
    });
    expect(
      sourceEvidenceConflictExhaustedDecision(sourceClose, source),
    ).toMatchObject({
      verdict: "manual",
      labels: [LABELS.manual],
      sourceEvidenceHash: "source-hash",
    });
    expect(
      duplicateEvidenceConflictDecision(duplicateClose, duplicate),
    ).toMatchObject({
      errors: [{ code: "duplicate_evidence_conflict", retryable: true }],
    });
    expect(
      duplicateEvidenceConflictExhaustedDecision(
        duplicateClose,
        duplicate,
        source,
      ),
    ).toMatchObject({
      verdict: "manual",
      labels: [LABELS.manual],
    });

    const privateEvidence = {
      matchedUrl: "https://example.com/source/",
      ruleId: "source_url_reachability",
      outcome: "hard failure",
      behavior: "broken",
    };
    expect(sourceEvidenceUrlCandidates(privateEvidence)).toEqual([
      "https://example.com/source/",
    ]);
    expect(privateEvidenceClaimsDeadSourceUrl(privateEvidence)).toBe(true);
    expect(
      privateEvidenceMatchesReachableSourceUrl(privateEvidence, source),
    ).toBe(true);
    expect(
      privateEvidenceMatchesReachableSourceUrl({ outcome: "no url" }, source),
    ).toBe(false);
  });

  it("bounds queue metadata and emits stable decision metadata", () => {
    expect(truncateForQueue("  short message  ")).toBe("short message");
    expect(truncateForQueue("x".repeat(12), 8)).toBe("xxxxx...");
    expect(
      decisionMetadata(
        baseDecision({ decisionId: "decision-1", confidence: 0.9 }),
        {
          id: 123,
          url: "https://github.com/JSONbored/awesome-claude/pull/1#issuecomment-123",
        },
      ),
    ).toMatchObject({
      commentId: 123,
      commentUrl:
        "https://github.com/JSONbored/awesome-claude/pull/1#issuecomment-123",
      decisionId: "decision-1",
      confidence: 0.9,
    });
  });
});
