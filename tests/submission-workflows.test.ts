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
    expect(source).toContain("Post risk report comment");
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

  it("reviews direct content PRs without executing fork code", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, ".github/workflows/submission-pr-risk.yml"),
      "utf8",
    );

    expect(source).toContain("pull_request_target:");
    expect(source).toContain("Analyze PR content through GitHub API");
    expect(source).not.toContain("actions/checkout");
    expect(source).not.toContain("pnpm install");
    expect(source).not.toContain("Setup Node.js");
    expect(source).not.toContain("Setup pnpm");
    expect(source).not.toContain(
      "ref: ${{ github.event.pull_request.base.sha }}",
    );
    expect(source).toContain("github.rest.repos.getContent");
    expect(source).toContain("pr.head.sha");
    expect(source).toContain("read as data only");
    expect(source).toContain("never checks out PR code");
    expect(source).toContain("### Contributor");
    expect(source).toContain("### Contribution");
    expect(source).toContain("contributorAnalysis");
    expect(source).toContain("contributionAnalysis");
    expect(source).toContain("contributorAnalysisTarget");
    expect(source).toContain('contributorSource !== "submission_issue_author"');
    expect(source).toContain("analysisTarget.fallback");
    expect(source).toContain("analysis.accountAgeDays < 30");
    expect(source).not.toContain("} else if (ageDays < 30)");
    expect(source).not.toContain(
      "report.effectiveContributor || pullRequestActor || pr.user",
    );
    expect(source).toContain("github.rest.repos.get");
    expect(source).toContain("sourceType");
    expect(source).toContain("automation_import");
    expect(source).toContain("submissionIssueContributors");
    expect(source).toContain("Submission provenance validation found blockers");
    expect(source).toContain(
      "Submission security/safety review found critical blockers",
    );
    expect(source).toContain("REQUEST_CHANGES");
    expect(source).toContain("ARCHIVE_PACKAGE_EXTENSIONS");
    expect(source).toContain("HEYCLAUDE_HOSTNAME");
    expect(source).toContain("const downloadHost = hostname(downloadUrl)");
    expect(source).toContain("const isHeyClaudeDownloadRequest");
    expect(source).toContain("community_archive_download");
    expect(source).toContain("community_local_download_request");
    expect(source).toContain("isArchivePackageUrl(downloadUrl)");
    expect(source).toContain("missing_safety_notes");
    expect(source).toContain("missing_privacy_notes");
    expect(source).toContain("review.body?.includes(REVIEW_MARKER)");
    expect(source).not.toContain("git checkout");
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

    expect(source).toContain("validate-pr-preview:");
    expect(source).toContain("github.event_name == 'pull_request'");
    expect(source).toContain("Deploy same-repo PR preview to dev Worker");
    expect(source).toContain("Resolve PR preview URL");
    expect(source).toContain("pnpm validate:deployment-artifacts");
    expect(source).not.toContain("vars.DEPLOYMENT_ARTIFACT_BASE_URL");
    expect(source).toContain("Dry-run Resend template sync");
    expect(source).toContain("pnpm resend:sync-templates -- --dry-run");
  });

  it("keeps contributor generated artifact edits out of direct content PRs", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, ".github/workflows/content-validation.yml"),
      "utf8",
    );

    expect(source).toContain("Reject external generated artifact changes");
    expect(source).toContain("Generated artifacts and package artifacts");
    expect(source).toContain("package artifacts are maintainer-owned");
    expect(source).toContain(
      "HEAD_REPO: ${{ github.event.pull_request.head.repo.full_name }}",
    );
    expect(source).toContain('[ "$HEAD_REPO" = "$GITHUB_REPOSITORY" ]');
    expect(source).toContain("exit 0");
    expect(source).toContain("apps/web/public/downloads");
    expect(source).toContain("content/skills/.+\\.zip$");
    expect(source).toContain("content/mcp/.+\\.mcpb$");
    expect(source).toContain("Build registry artifacts");
    expect(source).toContain("pnpm --filter web run prebuild");
    expect(source).toContain("pnpm validate:readme");
    expect(source).toContain(
      "git diff --exit-code apps/web/public/data apps/web/src/generated README.md",
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
