import { describe, expect, it } from "vitest";

import { extractContentDuplicateSignals } from "../apps/submission-gate/src/duplicates";

function withFrontmatter(body: string) {
  return `---\n${body}\n---\n\nbody text\n`;
}

describe("submission-gate normalizeUrl tracking-param and edge-case handling", () => {
  it("strips non-utm tracking params (ref, campaign, etc.) while keeping other query params", () => {
    const signals = extractContentDuplicateSignals({
      filePath: "content/mcp/tracked.mdx",
      content: withFrontmatter(
        "sourceUrl: https://example.com/x?ref=newsletter&campaign=launch&keep=1",
      ),
    });
    expect(signals.urls).toEqual(["https://example.com/x?keep=1"]);
  });

  it("treats a blank url field as absent instead of an empty-string url", () => {
    const signals = extractContentDuplicateSignals({
      filePath: "content/mcp/blank.mdx",
      content: withFrontmatter(
        'sourceUrl: ""\ngithubUrl: https://github.com/example/repo',
      ),
    });
    expect(signals.urls).toEqual(["https://github.com/example/repo"]);
  });

  it("normalizes a github.com URL with an owner but no repository segment without collapsing it", () => {
    const signals = extractContentDuplicateSignals({
      filePath: "content/mcp/owner-only.mdx",
      content: withFrontmatter("githubUrl: https://github.com/justanowner"),
    });
    expect(signals.urls).toEqual(["https://github.com/justanowner"]);
  });
});

describe("submission-gate duplicate-signals list-field parsing", () => {
  it("ignores a top-level list field that isn't a tracked URL field", () => {
    const signals = extractContentDuplicateSignals({
      filePath: "content/mcp/tags-list.mdx",
      content: withFrontmatter(
        [
          "tags:",
          "  - not-a-source-url",
          "  - also-not-a-url",
          "documentationUrl: https://gitlab.com/example/docs",
        ].join("\n"),
      ),
    });
    expect(signals.urls).toEqual(["https://gitlab.com/example/docs"]);
  });

  it("skips a malformed indented continuation line without losing the active list field", () => {
    const signals = extractContentDuplicateSignals({
      filePath: "content/mcp/malformed-continuation.mdx",
      content: withFrontmatter(
        [
          "sourceUrls:",
          "  - https://github.com/example/repo",
          "  this line is indented but is not a list item",
          "  - https://gitlab.com/example/repo",
        ].join("\n"),
      ),
    });
    expect(signals.urls).toEqual([
      "https://github.com/example/repo",
      "https://gitlab.com/example/repo",
    ]);
  });
});
