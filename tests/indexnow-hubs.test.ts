import { describe, expect, it } from "vitest";

import {
  CATEGORY_REPORTS,
  GLOBAL_REPORTS,
  entryHubPaths,
  entryHubUrls,
  tagSlug,
} from "../scripts/lib/indexnow-hubs.mjs";

describe("tagSlug", () => {
  it("lowercases, trims, and dashes non-alphanumerics", () => {
    expect(tagSlug("Foo Bar")).toBe("foo-bar");
    expect(tagSlug("  Spaced  ")).toBe("spaced");
    expect(tagSlug("C++ & Rust")).toBe("c-rust");
  });

  it("strips leading and trailing dashes", () => {
    expect(tagSlug("!!!edge!!!")).toBe("edge");
  });

  it("returns an empty string when nothing alphanumeric remains", () => {
    expect(tagSlug("###")).toBe("");
  });

  it("coerces non-string input", () => {
    expect(tagSlug(123 as unknown as string)).toBe("123");
  });
});

describe("entryHubPaths", () => {
  it("includes the category page, its category reports, and the global reports", () => {
    expect(entryHubPaths({ category: "mcp", slug: "srv" })).toEqual([
      "/mcp",
      "/state-of-mcp-servers",
      "/mcp-security-report",
      "/state-of-claude-tooling",
    ]);
  });

  it("adds only the global report for a category with no category-specific reports", () => {
    expect(entryHubPaths({ category: "unknown-cat", slug: "x" })).toEqual([
      "/unknown-cat",
      "/state-of-claude-tooling",
    ]);
  });

  it("adds tag hub paths and de-duplicates by slug", () => {
    expect(
      entryHubPaths({
        category: "",
        slug: "x",
        tags: ["AI Agents", "ai agents", "!!!"],
      }),
    ).toEqual(["/tags/ai-agents"]);
  });

  it("omits category paths when the category is blank", () => {
    expect(entryHubPaths({ category: "", slug: "x" })).toEqual([]);
  });

  it("never includes the entry's own slug URL", () => {
    const paths = entryHubPaths({ category: "hooks", slug: "my-hook" });
    expect(paths).not.toContain("/hooks/my-hook");
    expect(paths).toEqual([
      "/hooks",
      "/state-of-claude-code-hooks",
      "/state-of-claude-tooling",
    ]);
  });

  it("returns an empty array for an entry with no category and no tags", () => {
    expect(entryHubPaths({})).toEqual([]);
  });
});

describe("entryHubUrls", () => {
  it("prefixes each path with the base URL", () => {
    expect(
      entryHubUrls({ category: "skills", slug: "x" }, "https://example.com"),
    ).toEqual([
      "https://example.com/skills",
      "https://example.com/state-of-agent-skills",
      "https://example.com/state-of-claude-tooling",
    ]);
  });

  it("strips trailing slashes from the base URL", () => {
    expect(
      entryHubUrls({ category: "agents", slug: "x" }, "https://example.com///"),
    ).toEqual([
      "https://example.com/agents",
      "https://example.com/state-of-ai-agents",
      "https://example.com/state-of-claude-tooling",
    ]);
  });

  it("returns an empty array when there are no hub paths", () => {
    expect(entryHubUrls({}, "https://example.com")).toEqual([]);
  });
});

describe("report maps", () => {
  it("cover the known categories and a global report", () => {
    expect(Object.keys(CATEGORY_REPORTS).sort()).toEqual([
      "agents",
      "hooks",
      "mcp",
      "skills",
    ]);
    expect(GLOBAL_REPORTS).toContain("/state-of-claude-tooling");
  });
});
