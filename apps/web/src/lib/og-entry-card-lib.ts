// Pure resolution of the OG card fields for an entry image, split out of the
// per-entry OG route so the fallback precedence can be unit-tested without
// rendering a PNG.

type OgEntryLike = {
  title?: string | null;
  cardDescription?: string | null;
  description?: string | null;
  author?: string | null;
  category?: string | null;
};

export type OgEntryCardFields = {
  title: string;
  description: string;
  author: string;
  category: string;
};

/**
 * Resolve the OG card fields for an entry, falling back to the request's slug /
 * category (and default copy) when the entry or its fields are missing.
 */
export function ogEntryCardFields(
  entry: OgEntryLike | null | undefined,
  fallbackSlug: string,
  fallbackCategory: string,
): OgEntryCardFields {
  return {
    title: entry?.title ?? fallbackSlug,
    description:
      entry?.cardDescription ?? entry?.description ?? "Curated in the HeyClaude registry.",
    author: entry?.author ?? "HeyClaude",
    category: entry?.category ?? fallbackCategory,
  };
}
