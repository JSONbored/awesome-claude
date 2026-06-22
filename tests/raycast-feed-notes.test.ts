import { describe, expect, it } from "vitest";

import {
  normalizeNotes,
  buildInstallNotesSummary,
} from "../integrations/raycast/src/feed.js";

describe("normalizeNotes", () => {
  it("trims entries and drops blanks", () => {
    expect(normalizeNotes([" a ", "", "b", "  "])).toEqual(["a", "b"]);
  });

  it("returns an empty array when no notes are provided", () => {
    // The parameter is optional, so a missing value yields an empty list.
    expect(normalizeNotes()).toEqual([]);
  });
});

describe("buildInstallNotesSummary", () => {
  it("renders labeled safety and privacy sections as bullet lists", () => {
    const summary = buildInstallNotesSummary(["s1", "s2"], ["p1"]);
    expect(summary).toContain("⚠️ Safety:");
    expect(summary).toContain("• s1");
    expect(summary).toContain("🔒 Privacy:");
    expect(summary).toContain("• p1");
  });

  it("caps each section at three bullets and summarizes the remainder", () => {
    const summary = buildInstallNotesSummary(["a", "b", "c", "d", "e"], []);
    expect(summary).toContain("• a");
    expect(summary).toContain("• c");
    expect(summary).not.toContain("• d");
    expect(summary).toContain("• …and 2 more");
  });

  it("returns an empty string when there are no notes", () => {
    expect(buildInstallNotesSummary([], [])).toBe("");
  });
});
