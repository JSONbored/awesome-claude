// Maps a changed registry entry to the generated hub pages whose content
// materially changes with it, so the on-publish IndexNow workflow can expedite
// recrawls of those hubs (not just the entry). Bounded to one entry's hubs —
// deterministic, dependency-free, and validated (HTTP 200) before submission by
// the workflow. Surfaces that need cross-entry/registry data (best lists,
// comparisons, platform hubs) are left to the daily full-sitemap cron.

// State reports scoped to a single category, pinged when an entry in that
// category changes. Keep in sync with REPORT_PATHS in
// apps/web/src/lib/data-reports.ts (covered by a drift test).
export const CATEGORY_REPORTS = {
  mcp: ["/state-of-mcp-servers", "/mcp-security-report"],
  hooks: ["/state-of-claude-code-hooks"],
  skills: ["/state-of-agent-skills"],
  agents: ["/state-of-ai-agents"],
};

// Reports that aggregate every category, so any entry change affects them.
export const GLOBAL_REPORTS = ["/state-of-claude-tooling"];

/** Slugify a tag the same way the site's tag routes do (apps/web/src/lib/tags.ts). */
export function tagSlug(tag) {
  return String(tag)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Site-relative hub paths whose content changes when `entry` (a changed entry
 * with `category`, `slug`, and optional `tags`) is added or edited: its
 * category page, its tag pages, and the state report(s) covering that category.
 * Deterministic and de-duplicated; never includes the entry's own URL.
 */
export function entryHubPaths(entry) {
  const paths = new Set();
  const category = String(entry?.category ?? "").trim();
  if (category) {
    paths.add(`/${category}`);
    const categoryReports = Object.hasOwn(CATEGORY_REPORTS, category)
      ? CATEGORY_REPORTS[category]
      : [];
    for (const report of categoryReports) paths.add(report);
    for (const report of GLOBAL_REPORTS) paths.add(report);
  }
  for (const tag of entry?.tags ?? []) {
    const slug = tagSlug(tag);
    if (slug) paths.add(`/tags/${slug}`);
  }
  return [...paths];
}

/** Absolute hub URLs for an entry, given a normalized base URL (no trailing slash). */
export function entryHubUrls(entry, baseUrl) {
  const base = String(baseUrl).replace(/\/+$/, "");
  return entryHubPaths(entry).map((path) => `${base}${path}`);
}
