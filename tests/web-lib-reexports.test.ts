import { describe, expect, it } from "vitest";

import { categoryAccent, esc, safeAccent } from "@/lib/og-image";
import { getSectionVariant } from "@/lib/content-section-variant";
import { getEmbeddedSectionType } from "@/lib/content-section-parsing";

describe("web lib re-exports", () => {
  it("re-exports og-image helpers through the public surface", () => {
    expect(categoryAccent("mcp")).toBe("#7cd17c");
    expect(safeAccent('"><script>')).toBe("#e1f32a");
    expect(esc("<tag>")).toBe("&lt;tag&gt;");
  });

  it("re-exports content-section helpers through the public surfaces", () => {
    expect(getSectionVariant("Security warning")).toBe("warning");
    expect(getEmbeddedSectionType("<!-- section type: overview -->")).toBe(
      "overview",
    );
  });
});
