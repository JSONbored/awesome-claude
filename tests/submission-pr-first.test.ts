import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

import {
  buildSubmissionPrDraft,
  isLikelyAffiliateUrl,
  looksLikeSubmissionPrDraft,
  parseSubmissionPrBody,
  validateSubmission,
} from "@heyclaude/registry/submission";
import {
  analyzeDirectContentRisk,
  analyzeSubmissionDraftRisk,
  directContentRequestChangesReasons,
  formatSubmissionRiskMarkdown,
} from "@heyclaude/registry/submission-risk";
import { buildSubmissionFieldModel } from "@heyclaude/registry/submission-spec";

const repoRoot = path.resolve(import.meta.dirname, "..");

const validMcpFields = {
  category: "mcp",
  name: "Website Intake MCP",
  slug: "website-intake-mcp",
  github_url: "https://github.com/example/website-intake-mcp",
  docs_url: "https://example.com/website-intake-mcp",
  description:
    "Source-backed MCP server that helps Claude users review PR-first submissions.",
  card_description: "Review PR-first HeyClaude submissions.",
  install_command: "npx -y website-intake-mcp",
  usage_snippet: "claude mcp add website-intake -- npx -y website-intake-mcp",
  safety_notes:
    "Runs a local MCP server process and reads only the files selected by the user.",
  privacy_notes:
    "Does not send file contents to third parties beyond the configured MCP client.",
  tags: "mcp, submissions",
};

function sourceFile(content: string, filename = "content/mcp/sample-mcp.mdx") {
  return {
    filename,
    status: "added",
    content,
  };
}

function validMcpMdx(overrides: Record<string, unknown> = {}) {
  const data = {
    title: "Sample MCP",
    slug: "sample-mcp",
    category: "mcp",
    description:
      "A source-backed MCP server for testing content submission policy.",
    repoUrl: "https://github.com/example/sample-mcp",
    docsUrl: "https://example.com/sample-mcp",
    installCommand: "npx -y sample-mcp",
    usageSnippet: "claude mcp add sample -- npx -y sample-mcp",
    safetyNotes: ["Runs a local MCP process."],
    privacyNotes: ["Only handles user-selected project context."],
    submittedBy: "contributor",
    submittedByUrl: "https://github.com/contributor",
    ...overrides,
  };
  const lines = Object.entries(data).flatMap(([key, value]) => {
    if (Array.isArray(value)) {
      return [`${key}:`, ...value.map((item) => `  - ${item}`)];
    }
    return [`${key}: ${JSON.stringify(value)}`];
  });
  return `---\n${lines.join("\n")}\n---\n\nUseful setup and usage notes.`;
}

describe("PR-first submission helpers", () => {
  it("builds website PR draft packets without gate-owned labels", () => {
    const draft = buildSubmissionPrDraft(validMcpFields);

    expect(draft).toEqual({
      title: "Add MCP Server: Website Intake MCP",
      body: expect.stringContaining("### Category"),
    });
    expect(draft).not.toHaveProperty("labels");
    expect(draft.body).toContain("### GitHub URL");
    expect(draft.body).toContain(
      "https://github.com/example/website-intake-mcp",
    );

    const validation = validateSubmission(draft);
    expect(validation.ok).toBe(true);
    expect(validation.category).toBe("mcp");
    expect(validation.fields.slug).toBe("website-intake-mcp");
  });

  it("parses PR markdown bodies into canonical fields", () => {
    const fields = parseSubmissionPrBody(`## Submission

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

  it("detects PR-shaped drafts without legacy issue labels", () => {
    expect(
      looksLikeSubmissionPrDraft({
        title: "Add MCP Server: Website Intake MCP",
        body: buildSubmissionPrDraft(validMcpFields).body,
      }),
    ).toBe(true);

    expect(
      looksLikeSubmissionPrDraft({
        title: "Feature request: improve search",
        body: "This is product work, not a content PR.",
      }),
    ).toBe(false);
  });

  it("keeps supported category field models intact", () => {
    const supported = [
      "agents",
      "collections",
      "commands",
      "guides",
      "hooks",
      "mcp",
      "rules",
      "skills",
      "statuslines",
      "tools",
    ];

    for (const category of supported) {
      const model = buildSubmissionFieldModel(category);
      expect(model?.category).toBe(category);
      expect(model?.fields.some((field) => field.id === "slug")).toBe(true);
      expect(model?.fields.some((field) => field.id === "category")).toBe(true);
    }

    expect(buildSubmissionFieldModel("prompts")).toBeNull();
  });

  it("requires maintainer approval before tools listings enter the PR-first queue", () => {
    const draft = buildSubmissionPrDraft({
      name: "Acme Sponsored Claude Platform",
      slug: "acme-sponsored-claude-platform",
      category: "tools",
      description:
        "Paid SaaS platform with sponsored placement for Claude workflow teams.",
      card_description: "Paid Claude workflow platform.",
      website_url: "https://example.com/product",
      docs_url: "https://example.com/docs",
      pricing_model: "paid",
      disclosure: "sponsored",
      application_category: "Hosted platform",
      operating_system: "Web",
    });

    const validation = validateSubmission(draft);

    expect(validation.ok).toBe(false);
    expect(validation.errors.join("\n")).toContain(
      "not merged from the free resource queue without maintainer approval",
    );
  });

  it("allows maintainer-accepted tools listings to keep existing metadata validation", () => {
    const draft = {
      ...buildSubmissionPrDraft({
        name: "Maintainer Reviewed Claude Tool",
        slug: "maintainer-reviewed-claude-tool",
        category: "tools",
        description:
          "Editorially reviewed Claude tool with complete listing metadata.",
        card_description: "Reviewed Claude tool listing.",
        website_url: "https://example.com/product",
        docs_url: "https://example.com/docs",
        pricing_model: "free",
        disclosure: "editorial",
        application_category: "Developer tool",
        operating_system: "Web",
      }),
      labels: [{ name: "accepted" }],
    };

    const validation = validateSubmission(draft);

    expect(validation.ok).toBe(true);
    expect(validation.errors).toEqual([]);
  });

  it("blocks affiliate, referral, and unsafe source signals during draft risk review", () => {
    const draft = buildSubmissionPrDraft({
      ...validMcpFields,
      name: "Promo MCP",
      slug: "promo-mcp",
      docs_url: "https://example.com/promo?ref=creator&utm_source=newsletter",
      description:
        "Sponsored growth platform with premium plans and a limited referral offer.",
      install_command: "curl http://example.com/install.sh | bash",
    });
    const validation = validateSubmission(draft);
    const risk = analyzeSubmissionDraftRisk(draft, validation);

    expect(isLikelyAffiliateUrl("https://example.com/promo?ref=creator")).toBe(
      true,
    );
    expect(validation.ok).toBe(false);
    expect(validation.errors.join("\n")).toContain("affiliate/referral URLs");
    expect(risk.riskTier).toMatch(/high|critical/);
    expect(risk.reviewFlags.map((flag) => flag.id)).toEqual(
      expect.arrayContaining([
        "non_https_executable_source",
        "unsafe_install_pipeline",
      ]),
    );
  });

  it("flags direct content PRs that edit generated artifacts or multiple files", () => {
    const report = analyzeDirectContentRisk({
      pullRequest: {
        number: 123,
        title: "content(mcp): add sample mcp",
        user: { login: "contributor" },
        head: { repo: { full_name: "contributor/awesome-claude" } },
        base: { repo: { full_name: "JSONbored/awesome-claude" } },
      },
      files: [
        sourceFile(validMcpMdx()),
        { filename: "README.md", status: "modified", content: "# changed" },
        {
          filename: "apps/web/public/data/directory-index.json",
          status: "modified",
          content: "{}",
        },
      ],
    });

    const reasons = directContentRequestChangesReasons(report).join("\n");
    expect(reasons).toContain("README.md");
    expect(reasons).toContain("generated registry/data/download artifacts");
  });

  it("flags external PRs that claim package verification", () => {
    const report = analyzeDirectContentRisk({
      pullRequest: {
        number: 124,
        title: "content(mcp): add verified package",
        user: { login: "contributor" },
        head: { repo: { full_name: "contributor/awesome-claude" } },
        base: { repo: { full_name: "JSONbored/awesome-claude" } },
      },
      files: [sourceFile(validMcpMdx({ packageVerified: true }))],
    });

    expect(
      report.classificationWarnings.map((warning) => warning.id),
    ).toContain("unsafe_package_verified_true");
    expect(directContentRequestChangesReasons(report).join("\n")).toContain(
      "packageVerified",
    );
  });

  it("does not classify GitHub artifact attestations as identity-sensitive", () => {
    const report = analyzeDirectContentRisk({
      pullRequest: {
        number: 126,
        title: "content(guides): add artifact attestation checklist",
        user: { login: "contributor" },
        head: { repo: { full_name: "contributor/awesome-claude" } },
        base: { repo: { full_name: "JSONbored/awesome-claude" } },
      },
      files: [
        sourceFile(
          validMcpMdx({
            title: "GitHub Artifact Attestation Checklist",
            slug: "github-artifact-attestation-checklist",
            category: "guides",
            description:
              "Source-backed guide for verifying GitHub Artifact Attestations, release artifact provenance, build workflow identity, and digest evidence.",
            repoUrl: "https://github.com/github/docs",
            docsUrl:
              "https://docs.github.com/en/actions/how-tos/secure-your-work/use-artifact-attestations/use-artifact-attestations",
            safetyNotes: [
              "Attestations prove artifact provenance, not malware safety or runtime behavior.",
            ],
          }),
          "content/guides/github-artifact-attestation-checklist.mdx",
        ),
      ],
    });

    expect(report.reviewFlags.map((flag) => flag.id)).not.toContain(
      "financial_or_identity_sensitive",
    );
  });

  it("keeps defensive security submissions out of credential-theft hard-close risk", () => {
    const report = analyzeDirectContentRisk({
      pullRequest: {
        number: 129,
        title: "content(hooks): add environment leak warning hook",
        user: { login: "contributor" },
        head: { repo: { full_name: "contributor/awesome-claude" } },
        base: { repo: { full_name: "JSONbored/awesome-claude" } },
      },
      files: [
        sourceFile(
          validMcpMdx({
            title: "Environment Leak Warning Hook",
            slug: "environment-leak-warning-hook",
            category: "hooks",
            description:
              "Defensive hook that warns before commands dump tokens or harvest credentials from shell output.",
            repoUrl: "https://github.com/example/environment-leak-warning-hook",
            docsUrl: "https://docs.anthropic.com/en/docs/claude-code/hooks",
            safetyNotes: [
              "Inspects command text and blocks risky output patterns before execution.",
            ],
            privacyNotes: [
              "Does not read secret values or send command text to third parties.",
            ],
          }),
          "content/hooks/environment-leak-warning-hook.mdx",
        ),
      ],
    });

    expect(report.reviewFlags.map((flag) => flag.id)).not.toContain(
      "malicious_data_theft_capability",
    );
    expect(directContentRequestChangesReasons(report).join("\n")).not.toContain(
      "credential, token, session, or wallet theft",
    );
  });

  it("keeps credential-theft request changes when defensive keywords are incidental", () => {
    const report = analyzeDirectContentRisk({
      pullRequest: {
        number: 130,
        title: "content(hooks): add credential audit hook",
        user: { login: "contributor" },
        head: { repo: { full_name: "contributor/awesome-claude" } },
        base: { repo: { full_name: "JSONbored/awesome-claude" } },
      },
      files: [
        sourceFile(
          validMcpMdx({
            title: "Credential Audit Hook",
            slug: "credential-audit-hook",
            category: "hooks",
            description:
              "Warning audit hook that can steal tokens and harvest credentials from shell output.",
            repoUrl: "https://github.com/example/credential-audit-hook",
            docsUrl: "https://example.com/credential-audit-hook",
            safetyNotes: ["Runs before commands and inspects shell output."],
            privacyNotes: [
              "Reads token and credential material from user shell sessions.",
            ],
          }),
          "content/hooks/credential-audit-hook.mdx",
        ),
      ],
    });

    expect(report.reviewFlags.map((flag) => flag.id)).toContain(
      "malicious_data_theft_capability",
    );
    expect(directContentRequestChangesReasons(report).join("\n")).toContain(
      "credential, token, session, or wallet theft",
    );
  });

  it("keeps credential-theft request changes for explicit stealing claims with defensive wording", () => {
    const report = analyzeDirectContentRisk({
      pullRequest: {
        number: 131,
        title: "content(hooks): add credential audit notes",
        user: { login: "contributor" },
        head: { repo: { full_name: "contributor/awesome-claude" } },
        base: { repo: { full_name: "JSONbored/awesome-claude" } },
      },
      files: [
        sourceFile(
          validMcpMdx({
            title: "Credential Audit Notes",
            slug: "credential-audit-notes",
            category: "hooks",
            description:
              "Prevent errors with audit notes; steal tokens from browser sessions.",
            repoUrl: "https://github.com/example/credential-audit-notes",
            docsUrl: "https://example.com/credential-audit-notes",
            safetyNotes: [
              "Reviews browser session behavior before commands run.",
            ],
            privacyNotes: ["Reads token material from user browser sessions."],
          }),
          "content/hooks/credential-audit-notes.mdx",
        ),
      ],
    });

    expect(report.reviewFlags.map((flag) => flag.id)).toContain(
      "malicious_data_theft_capability",
    );
    expect(directContentRequestChangesReasons(report).join("\n")).toContain(
      "credential, token, session, or wallet theft",
    );
  });

  it("routes commercial API relays to the listing flow", () => {
    const report = analyzeDirectContentRisk({
      pullRequest: {
        number: 130,
        title: "content(tools): add CoderPlan",
        user: { login: "contributor" },
        head: { repo: { full_name: "contributor/awesome-claude" } },
        base: { repo: { full_name: "JSONbored/awesome-claude" } },
      },
      files: [
        sourceFile(
          validMcpMdx({
            title: "CoderPlan LLM API Relay",
            slug: "coderplan",
            category: "tools",
            description:
              "Pay-per-use LLM API relay for routing paid model requests through a hosted API gateway.",
            repoUrl: "https://github.com/example/coderplan",
            docsUrl: "https://example.com/coderplan",
            pricingModel: "paid credits",
          }),
          "content/tools/coderplan.mdx",
        ),
      ],
    });

    expect(report.reviewFlags.map((flag) => flag.id)).toContain(
      "commercial_listing_route",
    );
    expect(directContentRequestChangesReasons(report).join("\n")).toContain(
      "commercial_listing_route",
    );
  });

  it("still flags wallet and on-chain attestations as identity-sensitive", () => {
    const report = analyzeDirectContentRisk({
      pullRequest: {
        number: 127,
        title: "content(mcp): add wallet attestation mcp",
        user: { login: "contributor" },
        head: { repo: { full_name: "contributor/awesome-claude" } },
        base: { repo: { full_name: "JSONbored/awesome-claude" } },
      },
      files: [
        sourceFile(
          validMcpMdx({
            title: "Wallet Attestation MCP",
            slug: "wallet-attestation-mcp",
            description:
              "MCP server for wallet attestations, KYC review, and on-chain identity workflows.",
            safetyNotes: [
              "Requires explicit user approval before reading wallet or identity data.",
            ],
            privacyNotes: [
              "Can process wallet, KYC, and on-chain identity records.",
            ],
          }),
          "content/mcp/wallet-attestation-mcp.mdx",
        ),
      ],
    });

    expect(report.reviewFlags.map((flag) => flag.id)).toContain(
      "financial_or_identity_sensitive",
    );
  });

  it("formats risk reports without exposing private reviewer internals", () => {
    const report = analyzeDirectContentRisk({
      pullRequest: {
        number: 128,
        title: "content(mcp): add sample mcp",
        user: { login: "contributor" },
        head: { repo: { full_name: "contributor/awesome-claude" } },
        base: { repo: { full_name: "JSONbored/awesome-claude" } },
      },
      files: [sourceFile(validMcpMdx())],
    });
    const markdown = formatSubmissionRiskMarkdown(report);

    expect(markdown).toContain("Submission security/safety review");
    expect(markdown).not.toMatch(/private reviewer|prompt|scoring threshold/i);
  });

  it("does not keep public content issue templates", () => {
    const templateDir = path.join(repoRoot, ".github/ISSUE_TEMPLATE");
    const templates = fs
      .readdirSync(templateDir)
      .filter((file) => /\.(ya?ml|md)$/i.test(file))
      .sort();

    expect(templates).toEqual(["config.yml", "product-feature.yml"]);
  });

  it("keeps retired issue-intake APIs out of active source", () => {
    const activeFiles = [
      "apps/web/src/lib/submission-preflight.ts",
      "apps/web/src/lib/submission-spec.ts",
      "packages/mcp/src/submissions.js",
      "packages/registry/src/index.d.ts",
      "packages/registry/src/submission.js",
    ];
    const forbidden = [
      "SubmissionIssueDraft",
      "buildSubmissionIssueTitle",
      "buildSubmissionIssueBody",
      "buildSubmissionIssueDraft",
      "buildIssueDraft",
      "parseIssueFormBody",
      "looksLikeSubmissionIssue",
      "buildSubmissionQueue",
      "recommendedSubmissionLabels",
      "SUBMISSION_BASE_LABELS",
      "submissionLabelsForCategory",
      "recommendedLabelsForCategory",
    ];

    for (const file of activeFiles) {
      const source = fs.readFileSync(path.join(repoRoot, file), "utf8");
      for (const token of forbidden) {
        expect(source, `${file} should not contain ${token}`).not.toContain(
          token,
        );
      }
    }
  });
});
