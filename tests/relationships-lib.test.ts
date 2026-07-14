import { describe, expect, it } from "vitest";

import {
  REGISTRY_RELATION_TYPES,
  DEFAULT_RELATION_LIMIT,
  GENERIC_SOURCE_DOMAINS,
  STOP_WORDS,
  entryKey,
  entryUrl,
  normalizeToken,
  unique,
  normalizeUrl,
  sourceDomain,
  sourceUrls,
  sourceDomains,
  githubRepoKey,
  textTokens,
  collectionRefs,
  categoryPairKind,
  relationTypeFor,
  scoreCandidate,
  intersection,
  buildEntryRelations,
  buildRegistryRelationGraph,
  relationLookupFromGraph,
} from "../packages/registry/src/relationships-lib.js";

function entry(
  overrides: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    category: "skills",
    slug: "alpha",
    title: "Alpha Skill",
    tags: [],
    keywords: [],
    ...overrides,
  };
}

describe("constants", () => {
  it("exposes the reserved relation type list with duplicate first", () => {
    expect(REGISTRY_RELATION_TYPES[0]).toBe("duplicate");
    expect(REGISTRY_RELATION_TYPES).toContain("same-project");
    expect(REGISTRY_RELATION_TYPES).toContain("related");
  });

  it("exposes the default relation limit and domain/stop-word sets", () => {
    expect(DEFAULT_RELATION_LIMIT).toBe(4);
    expect(GENERIC_SOURCE_DOMAINS.has("github.com")).toBe(true);
    expect(GENERIC_SOURCE_DOMAINS.has("heyclau.de")).toBe(true);
    expect(STOP_WORDS.has("claude")).toBe(true);
    expect(STOP_WORDS.has("mcp")).toBe(true);
  });
});

describe("entryKey / entryUrl", () => {
  it("builds the category:slug key and entry path", () => {
    const e = entry({ category: "mcp", slug: "foo" });
    expect(entryKey(e)).toBe("mcp:foo");
    expect(entryUrl(e)).toBe("/entry/mcp/foo");
  });
});

describe("normalizeToken", () => {
  it("trims and lowercases tokens", () => {
    expect(normalizeToken("  Hello ")).toBe("hello");
  });

  it("coerces nullish values to an empty string", () => {
    expect(normalizeToken(undefined)).toBe("");
    expect(normalizeToken(null)).toBe("");
    expect(normalizeToken("")).toBe("");
  });
});

describe("unique", () => {
  it("drops falsy values and keeps first occurrence of each truthy value", () => {
    expect(unique(["a", "", "a", "b", null, "b", "c"])).toEqual([
      "a",
      "b",
      "c",
    ]);
  });
});

describe("normalizeUrl", () => {
  it("returns empty for blank or invalid input", () => {
    expect(normalizeUrl("")).toBe("");
    expect(normalizeUrl("   ")).toBe("");
    expect(normalizeUrl("not a url")).toBe("");
    expect(normalizeUrl(undefined)).toBe("");
  });

  it("strips hash, tracking params, www, trailing slash, and a terminal .git suffix", () => {
    expect(
      normalizeUrl(
        "https://WWW.Example.com/Repo/?utm_source=x&utm_medium=y&ref=1&ref_src=2&source=3&fbclid=4&gclid=5&keep=1#frag",
      ),
    ).toBe("https://example.com/repo?keep=1");
    expect(normalizeUrl("https://github.com/Acme/Widget.git")).toBe(
      "https://github.com/acme/widget",
    );
    expect(normalizeUrl("https://token@github.com/acme/widget")).toBe(
      "https://github.com/acme/widget",
    );
  });

  it("strips a terminal .git suffix even when a trailing slash follows it", () => {
    expect(normalizeUrl("https://github.com/Acme/Widget.git/")).toBe(
      "https://github.com/acme/widget",
    );
    expect(normalizeUrl("https://github.com/Acme/Widget.git//")).toBe(
      "https://github.com/acme/widget",
    );
  });

  it("sorts remaining query params for stability", () => {
    expect(normalizeUrl("https://example.com/path?b=2&a=1")).toBe(
      "https://example.com/path?a=1&b=2",
    );
  });

  it("keeps non-tracking params and is case-insensitive on tracking keys", () => {
    expect(normalizeUrl("https://example.com/?UTM_Campaign=x&id=9")).toBe(
      "https://example.com/?id=9",
    );
  });
});

describe("sourceDomain", () => {
  it("returns empty for blank or invalid urls", () => {
    expect(sourceDomain("")).toBe("");
    expect(sourceDomain("nope")).toBe("");
  });

  it("returns the lowercased hostname without www", () => {
    expect(sourceDomain("https://WWW.Docs.Example.com/path")).toBe(
      "docs.example.com",
    );
  });
});

describe("sourceUrls", () => {
  it("collects and normalizes repo, docs, website, and absolute download urls", () => {
    const urls = sourceUrls(
      entry({
        repoUrl: "https://github.com/a/b.git",
        documentationUrl: "https://docs.example.com/",
        websiteUrl: "https://www.example.com",
        downloadUrl: "https://cdn.example.com/pkg.zip",
      }),
    );
    expect(urls).toEqual([
      "https://github.com/a/b",
      "https://docs.example.com",
      "https://example.com",
      "https://cdn.example.com/pkg.zip",
    ]);
  });

  it("skips relative download urls and non-array retrievalSources", () => {
    expect(
      sourceUrls(
        entry({
          downloadUrl: "/local/package.zip",
          retrievalSources: "not-an-array",
        }),
      ),
    ).toEqual([]);
  });

  it("includes retrievalSources when present", () => {
    expect(
      sourceUrls(
        entry({
          retrievalSources: [
            "https://docs.example.com/a",
            "https://docs.example.com/a",
            "",
          ],
        }),
      ),
    ).toEqual(["https://docs.example.com/a"]);
  });
});

describe("sourceDomains", () => {
  it("drops generic hosting domains and keeps project domains", () => {
    const domains = sourceDomains(
      entry({
        repoUrl: "https://github.com/a/b",
        documentationUrl: "https://docs.myproject.dev/guide",
        websiteUrl: "https://myproject.dev",
      }),
    );
    expect(domains).toEqual(["docs.myproject.dev", "myproject.dev"]);
  });
});

describe("githubRepoKey", () => {
  it("returns empty when there is no repo url", () => {
    expect(githubRepoKey(entry())).toBe("");
  });

  it("returns empty for non-github hosts", () => {
    expect(githubRepoKey(entry({ repoUrl: "https://gitlab.com/a/b" }))).toBe(
      "",
    );
  });

  it("returns empty when owner or repo is missing", () => {
    expect(githubRepoKey(entry({ repoUrl: "https://github.com/" }))).toBe("");
    expect(githubRepoKey(entry({ repoUrl: "https://github.com/only" }))).toBe(
      "",
    );
  });

  it("returns owner/repo for a github repository", () => {
    expect(
      githubRepoKey(entry({ repoUrl: "https://github.com/Acme/Widget.git" })),
    ).toBe("acme/widget");
  });

  it("keys a .git url with a trailing slash the same as without", () => {
    expect(
      githubRepoKey(entry({ repoUrl: "https://github.com/Acme/Widget.git/" })),
    ).toBe("acme/widget");
  });
});

describe("textTokens", () => {
  it("tokenizes tags, keywords, and title while dropping stop words and short tokens", () => {
    const tokens = textTokens(
      entry({
        title: "The Claude MCP Server Toolkit",
        tags: ["workflow", "observability"],
        keywords: ["tracing", "ab"],
      }),
    );
    expect(tokens).toContain("observability");
    expect(tokens).toContain("tracing");
    expect(tokens).toContain("toolkit");
    expect(tokens).not.toContain("the");
    expect(tokens).not.toContain("claude");
    expect(tokens).not.toContain("mcp");
    expect(tokens).not.toContain("server");
    expect(tokens).not.toContain("ab");
    expect(tokens).not.toContain("workflow");
  });

  it("tolerates missing tags/keywords arrays and nullish title pieces", () => {
    expect(
      textTokens({
        category: "skills",
        slug: "x",
        title: null,
        tags: null,
        keywords: undefined,
      }),
    ).toEqual([]);
  });
});

describe("collectionRefs", () => {
  it("returns empty for non-collection entries or missing items", () => {
    expect(
      collectionRefs(entry({ category: "skills", items: ["a/b"] })),
    ).toEqual([]);
    expect(collectionRefs(entry({ category: "collections" }))).toEqual([]);
    expect(
      collectionRefs(entry({ category: "collections", items: "nope" })),
    ).toEqual([]);
  });

  it("parses string and object items and drops incomplete ones", () => {
    expect(
      collectionRefs(
        entry({
          category: "collections",
          items: [
            "skills/alpha",
            "incomplete",
            { category: "mcp", slug: "beta" },
            { category: "mcp" },
            { slug: "gamma" },
            null,
          ],
        }),
      ),
    ).toEqual(["skills:alpha", "mcp:beta"]);
  });
});

describe("categoryPairKind", () => {
  it("classifies same-category and adjacency pairs", () => {
    expect(
      categoryPairKind(
        entry({ category: "skills" }),
        entry({ category: "skills" }),
      ),
    ).toBe("same-category");
    expect(
      categoryPairKind(
        entry({ category: "collections" }),
        entry({ category: "skills" }),
      ),
    ).toBe("collection-adjacent");
    expect(
      categoryPairKind(
        entry({ category: "guides" }),
        entry({ category: "mcp" }),
      ),
    ).toBe("guide-adjacent");
  });

  it("classifies tooling and workflow pairs", () => {
    expect(
      categoryPairKind(
        entry({ category: "mcp" }),
        entry({ category: "tools" }),
      ),
    ).toBe("mcp-tooling");
    expect(
      categoryPairKind(
        entry({ category: "commands" }),
        entry({ category: "hooks" }),
      ),
    ).toBe("workflow-control");
    expect(
      categoryPairKind(
        entry({ category: "skills" }),
        entry({ category: "rules" }),
      ),
    ).toBe("workflow-pack");
    expect(
      categoryPairKind(
        entry({ category: "skills" }),
        entry({ category: "agents" }),
      ),
    ).toBe("workflow-pack");
  });

  it("returns empty for unrelated category pairs", () => {
    expect(
      categoryPairKind(
        entry({ category: "statuslines" }),
        entry({ category: "tools" }),
      ),
    ).toBe("");
  });
});

describe("relationTypeFor", () => {
  const baseEvidence = {
    collectionMember: false,
    sameProject: false,
    sharedUrls: [] as string[],
    sharedDomains: [] as string[],
    sharedTokens: [] as string[],
    categoryPair: "",
  };

  it("prefers collection-member and same-project", () => {
    expect(
      relationTypeFor(entry(), entry({ slug: "b" }), {
        ...baseEvidence,
        collectionMember: true,
      }),
    ).toBe("collection-member");
    expect(
      relationTypeFor(entry(), entry({ slug: "b" }), {
        ...baseEvidence,
        sameProject: true,
      }),
    ).toBe("same-project");
  });

  it("returns alternative for same-category shared tokens or domains", () => {
    expect(
      relationTypeFor(entry(), entry({ slug: "b" }), {
        ...baseEvidence,
        sharedTokens: ["tracing"],
      }),
    ).toBe("alternative");
    expect(
      relationTypeFor(entry(), entry({ slug: "b" }), {
        ...baseEvidence,
        sharedDomains: ["docs.example.com"],
      }),
    ).toBe("alternative");
  });

  it("maps category pairs to prerequisite, extends, and complementary", () => {
    expect(
      relationTypeFor(
        entry({ category: "collections" }),
        entry({ category: "skills", slug: "b" }),
        { ...baseEvidence, categoryPair: "collection-adjacent" },
      ),
    ).toBe("prerequisite");
    expect(
      relationTypeFor(
        entry({ category: "guides" }),
        entry({ category: "skills", slug: "b" }),
        { ...baseEvidence, categoryPair: "guide-adjacent" },
      ),
    ).toBe("extends");
    expect(
      relationTypeFor(
        entry({ category: "mcp" }),
        entry({ category: "tools", slug: "b" }),
        { ...baseEvidence, categoryPair: "mcp-tooling" },
      ),
    ).toBe("complementary");
    expect(
      relationTypeFor(
        entry({ category: "commands" }),
        entry({ category: "hooks", slug: "b" }),
        { ...baseEvidence, categoryPair: "workflow-control" },
      ),
    ).toBe("complementary");
    expect(
      relationTypeFor(
        entry({ category: "skills" }),
        entry({ category: "agents", slug: "b" }),
        { ...baseEvidence, categoryPair: "workflow-pack" },
      ),
    ).toBe("complementary");
  });

  it("falls back to same-ecosystem then related", () => {
    expect(
      relationTypeFor(
        entry({ category: "skills" }),
        entry({ category: "tools", slug: "b" }),
        { ...baseEvidence, sharedDomains: ["docs.example.com"] },
      ),
    ).toBe("same-ecosystem");
    expect(
      relationTypeFor(
        entry({ category: "skills" }),
        entry({ category: "tools", slug: "b" }),
        baseEvidence,
      ),
    ).toBe("related");
  });
});

describe("intersection", () => {
  it("defaults empty arrays and normalizes tokens", () => {
    expect(intersection()).toEqual([]);
    expect(intersection(["A", "b", ""], ["b", "a", "c"])).toEqual(["a", "b"]);
  });
});

describe("scoreCandidate", () => {
  it("returns null for the same entry", () => {
    const e = entry();
    expect(scoreCandidate(e, e)).toBeNull();
  });

  it("returns null when the score is below the threshold", () => {
    expect(
      scoreCandidate(
        entry({ title: "Alpha", tags: ["unique-alpha"] }),
        entry({
          slug: "beta",
          title: "Beta",
          tags: ["unique-beta"],
          category: "tools",
        }),
      ),
    ).toBeNull();
  });

  it("scores collection membership highest", () => {
    const collection = entry({
      category: "collections",
      slug: "pack",
      title: "Pack",
      items: ["skills/alpha"],
    });
    const member = entry({ category: "skills", slug: "alpha", title: "Alpha" });
    const scored = scoreCandidate(collection, member);
    expect(scored?.relation).toBe("collection-member");
    expect(scored?.score).toBeGreaterThanOrEqual(100);
    expect(scored?.reasons).toContain("collection_member");
  });

  it("scores same-project github repos", () => {
    const left = entry({
      slug: "left",
      title: "Left",
      repoUrl: "https://github.com/acme/widget",
    });
    const right = entry({
      slug: "right",
      title: "Right",
      repoUrl: "https://github.com/acme/widget.git",
    });
    const scored = scoreCandidate(left, right);
    expect(scored?.relation).toBe("same-project");
    expect(
      scored?.reasons.some((r: string) => r.startsWith("same_project:")),
    ).toBe(true);
  });

  it("scores shared source urls and domains", () => {
    const left = entry({
      slug: "left",
      title: "Left",
      documentationUrl: "https://docs.myproject.dev/a",
      websiteUrl: "https://myproject.dev",
    });
    const right = entry({
      slug: "right",
      title: "Right",
      category: "tools",
      documentationUrl: "https://docs.myproject.dev/a",
      websiteUrl: "https://myproject.dev",
    });
    const scored = scoreCandidate(left, right);
    expect(scored?.reasons).toContain("shared_source_url");
    expect(
      scored?.reasons.some((r: string) => r.startsWith("source_domain:")),
    ).toBe(true);
  });

  it("scores shared topic tokens and same-category alternatives", () => {
    const left = entry({
      slug: "left",
      title: "Tracing Helper",
      tags: ["observability", "tracing", "otel", "spans", "metrics", "logs"],
    });
    const right = entry({
      slug: "right",
      title: "Tracing Toolkit",
      tags: ["observability", "tracing", "otel", "spans", "metrics", "logs"],
    });
    const scored = scoreCandidate(left, right);
    expect(scored?.relation).toBe("alternative");
    expect(scored?.reasons).toContain("same_category");
    expect(scored?.reasons.some((r: string) => r.startsWith("topic:"))).toBe(
      true,
    );
  });

  it("includes category_pair reasons for non-same-category pairs", () => {
    const left = entry({
      category: "mcp",
      slug: "left",
      title: "MCP Left",
      tags: ["sharedtopic"],
      documentationUrl: "https://docs.myproject.dev",
    });
    const right = entry({
      category: "tools",
      slug: "right",
      title: "Tool Right",
      tags: ["sharedtopic"],
      documentationUrl: "https://docs.myproject.dev",
    });
    const scored = scoreCandidate(left, right);
    expect(scored?.reasons).toContain("category_pair:mcp-tooling");
    expect(scored?.relation).toBe("complementary");
  });
});

describe("buildEntryRelations", () => {
  const target = entry({
    slug: "target",
    title: "Target",
    tags: ["observability", "tracing"],
    documentationUrl: "https://docs.myproject.dev",
  });

  const high = entry({
    slug: "high",
    title: "High",
    tags: ["observability", "tracing"],
    documentationUrl: "https://docs.myproject.dev",
  });

  const mid = entry({
    slug: "mid",
    title: "Mid",
    tags: ["observability", "tracing"],
    websiteUrl: "https://myproject.dev",
  });

  const low = entry({
    slug: "low",
    title: "Low",
    category: "tools",
    tags: ["observability"],
    websiteUrl: "https://myproject.dev",
  });

  it("defaults to DEFAULT_RELATION_LIMIT and excludes the target itself", () => {
    const related = buildEntryRelations(target, [target, high, mid, low]);
    expect(related.length).toBeLessThanOrEqual(DEFAULT_RELATION_LIMIT);
    expect(related.every((r) => r.key !== "skills:target")).toBe(true);
  });

  it("honors an explicit limit and sorts by score then relation then title", () => {
    const related = buildEntryRelations(target, [low, mid, high], { limit: 2 });
    expect(related).toHaveLength(2);
    expect(related[0].score).toBeGreaterThanOrEqual(related[1].score);
    expect(related[0].url).toMatch(/^\/entry\//);
    expect(related[0].reasons.length).toBeGreaterThan(0);
  });

  it("breaks score ties by relation type order then title", () => {
    const a = entry({
      slug: "aaa",
      title: "Aaa",
      repoUrl: "https://github.com/acme/shared",
    });
    const b = entry({
      slug: "bbb",
      title: "Bbb",
      repoUrl: "https://github.com/acme/shared",
    });
    const c = entry({
      slug: "ccc",
      title: "Ccc",
      repoUrl: "https://github.com/acme/shared",
    });
    const related = buildEntryRelations(a, [c, b], { limit: 5 });
    expect(related.map((r) => r.title)).toEqual(["Bbb", "Ccc"]);
  });

  it("breaks equal scores by REGISTRY_RELATION_TYPES order", () => {
    // Both candidates score exactly 32:
    // - alternative: 4 shared tokens * 4 + same-category 10 + pair 6
    // - same-ecosystem: 2 shared domains * 16, using different paths so the
    //   URLs themselves do not also match (which would add 70 each)
    const target = entry({
      slug: "target",
      title: "Target",
      tags: ["t001", "t002", "t003", "t004"],
      websiteUrl: "https://a.example.dev/target",
      documentationUrl: "https://b.example.dev/target",
    });
    const alternative = entry({
      slug: "alt",
      title: "Zed Alternative",
      tags: ["t001", "t002", "t003", "t004"],
    });
    const ecosystem = entry({
      slug: "eco",
      title: "Aaa Ecosystem",
      category: "statuslines",
      websiteUrl: "https://a.example.dev/other",
      documentationUrl: "https://b.example.dev/other",
    });

    const scoredAlt = scoreCandidate(target, alternative);
    const scoredEco = scoreCandidate(target, ecosystem);
    expect(scoredAlt?.score).toBe(32);
    expect(scoredEco?.score).toBe(32);
    expect(scoredAlt?.relation).toBe("alternative");
    expect(scoredEco?.relation).toBe("same-ecosystem");

    const related = buildEntryRelations(target, [alternative, ecosystem], {
      limit: 5,
    });
    expect(related.map((r) => r.relation)).toEqual([
      "same-ecosystem",
      "alternative",
    ]);
  });
});

describe("buildRegistryRelationGraph", () => {
  it("uses an explicit generatedAt when provided", () => {
    const graph = buildRegistryRelationGraph([entry()], {
      generatedAt: "2026-01-02T00:00:00.000Z",
      limit: 1,
    });
    expect(graph.generatedAt).toBe("2026-01-02T00:00:00.000Z");
    expect(graph.maxRelationsPerEntry).toBe(1);
    expect(graph.kind).toBe("registry-relation-graph");
    expect(graph.schemaVersion).toBe(1);
    expect(graph.count).toBe(1);
  });

  it("falls back to the epoch when entries have no dates", () => {
    const graph = buildRegistryRelationGraph([entry()]);
    expect(graph.generatedAt).toBe("1970-01-01T00:00:00.000Z");
  });

  it("derives generatedAt from the latest contentUpdatedAt or dateAdded", () => {
    const graph = buildRegistryRelationGraph([
      entry({
        slug: "old",
        dateAdded: "2024-01-01",
        contentUpdatedAt: "2024-02-01",
      }),
      entry({
        slug: "new",
        dateAdded: "2025-06-01",
      }),
      entry({
        slug: "blank",
        dateAdded: "",
        contentUpdatedAt: "",
      }),
    ]);
    expect(graph.generatedAt).toBe("2025-06-01T00:00:00.000Z");
  });

  it("indexes candidates via shared repo, url, domain, token, and collection refs", () => {
    const member = entry({
      category: "skills",
      slug: "member",
      title: "Member Skill",
      tags: ["sharedtopic"],
    });
    const collection = entry({
      category: "collections",
      slug: "pack",
      title: "Pack",
      // Include a dangling ref so candidatesFor skips missing byKey lookups.
      items: ["skills/member", "skills/missing-entry"],
      dateAdded: "2026-01-01",
    });
    const sibling = entry({
      category: "skills",
      slug: "sibling",
      title: "Sibling",
      repoUrl: "https://github.com/acme/widget",
      tags: ["sharedtopic"],
      dateAdded: "2026-01-02",
    });
    const twin = entry({
      category: "tools",
      slug: "twin",
      title: "Twin",
      repoUrl: "https://github.com/acme/widget",
      documentationUrl: "https://docs.myproject.dev",
      dateAdded: "2026-01-03",
    });
    const domainMate = entry({
      category: "guides",
      slug: "guide",
      title: "Guide",
      websiteUrl: "https://myproject.dev",
      documentationUrl: "https://docs.myproject.dev",
      dateAdded: "2026-01-04",
    });

    const graph = buildRegistryRelationGraph(
      [member, collection, sibling, twin, domainMate],
      { limit: 4 },
    );

    expect(graph.entries).toHaveLength(5);
    const pack = graph.entries.find((row) => row.key === "collections:pack");
    expect(pack?.related.some((r) => r.key === "skills:member")).toBe(true);

    const siblingRow = graph.entries.find(
      (row) => row.key === "skills:sibling",
    );
    expect(siblingRow?.related.some((r) => r.key === "tools:twin")).toBe(true);

    const twinRow = graph.entries.find((row) => row.key === "tools:twin");
    expect(twinRow?.related.some((r) => r.key === "guides:guide")).toBe(true);
  });

  it("returns an empty entries list for an empty registry", () => {
    const graph = buildRegistryRelationGraph([]);
    expect(graph.count).toBe(0);
    expect(graph.entries).toEqual([]);
    expect(graph.generatedAt).toBe("1970-01-01T00:00:00.000Z");
  });
});

describe("relationLookupFromGraph", () => {
  it("builds a map keyed by entry key", () => {
    const graph = buildRegistryRelationGraph([
      entry({
        slug: "left",
        title: "Left",
        repoUrl: "https://github.com/acme/widget",
      }),
      entry({
        slug: "right",
        title: "Right",
        repoUrl: "https://github.com/acme/widget",
      }),
    ]);
    const lookup = relationLookupFromGraph(graph);
    expect(lookup.get("skills:left")?.length).toBeGreaterThan(0);
    expect(lookup.get("skills:right")?.length).toBeGreaterThan(0);
  });

  it("tolerates missing graphs, non-array entries, and missing related arrays", () => {
    expect(relationLookupFromGraph(null).size).toBe(0);
    expect(relationLookupFromGraph({}).size).toBe(0);
    expect(relationLookupFromGraph({ entries: "nope" }).size).toBe(0);

    const lookup = relationLookupFromGraph({
      entries: [{ key: "skills:x" }],
    });
    expect(lookup.get("skills:x")).toEqual([]);
  });
});

describe("public wrapper re-exports", () => {
  it("keeps the relationships.js surface identical to the lib", async () => {
    const wrapper = await import("../packages/registry/src/relationships.js");
    expect(wrapper.buildEntryRelations).toBe(buildEntryRelations);
    expect(wrapper.buildRegistryRelationGraph).toBe(buildRegistryRelationGraph);
    expect(wrapper.relationLookupFromGraph).toBe(relationLookupFromGraph);
    expect(wrapper.REGISTRY_RELATION_TYPES).toEqual(REGISTRY_RELATION_TYPES);
  });
});
