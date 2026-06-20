import { describe, expect, it } from "vitest";

import { findNextH3Start } from "@/lib/content-section-parsing";

describe("findNextH3Start", () => {
  it("returns the index of a plain h3 open tag", () => {
    expect(findNextH3Start("<h3>Title</h3>")).toBe(0);
  });

  it("matches h3 tags that carry attributes", () => {
    // The opening tag may have attributes, so a space after `<h3` still counts.
    expect(findNextH3Start('<p>x</p><h3 class="a">T</h3>')).toBe(8);
  });

  it("is case-insensitive for the tag name", () => {
    expect(findNextH3Start("<H3>T</H3>")).toBe(0);
  });

  it("does not match tags that merely start with h3 (e.g. <h3x>, <h33>)", () => {
    // The character after `<h3` must be a tag boundary, so `<h3x>` is not an h3.
    expect(findNextH3Start("<h3x>not a heading</h3x>")).toBe(-1);
    // `<h33>` is skipped, but a real `<h3>` later in the string is found.
    expect(findNextH3Start("<h33>x</h33><h3>real</h3>")).toBe(12);
  });

  it("treats whitespace right after <h3 as a valid boundary", () => {
    expect(findNextH3Start("<h3\n id=x>T</h3>")).toBe(0);
  });

  it("honors the from offset to find a later h3", () => {
    // Starting past the first heading returns the next one.
    expect(findNextH3Start("<h3>a</h3><h3>b</h3>", 5)).toBe(10);
  });

  it("returns -1 when no h3 open tag is present", () => {
    expect(findNextH3Start("<h2>x</h2>")).toBe(-1);
  });
});
