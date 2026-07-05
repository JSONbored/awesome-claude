/**
 * Open Graph image helpers surface.
 *
 * Pure OG SVG helpers live in `og-image-lib.ts`. This module re-exports that
 * surface so existing `@/lib/og-image` imports stay unchanged.
 */
export {
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
  categoryAccent,
  clampOgText,
  descriptionLines,
  esc,
  ogImageUrl,
  renderBadgeSvg,
  renderOgSvg,
  safeAccent,
  wrap,
} from "@/lib/og-image-lib";
