import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  getCategorySubmissionGuidanceFromSpec,
  reviewSubmissionDraftFromSpec,
  searchDuplicateEntries,
} from "../packages/mcp/src/submissions-lib.js";
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

describe("submissions-lib duplicate search matching", () => {
  const entry = indexedEntry({
    brandDomain: "asana.com",
    githubUrl: "https://github.com/x/y",
    canonicalUrl: "https://heyclau.de/mcp/airtable",
  });

  it("matches on slug, title, brand domain, and source url", () => {
    expect(
      searchDuplicateEntries([entry], {
        category: "mcp",
        slug: "airtable-mcp-server",
      }).matches[0].reasons,
    ).toEqual(["slug"]);
    expect(
      searchDuplicateEntries([entry], {
        category: "mcp",
        title: "Airtable MCP",
      }).matches[0].reasons,
    ).toEqual(["title"]);
    expect(
      searchDuplicateEntries([entry], {
        category: "mcp",
        brandDomain: "asana.com",
      }).matches[0].reasons,
    ).toEqual(["brand_domain"]);
    expect(
      searchDuplicateEntries([entry], {
        category: "mcp",
        sourceUrls: ["https://github.com/x/y"],
      }).matches[0].reasons,
    ).toEqual(["source_url"]);
  });

  it("skips entries in other categories and reports when nothing matches", () => {
    expect(
      searchDuplicateEntries([entry], {
        category: "skills",
        slug: "airtable-mcp-server",
      }).count,
    ).toBe(0);
    expect(
      searchDuplicateEntries([entry], { category: "mcp", slug: "other" })
        .reviewNote,
    ).toMatch(/No obvious registry duplicate/);
  });
});

describe("submissions-lib review recommendations", () => {
  it("recommends opening a review PR for a clean valid draft", () => {
    expect(
      reviewSubmissionDraftFromSpec(
        submissionSpec,
        { fields: validMcpFields },
        [],
      ).recommendedAction,
    ).toBe("open_review_pr");
  });

  it("flags a possible duplicate when the index has a slug match", () => {
    expect(
      reviewSubmissionDraftFromSpec(
        submissionSpec,
        { fields: validMcpFields },
        [indexedEntry({ slug: "example-protocol-mcp" })],
      ).recommendedAction,
    ).toBe("review_possible_duplicate");
  });

  it("requires fixes when the draft fails validation", () => {
    expect(
      reviewSubmissionDraftFromSpec(
        submissionSpec,
        { fields: { category: "mcp", name: "x" } },
        [],
      ).recommendedAction,
    ).toBe("fix_required_fields");
  });
});

describe("submissions-lib category guidance", () => {
  it("returns guidance for a single category and for all categories", () => {
    expect(
      getCategorySubmissionGuidanceFromSpec(submissionSpec, { category: "mcp" })
        .categories[0].category,
    ).toBe("mcp");
    expect(
      getCategorySubmissionGuidanceFromSpec(submissionSpec, {}).categories
        .length,
    ).toBe(Object.keys(submissionSpec.categories).length);
  });

  it("returns a not-found error for an unknown guidance category", () => {
    expect(
      getCategorySubmissionGuidanceFromSpec(submissionSpec, {
        category: "nope",
      }),
    ).toMatchObject({ ok: false, error: { code: "not_found" } });
  });
});
