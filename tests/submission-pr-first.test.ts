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

  it("formats risk reports without exposing private reviewer internals", () => {
    const report = analyzeDirectContentRisk({
      pullRequest: {
        number: 125,
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
