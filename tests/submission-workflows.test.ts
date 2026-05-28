import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";

import {
  buildReadmeRefreshBody,
  extractReadmeEntryChanges,
  resolveReadmeEntryChange,
  summarizeReadmeEntryChange,
} from "../scripts/build-readme-refresh-body.mjs";
import {
  isPublicIpAddress,
  planStaleSubmissionAction,
  urlNeedsVerification,
} from "../scripts/manage-stale-submissions.mjs";
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
          FORCE_FULL_VALIDATION: "0",
          GITHUB_EVENT_NAME: "pull_request",
          GITHUB_OUTPUT: outputPath,
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
  });

  it("keeps product feature issues scoped with screenshot expectations", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, ".github/ISSUE_TEMPLATE/product-feature.yml"),
      "utf8",
    );

    expect(source).toContain("Product or feature improvement");
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
    expect(source).toContain("Run Vitest suite");
    expect(source).toContain("pnpm test");
    expect(source).toContain("pnpm type-check");
    expect(source).toContain("pnpm build");
    expect(source).not.toContain("pnpm test:e2e");
    expect(source).not.toContain("playwright install");
    expect(source).toContain(
      "PREVIEW_DEPLOYMENT_URL: ${{ steps.deploy-preview.outputs.base-url }}",
    );
    expect(source).not.toContain(
      "steps.deploy-preview.outputs.base-url || env.CLOUDFLARE_DEV_WORKER_URL",
    );
  });

  it("keeps public issue validation read-only for imports", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, ".github/workflows/submission-issue-validation.yml"),
      "utf8",
    );

    expect(source).toContain("contents: read");
    expect(source).toContain("issues: write");
    expect(source).not.toContain("actions: write");
    expect(source).not.toContain("contents: write");
    expect(source).not.toContain("pull-requests: write");
    expect(source).toContain("Preview import output");
    expect(source).toContain("--dry-run");
    expect(source).toContain("Analyze submission risk");
    expect(source).toContain("Precheck auto-import eligibility");
    expect(source).toContain("auto-import-eligible");
    expect(source).toContain("HeyClaude Submission Bot");
    expect(source).toContain("steps.auto_import_precheck.outputs.eligible");
    expect(source).toContain("managedValidationLabels");
    expect(source).toContain("issues.setLabels");
    expect(source).toContain("Post HeyClaude submission check comment");
    expect(source).toContain("<!-- heyclaude-submission-check -->");
    expect(source).toContain("!github.event.issue.pull_request");
    expect(source).toContain("schema passed, maintainer review required");
    expect(source).not.toContain("submission check: passed");
    expect(source).not.toContain("Post risk report comment");
    expect(source).toContain("Fail when submission risk is critical");
    expect(source).toContain("Summarize invalid submission issue");
    expect(source).toContain("--informational");
    expect(source).not.toContain("if (report.skipped) return;");
    expect(source).not.toContain("Import auto-eligible submission");
    expect(source).not.toContain("Create auto-import PR");
    expect(source).not.toContain("peter-evans/create-pull-request");
    expect(source).not.toContain("gh workflow run content-validation.yml");
    expect(source).not.toContain("labels.*.name, 'submission'");
  });

  it("does not fail issue CI for invalid user submissions", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "heyclaude-report-"));
    const reportPath = path.join(tmpDir, "submission-validation.json");
    fs.writeFileSync(
      reportPath,
      JSON.stringify({
        ok: false,
        skipped: false,
        errors: ["Missing required field: usage_snippet"],
      }),
      "utf8",
    );

    expect(() =>
      execFileSync(
        process.execPath,
        [
          "scripts/ci/fail-invalid-submission-report.mjs",
          "--report",
          reportPath,
        ],
        { cwd: repoRoot, encoding: "utf8" },
      ),
    ).toThrow();

    const output = execFileSync(
      process.execPath,
      [
        "scripts/ci/fail-invalid-submission-report.mjs",
        "--report",
        reportPath,
        "--informational",
      ],
      { cwd: repoRoot, encoding: "utf8" },
    );

    expect(output).toContain("issue workflow is informational");
  });

  it("detects auto-import eligibility from validation and policy gates", () => {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-auto-import-"),
    );
    const issuePath = path.join(tmpDir, "issue.json");
    const validationPath = path.join(tmpDir, "validation.json");
    const riskPath = path.join(tmpDir, "risk.json");
    const outputPath = path.join(tmpDir, "eligibility.json");

    fs.writeFileSync(
      issuePath,
      JSON.stringify({
        number: 987654,
        labels: [{ name: "content-submission" }, { name: "import-approved" }],
      }),
      "utf8",
    );
    fs.writeFileSync(
      validationPath,
      JSON.stringify({
        ok: true,
        skipped: false,
        category: "mcp",
        fields: { slug: "auto-import-eligibility-test" },
      }),
      "utf8",
    );
    fs.writeFileSync(
      riskPath,
      JSON.stringify({
        riskTier: "low",
        policyDecision: "auto_import_eligible",
        policyMatrix: {
          schema: { status: "pass" },
          source: { status: "pass" },
          package: { status: "pass" },
          provenance: { status: "pass" },
          capability: { status: "pass" },
          quality: { status: "pass" },
        },
      }),
      "utf8",
    );

    execFileSync(
      process.execPath,
      [
        "scripts/ci/check-auto-import-eligibility.mjs",
        "--issue-json",
        issuePath,
        "--validation-json",
        validationPath,
        "--risk-json",
        riskPath,
        "--output",
        outputPath,
      ],
      { cwd: repoRoot, encoding: "utf8" },
    );

    const result = JSON.parse(fs.readFileSync(outputPath, "utf8"));
    expect(result.eligible).toBe(true);
    expect(result.approvalLabel).toBe("import-approved");
    expect(result.importPath).toBe(
      "content/mcp/auto-import-eligibility-test.mdx",
    );
  });

  it("requires maintainer approval before auto-import eligibility", () => {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-auto-import-approval-"),
    );
    const issuePath = path.join(tmpDir, "issue.json");
    const validationPath = path.join(tmpDir, "validation.json");
    const riskPath = path.join(tmpDir, "risk.json");
    const outputPath = path.join(tmpDir, "eligibility.json");

    fs.writeFileSync(
      issuePath,
      JSON.stringify({
        number: 987653,
        labels: [{ name: "content-submission" }],
      }),
      "utf8",
    );
    fs.writeFileSync(
      validationPath,
      JSON.stringify({
        ok: true,
        skipped: false,
        category: "rules",
        fields: { slug: "approval-required-test" },
      }),
      "utf8",
    );
    fs.writeFileSync(
      riskPath,
      JSON.stringify({
        riskTier: "low",
        policyDecision: "auto_import_eligible",
        policyMatrix: {
          schema: { status: "pass" },
          source: { status: "pass" },
          package: { status: "pass" },
          provenance: { status: "pass" },
          capability: { status: "pass" },
          quality: { status: "pass" },
        },
      }),
      "utf8",
    );

    execFileSync(
      process.execPath,
      [
        "scripts/ci/check-auto-import-eligibility.mjs",
        "--issue-json",
        issuePath,
        "--validation-json",
        validationPath,
        "--risk-json",
        riskPath,
        "--output",
        outputPath,
      ],
      { cwd: repoRoot, encoding: "utf8" },
    );

    const result = JSON.parse(fs.readFileSync(outputPath, "utf8"));
    expect(result.eligible).toBe(false);
    expect(result.reasons).toContain(
      "maintainer approval label required: accepted or import-approved",
    );
    expect(() =>
      execFileSync(
        process.execPath,
        [
          "scripts/ci/check-auto-import-eligibility.mjs",
          "--issue-json",
          issuePath,
          "--validation-json",
          validationPath,
          "--risk-json",
          riskPath,
          "--fail-on-ineligible",
        ],
        { cwd: repoRoot, encoding: "utf8" },
      ),
    ).toThrow();
  });

  it("sanitizes auto-import GitHub output values", () => {
    const tmpDir = fs.mkdtempSync(
      path.join(os.tmpdir(), "heyclaude-auto-import-output-"),
    );
    const issuePath = path.join(tmpDir, "issue.json");
    const validationPath = path.join(tmpDir, "validation.json");
    const riskPath = path.join(tmpDir, "risk.json");
    const outputPath = path.join(tmpDir, "eligibility.json");
    const githubOutputPath = path.join(tmpDir, "github-output");

    fs.writeFileSync(
      issuePath,
      JSON.stringify({
        number: 987655,
        labels: [{ name: "content-submission" }, { name: "import-approved" }],
      }),
      "utf8",
    );
    fs.writeFileSync(
      validationPath,
      JSON.stringify({
        ok: true,
        skipped: false,
        category: "mcp",
        fields: { slug: "bad-slug\neligible=true" },
      }),
      "utf8",
    );
    fs.writeFileSync(
      riskPath,
      JSON.stringify({
        riskTier: "low",
        policyDecision: "auto_import_eligible",
        policyMatrix: {
          schema: { status: "pass" },
          source: { status: "pass" },
          package: { status: "pass" },
          provenance: { status: "pass" },
          capability: { status: "pass" },
          quality: { status: "pass" },
        },
      }),
      "utf8",
    );

    execFileSync(
      process.execPath,
      [
        "scripts/ci/check-auto-import-eligibility.mjs",
        "--issue-json",
        issuePath,
        "--validation-json",
        validationPath,
        "--risk-json",
        riskPath,
        "--output",
        outputPath,
      ],
      {
        cwd: repoRoot,
        encoding: "utf8",
        env: { ...process.env, GITHUB_OUTPUT: githubOutputPath },
      },
    );

    const outputLines = fs.readFileSync(githubOutputPath, "utf8").split("\n");
    expect(outputLines).toContain("eligible=false");
    expect(outputLines).not.toContain("eligible=true");
  });

  it("removes the noisy direct PR risk workflow", () => {
    expect(
      fs.existsSync(
        path.join(repoRoot, ".github/workflows/submission-pr-risk.yml"),
      ),
    ).toBe(false);
  });

  it("keeps advisory Superagent scanning manual, read-only, and secret-gated", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, ".github/workflows/superagent-security.yml"),
      "utf8",
    );

    expect(source).not.toContain("pull_request:");
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

  it("opens import PRs only after accepted/import-approved labels", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, ".github/workflows/submission-import-pr.yml"),
      "utf8",
    );

    expect(source).toContain("types:");
    expect(source).toContain("- labeled");
    expect(source).toContain("'accepted'");
    expect(source).toContain("'import-approved'");
    expect(source).toContain(
      "contains(github.event.issue.labels.*.name, 'content-submission')",
    );
    expect(source).toContain("scripts/import-submission-issue.mjs");
    expect(source).toContain("Analyze submission risk");
    expect(source).toContain("Check approved import eligibility");
    expect(source).toContain("--fail-on-ineligible");
    expect(source).toContain("Format imported content");
    expect(source).toContain("pnpm exec prettier --write");
    expect(source).toContain("pnpm --filter web run prebuild");
    expect(source).toContain("pnpm generate:readme");
    expect(source).toContain("pnpm validate:content:strict");
    expect(source).toContain("pnpm scan:packages");
    expect(source).toContain("peter-evans/create-pull-request@");
    expect(source).toContain('setOutput("branch", `automation/submission-');
    expect(source).toContain("actions: write");
    expect(source).toContain("Trigger content validation for import PR");
    expect(source).toContain(
      'gh workflow run content-validation.yml --ref "$VALIDATION_REF"',
    );
    expect(source).toContain('setOutput("pr_title", `feat(content): add');
    expect(source).toContain('setOutput("issue_author", issueAuthor)');
    expect(source).toContain(
      'setOutput("issue_author_handle", issueAuthorHandle)',
    );
    expect(source).toContain('setOutput("issue_author_id", issueAuthorId)');
    expect(source).toContain("Original submitter:");
    expect(source).toContain(
      "by ${{ steps.metadata.outputs.issue_author_handle }}",
    );
    expect(source).toContain("Co-authored-by:");
    expect(source).toContain(
      "Maintainer-approved import PR opened for ${{ steps.metadata.outputs.issue_author_handle }}",
    );
    expect(source).toContain("content/**");
    expect(source).toContain("apps/web/public/data/**");
    expect(source).toContain("README.md");
    expect(source).toContain(
      "Closes #${{ steps.metadata.outputs.issue_number }} after merge.",
    );
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
      "fromJson(needs.classify-pr.outputs.content_categories_json)",
    );
    expect(source).toContain("Summarize required PR validation");
    expect(source).toContain('trunk check --ci --upstream "$BASE_SHA"');
    expect(source).toContain("trunk check --ci --all");
    expect(source).toContain("validate-pr-preview:");
    expect(source).toContain("github.event_name == 'pull_request'");
    expect(source).toContain("Deploy same-repo PR preview to dev Worker");
    expect(source).toContain("Resolve PR preview URL");
    expect(source).toContain("pnpm validate:deployment-artifacts");
    expect(source).not.toContain("vars.DEPLOYMENT_ARTIFACT_BASE_URL");
    expect(source).toContain("Dry-run Resend template sync");
    expect(source).toContain("pnpm resend:sync-templates -- --dry-run");
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
      "git diff --exit-code apps/web/public/data apps/web/src/generated README.md",
    );
  });

  it("routes hook-only content PRs to hook validation only", () => {
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
    expect(lanes.registry).toBe("false");
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

  it("uses generated README refresh body metadata instead of a static PR body", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, ".github/workflows/readme-refresh-pr.yml"),
      "utf8",
    );

    expect(source).toContain("fetch-depth: 0");
    expect(source).toContain("scripts/build-readme-refresh-body.mjs");
    expect(source).toContain("Build README refresh body");
    expect(source).toContain(
      "body-path: ${{ runner.temp }}/readme-refresh-body.md",
    );
    expect(source).toContain("actions: write");
    expect(source).toContain("Trigger content validation for README PR");
    expect(source).toContain(
      'gh workflow run content-validation.yml --ref "$VALIDATION_REF"',
    );
    expect(source).toContain(".github/workflows/readme-refresh-pr.yml");
    expect(source).not.toContain("body: |");
  });

  it("extracts every pending README catalog entry from the diff", () => {
    const changes = extractReadmeEntryChanges(`
diff --git a/README.md b/README.md
@@ -1,2 +1,3 @@
+- **[Xquik MCP Server](https://heyclau.de/mcp/xquik-mcp-server)** - Remote X and Twitter MCP server.
+- **[Memesio MCP Server](https://heyclau.de/mcp/memesio-mcp-server)** - Hosted meme generation MCP server.
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

  it("summarizes direct PR and issue-import README provenance", () => {
    expect(
      summarizeReadmeEntryChange({
        change: {
          changeType: "added",
          title: "Xquik MCP Server",
        },
        associatedPullRequest: {
          number: 326,
          user: { login: "kriptoburak" },
        },
      }),
    ).toBe("Added Xquik MCP Server content submission (#326) by @kriptoburak");

    expect(
      summarizeReadmeEntryChange({
        change: {
          changeType: "added",
          title: "Memesio MCP Server",
        },
        frontmatter: {
          title: "Memesio MCP Server",
          submittedBy: "vy35",
          submissionIssueNumber: 325,
        },
        associatedPullRequest: {
          number: 330,
          user: { login: "JSONbored" },
        },
      }),
    ).toBe(
      "Added Memesio MCP Server content submission (#330) by @vy35 via issue #325",
    );

    const body = buildReadmeRefreshBody([
      {
        summary:
          "Added Xquik MCP Server content submission (#326) by @kriptoburak",
      },
      {
        summary:
          "Added Memesio MCP Server content submission (#330) by @vy35 via issue #325",
      },
    ]);

    expect(body).toContain(
      "- Added Xquik MCP Server content submission (#326) by @kriptoburak",
    );
    expect(body).toContain(
      "- Added Memesio MCP Server content submission (#330) by @vy35 via issue #325",
    );
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
      "Added Example Entry content submission",
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
        submissionIssueNumber: 77,
        importPrNumber: 88,
      },
      associatedPullRequest: {
        number: 88,
        user: { login: "JSONbored" },
      },
    });

    expect(summary).toBe(
      "Added Injected \\[Title\\]\\(https://evil\\.example\\) content submission (#88) via issue #77",
    );
    expect(summary).not.toContain("Closes #123");
    expect(summary).not.toContain("@octo-org/security-team");
    expect(summary).not.toContain("by @");
  });

  it("shows security/safety context in submission queue summaries", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, ".github/workflows/submission-queue.yml"),
      "utf8",
    );

    expect(source).toContain(
      "| Issue | Group | Status | Security | Policy | Source | Contributor | Age | Category | Slug | Action | Notes |",
    );
    expect(source).toContain("entry.riskSummary");
    expect(source).toContain("entry.riskFlags");
    expect(source).toContain("entry.riskTier");
    expect(source).toContain("entry.policyDecision");
    expect(source).toContain("entry.sourceState");
    expect(source).toContain("entry.contributorReview");
    expect(source).toContain("entry.maintainerActions");
  });

  it("keeps stale submission automation review-only and label-scoped", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, ".github/workflows/submission-stale.yml"),
      "utf8",
    );

    expect(source).toContain("Submission Stale Manager");
    expect(source).toContain("issues: write");
    expect(source).toContain("workflow_dispatch:");
    expect(source).not.toContain("inputs:");
    expect(source).not.toContain("inputs.");
    expect(source).toContain("pnpm submission:stale");
    expect(source).toContain("--apply");
    expect(source).not.toContain("import-approved");
    expect(source).not.toContain("scripts/import-submission-issue.mjs");
    expect(source).not.toContain("peter-evans/create-pull-request");
  });

  it("blocks stale source checks from fetching non-public issue URLs", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    expect(isPublicIpAddress("93.184.216.34")).toBe(true);
    expect(isPublicIpAddress("127.0.0.1")).toBe(false);
    expect(isPublicIpAddress("10.0.0.1")).toBe(false);
    expect(await urlNeedsVerification("http://127.0.0.1/internal")).toBe(false);
    expect(await urlNeedsVerification("https://127.0.0.1/internal")).toBe(
      false,
    );
    expect(fetchMock).not.toHaveBeenCalled();

    vi.unstubAllGlobals();
  });

  it("does not follow stale source redirects to untrusted destinations", async () => {
    const fetchMock = vi.fn(async () => {
      return new Response(null, {
        status: 302,
        headers: { location: "http://127.0.0.1/internal" },
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      urlNeedsVerification("https://93.184.216.34/source"),
    ).resolves.toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    vi.unstubAllGlobals();
  });

  it("still marks public HTTPS sources as needing verification on 404", async () => {
    const fetchMock = vi.fn(async () => new Response(null, { status: 404 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      urlNeedsVerification("https://93.184.216.34/missing"),
    ).resolves.toBe(true);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://93.184.216.34/missing",
      expect.objectContaining({ method: "HEAD", redirect: "manual" }),
    );

    vi.unstubAllGlobals();
  });

  it("keeps stale reminders separate from close eligibility", () => {
    const baseEntry = {
      number: 296,
      status: "stale_reminder_due",
      labels: ["content-submission", "needs-author-input"],
      recommendedLabels: [
        "content-submission",
        "needs-review",
        "needs-author-input",
        "stale-submission",
      ],
    };

    expect(planStaleSubmissionAction(baseEntry)).toMatchObject({
      issue: 296,
      labels: ["stale-submission"],
      remind: true,
      close: false,
    });
    expect(
      planStaleSubmissionAction({
        ...baseEntry,
        labels: [...baseEntry.labels, "stale-submission"],
      }),
    ).toMatchObject({
      labels: [],
      remind: false,
      close: false,
    });
    expect(
      planStaleSubmissionAction({
        ...baseEntry,
        status: "close_eligible",
        labels: [...baseEntry.labels, "stale-submission"],
      }),
    ).toMatchObject({
      labels: [],
      remind: false,
      close: true,
    });
    expect(
      planStaleSubmissionAction({
        ...baseEntry,
        status: "close_eligible",
      }),
    ).toMatchObject({
      labels: ["stale-submission"],
      remind: true,
      close: false,
    });
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

  it("routes hook-only content PRs to hook content validation", () => {
    const outputs = runClassifierForChangedFiles({
      "content/hooks/retro-daily.mdx": "---\ntitle: Retro Daily\n---\n",
    });

    expect(outputs.content).toBe("true");
    expect(outputs.content_hooks).toBe("true");
    expect(outputs.content_mcp).toBe("false");
    expect(outputs.content_categories_json).toBe('["hooks"]');
    expect(outputs.web).toBe("false");
    expect(outputs.mcp).toBe("false");
    expect(outputs.raycast).toBe("false");
    expect(outputs.packages).toBe("false");
    expect(outputs.registry).toBe("false");
    expect(outputs.ci).toBe("false");
  });

  it("routes multi-category content PRs to only touched category validators", () => {
    const outputs = runClassifierForChangedFiles({
      "content/hooks/retro-daily.mdx": "---\ntitle: Retro Daily\n---\n",
      "content/mcp/example-server.mdx": "---\ntitle: Example Server\n---\n",
    });

    expect(outputs.content_categories_json).toBe('["hooks","mcp"]');
    expect(outputs.content_hooks).toBe("true");
    expect(outputs.content_mcp).toBe("true");
    expect(outputs.content_skills).toBe("false");
    expect(outputs.web).toBe("false");
    expect(outputs.raycast).toBe("false");
    expect(outputs.packages).toBe("false");
    expect(outputs.registry).toBe("false");
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
    expect(jobsSource).toContain('echo "skip=true"');
    expect(jobsSource).toContain('} >> "$GITHUB_OUTPUT"');
    expect(jobsSource).toContain("Skipping scheduled jobs source revalidation");
    expect(jobsSource).toContain(
      "if: steps.source-check.outputs.skip != 'true'",
    );
  });
});
