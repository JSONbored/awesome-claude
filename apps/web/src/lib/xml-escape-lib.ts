// Pure XML text/attribute escaping, split out of the sitemap route so the
// entity replacement can be unit-tested and reused.

/** Escape the five predefined XML entities: & < > " '. */
export function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
