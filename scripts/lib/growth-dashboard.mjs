// Combines the registry's detectable SEO + trust gaps into one prioritized,
// source-labeled worklist: what pages to improve next and why. Optionally
// weighted by Search Console impressions so demand, not just gap count, drives
// the order. Deterministic and privacy-safe — it reads the public registry and
// an optional local GSC export the maintainer supplies; it never embeds private
// analytics.

import { snippetIssues, entryPath } from "../audit-seo-snippets.mjs";

const SOURCE = {
  snippet: "snippet-audit",
  trust: "trust-metadata",
};

function hasText(value) {
  if (Array.isArray(value)) return value.some((item) => String(item).trim());
  return String(value ?? "").trim().length > 0;
}

/** Trust/coverage gaps for an entry (missing safety/privacy/source signals). */
export function trustGaps(entry) {
  const gaps = [];
  if (!hasText(entry.safetyNotes) && !hasText(entry.safetyNotesList)) {
    gaps.push({
      field: "safetyNotes",
      code: "missing",
      detail: "no documented safety behavior",
    });
  }
  if (!hasText(entry.privacyNotes) && !hasText(entry.privacyNotesList)) {
    gaps.push({
      field: "privacyNotes",
      code: "missing",
      detail: "no documented privacy behavior",
    });
  }
  if (!entry.documentationUrl && !entry.repoUrl && !entry.githubUrl) {
    gaps.push({
      field: "source",
      code: "missing",
      detail: "no documentation or repository URL",
    });
  }
  return gaps;
}

/**
 * Prioritized improvement worklist.
 * @param entries registry entries
 * @param gscImpressions Map<pathname, impressions> (optional; from a GSC export)
 * @param opts.limit max worklist items (default 50)
 */
export function buildWorklist(entries, gscImpressions, opts = {}) {
  const limit = opts.limit ?? 50;
  const impressions = gscImpressions ?? new Map();
  const weighted = impressions.size > 0;

  const items = [];
  for (const entry of entries) {
    const findings = [
      ...snippetIssues(entry).map((issue) => ({
        source: SOURCE.snippet,
        ...issue,
      })),
      ...trustGaps(entry).map((issue) => ({ source: SOURCE.trust, ...issue })),
    ];
    if (findings.length === 0) continue;
    const path = entryPath(entry);
    const impr = impressions.get(path) ?? 0;
    // Demand-weighted when GSC is available; otherwise rank by gap count.
    const score = weighted ? impr * findings.length : findings.length;
    items.push({
      path,
      category: entry.category,
      slug: entry.slug,
      impressions: impr,
      findingCount: findings.length,
      findings,
      score,
    });
  }

  items.sort((a, b) => b.score - a.score || a.path.localeCompare(b.path));

  return {
    source: weighted ? "registry + search-console" : "registry",
    weightedByImpressions: weighted,
    total: items.length,
    items: items.slice(0, limit),
  };
}
