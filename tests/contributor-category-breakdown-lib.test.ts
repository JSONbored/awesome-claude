import { describe, expect, it } from "vitest";

import type { Category, Entry } from "../apps/web/src/types/registry";
import { categoryBreakdown } from "../apps/web/src/lib/contributor-category-breakdown-lib";

const entry = (category: Category) => ({ category }) as Entry;

describe("categoryBreakdown", () => {
  it("returns [] for no entries", () => {
    expect(categoryBreakdown([])).toEqual([]);
  });

  it("counts entries per category, most-frequent first", () => {
    expect(
      categoryBreakdown([entry("mcp"), entry("mcp"), entry("hooks")]),
    ).toEqual([
      { category: "mcp", count: 2 },
      { category: "hooks", count: 1 },
    ]);
  });

  it("breaks count ties alphabetically by category id", () => {
    expect(categoryBreakdown([entry("mcp"), entry("hooks")])).toEqual([
      { category: "hooks", count: 1 },
      { category: "mcp", count: 1 },
    ]);
  });
});
