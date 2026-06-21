import { describe, expect, it } from "vitest";

// Deep-relative test imports use the `.js` specifier across this repo's suite;
// the bundler maps it to the TypeScript source.
import { buildContentPromptReport } from "../packages/registry/src/quality.js";

const goodEntry = {
  category: "agents",
  slug: "good",
  title: "Good",
  description: "D".repeat(120),
  seoTitle: "Good SEO",
  seoDescription: "S".repeat(120),
  repoUrl: "https://github.com/a/b",
  documentationUrl: "https://docs.example",
  dateAdded: "2026-05-20",
  body: "x".repeat(220),
};

const weakEntry = (slug: string) => ({
  category: "mcp",
  slug,
  title: slug.toUpperCase(),
  description: "short",
  dateAdded: "2023-01-01",
});

describe("buildContentPromptReport", () => {
  it("emits a versioned prompt report with actionable prompt text", () => {
    const report = buildContentPromptReport([goodEntry, weakEntry("weak1")]);
    expect(report.schemaVersion).toBe(2);
    expect(report.kind).toBe("content-quality-prompts");
    expect(Array.isArray(report.prompts)).toBe(true);
    const first = report.prompts[0];
    expect(first).toMatchObject({
      key: expect.any(String),
      score: expect.any(Number),
      priority: expect.any(String),
    });
    expect(typeof first.prompt).toBe("string");
    expect(first.prompt.length).toBeGreaterThan(0);
  });

  it("prioritizes the lowest-scoring entries first", () => {
    const report = buildContentPromptReport([
      goodEntry,
      weakEntry("weak1"),
      weakEntry("weak2"),
    ]);
    // The weakest entry leads the prompt list.
    expect(report.prompts[0].category).toBe("mcp");
    expect(report.prompts[0].priority).toBe("high");
  });

  it("caps the number of prompts at the requested maximum", () => {
    const report = buildContentPromptReport(
      [goodEntry, weakEntry("weak1"), weakEntry("weak2")],
      1,
    );
    expect(report.prompts.length).toBeLessThanOrEqual(1);
  });
});
