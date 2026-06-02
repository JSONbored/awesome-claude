import { describe, expect, it } from "vitest";

import {
  assertSafeImportWrite,
  assertAllowedImportRepo,
  githubUserAgent,
  importContentPaths,
  maintainerGenerationCommandLabels,
  redactSensitiveOutput,
  resolveValidationChecks,
  safeCallbackUrl,
  safeGitHubRepo,
  safeGitRef,
  safeImportPath,
} from "../apps/submission-gate/container/runner.mjs";

describe("submission gate import runner safety", () => {
  it("accepts only GitHub owner/repo targets", () => {
    expect(safeGitHubRepo("JSONbored/awesome-claude")).toBe(
      "JSONbored/awesome-claude",
    );

    expect(() => safeGitHubRepo("--upload-pack=/tmp/pwn")).toThrow(
      "invalid GitHub repository",
    );
    expect(() => safeGitHubRepo("JSONbored/awesome-claude --mirror")).toThrow(
      "invalid GitHub repository",
    );
    expect(() => safeGitHubRepo("JSONbored/.awesome-claude")).toThrow(
      "invalid GitHub repository",
    );
    expect(() => safeGitHubRepo("JSONbored/awesome-claude.git")).toThrow(
      "invalid GitHub repository",
    );
  });

  it("allows only configured import repositories", () => {
    expect(
      assertAllowedImportRepo(
        "JSONbored/awesome-claude",
        new Set(["JSONbored/awesome-claude"]),
      ),
    ).toBe("JSONbored/awesome-claude");
    expect(() =>
      assertAllowedImportRepo(
        "attacker/awesome-claude",
        new Set(["JSONbored/awesome-claude"]),
      ),
    ).toThrow("unauthorized repository");
  });

  it("rejects git refs that could be parsed as options or ref traversal", () => {
    expect(safeGitRef("submission-gate-pilot", "baseRef")).toBe(
      "submission-gate-pilot",
    );
    expect(safeGitRef("heyclaude/submit-mcp-example", "branchName")).toBe(
      "heyclaude/submit-mcp-example",
    );

    expect(() => safeGitRef("--upload-pack=/tmp/pwn", "baseRef")).toThrow(
      "invalid baseRef",
    );
    expect(() => safeGitRef("feature/../main", "baseRef")).toThrow(
      "invalid baseRef",
    );
    expect(() => safeGitRef("feature/trailing/", "baseRef")).toThrow(
      "invalid baseRef",
    );
    expect(() => safeGitRef("feature.lock", "baseRef")).toThrow(
      "invalid baseRef",
    );
    expect(() => safeGitRef("feature:main", "baseRef")).toThrow(
      "invalid baseRef",
    );
  });

  it("rejects writes to git metadata and path traversal targets", () => {
    const repoDir = "/tmp/heyclaude-import/repo";
    expect(safeImportPath(repoDir, "content/mcp/example.mdx")).toBe(
      "/tmp/heyclaude-import/repo/content/mcp/example.mdx",
    );
    expect(() => safeImportPath(repoDir, ".git/config")).toThrow(
      "Invalid import path",
    );
    expect(() => safeImportPath(repoDir, ".git\\hooks\\post-checkout")).toThrow(
      "Invalid import path",
    );
    expect(() => safeImportPath(repoDir, "../outside.mdx")).toThrow(
      "Invalid import path",
    );
  });

  it("rejects import writes that could alter validation-time package behavior", () => {
    expect(() =>
      assertSafeImportWrite("content/mcp/example.mdx"),
    ).not.toThrow();
    expect(() =>
      assertSafeImportWrite("scripts/build-content-index.mjs"),
    ).toThrow("source content files");
    expect(() => assertSafeImportWrite("package.json")).toThrow(
      "source content files",
    );
    expect(() => assertSafeImportWrite("nested/pnpm-lock.yaml")).toThrow(
      "source content files",
    );
    expect(() => assertSafeImportWrite("content/mcp/package.json")).toThrow(
      "package manager or workspace files",
    );
  });

  it("stages only source content paths from accepted import jobs", () => {
    expect(
      importContentPaths([
        { path: "content/guides/example.mdx" },
        { path: "content/guides/example.mdx" },
        { path: "content/mcp/example-server.mdx" },
      ]),
    ).toEqual(["content/guides/example.mdx", "content/mcp/example-server.mdx"]);

    expect(() =>
      importContentPaths([
        { path: "content/guides/example.mdx" },
        { path: "apps/web/public/data/directory-index.json" },
      ]),
    ).toThrow("source content files");
  });

  it("allows only fixed validation check keys", () => {
    expect(resolveValidationChecks()).toEqual([
      "strictContent",
      "registryArtifacts",
      "openapi",
      "build",
      "gitCheck",
    ]);
    expect(resolveValidationChecks(["strictContent", "gitCheck"])).toEqual([
      "strictContent",
      "gitCheck",
    ]);

    expect(() =>
      resolveValidationChecks(["pnpm validate:content:strict"]),
    ).toThrow("Unsupported validation check");
    expect(() =>
      resolveValidationChecks(["node scripts/import-from-job.js"]),
    ).toThrow("Unsupported validation check");
  });

  it("allows only signed import completion callback URLs", () => {
    expect(
      safeCallbackUrl(
        "https://submission-gate.heyclau.de/internal/import-complete",
      ),
    ).toBe("https://submission-gate.heyclau.de/internal/import-complete");

    expect(() =>
      safeCallbackUrl("https://attacker.example/internal/import-complete"),
    ).toThrow("callback URL");
    expect(() =>
      safeCallbackUrl(
        "https://submission-gate-dev.heyclau.de/internal/import-complete",
      ),
    ).toThrow("callback URL");
    expect(() =>
      safeCallbackUrl("https://submission-gate.heyclau.de/other"),
    ).toThrow("callback URL");
    expect(() =>
      safeCallbackUrl(
        "http://submission-gate.heyclau.de/internal/import-complete",
      ),
    ).toThrow("callback URL");
  });

  it("runs maintainer artifact generation before import validation", () => {
    expect(maintainerGenerationCommandLabels()).toEqual([
      "pnpm --filter web run prebuild",
      "pnpm generate:readme",
    ]);
  });

  it("sets a stable GitHub API user agent for import runner calls", () => {
    expect(githubUserAgent()).toBe("heyclaude-submission-gate-import-runner");
  });

  it("redacts token-bearing git URLs from runner errors", () => {
    expect(
      redactSensitiveOutput(
        "fatal: https://x-access-token:ghs_secret@example.invalid/repo.git",
      ),
    ).toContain("x-access-token:<redacted>@");
  });
});
