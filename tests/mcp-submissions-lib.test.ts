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

  it("accepts retrieval_sources pasted as a markdown bullet list", () => {
    const baseSkill = {
      category: "skills",
      name: "Capability Pack",
      description:
        "Capability pack skill used to validate retrieval source formatting during review.",
      github_url: "https://github.com/example/repo/tree/main/skills/demo",
      usage_snippet: "Use this capability pack during code review workflows.",
      skill_type: "capability-pack",
      skill_level: "expert",
      verified_at: "2026-01-01",
      safety_notes: "Runs user-configured scripts in the local workspace.",
      privacy_notes:
        "Does not persist user data outside the configured workspace.",
    };

    const bulletResult = validateSubmissionDraftFromSpec(submissionSpec, {
      fields: {
        ...baseSkill,
        retrieval_sources:
          "- https://example.com/docs\n- https://docs.foo.com/guide",
      },
    });
    expect(bulletResult.errors.join("\n")).not.toContain(
      "retrieval_sources must use https URLs",
    );

    // A genuinely non-https source is still rejected, marker or not.
    const insecureResult = validateSubmissionDraftFromSpec(submissionSpec, {
      fields: { ...baseSkill, retrieval_sources: "- http://insecure.example" },
    });
    expect(insecureResult.errors.join("\n")).toContain(
      "retrieval_sources must use https URLs: http://insecure.example",
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

  it("matches duplicates when the indexed category casing differs", () => {
    expect(
      searchDuplicateEntries([indexedEntry({ category: "MCP" })], {
        category: "mcp",
        slug: "airtable-mcp-server",
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

describe("submissions-lib normalizeSubmissionFields derivations", () => {
  it("derives name from title and slug from name", () => {
    const normalized = normalizeSubmissionFields({
      title: "My Cool Tool",
      description: "A helpful thing for testing.",
    });
    expect(normalized.name).toBe("My Cool Tool");
    expect(normalized.slug).toBe("my-cool-tool");
    expect(normalized.card_description).toBe("A helpful thing for testing.");
  });

  it("normalizes a brand domain and routes non-parseable source urls to docs", () => {
    expect(
      normalizeSubmissionFields({
        name: "X",
        slug: "x",
        brand_domain: "https://www.Asana.com/teams",
      }).brand_domain,
    ).toBe("asana.com");
    expect(
      normalizeSubmissionFields({
        name: "X",
        slug: "x",
        source_url: "not a url",
      }).docs_url,
    ).toBe("not a url");
  });

  it("truncates over-long card descriptions and joins tag arrays", () => {
    const long = normalizeSubmissionFields({
      name: "X",
      slug: "x",
      description: "word ".repeat(60),
    });
    expect(long.card_description.endsWith("...")).toBe(true);
    expect(long.card_description.length).toBeLessThanOrEqual(140);
    expect(
      normalizeSubmissionFields({ name: "X", slug: "x", tags: ["a", "b"] })
        .tags,
    ).toBe("a, b");
  });

  it("skips null/undefined fields during normalization", () => {
    const normalized = normalizeSubmissionFields({
      name: null,
      extra: undefined,
      title: "T",
    });
    expect(normalized.name).toBe("T");
    expect("extra" in normalized).toBe(false);
  });
});

describe("submissions-lib slugify character handling", () => {
  it("drops quotes, keeps digits, and collapses separators", () => {
    expect(slugify("Don't Stop")).toBe("dont-stop");
    expect(slugify('Say "Hi"')).toBe("say-hi");
    expect(slugify("Tool 2 v3")).toBe("tool-2-v3");
    expect(slugify("hello!!!")).toBe("hello");
    expect(slugify("")).toBe("");
  });
});

describe("submissions-lib example generation across categories", () => {
  it("builds field examples for every submission category", () => {
    for (const category of Object.keys(submissionSpec.categories)) {
      const result = getSubmissionExamplesFromSpec(submissionSpec, {
        category,
      });
      expect(result.ok).toBe(true);
      expect(result.categories).toHaveLength(1);
      const example = result.categories[0];
      expect(example.category).toBe(category);
      expect(Object.keys(example.completeFields).length).toBeGreaterThan(0);
      expect(example.completeFields.category).toBe(category);
    }
  });

  it("lists every category when none is requested", () => {
    const result = getSubmissionExamplesFromSpec(submissionSpec, {});
    expect(result.ok).toBe(true);
    expect(result.categories.length).toBe(
      Object.keys(submissionSpec.categories).length,
    );
  });

  it("returns a not-found error for an unknown example category", () => {
    expect(
      getSubmissionExamplesFromSpec(submissionSpec, { category: "nope" }),
    ).toMatchObject({ ok: false, error: { code: "not_found" } });
  });
});

describe("submissions-lib validate envelope for unsupported category", () => {
  it("nulls the pr preview and blanks required fields when no category is given", () => {
    const result = validateSubmissionDraftFromSpec(submissionSpec, {
      fields: { name: "No Category" },
    });
    expect(result.valid).toBe(false);
    expect(result.category).toBe("");
    expect(result.prPreview).toBeNull();
    expect(result.slug).toBe("no-category");
    expect(result.requiredFields).toEqual([]);
    expect(result.nextSteps).toEqual([
      "Fix validation errors before opening a public submission PR.",
    ]);
  });
});
