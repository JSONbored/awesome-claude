import { describe, expect, it } from "vitest";

import {
  DEFAULT_COMPARE_LIMIT,
  hasCompareItem,
  resolveCompareParam,
  serializeCompareItems,
  toggleCompareItem,
} from "../apps/web/src/lib/compare-selection-lib";

type Item = { category: string; slug: string };

const A: Item = { category: "skills", slug: "alpha" };
const B: Item = { category: "agents", slug: "beta" };
const C: Item = { category: "commands", slug: "gamma" };
const D: Item = { category: "hooks", slug: "delta" };
const E: Item = { category: "mcp", slug: "epsilon" };

describe("hasCompareItem", () => {
  it("matches by category + slug, not identity", () => {
    expect(hasCompareItem([A, B], { category: "agents", slug: "beta" })).toBe(
      true,
    );
    expect(hasCompareItem([A, B], C)).toBe(false);
    // Same slug, different category must not match.
    expect(hasCompareItem([A], { category: "agents", slug: "alpha" })).toBe(
      false,
    );
  });

  it("is false for an empty list", () => {
    expect(hasCompareItem([], A)).toBe(false);
  });
});

describe("toggleCompareItem", () => {
  it("adds an absent entry", () => {
    expect(toggleCompareItem([A], B)).toEqual([A, B]);
  });

  it("removes a present entry (by identity, keeping the rest)", () => {
    expect(toggleCompareItem([A, B, C], B)).toEqual([A, C]);
  });

  it("does not add past the limit, but still allows a removal at the limit", () => {
    const full = [A, B, C, D];
    expect(full).toHaveLength(DEFAULT_COMPARE_LIMIT);
    // Adding a new one at the cap is a no-op (returns the same list).
    expect(toggleCompareItem(full, E)).toEqual(full);
    // Removing one already present still works even at the cap.
    expect(toggleCompareItem(full, C)).toEqual([A, B, D]);
  });

  it("honors a custom limit", () => {
    expect(toggleCompareItem([A, B], C, 2)).toEqual([A, B]);
    expect(toggleCompareItem([A], C, 2)).toEqual([A, C]);
  });

  it("does not mutate the input array", () => {
    const input = [A, B];
    toggleCompareItem(input, C);
    expect(input).toEqual([A, B]);
  });
});

describe("serializeCompareItems", () => {
  it("joins entry refs (category/slug) with commas in order", () => {
    expect(serializeCompareItems([A, C])).toBe("skills/alpha,commands/gamma");
  });

  it("is empty for no items", () => {
    expect(serializeCompareItems([])).toBe("");
  });
});

describe("resolveCompareParam", () => {
  const entries = [A, B, C, D, E];

  it("returns [] for an empty param", () => {
    expect(resolveCompareParam(entries, "")).toEqual([]);
  });

  it("resolves refs to entries preserving param order", () => {
    expect(resolveCompareParam(entries, "commands/gamma,skills/alpha")).toEqual(
      [C, A],
    );
  });

  it("trims whitespace and drops malformed / unmatched refs", () => {
    expect(
      resolveCompareParam(
        entries,
        " skills/alpha , not-a-ref , mcp/missing , agents/beta ",
      ),
    ).toEqual([A, B]);
  });

  it("de-duplicates repeated refs", () => {
    expect(resolveCompareParam(entries, "skills/alpha,skills/alpha")).toEqual([
      A,
    ]);
  });

  it("caps the result at the limit", () => {
    expect(
      resolveCompareParam(
        entries,
        "skills/alpha,agents/beta,commands/gamma,hooks/delta,mcp/epsilon",
      ),
    ).toHaveLength(DEFAULT_COMPARE_LIMIT);
    expect(
      resolveCompareParam(
        entries,
        "skills/alpha,agents/beta,commands/gamma",
        2,
      ),
    ).toEqual([A, B]);
  });
});
