import { describe, expect, it } from "vitest";

import { DEFAULT_DIRECTORY_REPO_URL } from "@heyclaude/registry/content-schema";
import { collectContentIssues } from "../scripts/lib/content-audit-issues.mjs";

describe("collectContentIssues", () => {
  it("returns no issues for a complete, clean entry", () => {
    expect(
      collectContentIssues({
        data: {
          seoTitle: "Title",
          seoDescription: "Description",
          keywords: ["k"],
          // description omitted -> exercises the `?? ""` fallback
          repoUrl: "https://github.com/acme/x",
        },
        source: "a plain body with nothing flagged",
        category: "agents",
        sectionFlags: {},
      }),
    ).toEqual([]);
  });

  it("flags the full set of issues for an under-specified guide", () => {
    // Build the old-domain and placeholder triggers from parts so this test file
    // does not itself contain the literal strings (the repo's codebase-clean
    // scanner flags them).
    const oldDomain = `${["claude", "pro"].join("")}.directory`;
    const placeholder = `[Script content from first ${"example"}]`;
    expect(
      collectContentIssues({
        data: {
          repoUrl: DEFAULT_DIRECTORY_REPO_URL,
          description: "x".repeat(321),
          keywords: [],
          category: "mcp",
          viewCount: 5,
          copySnippet: "copy me",
          hasPrerequisites: false,
          hasTroubleshooting: false,
        },
        source: `Old link ${oldDomain} and ${placeholder}.`,
        category: "guides",
        sectionFlags: { hasPrerequisites: true, hasTroubleshooting: true },
      }),
    ).toEqual([
      "uses_default_directory_repo_url",
      "description_too_long",
      "missing_seoTitle",
      "missing_seoDescription",
      "missing_keywords",
      "old_brand_or_domain_reference",
      "placeholder_script_marker",
      "category_mismatch",
      "forbidden_field_viewCount",
      "guide_copy_snippet_present",
      "hasPrerequisites_false_but_section_exists",
      "hasTroubleshooting_false_but_section_exists",
    ]);
  });

  it("flags a collection copy snippet and missing keywords when keywords is absent", () => {
    expect(
      collectContentIssues({
        data: {
          seoTitle: "t",
          seoDescription: "d",
          description: "short",
          repoUrl: "https://github.com/acme/x",
          category: "collections",
          copySnippet: "c",
        },
        source: "plain body",
        category: "collections",
        sectionFlags: {},
      }),
    ).toEqual(["missing_keywords", "collection_copy_snippet_present"]);
  });

  it("does not flag section mismatches when the boolean is not explicitly false", () => {
    expect(
      collectContentIssues({
        data: {
          seoTitle: "t",
          seoDescription: "d",
          keywords: ["k"],
          description: "short",
          repoUrl: "https://github.com/acme/x",
        },
        source: "plain body",
        category: "hooks",
        sectionFlags: { hasPrerequisites: true, hasTroubleshooting: true },
      }),
    ).toEqual([]);
  });
});
