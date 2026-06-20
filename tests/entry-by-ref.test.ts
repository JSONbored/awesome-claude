import { describe, expect, it } from "vitest";

import { entryByRef, ENTRIES } from "@/data/entries";

describe("entryByRef", () => {
  it("resolves a real entry by its category and slug", () => {
    // Derive the ref from a real entry so the test tracks the registry data.
    const sample = ENTRIES[0];
    expect(sample).toBeTruthy();
    const found = entryByRef(sample.category, sample.slug);
    expect(found).toBeTruthy();
    expect(found!.slug).toBe(sample.slug);
    expect(found!.category).toBe(sample.category);
  });

  it("returns undefined for a category/slug that is not in the registry", () => {
    expect(
      entryByRef("agents", "definitely-not-a-real-entry-xyz"),
    ).toBeUndefined();
  });

  it("keys strictly on the category/slug pair", () => {
    // A real slug under the wrong category must not resolve.
    const sample = ENTRIES[0];
    expect(entryByRef("not-a-real-category", sample.slug)).toBeUndefined();
  });
});
