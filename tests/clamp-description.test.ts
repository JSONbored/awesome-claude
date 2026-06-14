import { describe, expect, it } from "vitest";

import { clampDescription } from "@/lib/seo";

describe("clampDescription", () => {
  it("returns short descriptions unchanged (whitespace collapsed)", () => {
    expect(clampDescription("A concise description.")).toBe("A concise description.");
    expect(clampDescription("multi   space\ntext")).toBe("multi space text");
  });

  it("clamps long descriptions to <= max and cuts on a word boundary", () => {
    const long =
      "This is a deliberately long meta description that comfortably exceeds the configured " +
      "maximum length so that the clamp has to trim it down to a search-display-safe size.";
    const out = clampDescription(long);
    expect(out.length).toBeLessThanOrEqual(155);
    expect(out.endsWith("…")).toBe(true);
    expect(out).not.toMatch(/\s…$/); // no dangling space before the ellipsis
  });

  it("respects a custom max", () => {
    expect(clampDescription("one two three four five six", 10).length).toBeLessThanOrEqual(10);
  });
});
