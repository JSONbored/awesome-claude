import { describe, expect, it } from "vitest";

import { getPrimarySnippet } from "@/lib/detail-assembly";
import type { ContentEntry } from "@heyclaude/registry";

function entry(overrides: Partial<ContentEntry>): ContentEntry {
  return {
    category: "agents",
    slug: "s",
    title: "t",
    description: "d",
    tags: [],
    keywords: [],
    body: "",
    sections: [],
    headings: [],
    codeBlocks: [],
    ...overrides,
  } as ContentEntry;
}

describe("getPrimarySnippet", () => {
  it("treats agents/rules as a copyable markdown asset sourced from the body", () => {
    expect(
      getPrimarySnippet(entry({ category: "agents", body: "BODY" })),
    ).toEqual({ title: "Copyable asset", code: "BODY", language: "md" });
  });

  it("prefers the JSON config snippet for hooks", () => {
    expect(
      getPrimarySnippet(entry({ category: "hooks", configSnippet: "{}" })),
    ).toEqual({ title: "Claude config", code: "{}", language: "json" });
  });

  it("labels an install command for mcp/skills/commands", () => {
    expect(
      getPrimarySnippet(entry({ category: "mcp", installCommand: "npx x" })),
    ).toEqual({ title: "Install command", code: "npx x", language: "text" });
  });

  it("summarizes guides from the usage snippet", () => {
    expect(
      getPrimarySnippet(entry({ category: "guides", usageSnippet: "US" })),
    ).toEqual({ title: "Quick summary", code: "US", language: "text" });
  });

  it("falls back to a copyable/usage asset for unknown categories", () => {
    const snippet = getPrimarySnippet(
      entry({
        category: "tools" as ContentEntry["category"],
        copySnippet: "CS",
      }),
    );
    expect(snippet.title).toBe("Copyable asset");
    expect(snippet.code).toBe("CS");
  });
});
