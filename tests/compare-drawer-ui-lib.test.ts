import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  compareDrawerFullViewSearch,
  compareDrawerShareUrl,
} from "@/lib/compare-drawer-ui-lib";

function entry(overrides: Partial<Entry> = {}): Entry {
  return {
    category: "mcp",
    slug: "fixture",
    title: "Fixture",
    description: "Fixture description",
    author: "Author",
    tags: [],
    platforms: ["claude-code"],
    installType: "manual",
    trust: "review",
    source: "unverified",
    dateAdded: "2026-01-01",
    ...overrides,
  } as Entry;
}

describe("compare drawer ui lib", () => {
  it("builds browse share URLs for drawer copy-link actions", () => {
    expect(compareDrawerShareUrl([])).toBe("/browse");
    expect(
      compareDrawerShareUrl([
        entry({ category: "skills", slug: "alpha" }),
        entry({ category: "hooks", slug: "beta" }),
      ]),
    ).toBe("/browse?compare=skills%2Falpha%2Chooks%2Fbeta");
  });

  it("builds capped full-view compare search params for drawer CTAs", () => {
    expect(compareDrawerFullViewSearch([])).toBeNull();
    expect(compareDrawerFullViewSearch([entry()])).toEqual({
      ids: "mcp/fixture",
    });
    expect(
      compareDrawerFullViewSearch([
        entry({ slug: "one" }),
        entry({ slug: "two" }),
        entry({ slug: "three" }),
        entry({ slug: "four" }),
        entry({ slug: "five" }),
      ]),
    ).toEqual({ ids: "mcp/one,mcp/two,mcp/three,mcp/four" });
  });
});
