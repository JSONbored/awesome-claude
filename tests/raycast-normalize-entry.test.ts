import { describe, expect, it } from "vitest";

// Deep-relative test imports use the `.js` specifier across this repo's suite;
// the bundler maps it to the TypeScript source.
import {
  normalizeRaycastEntry,
  isValidRaycastEntry,
} from "../integrations/raycast/src/feed.js";

const rawEntry = {
  category: "agents",
  slug: "a",
  title: "T",
  description: "D",
  detailUrl: "https://d.example",
  webUrl: "https://w.example",
  tags: [" x ", "x", "y"],
  installable: true,
  author: "Me",
};

describe("normalizeRaycastEntry", () => {
  it("normalizes a complete raw entry, trimming and de-duping tags", () => {
    const entry = normalizeRaycastEntry(rawEntry);
    expect(entry).not.toBeNull();
    expect(entry!.tags).toEqual(["x", "y"]);
    expect(entry!.installable).toBe(true);
    expect(entry!.author).toBe("Me");
  });

  it("returns null when a required field is missing", () => {
    // detailUrl and webUrl are required alongside category/slug/title/description.
    expect(normalizeRaycastEntry({ ...rawEntry, detailUrl: "" })).toBeNull();
    expect(normalizeRaycastEntry({ ...rawEntry, webUrl: "" })).toBeNull();
  });

  it("returns null for non-record inputs", () => {
    expect(normalizeRaycastEntry("not-an-object")).toBeNull();
    expect(normalizeRaycastEntry(42)).toBeNull();
  });

  it("defaults boolean flags when absent", () => {
    const { installable, ...withoutInstallable } = rawEntry;
    void installable;
    const entry = normalizeRaycastEntry(withoutInstallable);
    expect(entry!.installable).toBe(false);
  });
});

describe("isValidRaycastEntry", () => {
  it("mirrors normalizeRaycastEntry's pass/fail result", () => {
    expect(isValidRaycastEntry(rawEntry)).toBe(true);
    expect(isValidRaycastEntry({})).toBe(false);
  });
});
