// Shared og:image + twitter card meta tags for the PNG social card that every
// hub/detail route emits. Defined once so the dimensions, type, and twitter card
// kind stay consistent (and are unit-tested) across routes. The dimensions come
// from the canonical OG_WIDTH/OG_HEIGHT used to render the card, so the declared
// size can never drift from the image actually produced.

import { OG_HEIGHT, OG_WIDTH } from "@/lib/og-image";

export type OgImageMetaTag =
  | { property: string; content: string }
  | { name: string; content: string };

/**
 * The standard og:image + twitter card meta tags for the social card.
 * When `ogType` is given ("website" / "article"), an `og:type` tag is emitted
 * between the image tags and the twitter card tags, matching the routes that
 * declare one.
 */
export function ogImageMetaTags(ogImage: string, ogType?: string): OgImageMetaTag[] {
  return [
    { property: "og:image", content: ogImage },
    { property: "og:image:type", content: "image/png" },
    { property: "og:image:width", content: String(OG_WIDTH) },
    { property: "og:image:height", content: String(OG_HEIGHT) },
    ...(ogType ? [{ property: "og:type", content: ogType }] : []),
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:image", content: ogImage },
  ];
}
