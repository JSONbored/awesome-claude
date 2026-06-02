import { describe, expect, it } from "vitest";

import {
  buildDraftTarget,
  buildContributorMdx,
  draftFieldsFromBody,
} from "../apps/submission-gate/src/drafts";
import {
  buildGitHubAppAuthorizeUrl,
  createGitHubAppJwt,
} from "../apps/submission-gate/src/github";
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
});
