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
  listPullRequestFiles,
} from "../apps/submission-gate/src/github";
import {
  decryptText,
  encryptText,
  hmacSha256Hex,
  verifyGitHubWebhookSignature,
} from "../apps/submission-gate/src/security";
import {
  extractContentDuplicateSignals,
  findContentDuplicateMatch,
  protectedFrontmatterChanges,
} from "../apps/submission-gate/src/duplicates";
import {
  markerComment,
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
    expect(source).toContain("queuedStaleBeforeIso");
    expect(source).toContain("reviewingStaleBeforeIso");
    expect(source).toContain("lastCheckSummary: validation.summary");
    expect(source).toContain("target.headSha = pullForNotification.head.sha");
    expect(source).toContain("target: {");
    expect(source).toContain("installationId: target.installationId");
    expect(source).toContain("isRetryablePrivateReviewerDecision(decision)");
    expect(source).toContain('status: "error_retryable"');
    expect(source).toContain("retryingReviewComment(");
    expect(source).toContain("validation: validationForPrivateReview");
    expect(source).toContain("contentScope: contentScopeForPrivateReview");
    expect(source).toContain("duplicateHistoryRequired: true");
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
    expect(validationFailedDecision("Required validation failed.")).toEqual({
      verdict: "close",
      summary:
        "Required validation failed. The private content review will run after the public validation lane is green.",
      labels: ["submission-closed-by-gate"],
      close: true,
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

    expect(body).toContain(
      "<!-- heyclaude-submission-gate -->\nVerdict: Request changes\n\nSummary:",
    );
    expect(body).toContain("Source Review:");
    expect(body).toContain("Recommended Action:");
    expect(body).toContain("single-shot submission review");
  });

  it("renders accepted submissions as direct merge decisions", () => {
    const body = markerComment({
      verdict: "merge",
      summary:
        "Summary:\n- Accepted after duplicate/history and source review.",
      labels: ["submission-merged-by-gate"],
    });

    expect(body).toContain("Verdict: Accepted and merged");
    expect(body).toContain(
      "passed content validation, Superagent, and private review",
    );
    expect(body).toContain("merges accepted source PRs directly");
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
    expect(classifierBlock).toContain('kind: "scope_failure"');
    expect(classifierBlock).toContain(
      "no generated artifacts, README, workflows, scripts, packages, or additional entries",
    );
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
    expect(source).toContain(
      "Terminal gate state did not match open GitHub PR",
    );
    expect(source).toContain("GitHub terminal state verified.");
    expect(source).toContain("clearVerdict: true");
    expect(source).toContain("clearTerminal: true");
    expect(storageSource).toContain(
      "COALESCE(last_error, '') != 'GitHub terminal state verified.'",
    );
    expect(storageSource).toContain("terminal_at IS NOT NULL");
    expect(storageSource).toContain("status = 'closed'");
    expect(enqueueBlock).toContain(
      "if (!hasTerminalGateDecision(existing) || shouldResetIgnoredScan)",
    );
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
    expect(source).toContain('"validation_pending"');
    expect(source).toContain('"merge_pending"');
    expect(source).toContain('"error_retryable"');
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
