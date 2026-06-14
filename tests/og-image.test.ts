import { describe, expect, it } from "vitest";

import { categoryAccent, renderOgSvg, safeAccent } from "@/lib/og-image";

describe("og image accent sanitization", () => {
  it("passes through valid hex colors", () => {
    expect(safeAccent("#c5e84e")).toBe("#c5e84e");
    expect(safeAccent("#FFF")).toBe("#FFF");
    expect(safeAccent("#aabbccdd")).toBe("#aabbccdd");
    expect(safeAccent(categoryAccent("mcp"))).toBe(categoryAccent("mcp"));
  });

  it("falls back to the default accent for missing or non-hex values", () => {
    expect(safeAccent(undefined)).toBe("#c5e84e");
    expect(safeAccent(null)).toBe("#c5e84e");
    expect(safeAccent("red")).toBe("#c5e84e");
    expect(safeAccent("#ggg")).toBe("#c5e84e");
  });

  it("rejects attribute-breakout payloads so the SVG cannot be injected", () => {
    const payload = '"><script>alert(1)</script>';
    expect(safeAccent(payload)).toBe("#c5e84e");

    const svg = renderOgSvg({ title: "Hello", accent: payload });
    expect(svg).not.toContain("<script>");
    expect(svg).toContain('fill="#c5e84e"');
  });
});
