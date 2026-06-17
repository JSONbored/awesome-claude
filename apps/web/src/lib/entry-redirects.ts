/**
 * Permanent (301) redirects for entry detail pages that were removed and
 * consolidated into another entry (e.g. de-duplication).
 *
 * Keyed by `"<category>/<slug>"` of the REMOVED page; the value is the surviving
 * entry to redirect to. This preserves the removed URL's accumulated SEO signal
 * by handing it to the canonical entry with a 301 instead of returning a 404.
 *
 * Consulted by both entry-detail route shapes (`/entry/$category/$slug` and the
 * legacy `/$category/$slug`) so the old URL 301s regardless of which shape a
 * crawler holds. Entries listed here should also be removed from `content/` so
 * they drop out of the catalog and sitemap; the redirect remains permanently.
 */
export const ENTRY_REDIRECTS: Record<string, { category: string; slug: string }> = {
  // Duplicate Mintlify skill consolidated into the richer `/mintlify-docs` command.
  "skills/mintlify-documentation-automation": {
    category: "commands",
    slug: "mintlify-docs",
  },
};

/**
 * Returns the consolidation redirect target for a removed entry, or `null` if
 * the entry is not a consolidated/removed page.
 */
export function getEntryRedirectTarget(
  category: string,
  slug: string,
): { category: string; slug: string } | null {
  return ENTRY_REDIRECTS[`${category}/${slug}`] ?? null;
}
