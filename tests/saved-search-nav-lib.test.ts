import { describe, expect, it } from "vitest";

import type { SavedSearch } from "../apps/web/src/lib/recents";
import { applyToBrowseSearch } from "../apps/web/src/lib/saved-search-nav-lib";

const search = (over: Partial<SavedSearch> = {}) =>
  ({ q: "", ...over }) as SavedSearch;

describe("applyToBrowseSearch", () => {
  it("defaults every filter to an empty string and sort to popular", () => {
    expect(applyToBrowseSearch(search())).toEqual({
      q: "",
      category: "",
      trust: "",
      source: "",
      platform: "",
      sort: "popular",
      view: "row",
      compare: "",
    });
  });

  it("passes through the provided query and filters", () => {
    const result = applyToBrowseSearch(
      search({
        q: "mcp",
        category: "mcp",
        trust: "trusted",
        source: "official",
        platform: "claude-code",
      }),
    );
    expect(result).toMatchObject({
      q: "mcp",
      category: "mcp",
      trust: "trusted",
      source: "official",
      platform: "claude-code",
    });
  });

  it("preserves an explicit sort", () => {
    expect(applyToBrowseSearch(search({ sort: "newest" })).sort).toBe("newest");
  });

  it("always opens the row view with no active comparison", () => {
    const result = applyToBrowseSearch(search({ q: "x" }));
    expect(result.view).toBe("row");
    expect(result.compare).toBe("");
  });
});
