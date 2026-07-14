/**
 * Pure registry relation inference helpers.
 *
 * This module holds the deterministic scoring/indexing layer used to build
 * per-entry related-entry lists and the registry-wide relation graph. Nothing
 * here touches the filesystem or network — given the same entry snapshot the
 * output is byte-stable, which is what keeps the published relation-graph
 * artifact hash deterministic.
 *
 * The public package surface (`relationships.js`) re-exports everything below
 * so existing `@heyclaude/registry` and `artifacts.js` imports stay unchanged.
 */

// "duplicate" is reserved for explicit curated annotations. Automatic relation
// inference must not treat shared project ownership as a strict duplicate.
export const REGISTRY_RELATION_TYPES = [
  "duplicate",
  "same-project",
  "collection-member",
  "complementary",
  "same-ecosystem",
  "prerequisite",
  "works-with",
  "extends",
  "alternative",
  "related",
];

export const DEFAULT_RELATION_LIMIT = 4;

export const GENERIC_SOURCE_DOMAINS = new Set([
  "github.com",
  "gitlab.com",
  "bitbucket.org",
  "npmjs.com",
  "pypi.org",
  "github.io",
  "heyclau.de",
]);

export const STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "from",
  "into",
  "your",
  "claude",
  "agent",
  "agents",
  "server",
  "tool",
  "tools",
  "guide",
  "workflow",
  "mcp",
  "heyclaude",
  "command",
  "commands",
  "resource",
  "resources",
]);

export function entryKey(entry) {
  return `${entry.category}:${entry.slug}`;
}

export function entryUrl(entry) {
  return `/entry/${entry.category}/${entry.slug}`;
}

export function normalizeToken(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

export function unique(values) {
  return values.filter(
    (value, index, list) => value && list.indexOf(value) === index,
  );
}

export function normalizeUrl(value) {
  const text = String(value || "").trim();
  if (!text) return "";

  try {
    const url = new URL(text);
    url.username = "";
    url.password = "";
    url.hash = "";
    for (const key of [...url.searchParams.keys()]) {
      if (
        key.toLowerCase().startsWith("utm_") ||
        ["ref", "ref_src", "source", "fbclid", "gclid"].includes(
          key.toLowerCase(),
        )
      ) {
        url.searchParams.delete(key);
      }
    }
    url.hostname = url.hostname.toLowerCase().replace(/^www\./, "");
    // Strip trailing slashes before the terminal ".git" so a URL like
    // ".../repo.git/" collapses to the same value as ".../repo.git"; otherwise
    // the ".git$" anchor misses and the two forms produce different repo keys.
    url.pathname = url.pathname
      .replace(/\/+$/, "")
      .replace(/\.git$/, "")
      .toLowerCase();
    url.searchParams.sort();
    return url.toString().replace(/\/$/, "");
  } catch {
    return "";
  }
}

export function sourceDomain(value) {
  const normalized = normalizeUrl(value);
  if (!normalized) return "";
  // normalizeUrl only returns parseable absolute URLs (or ""), so this cannot throw.
  return new URL(normalized).hostname.toLowerCase().replace(/^www\./, "");
}

export function sourceUrls(entry) {
  return unique(
    [
      entry.repoUrl,
      entry.documentationUrl,
      entry.websiteUrl,
      entry.downloadUrl && !String(entry.downloadUrl).startsWith("/")
        ? entry.downloadUrl
        : "",
      ...(Array.isArray(entry.retrievalSources) ? entry.retrievalSources : []),
    ]
      .map(normalizeUrl)
      .filter(Boolean),
  );
}

export function sourceDomains(entry) {
  return unique(sourceUrls(entry).map(sourceDomain)).filter(
    (domain) => domain && !GENERIC_SOURCE_DOMAINS.has(domain),
  );
}

export function githubRepoKey(entry) {
  const repoUrl = normalizeUrl(entry.repoUrl);
  // normalizeUrl only returns "" or a URL.toString() value, so this is always
  // a parseable absolute URL when non-empty.
  if (!repoUrl) return "";

  const url = new URL(repoUrl);
  if (url.hostname !== "github.com") return "";
  const [owner, repo] = url.pathname.split("/").filter(Boolean);
  if (!owner || !repo) return "";
  return `${owner}/${repo}`;
}

export function textTokens(entry) {
  const values = [
    ...(Array.isArray(entry.tags) ? entry.tags : []),
    ...(Array.isArray(entry.keywords) ? entry.keywords : []),
    entry.title,
  ];
  const tokens = [];

  for (const value of values) {
    for (const token of String(value || "")
      .toLowerCase()
      .split(/[^a-z0-9+#.-]+/)) {
      const trimmed = token.trim();
      if (trimmed.length < 3 || STOP_WORDS.has(trimmed)) continue;
      tokens.push(trimmed);
    }
  }

  return unique(tokens);
}

export function collectionRefs(entry) {
  if (entry.category !== "collections" || !Array.isArray(entry.items)) {
    return [];
  }

  return entry.items
    .map((item) => {
      if (typeof item === "string") {
        const [category, slug] = item.split("/");
        return category && slug ? `${category}:${slug}` : "";
      }
      return item?.category && item?.slug
        ? `${item.category}:${item.slug}`
        : "";
    })
    .filter(Boolean);
}

export function categoryPairKind(target, candidate) {
  const pair = new Set([target.category, candidate.category]);
  if (target.category === candidate.category) return "same-category";
  if (pair.has("collections")) return "collection-adjacent";
  if (pair.has("guides")) return "guide-adjacent";
  // guides is handled above as guide-adjacent, so only tools remains here.
  if (pair.has("mcp") && pair.has("tools")) {
    return "mcp-tooling";
  }
  if (pair.has("commands") && pair.has("hooks")) return "workflow-control";
  if (pair.has("skills") && (pair.has("rules") || pair.has("agents"))) {
    return "workflow-pack";
  }
  return "";
}

export function relationTypeFor(target, candidate, evidence) {
  if (evidence.collectionMember) return "collection-member";
  if (evidence.sameProject) {
    return "same-project";
  }
  if (
    target.category === candidate.category &&
    (evidence.sharedTokens.length > 0 || evidence.sharedDomains.length > 0)
  ) {
    return "alternative";
  }
  if (evidence.categoryPair === "collection-adjacent") {
    return "prerequisite";
  }
  if (evidence.categoryPair === "guide-adjacent") {
    return "extends";
  }
  if (
    ["mcp-tooling", "workflow-control", "workflow-pack"].includes(
      evidence.categoryPair,
    )
  ) {
    return "complementary";
  }
  if (evidence.sharedDomains.length > 0) {
    return "same-ecosystem";
  }
  return "related";
}

export function scoreCandidate(target, candidate) {
  if (entryKey(target) === entryKey(candidate)) return null;

  const targetRefs = new Set(collectionRefs(target));
  const candidateRefs = new Set(collectionRefs(candidate));
  const targetKey = entryKey(target);
  const candidateKey = entryKey(candidate);
  const collectionMember =
    targetRefs.has(candidateKey) || candidateRefs.has(targetKey);
  const targetRepo = githubRepoKey(target);
  const candidateRepo = githubRepoKey(candidate);
  const sameProject =
    Boolean(targetRepo && candidateRepo) && targetRepo === candidateRepo;
  const sharedUrls = intersection(sourceUrls(target), sourceUrls(candidate));
  const sharedDomains = intersection(
    sourceDomains(target),
    sourceDomains(candidate),
  );
  const sharedTokens = intersection(textTokens(target), textTokens(candidate));
  const categoryPair = categoryPairKind(target, candidate);
  const score =
    (collectionMember ? 100 : 0) +
    (sameProject ? 90 : 0) +
    sharedUrls.length * 70 +
    sharedDomains.length * 16 +
    Math.min(sharedTokens.length, 8) * 4 +
    (target.category === candidate.category ? 10 : 0) +
    (categoryPair ? 6 : 0);

  if (score < 18) return null;

  const evidence = {
    collectionMember,
    sameProject,
    sharedUrls,
    sharedDomains,
    sharedTokens,
    categoryPair,
  };

  return {
    score,
    relation: relationTypeFor(target, candidate, evidence),
    reasons: unique([
      ...(collectionMember ? ["collection_member"] : []),
      ...(sameProject ? [`same_project:${targetRepo}`] : []),
      ...(sharedUrls.length ? ["shared_source_url"] : []),
      ...sharedDomains.slice(0, 2).map((domain) => `source_domain:${domain}`),
      ...sharedTokens.slice(0, 5).map((token) => `topic:${token}`),
      ...(target.category === candidate.category ? ["same_category"] : []),
      ...(categoryPair && categoryPair !== "same-category"
        ? [`category_pair:${categoryPair}`]
        : []),
    ]).slice(0, 6),
  };
}

export function intersection(left = [], right = []) {
  const rightValues = new Set(right.map(normalizeToken).filter(Boolean));
  return unique(left.map(normalizeToken).filter(Boolean)).filter((value) =>
    rightValues.has(value),
  );
}

export function buildEntryRelations(target, entries, params = {}) {
  const limit = params.limit ?? DEFAULT_RELATION_LIMIT;

  return entries
    .map((candidate) => {
      const scored = scoreCandidate(target, candidate);
      if (!scored) return null;
      return {
        key: entryKey(candidate),
        category: candidate.category,
        slug: candidate.slug,
        title: candidate.title,
        relation: scored.relation,
        score: scored.score,
        reasons: scored.reasons,
        url: entryUrl(candidate),
      };
    })
    .filter(Boolean)
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      if (left.relation !== right.relation) {
        return (
          REGISTRY_RELATION_TYPES.indexOf(left.relation) -
          REGISTRY_RELATION_TYPES.indexOf(right.relation)
        );
      }
      return left.title.localeCompare(right.title);
    })
    .slice(0, limit);
}

export function buildRegistryRelationGraph(entries, params = {}) {
  const limit = params.limit ?? DEFAULT_RELATION_LIMIT;

  // Candidate inverted index (#relation-index). scoreCandidate can only cross the score>=18 threshold
  // when two entries share a collection ref, GitHub repo, source URL, source domain, or text token —
  // category overlap alone tops out at 16 (<18). So gathering candidates from those buckets is COMPLETE
  // (no entry that would relate is missed), turning the O(n^2) all-pairs scan into O(n * candidates).
  // Candidates are fed to the unchanged buildEntryRelations in ORIGINAL order, and non-candidates would
  // have scored null anyway, so the output is byte-identical to the all-pairs version.
  const indexOf = new Map();
  const byKey = new Map();
  const repoBucket = new Map();
  const urlBucket = new Map();
  const domainBucket = new Map();
  const tokenBucket = new Map();
  const refsToKey = new Map();
  const pushTo = (map, key, entry) => {
    if (!key) return;
    const list = map.get(key);
    if (list) list.push(entry);
    else map.set(key, [entry]);
  };
  entries.forEach((entry, i) => {
    indexOf.set(entry, i);
    byKey.set(entryKey(entry), entry);
    pushTo(repoBucket, githubRepoKey(entry), entry);
    for (const url of sourceUrls(entry).map(normalizeToken).filter(Boolean))
      pushTo(urlBucket, url, entry);
    for (const domain of sourceDomains(entry)
      .map(normalizeToken)
      .filter(Boolean))
      pushTo(domainBucket, domain, entry);
    for (const token of textTokens(entry).map(normalizeToken).filter(Boolean))
      pushTo(tokenBucket, token, entry);
    for (const ref of collectionRefs(entry)) pushTo(refsToKey, ref, entry);
  });

  const candidatesFor = (entry) => {
    const set = new Set();
    const collect = (list) => {
      if (list) for (const e of list) set.add(e);
    };
    collect(repoBucket.get(githubRepoKey(entry)));
    for (const url of sourceUrls(entry).map(normalizeToken).filter(Boolean))
      collect(urlBucket.get(url));
    for (const domain of sourceDomains(entry)
      .map(normalizeToken)
      .filter(Boolean))
      collect(domainBucket.get(domain));
    for (const token of textTokens(entry).map(normalizeToken).filter(Boolean))
      collect(tokenBucket.get(token));
    for (const ref of collectionRefs(entry)) {
      const referenced = byKey.get(ref);
      if (referenced) set.add(referenced);
    }
    collect(refsToKey.get(entryKey(entry)));
    set.delete(entry);
    return [...set].sort((a, b) => indexOf.get(a) - indexOf.get(b));
  };

  const rows = entries.map((entry) => ({
    key: entryKey(entry),
    category: entry.category,
    slug: entry.slug,
    title: entry.title,
    url: entryUrl(entry),
    related: buildEntryRelations(entry, candidatesFor(entry), { limit }),
  }));

  return {
    schemaVersion: 1,
    kind: "registry-relation-graph",
    generatedAt:
      params.generatedAt ||
      (entries[0]?.dateAdded
        ? `${entries
            .map((entry) =>
              String(entry.contentUpdatedAt || entry.dateAdded || "").slice(
                0,
                10,
              ),
            )
            .filter(Boolean)
            .sort()
            .at(-1)}T00:00:00.000Z`
        : "1970-01-01T00:00:00.000Z"),
    relationTypes: REGISTRY_RELATION_TYPES,
    maxRelationsPerEntry: limit,
    count: rows.length,
    entries: rows,
  };
}

export function relationLookupFromGraph(graph) {
  return new Map(
    (Array.isArray(graph?.entries) ? graph.entries : []).map((row) => [
      row.key,
      row.related || [],
    ]),
  );
}
