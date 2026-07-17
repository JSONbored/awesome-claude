import { describe, expect, it } from "vitest";

import {
  extractContentDuplicateSignals,
  parseSimpleFrontmatter,
  protectedFrontmatterChanges,
} from "../apps/submission-gate/src/duplicates";

function withFrontmatter(body: string) {
  return `---\n${body}\n---\n\nbody text\n`;
}

describe("submission-gate parseSimpleFrontmatter", () => {
  it("coerces non-string scalars and skips empty values", () => {
    expect(
      parseSimpleFrontmatter(
        withFrontmatter(
          [
            'title: "My Tool"',
            "count: 5",
            "flag: true",
            "empty:",
            "slug: my-tool",
          ].join("\n"),
        ),
      ),
    ).toEqual({
      title: "My Tool",
      count: "5",
      flag: "true",
      slug: "my-tool",
    });
  });

  it("returns no fields when there is no frontmatter", () => {
    expect(parseSimpleFrontmatter("no frontmatter here")).toEqual({});
  });
});

describe("submission-gate protectedFrontmatterChanges", () => {
  it("reports protected fields that changed", () => {
    expect(
      protectedFrontmatterChanges(
        withFrontmatter("slug: a\ncategory: mcp"),
        withFrontmatter("slug: b\ncategory: mcp"),
      ),
    ).toEqual(["slug"]);
  });

  it("reports nothing when protected fields are unchanged", () => {
    expect(
      protectedFrontmatterChanges(
        withFrontmatter("slug: a"),
        withFrontmatter("slug: a"),
      ),
    ).toEqual([]);
  });
});

describe("submission-gate extractContentDuplicateSignals", () => {
  const content = [
    "---",
    'title: "My Tool"',
    "category: mcp",
    "slug: my-tool",
    "sourceUrls:",
    '  - "https://WWW.Example.com/a?utm_source=x#frag"',
    "  - 'ftp://bad.example.com/x'",
    "  -",
    "documentationUrl: https://user:pw@Example.com/docs/",
    "---",
    "",
    "body",
  ].join("\n");

  it("normalizes scalar and list url fields into a deduped set", () => {
    const signals = extractContentDuplicateSignals({
      filePath: "content/mcp/my-tool.md",
      content,
    });
    expect(signals.urls).toEqual([
      "https://example.com/a",
      "https://example.com/docs",
    ]);
  });

  it("drops non-http protocols and blank list items", () => {
    const signals = extractContentDuplicateSignals({
      filePath: "content/mcp/my-tool.md",
      content,
    });
    expect(signals.urls.some((url) => url.startsWith("ftp:"))).toBe(false);
    expect(signals.urls).toHaveLength(2);
  });

  it("derives deduped domains and frontmatter identity", () => {
    const signals = extractContentDuplicateSignals({
      filePath: "content/mcp/my-tool.md",
      content,
    });
    expect(signals.domains).toEqual(["example.com"]);
    expect(signals.category).toBe("mcp");
    expect(signals.slug).toBe("my-tool");
    expect(signals.normalizedTitle).toBe("my tool");
  });
});
