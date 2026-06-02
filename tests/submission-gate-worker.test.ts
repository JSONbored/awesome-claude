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
} from "../apps/submission-gate/src/github";
import {
  decryptText,
  encryptText,
  hmacSha256Hex,
  signInternalPayload,
  verifyGitHubWebhookSignature,
  verifyInternalSignature,
} from "../apps/submission-gate/src/security";
import { markerComment } from "../apps/submission-gate/src/review";
import { repoRoot } from "./helpers/registry-fixtures";

function readWorkerSource() {
  return fs.readFileSync(
    path.join(repoRoot, "apps/submission-gate/src/index.ts"),
    "utf8",
  );
}

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

  it("normalizes draft targets to one content file on the pilot branch", () => {
    const target = buildDraftTarget(
      { category: "mcp", name: "Example MCP Server" },
      "submission-gate-pilot",
    );

    expect(target).toEqual({
      category: "mcp",
      slug: "example-mcp-server",
      baseRef: "submission-gate-pilot",
      branchName: "heyclaude/submit-mcp-example-mcp-server",
      targetPath: "content/mcp/example-mcp-server.mdx",
    });
  });

  it("caps generated branch names while keeping the full target slug", () => {
    const target = buildDraftTarget(
      { category: "skills", name: "A".repeat(240) },
      "submission-gate-pilot",
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

  it("keeps private review behind required PR validation", () => {
    const source = readWorkerSource();
    const validationIndex = source.indexOf("getCommitValidationState({");
    const privateReviewIndex = source.indexOf("reviewWithPrivateGate(env, {");

    expect(source).toContain(
      'const DEFAULT_REQUIRED_VALIDATION_CHECKS = ["validate-content"]',
    );
    expect(source).toContain('"check_run"');
    expect(source).toContain('"check_suite"');
    expect(source).toContain('"status"');
    expect(source).toContain('status: "validation_pending"');
    expect(source).toContain("validation: validationForPrivateReview");
    expect(validationIndex).toBeGreaterThan(0);
    expect(privateReviewIndex).toBeGreaterThan(validationIndex);
  });

  it("allows only trusted maintainer comments to trigger rechecks", () => {
    const source = readWorkerSource();
    expect(source).toContain('if (eventName === "issue_comment")');
    expect(source).toContain('split(/\\s+/)[0] === "/recheck"');
    expect(source).toContain("TRUSTED_RECHECK_ASSOCIATIONS");
    expect(source).toContain('"OWNER"');
    expect(source).toContain('"MEMBER"');
    expect(source).toContain('"COLLABORATOR"');
    expect(source).toContain("targetFromIssueCommentRecheck");
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
      labels: ["submission-needs-changes"],
      close: true,
    });

    expect(body).toContain(
      "<!-- heyclaude-submission-gate -->\nVerdict: Request changes\n\nSummary:",
    );
    expect(body).toContain("Source Review:");
    expect(body).toContain("Recommended Action:");
    expect(body).toContain("single-shot submission review");
  });

  it("labels accepted submissions as import candidates without implying merge", () => {
    const body = markerComment({
      verdict: "import",
      summary: "Summary:\n- Accepted for maintainer-owned import.",
      labels: ["import-pr-open"],
    });

    expect(body).toContain("Verdict: Accepted for import");
    expect(body).toContain(
      "Generated artifacts and full repository validation run on the import PR",
    );
    expect(body).toContain("manual maintainer merge");
  });

  it("reconciles old verdict labels before applying a new gate decision", () => {
    const source = readWorkerSource();
    const removeIndex = source.indexOf("await removeLabels({");
    const addIndex = source.indexOf("await addLabels({", removeIndex);

    expect(source).toContain("const DECISION_LABELS = [");
    expect(source).toContain("!decision.labels.includes(label)");
    expect(removeIndex).toBeGreaterThan(0);
    expect(addIndex).toBeGreaterThan(removeIndex);
  });

  it("signs internal import callbacks with the same HMAC verifier", async () => {
    const payload = JSON.stringify({ kind: "import_pr", targetKey: "repo#1" });
    const signature = await signInternalPayload("internal-secret", payload);

    await expect(
      verifyInternalSignature({
        secret: "internal-secret",
        payload,
        signatureHeader: signature,
      }),
    ).resolves.toBe(true);
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

  it("rejects cancelled GitHub authorization callbacks before token exchange", () => {
    const source = readWorkerSource();
    const callbackSource =
      source.match(
        /async function githubCallbackRoute[\s\S]*?\nfunction isPilotPr/,
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
});
