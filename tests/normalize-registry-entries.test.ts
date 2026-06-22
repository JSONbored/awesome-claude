import { describe, expect, it } from "vitest";

import { normalizeRegistryEntries } from "@/lib/content.server";

describe("normalizeRegistryEntries", () => {
  it("returns the entries array from a valid envelope", () => {
    const entries = [{ id: 1 }, { id: 2 }];
    expect(normalizeRegistryEntries({ entries } as never)).toBe(entries);
  });

  it("accepts an empty entries array", () => {
    // An empty registry is valid (no entries), distinct from a malformed one.
    expect(normalizeRegistryEntries({ entries: [] } as never)).toEqual([]);
  });

  it("throws when the entries field is missing or not an array", () => {
    // The guard protects downstream code from a malformed/partial artifact.
    const message = "Invalid registry artifact: expected entries envelope";
    expect(() => normalizeRegistryEntries({} as never)).toThrow(message);
    expect(() =>
      normalizeRegistryEntries({ entries: "nope" } as never),
    ).toThrow(message);
  });

  it("throws on a nullish payload", () => {
    expect(() => normalizeRegistryEntries(null as never)).toThrow(
      "Invalid registry artifact",
    );
  });
});
