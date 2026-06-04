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

const DEFAULT_RELATION_LIMIT = 4;
const GENERIC_SOURCE_DOMAINS = new Set([
  "github.com",
  "gitlab.com",
  "bitbucket.org",
  "npmjs.com",
  "pypi.org",
  "github.io",
  "heyclau.de",
]);

const STOP_WORDS = new Set([
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

function entryKey(entry) {
  return `${entry.category}:${entry.slug}`;
}

function entryUrl(entry) {
  return `/entry/${entry.category}/${entry.slug}`;
}

function normalizeToken(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function unique(values) {
  return values.filter(
    (value, index, list) => value && list.indexOf(value) === index,
  );
}

function normalizeUrl(value) {
  const text = String(value || "").trim();
  if (!text) return "";

  try {
    const url = new URL(text);
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
    url.pathname = url.pathname
      .replace(/\.git$/, "")
      .replace(/\/+$/, "")
      .toLowerCase();
    url.searchParams.sort();
    return url.toString().replace(/\/$/, "");
  } catch {
    return "";
  }
}

function sourceDomain(value) {
  const normalized = normalizeUrl(value);
  if (!normalized) return "";
  try {
    return new URL(normalized).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "";
  }
}

function sourceUrls(entry) {
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

function sourceDomains(entry) {
  return unique(sourceUrls(entry).map(sourceDomain)).filter(
    (domain) => domain && !GENERIC_SOURCE_DOMAINS.has(domain),
  );
}

function githubRepoKey(entry) {
  const repoUrl = normalizeUrl(entry.repoUrl);
  if (!repoUrl) return "";

  try {
    const url = new URL(repoUrl);
    if (url.hostname !== "github.com") return "";
    const [owner, repo] = url.pathname.split("/").filter(Boolean);
    if (!owner || !repo) return "";
    return `${owner}/${repo}`;
  } catch {
    return "";
  }
}

function textTokens(entry) {
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

function collectionRefs(entry) {
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

function categoryPairKind(target, candidate) {
  const pair = new Set([target.category, candidate.category]);
  if (target.category === candidate.category) return "same-category";
  if (pair.has("collections")) return "collection-adjacent";
  if (pair.has("guides")) return "guide-adjacent";
  if (pair.has("mcp") && (pair.has("tools") || pair.has("guides"))) {
    return "mcp-tooling";
  }
  if (pair.has("commands") && pair.has("hooks")) return "workflow-control";
  if (pair.has("skills") && (pair.has("rules") || pair.has("agents"))) {
    return "workflow-pack";
  }
  return "";
}

function relationTypeFor(target, candidate, evidence) {
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

function scoreCandidate(target, candidate) {
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

function intersection(left = [], right = []) {
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

  const rows = entries.map((entry) => ({
    key: entryKey(entry),
    category: entry.category,
    slug: entry.slug,
    title: entry.title,
    url: entryUrl(entry),
    related: buildEntryRelations(entry, entries, { limit }),
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
