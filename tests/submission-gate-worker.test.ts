import { afterEach, describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import path from "node:path";

import {
  buildDraftTarget,
  buildContributorMdx,
  draftFieldsFromBody,
} from "../apps/submission-gate/src/drafts";
import {
  buildGitHubAppAuthorizeUrl,
  createGitHubAppJwt,
  getCommitValidationState,
  getRepositoryFileContent,
  listPullRequestFiles,
  upsertMarkerComment,
} from "../apps/submission-gate/src/github";
import {
  decryptText,
  encryptText,
  hmacSha256Hex,
  verifyGitHubWebhookSignature,
} from "../apps/submission-gate/src/security";
import {
  buildContentDuplicateReview,
  extractContentDuplicateSignals,
  findContentDuplicateMatch,
  findRelatedContentMatches,
  findStrictContentDuplicateMatch,
  protectedFrontmatterChanges,
} from "../apps/submission-gate/src/duplicates";
import {
  approvalReviewBody,
  enforceAutoMergeConfidenceFloor,
  isRetryableGateDecision,
  markerComment,
  normalizePrivateGateDecisionPayload,
  retryingReviewComment,
  supersededReviewComment,
  validationFailedDecision,
} from "../apps/submission-gate/src/review";
import {
  buildDiscordDecisionPayload,
  postDiscordDecisionNotification,
} from "../apps/submission-gate/src/notifications";
import { repoRoot } from "./helpers/registry-fixtures";

function readWorkerSource() {
  return fs.readFileSync(
    path.join(repoRoot, "apps/submission-gate/src/index.ts"),
    "utf8",
  );
}

function readConstantsSource() {
  return fs.readFileSync(
    path.join(repoRoot, "apps/submission-gate/src/constants.ts"),
    "utf8",
  );
}

function readStorageSource() {
  return fs.readFileSync(
    path.join(repoRoot, "apps/submission-gate/src/storage.ts"),
    "utf8",
  );
}

const SUPPORTED_DIRECT_CONTENT_CATEGORIES = [
  "agents",
  "collections",
  "commands",
  "guides",
  "hooks",
  "mcp",
  "rules",
  "skills",
  "statuslines",
  "tools",
];

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("Cloudflare submission gate helpers", () => {
  it("verifies GitHub webhook HMAC signatures", async () => {
    const payload = JSON.stringify({ action: "opened", number: 1 });
    const digest = await hmacSha256Hex("secret", payload);

    await expect(
      verifyGitHubWebhookSignature({
        secret: "secret",
        payload,
        signatureHeader: `sha256=${digest}`,
      }),
    ).resolves.toBe(true);
    await expect(
      verifyGitHubWebhookSignature({
        secret: "secret",
        payload,
        signatureHeader: "sha256=deadbeef",
      }),
    ).resolves.toBe(false);
  });

  it("builds GitHub App user-auth URLs with callback state", () => {
    const url = new URL(
      buildGitHubAppAuthorizeUrl({
        clientId: "Iv1.example",
        callbackUrl: "https://gate.example/auth/github/callback",
        state: "draft_123.state",
      }),
    );

    expect(url.origin).toBe("https://github.com");
    expect(url.pathname).toBe("/login/oauth/authorize");
    expect(url.searchParams.get("client_id")).toBe("Iv1.example");
    expect(url.searchParams.get("redirect_uri")).toBe(
      "https://gate.example/auth/github/callback",
    );
    expect(url.searchParams.get("state")).toBe("draft_123.state");
  });

  it("normalizes draft targets to one content file on the production branch", () => {
    const target = buildDraftTarget(
      { category: "mcp", name: "Example MCP Server" },
      "main",
    );

    expect(target).toEqual({
      category: "mcp",
      slug: "example-mcp-server",
      baseRef: "main",
      branchName: "heyclaude/submit-mcp-example-mcp-server",
      targetPath: "content/mcp/example-mcp-server.mdx",
    });
  });

  it("paginates GitHub pull request files before classifying content scope", async () => {
    const firstPage = Array.from({ length: 100 }, (_, index) => ({
      filename: `apps/web/public/data/generated-${index}.json`,
      status: "modified",
    }));
    const secondPage = [
      {
        filename: "content/tools/example-tool.mdx",
        status: "added",
        raw_url: "https://raw.githubusercontent.com/example/tool.mdx",
      },
    ];
    const fetchMock = vi.fn(async (url: URL | RequestInfo) => {
      const value = String(url);
      return Response.json(value.includes("page=2") ? secondPage : firstPage);
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      listPullRequestFiles({
        token: "ghs_test",
        repo: { owner: "JSONbored", repo: "awesome-claude" },
        number: 822,
      }),
    ).resolves.toHaveLength(101);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(String(fetchMock.mock.calls[0][0])).toContain("page=1");
    expect(String(fetchMock.mock.calls[1][0])).toContain("page=2");
  });

  it("caps generated branch names while keeping the full target slug", () => {
    const target = buildDraftTarget(
      { category: "skills", name: "A".repeat(240) },
      "main",
    );

    expect(target.slug).toHaveLength(120);
    expect(target.branchName.length).toBeLessThanOrEqual(120);
    expect(target.branchName).toMatch(/^heyclaude\/submit-skills-/);
    expect(target.targetPath).toBe(`content/skills/${target.slug}.mdx`);
  });

  it("accepts nested or flat draft payloads from website tooling", () => {
    expect(
      draftFieldsFromBody({
        fields: { category: "mcp", name: "Nested Draft" },
      }),
    ).toEqual({ category: "mcp", name: "Nested Draft" });
    expect(
      draftFieldsFromBody({ category: "skills", name: "Flat Draft" }),
    ).toEqual({ category: "skills", name: "Flat Draft" });
    expect(draftFieldsFromBody(null)).toEqual({});
  });

  it("generates contributor MDX without generated-artifact paths", () => {
    const mdx = buildContributorMdx(
      {
        category: "skills",
        name: "Example Skill",
        slug: "example-skill",
        description: "Useful source-backed skill.",
        docs_url: "https://example.com/docs",
        usage_snippet: "Use this skill for focused testing.",
        safety_notes: "Review scripts before running.",
        privacy_notes: "Does not collect user data.",
      },
      "contributor",
    );

    expect(mdx).toContain('category: "skills"');
    expect(mdx).toContain('submittedBy: "@contributor"');
    expect(mdx).not.toContain("README.md");
    expect(mdx).not.toContain("apps/web/public/data");
    expect(mdx).toContain(
      "Useful source-backed skill.\n\n## Safety\n\nReview scripts before running.",
    );
  });

  it.each(SUPPORTED_DIRECT_CONTENT_CATEGORIES)(
    "builds a one-file direct content draft for %s",
    (category) => {
      const target = buildDraftTarget(
        { category, name: `${category} direct fixture` },
        "main",
      );
      const mdx = buildContributorMdx(
        {
          category,
          name: `${category} direct fixture`,
          description:
            "Source-backed direct submission fixture for category coverage.",
          github_url: `https://github.com/example/${category}-direct-fixture`,
          safety_notes: "Review source provenance before use.",
          privacy_notes: "Review third-party data handling before use.",
        },
        "JSONbored",
      );

      expect(target.targetPath).toBe(
        `content/${category}/${category}-direct-fixture.mdx`,
      );
      expect(mdx).toContain(`category: "${category}"`);
      expect(mdx).toContain('submittedBy: "@JSONbored"');
      expect(mdx).toContain('submittedByUrl: "https://github.com/JSONbored"');
      expect(mdx).not.toContain("README.md");
      expect(mdx).not.toContain("apps/web/public/data");
    },
  );

  it("preserves multiline copy snippets as YAML block scalars", () => {
    const mdx = buildContributorMdx({
      category: "guides",
      name: "Multiline Guide",
      slug: "multiline-guide",
      description: "Guide with source content.",
      docs_url: "https://example.com/docs",
      full_copyable_content: "Step one\nStep two\nStep three",
      safety_notes: "Review before running.",
      privacy_notes: "No data collection.",
    });

    expect(mdx).toContain(
      "copySnippet: |\n  Step one\n  Step two\n  Step three",
    );
    expect(mdx).not.toContain("Step one\\nStep two\\nStep three");
  });

  it("escapes contributor body text before writing MDX", () => {
    const mdx = buildContributorMdx({
      category: "guides",
      name: "Unsafe MDX",
      description: "<script>{danger}</script>",
      guide_content: "import X from 'unsafe'\n<Component />",
      safety_notes: "<Danger /> {run}",
      privacy_notes: "[track](javascript:alert(1))",
    });

    const body = mdx.split("---\n").slice(2).join("---\n");
    expect(body).not.toContain("<script>");
    expect(body).not.toContain("<Component");
    expect(body).not.toContain("{run}");
    expect(body).toContain("&lt;script&gt;&#123;danger&#125;&lt;/script&gt;");
    expect(body).toContain("\\import X from 'unsafe'");
  });

  it("rejects PKCS#1 GitHub App private keys with a conversion hint", async () => {
    await expect(
      createGitHubAppJwt({
        appId: "123",
        privateKeyPem: [
          "-----BEGIN RSA",
          "PRIVATE KEY-----\nZmFrZQ==\n-----END RSA",
          "PRIVATE KEY-----",
        ].join(" "),
        now: 1_780_300_000_000,
      }),
    ).rejects.toThrow("GITHUB_APP_PRIVATE_KEY must be a PKCS#8 PEM block");
  });

  it("classifies required check state before private review can run", async () => {
    const fetchMock = vi.fn(async (url: string | URL | Request) => {
      expect(String(url)).toContain(
        "/repos/JSONbored/awesome-claude/commits/abc123/check-runs",
      );
      return Response.json({
        check_runs: [
          {
            name: "validate-content",
            status: "completed",
            conclusion: "success",
            completed_at: "2026-06-02T00:00:00Z",
          },
        ],
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      getCommitValidationState({
        token: "ghs_test",
        repo: { owner: "JSONbored", repo: "awesome-claude" },
        ref: "abc123",
        requiredChecks: ["validate-content"],
      }),
    ).resolves.toMatchObject({
      state: "passed",
      checks: [{ name: "validate-content", status: "passed" }],
    });
  });

  it("treats neutral Superagent scans as non-failing content gate signals", async () => {
    const fetchMock = vi.fn(async () =>
      Response.json({
        check_runs: [
          {
            name: "validate-content",
            status: "completed",
            conclusion: "success",
            completed_at: "2026-06-02T00:00:00Z",
          },
          {
            name: "Superagent Security Scan",
            status: "completed",
            conclusion: "neutral",
            completed_at: "2026-06-02T00:00:01Z",
          },
        ],
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      getCommitValidationState({
        token: "ghs_test",
        repo: { owner: "JSONbored", repo: "awesome-claude" },
        ref: "abc123",
        requiredChecks: ["validate-content", "Superagent Security Scan"],
      }),
    ).resolves.toMatchObject({
      state: "passed",
      checks: [
        { name: "validate-content", status: "passed" },
        {
          name: "Superagent Security Scan",
          status: "passed",
          details: "concluded neutral",
        },
      ],
    });
  });

  it("keeps private review behind required PR validation", () => {
    const source = readWorkerSource();
    const validationIndex = source.indexOf("getCommitValidationState({");
    const privateReviewIndex = source.indexOf("reviewWithPrivateGate(env, {");
    const refreshIndex = source.indexOf(
      "pullForNotification = await getPullRequest({",
    );
    const outOfScopeIndex = source.indexOf(
      "await ignoreOutOfScopeReviewTarget({",
      refreshIndex,
    );

    expect(source).toContain("CONTENT_GATE_BASE_REF");
    expect(source).toContain("function contentGateBaseRef");
    expect(source).toContain("function isContentGatePr");
    expect(source).toContain("function editedPayloadHasBaseRefChange");
    expect(source).toContain('if (action !== "edited") return true;');
    expect(source).toContain("return editedPayloadHasBaseRefChange(payload);");
    expect(source).toContain(
      'const DEFAULT_REQUIRED_VALIDATION_CHECKS = [\n  "validate-content",\n  "Superagent Security Scan",\n]',
    );
    expect(source).toContain('"check_run"');
    expect(source).toContain('"check_suite"');
    expect(source).toContain('"status"');
    expect(source).toContain("targetsFromCommitSha(env, payload");
    expect(source).toContain("checkRun?.head_sha");
    expect(source).toContain("checkSuite?.head_sha");
    expect(readConstantsSource()).toContain('"edited"');
    expect(source).toContain('status: "validation_pending"');
    expect(source).toContain('nextReviewForStatus("validation_pending")');
    expect(source).toContain("REVIEWING_STALE_SECONDS");
    expect(source).toContain("QUEUED_STALE_SECONDS");
    expect(source).toContain("PRIVATE_REVIEW_TIMEOUT_MS = 45_000");
    expect(source).toContain("INVALID_PRIVATE_RESPONSE_MAX_RETRIES = 3");
    expect(source).toContain("queuedStaleBeforeIso");
    expect(source).toContain("reviewingStaleBeforeIso");
    expect(source).toContain("lastCheckSummary: validation.summary");
    expect(source).toContain("target.headSha = pullForNotification.head.sha");
    expect(source).toContain("target: {");
    expect(source).toContain("installationId: target.installationId");
    expect(source).toContain("normalizePrivateGateDecisionPayload(raw)");
    expect(source).toContain("isRetryableGateDecision(decision)");
    expect(source).toContain(
      "shouldStopRetryingInvalidPrivateResponse(decision, existing)",
    );
    expect(source).toContain('"private_review_contract_exhausted"');
    expect(source).toContain('"invalid_private_response"');
    expect(source).toContain('"private_reviewer_unavailable"');
    expect(source).not.toContain("summary.includes");
    expect(source).not.toContain(
      "ai maintainer review returned an unexpected payload",
    );
    expect(source).toContain('status: "error_retryable"');
    expect(source).toContain("retryingReviewComment(");
    expect(source).toContain("validation: validationForPrivateReview");
    expect(source).toContain("contentScope: contentScopeForPrivateReview");
    expect(source).toContain("duplicateHistoryRequired: true");
    expect(source).toContain("strictDuplicatePolicy:");
    expect(source).toContain("relatedContentPolicy:");
    expect(source).toContain("collectionPolicy:");
    expect(source).toContain("defensiveSecurityPolicy:");
    expect(source).toContain(
      "Do not close a submission merely because it defensively discusses OAuth",
    );
    expect(source).toContain("closeEvidenceContract:");
    expect(source).toContain("Every close verdict must include reasonCode");
    expect(source).toContain("deterministicDuplicateReview");
    expect(source).toContain('eventType: "duplicate_shadow_review"');
    expect(source).toContain('decision: "related_not_strict_duplicate"');
    expect(source).toContain(
      "Public directory index fetch failed during duplicate scan",
    );
    expect(source).toContain("acceptedContentSignals({\n      env: params.env");
    expect(source).not.toContain("getRepositoryBlobText({");
    expect(source).not.toContain("getRepositoryTree({");
    expect(source).toContain("function ignoreOutOfScopeReviewTarget");
    expect(source).toContain(
      "Skipped because this PR no longer targets the configured content gate base.",
    );
    expect(outOfScopeIndex).toBeGreaterThan(refreshIndex);
    expect(outOfScopeIndex).toBeLessThan(validationIndex);
    expect(validationIndex).toBeGreaterThan(0);
    expect(privateReviewIndex).toBeGreaterThan(validationIndex);
  });

  it("closes public validation failures instead of requesting changes", () => {
    expect(
      validationFailedDecision("Required validation failed."),
    ).toMatchObject({
      verdict: "close",
      reasonCode: "validation_failure",
      summary:
        "Required validation failed. The private content review will run after the public validation lane is green.",
      labels: ["submission-closed-by-gate"],
      close: true,
      evidence: [
        {
          ruleId: "validation_failure",
        },
      ],
    });
  });

  it("allows only trusted maintainer comments to trigger rechecks", () => {
    const source = readWorkerSource();
    const issueCommentIndex = source.indexOf(
      'if (eventName === "issue_comment")',
    );
    const issueCommentBlock = source.slice(
      issueCommentIndex,
      source.indexOf("if (VALIDATION_WEBHOOK_EVENTS", issueCommentIndex),
    );

    expect(source).toContain('if (eventName === "issue_comment")');
    expect(source).toContain('split(/\\s+/)[0] === "/recheck"');
    expect(source).toContain("TRUSTED_RECHECK_ASSOCIATIONS");
    expect(source).toContain('"OWNER"');
    expect(source).toContain('"MEMBER"');
    expect(source).toContain('"COLLABORATOR"');
    expect(source).toContain("targetFromIssueCommentRecheck");
    expect(issueCommentBlock).toContain("payload,\n      true,");
  });

  it("renders Taopedia-style verdict comments with stable sections", () => {
    const body = markerComment({
      verdict: "request_changes",
      summary: [
        "Summary:",
        "- Reviewed `content/guides/example.mdx` as a single-entry guide submission.",
        "",
        "Source Review:",
        "- Blocking source issue.",
        "",
        "Recommended Action:",
        "- Close and resubmit a focused PR.",
      ].join("\n"),
      labels: ["submission-closed-by-gate"],
      close: true,
    });

    expect(body).toContain("<!-- heyclaude-submission-gate -->\n> [!WARNING]");
    expect(body).toContain("> ## ❌ Needs changes");
    expect(body).toContain("> ℹ️ **Formatter:** `gate-comment-v5`");
    expect(body).toContain("> **Summary**");
    expect(body).toContain("<summary><strong>ℹ️ info · Source Review</strong>");
    expect(body).toContain("> **Recommended action**");
    expect(body).not.toContain("<summary><strong>Review metadata</strong>");
    expect(body).toContain("single-shot submission review");
    expect(body).toContain("Thanks for using [HeyClaude](https://heyclau.de)");
    expect(body).toContain("<summary><strong>❤️ Share</strong></summary>");
    expect(body).toContain("https://twitter.com/intent/tweet");
    expect(body).toContain("https://www.reddit.com/submit");
    expect(body).toContain("https://www.linkedin.com/sharing/share-offsite/");
    expect(body).toContain("https://github.com/JSONbored/awesome-claude/fork");
  });

  it("renders accepted submissions as direct merge decisions", () => {
    const body = markerComment({
      verdict: "merge",
      summary:
        "Summary:\n- Accepted after duplicate/history and source review.",
      labels: ["submission-merged-by-gate"],
      confidence: 0.92,
      scope: {
        filePath: "content/mcp/example.mdx",
        category: "mcp",
        slug: "example",
        status: "added",
      },
    });

    expect(body).toContain("> [!TIP]");
    expect(body).toContain("> ## ✅ Accepted and merged");
    expect(body).toContain("> ✅ **Confidence:** 92%");
    expect(body).toContain("`content/mcp/example.mdx`");
    expect(body).not.toContain("<summary><strong>Review metadata</strong>");
    expect(body).toContain(
      "passed content validation, Superagent, and private review",
    );
    expect(body).toContain("merges accepted source PRs directly");
    expect(body).toContain("JSONbored/awesome-claude");
    expect(body).toContain("Fork HeyClaude");
  });

  it("renders deterministic closures without confidence noise or duplicate summary text", () => {
    const body = markerComment({
      verdict: "close",
      summary: [
        "Summary:",
        "- This PR edits protected content identity, provenance, review, disclosure, source, or verification metadata.",
        "- HeyClaude allows one-file content edits through this gate only when they avoid protected fields and keep the entry identity intact.",
        "- Protected fields changed:",
        "- `dateAdded`",
        "- `packageVerified`",
        "",
        "Recommended Action:",
        "- Close this PR.",
      ].join("\n"),
      labels: ["submission-closed-by-gate"],
      close: true,
      scope: {
        filePath: "content/mcp/example.mdx",
        category: "mcp",
        slug: "example",
        status: "modified",
      },
      checks: [
        { name: "validate-content", status: "passed" },
        { name: "Superagent Security Scan", status: "passed" },
      ],
    });

    expect(body).toContain("> ℹ️ **Confidence:** rule-based");
    expect(body).not.toContain("Confidence:** not provided");
    const visibleBody = body.slice(0, body.indexOf("<details>"));
    expect(visibleBody).not.toContain("Protected fields changed");
    expect(visibleBody).not.toContain("`dateAdded`");
    expect(body).toContain(
      "<summary><strong>ℹ️ info · More Summary Detail</strong>",
    );
    expect(body).toContain("> - `dateAdded`");
    expect(body).toContain("> - `packageVerified`");
    expect(body).not.toContain("<summary><strong>Review metadata</strong>");
    expect((body.match(/This PR edits protected/g) || []).length).toBe(1);
    expect((body.match(/✅ `passed` validate-content/g) || []).length).toBe(1);
  });

  it("renders close reason codes and concrete evidence in collapsed detail", () => {
    const body = markerComment({
      verdict: "close",
      reasonCode: "source_hard_failure",
      evidence: [
        {
          ruleId: "source_url_reachability",
          source: "https://example.com/docs",
          behavior: "documentationUrl returned 404",
          fix: "Replace or remove the dead documentationUrl.",
        },
      ],
      summary:
        "Summary:\n- The entry is otherwise viable, but documentationUrl returned 404.",
      labels: ["submission-closed-by-gate"],
      close: true,
      confidence: 0.86,
    });

    expect(body).toContain("> ℹ️ **Reason:** `source_hard_failure`");
    expect(body).toContain("Decision Evidence");
    expect(body).toContain("source_url_reachability");
    expect(body).toContain("documentationUrl returned 404");
  });

  it("renders pending, retrying, and superseded gate comments as GitHub cards", () => {
    expect(markerComment()).toContain("> ## ℹ️ Public validation running");
    expect(markerComment()).toContain(
      "> - ⏳ **Public validation:** `running`",
    );
    expect(markerComment()).toContain(
      "> - ⏸️ **Private maintainer gate:** `waiting`",
    );
    expect(retryingReviewComment()).toContain("> ## ⚠️ Review retrying");
    expect(retryingReviewComment()).toContain(
      "> - ⚠️ **Private maintainer gate:** `retrying`",
    );
    expect(
      supersededReviewComment(
        "<!-- heyclaude-submission-gate -->",
        "https://github.com/JSONbored/awesome-claude/pull/1#issuecomment-2",
      ),
    ).toContain("> ## ℹ️ Superseded gate report");
  });

  it("keeps clean default-confidence merge verdicts on the merge path", () => {
    const decision = enforceAutoMergeConfidenceFloor({
      schemaVersion: 2,
      verdict: "merge",
      confidence: 0.76,
      summary:
        "Summary:\n- No blocking issues detected.\n- The PR meets all repository policies and can be merged directly.\nRecommended Action:\n- Recommend direct merge.",
      labels: ["submission-merged-by-gate"],
      checks: [{ name: "validate-content", status: "passed" }],
      sections: [
        {
          id: "source_review",
          status: "pass",
          bullets: ["Primary source is reachable."],
        },
      ],
    });

    expect(decision).toMatchObject({
      verdict: "merge",
      confidence: 0.76,
      labels: ["submission-merged-by-gate"],
    });
    expect(decision.errors).toBeUndefined();
  });

  it("routes ambiguous low-confidence private merge verdicts to manual review", () => {
    const decision = enforceAutoMergeConfidenceFloor({
      schemaVersion: 2,
      verdict: "merge",
      confidence: 0.7,
      summary:
        "Summary:\n- Content appears useful, but evidence is not strong enough and the source claims could not be verified.",
      labels: ["submission-merged-by-gate"],
      checks: [{ name: "validate-content", status: "passed" }],
      sections: [
        {
          id: "source_review",
          status: "warn",
          bullets: ["Source evidence is ambiguous."],
        },
      ],
    });

    expect(decision).toMatchObject({
      verdict: "manual",
      confidence: 0.7,
      labels: ["submission-manual-review"],
      errors: [
        {
          code: "low_private_review_confidence",
          retryable: false,
        },
      ],
    });
    expect(decision.summary).toContain("unattended merge floor is 85%");
    expect(markerComment(decision)).toContain("> [!IMPORTANT]");
    expect(markerComment(decision)).toContain("Confidence Review");
    expect(markerComment(decision)).toContain(
      "needs maintainer judgment before automation continues",
    );
  });

  it("normalizes GateDecisionV2 and rejects malformed private review payloads", () => {
    expect(
      normalizePrivateGateDecisionPayload({
        schemaVersion: 2,
        verdict: "merge",
        confidence: 0.91,
        summary: ["Summary:", "- Looks good."],
        labels: ["submission-merged-by-gate"],
        scope: {
          filePath: "content/mcp/example.mdx",
          category: "mcp",
          slug: "example",
          status: "added",
        },
        checks: [{ name: "validate-content", status: "passed" }],
        sections: [
          {
            id: "recommended_action",
            status: "pass",
            bullets: ["Merge this PR."],
          },
        ],
      }).decision,
    ).toMatchObject({
      schemaVersion: 2,
      verdict: "merge",
      confidence: 0.91,
      checks: [{ name: "validate-content", status: "passed" }],
    });

    expect(
      normalizePrivateGateDecisionPayload({
        schemaVersion: 2,
        verdict: "request_changes",
        confidence: 0.5,
        summary: "No longer valid in V2.",
        labels: [],
        checks: [],
        sections: [],
      }).error,
    ).toMatchObject({
      code: "invalid_private_response",
      retryable: true,
    });

    expect(
      normalizePrivateGateDecisionPayload({
        schemaVersion: 2,
        verdict: "close",
        confidence: 0.9,
        reasonCode: "malicious_data_theft",
        evidence: [
          {
            ruleId: "malicious_data_theft_capability",
            snippet: "harvest cookies from browser sessions",
            behavior:
              "The submission instructs users to collect session cookies.",
            whyNotDefensive:
              "The content enables collection instead of warning, blocking, or redacting it.",
          },
        ],
        summary: "Summary:\n- Concrete credential-theft behavior is present.",
        labels: ["submission-closed-by-gate"],
        checks: [{ name: "validate-content", status: "passed" }],
        sections: [
          {
            id: "safety_privacy",
            status: "fail",
            bullets: ["Concrete credential-theft behavior is present."],
          },
        ],
      }).decision,
    ).toMatchObject({
      verdict: "close",
      reasonCode: "malicious_data_theft",
      evidence: [
        {
          ruleId: "malicious_data_theft_capability",
        },
      ],
    });

    expect(
      normalizePrivateGateDecisionPayload({
        schemaVersion: 2,
        verdict: "close",
        confidence: 0.86,
        summary:
          "Summary:\n- Matches an explicit secret, credential-theft, or malware/abuse pattern.",
        labels: ["submission-closed-by-gate"],
        checks: [{ name: "validate-content", status: "passed" }],
        sections: [
          {
            id: "safety_privacy",
            status: "fail",
            bullets: ["The matched pattern is concrete enough to close."],
          },
        ],
      }).error,
    ).toMatchObject({
      code: "invalid_private_response",
      retryable: true,
    });

    expect(
      normalizePrivateGateDecisionPayload({
        schemaVersion: 2,
        verdict: "close",
        confidence: 0.86,
        reasonCode: "malicious_data_theft",
        evidence: [
          {
            ruleId: "malicious_data_theft_capability",
            behavior: "A keyword pattern matched.",
          },
        ],
        summary: "Summary:\n- A safety keyword pattern matched.",
        labels: ["submission-closed-by-gate"],
        checks: [{ name: "validate-content", status: "passed" }],
        sections: [
          {
            id: "safety_privacy",
            status: "fail",
            bullets: ["A safety keyword pattern matched."],
          },
        ],
      }).error,
    ).toMatchObject({
      code: "invalid_private_response",
      retryable: true,
    });

    expect(
      normalizePrivateGateDecisionPayload({
        verdict: "close",
        summary:
          "Summary:\n- content/hooks/example.mdx fails a hard safety, secret, package, or abuse gate.\n\nSafety / Privacy:\n- The submission contains patterns that cannot be accepted through automatic content intake.",
        labels: ["submission-closed-by-gate"],
        close: true,
      }).error,
    ).toMatchObject({
      code: "invalid_private_response",
      retryable: true,
    });

    expect(
      normalizePrivateGateDecisionPayload({
        verdict: "request_changes",
        summary: "Temporary V1 fallback.",
        labels: ["submission-closed-by-gate"],
      }).decision,
    ).toMatchObject({
      verdict: "request_changes",
      summary: "Temporary V1 fallback.",
    });
  });

  it("retries private review only from structured retry errors", () => {
    expect(
      isRetryableGateDecision({
        verdict: "manual",
        summary:
          "Private corpus review request failed. A maintainer needs to review this.",
        labels: ["submission-manual-review"],
      }),
    ).toBe(false);

    expect(
      isRetryableGateDecision({
        verdict: "manual",
        summary:
          "Private corpus review returned an unexpected payload. A maintainer needs to review this.",
        labels: ["submission-manual-review"],
        errors: [
          {
            code: "invalid_private_response",
            retryable: true,
            message: "Private corpus review returned an unexpected payload.",
          },
        ],
      }),
    ).toBe(true);
  });

  it("keeps approval reviews short and links to the canonical report", () => {
    expect(
      approvalReviewBody(
        "https://github.com/JSONbored/awesome-claude/pull/1#issuecomment-2",
      ),
    ).toBe(
      [
        "Approved by HeyClaude Maintainer Agent.",
        "",
        "Full gate report: https://github.com/JSONbored/awesome-claude/pull/1#issuecomment-2",
      ].join("\n"),
    );
  });

  it("updates the newest bot marker comment and supersedes older bot reports", async () => {
    const fetchMock = vi.fn(
      async (url: URL | RequestInfo, init?: RequestInit) => {
        const value = String(url);
        if (value.includes("/issues/42/comments?")) {
          return Response.json([
            {
              id: 1,
              body: "<!-- heyclaude-submission-gate -->\nOld report",
              html_url:
                "https://github.com/JSONbored/awesome-claude/pull/42#issuecomment-1",
              user: { login: "heyclaude-submission-agent[bot]", type: "Bot" },
            },
            {
              id: 2,
              body: "<!-- heyclaude-submission-gate -->\nCurrent report",
              html_url:
                "https://github.com/JSONbored/awesome-claude/pull/42#issuecomment-2",
              user: { login: "heyclaude-submission-agent[bot]", type: "Bot" },
            },
            {
              id: 3,
              body: "<!-- heyclaude-submission-gate -->\nPasted marker",
              html_url:
                "https://github.com/JSONbored/awesome-claude/pull/42#issuecomment-3",
              user: { login: "contributor", type: "User" },
            },
          ]);
        }
        const body = JSON.parse(String(init?.body || "{}")) as {
          body?: string;
        };
        if (value.endsWith("/issues/comments/2")) {
          expect(init?.method).toBe("PATCH");
          expect(body.body).toBe("new canonical report");
          return Response.json({
            id: 2,
            html_url:
              "https://github.com/JSONbored/awesome-claude/pull/42#issuecomment-2",
            user: { login: "heyclaude-submission-agent[bot]", type: "Bot" },
          });
        }
        if (value.endsWith("/issues/comments/1")) {
          expect(init?.method).toBe("PATCH");
          expect(body.body).toContain("Superseded gate report");
          return Response.json({ id: 1 });
        }
        throw new Error(`Unexpected URL ${value}`);
      },
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      upsertMarkerComment({
        token: "ghs_test",
        repo: { owner: "JSONbored", repo: "awesome-claude" },
        issueNumber: 42,
        marker: "<!-- heyclaude-submission-gate -->",
        body: "new canonical report",
      }),
    ).resolves.toEqual({
      id: 2,
      url: "https://github.com/JSONbored/awesome-claude/pull/42#issuecomment-2",
      supersededIds: [1],
    });

    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("formats Discord decision notifications without marker or secret text", () => {
    const payload = buildDiscordDecisionPayload({
      repoFullName: "JSONbored/awesome-claude",
      prNumber: 700,
      prTitle: "feat(content): add useful guide",
      prUrl: "https://github.com/JSONbored/awesome-claude/pull/700",
      author: "JSONbored",
      verdict: "close",
      category: "guides",
      changedFile: "content/guides/useful-guide.mdx",
      ciSummary: "validate-content passed; Superagent Security Scan passed",
      summary: [
        "<!-- heyclaude-submission-gate -->",
        "Summary:",
        "- Closed because the submission reused an existing source URL.",
      ].join("\n"),
      now: new Date("2026-06-02T00:00:00.000Z"),
    });

    expect(payload.username).toBe("HeyClaude Maintainer Agent");
    expect(payload.embeds[0]).toMatchObject({
      title: "#700 closed · useful guide",
      url: "https://github.com/JSONbored/awesome-claude/pull/700",
      color: 0xda3633,
      timestamp: "2026-06-02T00:00:00.000Z",
    });
    expect(JSON.stringify(payload)).toContain("Content passed");
    expect(JSON.stringify(payload)).toContain("Superagent passed");
    expect(JSON.stringify(payload)).toContain("Result");
    expect(JSON.stringify(payload)).not.toContain("Repository");
    expect(JSON.stringify(payload)).not.toContain(
      "<!-- heyclaude-submission-gate -->",
    );
  });

  it("formats neutral Superagent Discord status as non-blocking", () => {
    const payload = buildDiscordDecisionPayload({
      repoFullName: "JSONbored/awesome-claude",
      prNumber: 826,
      prTitle: "content(mcp): add Chrome DevTools MCP server",
      author: "contributor",
      verdict: "merge",
      category: "mcp",
      changedFile: "content/mcp/chrome-devtools-mcp-server.mdx",
      ciSummary:
        "validate-content passed; Superagent Security Scan passed (concluded neutral)",
      summary:
        "Summary:\n- Submission adds the official Chrome DevTools MCP server with source evidence.",
    });

    expect(payload.embeds[0].title).toBe(
      "#826 merged · Chrome DevTools MCP server",
    );
    expect(JSON.stringify(payload)).toContain(
      "Superagent neutral, non-blocking",
    );
  });

  it("adds live HeyClaude entry links to merged content notifications", () => {
    const payload = buildDiscordDecisionPayload({
      repoFullName: "JSONbored/awesome-claude",
      prNumber: 841,
      prTitle: "content(mcp): update Magic MCP server",
      prUrl: "https://github.com/JSONbored/awesome-claude/pull/841",
      author: "JSONbored",
      verdict: "merge",
      category: "mcp",
      changedFile: "content/mcp/magic-mcp-server.mdx",
      ciSummary: "validate-content passed; Superagent Security Scan passed",
      summary:
        "Summary:\n- Updates an existing MCP entry with safer API key guidance.",
    });

    const fields = payload.embeds[0].fields;
    expect(fields).toContainEqual({
      name: "Live",
      value: "[View content](https://heyclau.de/entry/mcp/magic-mcp-server)",
      inline: false,
    });
  });

  it("does not add live content links to closed notifications", () => {
    const payload = buildDiscordDecisionPayload({
      repoFullName: "JSONbored/awesome-claude",
      prNumber: 839,
      prTitle: "content(mcp): update Magic MCP server",
      verdict: "close",
      category: "mcp",
      changedFile: "content/mcp/magic-mcp-server.mdx",
      ciSummary: "validate-content passed; Superagent Security Scan passed",
      summary:
        "Summary:\n- Closed because the submitted edit changed protected metadata.",
    });

    expect(payload.embeds[0].fields.map((item) => item.name)).not.toContain(
      "Live",
    );
  });

  it("keeps Discord notifications optional and non-blocking", async () => {
    await expect(
      postDiscordDecisionNotification({
        repoFullName: "JSONbored/awesome-claude",
        prNumber: 700,
        verdict: "merge",
      }),
    ).resolves.toEqual({
      ok: false,
      skipped: true,
      reason: "not_configured",
    });

    await expect(
      postDiscordDecisionNotification(
        {
          webhookUrl: "https://discord.com/api/webhooks/123/token",
          repoFullName: "JSONbored/awesome-claude",
          prNumber: 700,
          verdict: "close",
        },
        vi.fn().mockResolvedValue(new Response("", { status: 503 })),
      ),
    ).resolves.toMatchObject({
      ok: false,
      status: 503,
      reason: "discord_webhook_failed",
    });

    await expect(
      postDiscordDecisionNotification({
        webhookUrl: "https://discord.com/api/webhooks/123/token",
        repoFullName: "JSONbored/awesome-claude",
        prNumber: 700,
        verdict: "ignore",
      }),
    ).resolves.toEqual({
      ok: false,
      skipped: true,
      reason: "ignored_verdict",
    });
  });

  it("reconciles old verdict labels before applying a new gate decision", () => {
    const source = readWorkerSource();
    const removeIndex = source.indexOf("await removeLabels({");
    const addIndex = source.indexOf("await addLabels({", removeIndex);

    expect(source).toContain("const DECISION_LABELS = [");
    expect(source).toContain("const RECONCILED_GATE_LABELS = [");
    expect(source).toContain("LABELS.underReview");
    expect(source).toContain("const CONTENT_CATEGORY_LABELS = [");
    expect(source).toContain("categoryLabel");
    expect(source).toContain("!params.labelsToApply.includes(label)");
    expect(source).toContain("async function applyTerminalGateDecision");
    expect(removeIndex).toBeGreaterThan(0);
    expect(addIndex).toBeGreaterThan(removeIndex);
  });

  it("ignores non-content PRs before adding submission labels or comments", () => {
    const source = readWorkerSource();
    const pullRequestIndex = source.indexOf(
      'if (eventName === "pull_request")',
    );
    const pullRequestBlock = source.slice(
      pullRequestIndex,
      source.indexOf('if (eventName === "issue_comment")', pullRequestIndex),
    );
    const inspectIndex = pullRequestBlock.indexOf(
      "shouldInspectPullRequestFilesForWebhook(",
    );
    const classifyIndex = pullRequestBlock.indexOf(
      "directContentReviewabilityForTarget(",
    );
    const applyIndex = pullRequestBlock.indexOf("applyUnderReviewToTarget");

    expect(source).toContain('reason: "No source content entry file changed."');
    expect(source).toContain("function recordReviewedScanKey");
    expect(source).toContain(
      "function shouldInspectPullRequestFilesForWebhook",
    );
    expect(source).toContain("existingReviewKey !== reviewScanKey");
    expect(source).toContain("shouldResetIgnoredScan");
    expect(source).toContain("clearTerminal: shouldResetIgnoredScan");
    expect(source).toContain("lastReviewKey: reviewScanKey || undefined");
    expect(source).toContain('reason: "already_reviewed"');
    expect(pullRequestBlock).toContain('reviewability.kind === "ignore"');
    expect(inspectIndex).toBeGreaterThan(0);
    expect(classifyIndex).toBeGreaterThan(inspectIndex);
    expect(applyIndex).toBeGreaterThan(classifyIndex);
  });

  it("distinguishes generated-artifact tampering from ordinary non-content PRs", () => {
    const source = readWorkerSource();
    const classifierIndex = source.indexOf(
      "function classifyPullRequestFilesForContentReview",
    );
    const classifierBlock = source.slice(
      classifierIndex,
      source.indexOf(
        "async function directContentReviewabilityForPr",
        classifierIndex,
      ),
    );

    expect(classifierBlock).toContain("entryFiles.length === 0");
    expect(classifierBlock).toContain('kind: "ignore"');
    expect(classifierBlock).toContain("files.length !== 1");
    expect(classifierBlock).toContain(
      "context.headRepo.toLowerCase() === context.baseRepo.toLowerCase()",
    );
    expect(classifierBlock).toContain(
      "Mixed same-repository maintenance PR; content gate only reviews exact one-file content submissions.",
    );
    expect(classifierBlock).toContain('kind: "scope_failure"');
    expect(classifierBlock).toContain(
      "no generated artifacts, README, workflows, scripts, packages, or additional entries",
    );
    expect(source).toContain("type DirectContentReviewContext");
    expect(source).toContain("headRepo: target.headRepo");
    expect(source).toContain("baseRepo: target.repoFullName");
  });

  it("does not apply the merged label before direct merge succeeds", () => {
    const source = readWorkerSource();

    expect(source).toContain("function decisionStatus");
    expect(source).toContain('if (verdict === "merge") return "merge_pending"');
    expect(source).toContain("label !== LABELS.merged");
    expect(source).toContain(
      "label !== LABELS.merged && !categoryLabels.includes(label)",
    );
    expect(source).toContain("labels: [LABELS.merged, ...categoryLabels]");
    expect(source).toContain('status: "merged"');
    expect(source).toContain("await mergeAcceptedPullRequest({");
    expect(source).toContain("approvalReviewBody(params.reportCommentUrl)");
    expect(source).toContain("reportCommentUrl: acceptedReport.url");
    expect(source).toContain("        const mergedSummary = [");
    expect(source).not.toContain(
      [
        "        }",
        "        return;",
        "      }",
        "      const mergedSummary = [",
      ].join("\n"),
    );
    expect(source).toContain("SubmissionMergePendingError");
    expect(source).toContain('status: "merge_pending"');
    expect(source).toContain('decision: "merge_pending"');
    expect(source).toContain("message.retry({ delaySeconds: 30 })");
    expect(source).toContain("AUTO_MERGE_CONFIDENCE_FLOOR");
    expect(source).toContain("enforceAutoMergeConfidenceFloor(");
    expect(source.indexOf("normalizeOneShotDecision(decision)")).toBeLessThan(
      source.indexOf("enforceAutoMergeConfidenceFloor("),
    );
    expect(source.indexOf("enforceAutoMergeConfidenceFloor(")).toBeLessThan(
      source.indexOf("const status = decisionStatus(decision.verdict)"),
    );
  });

  it("closes direct content PRs when required validation fails", () => {
    const source = readWorkerSource();
    const validationBlock =
      source.match(
        /function validationGateDecision[\s\S]*?\nfunction validationSummaryForNotification/,
      )?.[0] || "";

    expect(source).not.toContain("validationFailedDecision");
    expect(validationBlock).toContain('verdict: "close"');
    expect(validationBlock).toContain(
      "hard validation failures are closed instead of iterated in place",
    );
    expect(validationBlock).toContain("Superagent did not pass");
    expect(validationBlock).toContain("Superagent did not return a clear");
  });

  it("notifies Discord only after actionable gate decisions", () => {
    const source = readWorkerSource();
    const ignoreBlock =
      source.match(
        /if \(reviewability.kind === "ignore"\) \{[\s\S]*?return;\n      \}/,
      )?.[0] || "";

    expect(source).toContain("DISCORD_SUBMISSION_WEBHOOK_URL");
    expect(source).toContain("postDiscordDecisionNotification({");
    expect(source).toContain("markPrNotificationSent");
    expect(source).toContain('eventType: "discord_notification"');
    expect(source).toContain("lastNotificationKey.startsWith(`${headSha}:`)");
    expect(source).toContain("discord_notification_skipped");
    expect(source).toContain(
      "Skipped Discord notification because this PR head already has a terminal gate notification.",
    );
    expect(source).toContain('if (params.decision.verdict === "ignore")');
    expect(ignoreBlock).not.toContain("notifyGateDecision");
  });

  it("keeps one-shot gate verdicts from being overwritten by later check events", () => {
    const source = readWorkerSource();
    const storageSource = readStorageSource();
    const enqueueIndex = source.indexOf("async function enqueueReviewTarget");
    const enqueueReadIndex = source.indexOf(
      "getPrState(env.SUBMISSION_GATE_DB",
      enqueueIndex,
    );
    const enqueueWriteIndex = source.indexOf(
      "await upsertPrState(env.SUBMISSION_GATE_DB",
      enqueueIndex,
    );
    const enqueueBlock = source.slice(enqueueIndex, enqueueWriteIndex);
    const reviewIndex = source.indexOf('if (message.kind === "review_pr")');
    const reviewReadIndex = source.indexOf(
      "getPrState(env.SUBMISSION_GATE_DB",
      reviewIndex,
    );
    const validationIndex = source.indexOf(
      "getCommitValidationState({",
      reviewIndex,
    );
    const reviewBlock = source.slice(reviewIndex, validationIndex);
    const terminalSetIndex = source.indexOf("const TERMINAL_GATE_VERDICTS");
    const terminalSetEndIndex = source.indexOf("]);", terminalSetIndex);
    const terminalSetBlock = source.slice(
      terminalSetIndex,
      terminalSetEndIndex,
    );
    const reconcileIndex = source.indexOf(
      "async function reconcileTerminalPullRequest",
    );
    const reconcileEndIndex = source.indexOf(
      "async function ignoreOutOfScopeReviewTarget",
      reconcileIndex,
    );
    const reconcileBlock = source.slice(reconcileIndex, reconcileEndIndex);

    expect(source).toContain("const TERMINAL_GATE_VERDICTS = new Set");
    expect(source).toContain("const TERMINAL_PR_STATUSES = new Set");
    expect(source).toContain("function hasTerminalGateDecision");
    expect(terminalSetBlock).not.toContain('"request_changes"');
    expect(terminalSetBlock).not.toContain('"merge"');
    expect(terminalSetBlock).not.toContain('"import"');
    expect(source).toContain("forceRecheck = false");
    expect(source).toContain(
      "payload: { eventName, deliveryId, target, webhook, forceRecheck }",
    );
    expect(source).toContain(
      'String(message.payload.eventName || "") === "issue_comment"',
    );
    expect(source).toContain(
      'TERMINAL_PR_STATUSES.has(String(state.status || ""))',
    );
    expect(source).toContain('"closed"');
    expect(source).toContain('"manual"');
    expect(source).toContain('"ignored"');
    expect(source).toContain(
      "Skipped because this submission already has a terminal gate decision.",
    );
    expect(source).toContain(
      "Skipped trusted recheck because this submission already has a terminal gate decision.",
    );
    expect(source).toContain("function isOpenPullRequest");
    expect(source).toContain("function terminalStatusFromPullRequest");
    expect(source).toContain("async function reconcileTerminalPullRequest");
    expect(source).toContain("function isReopenedPullRequestEvent");
    expect(source).toContain("shouldResetClosedTerminal");
    expect(source).toContain('String(state?.status || "") === "closed"');
    expect(source).toContain("labels: [LABELS.underReview]");
    expect(source).toContain(
      "Terminal gate state did not match open GitHub PR",
    );
    expect(source).toContain("GitHub terminal state verified.");
    expect(source).toContain(
      "GitHub PR was already closed; removed transient review label and skipped review continuation.",
    );
    expect(source).toContain('decision: "github_terminal_reconciled"');
    expect(source).toContain("clearVerdict: true");
    expect(source).toContain("clearTerminal: true");
    expect(reconcileBlock).not.toContain("clearVerdict");
    expect(storageSource).toContain(
      "COALESCE(last_error, '') != 'GitHub terminal state verified.'",
    );
    expect(storageSource).toContain("terminal_at IS NOT NULL");
    expect(storageSource).toContain("status = 'closed'");
    expect(storageSource).toContain(
      "excluded.status NOT IN ('merged', 'closed', 'manual', 'ignored')",
    );
    expect(storageSource).toContain("THEN submission_prs.status");
    expect(enqueueBlock).toContain("shouldResetClosedTerminal");
    expect(enqueueBlock).toContain("const shouldQueueReview");
    expect(enqueueBlock).toContain("!hasTerminalGateDecision(existing)");
    expect(enqueueBlock).toContain("shouldResetIgnoredScan");
    expect(enqueueBlock).toContain("shouldResetClosedTerminal");
    expect(enqueueBlock).toContain("if (!shouldQueueReview) return false");
    expect(reviewBlock).toContain("if (hasTerminalGateDecision(existing))");
    expect(enqueueBlock).not.toContain(
      "if (!forceRecheck && hasTerminalGateDecision(existing))",
    );
    expect(reviewBlock).not.toContain(
      "if (!forceRecheck && hasTerminalGateDecision(existing))",
    );
    expect(enqueueReadIndex).toBeGreaterThan(enqueueIndex);
    expect(enqueueWriteIndex).toBeGreaterThan(enqueueReadIndex);
    expect(reviewReadIndex).toBeGreaterThan(reviewIndex);
    expect(validationIndex).toBeGreaterThan(reviewReadIndex);
  });

  it("sweeps stale review queue rows instead of leaving validation-pending PRs stuck", () => {
    const source = readWorkerSource();
    const wranglerConfig = fs.readFileSync(
      path.join(repoRoot, "apps/submission-gate/wrangler.jsonc"),
      "utf8",
    );

    expect(source).toContain("async function sweepSubmissionQueue");
    expect(source).toContain("listDuePrStates(env.SUBMISSION_GATE_DB");
    expect(source).toContain("async function discoverOpenContentPullRequests");
    expect(source).toContain("OPEN_PR_DISCOVERY_LIMIT");
    expect(source).toContain("listOpenPullRequests({");
    expect(source).toContain("scheduled-discovery-");
    expect(source).toContain(
      'const closedTerminalButOpen = String(state?.status || "") === "closed"',
    );
    expect(source).toContain("!closedTerminalButOpen");
    expect(source).toContain(
      "await applyUnderReviewToTarget(env, target, reviewScope)",
    );
    expect(source).toContain('"validation_pending"');
    expect(source).toContain('"merge_pending"');
    expect(source).toContain('"error_retryable"');
    expect(source).toContain("function retryDelayForError");
    expect(source).toContain("isGitHubRateLimitError(error)");
    expect(source).toContain("githubRetryDelaySeconds(error");
    expect(source).toContain("nextReviewForError(error)");
    expect(source).toContain(
      "message.retry({ delaySeconds: retryDelayForError(error) })",
    );
    expect(source).toContain("scheduled(_controller, env, ctx)");
    expect(source).toContain("ctx.waitUntil(sweepSubmissionQueue(env))");
    expect(wranglerConfig).toContain('"triggers"');
    expect(wranglerConfig).toContain('"* * * * *"');
  });

  it("exposes maintainer-only non-secret queue state", () => {
    const source = readWorkerSource();

    expect(source).toContain('url.pathname === "/queue"');
    expect(source).toContain("function hasInternalBearer");
    expect(source).toContain("Bearer ${env.INTERNAL_SHARED_SECRET}");
    expect(source).toContain("listRecentPrStates(env.SUBMISSION_GATE_DB");
    expect(source).toContain("lastCheckSummary");
    expect(source).toContain("attemptCount");
    expect(source).toContain("retryReasons");
    expect(source).toContain("staleStates");
    expect(source).toContain("recentTerminal");
    expect(source).toContain("deadLetterQueue");
    expect(source).toContain("commentUrl");
    expect(source).toContain("formatterVersion");
    expect(readStorageSource()).toContain("comment_id AS commentId");
    expect(readStorageSource()).toContain(
      "formatter_version AS formatterVersion",
    );
  });

  it("records pull request inspection failures before returning from webhooks", () => {
    const source = readWorkerSource();
    const webhookIndex = source.indexOf("async function githubWebhookRoute");
    const webhookSource = source.slice(webhookIndex);

    expect(source).toContain("async function recordRetryableTargetError");
    expect(webhookSource).toContain(
      "await recordRetryableTargetError(env, target, deliveryId, error)",
    );
    expect(webhookSource).toContain("reason: isGitHubRateLimitError(error)");
    expect(webhookSource).toContain('"github_rate_limited"');
    expect(webhookSource).toContain('"inspection_retryable"');
  });

  it("merges accepted direct content PRs instead of creating import PRs", () => {
    const source = readWorkerSource();

    expect(source).toContain("async function directContentScopeForPr");
    expect(source).toContain(
      "async function assertDirectContentAutoMergeEligibility",
    );
    expect(source).toContain("async function mergeAcceptedPullRequest");
    expect(source).toContain("expectedHeadSha");
    expect(source).toContain(
      "Direct content auto-merge is only allowed for PRs targeting",
    );
    expect(source).toContain(
      "head branch was modified during content gate review",
    );
    expect(source).toContain("await assertDirectContentAutoMergeEligibility({");
    expect(source).toContain("approvePullRequest({");
    expect(source).toContain("mergePullRequest({");
    expect(source).toContain("listPullRequestFiles({");
    expect(source).toContain(
      "Direct content submissions must change exactly one source content file and no generated artifacts",
    );
    expect(source).toContain('finalAction: "merge_or_close"');
    expect(source).toContain("categoryReviewRequired: true");
    expect(source).toContain("categoryReviewRubric");
    [
      "agents",
      "collections",
      "commands",
      "guides",
      "hooks",
      "mcp",
      "rules",
      "skills",
      "statuslines",
      "tools",
    ].forEach((category) => {
      expect(source).toContain(`${category}: [`);
    });
    expect(source).not.toContain(
      "importJob: await synthesizeImportJobFromSourcePr",
    );
    expect(source).not.toContain("synthesizeImportJobFromSourcePr");
    expect(source).not.toContain(
      "Private review accepted this source, but did not return an import job.",
    );
  });

  it("does not expose the old maintainer-owned import runner path", () => {
    const source = readWorkerSource();

    expect(source).not.toContain("SUBMISSION_IMPORT_QUEUE");
    expect(source).not.toContain("SUBMISSION_IMPORT_RUNNER");
    expect(source).not.toContain("SubmissionImportRunner");
    expect(source).not.toContain("handleImportMessage");
    expect(source).not.toContain("completeImportPr");
    expect(source).not.toContain("importCompleteRoute");
    expect(source).not.toContain("/internal/import-complete");
    expect(source).not.toContain('body.kind === "import_pr"');
  });

  it("encrypts short-lived GitHub user token handoffs", async () => {
    const encrypted = await encryptText("handoff-secret", "ghu_example");

    expect(encrypted).not.toContain("ghu_example");
    expect(encrypted.split(".")).toHaveLength(3);
    await expect(decryptText("handoff-secret", encrypted)).resolves.toBe(
      "ghu_example",
    );
  });

  it("redacts draft PII before writing long-lived R2 audit objects", () => {
    const source = readWorkerSource();
    expect(source).toContain("fields: redactPublicDraftFields(fields)");
  });

  it("guards public draft creation before persistent writes", () => {
    const source = readWorkerSource();
    const routeSource =
      source.match(
        /async function createDraftRoute[\s\S]*?\nasync function getDraftRoute/,
      )?.[0] || "";
    const originIndex = routeSource.indexOf(
      "isAllowedRequestOrigin(request, env)",
    );
    const contentTypeIndex = routeSource.indexOf("isJsonContentType(request)");
    const rateLimitIndex = routeSource.indexOf(
      "enforceDraftRateLimit(request, env)",
    );
    const boundedReadIndex = routeSource.indexOf(
      "readJsonBodyWithLimit(request)",
    );
    const writeIndex = routeSource.indexOf(
      "createDraft(env.SUBMISSION_GATE_DB",
    );

    expect(originIndex).toBeGreaterThan(0);
    expect(contentTypeIndex).toBeGreaterThan(originIndex);
    expect(rateLimitIndex).toBeGreaterThan(contentTypeIndex);
    expect(boundedReadIndex).toBeGreaterThan(rateLimitIndex);
    expect(writeIndex).toBeGreaterThan(boundedReadIndex);
    expect(routeSource).not.toContain("request.json()");
    expect(source).toContain("const MAX_DRAFT_BODY_BYTES = 64 * 1024");
  });

  it("configures a durable Cloudflare rate limit for draft creation", () => {
    const wranglerConfig = fs.readFileSync(
      path.join(repoRoot, "apps/submission-gate/wrangler.jsonc"),
      "utf8",
    );

    expect(wranglerConfig).toContain('"ratelimits"');
    expect(wranglerConfig).toContain('"name": "SUBMISSION_DRAFT_RATE_LIMIT"');
  });

  it("limits GitHub webhook bodies before parsing or persistence", () => {
    const source = readWorkerSource();
    const webhookSource =
      source.match(
        /async function githubWebhookRoute[\s\S]*?\nasync function handleReviewMessage/,
      )?.[0] || "";
    const signatureIndex = webhookSource.indexOf(
      'request.headers.get("x-hub-signature-256")',
    );
    const missingSignatureIndex = webhookSource.indexOf("if (!signature)");
    const readIndex = webhookSource.indexOf("readRequestTextWithLimit");
    const verifyIndex = webhookSource.indexOf("verifyGitHubWebhookSignature");
    const parseIndex = webhookSource.indexOf("JSON.parse(raw)");
    const auditIndex = webhookSource.indexOf("putAuditObject");

    expect(source).toContain("const GITHUB_WEBHOOK_BODY_LIMIT_BYTES");
    expect(source).toContain("class RequestBodyTooLargeError extends Error");
    expect(source).toContain('error: "body_too_large"');
    expect(source).not.toContain("const raw = await request.text();");
    expect(signatureIndex).toBeGreaterThan(0);
    expect(missingSignatureIndex).toBeGreaterThan(signatureIndex);
    expect(readIndex).toBeGreaterThan(missingSignatureIndex);
    expect(verifyIndex).toBeGreaterThan(readIndex);
    expect(parseIndex).toBeGreaterThan(verifyIndex);
    expect(auditIndex).toBeGreaterThan(parseIndex);
  });

  it("rejects cancelled GitHub authorization callbacks before token exchange", () => {
    const source = readWorkerSource();
    const callbackSource =
      source.match(
        /async function githubCallbackRoute[\s\S]*?\nfunction isContentGatePr/,
      )?.[0] || "";
    const guardIndex = callbackSource.indexOf("if (providerError || !code)");
    const exchangeIndex = callbackSource.indexOf("exchangeGitHubUserCode");

    expect(guardIndex).toBeGreaterThan(0);
    expect(exchangeIndex).toBeGreaterThan(guardIndex);
  });

  it("fails closed when webhook signing is not configured", () => {
    const source = readWorkerSource();
    const guardIndex = source.indexOf("if (!env.GITHUB_WEBHOOK_SECRET)");
    const verifyIndex = source.indexOf("verifyGitHubWebhookSignature({");

    expect(guardIndex).toBeGreaterThan(0);
    expect(verifyIndex).toBeGreaterThan(guardIndex);
    expect(source).toContain('error: "webhook_secret_not_configured"');
    expect(source).toContain("secret: env.GITHUB_WEBHOOK_SECRET,");
  });

  it("detects neutral duplicate submissions from canonical source URLs", () => {
    const existing = extractContentDuplicateSignals({
      filePath: "content/tools/ccusage.mdx",
      content: `---
title: ccusage
slug: ccusage
category: tools
description: Local CLI for analyzing Claude Code usage.
websiteUrl: "https://ccusage.com"
repoUrl: "https://github.com/ryoppippi/ccusage"
---
`,
      label: "accepted entry content/tools/ccusage.mdx",
    });
    const candidate = extractContentDuplicateSignals({
      filePath: "content/tools/usage-meter.mdx",
      content: `---
title: Claude Usage Meter
slug: usage-meter
category: tools
description: Command-line reports for coding-agent usage and cost tracking.
websiteUrl: "https://ccusage.com/?utm_source=submission"
repoUrl: "https://github.com/ryoppippi/ccusage#readme"
---
`,
    });

    expect(findContentDuplicateMatch(candidate, [existing])).toMatchObject({
      reasons: expect.arrayContaining([
        expect.stringContaining("same canonical source URL"),
      ]),
    });
  });

  it("fails aggressively on same non-generic source domains in one category", () => {
    const existing = extractContentDuplicateSignals({
      filePath: "content/tools/example.mdx",
      content: `---
title: Example Agent Tool
slug: example-agent-tool
category: tools
description: Source-backed tool listing.
websiteUrl: "https://example-agent-tool.dev"
---
`,
    });
    const candidate = extractContentDuplicateSignals({
      filePath: "content/tools/example-agent-workbench.mdx",
      content: `---
title: Example Agent Workbench
slug: example-agent-workbench
category: tools
description: Different wording for a related submission.
websiteUrl: "https://example-agent-tool.dev/pricing"
---
`,
    });

    expect(findContentDuplicateMatch(candidate, [existing])).toMatchObject({
      reasons: expect.arrayContaining([
        expect.stringContaining("same non-generic source domain"),
      ]),
    });
    expect(findStrictContentDuplicateMatch(candidate, [existing])).toBeNull();
    expect(findRelatedContentMatches(candidate, [existing])).toMatchObject([
      {
        reasons: expect.arrayContaining([
          expect.stringContaining("same non-generic source domain"),
        ]),
      },
    ]);
    expect(buildContentDuplicateReview(candidate, [existing])).toMatchObject({
      legacyDuplicate: {
        reasons: expect.arrayContaining([
          expect.stringContaining("same non-generic source domain"),
        ]),
      },
      strictDuplicate: null,
      relatedCandidates: [
        {
          reasons: expect.arrayContaining([
            expect.stringContaining("same non-generic source domain"),
          ]),
        },
      ],
    });
  });

  it("distinguishes related vendor resources from strict duplicates", () => {
    const collection = extractContentDuplicateSignals({
      filePath: "content/collections/cloudflare-ai-workflow-stack.mdx",
      content: `---
title: Cloudflare AI Workflow Stack
slug: cloudflare-ai-workflow-stack
category: collections
description: A collection of Cloudflare tools for building AI workflow systems.
websiteUrl: "https://developers.cloudflare.com/workers-ai/"
docsUrl: "https://developers.cloudflare.com/ai-gateway/"
---
`,
    });
    const specificTool = extractContentDuplicateSignals({
      filePath: "content/tools/cloudflare-ai-gateway.mdx",
      content: `---
title: Cloudflare AI Gateway
slug: cloudflare-ai-gateway
category: tools
description: Observability and routing gateway for AI model calls.
websiteUrl: "https://developers.cloudflare.com/ai-gateway/"
docsUrl: "https://developers.cloudflare.com/ai-gateway/get-started/"
---
`,
    });

    expect(
      findStrictContentDuplicateMatch(specificTool, [collection]),
    ).toBeNull();
    expect(findRelatedContentMatches(specificTool, [collection])).toMatchObject(
      [
        {
          reasons: expect.arrayContaining([
            expect.stringContaining(
              "same canonical source URL https://developers.cloudflare.com/ai-gateway across collection/resource categories",
            ),
          ]),
        },
      ],
    );
  });

  it("treats same canonical project across different categories as related context", () => {
    const existingMcp = extractContentDuplicateSignals({
      filePath: "content/mcp/langchain-mcp-server.mdx",
      content: `---
title: LangChain MCP Server
slug: langchain-mcp-server
category: mcp
description: MCP integration for LangChain workflows.
repoUrl: "https://github.com/langchain-ai/langchain"
---
`,
    });
    const candidateSkill = extractContentDuplicateSignals({
      filePath: "content/skills/langchain-agent-patterns.mdx",
      content: `---
title: LangChain Agent Patterns Skill
slug: langchain-agent-patterns
category: skills
description: Claude skill for applying LangChain agent patterns.
repoUrl: "https://github.com/langchain-ai/langchain.git"
---
`,
    });

    expect(
      findStrictContentDuplicateMatch(candidateSkill, [existingMcp]),
    ).toBeNull();
    expect(findRelatedContentMatches(candidateSkill, [existingMcp])).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          reasons: expect.arrayContaining([
            expect.stringContaining(
              "same canonical source URL https://github.com/langchain-ai/langchain across skills/mcp",
            ),
          ]),
        }),
      ]),
    );
  });

  it("treats collection member overlap as related context, not a strict duplicate", () => {
    const existingTool = extractContentDuplicateSignals({
      filePath: "content/tools/storybook-a11y.mdx",
      content: `---
title: Storybook Accessibility Testing
slug: storybook-a11y
category: tools
description: Tooling for accessibility checks inside Storybook.
docsUrl: "https://storybook.js.org/docs/writing-tests/accessibility-testing"
---
`,
    });
    const workflowCollection = extractContentDuplicateSignals({
      filePath: "content/collections/frontend-a11y-browser-qa.mdx",
      content: `---
title: Frontend A11y Browser QA Workflow
slug: frontend-a11y-browser-qa
category: collections
description: Ordered workflow for browser QA using Playwright, Storybook, and WCAG references.
docsUrl: "https://storybook.js.org/docs/writing-tests/accessibility-testing"
websiteUrl: "https://www.w3.org/WAI/test-evaluate/"
---
`,
    });

    expect(
      findStrictContentDuplicateMatch(workflowCollection, [existingTool]),
    ).toBeNull();
    expect(
      findRelatedContentMatches(workflowCollection, [existingTool]),
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          reasons: expect.arrayContaining([
            expect.stringContaining("across collection/resource categories"),
          ]),
        }),
      ]),
    );
  });

  it("treats same canonical repository and same purpose as a strict duplicate", () => {
    const existing = extractContentDuplicateSignals({
      filePath: "content/mcp/playwright-mcp-server.mdx",
      content: `---
title: Playwright MCP Server
slug: playwright-mcp-server
category: mcp
description: MCP server for browser automation through Playwright.
repoUrl: "https://github.com/microsoft/playwright-mcp"
---
`,
    });
    const candidate = extractContentDuplicateSignals({
      filePath: "content/mcp/browser-automation-mcp.mdx",
      content: `---
title: Browser Automation MCP
slug: browser-automation-mcp
category: mcp
description: MCP server for browser automation through Playwright.
repoUrl: "https://github.com/microsoft/playwright-mcp.git?utm_source=heyclaude"
---
`,
    });

    expect(
      findStrictContentDuplicateMatch(candidate, [existing]),
    ).toMatchObject({
      reasons: expect.arrayContaining([
        expect.stringContaining("same canonical source URL"),
      ]),
    });
  });

  it("treats shared safety doctrine as related context unless purpose also matches", () => {
    const existing = extractContentDuplicateSignals({
      filePath: "content/hooks/environment-variable-validator.mdx",
      content: `---
title: Environment Variable Validator Hook
slug: environment-variable-validator
category: hooks
description: PostToolUse hook that checks environment configuration file edits.
sourceUrl: "https://12factor.net/config"
---
`,
    });
    const candidate = extractContentDuplicateSignals({
      filePath: "content/hooks/environment-output-safety-reminder-hook.mdx",
      content: `---
title: Environment Output Safety Reminder Hook
slug: environment-output-safety-reminder-hook
category: hooks
description: PreToolUse hook that warns before shell commands print broad environment output.
sourceUrl: "https://12factor.net/config"
---
`,
    });

    expect(findStrictContentDuplicateMatch(candidate, [existing])).toBeNull();
    expect(findRelatedContentMatches(candidate, [existing])).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          reasons: expect.arrayContaining([
            expect.stringContaining(
              "same canonical source URL https://12factor.net/config in hooks",
            ),
          ]),
        }),
      ]),
    );
  });

  it("treats shared Claude Code skills docs as related context for distinct agent prompts", () => {
    const existing = extractContentDuplicateSignals({
      filePath: "content/agents/agent-skills-enterprise-librarian-agent.mdx",
      content: `---
title: Agent Skills Enterprise Librarian Agent
slug: agent-skills-enterprise-librarian-agent
category: agents
description: Source-backed agent that curates an organization's Agent Skills library.
documentationUrl: "https://code.claude.com/docs/en/skills"
---
`,
      label:
        "accepted entry content/agents/agent-skills-enterprise-librarian-agent.mdx",
    });
    const candidate = extractContentDuplicateSignals({
      filePath: "content/agents/ai-agent-cost-governance-analyst-agent.mdx",
      content: `---
title: AI Agent Cost Governance Analyst Agent
slug: ai-agent-cost-governance-analyst-agent
category: agents
description: Source-backed agent that analyzes and governs Claude Code spend from OpenTelemetry data.
documentationUrl: "https://code.claude.com/docs/en/skills"
---
`,
    });

    expect(findStrictContentDuplicateMatch(candidate, [existing])).toBeNull();
    expect(findRelatedContentMatches(candidate, [existing])).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          reasons: expect.arrayContaining([
            expect.stringContaining(
              "same canonical source URL https://code.claude.com/docs/en/skills in agents",
            ),
          ]),
        }),
      ]),
    );
  });

  it("treats shared Claude Code MCP docs as related context for distinct MCP agent prompts", () => {
    const existing = extractContentDuplicateSignals({
      filePath: "content/agents/mcp-tool-result-budget-review-agent.mdx",
      content: `---
title: MCP Tool Result Budget Review Agent
slug: mcp-tool-result-budget-review-agent
category: agents
description: Source-backed agent that reviews MCP tool result payload size and budget policy.
documentationUrl: "https://code.claude.com/docs/en/mcp"
---
`,
      label:
        "accepted entry content/agents/mcp-tool-result-budget-review-agent.mdx",
    });
    const candidate = extractContentDuplicateSignals({
      filePath: "content/agents/mcp-oauth-integration-reviewer-agent.mdx",
      content: `---
title: MCP OAuth Integration Reviewer Agent
slug: mcp-oauth-integration-reviewer-agent
category: agents
description: Source-backed agent that reviews OAuth-based MCP server integrations in Claude Code.
documentationUrl: "https://code.claude.com/docs/en/mcp"
---
`,
    });

    expect(findStrictContentDuplicateMatch(candidate, [existing])).toBeNull();
    expect(findRelatedContentMatches(candidate, [existing])).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          reasons: expect.arrayContaining([
            expect.stringContaining(
              "same canonical source URL https://code.claude.com/docs/en/mcp in agents",
            ),
          ]),
        }),
      ]),
    );
  });

  it("treats shared multi-entry MCP catalogs as related context", () => {
    const existing = extractContentDuplicateSignals({
      filePath: "content/mcp/azure-mcp-server.mdx",
      content: `---
title: Azure MCP Server
slug: azure-mcp-server
category: mcp
description: Official Microsoft Azure MCP server for Azure resource workflows.
documentationUrl: "https://learn.microsoft.com/en-us/azure/developer/azure-mcp-server/"
repoUrl: "https://github.com/microsoft/mcp"
packageUrl: "https://www.npmjs.com/package/@azure/mcp"
---
`,
      label: "accepted entry content/mcp/azure-mcp-server.mdx",
    });
    const candidate = extractContentDuplicateSignals({
      filePath: "content/mcp/microsoft-learn-mcp-server.mdx",
      content: `---
title: Microsoft Learn MCP Server
slug: microsoft-learn-mcp-server
category: mcp
description: Official Microsoft Learn remote MCP server for documentation search.
documentationUrl: "https://devblogs.microsoft.com/engineering-at-microsoft/how-we-built-the-microsoft-learn-mcp-server/"
repoUrl: "https://github.com/microsoft/mcp"
sourceUrl: "https://learn.microsoft.com/api/mcp"
---
`,
    });

    expect(findStrictContentDuplicateMatch(candidate, [existing])).toBeNull();
    expect(findRelatedContentMatches(candidate, [existing])).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          reasons: expect.arrayContaining([
            expect.stringContaining(
              "same multi-entry catalog source URL https://github.com/microsoft/mcp in mcp",
            ),
          ]),
        }),
      ]),
    );
  });

  it("treats generic Claude docs pages as related context for statuslines", () => {
    const existing = extractContentDuplicateSignals({
      filePath: "content/statuslines/context-pressure-statusline.mdx",
      content: `---
title: Context Pressure Statusline
slug: context-pressure-statusline
category: statuslines
description: Claude Code statusline for context pressure.
documentationUrl: "https://code.claude.com/docs/en/statusline"
---
`,
    });
    const candidate = extractContentDuplicateSignals({
      filePath: "content/statuslines/mcp-auth-surface-statusline.mdx",
      content: `---
title: MCP Auth Surface Statusline
slug: mcp-auth-surface-statusline
category: statuslines
description: Claude Code statusline for MCP authorization surface hints.
documentationUrl: "https://code.claude.com/docs/en/statusline"
---
`,
    });

    expect(findStrictContentDuplicateMatch(candidate, [existing])).toBeNull();
    expect(findRelatedContentMatches(candidate, [existing])).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          reasons: expect.arrayContaining([
            expect.stringContaining(
              "same multi-entry catalog source URL https://code.claude.com/docs/en/statusline in statuslines",
            ),
          ]),
        }),
      ]),
    );
  });

  it("treats repeated same-scope collections as strict duplicates", () => {
    const existingCollection = extractContentDuplicateSignals({
      filePath: "content/collections/frontend-a11y-browser-qa.mdx",
      content: `---
title: Frontend A11y Browser QA Workflow
slug: frontend-a11y-browser-qa
category: collections
description: Ordered browser QA workflow using Playwright, Storybook, and WCAG references.
docsUrl: "https://playwright.dev/docs/intro"
websiteUrl: "https://www.w3.org/WAI/test-evaluate/"
---
`,
    });
    const repeatedCollection = extractContentDuplicateSignals({
      filePath: "content/collections/frontend-accessibility-qa-stack.mdx",
      content: `---
title: Frontend Accessibility QA Stack
slug: frontend-accessibility-qa-stack
category: collections
description: Similar browser QA workflow using Playwright, Storybook, and WCAG references.
docsUrl: "https://playwright.dev/docs/intro"
websiteUrl: "https://www.w3.org/WAI/test-evaluate/"
---
`,
    });

    expect(
      findStrictContentDuplicateMatch(repeatedCollection, [existingCollection]),
    ).toMatchObject({
      reasons: expect.arrayContaining([
        expect.stringContaining("same collection source set"),
      ]),
    });
  });

  it("blocks content edits that change protected provenance fields", () => {
    const before = `---
title: Existing Tool
slug: existing-tool
category: tools
author: Original Author
submittedBy: contributor
repoUrl: "https://github.com/example/existing-tool"
disclosure: editorial
---
`;
    const after = `---
title: Existing Tool
slug: existing-tool
category: tools
author: New Author
submittedBy: different-user
repoUrl: "https://github.com/example/other-tool"
disclosure: affiliate
---
`;

    expect(protectedFrontmatterChanges(before, after)).toEqual([
      "author",
      "disclosure",
      "repoUrl",
      "submittedBy",
    ]);
  });

  it("decodes base64 GitHub file content as UTF-8 so non-ASCII protected fields stay stable", async () => {
    // GitHub's contents API returns base64 of the raw UTF-8 file bytes. Decoding
    // it as Latin-1 (bare atob) mangles non-ASCII frontmatter, which then differs
    // from the candidate file read as UTF-8 and falsely trips a protected-field
    // change that one-shot-closes the edit PR.
    const baseContent = [
      "---",
      "title: Existing Tool",
      "slug: existing-tool",
      "category: tools",
      "author: José Núñez",
      "submittedBy: jose",
      'repoUrl: "https://github.com/example/existing-tool"',
      "---",
      "",
      "Original description.",
      "",
    ].join("\n");
    const base64 = Buffer.from(baseContent, "utf8").toString("base64");

    const fetchMock = vi.fn(async (url: string | URL | Request) => {
      expect(String(url)).toContain(
        "/repos/JSONbored/awesome-claude/contents/content/tools/existing-tool.mdx",
      );
      return Response.json({
        type: "file",
        encoding: "base64",
        content: base64,
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    const decoded = await getRepositoryFileContent({
      token: "ghs_test",
      repo: { owner: "JSONbored", repo: "awesome-claude" },
      path: "content/tools/existing-tool.mdx",
      ref: "main",
    });

    // UTF-8 decode, not Latin-1: the accented author name round-trips intact.
    expect(decoded).toContain("author: José Núñez");
    expect(decoded).not.toContain("JosÃ©");

    // The candidate is the same file read as UTF-8 with only a non-protected
    // body edit. With correct decoding the untouched author field compares
    // equal, so no protected-field change is reported.
    const candidate = baseContent.replace(
      "Original description.",
      "Updated description.",
    );
    expect(protectedFrontmatterChanges(decoded, candidate)).toEqual([]);
  });

  it("detects duplicate collisions introduced by otherwise safe content edits", () => {
    const existing = extractContentDuplicateSignals({
      filePath: "content/guides/claude-code-setup.mdx",
      content: `---
title: Claude Code Setup Guide
slug: claude-code-setup
category: guides
description: Practical setup guide for Claude Code projects.
sourceUrl: "https://example.com/claude-code-setup"
---
`,
    });
    const edited = extractContentDuplicateSignals({
      filePath: "content/guides/agent-workflow-setup.mdx",
      content: `---
title: Agent Workflow Setup
slug: agent-workflow-setup
category: guides
description: Practical setup guide for Claude Code projects.
sourceUrl: "https://example.com/agent-workflow-setup"
---
`,
    });

    expect(findContentDuplicateMatch(edited, [existing])).toMatchObject({
      reasons: expect.arrayContaining([
        expect.stringContaining("same normalized description"),
      ]),
    });
  });
});
