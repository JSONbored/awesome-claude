import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";

import { repoRoot } from "./helpers/registry-fixtures";

function read(relativePath: string) {
  return fs.readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function gitTrackedFiles(paths: string[]) {
  return execFileSync("git", ["ls-files", ...paths], {
    cwd: repoRoot,
    encoding: "utf8",
  })
    .split("\n")
    .filter(Boolean);
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

  it("keeps generated website projections out of git", () => {
    expect(
      gitTrackedFiles([
        "apps/web/public/data",
        "apps/web/public/downloads",
        "apps/web/src/generated",
        "apps/web/src/routeTree.gen.ts",
      ]),
    ).toEqual([]);
  });

  it("ignores generated website projections while preserving source packages", () => {
    const gitignore = read(".gitignore");
    expect(gitignore).toContain("apps/web/public/data/");
    expect(gitignore).toContain("apps/web/public/downloads/");
    expect(gitignore).toContain("apps/web/src/generated/");
    expect(gitignore).toContain("apps/web/src/routeTree.gen.ts");
    expect(gitignore).toContain("!content/skills/*.zip");
    expect(gitignore).toContain("!content/mcp/*.mcpb");
  });

  it("keeps CodeRabbit fully removed (eliminated 2026-06-19; reviewbot is the reviewer)", () => {
    // CodeRabbit was removed entirely — config and bot — in favor of reviewbot's one-shot review. The old
    // test asserted the .coderabbit.yaml path_filters; now the invariant is that the config never returns.
    expect(fs.existsSync(path.join(repoRoot, ".coderabbit.yaml"))).toBe(false);
    expect(fs.existsSync(path.join(repoRoot, ".coderabbit.yml"))).toBe(false);
  });

  it("generates registry and route artifacts before web build gates", () => {
    const rootPackage = JSON.parse(read("package.json")) as {
      scripts?: Record<string, string>;
    };
    const webPackage = JSON.parse(read("apps/web/package.json")) as {
      scripts?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };

    expect(rootPackage.scripts?.["generate:registry"]).toBe(
      "node scripts/build-content-index.mjs",
    );
    expect(webPackage.devDependencies?.["@tanstack/router-cli"]).toBeTruthy();
    expect(webPackage.scripts?.["generate:routes"]).toBe("tsr generate");
    expect(webPackage.scripts?.["generate:artifacts"]).toContain(
      "generate:registry",
    );
    expect(webPackage.scripts?.["generate:artifacts"]).toContain(
      "generate:routes",
    );
    expect(webPackage.scripts?.prebuild).toBe("pnpm run generate:artifacts");
    expect(webPackage.scripts?.["pretype-check"]).toBe(
      "pnpm run generate:artifacts",
    );
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

  it("derives content freshness from source files instead of generated artifacts", () => {
    const source = read("scripts/build-content-index.mjs");
    expect(source).toContain("loadGitContentUpdatedAt");
    expect(source).not.toContain("loadExistingContentUpdatedAt");
    expect(source).not.toContain("existingContentUpdatedAt");
  });

  it("keeps README refresh as a single README-only accumulator PR", () => {
    const source = read(".github/workflows/readme-refresh-pr.yml");
    expect(source).toContain("BRANCH_NAME: automation/readme-refresh");
    expect(source).toContain("refresh-readme-automation-readme-refresh");
    expect(source).toContain("git diff --quiet origin/main -- README.md");
    expect(source).toContain(
      "git restore --worktree --staged -- . ':!README.md'",
    );
    expect(source).toContain('git switch -C "$BRANCH_NAME" origin/main');
    expect(source).toContain("unexpected_files");
    expect(source).toContain("git diff --name-only -- . ':!README.md'");
    expect(source).toContain("README.md");
    expect(source).not.toContain("apps/web/public/data");
    expect(source).not.toContain("apps/web/src/generated");
  });
});
