import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  buildReadmeRefreshBody,
  extractReadmeEntryChanges,
  summarizeReadmeEntryChange,
} from "../scripts/build-readme-refresh-body.mjs";
import { planStaleSubmissionAction } from "../scripts/manage-stale-submissions.mjs";
import { repoRoot } from "./helpers/registry-fixtures";

describe("submission automation workflows", () => {
  it("keeps issue validation as preview-only until maintainer approval", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, ".github/workflows/submission-issue-validation.yml"),
      "utf8",
    );

    expect(source).toContain("Preview import output");
    expect(source).toContain("--dry-run");
    expect(source).toContain("Analyze submission risk");
    expect(source).toContain("Post risk report comment");
    expect(source).toContain("Fail when submission risk is critical");
    expect(source).toContain("managedValidationLabels");
    expect(source).not.toContain("peter-evans/create-pull-request");
    expect(source).not.toContain("labels.*.name, 'submission'");
  });

  it("reviews direct content PRs without executing fork code", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, ".github/workflows/submission-pr-risk.yml"),
      "utf8",
    );

    expect(source).toContain("pull_request_target:");
    expect(source).toContain("Checkout base repository");
    expect(source).toContain("github.rest.repos.getContent");
    expect(source).toContain("pr.head.sha");
    expect(source).toContain("sourceType");
    expect(source).toContain("automation_import");
    expect(source).toContain("submissionIssueContributors");
    expect(source).toContain("Fail when submission provenance is invalid");
    expect(source).toContain("scripts/ci/fail-provenance-report.mjs");
    expect(source).toContain("Analyze direct content PR risk");
    expect(source).toContain("Fail when submission risk is critical");
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
    expect(source).toContain("Format imported content");
    expect(source).toContain("pnpm exec prettier --write");
    expect(source).toContain("pnpm --filter web run prebuild");
    expect(source).toContain("pnpm generate:readme");
    expect(source).toContain("pnpm validate:content:strict");
    expect(source).toContain("peter-evans/create-pull-request@");
    expect(source).toContain("branch=automation/submission-");
    expect(source).toContain("actions: write");
    expect(source).toContain("Trigger content validation for import PR");
    expect(source).toContain(
      'gh workflow run content-validation.yml --ref "$VALIDATION_REF"',
    );
    expect(source).toContain("pr_title=feat(content): add");
    expect(source).toContain("issue_author=");
    expect(source).toContain("issue_author_handle=");
    expect(source).toContain("issue_author_id=");
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

  it("keeps contributor README edits out of direct content PRs", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, ".github/workflows/content-validation.yml"),
      "utf8",
    );

    expect(source).toContain("Reject direct PR README changes");
    expect(source).toContain("README.md is generated by maintainer automation");
    expect(source).toContain(
      "HEAD_REPO: ${{ github.event.pull_request.head.repo.full_name }}",
    );
    expect(source).toContain('[ "$HEAD_REPO" = "$GITHUB_REPOSITORY" ]');
    expect(source).toContain("automation/submission-*");
    expect(source).toContain("Regenerate README for pull request validation");
    expect(source).toContain("pnpm generate:readme");
    expect(source).toContain("pnpm validate:readme");
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

  it("shows security/safety context in submission queue summaries", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, ".github/workflows/submission-queue.yml"),
      "utf8",
    );

    expect(source).toContain(
      "| Issue | Status | Security | Age | Category | Slug | Action | Notes |",
    );
    expect(source).toContain("entry.riskFlags");
    expect(source).toContain("entry.riskTier");
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

  it("keeps required validation checks wired for README and changelog PRs", () => {
    const source = fs.readFileSync(
      path.join(repoRoot, ".github/workflows/content-validation.yml"),
      "utf8",
    );

    expect(source).toContain('- "README.md"');
    expect(source).toContain('- "CHANGELOG.md"');
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
    const packageSource = fs.readFileSync(
      path.join(repoRoot, ".github/workflows/mcp-package.yml"),
      "utf8",
    );
    const jobsSource = fs.readFileSync(
      path.join(repoRoot, ".github/workflows/jobs-source-revalidation.yml"),
      "utf8",
    );

    expect(releaseSource).toContain("group: mcp-package-release");
    expect(releaseSource).toContain("id-token: write");
    expect(releaseSource).toContain("environment: npm-production");
    expect(releaseSource).toContain(
      "require('./packages/mcp/package.json').version",
    );
    expect(releaseSource).toContain('tag="mcp-v$RELEASE_VERSION"');
    expect(releaseSource).toContain("npm publish --access public --provenance");
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
