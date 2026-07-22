import { describe, expect, it } from "vitest";

import {
  OG_API_KIND_ACCENTS,
  resolveApiOgCardOptions,
} from "@/lib/og-api-query-lib";
import { buildOgCardHtml } from "@/lib/og-render-lib";

describe("resolveApiOgCardOptions", () => {
  it("maps title, label→eyebrow, badge→author, and kind→accent", () => {
    const opts = resolveApiOgCardOptions({
      title: "Metagraphed MCP",
      description: "Graph memory for agents",
      label: "MCP",
      kind: "entry",
      badge: "heyclau.de",
    });

    expect(opts).toEqual({
      title: "Metagraphed MCP",
      description: "Graph memory for agents",
      eyebrow: "MCP",
      accent: OG_API_KIND_ACCENTS.entry,
      author: "heyclau.de",
    });
  });

  it("uses a distinct accent per documented kind so kind is visible in the card", () => {
    const accents = new Set(
      (
        Object.keys(OG_API_KIND_ACCENTS) as Array<
          keyof typeof OG_API_KIND_ACCENTS
        >
      ).map(
        (kind) =>
          resolveApiOgCardOptions({
            title: "T",
            description: "D",
            label: "L",
            kind,
            badge: "b",
          }).accent,
      ),
    );
    expect(accents.size).toBe(Object.keys(OG_API_KIND_ACCENTS).length);
  });

  it("clamps whitespace in title/label/badge before rendering", () => {
    const opts = resolveApiOgCardOptions({
      title: "  Hello   World  ",
      description: "  short  ",
      label: "  registry  ",
      kind: "registry",
      badge: "  badge  ",
    });
    expect(opts.title).toBe("Hello World");
    expect(opts.eyebrow).toBe("registry");
    expect(opts.author).toBe("badge");
  });

  it("feeds the shared HTML card so title + kind accent land in the markup", () => {
    const opts = resolveApiOgCardOptions({
      title: "Sample Entry Card",
      description: "Honors documented /api/og query params",
      label: "Entry",
      kind: "entry",
      badge: "heyclau.de",
    });
    const html = buildOgCardHtml(opts);

    expect(html).toContain("Sample Entry Card");
    expect(html).toContain(">ENTRY<");
    expect(html).toContain(`background:${OG_API_KIND_ACCENTS.entry}`);
    expect(html).toContain("heyclau.de");
    expect(html).toContain("Honors documented /api/og query params");
  });
});
