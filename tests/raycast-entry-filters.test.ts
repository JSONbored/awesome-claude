import { describe, expect, it } from "vitest";

// Deep-relative test imports use the `.js` specifier across this repo's suite;
// the bundler maps it to the TypeScript source.
import {
  filterEntriesByCategory,
  filterEntriesBySearchText,
  sortedCategoryOptions,
  type RaycastEntry,
} from "../integrations/raycast/src/feed.js";

function entry(
  slug: string,
  category: string,
  title: string,
  description = "D",
): RaycastEntry {
  return {
    category,
    slug,
    title,
    description,
    tags: [],
    installable: false,
    hasInstallCommand: false,
    hasConfigSnippet: false,
    installCommand: "",
    configSnippet: "",
    copyText: "",
    detailMarkdown: "",
    webUrl: "https://w.example",
    repoUrl: "",
    documentationUrl: "",
    downloadTrust: "external",
    verificationStatus: "validated",
  } as RaycastEntry;
}

const entries = [
  entry("a", "agents", "Alpha Bot"),
  entry("b", "mcp", "Beta Server"),
  entry("c", "agents", "Gamma"),
];

describe("filterEntriesByCategory", () => {
  it("keeps every entry for the 'all' pseudo-category", () => {
    expect(
      filterEntriesByCategory(entries, "all", new Set<string>()),
    ).toHaveLength(3);
  });

  it("filters to a single category", () => {
    expect(
      filterEntriesByCategory(entries, "agents", new Set<string>()).map(
        (item) => item.slug,
      ),
    ).toEqual(["a", "c"]);
  });

  it("filters to the favorites set (keyed by category:slug)", () => {
    // Favorites are stored as the composite entry key, not the bare slug.
    expect(
      filterEntriesByCategory(entries, "favorites", new Set(["mcp:b"])).map(
        (item) => item.slug,
      ),
    ).toEqual(["b"]);
  });
});

describe("filterEntriesBySearchText", () => {
  it("matches entries case-insensitively by their text", () => {
    expect(
      filterEntriesBySearchText(entries, "beta").map((item) => item.slug),
    ).toEqual(["b"]);
  });

  it("returns every entry for a blank query", () => {
    expect(filterEntriesBySearchText(entries, "   ")).toHaveLength(3);
  });
});

describe("sortedCategoryOptions", () => {
  it("lists 'all' and 'favorites' first, then the present categories by label", () => {
    const options = sortedCategoryOptions(entries);
    expect(options.slice(0, 2)).toEqual([
      { value: "all", title: "All Categories" },
      { value: "favorites", title: "Favorites" },
    ]);
    const values = options.map((option) => option.value);
    expect(values).toContain("agents");
    expect(values).toContain("mcp");
  });
});
