import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import {
  compareContextSelectionParam,
  compareContextShareUrl,
} from "@/lib/compare-context-ui-lib";

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

describe("compare context ui lib", () => {
  it("builds browse share URLs for compare context actions", () => {
    expect(compareContextShareUrl([])).toBe("/browse");
    expect(
      compareContextShareUrl([
        entry({ category: "skills", slug: "alpha" }),
        entry({ category: "hooks", slug: "beta" }),
      ]),
    ).toBe("/browse?compare=skills%2Falpha%2Chooks%2Fbeta");
  });

  it("serializes compare context selections for URL hydration", () => {
    expect(compareContextSelectionParam([])).toBe("");
    expect(
      compareContextSelectionParam([
        entry({ category: "skills", slug: "alpha" }),
        entry({ category: "hooks", slug: "beta" }),
      ]),
    ).toBe("skills/alpha,hooks/beta");
  });
});
