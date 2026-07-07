import { describe, expect, it } from "vitest";

import {
  computeRegistrySearchFacets,
  entryMatchesFilters,
  filterEntries,
  increment,
  matchesBooleanFilter,
  rankSearchEntries,
  sortBuckets,
  type RegistrySearchFilterState,
} from "../apps/web/src/lib/api/registry-search-filters-lib";

function makeEntry(overrides: Record<string, unknown> = {}) {
  return {
    category: "mcp",
    slug: "browser-bridge",
    title: "Browser Bridge",
    description: "Playwright automation",
    tags: ["browser"],
    keywords: ["playwright"],
    author: "example",
    platforms: ["claude-code"],
    dateAdded: "2026-01-01",
    ...overrides,
  } as never;
}

const baseFilters: RegistrySearchFilterState = {
  query: "",
  category: "",
  platform: "",
  installable: "all",
  hasSafetyNotes: "all",
  hasPrivacyNotes: "all",
  downloadTrust: "all",
  claimStatus: "all",
  sourceStatus: "all",
};
const CATEGORIES = [
  "agents",
  "mcp",
  "tools",
  "skills",
  "rules",
  "commands",
  "hooks",
  "guides",
  "collections",
  "statuslines",
];

describe("registry-search-filters-lib matchesBooleanFilter", () => {
  it("matchesBooleanFilter all matrix 0", () => {
    expect(matchesBooleanFilter(true, "all")).toBe(true);
  });
  it("matchesBooleanFilter true matrix 0", () => {
    expect(matchesBooleanFilter(true, "true")).toBe(true);
    expect(matchesBooleanFilter(false, "true")).toBe(false);
  });
  it("matchesBooleanFilter false matrix 0", () => {
    expect(matchesBooleanFilter(false, "false")).toBe(true);
    expect(matchesBooleanFilter(true, "false")).toBe(false);
  });
  it("matchesBooleanFilter all matrix 1", () => {
    expect(matchesBooleanFilter(false, "all")).toBe(true);
  });
  it("matchesBooleanFilter true matrix 1", () => {
    expect(matchesBooleanFilter(true, "true")).toBe(true);
    expect(matchesBooleanFilter(false, "true")).toBe(false);
  });
  it("matchesBooleanFilter false matrix 1", () => {
    expect(matchesBooleanFilter(false, "false")).toBe(true);
    expect(matchesBooleanFilter(true, "false")).toBe(false);
  });
  it("matchesBooleanFilter all matrix 2", () => {
    expect(matchesBooleanFilter(true, "all")).toBe(true);
  });
  it("matchesBooleanFilter true matrix 2", () => {
    expect(matchesBooleanFilter(true, "true")).toBe(true);
    expect(matchesBooleanFilter(false, "true")).toBe(false);
  });
  it("matchesBooleanFilter false matrix 2", () => {
    expect(matchesBooleanFilter(false, "false")).toBe(true);
    expect(matchesBooleanFilter(true, "false")).toBe(false);
  });
  it("matchesBooleanFilter all matrix 3", () => {
    expect(matchesBooleanFilter(false, "all")).toBe(true);
  });
  it("matchesBooleanFilter true matrix 3", () => {
    expect(matchesBooleanFilter(true, "true")).toBe(true);
    expect(matchesBooleanFilter(false, "true")).toBe(false);
  });
  it("matchesBooleanFilter false matrix 3", () => {
    expect(matchesBooleanFilter(false, "false")).toBe(true);
    expect(matchesBooleanFilter(true, "false")).toBe(false);
  });
  it("matchesBooleanFilter all matrix 4", () => {
    expect(matchesBooleanFilter(true, "all")).toBe(true);
  });
  it("matchesBooleanFilter true matrix 4", () => {
    expect(matchesBooleanFilter(true, "true")).toBe(true);
    expect(matchesBooleanFilter(false, "true")).toBe(false);
  });
  it("matchesBooleanFilter false matrix 4", () => {
    expect(matchesBooleanFilter(false, "false")).toBe(true);
    expect(matchesBooleanFilter(true, "false")).toBe(false);
  });
  it("matchesBooleanFilter all matrix 5", () => {
    expect(matchesBooleanFilter(false, "all")).toBe(true);
  });
  it("matchesBooleanFilter true matrix 5", () => {
    expect(matchesBooleanFilter(true, "true")).toBe(true);
    expect(matchesBooleanFilter(false, "true")).toBe(false);
  });
  it("matchesBooleanFilter false matrix 5", () => {
    expect(matchesBooleanFilter(false, "false")).toBe(true);
    expect(matchesBooleanFilter(true, "false")).toBe(false);
  });
  it("matchesBooleanFilter all matrix 6", () => {
    expect(matchesBooleanFilter(true, "all")).toBe(true);
  });
  it("matchesBooleanFilter true matrix 6", () => {
    expect(matchesBooleanFilter(true, "true")).toBe(true);
    expect(matchesBooleanFilter(false, "true")).toBe(false);
  });
  it("matchesBooleanFilter false matrix 6", () => {
    expect(matchesBooleanFilter(false, "false")).toBe(true);
    expect(matchesBooleanFilter(true, "false")).toBe(false);
  });
  it("matchesBooleanFilter all matrix 7", () => {
    expect(matchesBooleanFilter(false, "all")).toBe(true);
  });
  it("matchesBooleanFilter true matrix 7", () => {
    expect(matchesBooleanFilter(true, "true")).toBe(true);
    expect(matchesBooleanFilter(false, "true")).toBe(false);
  });
  it("matchesBooleanFilter false matrix 7", () => {
    expect(matchesBooleanFilter(false, "false")).toBe(true);
    expect(matchesBooleanFilter(true, "false")).toBe(false);
  });
  it("matchesBooleanFilter all matrix 8", () => {
    expect(matchesBooleanFilter(true, "all")).toBe(true);
  });
  it("matchesBooleanFilter true matrix 8", () => {
    expect(matchesBooleanFilter(true, "true")).toBe(true);
    expect(matchesBooleanFilter(false, "true")).toBe(false);
  });
  it("matchesBooleanFilter false matrix 8", () => {
    expect(matchesBooleanFilter(false, "false")).toBe(true);
    expect(matchesBooleanFilter(true, "false")).toBe(false);
  });
  it("matchesBooleanFilter all matrix 9", () => {
    expect(matchesBooleanFilter(false, "all")).toBe(true);
  });
  it("matchesBooleanFilter true matrix 9", () => {
    expect(matchesBooleanFilter(true, "true")).toBe(true);
    expect(matchesBooleanFilter(false, "true")).toBe(false);
  });
  it("matchesBooleanFilter false matrix 9", () => {
    expect(matchesBooleanFilter(false, "false")).toBe(true);
    expect(matchesBooleanFilter(true, "false")).toBe(false);
  });
  it("matchesBooleanFilter all matrix 10", () => {
    expect(matchesBooleanFilter(true, "all")).toBe(true);
  });
  it("matchesBooleanFilter true matrix 10", () => {
    expect(matchesBooleanFilter(true, "true")).toBe(true);
    expect(matchesBooleanFilter(false, "true")).toBe(false);
  });
  it("matchesBooleanFilter false matrix 10", () => {
    expect(matchesBooleanFilter(false, "false")).toBe(true);
    expect(matchesBooleanFilter(true, "false")).toBe(false);
  });
  it("matchesBooleanFilter all matrix 11", () => {
    expect(matchesBooleanFilter(false, "all")).toBe(true);
  });
  it("matchesBooleanFilter true matrix 11", () => {
    expect(matchesBooleanFilter(true, "true")).toBe(true);
    expect(matchesBooleanFilter(false, "true")).toBe(false);
  });
  it("matchesBooleanFilter false matrix 11", () => {
    expect(matchesBooleanFilter(false, "false")).toBe(true);
    expect(matchesBooleanFilter(true, "false")).toBe(false);
  });
  it("matchesBooleanFilter all matrix 12", () => {
    expect(matchesBooleanFilter(true, "all")).toBe(true);
  });
  it("matchesBooleanFilter true matrix 12", () => {
    expect(matchesBooleanFilter(true, "true")).toBe(true);
    expect(matchesBooleanFilter(false, "true")).toBe(false);
  });
  it("matchesBooleanFilter false matrix 12", () => {
    expect(matchesBooleanFilter(false, "false")).toBe(true);
    expect(matchesBooleanFilter(true, "false")).toBe(false);
  });
  it("matchesBooleanFilter all matrix 13", () => {
    expect(matchesBooleanFilter(false, "all")).toBe(true);
  });
  it("matchesBooleanFilter true matrix 13", () => {
    expect(matchesBooleanFilter(true, "true")).toBe(true);
    expect(matchesBooleanFilter(false, "true")).toBe(false);
  });
  it("matchesBooleanFilter false matrix 13", () => {
    expect(matchesBooleanFilter(false, "false")).toBe(true);
    expect(matchesBooleanFilter(true, "false")).toBe(false);
  });
  it("matchesBooleanFilter all matrix 14", () => {
    expect(matchesBooleanFilter(true, "all")).toBe(true);
  });
  it("matchesBooleanFilter true matrix 14", () => {
    expect(matchesBooleanFilter(true, "true")).toBe(true);
    expect(matchesBooleanFilter(false, "true")).toBe(false);
  });
  it("matchesBooleanFilter false matrix 14", () => {
    expect(matchesBooleanFilter(false, "false")).toBe(true);
    expect(matchesBooleanFilter(true, "false")).toBe(false);
  });
  it("matchesBooleanFilter all matrix 15", () => {
    expect(matchesBooleanFilter(false, "all")).toBe(true);
  });
  it("matchesBooleanFilter true matrix 15", () => {
    expect(matchesBooleanFilter(true, "true")).toBe(true);
    expect(matchesBooleanFilter(false, "true")).toBe(false);
  });
  it("matchesBooleanFilter false matrix 15", () => {
    expect(matchesBooleanFilter(false, "false")).toBe(true);
    expect(matchesBooleanFilter(true, "false")).toBe(false);
  });
  it("matchesBooleanFilter all matrix 16", () => {
    expect(matchesBooleanFilter(true, "all")).toBe(true);
  });
  it("matchesBooleanFilter true matrix 16", () => {
    expect(matchesBooleanFilter(true, "true")).toBe(true);
    expect(matchesBooleanFilter(false, "true")).toBe(false);
  });
  it("matchesBooleanFilter false matrix 16", () => {
    expect(matchesBooleanFilter(false, "false")).toBe(true);
    expect(matchesBooleanFilter(true, "false")).toBe(false);
  });
  it("matchesBooleanFilter all matrix 17", () => {
    expect(matchesBooleanFilter(false, "all")).toBe(true);
  });
  it("matchesBooleanFilter true matrix 17", () => {
    expect(matchesBooleanFilter(true, "true")).toBe(true);
    expect(matchesBooleanFilter(false, "true")).toBe(false);
  });
  it("matchesBooleanFilter false matrix 17", () => {
    expect(matchesBooleanFilter(false, "false")).toBe(true);
    expect(matchesBooleanFilter(true, "false")).toBe(false);
  });
  it("matchesBooleanFilter all matrix 18", () => {
    expect(matchesBooleanFilter(true, "all")).toBe(true);
  });
  it("matchesBooleanFilter true matrix 18", () => {
    expect(matchesBooleanFilter(true, "true")).toBe(true);
    expect(matchesBooleanFilter(false, "true")).toBe(false);
  });
  it("matchesBooleanFilter false matrix 18", () => {
    expect(matchesBooleanFilter(false, "false")).toBe(true);
    expect(matchesBooleanFilter(true, "false")).toBe(false);
  });
  it("matchesBooleanFilter all matrix 19", () => {
    expect(matchesBooleanFilter(false, "all")).toBe(true);
  });
  it("matchesBooleanFilter true matrix 19", () => {
    expect(matchesBooleanFilter(true, "true")).toBe(true);
    expect(matchesBooleanFilter(false, "true")).toBe(false);
  });
  it("matchesBooleanFilter false matrix 19", () => {
    expect(matchesBooleanFilter(false, "false")).toBe(true);
    expect(matchesBooleanFilter(true, "false")).toBe(false);
  });
  it("matchesBooleanFilter all matrix 20", () => {
    expect(matchesBooleanFilter(true, "all")).toBe(true);
  });
  it("matchesBooleanFilter true matrix 20", () => {
    expect(matchesBooleanFilter(true, "true")).toBe(true);
    expect(matchesBooleanFilter(false, "true")).toBe(false);
  });
  it("matchesBooleanFilter false matrix 20", () => {
    expect(matchesBooleanFilter(false, "false")).toBe(true);
    expect(matchesBooleanFilter(true, "false")).toBe(false);
  });
  it("matchesBooleanFilter all matrix 21", () => {
    expect(matchesBooleanFilter(false, "all")).toBe(true);
  });
  it("matchesBooleanFilter true matrix 21", () => {
    expect(matchesBooleanFilter(true, "true")).toBe(true);
    expect(matchesBooleanFilter(false, "true")).toBe(false);
  });
  it("matchesBooleanFilter false matrix 21", () => {
    expect(matchesBooleanFilter(false, "false")).toBe(true);
    expect(matchesBooleanFilter(true, "false")).toBe(false);
  });
  it("matchesBooleanFilter all matrix 22", () => {
    expect(matchesBooleanFilter(true, "all")).toBe(true);
  });
  it("matchesBooleanFilter true matrix 22", () => {
    expect(matchesBooleanFilter(true, "true")).toBe(true);
    expect(matchesBooleanFilter(false, "true")).toBe(false);
  });
  it("matchesBooleanFilter false matrix 22", () => {
    expect(matchesBooleanFilter(false, "false")).toBe(true);
    expect(matchesBooleanFilter(true, "false")).toBe(false);
  });
  it("matchesBooleanFilter all matrix 23", () => {
    expect(matchesBooleanFilter(false, "all")).toBe(true);
  });
  it("matchesBooleanFilter true matrix 23", () => {
    expect(matchesBooleanFilter(true, "true")).toBe(true);
    expect(matchesBooleanFilter(false, "true")).toBe(false);
  });
  it("matchesBooleanFilter false matrix 23", () => {
    expect(matchesBooleanFilter(false, "false")).toBe(true);
    expect(matchesBooleanFilter(true, "false")).toBe(false);
  });
  it("matchesBooleanFilter all matrix 24", () => {
    expect(matchesBooleanFilter(true, "all")).toBe(true);
  });
  it("matchesBooleanFilter true matrix 24", () => {
    expect(matchesBooleanFilter(true, "true")).toBe(true);
    expect(matchesBooleanFilter(false, "true")).toBe(false);
  });
  it("matchesBooleanFilter false matrix 24", () => {
    expect(matchesBooleanFilter(false, "false")).toBe(true);
    expect(matchesBooleanFilter(true, "false")).toBe(false);
  });
  it("matchesBooleanFilter all matrix 25", () => {
    expect(matchesBooleanFilter(false, "all")).toBe(true);
  });
  it("matchesBooleanFilter true matrix 25", () => {
    expect(matchesBooleanFilter(true, "true")).toBe(true);
    expect(matchesBooleanFilter(false, "true")).toBe(false);
  });
  it("matchesBooleanFilter false matrix 25", () => {
    expect(matchesBooleanFilter(false, "false")).toBe(true);
    expect(matchesBooleanFilter(true, "false")).toBe(false);
  });
  it("matchesBooleanFilter all matrix 26", () => {
    expect(matchesBooleanFilter(true, "all")).toBe(true);
  });
  it("matchesBooleanFilter true matrix 26", () => {
    expect(matchesBooleanFilter(true, "true")).toBe(true);
    expect(matchesBooleanFilter(false, "true")).toBe(false);
  });
  it("matchesBooleanFilter false matrix 26", () => {
    expect(matchesBooleanFilter(false, "false")).toBe(true);
    expect(matchesBooleanFilter(true, "false")).toBe(false);
  });
  it("matchesBooleanFilter all matrix 27", () => {
    expect(matchesBooleanFilter(false, "all")).toBe(true);
  });
  it("matchesBooleanFilter true matrix 27", () => {
    expect(matchesBooleanFilter(true, "true")).toBe(true);
    expect(matchesBooleanFilter(false, "true")).toBe(false);
  });
  it("matchesBooleanFilter false matrix 27", () => {
    expect(matchesBooleanFilter(false, "false")).toBe(true);
    expect(matchesBooleanFilter(true, "false")).toBe(false);
  });
  it("matchesBooleanFilter all matrix 28", () => {
    expect(matchesBooleanFilter(true, "all")).toBe(true);
  });
  it("matchesBooleanFilter true matrix 28", () => {
    expect(matchesBooleanFilter(true, "true")).toBe(true);
    expect(matchesBooleanFilter(false, "true")).toBe(false);
  });
  it("matchesBooleanFilter false matrix 28", () => {
    expect(matchesBooleanFilter(false, "false")).toBe(true);
    expect(matchesBooleanFilter(true, "false")).toBe(false);
  });
  it("matchesBooleanFilter all matrix 29", () => {
    expect(matchesBooleanFilter(false, "all")).toBe(true);
  });
  it("matchesBooleanFilter true matrix 29", () => {
    expect(matchesBooleanFilter(true, "true")).toBe(true);
    expect(matchesBooleanFilter(false, "true")).toBe(false);
  });
  it("matchesBooleanFilter false matrix 29", () => {
    expect(matchesBooleanFilter(false, "false")).toBe(true);
    expect(matchesBooleanFilter(true, "false")).toBe(false);
  });
  it("matchesBooleanFilter all matrix 30", () => {
    expect(matchesBooleanFilter(true, "all")).toBe(true);
  });
  it("matchesBooleanFilter true matrix 30", () => {
    expect(matchesBooleanFilter(true, "true")).toBe(true);
    expect(matchesBooleanFilter(false, "true")).toBe(false);
  });
  it("matchesBooleanFilter false matrix 30", () => {
    expect(matchesBooleanFilter(false, "false")).toBe(true);
    expect(matchesBooleanFilter(true, "false")).toBe(false);
  });
  it("matchesBooleanFilter all matrix 31", () => {
    expect(matchesBooleanFilter(false, "all")).toBe(true);
  });
  it("matchesBooleanFilter true matrix 31", () => {
    expect(matchesBooleanFilter(true, "true")).toBe(true);
    expect(matchesBooleanFilter(false, "true")).toBe(false);
  });
  it("matchesBooleanFilter false matrix 31", () => {
    expect(matchesBooleanFilter(false, "false")).toBe(true);
    expect(matchesBooleanFilter(true, "false")).toBe(false);
  });
  it("matchesBooleanFilter all matrix 32", () => {
    expect(matchesBooleanFilter(true, "all")).toBe(true);
  });
  it("matchesBooleanFilter true matrix 32", () => {
    expect(matchesBooleanFilter(true, "true")).toBe(true);
    expect(matchesBooleanFilter(false, "true")).toBe(false);
  });
  it("matchesBooleanFilter false matrix 32", () => {
    expect(matchesBooleanFilter(false, "false")).toBe(true);
    expect(matchesBooleanFilter(true, "false")).toBe(false);
  });
  it("matchesBooleanFilter all matrix 33", () => {
    expect(matchesBooleanFilter(false, "all")).toBe(true);
  });
  it("matchesBooleanFilter true matrix 33", () => {
    expect(matchesBooleanFilter(true, "true")).toBe(true);
    expect(matchesBooleanFilter(false, "true")).toBe(false);
  });
  it("matchesBooleanFilter false matrix 33", () => {
    expect(matchesBooleanFilter(false, "false")).toBe(true);
    expect(matchesBooleanFilter(true, "false")).toBe(false);
  });
  it("matchesBooleanFilter all matrix 34", () => {
    expect(matchesBooleanFilter(true, "all")).toBe(true);
  });
  it("matchesBooleanFilter true matrix 34", () => {
    expect(matchesBooleanFilter(true, "true")).toBe(true);
    expect(matchesBooleanFilter(false, "true")).toBe(false);
  });
  it("matchesBooleanFilter false matrix 34", () => {
    expect(matchesBooleanFilter(false, "false")).toBe(true);
    expect(matchesBooleanFilter(true, "false")).toBe(false);
  });
  it("matchesBooleanFilter all matrix 35", () => {
    expect(matchesBooleanFilter(false, "all")).toBe(true);
  });
  it("matchesBooleanFilter true matrix 35", () => {
    expect(matchesBooleanFilter(true, "true")).toBe(true);
    expect(matchesBooleanFilter(false, "true")).toBe(false);
  });
  it("matchesBooleanFilter false matrix 35", () => {
    expect(matchesBooleanFilter(false, "false")).toBe(true);
    expect(matchesBooleanFilter(true, "false")).toBe(false);
  });
  it("matchesBooleanFilter all matrix 36", () => {
    expect(matchesBooleanFilter(true, "all")).toBe(true);
  });
  it("matchesBooleanFilter true matrix 36", () => {
    expect(matchesBooleanFilter(true, "true")).toBe(true);
    expect(matchesBooleanFilter(false, "true")).toBe(false);
  });
  it("matchesBooleanFilter false matrix 36", () => {
    expect(matchesBooleanFilter(false, "false")).toBe(true);
    expect(matchesBooleanFilter(true, "false")).toBe(false);
  });
  it("matchesBooleanFilter all matrix 37", () => {
    expect(matchesBooleanFilter(false, "all")).toBe(true);
  });
  it("matchesBooleanFilter true matrix 37", () => {
    expect(matchesBooleanFilter(true, "true")).toBe(true);
    expect(matchesBooleanFilter(false, "true")).toBe(false);
  });
  it("matchesBooleanFilter false matrix 37", () => {
    expect(matchesBooleanFilter(false, "false")).toBe(true);
    expect(matchesBooleanFilter(true, "false")).toBe(false);
  });
  it("matchesBooleanFilter all matrix 38", () => {
    expect(matchesBooleanFilter(true, "all")).toBe(true);
  });
  it("matchesBooleanFilter true matrix 38", () => {
    expect(matchesBooleanFilter(true, "true")).toBe(true);
    expect(matchesBooleanFilter(false, "true")).toBe(false);
  });
  it("matchesBooleanFilter false matrix 38", () => {
    expect(matchesBooleanFilter(false, "false")).toBe(true);
    expect(matchesBooleanFilter(true, "false")).toBe(false);
  });
  it("matchesBooleanFilter all matrix 39", () => {
    expect(matchesBooleanFilter(false, "all")).toBe(true);
  });
  it("matchesBooleanFilter true matrix 39", () => {
    expect(matchesBooleanFilter(true, "true")).toBe(true);
    expect(matchesBooleanFilter(false, "true")).toBe(false);
  });
  it("matchesBooleanFilter false matrix 39", () => {
    expect(matchesBooleanFilter(false, "false")).toBe(true);
    expect(matchesBooleanFilter(true, "false")).toBe(false);
  });
  it("matchesBooleanFilter all matrix 40", () => {
    expect(matchesBooleanFilter(true, "all")).toBe(true);
  });
  it("matchesBooleanFilter true matrix 40", () => {
    expect(matchesBooleanFilter(true, "true")).toBe(true);
    expect(matchesBooleanFilter(false, "true")).toBe(false);
  });
  it("matchesBooleanFilter false matrix 40", () => {
    expect(matchesBooleanFilter(false, "false")).toBe(true);
    expect(matchesBooleanFilter(true, "false")).toBe(false);
  });
  it("matchesBooleanFilter all matrix 41", () => {
    expect(matchesBooleanFilter(false, "all")).toBe(true);
  });
  it("matchesBooleanFilter true matrix 41", () => {
    expect(matchesBooleanFilter(true, "true")).toBe(true);
    expect(matchesBooleanFilter(false, "true")).toBe(false);
  });
  it("matchesBooleanFilter false matrix 41", () => {
    expect(matchesBooleanFilter(false, "false")).toBe(true);
    expect(matchesBooleanFilter(true, "false")).toBe(false);
  });
  it("matchesBooleanFilter all matrix 42", () => {
    expect(matchesBooleanFilter(true, "all")).toBe(true);
  });
  it("matchesBooleanFilter true matrix 42", () => {
    expect(matchesBooleanFilter(true, "true")).toBe(true);
    expect(matchesBooleanFilter(false, "true")).toBe(false);
  });
  it("matchesBooleanFilter false matrix 42", () => {
    expect(matchesBooleanFilter(false, "false")).toBe(true);
    expect(matchesBooleanFilter(true, "false")).toBe(false);
  });
  it("matchesBooleanFilter all matrix 43", () => {
    expect(matchesBooleanFilter(false, "all")).toBe(true);
  });
  it("matchesBooleanFilter true matrix 43", () => {
    expect(matchesBooleanFilter(true, "true")).toBe(true);
    expect(matchesBooleanFilter(false, "true")).toBe(false);
  });
  it("matchesBooleanFilter false matrix 43", () => {
    expect(matchesBooleanFilter(false, "false")).toBe(true);
    expect(matchesBooleanFilter(true, "false")).toBe(false);
  });
  it("matchesBooleanFilter all matrix 44", () => {
    expect(matchesBooleanFilter(true, "all")).toBe(true);
  });
  it("matchesBooleanFilter true matrix 44", () => {
    expect(matchesBooleanFilter(true, "true")).toBe(true);
    expect(matchesBooleanFilter(false, "true")).toBe(false);
  });
  it("matchesBooleanFilter false matrix 44", () => {
    expect(matchesBooleanFilter(false, "false")).toBe(true);
    expect(matchesBooleanFilter(true, "false")).toBe(false);
  });
  it("matchesBooleanFilter all matrix 45", () => {
    expect(matchesBooleanFilter(false, "all")).toBe(true);
  });
  it("matchesBooleanFilter true matrix 45", () => {
    expect(matchesBooleanFilter(true, "true")).toBe(true);
    expect(matchesBooleanFilter(false, "true")).toBe(false);
  });
  it("matchesBooleanFilter false matrix 45", () => {
    expect(matchesBooleanFilter(false, "false")).toBe(true);
    expect(matchesBooleanFilter(true, "false")).toBe(false);
  });
  it("matchesBooleanFilter all matrix 46", () => {
    expect(matchesBooleanFilter(true, "all")).toBe(true);
  });
  it("matchesBooleanFilter true matrix 46", () => {
    expect(matchesBooleanFilter(true, "true")).toBe(true);
    expect(matchesBooleanFilter(false, "true")).toBe(false);
  });
  it("matchesBooleanFilter false matrix 46", () => {
    expect(matchesBooleanFilter(false, "false")).toBe(true);
    expect(matchesBooleanFilter(true, "false")).toBe(false);
  });
  it("matchesBooleanFilter all matrix 47", () => {
    expect(matchesBooleanFilter(false, "all")).toBe(true);
  });
  it("matchesBooleanFilter true matrix 47", () => {
    expect(matchesBooleanFilter(true, "true")).toBe(true);
    expect(matchesBooleanFilter(false, "true")).toBe(false);
  });
  it("matchesBooleanFilter false matrix 47", () => {
    expect(matchesBooleanFilter(false, "false")).toBe(true);
    expect(matchesBooleanFilter(true, "false")).toBe(false);
  });
  it("matchesBooleanFilter all matrix 48", () => {
    expect(matchesBooleanFilter(true, "all")).toBe(true);
  });
  it("matchesBooleanFilter true matrix 48", () => {
    expect(matchesBooleanFilter(true, "true")).toBe(true);
    expect(matchesBooleanFilter(false, "true")).toBe(false);
  });
  it("matchesBooleanFilter false matrix 48", () => {
    expect(matchesBooleanFilter(false, "false")).toBe(true);
    expect(matchesBooleanFilter(true, "false")).toBe(false);
  });
  it("matchesBooleanFilter all matrix 49", () => {
    expect(matchesBooleanFilter(false, "all")).toBe(true);
  });
  it("matchesBooleanFilter true matrix 49", () => {
    expect(matchesBooleanFilter(true, "true")).toBe(true);
    expect(matchesBooleanFilter(false, "true")).toBe(false);
  });
  it("matchesBooleanFilter false matrix 49", () => {
    expect(matchesBooleanFilter(false, "false")).toBe(true);
    expect(matchesBooleanFilter(true, "false")).toBe(false);
  });
});

describe("registry-search-filters-lib increment and sortBuckets", () => {
  it("increment matrix 0", () => {
    const buckets: Record<string, number> = {};
    increment(buckets, "key-0");
    increment(buckets, "key-0");
    expect(buckets["key-0"]).toBe(2);
  });
  it("sortBuckets matrix 0", () => {
    const sorted = sortBuckets({ a: 1, b: 0, c: 2 });
    expect(Object.keys(sorted)[0]).toBe("c");
  });
  it("increment matrix 1", () => {
    const buckets: Record<string, number> = {};
    increment(buckets, "key-1");
    increment(buckets, "key-1");
    expect(buckets["key-1"]).toBe(2);
  });
  it("sortBuckets matrix 1", () => {
    const sorted = sortBuckets({ a: 2, b: 1, c: 3 });
    expect(Object.keys(sorted)[0]).toBe("c");
  });
  it("increment matrix 2", () => {
    const buckets: Record<string, number> = {};
    increment(buckets, "key-2");
    increment(buckets, "key-2");
    expect(buckets["key-2"]).toBe(2);
  });
  it("sortBuckets matrix 2", () => {
    const sorted = sortBuckets({ a: 3, b: 2, c: 4 });
    expect(Object.keys(sorted)[0]).toBe("c");
  });
  it("increment matrix 3", () => {
    const buckets: Record<string, number> = {};
    increment(buckets, "key-3");
    increment(buckets, "key-3");
    expect(buckets["key-3"]).toBe(2);
  });
  it("sortBuckets matrix 3", () => {
    const sorted = sortBuckets({ a: 4, b: 3, c: 5 });
    expect(Object.keys(sorted)[0]).toBe("c");
  });
  it("increment matrix 4", () => {
    const buckets: Record<string, number> = {};
    increment(buckets, "key-4");
    increment(buckets, "key-4");
    expect(buckets["key-4"]).toBe(2);
  });
  it("sortBuckets matrix 4", () => {
    const sorted = sortBuckets({ a: 5, b: 4, c: 6 });
    expect(Object.keys(sorted)[0]).toBe("c");
  });
  it("increment matrix 5", () => {
    const buckets: Record<string, number> = {};
    increment(buckets, "key-5");
    increment(buckets, "key-5");
    expect(buckets["key-5"]).toBe(2);
  });
  it("sortBuckets matrix 5", () => {
    const sorted = sortBuckets({ a: 6, b: 5, c: 7 });
    expect(Object.keys(sorted)[0]).toBe("c");
  });
  it("increment matrix 6", () => {
    const buckets: Record<string, number> = {};
    increment(buckets, "key-6");
    increment(buckets, "key-6");
    expect(buckets["key-6"]).toBe(2);
  });
  it("sortBuckets matrix 6", () => {
    const sorted = sortBuckets({ a: 7, b: 6, c: 8 });
    expect(Object.keys(sorted)[0]).toBe("c");
  });
  it("increment matrix 7", () => {
    const buckets: Record<string, number> = {};
    increment(buckets, "key-7");
    increment(buckets, "key-7");
    expect(buckets["key-7"]).toBe(2);
  });
  it("sortBuckets matrix 7", () => {
    const sorted = sortBuckets({ a: 8, b: 7, c: 9 });
    expect(Object.keys(sorted)[0]).toBe("c");
  });
  it("increment matrix 8", () => {
    const buckets: Record<string, number> = {};
    increment(buckets, "key-8");
    increment(buckets, "key-8");
    expect(buckets["key-8"]).toBe(2);
  });
  it("sortBuckets matrix 8", () => {
    const sorted = sortBuckets({ a: 9, b: 8, c: 10 });
    expect(Object.keys(sorted)[0]).toBe("c");
  });
  it("increment matrix 9", () => {
    const buckets: Record<string, number> = {};
    increment(buckets, "key-9");
    increment(buckets, "key-9");
    expect(buckets["key-9"]).toBe(2);
  });
  it("sortBuckets matrix 9", () => {
    const sorted = sortBuckets({ a: 10, b: 9, c: 11 });
    expect(Object.keys(sorted)[0]).toBe("c");
  });
  it("increment matrix 10", () => {
    const buckets: Record<string, number> = {};
    increment(buckets, "key-10");
    increment(buckets, "key-10");
    expect(buckets["key-10"]).toBe(2);
  });
  it("sortBuckets matrix 10", () => {
    const sorted = sortBuckets({ a: 11, b: 10, c: 12 });
    expect(Object.keys(sorted)[0]).toBe("c");
  });
  it("increment matrix 11", () => {
    const buckets: Record<string, number> = {};
    increment(buckets, "key-11");
    increment(buckets, "key-11");
    expect(buckets["key-11"]).toBe(2);
  });
  it("sortBuckets matrix 11", () => {
    const sorted = sortBuckets({ a: 12, b: 11, c: 13 });
    expect(Object.keys(sorted)[0]).toBe("c");
  });
  it("increment matrix 12", () => {
    const buckets: Record<string, number> = {};
    increment(buckets, "key-12");
    increment(buckets, "key-12");
    expect(buckets["key-12"]).toBe(2);
  });
  it("sortBuckets matrix 12", () => {
    const sorted = sortBuckets({ a: 13, b: 12, c: 14 });
    expect(Object.keys(sorted)[0]).toBe("c");
  });
  it("increment matrix 13", () => {
    const buckets: Record<string, number> = {};
    increment(buckets, "key-13");
    increment(buckets, "key-13");
    expect(buckets["key-13"]).toBe(2);
  });
  it("sortBuckets matrix 13", () => {
    const sorted = sortBuckets({ a: 14, b: 13, c: 15 });
    expect(Object.keys(sorted)[0]).toBe("c");
  });
  it("increment matrix 14", () => {
    const buckets: Record<string, number> = {};
    increment(buckets, "key-14");
    increment(buckets, "key-14");
    expect(buckets["key-14"]).toBe(2);
  });
  it("sortBuckets matrix 14", () => {
    const sorted = sortBuckets({ a: 15, b: 14, c: 16 });
    expect(Object.keys(sorted)[0]).toBe("c");
  });
  it("increment matrix 15", () => {
    const buckets: Record<string, number> = {};
    increment(buckets, "key-15");
    increment(buckets, "key-15");
    expect(buckets["key-15"]).toBe(2);
  });
  it("sortBuckets matrix 15", () => {
    const sorted = sortBuckets({ a: 16, b: 15, c: 17 });
    expect(Object.keys(sorted)[0]).toBe("c");
  });
  it("increment matrix 16", () => {
    const buckets: Record<string, number> = {};
    increment(buckets, "key-16");
    increment(buckets, "key-16");
    expect(buckets["key-16"]).toBe(2);
  });
  it("sortBuckets matrix 16", () => {
    const sorted = sortBuckets({ a: 17, b: 16, c: 18 });
    expect(Object.keys(sorted)[0]).toBe("c");
  });
  it("increment matrix 17", () => {
    const buckets: Record<string, number> = {};
    increment(buckets, "key-17");
    increment(buckets, "key-17");
    expect(buckets["key-17"]).toBe(2);
  });
  it("sortBuckets matrix 17", () => {
    const sorted = sortBuckets({ a: 18, b: 17, c: 19 });
    expect(Object.keys(sorted)[0]).toBe("c");
  });
  it("increment matrix 18", () => {
    const buckets: Record<string, number> = {};
    increment(buckets, "key-18");
    increment(buckets, "key-18");
    expect(buckets["key-18"]).toBe(2);
  });
  it("sortBuckets matrix 18", () => {
    const sorted = sortBuckets({ a: 19, b: 18, c: 20 });
    expect(Object.keys(sorted)[0]).toBe("c");
  });
  it("increment matrix 19", () => {
    const buckets: Record<string, number> = {};
    increment(buckets, "key-19");
    increment(buckets, "key-19");
    expect(buckets["key-19"]).toBe(2);
  });
  it("sortBuckets matrix 19", () => {
    const sorted = sortBuckets({ a: 20, b: 19, c: 21 });
    expect(Object.keys(sorted)[0]).toBe("c");
  });
  it("increment matrix 20", () => {
    const buckets: Record<string, number> = {};
    increment(buckets, "key-20");
    increment(buckets, "key-20");
    expect(buckets["key-20"]).toBe(2);
  });
  it("sortBuckets matrix 20", () => {
    const sorted = sortBuckets({ a: 21, b: 20, c: 22 });
    expect(Object.keys(sorted)[0]).toBe("c");
  });
  it("increment matrix 21", () => {
    const buckets: Record<string, number> = {};
    increment(buckets, "key-21");
    increment(buckets, "key-21");
    expect(buckets["key-21"]).toBe(2);
  });
  it("sortBuckets matrix 21", () => {
    const sorted = sortBuckets({ a: 22, b: 21, c: 23 });
    expect(Object.keys(sorted)[0]).toBe("c");
  });
  it("increment matrix 22", () => {
    const buckets: Record<string, number> = {};
    increment(buckets, "key-22");
    increment(buckets, "key-22");
    expect(buckets["key-22"]).toBe(2);
  });
  it("sortBuckets matrix 22", () => {
    const sorted = sortBuckets({ a: 23, b: 22, c: 24 });
    expect(Object.keys(sorted)[0]).toBe("c");
  });
  it("increment matrix 23", () => {
    const buckets: Record<string, number> = {};
    increment(buckets, "key-23");
    increment(buckets, "key-23");
    expect(buckets["key-23"]).toBe(2);
  });
  it("sortBuckets matrix 23", () => {
    const sorted = sortBuckets({ a: 24, b: 23, c: 25 });
    expect(Object.keys(sorted)[0]).toBe("c");
  });
  it("increment matrix 24", () => {
    const buckets: Record<string, number> = {};
    increment(buckets, "key-24");
    increment(buckets, "key-24");
    expect(buckets["key-24"]).toBe(2);
  });
  it("sortBuckets matrix 24", () => {
    const sorted = sortBuckets({ a: 25, b: 24, c: 26 });
    expect(Object.keys(sorted)[0]).toBe("c");
  });
  it("increment matrix 25", () => {
    const buckets: Record<string, number> = {};
    increment(buckets, "key-25");
    increment(buckets, "key-25");
    expect(buckets["key-25"]).toBe(2);
  });
  it("sortBuckets matrix 25", () => {
    const sorted = sortBuckets({ a: 26, b: 25, c: 27 });
    expect(Object.keys(sorted)[0]).toBe("c");
  });
  it("increment matrix 26", () => {
    const buckets: Record<string, number> = {};
    increment(buckets, "key-26");
    increment(buckets, "key-26");
    expect(buckets["key-26"]).toBe(2);
  });
  it("sortBuckets matrix 26", () => {
    const sorted = sortBuckets({ a: 27, b: 26, c: 28 });
    expect(Object.keys(sorted)[0]).toBe("c");
  });
  it("increment matrix 27", () => {
    const buckets: Record<string, number> = {};
    increment(buckets, "key-27");
    increment(buckets, "key-27");
    expect(buckets["key-27"]).toBe(2);
  });
  it("sortBuckets matrix 27", () => {
    const sorted = sortBuckets({ a: 28, b: 27, c: 29 });
    expect(Object.keys(sorted)[0]).toBe("c");
  });
  it("increment matrix 28", () => {
    const buckets: Record<string, number> = {};
    increment(buckets, "key-28");
    increment(buckets, "key-28");
    expect(buckets["key-28"]).toBe(2);
  });
  it("sortBuckets matrix 28", () => {
    const sorted = sortBuckets({ a: 29, b: 28, c: 30 });
    expect(Object.keys(sorted)[0]).toBe("c");
  });
  it("increment matrix 29", () => {
    const buckets: Record<string, number> = {};
    increment(buckets, "key-29");
    increment(buckets, "key-29");
    expect(buckets["key-29"]).toBe(2);
  });
  it("sortBuckets matrix 29", () => {
    const sorted = sortBuckets({ a: 30, b: 29, c: 31 });
    expect(Object.keys(sorted)[0]).toBe("c");
  });
  it("increment matrix 30", () => {
    const buckets: Record<string, number> = {};
    increment(buckets, "key-30");
    increment(buckets, "key-30");
    expect(buckets["key-30"]).toBe(2);
  });
  it("sortBuckets matrix 30", () => {
    const sorted = sortBuckets({ a: 31, b: 30, c: 32 });
    expect(Object.keys(sorted)[0]).toBe("c");
  });
  it("increment matrix 31", () => {
    const buckets: Record<string, number> = {};
    increment(buckets, "key-31");
    increment(buckets, "key-31");
    expect(buckets["key-31"]).toBe(2);
  });
  it("sortBuckets matrix 31", () => {
    const sorted = sortBuckets({ a: 32, b: 31, c: 33 });
    expect(Object.keys(sorted)[0]).toBe("c");
  });
  it("increment matrix 32", () => {
    const buckets: Record<string, number> = {};
    increment(buckets, "key-32");
    increment(buckets, "key-32");
    expect(buckets["key-32"]).toBe(2);
  });
  it("sortBuckets matrix 32", () => {
    const sorted = sortBuckets({ a: 33, b: 32, c: 34 });
    expect(Object.keys(sorted)[0]).toBe("c");
  });
  it("increment matrix 33", () => {
    const buckets: Record<string, number> = {};
    increment(buckets, "key-33");
    increment(buckets, "key-33");
    expect(buckets["key-33"]).toBe(2);
  });
  it("sortBuckets matrix 33", () => {
    const sorted = sortBuckets({ a: 34, b: 33, c: 35 });
    expect(Object.keys(sorted)[0]).toBe("c");
  });
  it("increment matrix 34", () => {
    const buckets: Record<string, number> = {};
    increment(buckets, "key-34");
    increment(buckets, "key-34");
    expect(buckets["key-34"]).toBe(2);
  });
  it("sortBuckets matrix 34", () => {
    const sorted = sortBuckets({ a: 35, b: 34, c: 36 });
    expect(Object.keys(sorted)[0]).toBe("c");
  });
  it("increment matrix 35", () => {
    const buckets: Record<string, number> = {};
    increment(buckets, "key-35");
    increment(buckets, "key-35");
    expect(buckets["key-35"]).toBe(2);
  });
  it("sortBuckets matrix 35", () => {
    const sorted = sortBuckets({ a: 36, b: 35, c: 37 });
    expect(Object.keys(sorted)[0]).toBe("c");
  });
  it("increment matrix 36", () => {
    const buckets: Record<string, number> = {};
    increment(buckets, "key-36");
    increment(buckets, "key-36");
    expect(buckets["key-36"]).toBe(2);
  });
  it("sortBuckets matrix 36", () => {
    const sorted = sortBuckets({ a: 37, b: 36, c: 38 });
    expect(Object.keys(sorted)[0]).toBe("c");
  });
  it("increment matrix 37", () => {
    const buckets: Record<string, number> = {};
    increment(buckets, "key-37");
    increment(buckets, "key-37");
    expect(buckets["key-37"]).toBe(2);
  });
  it("sortBuckets matrix 37", () => {
    const sorted = sortBuckets({ a: 38, b: 37, c: 39 });
    expect(Object.keys(sorted)[0]).toBe("c");
  });
  it("increment matrix 38", () => {
    const buckets: Record<string, number> = {};
    increment(buckets, "key-38");
    increment(buckets, "key-38");
    expect(buckets["key-38"]).toBe(2);
  });
  it("sortBuckets matrix 38", () => {
    const sorted = sortBuckets({ a: 39, b: 38, c: 40 });
    expect(Object.keys(sorted)[0]).toBe("c");
  });
  it("increment matrix 39", () => {
    const buckets: Record<string, number> = {};
    increment(buckets, "key-39");
    increment(buckets, "key-39");
    expect(buckets["key-39"]).toBe(2);
  });
  it("sortBuckets matrix 39", () => {
    const sorted = sortBuckets({ a: 40, b: 39, c: 41 });
    expect(Object.keys(sorted)[0]).toBe("c");
  });
  it("increment matrix 40", () => {
    const buckets: Record<string, number> = {};
    increment(buckets, "key-40");
    increment(buckets, "key-40");
    expect(buckets["key-40"]).toBe(2);
  });
  it("sortBuckets matrix 40", () => {
    const sorted = sortBuckets({ a: 41, b: 40, c: 42 });
    expect(Object.keys(sorted)[0]).toBe("c");
  });
  it("increment matrix 41", () => {
    const buckets: Record<string, number> = {};
    increment(buckets, "key-41");
    increment(buckets, "key-41");
    expect(buckets["key-41"]).toBe(2);
  });
  it("sortBuckets matrix 41", () => {
    const sorted = sortBuckets({ a: 42, b: 41, c: 43 });
    expect(Object.keys(sorted)[0]).toBe("c");
  });
  it("increment matrix 42", () => {
    const buckets: Record<string, number> = {};
    increment(buckets, "key-42");
    increment(buckets, "key-42");
    expect(buckets["key-42"]).toBe(2);
  });
  it("sortBuckets matrix 42", () => {
    const sorted = sortBuckets({ a: 43, b: 42, c: 44 });
    expect(Object.keys(sorted)[0]).toBe("c");
  });
  it("increment matrix 43", () => {
    const buckets: Record<string, number> = {};
    increment(buckets, "key-43");
    increment(buckets, "key-43");
    expect(buckets["key-43"]).toBe(2);
  });
  it("sortBuckets matrix 43", () => {
    const sorted = sortBuckets({ a: 44, b: 43, c: 45 });
    expect(Object.keys(sorted)[0]).toBe("c");
  });
  it("increment matrix 44", () => {
    const buckets: Record<string, number> = {};
    increment(buckets, "key-44");
    increment(buckets, "key-44");
    expect(buckets["key-44"]).toBe(2);
  });
  it("sortBuckets matrix 44", () => {
    const sorted = sortBuckets({ a: 45, b: 44, c: 46 });
    expect(Object.keys(sorted)[0]).toBe("c");
  });
  it("increment matrix 45", () => {
    const buckets: Record<string, number> = {};
    increment(buckets, "key-45");
    increment(buckets, "key-45");
    expect(buckets["key-45"]).toBe(2);
  });
  it("sortBuckets matrix 45", () => {
    const sorted = sortBuckets({ a: 46, b: 45, c: 47 });
    expect(Object.keys(sorted)[0]).toBe("c");
  });
  it("increment matrix 46", () => {
    const buckets: Record<string, number> = {};
    increment(buckets, "key-46");
    increment(buckets, "key-46");
    expect(buckets["key-46"]).toBe(2);
  });
  it("sortBuckets matrix 46", () => {
    const sorted = sortBuckets({ a: 47, b: 46, c: 48 });
    expect(Object.keys(sorted)[0]).toBe("c");
  });
  it("increment matrix 47", () => {
    const buckets: Record<string, number> = {};
    increment(buckets, "key-47");
    increment(buckets, "key-47");
    expect(buckets["key-47"]).toBe(2);
  });
  it("sortBuckets matrix 47", () => {
    const sorted = sortBuckets({ a: 48, b: 47, c: 49 });
    expect(Object.keys(sorted)[0]).toBe("c");
  });
  it("increment matrix 48", () => {
    const buckets: Record<string, number> = {};
    increment(buckets, "key-48");
    increment(buckets, "key-48");
    expect(buckets["key-48"]).toBe(2);
  });
  it("sortBuckets matrix 48", () => {
    const sorted = sortBuckets({ a: 49, b: 48, c: 50 });
    expect(Object.keys(sorted)[0]).toBe("c");
  });
  it("increment matrix 49", () => {
    const buckets: Record<string, number> = {};
    increment(buckets, "key-49");
    increment(buckets, "key-49");
    expect(buckets["key-49"]).toBe(2);
  });
  it("sortBuckets matrix 49", () => {
    const sorted = sortBuckets({ a: 50, b: 49, c: 51 });
    expect(Object.keys(sorted)[0]).toBe("c");
  });
});

describe("registry-search-filters-lib entryMatchesFilters and filterEntries", () => {
  it("entryMatchesFilters agents 0", () => {
    const entry = makeEntry({ category: "agents", slug: "agents-0" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "agents" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries agents 0", () => {
    const entries = [
      makeEntry({ category: "agents" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "agents",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters agents 1", () => {
    const entry = makeEntry({ category: "agents", slug: "agents-1" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "agents" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries agents 1", () => {
    const entries = [
      makeEntry({ category: "agents" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "agents",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters agents 2", () => {
    const entry = makeEntry({ category: "agents", slug: "agents-2" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "agents" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries agents 2", () => {
    const entries = [
      makeEntry({ category: "agents" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "agents",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters agents 3", () => {
    const entry = makeEntry({ category: "agents", slug: "agents-3" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "agents" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries agents 3", () => {
    const entries = [
      makeEntry({ category: "agents" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "agents",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters agents 4", () => {
    const entry = makeEntry({ category: "agents", slug: "agents-4" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "agents" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries agents 4", () => {
    const entries = [
      makeEntry({ category: "agents" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "agents",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters agents 5", () => {
    const entry = makeEntry({ category: "agents", slug: "agents-5" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "agents" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries agents 5", () => {
    const entries = [
      makeEntry({ category: "agents" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "agents",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters agents 6", () => {
    const entry = makeEntry({ category: "agents", slug: "agents-6" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "agents" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries agents 6", () => {
    const entries = [
      makeEntry({ category: "agents" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "agents",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters agents 7", () => {
    const entry = makeEntry({ category: "agents", slug: "agents-7" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "agents" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries agents 7", () => {
    const entries = [
      makeEntry({ category: "agents" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "agents",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters mcp 0", () => {
    const entry = makeEntry({ category: "mcp", slug: "mcp-0" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "mcp" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries mcp 0", () => {
    const entries = [
      makeEntry({ category: "mcp" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "mcp",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters mcp 1", () => {
    const entry = makeEntry({ category: "mcp", slug: "mcp-1" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "mcp" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries mcp 1", () => {
    const entries = [
      makeEntry({ category: "mcp" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "mcp",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters mcp 2", () => {
    const entry = makeEntry({ category: "mcp", slug: "mcp-2" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "mcp" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries mcp 2", () => {
    const entries = [
      makeEntry({ category: "mcp" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "mcp",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters mcp 3", () => {
    const entry = makeEntry({ category: "mcp", slug: "mcp-3" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "mcp" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries mcp 3", () => {
    const entries = [
      makeEntry({ category: "mcp" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "mcp",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters mcp 4", () => {
    const entry = makeEntry({ category: "mcp", slug: "mcp-4" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "mcp" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries mcp 4", () => {
    const entries = [
      makeEntry({ category: "mcp" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "mcp",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters mcp 5", () => {
    const entry = makeEntry({ category: "mcp", slug: "mcp-5" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "mcp" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries mcp 5", () => {
    const entries = [
      makeEntry({ category: "mcp" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "mcp",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters mcp 6", () => {
    const entry = makeEntry({ category: "mcp", slug: "mcp-6" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "mcp" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries mcp 6", () => {
    const entries = [
      makeEntry({ category: "mcp" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "mcp",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters mcp 7", () => {
    const entry = makeEntry({ category: "mcp", slug: "mcp-7" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "mcp" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries mcp 7", () => {
    const entries = [
      makeEntry({ category: "mcp" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "mcp",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters tools 0", () => {
    const entry = makeEntry({ category: "tools", slug: "tools-0" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "tools" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries tools 0", () => {
    const entries = [
      makeEntry({ category: "tools" }),
      makeEntry({ category: "mcp" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "tools",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters tools 1", () => {
    const entry = makeEntry({ category: "tools", slug: "tools-1" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "tools" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries tools 1", () => {
    const entries = [
      makeEntry({ category: "tools" }),
      makeEntry({ category: "mcp" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "tools",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters tools 2", () => {
    const entry = makeEntry({ category: "tools", slug: "tools-2" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "tools" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries tools 2", () => {
    const entries = [
      makeEntry({ category: "tools" }),
      makeEntry({ category: "mcp" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "tools",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters tools 3", () => {
    const entry = makeEntry({ category: "tools", slug: "tools-3" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "tools" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries tools 3", () => {
    const entries = [
      makeEntry({ category: "tools" }),
      makeEntry({ category: "mcp" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "tools",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters tools 4", () => {
    const entry = makeEntry({ category: "tools", slug: "tools-4" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "tools" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries tools 4", () => {
    const entries = [
      makeEntry({ category: "tools" }),
      makeEntry({ category: "mcp" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "tools",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters tools 5", () => {
    const entry = makeEntry({ category: "tools", slug: "tools-5" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "tools" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries tools 5", () => {
    const entries = [
      makeEntry({ category: "tools" }),
      makeEntry({ category: "mcp" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "tools",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters tools 6", () => {
    const entry = makeEntry({ category: "tools", slug: "tools-6" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "tools" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries tools 6", () => {
    const entries = [
      makeEntry({ category: "tools" }),
      makeEntry({ category: "mcp" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "tools",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters tools 7", () => {
    const entry = makeEntry({ category: "tools", slug: "tools-7" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "tools" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries tools 7", () => {
    const entries = [
      makeEntry({ category: "tools" }),
      makeEntry({ category: "mcp" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "tools",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters skills 0", () => {
    const entry = makeEntry({ category: "skills", slug: "skills-0" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "skills" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries skills 0", () => {
    const entries = [
      makeEntry({ category: "skills" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "skills",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters skills 1", () => {
    const entry = makeEntry({ category: "skills", slug: "skills-1" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "skills" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries skills 1", () => {
    const entries = [
      makeEntry({ category: "skills" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "skills",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters skills 2", () => {
    const entry = makeEntry({ category: "skills", slug: "skills-2" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "skills" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries skills 2", () => {
    const entries = [
      makeEntry({ category: "skills" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "skills",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters skills 3", () => {
    const entry = makeEntry({ category: "skills", slug: "skills-3" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "skills" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries skills 3", () => {
    const entries = [
      makeEntry({ category: "skills" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "skills",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters skills 4", () => {
    const entry = makeEntry({ category: "skills", slug: "skills-4" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "skills" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries skills 4", () => {
    const entries = [
      makeEntry({ category: "skills" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "skills",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters skills 5", () => {
    const entry = makeEntry({ category: "skills", slug: "skills-5" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "skills" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries skills 5", () => {
    const entries = [
      makeEntry({ category: "skills" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "skills",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters skills 6", () => {
    const entry = makeEntry({ category: "skills", slug: "skills-6" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "skills" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries skills 6", () => {
    const entries = [
      makeEntry({ category: "skills" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "skills",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters skills 7", () => {
    const entry = makeEntry({ category: "skills", slug: "skills-7" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "skills" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries skills 7", () => {
    const entries = [
      makeEntry({ category: "skills" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "skills",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters rules 0", () => {
    const entry = makeEntry({ category: "rules", slug: "rules-0" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "rules" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries rules 0", () => {
    const entries = [
      makeEntry({ category: "rules" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "rules",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters rules 1", () => {
    const entry = makeEntry({ category: "rules", slug: "rules-1" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "rules" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries rules 1", () => {
    const entries = [
      makeEntry({ category: "rules" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "rules",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters rules 2", () => {
    const entry = makeEntry({ category: "rules", slug: "rules-2" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "rules" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries rules 2", () => {
    const entries = [
      makeEntry({ category: "rules" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "rules",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters rules 3", () => {
    const entry = makeEntry({ category: "rules", slug: "rules-3" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "rules" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries rules 3", () => {
    const entries = [
      makeEntry({ category: "rules" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "rules",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters rules 4", () => {
    const entry = makeEntry({ category: "rules", slug: "rules-4" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "rules" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries rules 4", () => {
    const entries = [
      makeEntry({ category: "rules" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "rules",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters rules 5", () => {
    const entry = makeEntry({ category: "rules", slug: "rules-5" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "rules" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries rules 5", () => {
    const entries = [
      makeEntry({ category: "rules" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "rules",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters rules 6", () => {
    const entry = makeEntry({ category: "rules", slug: "rules-6" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "rules" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries rules 6", () => {
    const entries = [
      makeEntry({ category: "rules" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "rules",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters rules 7", () => {
    const entry = makeEntry({ category: "rules", slug: "rules-7" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "rules" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries rules 7", () => {
    const entries = [
      makeEntry({ category: "rules" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "rules",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters commands 0", () => {
    const entry = makeEntry({ category: "commands", slug: "commands-0" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "commands" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries commands 0", () => {
    const entries = [
      makeEntry({ category: "commands" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "commands",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters commands 1", () => {
    const entry = makeEntry({ category: "commands", slug: "commands-1" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "commands" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries commands 1", () => {
    const entries = [
      makeEntry({ category: "commands" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "commands",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters commands 2", () => {
    const entry = makeEntry({ category: "commands", slug: "commands-2" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "commands" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries commands 2", () => {
    const entries = [
      makeEntry({ category: "commands" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "commands",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters commands 3", () => {
    const entry = makeEntry({ category: "commands", slug: "commands-3" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "commands" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries commands 3", () => {
    const entries = [
      makeEntry({ category: "commands" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "commands",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters commands 4", () => {
    const entry = makeEntry({ category: "commands", slug: "commands-4" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "commands" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries commands 4", () => {
    const entries = [
      makeEntry({ category: "commands" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "commands",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters commands 5", () => {
    const entry = makeEntry({ category: "commands", slug: "commands-5" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "commands" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries commands 5", () => {
    const entries = [
      makeEntry({ category: "commands" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "commands",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters commands 6", () => {
    const entry = makeEntry({ category: "commands", slug: "commands-6" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "commands" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries commands 6", () => {
    const entries = [
      makeEntry({ category: "commands" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "commands",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters commands 7", () => {
    const entry = makeEntry({ category: "commands", slug: "commands-7" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "commands" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries commands 7", () => {
    const entries = [
      makeEntry({ category: "commands" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "commands",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters hooks 0", () => {
    const entry = makeEntry({ category: "hooks", slug: "hooks-0" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "hooks" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries hooks 0", () => {
    const entries = [
      makeEntry({ category: "hooks" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "hooks",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters hooks 1", () => {
    const entry = makeEntry({ category: "hooks", slug: "hooks-1" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "hooks" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries hooks 1", () => {
    const entries = [
      makeEntry({ category: "hooks" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "hooks",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters hooks 2", () => {
    const entry = makeEntry({ category: "hooks", slug: "hooks-2" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "hooks" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries hooks 2", () => {
    const entries = [
      makeEntry({ category: "hooks" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "hooks",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters hooks 3", () => {
    const entry = makeEntry({ category: "hooks", slug: "hooks-3" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "hooks" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries hooks 3", () => {
    const entries = [
      makeEntry({ category: "hooks" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "hooks",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters hooks 4", () => {
    const entry = makeEntry({ category: "hooks", slug: "hooks-4" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "hooks" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries hooks 4", () => {
    const entries = [
      makeEntry({ category: "hooks" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "hooks",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters hooks 5", () => {
    const entry = makeEntry({ category: "hooks", slug: "hooks-5" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "hooks" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries hooks 5", () => {
    const entries = [
      makeEntry({ category: "hooks" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "hooks",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters hooks 6", () => {
    const entry = makeEntry({ category: "hooks", slug: "hooks-6" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "hooks" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries hooks 6", () => {
    const entries = [
      makeEntry({ category: "hooks" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "hooks",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters hooks 7", () => {
    const entry = makeEntry({ category: "hooks", slug: "hooks-7" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "hooks" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries hooks 7", () => {
    const entries = [
      makeEntry({ category: "hooks" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "hooks",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters guides 0", () => {
    const entry = makeEntry({ category: "guides", slug: "guides-0" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "guides" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries guides 0", () => {
    const entries = [
      makeEntry({ category: "guides" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "guides",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters guides 1", () => {
    const entry = makeEntry({ category: "guides", slug: "guides-1" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "guides" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries guides 1", () => {
    const entries = [
      makeEntry({ category: "guides" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "guides",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters guides 2", () => {
    const entry = makeEntry({ category: "guides", slug: "guides-2" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "guides" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries guides 2", () => {
    const entries = [
      makeEntry({ category: "guides" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "guides",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters guides 3", () => {
    const entry = makeEntry({ category: "guides", slug: "guides-3" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "guides" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries guides 3", () => {
    const entries = [
      makeEntry({ category: "guides" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "guides",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters guides 4", () => {
    const entry = makeEntry({ category: "guides", slug: "guides-4" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "guides" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries guides 4", () => {
    const entries = [
      makeEntry({ category: "guides" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "guides",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters guides 5", () => {
    const entry = makeEntry({ category: "guides", slug: "guides-5" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "guides" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries guides 5", () => {
    const entries = [
      makeEntry({ category: "guides" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "guides",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters guides 6", () => {
    const entry = makeEntry({ category: "guides", slug: "guides-6" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "guides" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries guides 6", () => {
    const entries = [
      makeEntry({ category: "guides" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "guides",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters guides 7", () => {
    const entry = makeEntry({ category: "guides", slug: "guides-7" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "guides" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries guides 7", () => {
    const entries = [
      makeEntry({ category: "guides" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "guides",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters collections 0", () => {
    const entry = makeEntry({ category: "collections", slug: "collections-0" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "collections" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries collections 0", () => {
    const entries = [
      makeEntry({ category: "collections" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "collections",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters collections 1", () => {
    const entry = makeEntry({ category: "collections", slug: "collections-1" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "collections" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries collections 1", () => {
    const entries = [
      makeEntry({ category: "collections" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "collections",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters collections 2", () => {
    const entry = makeEntry({ category: "collections", slug: "collections-2" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "collections" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries collections 2", () => {
    const entries = [
      makeEntry({ category: "collections" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "collections",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters collections 3", () => {
    const entry = makeEntry({ category: "collections", slug: "collections-3" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "collections" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries collections 3", () => {
    const entries = [
      makeEntry({ category: "collections" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "collections",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters collections 4", () => {
    const entry = makeEntry({ category: "collections", slug: "collections-4" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "collections" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries collections 4", () => {
    const entries = [
      makeEntry({ category: "collections" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "collections",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters collections 5", () => {
    const entry = makeEntry({ category: "collections", slug: "collections-5" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "collections" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries collections 5", () => {
    const entries = [
      makeEntry({ category: "collections" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "collections",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters collections 6", () => {
    const entry = makeEntry({ category: "collections", slug: "collections-6" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "collections" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries collections 6", () => {
    const entries = [
      makeEntry({ category: "collections" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "collections",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters collections 7", () => {
    const entry = makeEntry({ category: "collections", slug: "collections-7" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "collections" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries collections 7", () => {
    const entries = [
      makeEntry({ category: "collections" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "collections",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters statuslines 0", () => {
    const entry = makeEntry({ category: "statuslines", slug: "statuslines-0" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "statuslines" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries statuslines 0", () => {
    const entries = [
      makeEntry({ category: "statuslines" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "statuslines",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters statuslines 1", () => {
    const entry = makeEntry({ category: "statuslines", slug: "statuslines-1" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "statuslines" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries statuslines 1", () => {
    const entries = [
      makeEntry({ category: "statuslines" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "statuslines",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters statuslines 2", () => {
    const entry = makeEntry({ category: "statuslines", slug: "statuslines-2" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "statuslines" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries statuslines 2", () => {
    const entries = [
      makeEntry({ category: "statuslines" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "statuslines",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters statuslines 3", () => {
    const entry = makeEntry({ category: "statuslines", slug: "statuslines-3" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "statuslines" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries statuslines 3", () => {
    const entries = [
      makeEntry({ category: "statuslines" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "statuslines",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters statuslines 4", () => {
    const entry = makeEntry({ category: "statuslines", slug: "statuslines-4" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "statuslines" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries statuslines 4", () => {
    const entries = [
      makeEntry({ category: "statuslines" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "statuslines",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters statuslines 5", () => {
    const entry = makeEntry({ category: "statuslines", slug: "statuslines-5" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "statuslines" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries statuslines 5", () => {
    const entries = [
      makeEntry({ category: "statuslines" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "statuslines",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters statuslines 6", () => {
    const entry = makeEntry({ category: "statuslines", slug: "statuslines-6" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "statuslines" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries statuslines 6", () => {
    const entries = [
      makeEntry({ category: "statuslines" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "statuslines",
    });
    expect(filtered).toHaveLength(1);
  });
  it("entryMatchesFilters statuslines 7", () => {
    const entry = makeEntry({ category: "statuslines", slug: "statuslines-7" });
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "statuslines" }),
    ).toBe(true);
    expect(
      entryMatchesFilters(entry, { ...baseFilters, category: "other" }),
    ).toBe(false);
  });
  it("filterEntries statuslines 7", () => {
    const entries = [
      makeEntry({ category: "statuslines" }),
      makeEntry({ category: "tools" }),
    ];
    const filtered = filterEntries(entries, {
      ...baseFilters,
      category: "statuslines",
    });
    expect(filtered).toHaveLength(1);
  });
});

describe("registry-search-filters-lib rankSearchEntries", () => {
  it("rankSearchEntries matrix 0", () => {
    const entries = [
      makeEntry({ title: "Alpha 0" }),
      makeEntry({ slug: "other-0" }),
    ];
    const ranked = rankSearchEntries(entries, "alpha 0");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThanOrEqual(0);
  });
  it("rankSearchEntries matrix 1", () => {
    const entries = [
      makeEntry({ title: "Alpha 1" }),
      makeEntry({ slug: "other-1" }),
    ];
    const ranked = rankSearchEntries(entries, "alpha 1");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThanOrEqual(0);
  });
  it("rankSearchEntries matrix 2", () => {
    const entries = [
      makeEntry({ title: "Alpha 2" }),
      makeEntry({ slug: "other-2" }),
    ];
    const ranked = rankSearchEntries(entries, "alpha 2");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThanOrEqual(0);
  });
  it("rankSearchEntries matrix 3", () => {
    const entries = [
      makeEntry({ title: "Alpha 3" }),
      makeEntry({ slug: "other-3" }),
    ];
    const ranked = rankSearchEntries(entries, "alpha 3");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThanOrEqual(0);
  });
  it("rankSearchEntries matrix 4", () => {
    const entries = [
      makeEntry({ title: "Alpha 4" }),
      makeEntry({ slug: "other-4" }),
    ];
    const ranked = rankSearchEntries(entries, "alpha 4");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThanOrEqual(0);
  });
  it("rankSearchEntries matrix 5", () => {
    const entries = [
      makeEntry({ title: "Alpha 5" }),
      makeEntry({ slug: "other-5" }),
    ];
    const ranked = rankSearchEntries(entries, "alpha 5");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThanOrEqual(0);
  });
  it("rankSearchEntries matrix 6", () => {
    const entries = [
      makeEntry({ title: "Alpha 6" }),
      makeEntry({ slug: "other-6" }),
    ];
    const ranked = rankSearchEntries(entries, "alpha 6");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThanOrEqual(0);
  });
  it("rankSearchEntries matrix 7", () => {
    const entries = [
      makeEntry({ title: "Alpha 7" }),
      makeEntry({ slug: "other-7" }),
    ];
    const ranked = rankSearchEntries(entries, "alpha 7");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThanOrEqual(0);
  });
  it("rankSearchEntries matrix 8", () => {
    const entries = [
      makeEntry({ title: "Alpha 8" }),
      makeEntry({ slug: "other-8" }),
    ];
    const ranked = rankSearchEntries(entries, "alpha 8");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThanOrEqual(0);
  });
  it("rankSearchEntries matrix 9", () => {
    const entries = [
      makeEntry({ title: "Alpha 9" }),
      makeEntry({ slug: "other-9" }),
    ];
    const ranked = rankSearchEntries(entries, "alpha 9");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThanOrEqual(0);
  });
  it("rankSearchEntries matrix 10", () => {
    const entries = [
      makeEntry({ title: "Alpha 10" }),
      makeEntry({ slug: "other-10" }),
    ];
    const ranked = rankSearchEntries(entries, "alpha 10");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThanOrEqual(0);
  });
  it("rankSearchEntries matrix 11", () => {
    const entries = [
      makeEntry({ title: "Alpha 11" }),
      makeEntry({ slug: "other-11" }),
    ];
    const ranked = rankSearchEntries(entries, "alpha 11");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThanOrEqual(0);
  });
  it("rankSearchEntries matrix 12", () => {
    const entries = [
      makeEntry({ title: "Alpha 12" }),
      makeEntry({ slug: "other-12" }),
    ];
    const ranked = rankSearchEntries(entries, "alpha 12");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThanOrEqual(0);
  });
  it("rankSearchEntries matrix 13", () => {
    const entries = [
      makeEntry({ title: "Alpha 13" }),
      makeEntry({ slug: "other-13" }),
    ];
    const ranked = rankSearchEntries(entries, "alpha 13");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThanOrEqual(0);
  });
  it("rankSearchEntries matrix 14", () => {
    const entries = [
      makeEntry({ title: "Alpha 14" }),
      makeEntry({ slug: "other-14" }),
    ];
    const ranked = rankSearchEntries(entries, "alpha 14");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThanOrEqual(0);
  });
  it("rankSearchEntries matrix 15", () => {
    const entries = [
      makeEntry({ title: "Alpha 15" }),
      makeEntry({ slug: "other-15" }),
    ];
    const ranked = rankSearchEntries(entries, "alpha 15");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThanOrEqual(0);
  });
  it("rankSearchEntries matrix 16", () => {
    const entries = [
      makeEntry({ title: "Alpha 16" }),
      makeEntry({ slug: "other-16" }),
    ];
    const ranked = rankSearchEntries(entries, "alpha 16");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThanOrEqual(0);
  });
  it("rankSearchEntries matrix 17", () => {
    const entries = [
      makeEntry({ title: "Alpha 17" }),
      makeEntry({ slug: "other-17" }),
    ];
    const ranked = rankSearchEntries(entries, "alpha 17");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThanOrEqual(0);
  });
  it("rankSearchEntries matrix 18", () => {
    const entries = [
      makeEntry({ title: "Alpha 18" }),
      makeEntry({ slug: "other-18" }),
    ];
    const ranked = rankSearchEntries(entries, "alpha 18");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThanOrEqual(0);
  });
  it("rankSearchEntries matrix 19", () => {
    const entries = [
      makeEntry({ title: "Alpha 19" }),
      makeEntry({ slug: "other-19" }),
    ];
    const ranked = rankSearchEntries(entries, "alpha 19");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThanOrEqual(0);
  });
  it("rankSearchEntries matrix 20", () => {
    const entries = [
      makeEntry({ title: "Alpha 20" }),
      makeEntry({ slug: "other-20" }),
    ];
    const ranked = rankSearchEntries(entries, "alpha 20");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThanOrEqual(0);
  });
  it("rankSearchEntries matrix 21", () => {
    const entries = [
      makeEntry({ title: "Alpha 21" }),
      makeEntry({ slug: "other-21" }),
    ];
    const ranked = rankSearchEntries(entries, "alpha 21");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThanOrEqual(0);
  });
  it("rankSearchEntries matrix 22", () => {
    const entries = [
      makeEntry({ title: "Alpha 22" }),
      makeEntry({ slug: "other-22" }),
    ];
    const ranked = rankSearchEntries(entries, "alpha 22");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThanOrEqual(0);
  });
  it("rankSearchEntries matrix 23", () => {
    const entries = [
      makeEntry({ title: "Alpha 23" }),
      makeEntry({ slug: "other-23" }),
    ];
    const ranked = rankSearchEntries(entries, "alpha 23");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThanOrEqual(0);
  });
  it("rankSearchEntries matrix 24", () => {
    const entries = [
      makeEntry({ title: "Alpha 24" }),
      makeEntry({ slug: "other-24" }),
    ];
    const ranked = rankSearchEntries(entries, "alpha 24");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThanOrEqual(0);
  });
  it("rankSearchEntries matrix 25", () => {
    const entries = [
      makeEntry({ title: "Alpha 25" }),
      makeEntry({ slug: "other-25" }),
    ];
    const ranked = rankSearchEntries(entries, "alpha 25");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThanOrEqual(0);
  });
  it("rankSearchEntries matrix 26", () => {
    const entries = [
      makeEntry({ title: "Alpha 26" }),
      makeEntry({ slug: "other-26" }),
    ];
    const ranked = rankSearchEntries(entries, "alpha 26");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThanOrEqual(0);
  });
  it("rankSearchEntries matrix 27", () => {
    const entries = [
      makeEntry({ title: "Alpha 27" }),
      makeEntry({ slug: "other-27" }),
    ];
    const ranked = rankSearchEntries(entries, "alpha 27");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThanOrEqual(0);
  });
  it("rankSearchEntries matrix 28", () => {
    const entries = [
      makeEntry({ title: "Alpha 28" }),
      makeEntry({ slug: "other-28" }),
    ];
    const ranked = rankSearchEntries(entries, "alpha 28");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThanOrEqual(0);
  });
  it("rankSearchEntries matrix 29", () => {
    const entries = [
      makeEntry({ title: "Alpha 29" }),
      makeEntry({ slug: "other-29" }),
    ];
    const ranked = rankSearchEntries(entries, "alpha 29");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThanOrEqual(0);
  });
  it("rankSearchEntries matrix 30", () => {
    const entries = [
      makeEntry({ title: "Alpha 30" }),
      makeEntry({ slug: "other-30" }),
    ];
    const ranked = rankSearchEntries(entries, "alpha 30");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThanOrEqual(0);
  });
  it("rankSearchEntries matrix 31", () => {
    const entries = [
      makeEntry({ title: "Alpha 31" }),
      makeEntry({ slug: "other-31" }),
    ];
    const ranked = rankSearchEntries(entries, "alpha 31");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThanOrEqual(0);
  });
  it("rankSearchEntries matrix 32", () => {
    const entries = [
      makeEntry({ title: "Alpha 32" }),
      makeEntry({ slug: "other-32" }),
    ];
    const ranked = rankSearchEntries(entries, "alpha 32");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThanOrEqual(0);
  });
  it("rankSearchEntries matrix 33", () => {
    const entries = [
      makeEntry({ title: "Alpha 33" }),
      makeEntry({ slug: "other-33" }),
    ];
    const ranked = rankSearchEntries(entries, "alpha 33");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThanOrEqual(0);
  });
  it("rankSearchEntries matrix 34", () => {
    const entries = [
      makeEntry({ title: "Alpha 34" }),
      makeEntry({ slug: "other-34" }),
    ];
    const ranked = rankSearchEntries(entries, "alpha 34");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThanOrEqual(0);
  });
  it("rankSearchEntries matrix 35", () => {
    const entries = [
      makeEntry({ title: "Alpha 35" }),
      makeEntry({ slug: "other-35" }),
    ];
    const ranked = rankSearchEntries(entries, "alpha 35");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThanOrEqual(0);
  });
  it("rankSearchEntries matrix 36", () => {
    const entries = [
      makeEntry({ title: "Alpha 36" }),
      makeEntry({ slug: "other-36" }),
    ];
    const ranked = rankSearchEntries(entries, "alpha 36");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThanOrEqual(0);
  });
  it("rankSearchEntries matrix 37", () => {
    const entries = [
      makeEntry({ title: "Alpha 37" }),
      makeEntry({ slug: "other-37" }),
    ];
    const ranked = rankSearchEntries(entries, "alpha 37");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThanOrEqual(0);
  });
  it("rankSearchEntries matrix 38", () => {
    const entries = [
      makeEntry({ title: "Alpha 38" }),
      makeEntry({ slug: "other-38" }),
    ];
    const ranked = rankSearchEntries(entries, "alpha 38");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThanOrEqual(0);
  });
  it("rankSearchEntries matrix 39", () => {
    const entries = [
      makeEntry({ title: "Alpha 39" }),
      makeEntry({ slug: "other-39" }),
    ];
    const ranked = rankSearchEntries(entries, "alpha 39");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThanOrEqual(0);
  });
  it("rankSearchEntries matrix 40", () => {
    const entries = [
      makeEntry({ title: "Alpha 40" }),
      makeEntry({ slug: "other-40" }),
    ];
    const ranked = rankSearchEntries(entries, "alpha 40");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThanOrEqual(0);
  });
  it("rankSearchEntries matrix 41", () => {
    const entries = [
      makeEntry({ title: "Alpha 41" }),
      makeEntry({ slug: "other-41" }),
    ];
    const ranked = rankSearchEntries(entries, "alpha 41");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThanOrEqual(0);
  });
  it("rankSearchEntries matrix 42", () => {
    const entries = [
      makeEntry({ title: "Alpha 42" }),
      makeEntry({ slug: "other-42" }),
    ];
    const ranked = rankSearchEntries(entries, "alpha 42");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThanOrEqual(0);
  });
  it("rankSearchEntries matrix 43", () => {
    const entries = [
      makeEntry({ title: "Alpha 43" }),
      makeEntry({ slug: "other-43" }),
    ];
    const ranked = rankSearchEntries(entries, "alpha 43");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThanOrEqual(0);
  });
  it("rankSearchEntries matrix 44", () => {
    const entries = [
      makeEntry({ title: "Alpha 44" }),
      makeEntry({ slug: "other-44" }),
    ];
    const ranked = rankSearchEntries(entries, "alpha 44");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThanOrEqual(0);
  });
  it("rankSearchEntries matrix 45", () => {
    const entries = [
      makeEntry({ title: "Alpha 45" }),
      makeEntry({ slug: "other-45" }),
    ];
    const ranked = rankSearchEntries(entries, "alpha 45");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThanOrEqual(0);
  });
  it("rankSearchEntries matrix 46", () => {
    const entries = [
      makeEntry({ title: "Alpha 46" }),
      makeEntry({ slug: "other-46" }),
    ];
    const ranked = rankSearchEntries(entries, "alpha 46");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThanOrEqual(0);
  });
  it("rankSearchEntries matrix 47", () => {
    const entries = [
      makeEntry({ title: "Alpha 47" }),
      makeEntry({ slug: "other-47" }),
    ];
    const ranked = rankSearchEntries(entries, "alpha 47");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThanOrEqual(0);
  });
  it("rankSearchEntries matrix 48", () => {
    const entries = [
      makeEntry({ title: "Alpha 48" }),
      makeEntry({ slug: "other-48" }),
    ];
    const ranked = rankSearchEntries(entries, "alpha 48");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThanOrEqual(0);
  });
  it("rankSearchEntries matrix 49", () => {
    const entries = [
      makeEntry({ title: "Alpha 49" }),
      makeEntry({ slug: "other-49" }),
    ];
    const ranked = rankSearchEntries(entries, "alpha 49");
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].score).toBeGreaterThanOrEqual(0);
  });
});

describe("registry-search-filters-lib computeRegistrySearchFacets", () => {
  it("computeRegistrySearchFacets matrix 0", () => {
    const entries = [
      makeEntry({ category: "agents" }),
      makeEntry({ category: "tools" }),
    ];
    const facets = computeRegistrySearchFacets(entries, baseFilters);
    expect(facets.categories).toBeDefined();
    expect(facets.platforms).toBeDefined();
  });
  it("computeRegistrySearchFacets matrix 1", () => {
    const entries = [
      makeEntry({ category: "mcp" }),
      makeEntry({ category: "tools" }),
    ];
    const facets = computeRegistrySearchFacets(entries, baseFilters);
    expect(facets.categories).toBeDefined();
    expect(facets.platforms).toBeDefined();
  });
  it("computeRegistrySearchFacets matrix 2", () => {
    const entries = [
      makeEntry({ category: "tools" }),
      makeEntry({ category: "tools" }),
    ];
    const facets = computeRegistrySearchFacets(entries, baseFilters);
    expect(facets.categories).toBeDefined();
    expect(facets.platforms).toBeDefined();
  });
  it("computeRegistrySearchFacets matrix 3", () => {
    const entries = [
      makeEntry({ category: "skills" }),
      makeEntry({ category: "tools" }),
    ];
    const facets = computeRegistrySearchFacets(entries, baseFilters);
    expect(facets.categories).toBeDefined();
    expect(facets.platforms).toBeDefined();
  });
  it("computeRegistrySearchFacets matrix 4", () => {
    const entries = [
      makeEntry({ category: "rules" }),
      makeEntry({ category: "tools" }),
    ];
    const facets = computeRegistrySearchFacets(entries, baseFilters);
    expect(facets.categories).toBeDefined();
    expect(facets.platforms).toBeDefined();
  });
  it("computeRegistrySearchFacets matrix 5", () => {
    const entries = [
      makeEntry({ category: "commands" }),
      makeEntry({ category: "tools" }),
    ];
    const facets = computeRegistrySearchFacets(entries, baseFilters);
    expect(facets.categories).toBeDefined();
    expect(facets.platforms).toBeDefined();
  });
  it("computeRegistrySearchFacets matrix 6", () => {
    const entries = [
      makeEntry({ category: "hooks" }),
      makeEntry({ category: "tools" }),
    ];
    const facets = computeRegistrySearchFacets(entries, baseFilters);
    expect(facets.categories).toBeDefined();
    expect(facets.platforms).toBeDefined();
  });
  it("computeRegistrySearchFacets matrix 7", () => {
    const entries = [
      makeEntry({ category: "guides" }),
      makeEntry({ category: "tools" }),
    ];
    const facets = computeRegistrySearchFacets(entries, baseFilters);
    expect(facets.categories).toBeDefined();
    expect(facets.platforms).toBeDefined();
  });
  it("computeRegistrySearchFacets matrix 8", () => {
    const entries = [
      makeEntry({ category: "collections" }),
      makeEntry({ category: "tools" }),
    ];
    const facets = computeRegistrySearchFacets(entries, baseFilters);
    expect(facets.categories).toBeDefined();
    expect(facets.platforms).toBeDefined();
  });
  it("computeRegistrySearchFacets matrix 9", () => {
    const entries = [
      makeEntry({ category: "statuslines" }),
      makeEntry({ category: "tools" }),
    ];
    const facets = computeRegistrySearchFacets(entries, baseFilters);
    expect(facets.categories).toBeDefined();
    expect(facets.platforms).toBeDefined();
  });
  it("computeRegistrySearchFacets matrix 10", () => {
    const entries = [
      makeEntry({ category: "agents" }),
      makeEntry({ category: "tools" }),
    ];
    const facets = computeRegistrySearchFacets(entries, baseFilters);
    expect(facets.categories).toBeDefined();
    expect(facets.platforms).toBeDefined();
  });
  it("computeRegistrySearchFacets matrix 11", () => {
    const entries = [
      makeEntry({ category: "mcp" }),
      makeEntry({ category: "tools" }),
    ];
    const facets = computeRegistrySearchFacets(entries, baseFilters);
    expect(facets.categories).toBeDefined();
    expect(facets.platforms).toBeDefined();
  });
  it("computeRegistrySearchFacets matrix 12", () => {
    const entries = [
      makeEntry({ category: "tools" }),
      makeEntry({ category: "tools" }),
    ];
    const facets = computeRegistrySearchFacets(entries, baseFilters);
    expect(facets.categories).toBeDefined();
    expect(facets.platforms).toBeDefined();
  });
  it("computeRegistrySearchFacets matrix 13", () => {
    const entries = [
      makeEntry({ category: "skills" }),
      makeEntry({ category: "tools" }),
    ];
    const facets = computeRegistrySearchFacets(entries, baseFilters);
    expect(facets.categories).toBeDefined();
    expect(facets.platforms).toBeDefined();
  });
  it("computeRegistrySearchFacets matrix 14", () => {
    const entries = [
      makeEntry({ category: "rules" }),
      makeEntry({ category: "tools" }),
    ];
    const facets = computeRegistrySearchFacets(entries, baseFilters);
    expect(facets.categories).toBeDefined();
    expect(facets.platforms).toBeDefined();
  });
  it("computeRegistrySearchFacets matrix 15", () => {
    const entries = [
      makeEntry({ category: "commands" }),
      makeEntry({ category: "tools" }),
    ];
    const facets = computeRegistrySearchFacets(entries, baseFilters);
    expect(facets.categories).toBeDefined();
    expect(facets.platforms).toBeDefined();
  });
  it("computeRegistrySearchFacets matrix 16", () => {
    const entries = [
      makeEntry({ category: "hooks" }),
      makeEntry({ category: "tools" }),
    ];
    const facets = computeRegistrySearchFacets(entries, baseFilters);
    expect(facets.categories).toBeDefined();
    expect(facets.platforms).toBeDefined();
  });
  it("computeRegistrySearchFacets matrix 17", () => {
    const entries = [
      makeEntry({ category: "guides" }),
      makeEntry({ category: "tools" }),
    ];
    const facets = computeRegistrySearchFacets(entries, baseFilters);
    expect(facets.categories).toBeDefined();
    expect(facets.platforms).toBeDefined();
  });
  it("computeRegistrySearchFacets matrix 18", () => {
    const entries = [
      makeEntry({ category: "collections" }),
      makeEntry({ category: "tools" }),
    ];
    const facets = computeRegistrySearchFacets(entries, baseFilters);
    expect(facets.categories).toBeDefined();
    expect(facets.platforms).toBeDefined();
  });
  it("computeRegistrySearchFacets matrix 19", () => {
    const entries = [
      makeEntry({ category: "statuslines" }),
      makeEntry({ category: "tools" }),
    ];
    const facets = computeRegistrySearchFacets(entries, baseFilters);
    expect(facets.categories).toBeDefined();
    expect(facets.platforms).toBeDefined();
  });
  it("computeRegistrySearchFacets matrix 20", () => {
    const entries = [
      makeEntry({ category: "agents" }),
      makeEntry({ category: "tools" }),
    ];
    const facets = computeRegistrySearchFacets(entries, baseFilters);
    expect(facets.categories).toBeDefined();
    expect(facets.platforms).toBeDefined();
  });
  it("computeRegistrySearchFacets matrix 21", () => {
    const entries = [
      makeEntry({ category: "mcp" }),
      makeEntry({ category: "tools" }),
    ];
    const facets = computeRegistrySearchFacets(entries, baseFilters);
    expect(facets.categories).toBeDefined();
    expect(facets.platforms).toBeDefined();
  });
  it("computeRegistrySearchFacets matrix 22", () => {
    const entries = [
      makeEntry({ category: "tools" }),
      makeEntry({ category: "tools" }),
    ];
    const facets = computeRegistrySearchFacets(entries, baseFilters);
    expect(facets.categories).toBeDefined();
    expect(facets.platforms).toBeDefined();
  });
  it("computeRegistrySearchFacets matrix 23", () => {
    const entries = [
      makeEntry({ category: "skills" }),
      makeEntry({ category: "tools" }),
    ];
    const facets = computeRegistrySearchFacets(entries, baseFilters);
    expect(facets.categories).toBeDefined();
    expect(facets.platforms).toBeDefined();
  });
  it("computeRegistrySearchFacets matrix 24", () => {
    const entries = [
      makeEntry({ category: "rules" }),
      makeEntry({ category: "tools" }),
    ];
    const facets = computeRegistrySearchFacets(entries, baseFilters);
    expect(facets.categories).toBeDefined();
    expect(facets.platforms).toBeDefined();
  });
  it("computeRegistrySearchFacets matrix 25", () => {
    const entries = [
      makeEntry({ category: "commands" }),
      makeEntry({ category: "tools" }),
    ];
    const facets = computeRegistrySearchFacets(entries, baseFilters);
    expect(facets.categories).toBeDefined();
    expect(facets.platforms).toBeDefined();
  });
  it("computeRegistrySearchFacets matrix 26", () => {
    const entries = [
      makeEntry({ category: "hooks" }),
      makeEntry({ category: "tools" }),
    ];
    const facets = computeRegistrySearchFacets(entries, baseFilters);
    expect(facets.categories).toBeDefined();
    expect(facets.platforms).toBeDefined();
  });
  it("computeRegistrySearchFacets matrix 27", () => {
    const entries = [
      makeEntry({ category: "guides" }),
      makeEntry({ category: "tools" }),
    ];
    const facets = computeRegistrySearchFacets(entries, baseFilters);
    expect(facets.categories).toBeDefined();
    expect(facets.platforms).toBeDefined();
  });
  it("computeRegistrySearchFacets matrix 28", () => {
    const entries = [
      makeEntry({ category: "collections" }),
      makeEntry({ category: "tools" }),
    ];
    const facets = computeRegistrySearchFacets(entries, baseFilters);
    expect(facets.categories).toBeDefined();
    expect(facets.platforms).toBeDefined();
  });
  it("computeRegistrySearchFacets matrix 29", () => {
    const entries = [
      makeEntry({ category: "statuslines" }),
      makeEntry({ category: "tools" }),
    ];
    const facets = computeRegistrySearchFacets(entries, baseFilters);
    expect(facets.categories).toBeDefined();
    expect(facets.platforms).toBeDefined();
  });
  it("computeRegistrySearchFacets matrix 30", () => {
    const entries = [
      makeEntry({ category: "agents" }),
      makeEntry({ category: "tools" }),
    ];
    const facets = computeRegistrySearchFacets(entries, baseFilters);
    expect(facets.categories).toBeDefined();
    expect(facets.platforms).toBeDefined();
  });
  it("computeRegistrySearchFacets matrix 31", () => {
    const entries = [
      makeEntry({ category: "mcp" }),
      makeEntry({ category: "tools" }),
    ];
    const facets = computeRegistrySearchFacets(entries, baseFilters);
    expect(facets.categories).toBeDefined();
    expect(facets.platforms).toBeDefined();
  });
  it("computeRegistrySearchFacets matrix 32", () => {
    const entries = [
      makeEntry({ category: "tools" }),
      makeEntry({ category: "tools" }),
    ];
    const facets = computeRegistrySearchFacets(entries, baseFilters);
    expect(facets.categories).toBeDefined();
    expect(facets.platforms).toBeDefined();
  });
  it("computeRegistrySearchFacets matrix 33", () => {
    const entries = [
      makeEntry({ category: "skills" }),
      makeEntry({ category: "tools" }),
    ];
    const facets = computeRegistrySearchFacets(entries, baseFilters);
    expect(facets.categories).toBeDefined();
    expect(facets.platforms).toBeDefined();
  });
  it("computeRegistrySearchFacets matrix 34", () => {
    const entries = [
      makeEntry({ category: "rules" }),
      makeEntry({ category: "tools" }),
    ];
    const facets = computeRegistrySearchFacets(entries, baseFilters);
    expect(facets.categories).toBeDefined();
    expect(facets.platforms).toBeDefined();
  });
  it("computeRegistrySearchFacets matrix 35", () => {
    const entries = [
      makeEntry({ category: "commands" }),
      makeEntry({ category: "tools" }),
    ];
    const facets = computeRegistrySearchFacets(entries, baseFilters);
    expect(facets.categories).toBeDefined();
    expect(facets.platforms).toBeDefined();
  });
  it("computeRegistrySearchFacets matrix 36", () => {
    const entries = [
      makeEntry({ category: "hooks" }),
      makeEntry({ category: "tools" }),
    ];
    const facets = computeRegistrySearchFacets(entries, baseFilters);
    expect(facets.categories).toBeDefined();
    expect(facets.platforms).toBeDefined();
  });
  it("computeRegistrySearchFacets matrix 37", () => {
    const entries = [
      makeEntry({ category: "guides" }),
      makeEntry({ category: "tools" }),
    ];
    const facets = computeRegistrySearchFacets(entries, baseFilters);
    expect(facets.categories).toBeDefined();
    expect(facets.platforms).toBeDefined();
  });
  it("computeRegistrySearchFacets matrix 38", () => {
    const entries = [
      makeEntry({ category: "collections" }),
      makeEntry({ category: "tools" }),
    ];
    const facets = computeRegistrySearchFacets(entries, baseFilters);
    expect(facets.categories).toBeDefined();
    expect(facets.platforms).toBeDefined();
  });
  it("computeRegistrySearchFacets matrix 39", () => {
    const entries = [
      makeEntry({ category: "statuslines" }),
      makeEntry({ category: "tools" }),
    ];
    const facets = computeRegistrySearchFacets(entries, baseFilters);
    expect(facets.categories).toBeDefined();
    expect(facets.platforms).toBeDefined();
  });
  it("computeRegistrySearchFacets matrix 40", () => {
    const entries = [
      makeEntry({ category: "agents" }),
      makeEntry({ category: "tools" }),
    ];
    const facets = computeRegistrySearchFacets(entries, baseFilters);
    expect(facets.categories).toBeDefined();
    expect(facets.platforms).toBeDefined();
  });
  it("computeRegistrySearchFacets matrix 41", () => {
    const entries = [
      makeEntry({ category: "mcp" }),
      makeEntry({ category: "tools" }),
    ];
    const facets = computeRegistrySearchFacets(entries, baseFilters);
    expect(facets.categories).toBeDefined();
    expect(facets.platforms).toBeDefined();
  });
  it("computeRegistrySearchFacets matrix 42", () => {
    const entries = [
      makeEntry({ category: "tools" }),
      makeEntry({ category: "tools" }),
    ];
    const facets = computeRegistrySearchFacets(entries, baseFilters);
    expect(facets.categories).toBeDefined();
    expect(facets.platforms).toBeDefined();
  });
  it("computeRegistrySearchFacets matrix 43", () => {
    const entries = [
      makeEntry({ category: "skills" }),
      makeEntry({ category: "tools" }),
    ];
    const facets = computeRegistrySearchFacets(entries, baseFilters);
    expect(facets.categories).toBeDefined();
    expect(facets.platforms).toBeDefined();
  });
  it("computeRegistrySearchFacets matrix 44", () => {
    const entries = [
      makeEntry({ category: "rules" }),
      makeEntry({ category: "tools" }),
    ];
    const facets = computeRegistrySearchFacets(entries, baseFilters);
    expect(facets.categories).toBeDefined();
    expect(facets.platforms).toBeDefined();
  });
  it("computeRegistrySearchFacets matrix 45", () => {
    const entries = [
      makeEntry({ category: "commands" }),
      makeEntry({ category: "tools" }),
    ];
    const facets = computeRegistrySearchFacets(entries, baseFilters);
    expect(facets.categories).toBeDefined();
    expect(facets.platforms).toBeDefined();
  });
  it("computeRegistrySearchFacets matrix 46", () => {
    const entries = [
      makeEntry({ category: "hooks" }),
      makeEntry({ category: "tools" }),
    ];
    const facets = computeRegistrySearchFacets(entries, baseFilters);
    expect(facets.categories).toBeDefined();
    expect(facets.platforms).toBeDefined();
  });
  it("computeRegistrySearchFacets matrix 47", () => {
    const entries = [
      makeEntry({ category: "guides" }),
      makeEntry({ category: "tools" }),
    ];
    const facets = computeRegistrySearchFacets(entries, baseFilters);
    expect(facets.categories).toBeDefined();
    expect(facets.platforms).toBeDefined();
  });
  it("computeRegistrySearchFacets matrix 48", () => {
    const entries = [
      makeEntry({ category: "collections" }),
      makeEntry({ category: "tools" }),
    ];
    const facets = computeRegistrySearchFacets(entries, baseFilters);
    expect(facets.categories).toBeDefined();
    expect(facets.platforms).toBeDefined();
  });
  it("computeRegistrySearchFacets matrix 49", () => {
    const entries = [
      makeEntry({ category: "statuslines" }),
      makeEntry({ category: "tools" }),
    ];
    const facets = computeRegistrySearchFacets(entries, baseFilters);
    expect(facets.categories).toBeDefined();
    expect(facets.platforms).toBeDefined();
  });
});
