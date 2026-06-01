import { describe, expect, it } from "vitest";

import { buildDraftTarget, buildContributorMdx } from "../apps/submission-gate/src/drafts";
import { buildGitHubAppAuthorizeUrl } from "../apps/submission-gate/src/github";
import {
  decryptText,
  encryptText,
  hmacSha256Hex,
  signInternalPayload,
  verifyGitHubWebhookSignature,
  verifyInternalSignature,
} from "../apps/submission-gate/src/security";

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
    await expect(decryptText("handoff-secret", encrypted)).resolves.toBe(
      "ghu_example",
    );
  });
});
