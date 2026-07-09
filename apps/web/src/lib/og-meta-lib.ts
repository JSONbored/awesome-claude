// Shared og:image + twitter card meta tags for the 1200x630 PNG social card that
// every hub/detail route emits. Defined once so the dimensions, type, and
// twitter card kind stay consistent (and are unit-tested) across routes.

export type OgImageMetaTag =
  | { property: string; content: string }
  | { name: string; content: string };

/**
 * The standard og:image + twitter card meta tags for a 1200x630 PNG card.
 * When `ogType` is given ("website" / "article"), an `og:type` tag is emitted
 * between the image tags and the twitter card tags, matching the routes that
 * declare one.
 */
export function ogImageMetaTags(ogImage: string, ogType?: string): OgImageMetaTag[] {
  return [
    { property: "og:image", content: ogImage },
    { property: "og:image:type", content: "image/png" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    ...(ogType ? [{ property: "og:type", content: ogType }] : []),
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:image", content: ogImage },
  ];
}
