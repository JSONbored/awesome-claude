import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { repoRoot } from "./helpers/registry-fixtures";

function read(relativePath: string) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

describe("generated churn policy", () => {
  it("does not keep a scheduled PR workflow for volatile GitHub stats", () => {
    expect(
      fs.existsSync(
        path.join(repoRoot, ".github/workflows/github-stats-refresh-pr.yml"),
      ),
    ).toBe(false);
  });

  it("prevents PR automation from committing generated registry data", () => {
    const workflowsDir = path.join(repoRoot, ".github/workflows");
    for (const fileName of fs.readdirSync(workflowsDir)) {
      if (!fileName.endsWith(".yml") && !fileName.endsWith(".yaml")) continue;
      const source = fs.readFileSync(path.join(workflowsDir, fileName), "utf8");
      if (!source.includes("create-pull-request")) continue;

      expect(source, fileName).not.toMatch(
        /add-paths:[\s\S]*(apps\/web\/public\/data|apps\/web\/src\/generated)/,
      );
    }
  });

  it("keeps normal registry generation from carrying forward stale source stats", () => {
    const source = read("scripts/build-content-index.mjs");
    expect(source).toContain("ENABLE_GITHUB_REPO_STATS");
    expect(source).toContain("? loadExistingEntryRepoStats()");
    expect(source).toContain("? loadExistingSiteStats()");
    expect(source).not.toContain(
      "const existingEntryRepoStats = loadExistingEntryRepoStats();",
    );
    expect(source).not.toContain(
      "const existingSiteStats = loadExistingSiteStats();",
    );
  });

  it("keeps README refresh as a single README-only accumulator PR", () => {
    const source = read(".github/workflows/readme-refresh-pr.yml");
    expect(source).toContain("branch: automation/readme-refresh");
    expect(source).toContain("add-paths:");
    expect(source).toContain("README.md");
    expect(source).not.toContain("apps/web/public/data");
    expect(source).not.toContain("apps/web/src/generated");
  });
});
