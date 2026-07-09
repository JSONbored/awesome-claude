// Pure classification of a changed repo path into a registry feed event, split
// out of the GitHub webhook route so the path matching can be unit-tested
// without a request, a signature, or the edge cache.

/** A registry feed event derived from one changed path in a push. */
export interface RegistryEvent {
  id: string;
  kind: "entry" | "changelog" | "validator" | "unknown";
  category?: string;
  slug?: string;
  action: "added" | "updated" | "removed";
  commit: string;
  date: string;
  title?: string;
}

/** How a path changed in the push that produced the event. */
export type RegistryEventAction = RegistryEvent["action"];

/**
 * Classify a changed repo path into a {@link RegistryEvent}, or `null` when the
 * path is not part of the registry surface. Rules are applied in order:
 *
 * 1. `content/<category>/<slug>.{md,mdx,json}` → an `entry` carrying the
 *    category and slug. This runs first, so a two-segment changelog path such
 *    as `content/changelog/x.mdx` classifies as an `entry` (category
 *    `changelog`), not as a `changelog`.
 * 2. A `content/changelog…` path that did not match rule 1, or any path ending
 *    in `registry-changelog.json` → `changelog`.
 * 3. Any remaining path containing `validators` → `validator`.
 */
export function classifyRegistryPath(
  path: string,
  action: RegistryEventAction,
  commit: string,
  date: string,
): RegistryEvent | null {
  // content/<category>/<slug>.mdx
  const m = path.match(/^content\/([^/]+)\/([^/]+)\.(?:mdx?|json)$/);
  if (m) {
    return {
      id: `${commit}:${path}`,
      kind: "entry",
      category: m[1],
      slug: m[2],
      action,
      commit,
      date,
    };
  }
  if (/^content\/changelog/.test(path) || /registry-changelog\.json$/.test(path)) {
    return { id: `${commit}:${path}`, kind: "changelog", action, commit, date };
  }
  if (/validators/.test(path)) {
    return { id: `${commit}:${path}`, kind: "validator", action, commit, date };
  }
  return null;
}
