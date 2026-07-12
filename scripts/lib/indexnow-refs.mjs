// Pure CLI-argument parsing behind scripts/indexnow-changed-urls.mjs: turning the
// changed-entry ref strings ("category/slug") passed as CLI args into structured
// { category, slug } refs. Split out so the parsing can be unit-tested without the
// network/fetch layer the script uses to expand each ref into hub URLs.

/**
 * Parse "category/slug" ref strings into { category, slug } objects. Blank refs,
 * refs without a slash, and refs with an empty category/slug or a nested slug
 * ("a/b/c") are skipped.
 */
export function parseRefs(argv) {
  const refs = [];
  for (const raw of argv) {
    const ref = String(raw).trim();
    if (!ref) continue;
    const slash = ref.indexOf("/");
    if (slash < 0) continue;
    const category = ref.slice(0, slash);
    const slug = ref.slice(slash + 1);
    if (!category || !slug || slug.includes("/")) continue;
    refs.push({ category, slug });
  }
  return refs;
}
