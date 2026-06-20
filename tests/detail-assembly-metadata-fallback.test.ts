import { describe, expect, it } from "vitest";

import { getMetadataFallback } from "@/lib/detail-assembly";
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

describe("getMetadataFallback", () => {
  it("gives hook-specific guidance and references the trigger when set", () => {
    const fallback = getMetadataFallback(
      entry({ category: "hooks", trigger: "PreToolUse" }),
    );
    expect(fallback.title).toBe("How to use this hook");
    expect(fallback.points[0]).toContain("PreToolUse");
  });

  it("gives collection-specific guidance for collections", () => {
    expect(getMetadataFallback(entry({ category: "collections" })).title).toBe(
      "How to use this collection",
    );
  });

  it("points at the docs link when an entry has documentation", () => {
    const fallback = getMetadataFallback(
      entry({ category: "agents", documentationUrl: "https://docs.example" }),
    );
    expect(fallback.title).toBe("How to use this entry");
    expect(fallback.points[0].toLowerCase()).toContain("documentation");
  });

  it("falls back to generic GitHub-source guidance with no doc/repo links", () => {
    const fallback = getMetadataFallback(entry({ category: "agents" }));
    expect(fallback.title).toBe("How to use this entry");
    expect(fallback.points[0]).toContain("GitHub source");
  });
});
