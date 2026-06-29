import { describe, expect, it } from "vitest";

import { formatCompareMarkdown } from "../apps/web/src/lib/compare-markdown";
import type { Entry } from "../apps/web/src/types/registry";

function entry(overrides: Partial<Entry>): Entry {
  return {
    category: "mcp",
    slug: "example",
    title: "Example MCP",
    description: "Example MCP server for testing.",
    author: "Example Author",
    tags: [],
    platforms: ["claude-code"],
    installType: "npm",
    trust: "review",
    source: "source-backed",
    dateAdded: "2026-01-01",
    ...overrides,
  };
}

describe("formatCompareMarkdown", () => {
  it("returns an empty string when there is nothing to compare", () => {
    expect(formatCompareMarkdown([])).toBe("");
  });

  it("renders a markdown table with shared fields and entry descriptions", () => {
    const markdown = formatCompareMarkdown([
      entry({
        slug: "alpha",
        title: "Alpha MCP",
        description: "First comparison entry.",
        installCommand: "npx alpha-mcp@1.0.0",
        safetyNotes: "Runs shell commands.",
      }),
      entry({
        slug: "beta",
        title: "Beta MCP",
        description: "Second comparison entry.",
        configSnippet: '{"mcpServers":{"beta":{"command":"beta"}}}',
        privacyNotes: "Reads local files.",
      }),
    ]);

    expect(markdown).toContain("# HeyClaude resource comparison");
    expect(markdown).toContain("| Field | Alpha MCP | Beta MCP |");
    expect(markdown).toContain("| Trust | review | review |");
    expect(markdown).toContain("| Install | npx alpha-mcp@1.0.0 | — |");
    expect(markdown).toContain(
      '| Config | — | {"mcpServers":{"beta":{"command":"beta"}}} |',
    );
    expect(markdown).toContain("### Alpha MCP");
    expect(markdown).toContain("First comparison entry.");
    expect(markdown).toContain("### Beta MCP");
    expect(markdown).toContain("Second comparison entry.");
    expect(markdown).toContain("https://heyclau.de/entry/mcp/alpha");
    expect(markdown).toContain("https://heyclau.de/entry/mcp/beta");
  });

  it("escapes pipe characters inside table cells", () => {
    const markdown = formatCompareMarkdown([
      entry({
        title: "Pipe | Title",
        safetyNotes: "Uses a | separator in docs.",
      }),
    ]);

    expect(markdown).toContain("Pipe \\| Title");
    expect(markdown).toContain("Uses a \\| separator in docs.");
  });
});
