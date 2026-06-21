import { describe, expect, it } from "vitest";

import {
  getEmbeddedSectionType,
  stripSectionTypeComments,
} from "@/lib/content-section-parsing";

describe("getEmbeddedSectionType", () => {
  it("extracts the section type from an embedded marker comment", () => {
    expect(
      getEmbeddedSectionType("<!-- section type: overview --><p>x</p>"),
    ).toBe("overview");
  });

  it("keeps ascii letters and underscores, lowercasing the value", () => {
    // The reader stops at the first non-letter/underscore character, so the
    // value is a clean, lowercased token rather than arbitrary comment text.
    expect(getEmbeddedSectionType("<!-- section type: How_To -->")).toBe(
      "how_to",
    );
    expect(getEmbeddedSectionType("<!-- section type: setup-steps -->")).toBe(
      "setup",
    );
  });

  it("returns null when there is no section-type marker", () => {
    expect(getEmbeddedSectionType("<p>no marker here</p>")).toBeNull();
  });
});

describe("stripSectionTypeComments", () => {
  it("removes the marker comment and trims the surrounding html", () => {
    expect(
      stripSectionTypeComments("<!-- section type: overview --><p>body</p>"),
    ).toBe("<p>body</p>");
  });

  it("returns trimmed html unchanged when no marker is present", () => {
    expect(stripSectionTypeComments("  <p>body</p>  ")).toBe("<p>body</p>");
  });
});
