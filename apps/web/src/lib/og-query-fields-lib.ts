// Pure resolution of the generic OG image query fields (title, description,
// eyebrow, accent), split out of the /og route so the fallbacks and clamping
// can be unit-tested without rendering a PNG.

import { OG_TEXT_LIMITS, clampOgText, safeAccent } from "@/lib/og-image";

export type OgQueryFields = {
  title: string;
  description: string;
  eyebrow: string;
  accent: string;
};

/**
 * Resolve the /og query params: title/eyebrow default to "HeyClaude", the
 * description falls back description -> subtitle -> the site description, all
 * text is clamped to its OG limit, and the accent is clamped to a safe hex.
 */
export function resolveOgQueryFields(
  params: URLSearchParams,
  siteDescription: string,
): OgQueryFields {
  const title = clampOgText(params.get("title") ?? "HeyClaude", OG_TEXT_LIMITS.title);
  const rawDescription = params.get("description") ?? params.get("subtitle") ?? siteDescription;
  const description = clampOgText(rawDescription, OG_TEXT_LIMITS.description);
  const eyebrow = clampOgText(params.get("eyebrow") ?? "HeyClaude", OG_TEXT_LIMITS.eyebrow);
  const accent = safeAccent(params.get("accent"));
  return { title, description, eyebrow, accent };
}
