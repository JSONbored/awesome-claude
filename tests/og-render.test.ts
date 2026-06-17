import { describe, expect, it } from "vitest";

import { buildOgCardHtml, withAlpha } from "@/lib/og-render.server";
import { categoryAccent } from "@/lib/og-image";

// Note: renderOgPng is a thin wrapper that constructs a workers-og ImageResponse, whose
// resvg/yoga WASM cannot load under the node test runtime. All of its logic lives in the
// pure buildOgCardHtml below, which is exercised directly here.

describe("withAlpha", () => {
  it("expands 3-digit, 6-digit, and 8-digit hex to rgba()", () => {
    expect(withAlpha("#fff", 1)).toBe("rgba(255, 255, 255, 1)");
    expect(withAlpha("#7cd17c", 0.85)).toBe("rgba(124, 209, 124, 0.85)");
    // 8-digit: the source hex alpha is ignored; the explicit alpha arg wins.
    expect(withAlpha("#e1f32aff", 0.5)).toBe("rgba(225, 243, 42, 0.5)");
  });
});

describe("buildOgCardHtml", () => {
  it("uses the light-mode warm-paper background and the graph-paper grid", () => {
    const html = buildOgCardHtml({ title: "Hello" });
    expect(html).toContain("background-color:#f8f6ed");
    expect(html).toContain("background-image:url('data:image/svg+xml,");
  });

  it("color-codes the accent rail + swash by category (MCP = green)", () => {
    const html = buildOgCardHtml({
      title: "X",
      eyebrow: "mcp",
      accent: categoryAccent("mcp"),
    });
    expect(categoryAccent("mcp")).toBe("#7cd17c");
    expect(html).toContain("background:#7cd17c"); // left rail
    expect(html).toContain("rgba(124, 209, 124, 0.85)"); // hero-style swash
    expect(html).toContain("linear-gradient(to top,");
  });

  it("falls back to the citron brand accent for an unknown/missing category", () => {
    const html = buildOgCardHtml({ title: "X" });
    expect(html).toContain("background:#e1f32a");
    expect(html).toContain("rgba(225, 243, 42, 0.85)");
  });

  it("uppercases the category eyebrow and defaults it to HEYCLAUDE", () => {
    expect(buildOgCardHtml({ title: "X", eyebrow: "skills" })).toContain(
      ">SKILLS<",
    );
    expect(buildOgCardHtml({ title: "X" })).toContain(">HEYCLAUDE<");
  });

  it("renders the GitHub footer with the icon data-URI and repo URL", () => {
    const html = buildOgCardHtml({ title: "X" });
    expect(html).toContain("heyclau.de");
    expect(html).toContain("github.com/JSONbored/awesome-claude");
    expect(html).toContain('<img src="data:image/svg+xml,');
  });

  it("includes the author with explicit spacing, and omits it when absent", () => {
    const withAuthor = buildOgCardHtml({ title: "X", author: "GitHub" });
    expect(withAuthor).toContain('by<span style="margin-left:8px;');
    expect(withAuthor).toContain("GitHub");
    expect(buildOgCardHtml({ title: "X" })).not.toContain("by<span");
  });

  it("omits the description block entirely when no description is given", () => {
    const html = buildOgCardHtml({ title: "X" });
    expect(html).not.toContain("font-size:28px;line-height:38px");
  });

  it("ellipsizes a long description and shows a short one in full", () => {
    const long = buildOgCardHtml({
      title: "X",
      description:
        "Official GitHub MCP server providing comprehensive GitHub API access for " +
        "repository management, file operations, search, issues, pull requests, branches, " +
        "releases, webhooks, and a great many other capabilities across all repositories",
    });
    expect(long).toContain("…");

    const short = buildOgCardHtml({
      title: "X",
      description: "A short blurb.",
    });
    expect(short).toContain("A short blurb.");
    expect(short).not.toContain("…");
  });

  it("strips angle brackets so caller text can't inject markup", () => {
    const html = buildOgCardHtml({
      title: '"><script>alert(1)</script>',
      author: "<b>evil</b>",
      description: "<img src=x onerror=1>",
    });
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("</script>");
    expect(html).not.toContain("<b>");
    expect(html).not.toContain("onerror=1>");
  });

  it("sanitizes a malicious accent via safeAccent (no attribute breakout)", () => {
    const html = buildOgCardHtml({
      title: "X",
      accent: '"><script>alert(1)</script>',
    });
    expect(html).not.toContain("<script>");
    // Falls back to the citron default rather than echoing the payload.
    expect(html).toContain("background:#e1f32a");
  });
});
