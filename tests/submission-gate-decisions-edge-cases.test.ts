import { describe, expect, it } from "vitest";

import { LABELS } from "../apps/submission-gate/src/constants";
import {
  checksForDecision,
  decisionMetadata,
  decisionWithReviewContext,
  isTimeoutError,
  normalizeOneShotDecision,
  normalizeRetryFingerprintPart,
  retryDelayForMergeError,
  retryErrorCode,
  retryFingerprintForDecision,
  retryableTargetErrorDecision,
} from "../apps/submission-gate/src/decisions";
import { GitHubApiError } from "../apps/submission-gate/src/github";
import type { GateDecision } from "../apps/submission-gate/src/review";

const baseDecision = (overrides: Partial<GateDecision> = {}): GateDecision => ({
  verdict: "manual",
  labels: [LABELS.manual],
  summary: "needs maintainer attention",
  ...overrides,
});

describe("submission-gate decisions edge cases", () => {
  it("defaults checks and review context when no validation input is given", () => {
    expect(checksForDecision(null)).toEqual([]);
    expect(checksForDecision(undefined)).toEqual([]);
    expect(checksForDecision({})).toEqual([]);

    expect(decisionWithReviewContext(baseDecision(), {})).toMatchObject({
      scope: undefined,
      checks: [],
    });
  });

  it("defaults decision metadata fields when no comment, review, or ids are supplied", () => {
    const metadata = decisionMetadata(baseDecision());
    expect(metadata).toMatchObject({
      commentId: null,
      commentUrl: null,
      reviewId: null,
      confidence: null,
      sourceEvidenceHash: null,
      schemaVersion: 1,
    });
    expect(typeof metadata.decisionId).toBe("string");
    expect(metadata.decisionId.length).toBeGreaterThan(0);
  });

  it("still applies rate-limit backoff for a 429 that isn't classified as GitHub rate limiting", () => {
    // isGitHubRateLimitError only recognizes status 403; retryDelayForMergeError
    // has a separate direct check for status 429 so that path isn't missed.
    const tooManyRequests = new GitHubApiError(429, "too many requests", {
      retryAfterSeconds: 2_000,
    });
    expect(retryDelayForMergeError(tooManyRequests)).toBe(2_000);

    const notRateLimited = new GitHubApiError(500, "server error");
    expect(retryDelayForMergeError(notRateLimited)).toBe(30);
  });

  it("treats non-Error values and unrelated Errors as non-timeouts", () => {
    expect(isTimeoutError("not an error instance")).toBe(false);
    expect(isTimeoutError(new Error("regular failure"))).toBe(false);
  });

  it("stringifies non-Error inputs when building a target-inspection decision", () => {
    expect(retryableTargetErrorDecision("plain string failure")).toMatchObject({
      errors: [{ code: "github_api_unavailable", retryable: true }],
      summary: expect.stringContaining("plain string failure"),
    });
  });

  it("keeps existing labels on a one-shot close decision instead of overwriting them", () => {
    expect(
      normalizeOneShotDecision(
        baseDecision({
          verdict: "close",
          labels: ["existing-label"],
        }),
      ),
    ).toMatchObject({
      close: true,
      labels: ["existing-label"],
    });
  });

  it("falls back to the default retry error code when a decision has no errors", () => {
    expect(retryErrorCode(baseDecision())).toBe("private_reviewer_unavailable");
    expect(
      retryErrorCode(
        baseDecision({ errors: [{ code: "custom_code", retryable: false }] }),
      ),
    ).toBe("custom_code");
  });

  it("normalizes a nullish fingerprint part to an empty string", () => {
    expect(normalizeRetryFingerprintPart(undefined)).toBe("");
  });

  it("builds a retry fingerprint from the summary when there is no evidence hash or error list", () => {
    expect(
      retryFingerprintForDecision(
        baseDecision({ summary: "plain summary, no errors or hash" }),
      ),
    ).toBe("private_reviewer_unavailable:plain summary, no errors or hash");
  });
});
