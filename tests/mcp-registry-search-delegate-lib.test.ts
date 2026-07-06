import { describe, expect, it } from "vitest";

import {
  entryMatchesPlatform,
  entryMatchesQuery,
  entrySearchText,
  rankSearchEntries,
  searchTokens,
} from "../packages/mcp/src/registry-search-delegate-lib.js";

function makeEntry(overrides = {}) {
  return {
    category: "mcp",
    slug: "browser-bridge",
    title: "Browser Bridge",
    description: "Playwright automation bridge",
    tags: ["browser-automation"],
    platforms: ["claude-code"],
    ...overrides,
  };
}

describe("registry-search-delegate-lib searchTokens", () => {
  it("tokenizes query strings", () => {
    expect(searchTokens("browser bridge")).toEqual(["browser", "bridge"]);
  });
  it("searchTokens matrix 0", () => {
    const tokens = searchTokens("query-0 token-0");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 1", () => {
    const tokens = searchTokens("query-1 token-1");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 2", () => {
    const tokens = searchTokens("query-2 token-2");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 3", () => {
    const tokens = searchTokens("query-3 token-3");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 4", () => {
    const tokens = searchTokens("query-4 token-4");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 5", () => {
    const tokens = searchTokens("query-5 token-5");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 6", () => {
    const tokens = searchTokens("query-6 token-6");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 7", () => {
    const tokens = searchTokens("query-7 token-0");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 8", () => {
    const tokens = searchTokens("query-8 token-1");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 9", () => {
    const tokens = searchTokens("query-9 token-2");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 10", () => {
    const tokens = searchTokens("query-10 token-3");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 11", () => {
    const tokens = searchTokens("query-11 token-4");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 12", () => {
    const tokens = searchTokens("query-12 token-5");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 13", () => {
    const tokens = searchTokens("query-13 token-6");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 14", () => {
    const tokens = searchTokens("query-14 token-0");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 15", () => {
    const tokens = searchTokens("query-15 token-1");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 16", () => {
    const tokens = searchTokens("query-16 token-2");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 17", () => {
    const tokens = searchTokens("query-17 token-3");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 18", () => {
    const tokens = searchTokens("query-18 token-4");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 19", () => {
    const tokens = searchTokens("query-19 token-5");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 20", () => {
    const tokens = searchTokens("query-20 token-6");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 21", () => {
    const tokens = searchTokens("query-21 token-0");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 22", () => {
    const tokens = searchTokens("query-22 token-1");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 23", () => {
    const tokens = searchTokens("query-23 token-2");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 24", () => {
    const tokens = searchTokens("query-24 token-3");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 25", () => {
    const tokens = searchTokens("query-25 token-4");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 26", () => {
    const tokens = searchTokens("query-26 token-5");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 27", () => {
    const tokens = searchTokens("query-27 token-6");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 28", () => {
    const tokens = searchTokens("query-28 token-0");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 29", () => {
    const tokens = searchTokens("query-29 token-1");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 30", () => {
    const tokens = searchTokens("query-30 token-2");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 31", () => {
    const tokens = searchTokens("query-31 token-3");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 32", () => {
    const tokens = searchTokens("query-32 token-4");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 33", () => {
    const tokens = searchTokens("query-33 token-5");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 34", () => {
    const tokens = searchTokens("query-34 token-6");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 35", () => {
    const tokens = searchTokens("query-35 token-0");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 36", () => {
    const tokens = searchTokens("query-36 token-1");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 37", () => {
    const tokens = searchTokens("query-37 token-2");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 38", () => {
    const tokens = searchTokens("query-38 token-3");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 39", () => {
    const tokens = searchTokens("query-39 token-4");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 40", () => {
    const tokens = searchTokens("query-40 token-5");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 41", () => {
    const tokens = searchTokens("query-41 token-6");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 42", () => {
    const tokens = searchTokens("query-42 token-0");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 43", () => {
    const tokens = searchTokens("query-43 token-1");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 44", () => {
    const tokens = searchTokens("query-44 token-2");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 45", () => {
    const tokens = searchTokens("query-45 token-3");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 46", () => {
    const tokens = searchTokens("query-46 token-4");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 47", () => {
    const tokens = searchTokens("query-47 token-5");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 48", () => {
    const tokens = searchTokens("query-48 token-6");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 49", () => {
    const tokens = searchTokens("query-49 token-0");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 50", () => {
    const tokens = searchTokens("query-50 token-1");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 51", () => {
    const tokens = searchTokens("query-51 token-2");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 52", () => {
    const tokens = searchTokens("query-52 token-3");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 53", () => {
    const tokens = searchTokens("query-53 token-4");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 54", () => {
    const tokens = searchTokens("query-54 token-5");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 55", () => {
    const tokens = searchTokens("query-55 token-6");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 56", () => {
    const tokens = searchTokens("query-56 token-0");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 57", () => {
    const tokens = searchTokens("query-57 token-1");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 58", () => {
    const tokens = searchTokens("query-58 token-2");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 59", () => {
    const tokens = searchTokens("query-59 token-3");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 60", () => {
    const tokens = searchTokens("query-60 token-4");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 61", () => {
    const tokens = searchTokens("query-61 token-5");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 62", () => {
    const tokens = searchTokens("query-62 token-6");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 63", () => {
    const tokens = searchTokens("query-63 token-0");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 64", () => {
    const tokens = searchTokens("query-64 token-1");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 65", () => {
    const tokens = searchTokens("query-65 token-2");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 66", () => {
    const tokens = searchTokens("query-66 token-3");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 67", () => {
    const tokens = searchTokens("query-67 token-4");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 68", () => {
    const tokens = searchTokens("query-68 token-5");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 69", () => {
    const tokens = searchTokens("query-69 token-6");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 70", () => {
    const tokens = searchTokens("query-70 token-0");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 71", () => {
    const tokens = searchTokens("query-71 token-1");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 72", () => {
    const tokens = searchTokens("query-72 token-2");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 73", () => {
    const tokens = searchTokens("query-73 token-3");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 74", () => {
    const tokens = searchTokens("query-74 token-4");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 75", () => {
    const tokens = searchTokens("query-75 token-5");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 76", () => {
    const tokens = searchTokens("query-76 token-6");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 77", () => {
    const tokens = searchTokens("query-77 token-0");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 78", () => {
    const tokens = searchTokens("query-78 token-1");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
  it("searchTokens matrix 79", () => {
    const tokens = searchTokens("query-79 token-2");
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens.length).toBeGreaterThan(0);
  });
});

describe("registry-search-delegate-lib entrySearchText", () => {
  it("normalizes searchable text", () => {
    const text = entrySearchText(makeEntry());
    expect(text).toContain("browser bridge");
  });
  it("entrySearchText agents 0", () => {
    const text = entrySearchText(
      makeEntry({
        category: "agents",
        slug: "agents-0",
        title: "agents Title 0",
      }),
    );
    expect(text).toContain("agents");
  });
  it("entrySearchText agents 1", () => {
    const text = entrySearchText(
      makeEntry({
        category: "agents",
        slug: "agents-1",
        title: "agents Title 1",
      }),
    );
    expect(text).toContain("agents");
  });
  it("entrySearchText agents 2", () => {
    const text = entrySearchText(
      makeEntry({
        category: "agents",
        slug: "agents-2",
        title: "agents Title 2",
      }),
    );
    expect(text).toContain("agents");
  });
  it("entrySearchText agents 3", () => {
    const text = entrySearchText(
      makeEntry({
        category: "agents",
        slug: "agents-3",
        title: "agents Title 3",
      }),
    );
    expect(text).toContain("agents");
  });
  it("entrySearchText agents 4", () => {
    const text = entrySearchText(
      makeEntry({
        category: "agents",
        slug: "agents-4",
        title: "agents Title 4",
      }),
    );
    expect(text).toContain("agents");
  });
  it("entrySearchText agents 5", () => {
    const text = entrySearchText(
      makeEntry({
        category: "agents",
        slug: "agents-5",
        title: "agents Title 5",
      }),
    );
    expect(text).toContain("agents");
  });
  it("entrySearchText agents 6", () => {
    const text = entrySearchText(
      makeEntry({
        category: "agents",
        slug: "agents-6",
        title: "agents Title 6",
      }),
    );
    expect(text).toContain("agents");
  });
  it("entrySearchText agents 7", () => {
    const text = entrySearchText(
      makeEntry({
        category: "agents",
        slug: "agents-7",
        title: "agents Title 7",
      }),
    );
    expect(text).toContain("agents");
  });
  it("entrySearchText mcp 0", () => {
    const text = entrySearchText(
      makeEntry({ category: "mcp", slug: "mcp-0", title: "mcp Title 0" }),
    );
    expect(text).toContain("mcp");
  });
  it("entrySearchText mcp 1", () => {
    const text = entrySearchText(
      makeEntry({ category: "mcp", slug: "mcp-1", title: "mcp Title 1" }),
    );
    expect(text).toContain("mcp");
  });
  it("entrySearchText mcp 2", () => {
    const text = entrySearchText(
      makeEntry({ category: "mcp", slug: "mcp-2", title: "mcp Title 2" }),
    );
    expect(text).toContain("mcp");
  });
  it("entrySearchText mcp 3", () => {
    const text = entrySearchText(
      makeEntry({ category: "mcp", slug: "mcp-3", title: "mcp Title 3" }),
    );
    expect(text).toContain("mcp");
  });
  it("entrySearchText mcp 4", () => {
    const text = entrySearchText(
      makeEntry({ category: "mcp", slug: "mcp-4", title: "mcp Title 4" }),
    );
    expect(text).toContain("mcp");
  });
  it("entrySearchText mcp 5", () => {
    const text = entrySearchText(
      makeEntry({ category: "mcp", slug: "mcp-5", title: "mcp Title 5" }),
    );
    expect(text).toContain("mcp");
  });
  it("entrySearchText mcp 6", () => {
    const text = entrySearchText(
      makeEntry({ category: "mcp", slug: "mcp-6", title: "mcp Title 6" }),
    );
    expect(text).toContain("mcp");
  });
  it("entrySearchText mcp 7", () => {
    const text = entrySearchText(
      makeEntry({ category: "mcp", slug: "mcp-7", title: "mcp Title 7" }),
    );
    expect(text).toContain("mcp");
  });
  it("entrySearchText tools 0", () => {
    const text = entrySearchText(
      makeEntry({ category: "tools", slug: "tools-0", title: "tools Title 0" }),
    );
    expect(text).toContain("tools");
  });
  it("entrySearchText tools 1", () => {
    const text = entrySearchText(
      makeEntry({ category: "tools", slug: "tools-1", title: "tools Title 1" }),
    );
    expect(text).toContain("tools");
  });
  it("entrySearchText tools 2", () => {
    const text = entrySearchText(
      makeEntry({ category: "tools", slug: "tools-2", title: "tools Title 2" }),
    );
    expect(text).toContain("tools");
  });
  it("entrySearchText tools 3", () => {
    const text = entrySearchText(
      makeEntry({ category: "tools", slug: "tools-3", title: "tools Title 3" }),
    );
    expect(text).toContain("tools");
  });
  it("entrySearchText tools 4", () => {
    const text = entrySearchText(
      makeEntry({ category: "tools", slug: "tools-4", title: "tools Title 4" }),
    );
    expect(text).toContain("tools");
  });
  it("entrySearchText tools 5", () => {
    const text = entrySearchText(
      makeEntry({ category: "tools", slug: "tools-5", title: "tools Title 5" }),
    );
    expect(text).toContain("tools");
  });
  it("entrySearchText tools 6", () => {
    const text = entrySearchText(
      makeEntry({ category: "tools", slug: "tools-6", title: "tools Title 6" }),
    );
    expect(text).toContain("tools");
  });
  it("entrySearchText tools 7", () => {
    const text = entrySearchText(
      makeEntry({ category: "tools", slug: "tools-7", title: "tools Title 7" }),
    );
    expect(text).toContain("tools");
  });
  it("entrySearchText skills 0", () => {
    const text = entrySearchText(
      makeEntry({
        category: "skills",
        slug: "skills-0",
        title: "skills Title 0",
      }),
    );
    expect(text).toContain("skills");
  });
  it("entrySearchText skills 1", () => {
    const text = entrySearchText(
      makeEntry({
        category: "skills",
        slug: "skills-1",
        title: "skills Title 1",
      }),
    );
    expect(text).toContain("skills");
  });
  it("entrySearchText skills 2", () => {
    const text = entrySearchText(
      makeEntry({
        category: "skills",
        slug: "skills-2",
        title: "skills Title 2",
      }),
    );
    expect(text).toContain("skills");
  });
  it("entrySearchText skills 3", () => {
    const text = entrySearchText(
      makeEntry({
        category: "skills",
        slug: "skills-3",
        title: "skills Title 3",
      }),
    );
    expect(text).toContain("skills");
  });
  it("entrySearchText skills 4", () => {
    const text = entrySearchText(
      makeEntry({
        category: "skills",
        slug: "skills-4",
        title: "skills Title 4",
      }),
    );
    expect(text).toContain("skills");
  });
  it("entrySearchText skills 5", () => {
    const text = entrySearchText(
      makeEntry({
        category: "skills",
        slug: "skills-5",
        title: "skills Title 5",
      }),
    );
    expect(text).toContain("skills");
  });
  it("entrySearchText skills 6", () => {
    const text = entrySearchText(
      makeEntry({
        category: "skills",
        slug: "skills-6",
        title: "skills Title 6",
      }),
    );
    expect(text).toContain("skills");
  });
  it("entrySearchText skills 7", () => {
    const text = entrySearchText(
      makeEntry({
        category: "skills",
        slug: "skills-7",
        title: "skills Title 7",
      }),
    );
    expect(text).toContain("skills");
  });
  it("entrySearchText rules 0", () => {
    const text = entrySearchText(
      makeEntry({ category: "rules", slug: "rules-0", title: "rules Title 0" }),
    );
    expect(text).toContain("rules");
  });
  it("entrySearchText rules 1", () => {
    const text = entrySearchText(
      makeEntry({ category: "rules", slug: "rules-1", title: "rules Title 1" }),
    );
    expect(text).toContain("rules");
  });
  it("entrySearchText rules 2", () => {
    const text = entrySearchText(
      makeEntry({ category: "rules", slug: "rules-2", title: "rules Title 2" }),
    );
    expect(text).toContain("rules");
  });
  it("entrySearchText rules 3", () => {
    const text = entrySearchText(
      makeEntry({ category: "rules", slug: "rules-3", title: "rules Title 3" }),
    );
    expect(text).toContain("rules");
  });
  it("entrySearchText rules 4", () => {
    const text = entrySearchText(
      makeEntry({ category: "rules", slug: "rules-4", title: "rules Title 4" }),
    );
    expect(text).toContain("rules");
  });
  it("entrySearchText rules 5", () => {
    const text = entrySearchText(
      makeEntry({ category: "rules", slug: "rules-5", title: "rules Title 5" }),
    );
    expect(text).toContain("rules");
  });
  it("entrySearchText rules 6", () => {
    const text = entrySearchText(
      makeEntry({ category: "rules", slug: "rules-6", title: "rules Title 6" }),
    );
    expect(text).toContain("rules");
  });
  it("entrySearchText rules 7", () => {
    const text = entrySearchText(
      makeEntry({ category: "rules", slug: "rules-7", title: "rules Title 7" }),
    );
    expect(text).toContain("rules");
  });
  it("entrySearchText commands 0", () => {
    const text = entrySearchText(
      makeEntry({
        category: "commands",
        slug: "commands-0",
        title: "commands Title 0",
      }),
    );
    expect(text).toContain("commands");
  });
  it("entrySearchText commands 1", () => {
    const text = entrySearchText(
      makeEntry({
        category: "commands",
        slug: "commands-1",
        title: "commands Title 1",
      }),
    );
    expect(text).toContain("commands");
  });
  it("entrySearchText commands 2", () => {
    const text = entrySearchText(
      makeEntry({
        category: "commands",
        slug: "commands-2",
        title: "commands Title 2",
      }),
    );
    expect(text).toContain("commands");
  });
  it("entrySearchText commands 3", () => {
    const text = entrySearchText(
      makeEntry({
        category: "commands",
        slug: "commands-3",
        title: "commands Title 3",
      }),
    );
    expect(text).toContain("commands");
  });
  it("entrySearchText commands 4", () => {
    const text = entrySearchText(
      makeEntry({
        category: "commands",
        slug: "commands-4",
        title: "commands Title 4",
      }),
    );
    expect(text).toContain("commands");
  });
  it("entrySearchText commands 5", () => {
    const text = entrySearchText(
      makeEntry({
        category: "commands",
        slug: "commands-5",
        title: "commands Title 5",
      }),
    );
    expect(text).toContain("commands");
  });
  it("entrySearchText commands 6", () => {
    const text = entrySearchText(
      makeEntry({
        category: "commands",
        slug: "commands-6",
        title: "commands Title 6",
      }),
    );
    expect(text).toContain("commands");
  });
  it("entrySearchText commands 7", () => {
    const text = entrySearchText(
      makeEntry({
        category: "commands",
        slug: "commands-7",
        title: "commands Title 7",
      }),
    );
    expect(text).toContain("commands");
  });
  it("entrySearchText hooks 0", () => {
    const text = entrySearchText(
      makeEntry({ category: "hooks", slug: "hooks-0", title: "hooks Title 0" }),
    );
    expect(text).toContain("hooks");
  });
  it("entrySearchText hooks 1", () => {
    const text = entrySearchText(
      makeEntry({ category: "hooks", slug: "hooks-1", title: "hooks Title 1" }),
    );
    expect(text).toContain("hooks");
  });
  it("entrySearchText hooks 2", () => {
    const text = entrySearchText(
      makeEntry({ category: "hooks", slug: "hooks-2", title: "hooks Title 2" }),
    );
    expect(text).toContain("hooks");
  });
  it("entrySearchText hooks 3", () => {
    const text = entrySearchText(
      makeEntry({ category: "hooks", slug: "hooks-3", title: "hooks Title 3" }),
    );
    expect(text).toContain("hooks");
  });
  it("entrySearchText hooks 4", () => {
    const text = entrySearchText(
      makeEntry({ category: "hooks", slug: "hooks-4", title: "hooks Title 4" }),
    );
    expect(text).toContain("hooks");
  });
  it("entrySearchText hooks 5", () => {
    const text = entrySearchText(
      makeEntry({ category: "hooks", slug: "hooks-5", title: "hooks Title 5" }),
    );
    expect(text).toContain("hooks");
  });
  it("entrySearchText hooks 6", () => {
    const text = entrySearchText(
      makeEntry({ category: "hooks", slug: "hooks-6", title: "hooks Title 6" }),
    );
    expect(text).toContain("hooks");
  });
  it("entrySearchText hooks 7", () => {
    const text = entrySearchText(
      makeEntry({ category: "hooks", slug: "hooks-7", title: "hooks Title 7" }),
    );
    expect(text).toContain("hooks");
  });
  it("entrySearchText guides 0", () => {
    const text = entrySearchText(
      makeEntry({
        category: "guides",
        slug: "guides-0",
        title: "guides Title 0",
      }),
    );
    expect(text).toContain("guides");
  });
  it("entrySearchText guides 1", () => {
    const text = entrySearchText(
      makeEntry({
        category: "guides",
        slug: "guides-1",
        title: "guides Title 1",
      }),
    );
    expect(text).toContain("guides");
  });
  it("entrySearchText guides 2", () => {
    const text = entrySearchText(
      makeEntry({
        category: "guides",
        slug: "guides-2",
        title: "guides Title 2",
      }),
    );
    expect(text).toContain("guides");
  });
  it("entrySearchText guides 3", () => {
    const text = entrySearchText(
      makeEntry({
        category: "guides",
        slug: "guides-3",
        title: "guides Title 3",
      }),
    );
    expect(text).toContain("guides");
  });
  it("entrySearchText guides 4", () => {
    const text = entrySearchText(
      makeEntry({
        category: "guides",
        slug: "guides-4",
        title: "guides Title 4",
      }),
    );
    expect(text).toContain("guides");
  });
  it("entrySearchText guides 5", () => {
    const text = entrySearchText(
      makeEntry({
        category: "guides",
        slug: "guides-5",
        title: "guides Title 5",
      }),
    );
    expect(text).toContain("guides");
  });
  it("entrySearchText guides 6", () => {
    const text = entrySearchText(
      makeEntry({
        category: "guides",
        slug: "guides-6",
        title: "guides Title 6",
      }),
    );
    expect(text).toContain("guides");
  });
  it("entrySearchText guides 7", () => {
    const text = entrySearchText(
      makeEntry({
        category: "guides",
        slug: "guides-7",
        title: "guides Title 7",
      }),
    );
    expect(text).toContain("guides");
  });
  it("entrySearchText collections 0", () => {
    const text = entrySearchText(
      makeEntry({
        category: "collections",
        slug: "collections-0",
        title: "collections Title 0",
      }),
    );
    expect(text).toContain("collections");
  });
  it("entrySearchText collections 1", () => {
    const text = entrySearchText(
      makeEntry({
        category: "collections",
        slug: "collections-1",
        title: "collections Title 1",
      }),
    );
    expect(text).toContain("collections");
  });
  it("entrySearchText collections 2", () => {
    const text = entrySearchText(
      makeEntry({
        category: "collections",
        slug: "collections-2",
        title: "collections Title 2",
      }),
    );
    expect(text).toContain("collections");
  });
  it("entrySearchText collections 3", () => {
    const text = entrySearchText(
      makeEntry({
        category: "collections",
        slug: "collections-3",
        title: "collections Title 3",
      }),
    );
    expect(text).toContain("collections");
  });
  it("entrySearchText collections 4", () => {
    const text = entrySearchText(
      makeEntry({
        category: "collections",
        slug: "collections-4",
        title: "collections Title 4",
      }),
    );
    expect(text).toContain("collections");
  });
  it("entrySearchText collections 5", () => {
    const text = entrySearchText(
      makeEntry({
        category: "collections",
        slug: "collections-5",
        title: "collections Title 5",
      }),
    );
    expect(text).toContain("collections");
  });
  it("entrySearchText collections 6", () => {
    const text = entrySearchText(
      makeEntry({
        category: "collections",
        slug: "collections-6",
        title: "collections Title 6",
      }),
    );
    expect(text).toContain("collections");
  });
  it("entrySearchText collections 7", () => {
    const text = entrySearchText(
      makeEntry({
        category: "collections",
        slug: "collections-7",
        title: "collections Title 7",
      }),
    );
    expect(text).toContain("collections");
  });
  it("entrySearchText statuslines 0", () => {
    const text = entrySearchText(
      makeEntry({
        category: "statuslines",
        slug: "statuslines-0",
        title: "statuslines Title 0",
      }),
    );
    expect(text).toContain("statuslines");
  });
  it("entrySearchText statuslines 1", () => {
    const text = entrySearchText(
      makeEntry({
        category: "statuslines",
        slug: "statuslines-1",
        title: "statuslines Title 1",
      }),
    );
    expect(text).toContain("statuslines");
  });
  it("entrySearchText statuslines 2", () => {
    const text = entrySearchText(
      makeEntry({
        category: "statuslines",
        slug: "statuslines-2",
        title: "statuslines Title 2",
      }),
    );
    expect(text).toContain("statuslines");
  });
  it("entrySearchText statuslines 3", () => {
    const text = entrySearchText(
      makeEntry({
        category: "statuslines",
        slug: "statuslines-3",
        title: "statuslines Title 3",
      }),
    );
    expect(text).toContain("statuslines");
  });
  it("entrySearchText statuslines 4", () => {
    const text = entrySearchText(
      makeEntry({
        category: "statuslines",
        slug: "statuslines-4",
        title: "statuslines Title 4",
      }),
    );
    expect(text).toContain("statuslines");
  });
  it("entrySearchText statuslines 5", () => {
    const text = entrySearchText(
      makeEntry({
        category: "statuslines",
        slug: "statuslines-5",
        title: "statuslines Title 5",
      }),
    );
    expect(text).toContain("statuslines");
  });
  it("entrySearchText statuslines 6", () => {
    const text = entrySearchText(
      makeEntry({
        category: "statuslines",
        slug: "statuslines-6",
        title: "statuslines Title 6",
      }),
    );
    expect(text).toContain("statuslines");
  });
  it("entrySearchText statuslines 7", () => {
    const text = entrySearchText(
      makeEntry({
        category: "statuslines",
        slug: "statuslines-7",
        title: "statuslines Title 7",
      }),
    );
    expect(text).toContain("statuslines");
  });
});

describe("registry-search-delegate-lib entryMatchesQuery", () => {
  it("matches title tokens", () => {
    expect(entryMatchesQuery(makeEntry(), "browser")).toBe(true);
    expect(entryMatchesQuery(makeEntry(), "nonexistent-xyz")).toBe(false);
  });
  it("entryMatchesQuery churn 0", () => {
    const entry = makeEntry({ title: "Demo Entry 0", description: "desc 0" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-0-token")).toBe(false);
  });
  it("entryMatchesQuery churn 1", () => {
    const entry = makeEntry({ title: "Demo Entry 1", description: "desc 1" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-1-token")).toBe(false);
  });
  it("entryMatchesQuery churn 2", () => {
    const entry = makeEntry({ title: "Demo Entry 2", description: "desc 2" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-2-token")).toBe(false);
  });
  it("entryMatchesQuery churn 3", () => {
    const entry = makeEntry({ title: "Demo Entry 3", description: "desc 3" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-3-token")).toBe(false);
  });
  it("entryMatchesQuery churn 4", () => {
    const entry = makeEntry({ title: "Demo Entry 4", description: "desc 4" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-4-token")).toBe(false);
  });
  it("entryMatchesQuery churn 5", () => {
    const entry = makeEntry({ title: "Demo Entry 5", description: "desc 5" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-5-token")).toBe(false);
  });
  it("entryMatchesQuery churn 6", () => {
    const entry = makeEntry({ title: "Demo Entry 6", description: "desc 6" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-6-token")).toBe(false);
  });
  it("entryMatchesQuery churn 7", () => {
    const entry = makeEntry({ title: "Demo Entry 7", description: "desc 7" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-7-token")).toBe(false);
  });
  it("entryMatchesQuery churn 8", () => {
    const entry = makeEntry({ title: "Demo Entry 8", description: "desc 8" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-8-token")).toBe(false);
  });
  it("entryMatchesQuery churn 9", () => {
    const entry = makeEntry({ title: "Demo Entry 9", description: "desc 9" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-9-token")).toBe(false);
  });
  it("entryMatchesQuery churn 10", () => {
    const entry = makeEntry({ title: "Demo Entry 10", description: "desc 10" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-10-token")).toBe(false);
  });
  it("entryMatchesQuery churn 11", () => {
    const entry = makeEntry({ title: "Demo Entry 11", description: "desc 11" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-11-token")).toBe(false);
  });
  it("entryMatchesQuery churn 12", () => {
    const entry = makeEntry({ title: "Demo Entry 12", description: "desc 12" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-12-token")).toBe(false);
  });
  it("entryMatchesQuery churn 13", () => {
    const entry = makeEntry({ title: "Demo Entry 13", description: "desc 13" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-13-token")).toBe(false);
  });
  it("entryMatchesQuery churn 14", () => {
    const entry = makeEntry({ title: "Demo Entry 14", description: "desc 14" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-14-token")).toBe(false);
  });
  it("entryMatchesQuery churn 15", () => {
    const entry = makeEntry({ title: "Demo Entry 15", description: "desc 15" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-15-token")).toBe(false);
  });
  it("entryMatchesQuery churn 16", () => {
    const entry = makeEntry({ title: "Demo Entry 16", description: "desc 16" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-16-token")).toBe(false);
  });
  it("entryMatchesQuery churn 17", () => {
    const entry = makeEntry({ title: "Demo Entry 17", description: "desc 17" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-17-token")).toBe(false);
  });
  it("entryMatchesQuery churn 18", () => {
    const entry = makeEntry({ title: "Demo Entry 18", description: "desc 18" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-18-token")).toBe(false);
  });
  it("entryMatchesQuery churn 19", () => {
    const entry = makeEntry({ title: "Demo Entry 19", description: "desc 19" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-19-token")).toBe(false);
  });
  it("entryMatchesQuery churn 20", () => {
    const entry = makeEntry({ title: "Demo Entry 20", description: "desc 20" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-20-token")).toBe(false);
  });
  it("entryMatchesQuery churn 21", () => {
    const entry = makeEntry({ title: "Demo Entry 21", description: "desc 21" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-21-token")).toBe(false);
  });
  it("entryMatchesQuery churn 22", () => {
    const entry = makeEntry({ title: "Demo Entry 22", description: "desc 22" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-22-token")).toBe(false);
  });
  it("entryMatchesQuery churn 23", () => {
    const entry = makeEntry({ title: "Demo Entry 23", description: "desc 23" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-23-token")).toBe(false);
  });
  it("entryMatchesQuery churn 24", () => {
    const entry = makeEntry({ title: "Demo Entry 24", description: "desc 24" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-24-token")).toBe(false);
  });
  it("entryMatchesQuery churn 25", () => {
    const entry = makeEntry({ title: "Demo Entry 25", description: "desc 25" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-25-token")).toBe(false);
  });
  it("entryMatchesQuery churn 26", () => {
    const entry = makeEntry({ title: "Demo Entry 26", description: "desc 26" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-26-token")).toBe(false);
  });
  it("entryMatchesQuery churn 27", () => {
    const entry = makeEntry({ title: "Demo Entry 27", description: "desc 27" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-27-token")).toBe(false);
  });
  it("entryMatchesQuery churn 28", () => {
    const entry = makeEntry({ title: "Demo Entry 28", description: "desc 28" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-28-token")).toBe(false);
  });
  it("entryMatchesQuery churn 29", () => {
    const entry = makeEntry({ title: "Demo Entry 29", description: "desc 29" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-29-token")).toBe(false);
  });
  it("entryMatchesQuery churn 30", () => {
    const entry = makeEntry({ title: "Demo Entry 30", description: "desc 30" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-30-token")).toBe(false);
  });
  it("entryMatchesQuery churn 31", () => {
    const entry = makeEntry({ title: "Demo Entry 31", description: "desc 31" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-31-token")).toBe(false);
  });
  it("entryMatchesQuery churn 32", () => {
    const entry = makeEntry({ title: "Demo Entry 32", description: "desc 32" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-32-token")).toBe(false);
  });
  it("entryMatchesQuery churn 33", () => {
    const entry = makeEntry({ title: "Demo Entry 33", description: "desc 33" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-33-token")).toBe(false);
  });
  it("entryMatchesQuery churn 34", () => {
    const entry = makeEntry({ title: "Demo Entry 34", description: "desc 34" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-34-token")).toBe(false);
  });
  it("entryMatchesQuery churn 35", () => {
    const entry = makeEntry({ title: "Demo Entry 35", description: "desc 35" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-35-token")).toBe(false);
  });
  it("entryMatchesQuery churn 36", () => {
    const entry = makeEntry({ title: "Demo Entry 36", description: "desc 36" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-36-token")).toBe(false);
  });
  it("entryMatchesQuery churn 37", () => {
    const entry = makeEntry({ title: "Demo Entry 37", description: "desc 37" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-37-token")).toBe(false);
  });
  it("entryMatchesQuery churn 38", () => {
    const entry = makeEntry({ title: "Demo Entry 38", description: "desc 38" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-38-token")).toBe(false);
  });
  it("entryMatchesQuery churn 39", () => {
    const entry = makeEntry({ title: "Demo Entry 39", description: "desc 39" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-39-token")).toBe(false);
  });
  it("entryMatchesQuery churn 40", () => {
    const entry = makeEntry({ title: "Demo Entry 40", description: "desc 40" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-40-token")).toBe(false);
  });
  it("entryMatchesQuery churn 41", () => {
    const entry = makeEntry({ title: "Demo Entry 41", description: "desc 41" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-41-token")).toBe(false);
  });
  it("entryMatchesQuery churn 42", () => {
    const entry = makeEntry({ title: "Demo Entry 42", description: "desc 42" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-42-token")).toBe(false);
  });
  it("entryMatchesQuery churn 43", () => {
    const entry = makeEntry({ title: "Demo Entry 43", description: "desc 43" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-43-token")).toBe(false);
  });
  it("entryMatchesQuery churn 44", () => {
    const entry = makeEntry({ title: "Demo Entry 44", description: "desc 44" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-44-token")).toBe(false);
  });
  it("entryMatchesQuery churn 45", () => {
    const entry = makeEntry({ title: "Demo Entry 45", description: "desc 45" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-45-token")).toBe(false);
  });
  it("entryMatchesQuery churn 46", () => {
    const entry = makeEntry({ title: "Demo Entry 46", description: "desc 46" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-46-token")).toBe(false);
  });
  it("entryMatchesQuery churn 47", () => {
    const entry = makeEntry({ title: "Demo Entry 47", description: "desc 47" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-47-token")).toBe(false);
  });
  it("entryMatchesQuery churn 48", () => {
    const entry = makeEntry({ title: "Demo Entry 48", description: "desc 48" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-48-token")).toBe(false);
  });
  it("entryMatchesQuery churn 49", () => {
    const entry = makeEntry({ title: "Demo Entry 49", description: "desc 49" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-49-token")).toBe(false);
  });
  it("entryMatchesQuery churn 50", () => {
    const entry = makeEntry({ title: "Demo Entry 50", description: "desc 50" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-50-token")).toBe(false);
  });
  it("entryMatchesQuery churn 51", () => {
    const entry = makeEntry({ title: "Demo Entry 51", description: "desc 51" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-51-token")).toBe(false);
  });
  it("entryMatchesQuery churn 52", () => {
    const entry = makeEntry({ title: "Demo Entry 52", description: "desc 52" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-52-token")).toBe(false);
  });
  it("entryMatchesQuery churn 53", () => {
    const entry = makeEntry({ title: "Demo Entry 53", description: "desc 53" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-53-token")).toBe(false);
  });
  it("entryMatchesQuery churn 54", () => {
    const entry = makeEntry({ title: "Demo Entry 54", description: "desc 54" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-54-token")).toBe(false);
  });
  it("entryMatchesQuery churn 55", () => {
    const entry = makeEntry({ title: "Demo Entry 55", description: "desc 55" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-55-token")).toBe(false);
  });
  it("entryMatchesQuery churn 56", () => {
    const entry = makeEntry({ title: "Demo Entry 56", description: "desc 56" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-56-token")).toBe(false);
  });
  it("entryMatchesQuery churn 57", () => {
    const entry = makeEntry({ title: "Demo Entry 57", description: "desc 57" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-57-token")).toBe(false);
  });
  it("entryMatchesQuery churn 58", () => {
    const entry = makeEntry({ title: "Demo Entry 58", description: "desc 58" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-58-token")).toBe(false);
  });
  it("entryMatchesQuery churn 59", () => {
    const entry = makeEntry({ title: "Demo Entry 59", description: "desc 59" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-59-token")).toBe(false);
  });
  it("entryMatchesQuery churn 60", () => {
    const entry = makeEntry({ title: "Demo Entry 60", description: "desc 60" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-60-token")).toBe(false);
  });
  it("entryMatchesQuery churn 61", () => {
    const entry = makeEntry({ title: "Demo Entry 61", description: "desc 61" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-61-token")).toBe(false);
  });
  it("entryMatchesQuery churn 62", () => {
    const entry = makeEntry({ title: "Demo Entry 62", description: "desc 62" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-62-token")).toBe(false);
  });
  it("entryMatchesQuery churn 63", () => {
    const entry = makeEntry({ title: "Demo Entry 63", description: "desc 63" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-63-token")).toBe(false);
  });
  it("entryMatchesQuery churn 64", () => {
    const entry = makeEntry({ title: "Demo Entry 64", description: "desc 64" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-64-token")).toBe(false);
  });
  it("entryMatchesQuery churn 65", () => {
    const entry = makeEntry({ title: "Demo Entry 65", description: "desc 65" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-65-token")).toBe(false);
  });
  it("entryMatchesQuery churn 66", () => {
    const entry = makeEntry({ title: "Demo Entry 66", description: "desc 66" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-66-token")).toBe(false);
  });
  it("entryMatchesQuery churn 67", () => {
    const entry = makeEntry({ title: "Demo Entry 67", description: "desc 67" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-67-token")).toBe(false);
  });
  it("entryMatchesQuery churn 68", () => {
    const entry = makeEntry({ title: "Demo Entry 68", description: "desc 68" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-68-token")).toBe(false);
  });
  it("entryMatchesQuery churn 69", () => {
    const entry = makeEntry({ title: "Demo Entry 69", description: "desc 69" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-69-token")).toBe(false);
  });
  it("entryMatchesQuery churn 70", () => {
    const entry = makeEntry({ title: "Demo Entry 70", description: "desc 70" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-70-token")).toBe(false);
  });
  it("entryMatchesQuery churn 71", () => {
    const entry = makeEntry({ title: "Demo Entry 71", description: "desc 71" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-71-token")).toBe(false);
  });
  it("entryMatchesQuery churn 72", () => {
    const entry = makeEntry({ title: "Demo Entry 72", description: "desc 72" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-72-token")).toBe(false);
  });
  it("entryMatchesQuery churn 73", () => {
    const entry = makeEntry({ title: "Demo Entry 73", description: "desc 73" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-73-token")).toBe(false);
  });
  it("entryMatchesQuery churn 74", () => {
    const entry = makeEntry({ title: "Demo Entry 74", description: "desc 74" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-74-token")).toBe(false);
  });
  it("entryMatchesQuery churn 75", () => {
    const entry = makeEntry({ title: "Demo Entry 75", description: "desc 75" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-75-token")).toBe(false);
  });
  it("entryMatchesQuery churn 76", () => {
    const entry = makeEntry({ title: "Demo Entry 76", description: "desc 76" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-76-token")).toBe(false);
  });
  it("entryMatchesQuery churn 77", () => {
    const entry = makeEntry({ title: "Demo Entry 77", description: "desc 77" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-77-token")).toBe(false);
  });
  it("entryMatchesQuery churn 78", () => {
    const entry = makeEntry({ title: "Demo Entry 78", description: "desc 78" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-78-token")).toBe(false);
  });
  it("entryMatchesQuery churn 79", () => {
    const entry = makeEntry({ title: "Demo Entry 79", description: "desc 79" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-79-token")).toBe(false);
  });
  it("entryMatchesQuery churn 80", () => {
    const entry = makeEntry({ title: "Demo Entry 80", description: "desc 80" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-80-token")).toBe(false);
  });
  it("entryMatchesQuery churn 81", () => {
    const entry = makeEntry({ title: "Demo Entry 81", description: "desc 81" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-81-token")).toBe(false);
  });
  it("entryMatchesQuery churn 82", () => {
    const entry = makeEntry({ title: "Demo Entry 82", description: "desc 82" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-82-token")).toBe(false);
  });
  it("entryMatchesQuery churn 83", () => {
    const entry = makeEntry({ title: "Demo Entry 83", description: "desc 83" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-83-token")).toBe(false);
  });
  it("entryMatchesQuery churn 84", () => {
    const entry = makeEntry({ title: "Demo Entry 84", description: "desc 84" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-84-token")).toBe(false);
  });
  it("entryMatchesQuery churn 85", () => {
    const entry = makeEntry({ title: "Demo Entry 85", description: "desc 85" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-85-token")).toBe(false);
  });
  it("entryMatchesQuery churn 86", () => {
    const entry = makeEntry({ title: "Demo Entry 86", description: "desc 86" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-86-token")).toBe(false);
  });
  it("entryMatchesQuery churn 87", () => {
    const entry = makeEntry({ title: "Demo Entry 87", description: "desc 87" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-87-token")).toBe(false);
  });
  it("entryMatchesQuery churn 88", () => {
    const entry = makeEntry({ title: "Demo Entry 88", description: "desc 88" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-88-token")).toBe(false);
  });
  it("entryMatchesQuery churn 89", () => {
    const entry = makeEntry({ title: "Demo Entry 89", description: "desc 89" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-89-token")).toBe(false);
  });
  it("entryMatchesQuery churn 90", () => {
    const entry = makeEntry({ title: "Demo Entry 90", description: "desc 90" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-90-token")).toBe(false);
  });
  it("entryMatchesQuery churn 91", () => {
    const entry = makeEntry({ title: "Demo Entry 91", description: "desc 91" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-91-token")).toBe(false);
  });
  it("entryMatchesQuery churn 92", () => {
    const entry = makeEntry({ title: "Demo Entry 92", description: "desc 92" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-92-token")).toBe(false);
  });
  it("entryMatchesQuery churn 93", () => {
    const entry = makeEntry({ title: "Demo Entry 93", description: "desc 93" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-93-token")).toBe(false);
  });
  it("entryMatchesQuery churn 94", () => {
    const entry = makeEntry({ title: "Demo Entry 94", description: "desc 94" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-94-token")).toBe(false);
  });
  it("entryMatchesQuery churn 95", () => {
    const entry = makeEntry({ title: "Demo Entry 95", description: "desc 95" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-95-token")).toBe(false);
  });
  it("entryMatchesQuery churn 96", () => {
    const entry = makeEntry({ title: "Demo Entry 96", description: "desc 96" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-96-token")).toBe(false);
  });
  it("entryMatchesQuery churn 97", () => {
    const entry = makeEntry({ title: "Demo Entry 97", description: "desc 97" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-97-token")).toBe(false);
  });
  it("entryMatchesQuery churn 98", () => {
    const entry = makeEntry({ title: "Demo Entry 98", description: "desc 98" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-98-token")).toBe(false);
  });
  it("entryMatchesQuery churn 99", () => {
    const entry = makeEntry({ title: "Demo Entry 99", description: "desc 99" });
    expect(entryMatchesQuery(entry, "demo")).toBe(true);
    expect(entryMatchesQuery(entry, "missing-99-token")).toBe(false);
  });
});

describe("registry-search-delegate-lib entryMatchesPlatform", () => {
  it("entryMatchesPlatform claude-code 0", () => {
    const entry = makeEntry({ platforms: ["claude-code"] });
    expect(entryMatchesPlatform(entry, "claude-code")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform claude-code 1", () => {
    const entry = makeEntry({ platforms: ["claude-code"] });
    expect(entryMatchesPlatform(entry, "claude-code")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform claude-code 2", () => {
    const entry = makeEntry({ platforms: ["claude-code"] });
    expect(entryMatchesPlatform(entry, "claude-code")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform claude-code 3", () => {
    const entry = makeEntry({ platforms: ["claude-code"] });
    expect(entryMatchesPlatform(entry, "claude-code")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform claude-code 4", () => {
    const entry = makeEntry({ platforms: ["claude-code"] });
    expect(entryMatchesPlatform(entry, "claude-code")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform claude-code 5", () => {
    const entry = makeEntry({ platforms: ["claude-code"] });
    expect(entryMatchesPlatform(entry, "claude-code")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform claude-desktop 0", () => {
    const entry = makeEntry({ platforms: ["claude-desktop"] });
    expect(entryMatchesPlatform(entry, "claude-desktop")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform claude-desktop 1", () => {
    const entry = makeEntry({ platforms: ["claude-desktop"] });
    expect(entryMatchesPlatform(entry, "claude-desktop")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform claude-desktop 2", () => {
    const entry = makeEntry({ platforms: ["claude-desktop"] });
    expect(entryMatchesPlatform(entry, "claude-desktop")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform claude-desktop 3", () => {
    const entry = makeEntry({ platforms: ["claude-desktop"] });
    expect(entryMatchesPlatform(entry, "claude-desktop")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform claude-desktop 4", () => {
    const entry = makeEntry({ platforms: ["claude-desktop"] });
    expect(entryMatchesPlatform(entry, "claude-desktop")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform claude-desktop 5", () => {
    const entry = makeEntry({ platforms: ["claude-desktop"] });
    expect(entryMatchesPlatform(entry, "claude-desktop")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform cursor 0", () => {
    const entry = makeEntry({ platforms: ["cursor"] });
    expect(entryMatchesPlatform(entry, "cursor")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform cursor 1", () => {
    const entry = makeEntry({ platforms: ["cursor"] });
    expect(entryMatchesPlatform(entry, "cursor")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform cursor 2", () => {
    const entry = makeEntry({ platforms: ["cursor"] });
    expect(entryMatchesPlatform(entry, "cursor")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform cursor 3", () => {
    const entry = makeEntry({ platforms: ["cursor"] });
    expect(entryMatchesPlatform(entry, "cursor")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform cursor 4", () => {
    const entry = makeEntry({ platforms: ["cursor"] });
    expect(entryMatchesPlatform(entry, "cursor")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform cursor 5", () => {
    const entry = makeEntry({ platforms: ["cursor"] });
    expect(entryMatchesPlatform(entry, "cursor")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform vscode 0", () => {
    const entry = makeEntry({ platforms: ["vscode"] });
    expect(entryMatchesPlatform(entry, "vscode")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform vscode 1", () => {
    const entry = makeEntry({ platforms: ["vscode"] });
    expect(entryMatchesPlatform(entry, "vscode")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform vscode 2", () => {
    const entry = makeEntry({ platforms: ["vscode"] });
    expect(entryMatchesPlatform(entry, "vscode")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform vscode 3", () => {
    const entry = makeEntry({ platforms: ["vscode"] });
    expect(entryMatchesPlatform(entry, "vscode")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform vscode 4", () => {
    const entry = makeEntry({ platforms: ["vscode"] });
    expect(entryMatchesPlatform(entry, "vscode")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform vscode 5", () => {
    const entry = makeEntry({ platforms: ["vscode"] });
    expect(entryMatchesPlatform(entry, "vscode")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform windsurf 0", () => {
    const entry = makeEntry({ platforms: ["windsurf"] });
    expect(entryMatchesPlatform(entry, "windsurf")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform windsurf 1", () => {
    const entry = makeEntry({ platforms: ["windsurf"] });
    expect(entryMatchesPlatform(entry, "windsurf")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform windsurf 2", () => {
    const entry = makeEntry({ platforms: ["windsurf"] });
    expect(entryMatchesPlatform(entry, "windsurf")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform windsurf 3", () => {
    const entry = makeEntry({ platforms: ["windsurf"] });
    expect(entryMatchesPlatform(entry, "windsurf")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform windsurf 4", () => {
    const entry = makeEntry({ platforms: ["windsurf"] });
    expect(entryMatchesPlatform(entry, "windsurf")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform windsurf 5", () => {
    const entry = makeEntry({ platforms: ["windsurf"] });
    expect(entryMatchesPlatform(entry, "windsurf")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform codex 0", () => {
    const entry = makeEntry({ platforms: ["codex"] });
    expect(entryMatchesPlatform(entry, "codex")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform codex 1", () => {
    const entry = makeEntry({ platforms: ["codex"] });
    expect(entryMatchesPlatform(entry, "codex")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform codex 2", () => {
    const entry = makeEntry({ platforms: ["codex"] });
    expect(entryMatchesPlatform(entry, "codex")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform codex 3", () => {
    const entry = makeEntry({ platforms: ["codex"] });
    expect(entryMatchesPlatform(entry, "codex")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform codex 4", () => {
    const entry = makeEntry({ platforms: ["codex"] });
    expect(entryMatchesPlatform(entry, "codex")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform codex 5", () => {
    const entry = makeEntry({ platforms: ["codex"] });
    expect(entryMatchesPlatform(entry, "codex")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform gemini 0", () => {
    const entry = makeEntry({ platforms: ["gemini"] });
    expect(entryMatchesPlatform(entry, "gemini")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform gemini 1", () => {
    const entry = makeEntry({ platforms: ["gemini"] });
    expect(entryMatchesPlatform(entry, "gemini")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform gemini 2", () => {
    const entry = makeEntry({ platforms: ["gemini"] });
    expect(entryMatchesPlatform(entry, "gemini")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform gemini 3", () => {
    const entry = makeEntry({ platforms: ["gemini"] });
    expect(entryMatchesPlatform(entry, "gemini")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform gemini 4", () => {
    const entry = makeEntry({ platforms: ["gemini"] });
    expect(entryMatchesPlatform(entry, "gemini")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform gemini 5", () => {
    const entry = makeEntry({ platforms: ["gemini"] });
    expect(entryMatchesPlatform(entry, "gemini")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform raycast 0", () => {
    const entry = makeEntry({ platforms: ["raycast"] });
    expect(entryMatchesPlatform(entry, "raycast")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform raycast 1", () => {
    const entry = makeEntry({ platforms: ["raycast"] });
    expect(entryMatchesPlatform(entry, "raycast")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform raycast 2", () => {
    const entry = makeEntry({ platforms: ["raycast"] });
    expect(entryMatchesPlatform(entry, "raycast")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform raycast 3", () => {
    const entry = makeEntry({ platforms: ["raycast"] });
    expect(entryMatchesPlatform(entry, "raycast")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform raycast 4", () => {
    const entry = makeEntry({ platforms: ["raycast"] });
    expect(entryMatchesPlatform(entry, "raycast")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform raycast 5", () => {
    const entry = makeEntry({ platforms: ["raycast"] });
    expect(entryMatchesPlatform(entry, "raycast")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform cli 0", () => {
    const entry = makeEntry({ platforms: ["cli"] });
    expect(entryMatchesPlatform(entry, "cli")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform cli 1", () => {
    const entry = makeEntry({ platforms: ["cli"] });
    expect(entryMatchesPlatform(entry, "cli")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform cli 2", () => {
    const entry = makeEntry({ platforms: ["cli"] });
    expect(entryMatchesPlatform(entry, "cli")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform cli 3", () => {
    const entry = makeEntry({ platforms: ["cli"] });
    expect(entryMatchesPlatform(entry, "cli")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform cli 4", () => {
    const entry = makeEntry({ platforms: ["cli"] });
    expect(entryMatchesPlatform(entry, "cli")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform cli 5", () => {
    const entry = makeEntry({ platforms: ["cli"] });
    expect(entryMatchesPlatform(entry, "cli")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform aider 0", () => {
    const entry = makeEntry({ platforms: ["aider"] });
    expect(entryMatchesPlatform(entry, "aider")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform aider 1", () => {
    const entry = makeEntry({ platforms: ["aider"] });
    expect(entryMatchesPlatform(entry, "aider")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform aider 2", () => {
    const entry = makeEntry({ platforms: ["aider"] });
    expect(entryMatchesPlatform(entry, "aider")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform aider 3", () => {
    const entry = makeEntry({ platforms: ["aider"] });
    expect(entryMatchesPlatform(entry, "aider")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform aider 4", () => {
    const entry = makeEntry({ platforms: ["aider"] });
    expect(entryMatchesPlatform(entry, "aider")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform aider 5", () => {
    const entry = makeEntry({ platforms: ["aider"] });
    expect(entryMatchesPlatform(entry, "aider")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform zed 0", () => {
    const entry = makeEntry({ platforms: ["zed"] });
    expect(entryMatchesPlatform(entry, "zed")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform zed 1", () => {
    const entry = makeEntry({ platforms: ["zed"] });
    expect(entryMatchesPlatform(entry, "zed")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform zed 2", () => {
    const entry = makeEntry({ platforms: ["zed"] });
    expect(entryMatchesPlatform(entry, "zed")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform zed 3", () => {
    const entry = makeEntry({ platforms: ["zed"] });
    expect(entryMatchesPlatform(entry, "zed")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform zed 4", () => {
    const entry = makeEntry({ platforms: ["zed"] });
    expect(entryMatchesPlatform(entry, "zed")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform zed 5", () => {
    const entry = makeEntry({ platforms: ["zed"] });
    expect(entryMatchesPlatform(entry, "zed")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform continue 0", () => {
    const entry = makeEntry({ platforms: ["continue"] });
    expect(entryMatchesPlatform(entry, "continue")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform continue 1", () => {
    const entry = makeEntry({ platforms: ["continue"] });
    expect(entryMatchesPlatform(entry, "continue")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform continue 2", () => {
    const entry = makeEntry({ platforms: ["continue"] });
    expect(entryMatchesPlatform(entry, "continue")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform continue 3", () => {
    const entry = makeEntry({ platforms: ["continue"] });
    expect(entryMatchesPlatform(entry, "continue")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform continue 4", () => {
    const entry = makeEntry({ platforms: ["continue"] });
    expect(entryMatchesPlatform(entry, "continue")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
  it("entryMatchesPlatform continue 5", () => {
    const entry = makeEntry({ platforms: ["continue"] });
    expect(entryMatchesPlatform(entry, "continue")).toBe(true);
    expect(entryMatchesPlatform(entry, "")).toBe(true);
  });
});

describe("registry-search-delegate-lib rankSearchEntries", () => {
  it("ranks matching entries above non-matching", () => {
    const entries = [
      makeEntry({ slug: "a", title: "Alpha" }),
      makeEntry({ slug: "b", title: "Browser Bridge Exact" }),
    ];
    const ranked = rankSearchEntries(entries, "browser bridge");
    expect(ranked[0].entry.slug).toBe("b");
  });
  it("rankSearchEntries matrix 0", () => {
    const entries = [
      makeEntry({ slug: "low-0", title: "Other" }),
      makeEntry({ slug: "high-0", title: "Target Query 0" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-0");
  });
  it("rankSearchEntries matrix 1", () => {
    const entries = [
      makeEntry({ slug: "low-1", title: "Other" }),
      makeEntry({ slug: "high-1", title: "Target Query 1" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-1");
  });
  it("rankSearchEntries matrix 2", () => {
    const entries = [
      makeEntry({ slug: "low-2", title: "Other" }),
      makeEntry({ slug: "high-2", title: "Target Query 2" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-2");
  });
  it("rankSearchEntries matrix 3", () => {
    const entries = [
      makeEntry({ slug: "low-3", title: "Other" }),
      makeEntry({ slug: "high-3", title: "Target Query 3" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-3");
  });
  it("rankSearchEntries matrix 4", () => {
    const entries = [
      makeEntry({ slug: "low-4", title: "Other" }),
      makeEntry({ slug: "high-4", title: "Target Query 4" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-4");
  });
  it("rankSearchEntries matrix 5", () => {
    const entries = [
      makeEntry({ slug: "low-5", title: "Other" }),
      makeEntry({ slug: "high-5", title: "Target Query 5" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-5");
  });
  it("rankSearchEntries matrix 6", () => {
    const entries = [
      makeEntry({ slug: "low-6", title: "Other" }),
      makeEntry({ slug: "high-6", title: "Target Query 6" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-6");
  });
  it("rankSearchEntries matrix 7", () => {
    const entries = [
      makeEntry({ slug: "low-7", title: "Other" }),
      makeEntry({ slug: "high-7", title: "Target Query 7" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-7");
  });
  it("rankSearchEntries matrix 8", () => {
    const entries = [
      makeEntry({ slug: "low-8", title: "Other" }),
      makeEntry({ slug: "high-8", title: "Target Query 8" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-8");
  });
  it("rankSearchEntries matrix 9", () => {
    const entries = [
      makeEntry({ slug: "low-9", title: "Other" }),
      makeEntry({ slug: "high-9", title: "Target Query 9" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-9");
  });
  it("rankSearchEntries matrix 10", () => {
    const entries = [
      makeEntry({ slug: "low-10", title: "Other" }),
      makeEntry({ slug: "high-10", title: "Target Query 10" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-10");
  });
  it("rankSearchEntries matrix 11", () => {
    const entries = [
      makeEntry({ slug: "low-11", title: "Other" }),
      makeEntry({ slug: "high-11", title: "Target Query 11" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-11");
  });
  it("rankSearchEntries matrix 12", () => {
    const entries = [
      makeEntry({ slug: "low-12", title: "Other" }),
      makeEntry({ slug: "high-12", title: "Target Query 12" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-12");
  });
  it("rankSearchEntries matrix 13", () => {
    const entries = [
      makeEntry({ slug: "low-13", title: "Other" }),
      makeEntry({ slug: "high-13", title: "Target Query 13" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-13");
  });
  it("rankSearchEntries matrix 14", () => {
    const entries = [
      makeEntry({ slug: "low-14", title: "Other" }),
      makeEntry({ slug: "high-14", title: "Target Query 14" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-14");
  });
  it("rankSearchEntries matrix 15", () => {
    const entries = [
      makeEntry({ slug: "low-15", title: "Other" }),
      makeEntry({ slug: "high-15", title: "Target Query 15" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-15");
  });
  it("rankSearchEntries matrix 16", () => {
    const entries = [
      makeEntry({ slug: "low-16", title: "Other" }),
      makeEntry({ slug: "high-16", title: "Target Query 16" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-16");
  });
  it("rankSearchEntries matrix 17", () => {
    const entries = [
      makeEntry({ slug: "low-17", title: "Other" }),
      makeEntry({ slug: "high-17", title: "Target Query 17" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-17");
  });
  it("rankSearchEntries matrix 18", () => {
    const entries = [
      makeEntry({ slug: "low-18", title: "Other" }),
      makeEntry({ slug: "high-18", title: "Target Query 18" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-18");
  });
  it("rankSearchEntries matrix 19", () => {
    const entries = [
      makeEntry({ slug: "low-19", title: "Other" }),
      makeEntry({ slug: "high-19", title: "Target Query 19" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-19");
  });
  it("rankSearchEntries matrix 20", () => {
    const entries = [
      makeEntry({ slug: "low-20", title: "Other" }),
      makeEntry({ slug: "high-20", title: "Target Query 20" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-20");
  });
  it("rankSearchEntries matrix 21", () => {
    const entries = [
      makeEntry({ slug: "low-21", title: "Other" }),
      makeEntry({ slug: "high-21", title: "Target Query 21" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-21");
  });
  it("rankSearchEntries matrix 22", () => {
    const entries = [
      makeEntry({ slug: "low-22", title: "Other" }),
      makeEntry({ slug: "high-22", title: "Target Query 22" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-22");
  });
  it("rankSearchEntries matrix 23", () => {
    const entries = [
      makeEntry({ slug: "low-23", title: "Other" }),
      makeEntry({ slug: "high-23", title: "Target Query 23" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-23");
  });
  it("rankSearchEntries matrix 24", () => {
    const entries = [
      makeEntry({ slug: "low-24", title: "Other" }),
      makeEntry({ slug: "high-24", title: "Target Query 24" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-24");
  });
  it("rankSearchEntries matrix 25", () => {
    const entries = [
      makeEntry({ slug: "low-25", title: "Other" }),
      makeEntry({ slug: "high-25", title: "Target Query 25" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-25");
  });
  it("rankSearchEntries matrix 26", () => {
    const entries = [
      makeEntry({ slug: "low-26", title: "Other" }),
      makeEntry({ slug: "high-26", title: "Target Query 26" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-26");
  });
  it("rankSearchEntries matrix 27", () => {
    const entries = [
      makeEntry({ slug: "low-27", title: "Other" }),
      makeEntry({ slug: "high-27", title: "Target Query 27" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-27");
  });
  it("rankSearchEntries matrix 28", () => {
    const entries = [
      makeEntry({ slug: "low-28", title: "Other" }),
      makeEntry({ slug: "high-28", title: "Target Query 28" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-28");
  });
  it("rankSearchEntries matrix 29", () => {
    const entries = [
      makeEntry({ slug: "low-29", title: "Other" }),
      makeEntry({ slug: "high-29", title: "Target Query 29" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-29");
  });
  it("rankSearchEntries matrix 30", () => {
    const entries = [
      makeEntry({ slug: "low-30", title: "Other" }),
      makeEntry({ slug: "high-30", title: "Target Query 30" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-30");
  });
  it("rankSearchEntries matrix 31", () => {
    const entries = [
      makeEntry({ slug: "low-31", title: "Other" }),
      makeEntry({ slug: "high-31", title: "Target Query 31" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-31");
  });
  it("rankSearchEntries matrix 32", () => {
    const entries = [
      makeEntry({ slug: "low-32", title: "Other" }),
      makeEntry({ slug: "high-32", title: "Target Query 32" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-32");
  });
  it("rankSearchEntries matrix 33", () => {
    const entries = [
      makeEntry({ slug: "low-33", title: "Other" }),
      makeEntry({ slug: "high-33", title: "Target Query 33" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-33");
  });
  it("rankSearchEntries matrix 34", () => {
    const entries = [
      makeEntry({ slug: "low-34", title: "Other" }),
      makeEntry({ slug: "high-34", title: "Target Query 34" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-34");
  });
  it("rankSearchEntries matrix 35", () => {
    const entries = [
      makeEntry({ slug: "low-35", title: "Other" }),
      makeEntry({ slug: "high-35", title: "Target Query 35" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-35");
  });
  it("rankSearchEntries matrix 36", () => {
    const entries = [
      makeEntry({ slug: "low-36", title: "Other" }),
      makeEntry({ slug: "high-36", title: "Target Query 36" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-36");
  });
  it("rankSearchEntries matrix 37", () => {
    const entries = [
      makeEntry({ slug: "low-37", title: "Other" }),
      makeEntry({ slug: "high-37", title: "Target Query 37" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-37");
  });
  it("rankSearchEntries matrix 38", () => {
    const entries = [
      makeEntry({ slug: "low-38", title: "Other" }),
      makeEntry({ slug: "high-38", title: "Target Query 38" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-38");
  });
  it("rankSearchEntries matrix 39", () => {
    const entries = [
      makeEntry({ slug: "low-39", title: "Other" }),
      makeEntry({ slug: "high-39", title: "Target Query 39" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-39");
  });
  it("rankSearchEntries matrix 40", () => {
    const entries = [
      makeEntry({ slug: "low-40", title: "Other" }),
      makeEntry({ slug: "high-40", title: "Target Query 40" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-40");
  });
  it("rankSearchEntries matrix 41", () => {
    const entries = [
      makeEntry({ slug: "low-41", title: "Other" }),
      makeEntry({ slug: "high-41", title: "Target Query 41" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-41");
  });
  it("rankSearchEntries matrix 42", () => {
    const entries = [
      makeEntry({ slug: "low-42", title: "Other" }),
      makeEntry({ slug: "high-42", title: "Target Query 42" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-42");
  });
  it("rankSearchEntries matrix 43", () => {
    const entries = [
      makeEntry({ slug: "low-43", title: "Other" }),
      makeEntry({ slug: "high-43", title: "Target Query 43" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-43");
  });
  it("rankSearchEntries matrix 44", () => {
    const entries = [
      makeEntry({ slug: "low-44", title: "Other" }),
      makeEntry({ slug: "high-44", title: "Target Query 44" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-44");
  });
  it("rankSearchEntries matrix 45", () => {
    const entries = [
      makeEntry({ slug: "low-45", title: "Other" }),
      makeEntry({ slug: "high-45", title: "Target Query 45" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-45");
  });
  it("rankSearchEntries matrix 46", () => {
    const entries = [
      makeEntry({ slug: "low-46", title: "Other" }),
      makeEntry({ slug: "high-46", title: "Target Query 46" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-46");
  });
  it("rankSearchEntries matrix 47", () => {
    const entries = [
      makeEntry({ slug: "low-47", title: "Other" }),
      makeEntry({ slug: "high-47", title: "Target Query 47" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-47");
  });
  it("rankSearchEntries matrix 48", () => {
    const entries = [
      makeEntry({ slug: "low-48", title: "Other" }),
      makeEntry({ slug: "high-48", title: "Target Query 48" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-48");
  });
  it("rankSearchEntries matrix 49", () => {
    const entries = [
      makeEntry({ slug: "low-49", title: "Other" }),
      makeEntry({ slug: "high-49", title: "Target Query 49" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-49");
  });
  it("rankSearchEntries matrix 50", () => {
    const entries = [
      makeEntry({ slug: "low-50", title: "Other" }),
      makeEntry({ slug: "high-50", title: "Target Query 50" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-50");
  });
  it("rankSearchEntries matrix 51", () => {
    const entries = [
      makeEntry({ slug: "low-51", title: "Other" }),
      makeEntry({ slug: "high-51", title: "Target Query 51" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-51");
  });
  it("rankSearchEntries matrix 52", () => {
    const entries = [
      makeEntry({ slug: "low-52", title: "Other" }),
      makeEntry({ slug: "high-52", title: "Target Query 52" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-52");
  });
  it("rankSearchEntries matrix 53", () => {
    const entries = [
      makeEntry({ slug: "low-53", title: "Other" }),
      makeEntry({ slug: "high-53", title: "Target Query 53" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-53");
  });
  it("rankSearchEntries matrix 54", () => {
    const entries = [
      makeEntry({ slug: "low-54", title: "Other" }),
      makeEntry({ slug: "high-54", title: "Target Query 54" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-54");
  });
  it("rankSearchEntries matrix 55", () => {
    const entries = [
      makeEntry({ slug: "low-55", title: "Other" }),
      makeEntry({ slug: "high-55", title: "Target Query 55" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-55");
  });
  it("rankSearchEntries matrix 56", () => {
    const entries = [
      makeEntry({ slug: "low-56", title: "Other" }),
      makeEntry({ slug: "high-56", title: "Target Query 56" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-56");
  });
  it("rankSearchEntries matrix 57", () => {
    const entries = [
      makeEntry({ slug: "low-57", title: "Other" }),
      makeEntry({ slug: "high-57", title: "Target Query 57" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-57");
  });
  it("rankSearchEntries matrix 58", () => {
    const entries = [
      makeEntry({ slug: "low-58", title: "Other" }),
      makeEntry({ slug: "high-58", title: "Target Query 58" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-58");
  });
  it("rankSearchEntries matrix 59", () => {
    const entries = [
      makeEntry({ slug: "low-59", title: "Other" }),
      makeEntry({ slug: "high-59", title: "Target Query 59" }),
    ];
    const ranked = rankSearchEntries(entries, "target query");
    expect(ranked[0].entry.slug).toBe("high-59");
  });
});
