import { describe, expect, it } from "vitest";

import { getOgFonts } from "@/lib/og-fonts";

describe("getOgFonts", () => {
  it("returns the Space Grotesk 500/700 set with decoded font bytes", () => {
    const fonts = getOgFonts();
    expect(fonts).toHaveLength(2);
    expect(fonts.map((font) => font.name)).toEqual([
      "Space Grotesk",
      "Space Grotesk",
    ]);
    expect(fonts.map((font) => font.weight)).toEqual([500, 700]);
    expect(fonts.every((font) => font.style === "normal")).toBe(true);
  });

  it("decodes each font to a non-empty ArrayBuffer", () => {
    // Satori needs the raw font bytes, so each entry must carry real data.
    for (const font of getOgFonts()) {
      expect(font.data).toBeInstanceOf(ArrayBuffer);
      expect(font.data.byteLength).toBeGreaterThan(0);
    }
  });

  it("caches the font set, returning the same reference on repeat calls", () => {
    // The bytes are decoded once per isolate and reused for every OG card.
    expect(getOgFonts()).toBe(getOgFonts());
  });
});
