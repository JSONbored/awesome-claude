import { describe, expect, it } from "vitest";

import { renderBadgeSvg } from "@/lib/og-image";

describe("renderBadgeSvg", () => {
  it("renders a self-contained SVG document containing both segments", () => {
    const svg = renderBadgeSvg({ label: "MCP", value: "Anki" });
    expect(svg.trim().startsWith("<svg")).toBe(true);
    expect(svg).toContain("MCP");
    expect(svg).toContain("Anki");
  });

  it("entity-escapes XML metacharacters in the label/value text", () => {
    // Badge text is embedded in SVG element content, so &, <, > must be escaped.
    const svg = renderBadgeSvg({ label: "A & B", value: "<test>" });
    expect(svg).toContain("&amp;");
    expect(svg).toContain("&lt;test&gt;");
  });

  it("applies a valid hex accent but drops an unsafe one", () => {
    expect(renderBadgeSvg({ value: "V", accent: "#00ff00" })).toContain(
      "#00ff00",
    );
    // safeAccent rejects markup-bearing input so it can't break out of the attr.
    const evil = renderBadgeSvg({
      value: "V",
      accent: '"/><script>alert(1)</script>',
    });
    expect(evil).not.toContain("<script>");
    expect(evil.trim().startsWith("<svg")).toBe(true);
  });

  it("falls back to default label and value when omitted/blank", () => {
    const svg = renderBadgeSvg({ value: "" });
    expect(svg).toContain("Listed on HeyClaude");
    expect(svg).toContain("registry");
  });
});
