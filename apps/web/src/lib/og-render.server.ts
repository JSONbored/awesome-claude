import type { ImageResponse } from "workers-og";

import { getOgFonts } from "@/lib/og-fonts";
import {
  OG_ACCENT_INK,
  OG_ACCENT_SOFT,
  OG_BG,
  OG_BORDER,
  OG_HEIGHT,
  OG_INK,
  OG_INK_MUTED,
  OG_INK_SUBTLE,
  OG_TEXT_LIMITS,
  OG_WIDTH,
  clampOgText,
  safeAccent,
  wrap,
} from "@/lib/og-image";

/**
 * Warm-paper + 32px graph-paper grid that matches the site's `.grid-bg` utility
 * (1px lines in `--border` at ~60% over the warm-paper `--background`). Baked as a
 * full-bleed SVG data URI because Satori draws a background image but can't tile via
 * `background-size`, so the whole grid is drawn once at 1200×630. URL-encoded (not
 * base64) to avoid a Buffer/btoa dependency in the Workers runtime.
 */
const GRID_BG_DATA_URI = (() => {
  const segments: string[] = [];
  for (let x = 32; x < OG_WIDTH; x += 32) segments.push(`M${x} 0V${OG_HEIGHT}`);
  for (let y = 32; y < OG_HEIGHT; y += 32) segments.push(`M0 ${y}H${OG_WIDTH}`);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_WIDTH}" height="${OG_HEIGHT}"><path d="${segments.join(
    "",
  )}" stroke="${OG_BORDER}" stroke-width="1" stroke-opacity="0.6" fill="none"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
})();

/**
 * GitHub mark (lucide `github` icon) for the card footer, embedded as an SVG data URI
 * `<img>` because the bundled Space Grotesk font subset has no icon glyphs. Stroked in
 * the muted ink so it sits quietly next to the footer text.
 */
const GITHUB_ICON_DATA_URI = (() => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${OG_INK_SUBTLE}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
})();

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
  /** Positive trust signal shown as a pill (e.g. "First-party", "Source-backed"). */
  badge?: string;
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
        `<div style="display:flex;font-family:'Space Grotesk';font-weight:700;font-size:78px;line-height:88px;color:${OG_INK};">${escForSatori(
          l,
        )}</div>`,
    )
    .join("");

  const descHtml = descLines.length
    ? `<div style="display:flex;flex-direction:column;margin-top:28px;">${descLines
        .map(
          (l) =>
            `<div style="display:flex;font-family:'Space Grotesk';font-weight:500;font-size:28px;line-height:38px;color:${OG_INK_MUTED};">${escForSatori(
              l,
            )}</div>`,
        )
        .join("")}</div>`
    : "";

  // Use a plain space, not the "&nbsp;" HTML entity: workers-og parses the markup with
  // HTMLRewriter, which does not decode entities, so "&nbsp;" would render verbatim.
  const authorHtml = opts.author
    ? `<div style="display:flex;margin-top:32px;font-family:'Space Grotesk';font-weight:500;font-size:22px;color:${OG_INK_SUBTLE};">by <span style="font-weight:700;color:${OG_INK};">${escForSatori(
        clampOgText(opts.author, OG_TEXT_LIMITS.author),
      )}</span></div>`
    : "";

  // Trust pill (positive signals only) — citron-soft chip aligned with the eyebrow.
  const badge = opts.badge ? escForSatori(clampOgText(opts.badge, 24)) : "";
  const badgeHtml = badge
    ? `<div style="display:flex;align-items:center;height:40px;padding:0 18px;border-radius:999px;background:${OG_ACCENT_SOFT};font-family:'Space Grotesk';font-weight:700;font-size:18px;letter-spacing:1px;color:${OG_ACCENT_INK};">${badge}</div>`
    : "";

  const html = `<div style="display:flex;width:1200px;height:630px;background-color:${OG_BG};background-image:url('${GRID_BG_DATA_URI}');background-size:1200px 630px;background-repeat:no-repeat;">
  <div style="display:flex;width:14px;height:630px;background:${accent};"></div>
  <div style="display:flex;flex-direction:column;flex:1;padding:80px 80px;">
    <div style="display:flex;align-items:center;justify-content:space-between;">
      <div style="display:flex;font-family:'Space Grotesk';font-weight:500;font-size:20px;letter-spacing:2px;color:${OG_INK_SUBTLE};">${eyebrow}</div>
      ${badgeHtml}
    </div>
    <div style="display:flex;flex-direction:column;margin-top:44px;">${titleHtml}</div>
    ${descHtml}
    ${authorHtml}
    <div style="display:flex;flex:1;"></div>
    <div style="display:flex;align-items:center;font-family:'Space Grotesk';font-weight:500;font-size:20px;color:${OG_INK_SUBTLE};">
      <span style="display:flex;">heyclau.de</span>
      <span style="display:flex;margin:0 14px;color:${OG_BORDER};">|</span>
      <img src="${GITHUB_ICON_DATA_URI}" width="22" height="22" style="margin-right:8px;" />
      <span style="display:flex;">github.com/JSONbored/awesome-claude</span>
    </div>
  </div>
</div>`;

  return new ImageResponse(html, {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    format: "png",
    fonts: getOgFonts(),
  });
}
