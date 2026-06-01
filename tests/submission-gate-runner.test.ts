import { describe, expect, it } from "vitest";

import {
  redactSensitiveOutput,
  resolveValidationCommands,
  safeGitHubRepo,
  safeGitRef,
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

  it("allows only fixed validation commands", () => {
    expect(resolveValidationCommands()).toEqual([
      "pnpm validate:content:strict",
      "pnpm test:registry-artifacts",
      "pnpm validate:openapi",
      "pnpm build",
      "git diff --check",
    ]);

    expect(() =>
      resolveValidationCommands(["node scripts/import-from-job.js"]),
    ).toThrow("Unsupported validation command");
  });

  it("redacts token-bearing git URLs from runner errors", () => {
    expect(
      redactSensitiveOutput(
        "fatal: https://x-access-token:ghs_secret@example.invalid/repo.git",
      ),
    ).toContain("x-access-token:<redacted>@");
  });
});
