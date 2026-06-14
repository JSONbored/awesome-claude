import { describe, expect, it } from "vitest";

import {
  OG_TEXT_LIMITS,
  categoryAccent,
  clampOgText,
  renderOgSvg,
  safeAccent,
  wrap,
} from "@/lib/og-image";

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

describe("og image text bounds", () => {
  it("clamps query-controlled text before rendering", () => {
    expect(
      clampOgText("a".repeat(OG_TEXT_LIMITS.title + 1), OG_TEXT_LIMITS.title),
    ).toHaveLength(OG_TEXT_LIMITS.title);
    expect(clampOgText("  hello\n\tworld  ", OG_TEXT_LIMITS.title)).toBe(
      "hello world",
    );
  });

  it("does not pass overlong single words through wrapping", () => {
    const lines = wrap("a".repeat(200), 22, 2);

    expect(lines).toHaveLength(2);
    expect(lines.every((line) => line.length <= 22)).toBe(true);
  });
});
