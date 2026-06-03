import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { repoRoot } from "./helpers/registry-fixtures";

function trackedFiles() {
  return execFileSync("git", ["ls-files"], {
    cwd: repoRoot,
    encoding: "utf8",
  })
    .split("\n")
    .filter(Boolean);
}

function readTrackedText(relativePath: string) {
  const absolutePath = path.join(repoRoot, relativePath);
  try {
    const stat = fs.statSync(absolutePath);
    if (stat.size > 512_000) return "";
    return fs.readFileSync(absolutePath, "utf8");
  } catch {
    return "";
  }
}

describe("private maintainer reviewer boundary", () => {
  it("does not track private reviewer, operator kit, prompt, or corpus paths", () => {
    const forbiddenPathPattern =
      /(^|\/)(?:awesome-claude-operator-kit|operator-kit|private-reviewer|submission-reviewer|review-corpus|review-fixtures|private-prompts|accepted-rejected-examples)(?:\/|$)/i;

    expect(
      trackedFiles().filter((file) => forbiddenPathPattern.test(file)),
    ).toEqual([]);
  });

  it("keeps model calls and private scoring out of the public gate orchestrator", () => {
    const forbiddenRuntimePattern =
      /(?:AI_GATEWAY|WORKERS_AI|@cf\/openai\/|gpt-oss-|private\s+(?:prompt|rubric|score|threshold)|accepted\/rejected examples)/i;
    const publicGateFiles = trackedFiles().filter(
      (file) =>
        file !== "tests/private-reviewer-boundary.test.ts" &&
        (file.startsWith("apps/submission-gate/") ||
          file.startsWith("packages/registry/") ||
          file.startsWith("scripts/") ||
          file.startsWith("tests/")),
    );

    const leaks = publicGateFiles.filter((file) =>
      forbiddenRuntimePattern.test(readTrackedText(file)),
    );

    expect(leaks).toEqual([]);
  });

  it("only exposes the generic private review URL contract publicly", () => {
    const workerSource = readTrackedText("apps/submission-gate/src/index.ts");

    expect(workerSource).toContain("PRIVATE_GATE_REVIEW_URL");
    expect(workerSource).toContain("x-heyclaude-internal-signature");
    expect(workerSource).not.toContain("@cf/openai/");
    expect(workerSource).not.toContain("AI_GATEWAY");
  });
});
