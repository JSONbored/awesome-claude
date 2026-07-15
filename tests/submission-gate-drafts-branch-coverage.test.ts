import { describe, expect, it } from "vitest";

import {
  buildContributorMdx,
  buildDraftTarget,
  draftFieldsFromBody,
  normalizeCategory,
  slugify,
} from "../apps/submission-gate/src/drafts";

describe("submission-gate drafts branch coverage", () => {
  it("rejects unsupported categories and empty slugs when building draft targets", () => {
    expect(normalizeCategory("Unknown Category")).toBe("");
    expect(() =>
      buildDraftTarget({ category: "unknown", name: "Fixture" }, "main"),
    ).toThrow("supported category and slug");
    expect(() =>
      buildDraftTarget({ category: "skills", name: "   " }, "main"),
    ).toThrow("supported category and slug");
  });

  it("derives slugs from nested draft payloads and strips unsupported bodies", () => {
    expect(draftFieldsFromBody(["not", "a", "record"])).toEqual({});
    expect(
      draftFieldsFromBody({
        fields: { category: "hooks", title: "Hook Draft" },
      }),
    ).toEqual({ category: "hooks", title: "Hook Draft" });
    expect(slugify('  "Branch" Draft!  ')).toBe("branch-draft");
  });

  it("hashes overlong branch names while preserving the full target slug", () => {
    const longSlug = "x".repeat(120);
    const target = buildDraftTarget(
      { category: "skills", slug: longSlug },
      "main",
    );
    expect(target.slug).toBe(longSlug);
    expect(target.branchName.length).toBeLessThanOrEqual(120);
    expect(target.branchName).toMatch(/-[a-z0-9]{8}$/);
    expect(target.targetPath).toBe(`content/skills/${longSlug}.mdx`);
  });

  it("renders multiline yaml scalars, truncated one-line fields, and optional metadata", () => {
    const longDescription = `${"word ".repeat(80).trim()} trailing`;
    const mdx = buildContributorMdx(
      {
        category: "skills",
        name: "Branch Coverage Skill",
        slug: "branch-coverage-skill",
        description: longDescription,
        card_description: "Short card copy",
        safety_notes: "Line one\nLine two",
        privacy_notes: "Local only",
        prerequisites: "Node 22\npnpm installed",
        retrieval_sources: "Docs\nGitHub README",
        tested_platforms: "Claude Code\nCursor",
        items: "Item one\nItem two",
        brand_name: "Fixture Brand",
        brand_domain: "fixture.example",
        github_url: "https://github.com/example/repo",
        website_url: "https://example.com",
        download_url: "https://example.com/pkg.zip",
        install_command: "npm i fixture",
        usage_snippet: "Run locally",
        config_snippet: '{ "enabled": true }',
        full_copyable_content: "Step one\nStep two",
        command_syntax: "/fixture run",
        trigger: "manual",
        script_language: "bash",
        skill_type: "workflow",
        skill_level: "intermediate",
        verification_status: "reviewed",
        verified_at: "2026-01-01",
        pricing_model: "free",
        disclosure: "Maintainer-owned fixture",
        tags: "testing, coverage",
      },
      "not-a-valid-login!",
    );

    expect(mdx).toContain("cardDescription:");
    expect(mdx).toContain("brandName:");
    expect(mdx).toContain("repoUrl:");
    expect(mdx).toContain("prerequisites:");
    expect(mdx).toContain("retrievalSources:");
    expect(mdx).toContain("testedPlatforms:");
    expect(mdx).toContain("items:");
    expect(mdx).toContain("copySnippet:");
    expect(mdx).toContain('submittedBy: "website"');
    expect(mdx).not.toContain("authorProfileUrl:");
    expect(mdx).toContain("Line one");
    expect(mdx).toContain("Step one");
    expect(mdx).toContain("...");
  });

  it("uses contributor profile metadata when the github login is valid", () => {
    const mdx = buildContributorMdx(
      {
        category: "mcp",
        name: "Contributor MCP",
        description: "Source-backed MCP fixture.",
        docs_url: "https://example.com/docs",
        safety_notes: "Review network access.",
        privacy_notes: "No telemetry.",
      },
      "valid-contributor",
    );

    expect(mdx).toContain('submittedBy: "@valid-contributor"');
    expect(mdx).toContain(
      'authorProfileUrl: "https://github.com/valid-contributor"',
    );
    expect(mdx).toContain('documentationUrl: "https://example.com/docs"');
  });
});
