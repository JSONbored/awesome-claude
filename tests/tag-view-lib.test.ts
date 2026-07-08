import { describe, expect, it } from "vitest";

import { toTagView } from "../apps/web/src/lib/tag-view-lib";

const group = (slug: string, categories: string[]) => ({
  slug,
  name: slug.toUpperCase(),
  entries: categories.map((category) => ({ category })),
});

describe("toTagView", () => {
  it("summarizes count, top category, and distinct category count", () => {
    expect(toTagView(group("agents", ["mcp", "mcp", "hooks"]))).toEqual({
      slug: "agents",
      name: "AGENTS",
      count: 3,
      topCategory: "mcp",
      categoryCount: 2,
    });
  });

  it("breaks a top-category tie alphabetically", () => {
    expect(toTagView(group("x", ["mcp", "hooks"])).topCategory).toBe("hooks");
  });

  it("handles an empty group", () => {
    expect(toTagView(group("empty", []))).toEqual({
      slug: "empty",
      name: "EMPTY",
      count: 0,
      topCategory: "",
      categoryCount: 0,
    });
  });
});
