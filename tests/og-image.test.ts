import { describe, expect, it } from "vitest";

import {
  OG_TEXT_LIMITS,
  categoryAccent,
  clampOgText,
  descriptionLines,
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
    expect(safeAccent(undefined)).toBe("#e1f32a");
    expect(safeAccent(null)).toBe("#e1f32a");
    expect(safeAccent("red")).toBe("#e1f32a");
    expect(safeAccent("#ggg")).toBe("#e1f32a");
  });

  it("rejects attribute-breakout payloads so the SVG cannot be injected", () => {
    const payload = '"><script>alert(1)</script>';
    expect(safeAccent(payload)).toBe("#e1f32a");

    const svg = renderOgSvg({ title: "Hello", accent: payload });
    expect(svg).not.toContain("<script>");
    expect(svg).toContain('fill="#e1f32a"');
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

describe("og description truncation", () => {
  it("returns short descriptions unchanged with no ellipsis", () => {
    const lines = descriptionLines("A short description.", 58, 3);
    expect(lines.join(" ")).toBe("A short description.");
    expect(lines.join("")).not.toContain("…");
  });

  it("ellipsizes overflow at a word boundary, trimming a dangling comma + connector", () => {
    // perLine 17 / maxLines 1 forces the visible line to end at "alpha beta gamma,"
    // right before "and …" — exactly the mid-phrase cut we want to clean up.
    const lines = descriptionLines(
      "alpha beta gamma, and delta epsilon zeta",
      17,
      1,
    );

    expect(lines).toEqual(["alpha beta gamma…"]);
  });

  it("ellipsizes long descriptions and never ends on a dangling connector", () => {
    const text =
      "Official GitHub MCP server providing comprehensive GitHub API access for " +
      "repository management, file operations, and search functionality, plus issues, " +
      "pull requests, branches, releases, and webhooks across all of your repositories";
    const lines = descriptionLines(text, 58, 3);

    expect(lines.length).toBeLessThanOrEqual(3);
    const last = lines[lines.length - 1];
    expect(last.endsWith("…")).toBe(true);
    expect(last).not.toMatch(/(?:,|\band)\s*…$/i);
  });
});
