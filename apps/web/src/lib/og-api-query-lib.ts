/**
 * Map the documented `/api/og` query contract onto the shared OG card renderer.
 *
 * `/og` accepts title/description/eyebrow/accent. The published OpenAPI contract for
 * `/api/og` uses title/description/label/kind/badge instead — this adapter is the
 * bridge so the API honors its own schema while reusing resolveOgQueryFields +
 * renderOgPng unchanged.
 */

import { OG_TEXT_LIMITS, clampOgText } from "@/lib/og-image";
import { resolveOgQueryFields } from "@/lib/og-query-fields-lib";
import type { OgCardOptions } from "@/lib/og-render-lib";

export const OG_API_KIND_ACCENTS = {
  registry: "#e1f32a",
  category: "#8aa9ff",
  entry: "#7cd17c",
  job: "#f3b85a",
  tool: "#ff9a7a",
  platform: "#76d7c4",
} as const;

export type OgApiKind = keyof typeof OG_API_KIND_ACCENTS;

export type OgApiQuery = {
  title: string;
  description: string;
  label: string;
  kind: OgApiKind;
  badge: string;
};

/**
 * Resolve `/api/og` query fields into OgCardOptions for renderOgPng.
 *
 * Mapping:
 * - title/description → card title/description (clamped via resolveOgQueryFields)
 * - label → eyebrow (section label)
 * - kind → accent color (so kind visibly affects the card)
 * - badge → author line ("by …")
 */
export function resolveApiOgCardOptions(query: OgApiQuery): OgCardOptions {
  const fields = resolveOgQueryFields(
    new URLSearchParams({
      title: query.title,
      description: query.description,
      eyebrow: query.label,
      accent: OG_API_KIND_ACCENTS[query.kind],
    }),
    query.description,
  );

  const author = clampOgText(query.badge, OG_TEXT_LIMITS.author);

  return {
    title: fields.title,
    description: fields.description || undefined,
    eyebrow: fields.eyebrow,
    accent: fields.accent,
    author: author || undefined,
  };
}
