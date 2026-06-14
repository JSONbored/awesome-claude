import type { ImageResponse } from "workers-og";

import { getOgFonts } from "@/lib/og-fonts";
import { OG_HEIGHT, OG_TEXT_LIMITS, OG_WIDTH, clampOgText, safeAccent, wrap } from "@/lib/og-image";

/**
 * Sanitize a text value for the Satori HTML template.
 *
 * workers-og parses markup with Cloudflare's HTMLRewriter, which treats `<…>` as tags
 * and does NOT decode HTML entities. So we cannot reuse the SVG escaper (it would emit
 * "&amp;"/"&lt;" that render verbatim). Instead we strip angle brackets — the only
 * characters that could open a tag — which keeps the output injection-safe while letting
 * `&`, quotes, and everything else display as literal text. (Accent, the only
 * user-controlled style value, is separately clamped by safeAccent.)
 */
function escForSatori(value: string) {
  return value.replace(/[<>]/g, "");
}

/**
 * Render the OG card as a PNG. Same 1200×630 design as renderOgSvg, but built as an
 * HTML string for Satori (via workers-og's ImageResponse) so social scrapers that do
 * NOT rasterize SVG og:images (Twitter/X, Facebook, LinkedIn, Slack, Discord) get a
 * real raster image.
 *
 * This module is server-only on purpose: workers-og statically imports its own resvg +
 * yoga `.wasm` modules, which must not be pulled into the browser bundle. The Vite
 * `serverOnlyClientStubs` plugin stubs `*.server` imports for the client build.
 *
 * workers-og is imported lazily (dynamic `import()` below) rather than at module top
 * level: TanStack's dev SSR eagerly evaluates the whole route tree, so a static import
 * here would pull workers-og's `.wasm` into Node's ESM loader for EVERY page and 500 the
 * entire site under `vite dev` (Node can't resolve the bundled `.wasm`). Deferring it
 * keeps `pnpm dev` working for all routes; only an actual request to `/og*` loads it
 * (still server-only — the Cloudflare/Workers runtime resolves the WASM in prod).
 *
 * workers-og initializes the WASM lazily on first render, so no manual WASM handling is
 * required here. Satori needs real font bytes (it cannot resolve CSS font-family names),
 * which getOgFonts() supplies from a bundled, base64-embedded Space Grotesk subset.
 */
export async function renderOgPng(opts: {
  eyebrow?: string;
  title: string;
  description?: string;
  author?: string;
  accent?: string;
}): Promise<ImageResponse> {
  const { ImageResponse } = await import("workers-og");
  const accent = safeAccent(opts.accent);
  const eyebrow = escForSatori(
    clampOgText(opts.eyebrow || "HeyClaude", OG_TEXT_LIMITS.eyebrow).toUpperCase(),
  );
  const titleLines = wrap(clampOgText(opts.title, OG_TEXT_LIMITS.title), 22, 2);
  const descLines = opts.description
    ? wrap(clampOgText(opts.description, OG_TEXT_LIMITS.description), 60, 2)
    : [];

  const titleHtml = titleLines
    .map(
      (l) =>
        `<div style="display:flex;font-family:'Space Grotesk';font-weight:700;font-size:78px;line-height:88px;color:#171614;">${escForSatori(
          l,
        )}</div>`,
    )
    .join("");

  const descHtml = descLines.length
    ? `<div style="display:flex;flex-direction:column;margin-top:28px;">${descLines
        .map(
          (l) =>
            `<div style="display:flex;font-family:'Space Grotesk';font-weight:500;font-size:28px;line-height:38px;color:#4d4c47;">${escForSatori(
              l,
            )}</div>`,
        )
        .join("")}</div>`
    : "";

  // Use a plain space, not the "&nbsp;" HTML entity: workers-og parses the markup with
  // HTMLRewriter, which does not decode entities, so "&nbsp;" would render verbatim.
  const authorHtml = opts.author
    ? `<div style="display:flex;margin-top:32px;font-family:'Space Grotesk';font-weight:500;font-size:22px;color:#6b6a64;">by <span style="font-weight:700;color:#171614;">${escForSatori(
        clampOgText(opts.author, OG_TEXT_LIMITS.author),
      )}</span></div>`
    : "";

  const html = `<div style="display:flex;width:1200px;height:630px;background:linear-gradient(135deg,#f7f5ef,#ece8df);">
  <div style="display:flex;width:14px;height:630px;background:${accent};"></div>
  <div style="display:flex;flex-direction:column;flex:1;padding:90px 80px;">
    <div style="display:flex;font-family:'Space Grotesk';font-weight:500;font-size:20px;letter-spacing:2px;color:#6b6a64;">${eyebrow}</div>
    <div style="display:flex;flex-direction:column;margin-top:48px;">${titleHtml}</div>
    ${descHtml}
    ${authorHtml}
    <div style="display:flex;flex:1;"></div>
    <div style="display:flex;font-family:'Space Grotesk';font-weight:500;font-size:20px;color:#6b6a64;">heyclau.de</div>
  </div>
</div>`;

  return new ImageResponse(html, {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    format: "png",
    fonts: getOgFonts(),
  });
}
