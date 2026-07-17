import { describe, expect, it } from "vitest";

import {
  checkSubmittedSourceEvidence,
  sourceEvidenceCloseDecision,
  type SourceEvidenceReport,
} from "../apps/submission-gate/src/source-evidence";

function report(urls: SourceEvidenceReport["urls"]): SourceEvidenceReport {
  return { status: "failed", hash: "source-hash", warnings: [], urls };
}

const deadRepo = {
  field: "repoUrl",
  url: "https://github.com/example/missing",
  status: "hard_failure" as const,
  role: "canonical" as const,
  blocking: true,
  outcome: "http_hard_failure",
  httpStatus: 404,
  finalUrl: "https://github.com/example/missing",
};

const reachableRepo = {
  field: "repoUrl",
  url: "https://github.com/example/present",
  status: "passed" as const,
  role: "canonical" as const,
  blocking: true,
  outcome: "reachable",
  httpStatus: 200,
  finalUrl: "https://github.com/example/present",
};

describe("submission-gate sourceEvidenceCloseDecision edge cases", () => {
  it("returns null when there is no hard-failure evidence to report", () => {
    expect(sourceEvidenceCloseDecision(report([reachableRepo]))).toBeNull();
  });

  it("stays manual when only some of two-or-more authoritative sources failed", () => {
    // Distinct from the single-authoritative-source case (which is always
    // manual by construction): here there ARE 2+ authoritative sources, but
    // not all of them failed, so it still must not escalate to a close.
    const decision = sourceEvidenceCloseDecision(
      report([deadRepo, reachableRepo]),
    );
    expect(decision).toMatchObject({
      verdict: "manual",
      close: false,
      reasonCode: "source_hard_failure",
    });
  });
});

describe("submission-gate canonical-source downgrade eligibility", () => {
  it("downgrades a distribution warning when the sole reachable canonical is a primary field", async () => {
    const source = [
      "---",
      "githubUrl: https://github.com/example/repo",
      "downloadUrl: https://registry.npmjs.org/example",
      "---",
      "",
      "Body.",
    ].join("\n");

    const result = await checkSubmittedSourceEvidence(source, async (url) => {
      if (url === "https://github.com/example/repo") {
        return new Response(null, { status: 200 });
      }
      return new Response("temporary", { status: 503 });
    });

    expect(result.status).toBe("passed");
    expect(result.warnings).toEqual([
      expect.objectContaining({ field: "downloadUrl", blocking: false }),
    ]);
  });

  it("does not downgrade a distribution warning when the sole reachable canonical isn't a primary field", async () => {
    const source = [
      "---",
      "documentationUrl: https://docs.github.com/example",
      "downloadUrl: https://registry.npmjs.org/example",
      "---",
      "",
      "Body.",
    ].join("\n");

    const result = await checkSubmittedSourceEvidence(source, async (url) => {
      if (url === "https://docs.github.com/example") {
        return new Response(null, { status: 200 });
      }
      return new Response("temporary", { status: 503 });
    });

    // documentationUrl is not in PRIMARY_CANONICAL_SOURCE_FIELDS and there's
    // only one reachable canonical, so hasVerifiableCanonicalSource is false
    // and the retryable distribution URL must stay blocking.
    expect(result.status).toBe("retryable");
    expect(result.warnings).toEqual([]);
    expect(
      result.urls.find((item) => item.field === "downloadUrl"),
    ).toMatchObject({ blocking: true, status: "retryable" });
  });
});

describe("submission-gate fetchSourceUrl redirect edge cases", () => {
  it("marks a redirect with no Location header as retryable", async () => {
    const source = [
      "---",
      "repoUrl: https://github.com/example/redirect-nowhere",
      "---",
      "",
      "Body.",
    ].join("\n");

    const result = await checkSubmittedSourceEvidence(source, async () => {
      return new Response(null, { status: 302 });
    });

    expect(result.urls[0]).toMatchObject({
      status: "retryable",
      outcome: "redirect_without_location",
    });
  });

  it("gives up after too many redirects", async () => {
    const source = [
      "---",
      "repoUrl: https://github.com/example/redirect-loop",
      "---",
      "",
      "Body.",
    ].join("\n");

    const result = await checkSubmittedSourceEvidence(source, async () => {
      return new Response(null, {
        status: 302,
        headers: { location: "https://github.com/example/redirect-loop" },
      });
    });

    expect(result.urls[0]).toMatchObject({
      status: "retryable",
      outcome: "too_many_redirects",
    });
  });
});
