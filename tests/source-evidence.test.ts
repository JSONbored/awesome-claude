import { describe, expect, it } from "vitest";

import {
  checkSubmittedSourceEvidence,
  extractSubmittedSourceUrls,
  sourceEvidenceCloseDecision,
  sourceEvidenceSummary,
  sourceEvidenceToDecisionEvidence,
  type SourceEvidenceReport,
} from "../apps/submission-gate/src/source-evidence";

describe("submission source evidence", () => {
  it("extracts scalar and list source URLs without duplicating field/url pairs", () => {
    const source = [
      "---",
      'repoUrl: "https://github.com/example/repo" # canonical',
      "downloadUrl: https://registry.npmjs.org/example",
      "sourceUrls:",
      "  - https://gitlab.com/example/repo",
      "  - 'https://gitlab.com/example/repo'",
      "  - https://docs.github.com/example",
      "---",
      "",
      "Body.",
    ].join("\n");

    expect(extractSubmittedSourceUrls(source)).toEqual([
      { field: "downloadUrl", url: "https://registry.npmjs.org/example" },
      { field: "repoUrl", url: "https://github.com/example/repo" },
      { field: "sourceUrls", url: "https://gitlab.com/example/repo" },
      { field: "sourceUrls", url: "https://docs.github.com/example" },
    ]);
  });

  it("downgrades inconclusive distribution URLs when canonical sources verify", async () => {
    const source = [
      "---",
      "repoUrl: https://github.com/example/repo",
      "documentationUrl: https://docs.github.com/example/repo",
      "downloadUrl: https://registry.npmjs.org/example",
      "websiteUrl: https://example.com/outside-allowlist",
      "---",
      "",
      "Body.",
    ].join("\n");
    const calls: string[] = [];
    const report = await checkSubmittedSourceEvidence(
      source,
      async (url, init) => {
        calls.push(`${init?.method}:${url}`);
        if (url === "https://github.com/example/repo") {
          return new Response(null, {
            status: 302,
            headers: { location: "https://github.com/example/repo/tree/main" },
          });
        }
        if (url === "https://github.com/example/repo/tree/main") {
          return new Response(null, { status: 200 });
        }
        if (
          url === "https://docs.github.com/example/repo" &&
          init?.method === "HEAD"
        ) {
          throw new Error("HEAD blocked");
        }
        if (url === "https://docs.github.com/example/repo") {
          return new Response("ok", { status: 200 });
        }
        if (url === "https://registry.npmjs.org/example") {
          return new Response("temporary", { status: 503 });
        }
        return new Response("unchecked", { status: 200 });
      },
    );

    expect(calls).toEqual(
      expect.arrayContaining([
        "HEAD:https://github.com/example/repo",
        "HEAD:https://github.com/example/repo/tree/main",
        "GET:https://docs.github.com/example/repo",
      ]),
    );
    expect(report.status).toBe("passed");
    expect(report.warnings).toEqual([
      expect.objectContaining({
        field: "downloadUrl",
        blocking: false,
        status: "retryable",
      }),
    ]);
    expect(sourceEvidenceSummary(report)).toContain(
      "non-blocking source-inconclusive warning",
    );
    expect(sourceEvidenceToDecisionEvidence(report)).toEqual([]);
  });

  it("turns deterministic hard source failures into manual or close decisions", () => {
    const report = (
      urls: SourceEvidenceReport["urls"],
    ): SourceEvidenceReport => ({
      status: "failed",
      hash: "source-hash",
      warnings: [],
      urls,
    });
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
    const invalidSource = {
      field: "sourceUrl",
      url: "notaurl",
      status: "hard_failure" as const,
      role: "canonical" as const,
      blocking: true,
      outcome: "invalid_url",
      error: "Invalid URL",
    };

    const manual = sourceEvidenceCloseDecision(report([deadRepo]));
    expect(manual).toMatchObject({
      verdict: "manual",
      close: false,
      reasonCode: "source_hard_failure",
    });
    expect(manual?.summary).toContain("A maintainer should decide");

    const close = sourceEvidenceCloseDecision(
      report([deadRepo, invalidSource]),
    );
    expect(close).toMatchObject({
      verdict: "close",
      close: true,
      reasonCode: "source_hard_failure",
      evidence: [
        expect.objectContaining({
          ruleId: "source_url_reachability",
          httpStatus: "404",
        }),
        expect.objectContaining({
          behavior: "sourceUrl is not a valid reachable source URL",
        }),
      ],
    });
  });
});
