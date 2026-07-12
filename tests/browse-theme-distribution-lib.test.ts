import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import { browseThemeDistributionState } from "@/lib/browse-theme-distribution-lib";

function entry(slug: string, tags: string[]): Entry {
  return {
    category: "mcp",
    slug,
    title: slug,
    description: "Fixture description",
    author: "Author",
    tags,
    platforms: ["claude-code"],
    installType: "manual",
    trust: "review",
    source: "unverified",
    dateAdded: "2026-01-01",
  } as Entry;
}

describe("browseThemeDistributionState", () => {
  it("hides the panel below the minimum entry/theme threshold", () => {
    expect(browseThemeDistributionState([]).showPanel).toBe(false);
    expect(
      browseThemeDistributionState([entry("a", ["x"]), entry("b", ["x"])])
        .showPanel,
    ).toBe(false);
    // three entries but only one distinct theme -> not a distribution
    expect(
      browseThemeDistributionState([
        entry("a", ["x"]),
        entry("b", ["x"]),
        entry("c", ["x"]),
      ]).showPanel,
    ).toBe(false);
  });

  it("counts tag frequency across entries and sorts by count then name", () => {
    const state = browseThemeDistributionState([
      entry("a", ["memory", "rag"]),
      entry("b", ["memory", "search"]),
      entry("c", ["memory", "rag"]),
    ]);
    expect(state.showPanel).toBe(true);
    expect(state.scannedCount).toBe(3);
    expect(state.topThemes[0]).toMatchObject({
      tag: "memory",
      count: 3,
      percent: 100,
    });
    expect(state.topThemes[1]).toMatchObject({ tag: "rag", count: 2 });
    expect(state.topThemes[2]).toMatchObject({ tag: "search", count: 1 });
    expect(state.distinctThemes).toBe(3);
  });

  it("de-duplicates repeated tags within one entry and is case-insensitive", () => {
    const state = browseThemeDistributionState([
      entry("a", ["Memory", "memory", "MEMORY"]),
      entry("b", ["memory"]),
      entry("c", ["rag"]),
    ]);
    const memory = state.topThemes.find((t) => t.slug === "memory");
    expect(memory?.count).toBe(2);
  });

  it("classifies a dominant theme as focused", () => {
    const state = browseThemeDistributionState([
      entry("a", ["memory", "rag"]),
      entry("b", ["memory", "search"]),
      entry("c", ["memory", "graph"]),
      entry("d", ["memory"]),
    ]);
    expect(state.focusPercent).toBe(100);
    expect(state.concentration).toBe("focused");
    expect(state.heading).toContain("memory");
  });

  it("classifies many unique tags as diverse", () => {
    const state = browseThemeDistributionState([
      entry("a", ["t1", "t2", "t3"]),
      entry("b", ["t4", "t5", "t6"]),
      entry("c", ["t7", "t8", "t9"]),
    ]);
    // 9 distinct themes over 3 entries (>= 3*2) with no dominant tag
    expect(state.concentration).toBe("diverse");
    expect(state.heading).toContain("broadly spread");
  });

  it("respects the scannedCount cap", () => {
    const entries = Array.from({ length: 40 }, (_, i) =>
      entry(`e${i}`, ["shared", `t${i}`]),
    );
    const state = browseThemeDistributionState(entries, 10);
    expect(state.scannedCount).toBe(10);
    expect(state.topThemes[0]).toMatchObject({ tag: "shared", count: 10 });
  });

  it("ignores blank tags", () => {
    const state = browseThemeDistributionState([
      entry("a", ["memory", "  ", ""]),
      entry("b", ["memory", "rag"]),
      entry("c", ["rag", "search"]),
    ]);
    const tags = state.topThemes.map((t) => t.tag);
    expect(tags).not.toContain("");
    expect(tags).toContain("memory");
  });
});
