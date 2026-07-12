import { describe, expect, it } from "vitest";
import type { Entry } from "@/types/registry";
import { browseAuthorConcentrationState } from "@/lib/browse-author-concentration-lib";

function entry(slug: string, author: string): Entry {
  return {
    category: "mcp",
    slug,
    title: slug,
    description: "Fixture description",
    author,
    tags: [],
    platforms: ["claude-code"],
    installType: "manual",
    trust: "review",
    source: "unverified",
    dateAdded: "2026-01-01",
  } as Entry;
}

describe("browseAuthorConcentrationState", () => {
  it("hides the panel below the minimum thresholds", () => {
    expect(browseAuthorConcentrationState([]).showPanel).toBe(false);
    // four entries but a single author -> not a distribution
    expect(
      browseAuthorConcentrationState([
        entry("a", "Solo"),
        entry("b", "Solo"),
        entry("c", "Solo"),
        entry("d", "Solo"),
      ]).showPanel,
    ).toBe(false);
    // two distinct authors but only three entries -> below the entry floor
    expect(
      browseAuthorConcentrationState([
        entry("a", "One"),
        entry("b", "Two"),
        entry("c", "One"),
      ]).showPanel,
    ).toBe(false);
  });

  it("counts entries per author, sorted by count then name", () => {
    const state = browseAuthorConcentrationState([
      entry("a", "Acme"),
      entry("b", "Acme"),
      entry("c", "Beta"),
      entry("d", "Acme"),
      entry("e", "Gamma"),
    ]);
    expect(state.showPanel).toBe(true);
    expect(state.scannedCount).toBe(5);
    expect(state.topAuthors[0]).toMatchObject({
      author: "Acme",
      count: 3,
      percent: 60,
    });
    expect(state.topAuthors[1]).toMatchObject({ author: "Beta", count: 1 });
    expect(state.topAuthors[2]).toMatchObject({ author: "Gamma", count: 1 });
    expect(state.distinctAuthors).toBe(3);
    expect(state.topShare).toBe(60);
  });

  it("groups authors case-insensitively, keeping first-seen spelling", () => {
    const state = browseAuthorConcentrationState([
      entry("a", "Acme"),
      entry("b", "acme"),
      entry("c", "ACME"),
      entry("d", "Beta"),
    ]);
    const acme = state.topAuthors.find(
      (row) => row.author.toLowerCase() === "acme",
    );
    expect(acme?.author).toBe("Acme");
    expect(acme?.count).toBe(3);
    expect(state.distinctAuthors).toBe(2);
  });

  it("classifies a dominant author as concentrated", () => {
    const state = browseAuthorConcentrationState([
      entry("a", "Acme"),
      entry("b", "Acme"),
      entry("c", "Acme"),
      entry("d", "Beta"),
    ]);
    expect(state.topShare).toBe(75);
    expect(state.concentration).toBe("concentrated");
    expect(state.heading).toContain("Acme");
  });

  it("classifies mostly-unique authors as diverse", () => {
    const state = browseAuthorConcentrationState([
      entry("a", "One"),
      entry("b", "Two"),
      entry("c", "Three"),
      entry("d", "Four"),
    ]);
    expect(state.concentration).toBe("diverse");
    expect(state.heading).toContain("broadly independent");
  });

  it("respects the scannedCount cap", () => {
    const entries = Array.from({ length: 30 }, (_, i) =>
      entry(`e${i}`, i < 20 ? "Bulk" : `Solo${i}`),
    );
    const state = browseAuthorConcentrationState(entries, 10);
    expect(state.scannedCount).toBe(10);
    expect(state.topAuthors[0]).toMatchObject({ author: "Bulk", count: 10 });
  });
});
