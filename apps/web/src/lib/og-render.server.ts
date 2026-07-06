import type { ImageResponse } from "workers-og";

import { getOgFonts } from "@/lib/og-fonts";
import { buildOgCardHtml, type OgCardOptions } from "@/lib/og-render-lib";
import { OG_HEIGHT, OG_WIDTH } from "@/lib/og-image";

export type { OgCardOptions } from "@/lib/og-render-lib";
export { buildOgCardHtml, withAlpha } from "@/lib/og-render-lib";

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
export async function renderOgPng(opts: OgCardOptions): Promise<ImageResponse> {
  const { ImageResponse } = await import("workers-og");
  return new ImageResponse(buildOgCardHtml(opts), {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    format: "png",
    fonts: getOgFonts(),
  });
}
