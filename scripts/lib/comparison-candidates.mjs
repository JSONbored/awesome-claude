// Discovers demand-backed comparison-page candidates from the registry: pairs
// of same-category entries with strong tag overlap (and, where present, a typed
// "alternative" relation) that are not already covered by a hand-maintained
// comparison page. Deterministic — surfaces a ranked backlog for maintainers to
// curate; it never auto-publishes pages (comparisons stay hand-written to avoid
// thin content).

/** Stable "category/slug" ref. */
export function entryRef(entry) {
  return `${entry.category}/${entry.slug}`;
}

/** Unordered pair key so {a,b} and {b,a} collapse. */
export function pairKey(refA, refB) {
  return [refA, refB].sort().join("|");
}

function tagSet(entry) {
  return new Set((entry.tags ?? []).map((tag) => String(tag).toLowerCase()));
}

function altRefs(entry) {
  return new Set(
    (entry.relatedEntries ?? [])
      .filter((rel) => rel.relation === "alternative")
      .map((rel) => `${rel.category}/${rel.slug}`),
  );
}

/**
 * Ranked comparison candidates.
 * @param entries registry entries (need category, slug, tags, relatedEntries)
 * @param coveredPairs Set of pairKey() already covered by a comparison page
 * @param opts.minOverlap minimum shared tags (default 3)
 * @param opts.limit max candidates returned (default 25)
 */
export function findComparisonCandidates(entries, coveredPairs, opts = {}) {
  const minOverlap = opts.minOverlap ?? 3;
  const limit = opts.limit ?? 25;
  const covered = coveredPairs ?? new Set();

  const byCategory = new Map();
  for (const entry of entries) {
    const list = byCategory.get(entry.category) ?? [];
    if (!byCategory.has(entry.category)) byCategory.set(entry.category, list);
    list.push(entry);
  }

  const candidates = [];
  for (const [category, group] of byCategory) {
    for (let i = 0; i < group.length; i += 1) {
      const a = group[i];
      const aTags = tagSet(a);
      if (aTags.size === 0) continue;
      const aAlts = altRefs(a);
      const refA = entryRef(a);
      for (let j = i + 1; j < group.length; j += 1) {
        const b = group[j];
        const refB = entryRef(b);
        if (covered.has(pairKey(refA, refB))) continue;
        const shared = [...tagSet(b)].filter((tag) => aTags.has(tag));
        const isAlternative = aAlts.has(refB) || altRefs(b).has(refA);
        if (shared.length < minOverlap && !isAlternative) continue;
        // Score: tag overlap, boosted when an explicit alternative relation exists.
        const score = shared.length + (isAlternative ? 3 : 0);
        candidates.push({
          category,
          pair: [refA, refB],
          sharedTags: shared.sort(),
          isAlternative,
          score,
        });
      }
    }
  }

  return candidates
    .sort(
      (x, y) =>
        y.score - x.score || x.pair.join("|").localeCompare(y.pair.join("|")),
    )
    .slice(0, limit);
}
