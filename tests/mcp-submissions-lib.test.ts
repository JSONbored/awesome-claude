import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  SUBMISSION_SITE_URL,
  buildPrDraftFromSpec,
  buildSubmissionUrlsFromSpec,
  getCategorySubmissionGuidanceFromSpec,
  getSubmissionExamplesFromSpec,
  getSubmissionSchemaFromSpec,
  normalizeSubmissionFields,
  prepareSubmissionDraftFromSpec,
  reviewSubmissionDraftFromSpec,
  searchDuplicateEntries,
  slugify,
  validateSubmissionDraftFromSpec,
} from "../packages/mcp/src/submissions-lib.js";
import {
  buildPrDraftFromSpec as buildPrDraftFromWrapper,
  slugify as slugifyFromWrapper,
} from "../packages/mcp/src/submissions.js";
import { repoRoot } from "./helpers/registry-fixtures";

const submissionSpec = JSON.parse(
  fs.readFileSync(
    path.join(repoRoot, "apps/web/public/data/submission-spec.json"),
    "utf8",
  ),
) as {
  schemaVersion: number;
  categories: Record<string, { label: string; fields: Array<{ id: string }> }>;
};

const validMcpFields = {
  category: "mcp",
  name: "Example Protocol MCP",
  slug: "example-protocol-mcp",
  github_url: "https://github.com/example/example-protocol-mcp",
  docs_url: "https://example.com/docs",
  description:
    "Example MCP server submission used to verify the submissions-lib surface.",
  install_command: "npx -y example-protocol-mcp",
  usage_snippet: "Add this server to your MCP client configuration.",
  safety_notes:
    "Installs and runs an MCP server process from the submitted package.",
  privacy_notes:
    "Not applicable: this fixture does not access user files or credentials.",
  contact_email: "@example",
  tags: "mcp, testing",
};

function indexedEntry(overrides: Record<string, unknown> = {}) {
  return {
    category: "mcp",
    slug: "airtable-mcp-server",
    title: "Airtable MCP",
    brandDomain: "",
    documentationUrl: "https://github.com/domdomegg/airtable-mcp-server",
    repoUrl: "https://github.com/domdomegg/airtable-mcp-server",
    ...overrides,
  };
}

describe("submissions-lib slugify and normalization", () => {
  it("slugifies titles into kebab-case", () => {
    expect(slugify("  Example Protocol MCP!  ")).toBe("example-protocol-mcp");
    expect(slugify("Branch Matrix MCP")).toBe("branch-matrix-mcp");
  });

  it("derives slug, card description, and source URLs from fields", () => {
    expect(
      normalizeSubmissionFields({
        title: "Example Protocol MCP",
        source_url: "https://github.com/example/repo",
        description:
          "A practical MCP server submission with enough detail for review.",
      }),
    ).toMatchObject({
      name: "Example Protocol MCP",
      slug: "example-protocol-mcp",
      github_url: "https://github.com/example/repo",
      card_description: expect.stringMatching(/^A practical MCP server/),
    });
  });

  it("maps docs URLs when source_url is not GitHub", () => {
    expect(
      normalizeSubmissionFields({
        name: "Docs Only MCP",
        source_url: "https://example.com/docs",
      }),
    ).toMatchObject({
      docs_url: "https://example.com/docs",
    });
  });
});

describe("submissions-lib spec validation", () => {
  it("returns schema metadata for a supported category", () => {
    expect(
      getSubmissionSchemaFromSpec(submissionSpec, { category: "mcp" }),
    ).toMatchObject({
      ok: true,
      category: "mcp",
      schemaVersion: submissionSpec.schemaVersion,
    });
  });

  it("rejects unknown categories", () => {
    expect(
      getSubmissionSchemaFromSpec(submissionSpec, { category: "unknown" }),
    ).toMatchObject({
      ok: false,
      error: { code: "not_found" },
    });
  });

  it("validates a complete MCP draft", () => {
    expect(
      validateSubmissionDraftFromSpec(submissionSpec, {
        fields: validMcpFields,
      }),
    ).toMatchObject({
      ok: true,
      valid: true,
      category: "mcp",
      slug: "example-protocol-mcp",
      prPreview: {
        title: "Add MCP Server: Example Protocol MCP",
      },
    });
  });

  it("reports missing required fields and invalid URLs", () => {
    const result = validateSubmissionDraftFromSpec(submissionSpec, {
      fields: {
        category: "mcp",
        name: "Bad MCP",
        description: "short",
        card_description: "short",
        github_url: "http://github.com/example/bad",
        docs_url: "not a url",
        contact_email: "not a contact",
      },
    });
    expect(result.valid).toBe(false);
    expect(result.errors.join("\n")).toContain(
      "github_url must be a valid https URL.",
    );
    expect(result.errors.join("\n")).toContain(
      "Invalid public contact: use a GitHub handle, GitHub profile URL, or email.",
    );
  });

  it("rejects GitHub profile contact URLs with embedded userinfo", () => {
    const result = validateSubmissionDraftFromSpec(submissionSpec, {
      fields: {
        ...validMcpFields,
        contact_email: "https://token@github.com/victim",
      },
    });
    expect(result.errors.join("\n")).toContain(
      "Invalid public contact: use a GitHub handle, GitHub profile URL, or email.",
    );
  });

  it("requires collections items and guide content", () => {
    expect(
      validateSubmissionDraftFromSpec(submissionSpec, {
        fields: {
          category: "collections",
          name: "Empty Collection",
          description: "Collection without item references.",
          docs_url: "https://example.com/collection",
        },
      }).errors,
    ).toContain("Collections submissions require items.");
    expect(
      validateSubmissionDraftFromSpec(submissionSpec, {
        fields: {
          category: "guides",
          name: "Empty Guide",
          description: "Guide without guide body.",
          docs_url: "https://example.com/guide",
        },
      }).errors,
    ).toContain("Guide submissions require guide_content.");
  });

  it("rejects affiliate URLs and invalid capability-pack metadata", () => {
    const affiliateResult = validateSubmissionDraftFromSpec(submissionSpec, {
      fields: {
        ...validMcpFields,
        docs_url: "https://example.com/?utm_source=partner&ref=abc",
      },
    });
    expect(affiliateResult.errors.join("\n")).toContain(
      "Contributor submissions cannot include affiliate/referral URLs",
    );

    const skillResult = validateSubmissionDraftFromSpec(submissionSpec, {
      fields: {
        category: "skills",
        name: "Capability Pack",
        description:
          "Capability pack skill with intentionally invalid verification metadata for review.",
        github_url: "https://github.com/example/repo/tree/main/skills/demo",
        usage_snippet: "Use this capability pack during code review workflows.",
        skill_type: "capability-pack",
        skill_level: "beginner",
        verified_at: "20260101",
        safety_notes: "Runs user-configured scripts in the local workspace.",
        privacy_notes:
          "Does not persist user data outside the configured workspace.",
      },
    });
    expect(skillResult.errors.join("\n")).toContain(
      "verified_at must use YYYY-MM-DD format.",
    );
    expect(skillResult.errors.join("\n")).toContain(
      "capability-pack skills must use skill_level=expert.",
    );
  });
});

describe("submissions-lib draft builders", () => {
  it("builds PR draft headings from normalized fields", () => {
    const draft = buildPrDraftFromSpec(submissionSpec, validMcpFields);
    expect(draft.title).toBe("Add MCP Server: Example Protocol MCP");
    expect(draft.body).toContain("### Install command");
    expect(draft.body).toContain("npx -y example-protocol-mcp");
  });

  it("builds submit URLs and optional PR bodies", () => {
    const urls = buildSubmissionUrlsFromSpec(submissionSpec, {
      fields: validMcpFields,
      includePrBody: true,
    });
    expect(urls).toMatchObject({
      ok: true,
      valid: true,
      category: "mcp",
      submitUrl: expect.stringContaining(SUBMISSION_SITE_URL),
      prDraft: {
        title: "Add MCP Server: Example Protocol MCP",
        body: expect.stringContaining("Example Protocol MCP"),
      },
    });
  });

  it("prepares a full review draft with checklist metadata", () => {
    expect(
      prepareSubmissionDraftFromSpec(submissionSpec, {
        fields: validMcpFields,
      }),
    ).toMatchObject({
      ok: true,
      valid: true,
      submitUrl: expect.stringContaining(SUBMISSION_SITE_URL),
      reviewChecklist: expect.arrayContaining([
        expect.stringContaining("Check for existing registry entries"),
      ]),
    });
  });

  it("returns category examples and guidance", () => {
    expect(
      getSubmissionExamplesFromSpec(submissionSpec, { category: "mcp" }),
    ).toMatchObject({
      ok: true,
      categories: [
        expect.objectContaining({
          category: "mcp",
          requiredFields: expect.any(Array),
        }),
      ],
    });
    expect(
      getCategorySubmissionGuidanceFromSpec(submissionSpec, {
        category: "skills",
      }),
    ).toMatchObject({
      ok: true,
      categories: [
        expect.objectContaining({
          category: "skills",
          guidance: expect.arrayContaining([
            expect.stringContaining("canonical source URLs"),
          ]),
        }),
      ],
    });
  });
});

describe("submissions-lib duplicate review", () => {
  it("flags overlapping source URLs across indexed entries", () => {
    const duplicates = searchDuplicateEntries([indexedEntry()], {
      sourceUrl: "https://github.com/domdomegg/airtable-mcp-server/",
    });
    expect(duplicates.count).toBe(1);
    expect(duplicates.matches[0].reasons).toContain("source_url");
  });

  it("matches slug and title duplicates within a category", () => {
    expect(
      searchDuplicateEntries([indexedEntry()], {
        category: "mcp",
        slug: "airtable-mcp-server",
      }).count,
    ).toBe(1);
    expect(
      searchDuplicateEntries([indexedEntry()], {
        category: "mcp",
        title: "Airtable MCP",
      }).count,
    ).toBe(1);
  });

  it("reviews drafts and recommends duplicate review when matches exist", () => {
    expect(
      reviewSubmissionDraftFromSpec(
        submissionSpec,
        {
          fields: {
            ...validMcpFields,
            github_url: "https://github.com/domdomegg/airtable-mcp-server",
          },
        },
        [indexedEntry()],
      ),
    ).toMatchObject({
      ok: true,
      valid: true,
      recommendedAction: "review_possible_duplicate",
      duplicateReview: {
        count: expect.any(Number),
      },
    });
  });

  it("caps duplicate matches to the requested limit", () => {
    const entries = Array.from({ length: 12 }, (_, index) =>
      indexedEntry({
        slug: `server-${index}`,
        title: `Server ${index}`,
        repoUrl: `https://github.com/example/server-${index}`,
        documentationUrl: `https://github.com/example/server-${index}`,
      }),
    );
    expect(
      searchDuplicateEntries(entries, {
        category: "mcp",
        title: "missing-entry",
        limit: 3,
      }).matches,
    ).toHaveLength(0);
  });
});

describe("submissions re-export compatibility", () => {
  it("keeps the public wrapper wired to the extracted lib", () => {
    expect(slugifyFromWrapper("Example Protocol MCP")).toBe(
      slugify("Example Protocol MCP"),
    );
    expect(buildPrDraftFromWrapper(submissionSpec, validMcpFields).title).toBe(
      buildPrDraftFromSpec(submissionSpec, validMcpFields).title,
    );
  });
});
