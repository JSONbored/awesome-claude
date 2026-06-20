import { LABELS } from "./constants";
import { type ContentDuplicateReview } from "./duplicates";
import {
  GitHubApiError,
  githubRetryDelaySeconds,
  isGitHubRateLimitError,
} from "./github";
import {
  duplicateEvidenceContractExhaustedDecision,
  GATE_COMMENT_FORMATTER_VERSION,
  privateReviewErrorDecision,
  type GateDecision,
  type GateDecisionEvidence,
  type GateVerdict,
} from "./review";
import {
  sourceEvidenceSummary,
  type SourceEvidenceReport,
} from "./source-evidence";

export type ReviewTarget = {
  repoFullName: string;
  number: number;
  baseRef: string;
  headRepo?: string;
  headRef?: string;
  headSha?: string;
  installationId?: number;
};

export type DirectContentScope = {
  filePath: string;
  category: string;
  slug: string;
  status: string;
  rawUrl?: string;
};

export const VALIDATION_REQUEUE_SECONDS = 90;
export const MERGE_RETRY_SECONDS = 30;
export const RETRYABLE_ERROR_SECONDS = 60;
export const GITHUB_RATE_LIMIT_FALLBACK_SECONDS = 15 * 60;
export const RETRY_BACKOFF_SECONDS = [60, 120, 300, 600, 1_200, 1_800] as const;
export const RETRY_BUDGETS: Record<string, number> = {
  source_evidence_timeout: 6,
  private_reviewer_unavailable: 5,
  invalid_private_response: 5,
  github_rate_limited: 6,
  github_api_unavailable: 5,
  source_evidence_conflict: 2,
  duplicate_evidence_conflict: 2,
};

export class SourceEvidenceRetryableError extends Error {
  sourceEvidence: SourceEvidenceReport;

  constructor(message: string, sourceEvidence: SourceEvidenceReport) {
    super(message);
    this.name = "SourceEvidenceRetryableError";
    this.sourceEvidence = sourceEvidence;
  }
}

export function nowIso() {
  return new Date().toISOString();
}

export function isoAfter(seconds: number) {
  return new Date(Date.now() + seconds * 1000).toISOString();
}

export function isoBefore(seconds: number) {
  return new Date(Date.now() - seconds * 1000).toISOString();
}

export function truncateForQueue(value: unknown, maxLength = 500) {
  const text = String(value || "").trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
}

export function decisionStatus(verdict: GateVerdict) {
  if (verdict === "merge") return "merge_pending";
  if (verdict === "manual") return "manual";
  if (verdict === "ignore") return "ignored";
  return "closed";
}

export function gateCheckStatus(status: string) {
  const normalized = status.toLowerCase();
  if (normalized === "missing") return "pending" as const;
  if (
    ["passed", "pending", "failed", "neutral", "skipped", "unknown"].includes(
      normalized,
    )
  ) {
    return normalized as NonNullable<GateDecision["checks"]>[number]["status"];
  }
  return "unknown" as const;
}

export function checksForDecision(
  validation:
    | {
        checks?: Array<{ name: string; status: string; details?: string }>;
      }
    | null
    | undefined,
) {
  return (validation?.checks || []).map((check) => ({
    name: check.name,
    status: gateCheckStatus(check.status),
    details: check.details,
  }));
}

export function decisionWithReviewContext(
  decision: GateDecision,
  params: {
    scope?: DirectContentScope | null;
    validation?: {
      checks?: Array<{ name: string; status: string; details?: string }>;
    } | null;
  } = {},
): GateDecision {
  return {
    ...decision,
    scope:
      decision.scope ||
      (params.scope
        ? {
            filePath: params.scope.filePath,
            category: params.scope.category,
            slug: params.scope.slug,
            status: params.scope.status,
          }
        : undefined),
    checks: decision.checks?.length
      ? decision.checks
      : checksForDecision(params.validation),
  };
}

export function decisionMetadata(
  decision: GateDecision,
  comment?: { id?: number; url?: string },
  review?: { id?: number },
) {
  return {
    commentId: comment?.id ?? null,
    commentUrl: comment?.url || null,
    reviewId: review?.id ?? null,
    schemaVersion: decision.schemaVersion ?? 1,
    formatterVersion: GATE_COMMENT_FORMATTER_VERSION,
    decisionId: decision.decisionId || crypto.randomUUID(),
    confidence: decision.confidence ?? null,
    sourceEvidenceHash: decision.sourceEvidenceHash ?? null,
  };
}

export function nextReviewForStatus(status: string) {
  if (status === "validation_pending") {
    return isoAfter(VALIDATION_REQUEUE_SECONDS);
  }
  if (status === "merge_pending") {
    return isoAfter(MERGE_RETRY_SECONDS);
  }
  if (status === "error_retryable") {
    return isoAfter(RETRY_BACKOFF_SECONDS[0]);
  }
  return null;
}

export function retryDelayForError(error: unknown) {
  if (isGitHubRateLimitError(error)) {
    return githubRetryDelaySeconds(error, GITHUB_RATE_LIMIT_FALLBACK_SECONDS);
  }
  return RETRYABLE_ERROR_SECONDS;
}

export function retryDelayForMergeError(error: unknown) {
  if (
    isGitHubRateLimitError(error) ||
    (error instanceof GitHubApiError && error.status === 429)
  ) {
    return githubRetryDelaySeconds(error, GITHUB_RATE_LIMIT_FALLBACK_SECONDS);
  }
  return MERGE_RETRY_SECONDS;
}

export function nextReviewForError(error: unknown) {
  return isoAfter(retryDelayForError(error));
}

export function isTimeoutError(error: unknown) {
  if (!(error instanceof Error)) return false;
  return (
    error.name === "AbortError" ||
    error.name === "TimeoutError" ||
    /(?:operation was aborted due to timeout|aborted due to timeout|timed out|timeout)/i.test(
      error.message,
    )
  );
}

export function retryablePrecheckDecision(error: unknown) {
  if (error instanceof SourceEvidenceRetryableError) {
    return {
      ...privateReviewErrorDecision(error.message, "source_evidence_timeout"),
      sourceEvidenceHash: error.sourceEvidence.hash,
      sections: [
        {
          id: "source_review",
          title: "Source Review",
          status: "warn" as const,
          bullets: [
            "Deterministic source evidence could not conclusively verify all canonical source URLs.",
            sourceEvidenceSummary(error.sourceEvidence),
          ],
        },
      ],
    };
  }
  if (isGitHubRateLimitError(error)) {
    return privateReviewErrorDecision(
      "Submission gate deterministic duplicate/edit review hit a GitHub rate limit.",
      "github_rate_limited",
    );
  }
  if (isTimeoutError(error)) {
    return privateReviewErrorDecision(
      "Submission gate deterministic duplicate/edit review timed out while reading source or duplicate evidence.",
      "source_evidence_timeout",
    );
  }
  return null;
}

export function retryableTargetErrorDecision(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  if (isGitHubRateLimitError(error)) {
    return privateReviewErrorDecision(
      "Submission gate hit a GitHub rate limit while inspecting the pull request.",
      "github_rate_limited",
    );
  }
  if (isTimeoutError(error)) {
    return privateReviewErrorDecision(
      `Submission gate timed out while inspecting the pull request: ${message}`,
      "github_api_unavailable",
    );
  }
  return privateReviewErrorDecision(
    `Submission gate could not inspect the pull request: ${message}`,
    "github_api_unavailable",
  );
}

export function retryableValidationReadDecision(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  if (isGitHubRateLimitError(error)) {
    return privateReviewErrorDecision(
      "Submission gate hit a GitHub rate limit while reading public validation checks.",
      "github_rate_limited",
    );
  }
  return privateReviewErrorDecision(
    `Submission gate could not read public validation checks: ${message}`,
    "github_api_unavailable",
  );
}

export function normalizeOneShotDecision(decision: GateDecision): GateDecision {
  if (decision.verdict === "close" && !decision.close) {
    return {
      ...decision,
      close: true,
      labels: decision.labels.length ? decision.labels : [LABELS.close],
    };
  }
  if (decision.verdict !== "request_changes") return decision;
  return {
    ...decision,
    verdict: "close",
    labels: [LABELS.close],
    close: true,
    summary: [
      decision.summary.trim(),
      "",
      "One-shot Review:",
      "- This submission needs changes, so the maintainer agent is closing it instead of keeping an iterative review open.",
      "- Please resubmit a new focused one-file content PR after fixing the issue.",
    ].join("\n"),
  };
}

export function hasPrivateReviewErrorCode(
  decision: GateDecision,
  code: string,
) {
  return Boolean(decision.errors?.some((error) => error.code === code));
}

export function retryErrorCode(decision: GateDecision) {
  const retryableError = decision.errors?.find(
    (error) => error.retryable || error.code,
  );
  return retryableError?.code || "private_reviewer_unavailable";
}

export function retryBudgetForCode(code: string) {
  return RETRY_BUDGETS[code] ?? 3;
}

export function retryBackoffSecondsForCount(count: number) {
  const index = Math.max(
    0,
    Math.min(count - 1, RETRY_BACKOFF_SECONDS.length - 1),
  );
  return RETRY_BACKOFF_SECONDS[index];
}

export function normalizeRetryFingerprintPart(value: unknown, maxLength = 220) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export function retryFingerprintForDecision(decision: GateDecision) {
  const code = retryErrorCode(decision);
  const sourceHash = decision.sourceEvidenceHash
    ? `source:${decision.sourceEvidenceHash}`
    : "";
  const errorText =
    decision.errors
      ?.map((error) => `${error.code}:${error.message || ""}`)
      .join("|") || "";
  return [
    code,
    sourceHash,
    normalizeRetryFingerprintPart(errorText || decision.summary),
  ]
    .filter(Boolean)
    .join(":");
}

export function retryStateForDecision(
  existing: Record<string, unknown> | null,
  target: ReviewTarget,
  decision: GateDecision,
) {
  const code = retryErrorCode(decision);
  const fingerprint = retryFingerprintForDecision(decision);
  const previousSameFingerprint =
    String(existing?.headSha || "") === String(target.headSha || "") &&
    String(existing?.lastErrorCode || "") === code &&
    String(existing?.lastRetryFingerprint || "") === fingerprint;
  const previousCount = previousSameFingerprint
    ? Number(existing?.retryFingerprintCount || 0)
    : 0;
  const count =
    Number.isFinite(previousCount) && previousCount > 0 ? previousCount + 1 : 1;
  const maxAttempts = retryBudgetForCode(code);
  const nextReviewAt = isoAfter(retryBackoffSecondsForCount(count));
  return {
    code,
    fingerprint,
    count,
    maxAttempts,
    nextReviewAt,
    exhausted: count > maxAttempts,
  };
}

export function retryExhaustedDecision(
  decision: GateDecision,
  retryState: ReturnType<typeof retryStateForDecision>,
): GateDecision {
  const exhaustedSummary = [
    "Summary:",
    `- Automation stopped after ${retryState.maxAttempts} retry attempt(s) for \`${retryState.code}\`.`,
    "- This is not a content rejection; the gate could not complete an infrastructure-dependent check.",
    `- Last retry reason: ${decision.summary.trim()}`,
    "",
    "Recommended Action:",
    "- A maintainer can recheck after the external service recovers, merge manually if review confirms no blocker, or close if review finds a real content issue.",
  ].join("\n");
  return {
    verdict: "manual",
    labels: [LABELS.manual],
    confidence: decision.confidence,
    sourceEvidenceHash: decision.sourceEvidenceHash,
    summary: exhaustedSummary,
    errors: [
      {
        code: retryState.code,
        retryable: false,
        message: `Retry budget exhausted after ${retryState.maxAttempts} automatic attempt(s).`,
      },
    ],
    sections: [
      {
        id: "summary",
        title: "Summary",
        status: "warn",
        bullets: [
          `Automation stopped after ${retryState.maxAttempts} retry attempt(s) for \`${retryState.code}\`.`,
          "This is not a content rejection; the gate could not complete an infrastructure-dependent check.",
          `Last retry reason: ${decision.summary.trim()}`,
        ],
      },
      {
        id: "recommended_action",
        title: "Recommended Action",
        status: "warn",
        bullets: [
          "Recheck after the external service recovers.",
          "Merge manually if maintainer review confirms no blocker.",
          "Close only if manual review finds a real content issue.",
        ],
      },
      ...(decision.sections || []),
    ],
    retryState,
  } as GateDecision & { retryState: ReturnType<typeof retryStateForDecision> };
}

export function retryExhaustedStorageMetadata(decision: GateDecision) {
  const retryState = (
    decision as GateDecision & {
      retryState?: ReturnType<typeof retryStateForDecision>;
    }
  ).retryState;
  if (!retryState?.exhausted) return {};
  return {
    lastError: truncateForQueue(decision.summary),
    lastErrorCode: retryState.code,
    lastRetryFingerprint: retryState.fingerprint,
    retryFingerprintCount: retryState.maxAttempts,
    retryExhaustedAt: nowIso(),
    retryExhaustedReason: truncateForQueue(decision.summary),
  };
}

export function sourceEvidenceConflictDecision(
  decision: GateDecision,
  sourceEvidence: SourceEvidenceReport,
) {
  const conflict = privateReviewErrorDecision(
    "Private review claimed source_hard_failure, but deterministic source evidence found the submitted source URLs reachable.",
    "source_evidence_conflict",
  );
  return {
    ...conflict,
    confidence: decision.confidence,
    sourceEvidenceHash: sourceEvidence.hash,
    sections: [
      {
        id: "source_review",
        title: "Source Review",
        status: "warn" as const,
        bullets: [
          "Private review reported a source URL reachability failure that conflicts with deterministic source evidence.",
          sourceEvidenceSummary(sourceEvidence),
          "The gate will retry with the deterministic source artifact before requiring manual review if the conflict persists.",
        ],
      },
    ],
  };
}

export function sourceEvidenceConflictExhaustedDecision(
  decision: GateDecision,
  sourceEvidence: SourceEvidenceReport,
): GateDecision {
  return {
    schemaVersion: 2,
    verdict: "manual",
    confidence: decision.confidence,
    sourceEvidenceHash: sourceEvidence.hash,
    labels: [LABELS.manual],
    summary: [
      "Summary:",
      "- Public validation and deterministic source evidence passed.",
      "- Private review repeatedly returned a source_hard_failure for URL reachability that conflicts with deterministic source evidence.",
      "- Automation will not override the private close into a merge; a maintainer must review the source evidence conflict.",
      "",
      "Source Review:",
      `- ${sourceEvidenceSummary(sourceEvidence)}`,
      "",
      "Recommended Action:",
      "- Review this source evidence conflict manually before deciding whether to merge or close the PR.",
    ].join("\n"),
    sections: [
      {
        id: "source_review",
        title: "Source Review",
        status: "warn",
        bullets: [
          "Deterministic source evidence found submitted source URLs reachable, but private review repeatedly reported a source reachability hard failure.",
          sourceEvidenceSummary(sourceEvidence),
        ],
      },
      {
        id: "recommended_action",
        title: "Recommended Action",
        status: "info",
        bullets: [
          "Review this source evidence conflict manually before deciding whether to merge or close the PR.",
        ],
      },
    ],
  };
}

export function duplicateReviewSummaryLine(
  duplicateReview: ContentDuplicateReview,
) {
  const relatedCount = duplicateReview.relatedCandidates.length;
  return duplicateReview.strictDuplicate
    ? `strict duplicate: ${
        duplicateReview.strictDuplicate.existing.label ||
        duplicateReview.strictDuplicate.existing.filePath
      }`
    : `no strict duplicate${
        relatedCount ? `; ${relatedCount} related candidate(s)` : ""
      }`;
}

export function duplicateEvidenceConflictDecision(
  decision: GateDecision,
  duplicateReview: ContentDuplicateReview,
) {
  const conflict = privateReviewErrorDecision(
    "Private review claimed strict_duplicate, but deterministic duplicate review found no strict duplicate.",
    "duplicate_evidence_conflict",
  );
  return {
    ...conflict,
    confidence: decision.confidence,
    sections: [
      {
        id: "duplicate_history",
        title: "Duplicate and History Review",
        status: "warn" as const,
        bullets: [
          "Private review reported a strict duplicate that conflicts with deterministic duplicate review.",
          duplicateReviewSummaryLine(duplicateReview),
          "The gate will retry with the deterministic duplicate artifact before falling back to manual review.",
        ],
      },
    ],
  };
}

export function duplicateEvidenceConflictExhaustedDecision(
  decision: GateDecision,
  duplicateReview: ContentDuplicateReview,
  sourceEvidence: SourceEvidenceReport | null,
): GateDecision {
  return duplicateEvidenceContractExhaustedDecision({
    decision,
    duplicateSummary: duplicateReviewSummaryLine(duplicateReview),
    sourceSummary: sourceEvidence
      ? sourceEvidenceSummary(sourceEvidence)
      : null,
  });
}

export function sourceEvidenceUrlCandidates(evidence: GateDecisionEvidence) {
  return [
    evidence.url,
    evidence.matchedUrl,
    evidence.finalUrl,
    evidence.source,
  ].filter((value): value is string => Boolean(value));
}

export function privateEvidenceClaimsDeadSourceUrl(
  evidence: GateDecisionEvidence,
) {
  const httpStatus = Number(evidence.httpStatus || evidence.status || 0);
  if ([404, 410].includes(httpStatus)) return true;
  const text = [
    evidence.ruleId,
    evidence.outcome,
    evidence.status,
    evidence.behavior,
    evidence.policy,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return (
    text.includes("source_url_reachability") ||
    /\b(?:404|410)\b/.test(text) ||
    /\b(?:dead|broken|unreachable|not found|hard[-_ ]failure)\b/.test(text)
  );
}

export function privateEvidenceMatchesReachableSourceUrl(
  evidence: GateDecisionEvidence,
  sourceEvidence: SourceEvidenceReport,
) {
  const candidates = sourceEvidenceUrlCandidates(evidence);
  if (!candidates.length) return false;
  return sourceEvidence.urls.some((item) => {
    if (item.status !== "passed" || item.outcome !== "reachable") return false;
    return candidates.some(
      (url) => url === item.url || (item.finalUrl && url === item.finalUrl),
    );
  });
}

export function privateSourceHardFailureContradicted(
  decision: GateDecision,
  sourceEvidence: SourceEvidenceReport | null,
) {
  if (
    decision.verdict !== "close" ||
    decision.reasonCode !== "source_hard_failure" ||
    sourceEvidence?.status !== "passed" ||
    !sourceEvidence.urls.length
  ) {
    return false;
  }
  return (decision.evidence || []).some(
    (item) =>
      privateEvidenceClaimsDeadSourceUrl(item) &&
      privateEvidenceMatchesReachableSourceUrl(item, sourceEvidence),
  );
}

export function privateStrictDuplicateContradicted(
  decision: GateDecision,
  duplicateReview: ContentDuplicateReview | null,
) {
  return (
    decision.verdict === "close" &&
    decision.reasonCode === "strict_duplicate" &&
    Boolean(duplicateReview) &&
    !duplicateReview?.strictDuplicate
  );
}

export function duplicateConflictRetryableContradicted(
  decision: GateDecision,
  duplicateReview: ContentDuplicateReview | null,
) {
  return (
    hasPrivateReviewErrorCode(decision, "duplicate_evidence_conflict") &&
    Boolean(duplicateReview) &&
    !duplicateReview?.strictDuplicate
  );
}
