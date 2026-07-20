import crypto from "node:crypto";
import { describe, expect, it } from "vitest";

import {
  ENTRY_SCHEMA_VERSION,
  RAYCAST_SCHEMA_VERSION,
  REGISTRY_ARTIFACT_SCHEMA_VERSION,
  SITE_URL,
  RAYCAST_COPY_PREVIEW_LIMIT,
  truncateText,
  dataUrl,
  generatedAtForEntries,
  buildArtifactHash,
  platformFeedSlug,
  buildSkillPlatformCompatibility,
  buildEntryTrustSignals,
  buildDirectoryEntries,
  buildSearchEntries,
  buildRaycastDetailMarkdown,
  buildRaycastDetail,
  buildRaycastEntries,
  buildRaycastEnvelope,
  buildEntryDetail,
  buildCursorSkillAdapter,
  buildArtifactEnvelope,
  buildEnvelopeEntries,
  buildReadOnlyEcosystemFeed,
  buildMcpRegistryFeed,
  buildPluginExportFeed,
  buildRegistryChangelogFeed,
  buildCategoryDistributionFeed,
  buildPlatformDistributionFeed,
  buildDistributionFeedIndex,
  buildRegistryManifest,
  buildArtifactManifestV2,
  buildRegistryTrustReport,
  buildContentQualityArtifact,
  buildContentPromptArtifact,
  buildJsonLdSnapshots,
  buildEntryLlmsArtifact,
  buildCorpusLlmsArtifact,
  buildRegistryArtifactSet,
} from "../packages/registry/src/artifacts-lib.js";
import {
  PLATFORM_IDS,
  PLATFORM_LABELS,
} from "../packages/registry/src/platforms-lib.js";
import categorySpec from "../packages/registry/src/category-spec.json" with { type: "json" };

type SyntheticEntry = Record<string, unknown>;

function syntheticEntry(
  category: string,
  slug: string,
  overrides: SyntheticEntry = {},
): SyntheticEntry {
  return {
    category,
    slug,
    title: `${category} ${slug}`,
    description: `Synthetic ${category} entry for artifacts-lib coverage.`,
    cardDescription: `Card copy for ${slug}.`,
    author: "artifacts-lib-fixture",
    tags: [category, "synthetic"],
    keywords: ["test", category],
    dateAdded: "2026-01-15",
    contentUpdatedAt: "2026-02-01",
    verifiedAt: "2026-02-10",
    repoUrl: "https://github.com/example/synthetic",
    documentationUrl: "https://example.com/docs",
    installCommand: "npx -y synthetic-tool",
    configSnippet: '{"mcpServers":{"synthetic":{"command":"npx"}}}',
    usageSnippet: "Use the synthetic entry in tests.",
    safetyNotes: ["Runs local commands."],
    privacyNotes: ["Reads project context."],
    claimStatus: "verified",
    reviewedBy: "fixture-reviewer",
    downloadUrl: "/downloads/synthetic.zip",
    downloadTrust: "first-party",
    downloadSha256: "abc123deadbeef",
    packageVerified: true,
    disclosure: "editorial",
    ...overrides,
  };
}

const FIXTURE_AGENTS = syntheticEntry("agents", "workflow-agent", {
  body: "## Workflow\n\nFollow the agent instructions.",
});
const FIXTURE_MCP = syntheticEntry("mcp", "demo-server", {
  installCommand: "npx -y demo-mcp",
  configSnippet:
    '{"mcpServers":{"demo":{"command":"npx","args":["-y","demo-mcp"]}}}',
});
const FIXTURE_SKILLS = syntheticEntry("skills", "lint-helper", {
  skillPackage: { format: "agent-skill", sha256: "skill-sha256" },
});
const FIXTURE_TOOLS = syntheticEntry("tools", "cloud-tool", {
  pricingModel: "paid",
  websiteUrl: "https://tool.example",
});
const FIXTURE_RULES = syntheticEntry("rules", "typescript-rules", {
  copySnippet: "Prefer strict TypeScript settings.",
});
const FIXTURE_COMMANDS = syntheticEntry("commands", "review-pr", {
  commandSyntax: "/review-pr",
  copySnippet: "/review-pr --full",
});
const FIXTURE_HOOKS = syntheticEntry("hooks", "pre-tool-guard", {
  trigger: "PreToolUse",
  scriptBody: "#!/usr/bin/env bash\necho guard",
});
const FIXTURE_GUIDES = syntheticEntry("guides", "getting-started", {
  body: "## Guide\n\nStart here.",
});
const FIXTURE_COLLECTIONS = syntheticEntry("collections", "starter-pack", {
  items: [
    { category: "mcp", slug: "demo-server" },
    { category: "skills", slug: "lint-helper" },
  ],
});
const FIXTURE_STATUSLINES = syntheticEntry("statuslines", "repo-status", {
  copySnippet: "statusline --json",
});

const ALL_FIXTURES = [
  FIXTURE_AGENTS,
  FIXTURE_MCP,
  FIXTURE_SKILLS,
  FIXTURE_TOOLS,
  FIXTURE_RULES,
  FIXTURE_COMMANDS,
  FIXTURE_HOOKS,
  FIXTURE_GUIDES,
  FIXTURE_COLLECTIONS,
  FIXTURE_STATUSLINES,
];

const SPARSE_ENTRY = syntheticEntry("mcp", "sparse", {
  repoUrl: "",
  documentationUrl: "",
  downloadUrl: "",
  installCommand: "",
  configSnippet: "",
  downloadTrust: null,
  downloadSha256: "",
  packageVerified: false,
  safetyNotes: [],
  privacyNotes: [],
  claimStatus: "unclaimed",
  reviewedBy: "",
  brandName: "",
  brandDomain: "",
  dateAdded: "2020-01-01",
  contentUpdatedAt: "",
  verifiedAt: "",
});

const BRANDED_ENTRY = syntheticEntry("tools", "branded-tool", {
  brandName: "Acme Tools",
  brandDomain: "acme.tools",
  brandIconUrl: "https://cdn.acme.tools/icon.png",
  brandLogoUrl: "https://cdn.acme.tools/logo.png",
  brandAssetSource: "brandfetch",
  brandVerifiedAt: "2026-01-01",
  brandColors: ["#112233", "#445566"],
});

const EDITORIAL_ENTRY = syntheticEntry("skills", "editorial-pick", {
  disclosure: "heyclaude_pick",
  slug: "editorial-pick",
});

function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

describe("exported constants", () => {
  it.each([
    ["ENTRY_SCHEMA_VERSION", ENTRY_SCHEMA_VERSION, 1],
    ["RAYCAST_SCHEMA_VERSION", RAYCAST_SCHEMA_VERSION, 2],
    ["REGISTRY_ARTIFACT_SCHEMA_VERSION", REGISTRY_ARTIFACT_SCHEMA_VERSION, 2],
    ["SITE_URL", SITE_URL, "https://heyclau.de"],
    ["RAYCAST_COPY_PREVIEW_LIMIT", RAYCAST_COPY_PREVIEW_LIMIT, 800],
  ] as const)("exposes %s as %s", (_name, actual, expected) => {
    expect(actual).toBe(expected);
  });
});

describe("truncateText", () => {
  it.each([
    ["", 10, ""],
    ["   ", 10, ""],
    [null, 10, ""],
    [undefined, 10, ""],
    ["hello", 10, "hello"],
    ["hello", 5, "hello"],
    ["hello world", 5, "he..."],
    ["abcdef", 4, "a..."],
    ["abcdef", 3, "..."],
    ["abcdef", 2, "..."],
    ["abcdef", 1, "..."],
    ["abcdef", 0, "..."],
    ["  padded  ", 20, "padded"],
    ["no trim needed", 100, "no trim needed"],
    ["exactly ten!", 10, "exactly..."],
    ["exactly eleven", 10, "exactly..."],
  ])("truncates %j with max %i to %j", (input, maxLength, expected) => {
    expect(truncateText(input as string, maxLength)).toBe(expected);
  });

  it.each([
    ["café résumé", 20, "café résumé"],
    ["café résumé narrative", 12, "café résu..."],
    ["🚀 launch", 20, "🚀 launch"],
    ["🚀🚀🚀🚀🚀🚀🚀🚀", 8, "🚀🚀..."],
    ["emoji 🎉 party", 10, "emoji..."],
    ["日本語テキスト", 6, "日本語..."],
  ])("handles unicode in %j with max %i", (input, maxLength, expected) => {
    expect(truncateText(input, maxLength)).toBe(expected);
  });

  it.each([
    ["\uD800 lone high surrogate", 40, "lone high surrogate"],
    ["\uDC00 lone low surrogate", 40, "lone low surrogate"],
    ["\uD800\uDC00 pair kept", 40, "\uD800\uDC00"],
    ["prefix \uD800 broken suffix", 12, "prefix  b"],
  ])("strips lone surrogates from %j", (input, maxLength, fragment) => {
    const result = truncateText(input, maxLength);
    expect(result.includes("\uD800") && !input.includes("\uD800\uDC00")).toBe(
      false,
    );
    expect(result.includes("\uDC00") && !input.includes("\uD800\uDC00")).toBe(
      false,
    );
    if (fragment) expect(result).toContain(fragment);
  });

  it.each([800, 6000, 240])(
    "respects ellipsis budget for limit %i",
    (maxLength) => {
      const body = "x".repeat(maxLength + 50);
      const result = truncateText(body, maxLength);
      expect(result.endsWith("...")).toBe(true);
      expect(result.length).toBeLessThanOrEqual(maxLength);
    },
  );

  it("trims trailing whitespace before adding ellipsis", () => {
    expect(truncateText("hello     world", 8)).toBe("hello...");
  });
});

describe("dataUrl", () => {
  it.each([
    [["entries"], "/data/entries"],
    [["entries", "mcp", "demo.json"], "/data/entries/mcp/demo.json"],
    [
      ["feeds", "platforms", "claude-code.json"],
      "/data/feeds/platforms/claude-code.json",
    ],
    [
      ["skill-adapters", "cursor", "lint-helper.mdc"],
      "/data/skill-adapters/cursor/lint-helper.mdc",
    ],
    [
      ["raycast", "mcp", "demo-server.json"],
      "/data/raycast/mcp/demo-server.json",
    ],
    [["directory-index.json"], "/data/directory-index.json"],
  ])("joins segments %j", (segments, expected) => {
    expect(dataUrl(...segments)).toBe(expected);
  });

  it.each([
    [["spaces here"], "/data/spaces%20here"],
    [["slash/part"], "/data/slash%2Fpart"],
    [["question?"], "/data/question%3F"],
    [["hash#tag"], "/data/hash%23tag"],
    [["percent%25"], "/data/percent%2525"],
  ])("encodes segment %j", (segments, expected) => {
    expect(dataUrl(...segments)).toBe(expected);
  });

  it("encodes numeric segments as strings", () => {
    expect(dataUrl("entries", 42 as unknown as string)).toBe(
      "/data/entries/42",
    );
  });
});

describe("generatedAtForEntries", () => {
  function dated(overrides: SyntheticEntry = {}) {
    return syntheticEntry("mcp", "dated", {
      dateAdded: "",
      contentUpdatedAt: "",
      verifiedAt: "",
      ...overrides,
    });
  }

  it.each([
    [[], "1970-01-01T00:00:00.000Z"],
    [[dated({ dateAdded: "not-a-date" })], "1970-01-01T00:00:00.000Z"],
    [[dated({ dateAdded: "" })], "1970-01-01T00:00:00.000Z"],
  ])("falls back for empty or invalid dates", (entries, expected) => {
    expect(generatedAtForEntries(entries)).toBe(expected);
  });

  it.each([
    [[dated({ dateAdded: "2024-06-01" })], "2024-06-01T00:00:00.000Z"],
    [
      [
        dated({ dateAdded: "2024-01-01" }),
        dated({ slug: "later", dateAdded: "2025-12-31" }),
      ],
      "2025-12-31T00:00:00.000Z",
    ],
    [
      [
        dated({ dateAdded: "2024-01-01T12:00:00.000Z" }),
        dated({ slug: "same-day", dateAdded: "2024-01-01" }),
      ],
      "2024-01-01T00:00:00.000Z",
    ],
  ])("uses latest dateAdded", (entries, expected) => {
    expect(generatedAtForEntries(entries)).toBe(expected);
  });

  it.each([
    [
      syntheticEntry("skills", "content-updated", {
        dateAdded: "2024-01-01",
        contentUpdatedAt: "2026-03-15",
        verifiedAt: "",
      }),
      "2026-03-15T00:00:00.000Z",
    ],
    [
      syntheticEntry("skills", "verified-at", {
        dateAdded: "2024-01-01",
        contentUpdatedAt: "2025-01-01",
        verifiedAt: "2026-05-20",
      }),
      "2026-05-20T00:00:00.000Z",
    ],
    [
      syntheticEntry("mcp", "mixed", {
        dateAdded: "2026-06-01",
        contentUpdatedAt: "2026-01-01",
        verifiedAt: "2026-04-01",
      }),
      "2026-06-01T00:00:00.000Z",
    ],
  ])("considers contentUpdatedAt and verifiedAt", (entry, expected) => {
    expect(generatedAtForEntries([entry])).toBe(expected);
  });
});

describe("buildArtifactHash", () => {
  it("hashes JSON payloads deterministically", () => {
    const payload = { kind: "demo", count: 2, nested: { ok: true } };
    const first = buildArtifactHash(payload);
    const second = buildArtifactHash(payload);
    expect(first).toBe(second);
    expect(first).toMatch(/^[a-f0-9]{64}$/);
    expect(first).toBe(sha256(JSON.stringify(payload)));
  });

  it.each([
    ["plain text", "text", sha256("plain text")],
    ["", "text", sha256("")],
    ["multi\nline", "text", sha256("multi\nline")],
  ])("hashes text type %j", (value, type, expected) => {
    expect(buildArtifactHash(value, type as "text")).toBe(expected);
  });

  it.each([
    [{ a: 1 }, { a: 1 }],
    [
      [1, 2, 3],
      [1, 2, 3],
    ],
  ])("defaults to json hashing for %j", (value, again) => {
    expect(buildArtifactHash(value)).toBe(buildArtifactHash(again));
  });

  it("changes hash when payload changes", () => {
    expect(buildArtifactHash({ a: 1 })).not.toBe(buildArtifactHash({ a: 2 }));
  });
});

describe("platformFeedSlug", () => {
  it.each(PLATFORM_IDS)("keeps canonical platform id %s stable", (id) => {
    expect(platformFeedSlug(id)).toBe(id);
  });

  it.each(Object.entries(PLATFORM_LABELS))(
    "slugifies label %s to kebab-case",
    (_id, label) => {
      const slug = platformFeedSlug(label);
      expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(slug.length).toBeGreaterThan(0);
    },
  );

  it.each([
    ["Claude & Cursor", "claude-and-cursor"],
    [" Claude---Code!! ", "claude-code"],
    ["Generic AGENTS", "generic-agents"],
    ["VS Code", "vs-code"],
    ["", ""],
    ["   ", ""],
    ["A&B&C", "a-andb-andc"],
    ["trailing---", "trailing"],
    ["___mixed___", "mixed"],
  ])("normalizes %j to %j", (input, expected) => {
    expect(platformFeedSlug(input)).toBe(expected);
  });
});

describe("buildSkillPlatformCompatibility", () => {
  it.each([
    ["mcp", FIXTURE_MCP],
    ["tools", FIXTURE_TOOLS],
    ["agents", FIXTURE_AGENTS],
    ["hooks", FIXTURE_HOOKS],
    ["rules", FIXTURE_RULES],
    ["commands", FIXTURE_COMMANDS],
  ])("returns empty compatibility for non-skill category %s", (_cat, entry) => {
    expect(buildSkillPlatformCompatibility(entry)).toEqual([]);
  });

  it("preserves explicit platformCompatibility metadata", () => {
    const explicit = [
      {
        platform: "Custom IDE",
        supportLevel: "manual-context",
        installPath: "custom/path",
        verifiedAt: "2026-01-01",
      },
    ];
    expect(
      buildSkillPlatformCompatibility({
        category: "skills",
        platformCompatibility: explicit,
      }),
    ).toBe(explicit);
  });

  it.each([
    "Claude",
    "Codex",
    "Windsurf",
    "Gemini",
    "Cursor",
    "Generic AGENTS",
  ])("includes default platform %s for skills", (platform) => {
    const compatibility = buildSkillPlatformCompatibility(FIXTURE_SKILLS);
    expect(compatibility.map((item) => item.platform)).toContain(platform);
  });

  it("builds Cursor adapter path from slug", () => {
    const cursor = buildSkillPlatformCompatibility(FIXTURE_SKILLS).find(
      (item) => item.platform === "Cursor",
    );
    expect(cursor).toMatchObject({
      supportLevel: "adapter",
      installPath: ".cursor/rules/<skill-name>.mdc",
      adapterPath: dataUrl("skill-adapters", "cursor", "lint-helper.mdc"),
    });
  });

  it.each([
    ["verifiedAt", "2026-02-10"],
    ["dateAdded", "2026-03-01"],
  ])("uses %s when verifiedAt is absent", (field, value) => {
    const compatibility = buildSkillPlatformCompatibility(
      syntheticEntry("skills", "dated-skill", {
        verifiedAt: "",
        [field]: value,
      }),
    );
    expect(compatibility[0]?.verifiedAt).toBe(value);
  });
});

describe("buildEntryTrustSignals", () => {
  it.each([
    ["source-backed sparse", SPARSE_ENTRY, "missing", 0],
    ["source-backed rich", FIXTURE_MCP, "available", 3],
    ["branded tool", BRANDED_ENTRY, "available", 3],
  ])(
    "%s sets sourceStatus=%s and sourceUrlCount=%s",
    (_label, entry, status, count) => {
      const signals = buildEntryTrustSignals(entry);
      expect(signals.sourceStatus).toBe(status);
      expect(signals.sourceUrlCount).toBe(count);
    },
  );

  it.each([
    [FIXTURE_MCP, true, "first-party", true],
    [SPARSE_ENTRY, false, null, false],
    [
      syntheticEntry("skills", "verified-pkg", {
        packageVerified: true,
        downloadTrust: "first-party",
        downloadSha256: "deadbeef",
      }),
      true,
      "first-party",
      true,
    ],
  ])(
    "reports package trust for entry slug %s",
    (entry, packageVerified, packageTrust, checksumPresent) => {
      const signals = buildEntryTrustSignals(entry);
      expect(signals.packageVerified).toBe(packageVerified);
      expect(signals.packageTrust).toBe(packageTrust);
      expect(signals.checksumPresent).toBe(checksumPresent);
    },
  );

  it("marks editorial picks as firstPartyEditorial", () => {
    expect(buildEntryTrustSignals(EDITORIAL_ENTRY).firstPartyEditorial).toBe(
      true,
    );
    expect(buildEntryTrustSignals(FIXTURE_MCP).firstPartyEditorial).toBe(false);
  });

  it.each([
    [FIXTURE_MCP, true, true],
    [SPARSE_ENTRY, false, false],
    [
      syntheticEntry("hooks", "notes", {
        safetyNotes: ["Careful"],
        privacyNotes: [],
      }),
      true,
      false,
    ],
    [
      syntheticEntry("hooks", "privacy", {
        safetyNotes: [],
        privacyNotes: ["Local only"],
      }),
      false,
      true,
    ],
  ])("tracks safety/privacy notes presence", (entry, safety, privacy) => {
    const signals = buildEntryTrustSignals(entry);
    expect(signals.hasSafetyNotes).toBe(safety);
    expect(signals.hasPrivacyNotes).toBe(privacy);
  });

  it("marks adapterGenerated for skills with Cursor adapter", () => {
    expect(buildEntryTrustSignals(FIXTURE_SKILLS).adapterGenerated).toBe(true);
    expect(buildEntryTrustSignals(FIXTURE_MCP).adapterGenerated).toBe(false);
  });

  it("includes normalized platform names", () => {
    const signals = buildEntryTrustSignals(
      syntheticEntry("skills", "cursor-tag", { tags: ["cursor", "codex"] }),
    );
    expect(signals.platforms).toEqual(
      expect.arrayContaining(["cursor", "codex", "claude-code"]),
    );
  });

  it("deduplicates source URLs from multiple fields", () => {
    const entry = syntheticEntry("mcp", "dup-sources", {
      documentationUrl: "https://example.com/docs",
      docsUrl: "https://example.com/docs",
      repoUrl: "https://github.com/example/repo",
    });
    const signals = buildEntryTrustSignals(entry);
    expect(signals.sourceUrls).toEqual([
      "https://example.com/docs",
      "/downloads/synthetic.zip",
      "https://github.com/example/repo",
    ]);
  });

  it.each([
    [
      "downloadSha256",
      { downloadSha256: "direct-sha", skillPackage: { sha256: "pkg-sha" } },
      "direct-sha",
    ],
    [
      "skillPackage.sha256",
      { downloadSha256: "", skillPackage: { sha256: "pkg-sha" } },
      "pkg-sha",
    ],
  ])("prefers checksum from %s", (_label, overrides, expected) => {
    const signals = buildEntryTrustSignals(
      syntheticEntry("skills", "checksum", overrides),
    );
    expect(signals.packageChecksum).toBe(expected);
    expect(signals.checksumPresent).toBe(true);
  });
});

describe("buildDirectoryEntries", () => {
  it("maps every synthetic fixture without dropping entries", () => {
    const directory = buildDirectoryEntries(ALL_FIXTURES);
    expect(directory).toHaveLength(ALL_FIXTURES.length);
  });

  it("prefers cardDescription over description", () => {
    const [row] = buildDirectoryEntries([
      syntheticEntry("tools", "card", {
        cardDescription: "Card wins",
        description: "Body loses",
      }),
    ]);
    expect(row.description).toBe("Card wins");
  });

  it("falls back to description when cardDescription is absent", () => {
    const [row] = buildDirectoryEntries([
      syntheticEntry("tools", "body", {
        cardDescription: undefined,
        description: "Body only",
      }),
    ]);
    expect(row.description).toBe("Body only");
  });

  it.each([
    [FIXTURE_MCP, true],
    [SPARSE_ENTRY, false],
    [
      syntheticEntry("commands", "installable", {
        installCommand: "claude command add demo",
      }),
      true,
    ],
  ])("computes installable flag", (entry, installable) => {
    expect(buildDirectoryEntries([entry])[0]?.installable).toBe(installable);
  });

  it("embeds trustSignals on each row", () => {
    const [row] = buildDirectoryEntries([FIXTURE_MCP]);
    expect(row.trustSignals).toEqual(buildEntryTrustSignals(FIXTURE_MCP));
  });

  it("includes repo stats when repoUrl is present", () => {
    const [row] = buildDirectoryEntries([FIXTURE_MCP]);
    expect(row.repoStats).toMatchObject({
      repository: "example/synthetic",
      url: FIXTURE_MCP.repoUrl,
      label: "Source repo",
    });
  });

  it("preserves input order", () => {
    const shuffled = [FIXTURE_SKILLS, FIXTURE_MCP, FIXTURE_AGENTS];
    expect(buildDirectoryEntries(shuffled).map((row) => row.slug)).toEqual(
      shuffled.map((entry) => entry.slug),
    );
  });
});

describe("buildSearchEntries", () => {
  it("maps every synthetic fixture", () => {
    expect(buildSearchEntries(ALL_FIXTURES)).toHaveLength(ALL_FIXTURES.length);
  });

  it("filters to a category when results are post-filtered", () => {
    const mcpOnly = buildSearchEntries(ALL_FIXTURES).filter(
      (row) => row.category === "mcp",
    );
    expect(mcpOnly).toHaveLength(1);
    expect(mcpOnly[0]?.slug).toBe("demo-server");
  });

  it("sorts by title when explicitly ordered", () => {
    const titles = buildSearchEntries(ALL_FIXTURES)
      .sort((a, b) => String(a.title).localeCompare(String(b.title)))
      .map((row) => row.title);
    expect(titles[0]).toBeDefined();
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("includes compact list trust signals", () => {
    const [row] = buildSearchEntries([FIXTURE_MCP]);
    expect(row.trustSignals).toEqual({
      firstPartyEditorial: false,
      packageVerified: true,
      sourceStatus: "available",
      lastVerifiedAt: FIXTURE_MCP.verifiedAt,
      hasSafetyNotes: true,
      hasPrivacyNotes: true,
      platforms: buildEntryTrustSignals(FIXTURE_MCP).platforms,
      supportLevels: buildEntryTrustSignals(FIXTURE_MCP).supportLevels,
    });
  });

  it("includes MCP install facets for MCP entries", () => {
    const [row] = buildSearchEntries([FIXTURE_MCP]);
    expect(row.hasInstallCommand).toBe(true);
    expect(row.hasConfigSnippet).toBe(true);
    expect(row.installable).toBe(true);
  });

  it("includes supportLevels from skill compatibility", () => {
    const [row] = buildSearchEntries([FIXTURE_SKILLS]);
    expect(row.supportLevels).toEqual(
      buildSkillPlatformCompatibility(FIXTURE_SKILLS).map(
        (item) => item.supportLevel,
      ),
    );
  });
});

describe("buildRaycastDetailMarkdown", () => {
  it("includes title, description, and trust section", () => {
    const markdown = buildRaycastDetailMarkdown(FIXTURE_MCP);
    expect(markdown.startsWith(`# ${FIXTURE_MCP.title}`)).toBe(true);
    expect(markdown).toContain(String(FIXTURE_MCP.description));
    expect(markdown).toContain("## Trust");
    expect(markdown).toContain("source-backed");
  });

  it.each([
    [FIXTURE_MCP, "## Install", "## Config"],
    [FIXTURE_COMMANDS, "## Install", ""],
  ])(
    "renders install/config sections when present",
    (entry, installHeading, configHeading) => {
      const markdown = buildRaycastDetailMarkdown(entry);
      expect(markdown).toContain(installHeading);
      if (configHeading) expect(markdown).toContain(configHeading);
    },
  );

  it("includes safety and privacy note sections", () => {
    const markdown = buildRaycastDetailMarkdown(FIXTURE_MCP);
    expect(markdown).toContain("## Safety notes");
    expect(markdown).toContain("Runs local commands.");
    expect(markdown).toContain("## Privacy notes");
  });

  it("truncates very long markdown to 6000 characters", () => {
    const huge = syntheticEntry("mcp", "huge", {
      description: "x".repeat(7000),
      usageSnippet: "y".repeat(7000),
    });
    expect(buildRaycastDetailMarkdown(huge).length).toBeLessThanOrEqual(6000);
  });
});

describe("buildRaycastDetail", () => {
  it("returns schemaVersion 2 detail payload", () => {
    const detail = buildRaycastDetail(FIXTURE_MCP);
    expect(detail).toMatchObject({
      schemaVersion: RAYCAST_SCHEMA_VERSION,
      key: "mcp:demo-server",
      category: "mcp",
      slug: "demo-server",
      title: FIXTURE_MCP.title,
      detailMarkdown: expect.any(String),
      webUrl: `${SITE_URL}/entry/mcp/demo-server`,
      packageVerified: true,
    });
  });

  it("includes llms and api urls", () => {
    const detail = buildRaycastDetail(FIXTURE_MCP);
    expect(detail.llmsUrl).toBe("/api/registry/entries/mcp/demo-server/llms");
    expect(detail.apiUrl).toBe(
      `${SITE_URL}/api/registry/entries/mcp/demo-server`,
    );
  });

  it("embeds trustSignals and note fields", () => {
    const detail = buildRaycastDetail(FIXTURE_MCP);
    expect(detail.trustSignals).toEqual(buildEntryTrustSignals(FIXTURE_MCP));
    expect(detail.safetyNotes).toEqual(FIXTURE_MCP.safetyNotes);
    expect(detail.privacyNotes).toEqual(FIXTURE_MCP.privacyNotes);
  });
});

describe("buildRaycastEntries", () => {
  it("maps fixtures to Raycast list rows", () => {
    const rows = buildRaycastEntries(ALL_FIXTURES);
    expect(rows).toHaveLength(ALL_FIXTURES.length);
    expect(rows[0]).toMatchObject({
      detailUrl: dataUrl("raycast", rows[0]!.category, `${rows[0]!.slug}.json`),
      webUrl: `${SITE_URL}/entry/${rows[0]!.category}/${rows[0]!.slug}`,
    });
  });

  it("uses skill platform compatibility only for skills", () => {
    const skillRow = buildRaycastEntries([FIXTURE_SKILLS])[0];
    const mcpRow = buildRaycastEntries([FIXTURE_MCP])[0];
    expect(skillRow?.platformCompatibility).toEqual(
      buildSkillPlatformCompatibility(FIXTURE_SKILLS),
    );
    expect(mcpRow?.platformCompatibility).toEqual(
      buildEntryTrustSignals(FIXTURE_MCP).platforms,
    );
  });
});

describe("buildRaycastEnvelope", () => {
  it("wraps Raycast entries with envelope metadata", () => {
    const envelope = buildRaycastEnvelope(ALL_FIXTURES);
    expect(envelope).toMatchObject({
      schemaVersion: RAYCAST_SCHEMA_VERSION,
      kind: "raycast-index",
      generatedAt: generatedAtForEntries(ALL_FIXTURES),
      count: ALL_FIXTURES.length,
    });
    expect(envelope.entries).toHaveLength(ALL_FIXTURES.length);
  });
});

describe("buildEntryDetail", () => {
  it("returns schemaVersion 1 detail with trust signals", () => {
    const detail = buildEntryDetail(FIXTURE_MCP);
    expect(detail.schemaVersion).toBe(ENTRY_SCHEMA_VERSION);
    expect(detail.key).toBe("mcp:demo-server");
    expect(detail.trustSignals).toEqual(buildEntryTrustSignals(FIXTURE_MCP));
  });

  it("strips presentation-only fields from entry payload", () => {
    const detail = buildEntryDetail({
      ...FIXTURE_MCP,
      codeBlocks: [{ lang: "bash", code: "echo hi" }],
      sections: [{ id: "install" }],
      headings: ["Install"],
    });
    expect(detail.entry).not.toHaveProperty("codeBlocks");
    expect(detail.entry).not.toHaveProperty("sections");
    expect(detail.entry).not.toHaveProperty("headings");
  });

  it("accepts relatedEntries from params", () => {
    const related = [{ key: "skills:lint-helper", title: "Lint Helper" }];
    const detail = buildEntryDetail(FIXTURE_MCP, { relatedEntries: related });
    expect(detail.entry.relatedEntries).toEqual(related);
  });

  it("accepts relatedEntries from relationLookup", () => {
    const lookup = new Map([
      [
        "mcp:demo-server",
        [{ key: "skills:lint-helper", title: "Lint Helper" }],
      ],
    ]);
    const detail = buildEntryDetail(FIXTURE_MCP, { relationLookup: lookup });
    expect(detail.entry.relatedEntries).toHaveLength(1);
  });
});

describe("buildCursorSkillAdapter", () => {
  it("renders Cursor rule frontmatter and body", () => {
    const adapter = buildCursorSkillAdapter(FIXTURE_SKILLS);
    expect(adapter.startsWith("---")).toBe(true);
    expect(adapter).toContain('description: "Card copy for lint-helper."');
    expect(adapter).toContain("# skills lint-helper");
    expect(adapter).toContain("## Install");
    expect(adapter).toContain("## Source");
  });

  it("escapes quotes in description frontmatter", () => {
    const adapter = buildCursorSkillAdapter(
      syntheticEntry("skills", "quoted", {
        cardDescription: 'Say "hello" to the team',
      }),
    );
    expect(adapter).toContain('description: "Say \\"hello\\" to the team"');
  });

  it("uses absolute download URLs for root-relative paths", () => {
    const adapter = buildCursorSkillAdapter(FIXTURE_SKILLS);
    expect(adapter).toContain(`${SITE_URL}${FIXTURE_SKILLS.downloadUrl}`);
  });

  it("falls back to repo or docs URL when download is absent", () => {
    const adapter = buildCursorSkillAdapter(
      syntheticEntry("skills", "source-only", {
        downloadUrl: "",
      }),
    );
    expect(adapter).toContain("https://github.com/example/synthetic");
  });

  it("keeps blank-line separators, including right after the closing frontmatter", () => {
    const adapter = buildCursorSkillAdapter(FIXTURE_SKILLS);
    // Blank line between the closing `---` and the body heading.
    expect(adapter).toContain("---\n\n# skills lint-helper");
    // Blank line before the optional Install section (not glued to the intro).
    expect(adapter).toContain("\n\n## Install");
    // The document is not collapsed into a single blank-line-free block.
    expect(adapter).toMatch(/\n\n/);
  });
});

describe("buildArtifactEnvelope", () => {
  it("wraps entries with schema metadata", () => {
    const envelope = buildArtifactEnvelope("directory-index", ALL_FIXTURES, {
      note: "fixture",
    });
    expect(envelope).toMatchObject({
      schemaVersion: REGISTRY_ARTIFACT_SCHEMA_VERSION,
      kind: "directory-index",
      generatedAt: generatedAtForEntries(ALL_FIXTURES),
      count: ALL_FIXTURES.length,
      note: "fixture",
      entries: ALL_FIXTURES,
    });
  });
});

describe("buildEnvelopeEntries", () => {
  it("returns entries from a valid envelope", () => {
    expect(buildEnvelopeEntries({ entries: ALL_FIXTURES })).toEqual(
      ALL_FIXTURES,
    );
  });

  it.each([null, undefined, {}, { entries: null }, { entries: "bad" }])(
    "throws for invalid envelope %j",
    (payload) => {
      expect(() => buildEnvelopeEntries(payload as never)).toThrow(TypeError);
    },
  );
});

describe("buildReadOnlyEcosystemFeed", () => {
  it("builds signed ecosystem feed", () => {
    const feed = buildReadOnlyEcosystemFeed(ALL_FIXTURES);
    expect(feed).toMatchObject({
      schemaVersion: REGISTRY_ARTIFACT_SCHEMA_VERSION,
      kind: "ecosystem-feed",
      count: ALL_FIXTURES.length,
      signatureAlgorithm: "sha256",
    });
    expect(feed.entries).toHaveLength(ALL_FIXTURES.length);
    const { signature, signatureAlgorithm, ...payload } = feed;
    expect(signatureAlgorithm).toBe("sha256");
    expect(signature).toBe(buildArtifactHash(payload));
  });

  it("honors custom siteUrl", () => {
    const feed = buildReadOnlyEcosystemFeed([FIXTURE_MCP], {
      siteUrl: "https://custom.example",
    });
    expect(feed.entries[0]?.url).toBe(
      "https://custom.example/entry/mcp/demo-server",
    );
  });
});

describe("buildMcpRegistryFeed", () => {
  it("filters to MCP category only", () => {
    const feed = buildMcpRegistryFeed(ALL_FIXTURES);
    expect(feed.kind).toBe("mcp-registry-feed");
    expect(feed.count).toBe(1);
    expect(feed.servers[0]).toMatchObject({
      name: "demo-server",
      title: FIXTURE_MCP.title,
      installCommand: FIXTURE_MCP.installCommand,
    });
  });

  it.each([
    ["https://github.com/org/repo", "github"],
    ["https://gitlab.com/org/repo", "gitlab"],
    ["https://bitbucket.org/org/repo", "bitbucket"],
    ["https://code.example.com/org/repo", "code.example.com"],
  ])("infers repository source for %s", (repoUrl, source) => {
    const feed = buildMcpRegistryFeed([
      syntheticEntry("mcp", "repo-source", { repoUrl }),
    ]);
    expect(feed.servers[0]?.repository).toEqual({ url: repoUrl, source });
  });
});

describe("buildPluginExportFeed", () => {
  it("includes plugin-capable categories only", () => {
    const feed = buildPluginExportFeed(ALL_FIXTURES);
    expect(feed.kind).toBe("plugin-export-feed");
    expect(feed.plugins.map((plugin) => plugin.category)).toEqual(
      expect.arrayContaining(["agents", "mcp", "skills", "hooks", "commands"]),
    );
    expect(feed.plugins.some((plugin) => plugin.category === "guides")).toBe(
      false,
    );
  });

  it("includes skill platform compatibility for skills", () => {
    const plugin = buildPluginExportFeed([FIXTURE_SKILLS]).plugins[0];
    expect(plugin?.platformCompatibility).toEqual(
      buildSkillPlatformCompatibility(FIXTURE_SKILLS),
    );
  });
});

describe("buildRegistryChangelogFeed", () => {
  it("sorts changes by dateAdded descending then title", () => {
    const entries = [
      syntheticEntry("mcp", "older", { dateAdded: "2024-01-01", title: "B" }),
      syntheticEntry("skills", "newer", {
        dateAdded: "2026-06-01",
        title: "A",
      }),
      syntheticEntry("tools", "same-day", {
        dateAdded: "2026-06-01",
        title: "Z",
      }),
    ];
    const feed = buildRegistryChangelogFeed(entries);
    expect(feed.entries.map((change) => change.slug)).toEqual([
      "newer",
      "same-day",
      "older",
    ]);
  });

  it("includes signed envelope metadata", () => {
    const feed = buildRegistryChangelogFeed([FIXTURE_MCP]);
    expect(feed).toMatchObject({
      kind: "registry-changelog",
      signatureAlgorithm: "sha256",
    });
    expect(feed.entries[0]).toMatchObject({
      type: "added",
      key: "mcp:demo-server",
      artifactHash: expect.stringMatching(/^[a-f0-9]{64}$/),
    });
    const { signature, signatureAlgorithm, ...payload } = feed;
    expect(signatureAlgorithm).toBe("sha256");
    expect(signature).toBe(buildArtifactHash(payload));
  });
});

describe("buildCategoryDistributionFeed", () => {
  it("uses custom siteUrl for canonical URLs", () => {
    const feed = buildCategoryDistributionFeed(ALL_FIXTURES, "mcp", {
      siteUrl: "https://mirror.example",
    });
    expect(feed.entries[0]?.canonicalUrl).toBe(
      "https://mirror.example/entry/mcp/demo-server",
    );
  });
});

describe("buildPlatformDistributionFeed", () => {
  it.each(["Claude", "Cursor", "Codex"])(
    "builds platform feed for %s",
    (platform) => {
      const feed = buildPlatformDistributionFeed(ALL_FIXTURES, platform);
      expect(feed).toMatchObject({
        kind: "platform-feed",
        platform,
        platformSlug: platformFeedSlug(platform),
      });
      expect(feed.count).toBeGreaterThanOrEqual(0);
    },
  );

  it("includes only skills compatible with the requested platform", () => {
    const feed = buildPlatformDistributionFeed(ALL_FIXTURES, "Cursor");
    expect(feed.entries.every((row) => row.category === "skills")).toBe(true);
    expect(feed.count).toBe(1);
  });
});

describe("buildDistributionFeedIndex", () => {
  it("lists every category and discovered platform", () => {
    const index = buildDistributionFeedIndex(ALL_FIXTURES);
    expect(index.kind).toBe("distribution-feed-index");
    expect(index.categories).toHaveLength(categorySpec.categoryOrder.length);
    expect(index.platforms.length).toBeGreaterThan(0);
    expect(index.categories[0]).toMatchObject({
      feedUrl: expect.stringMatching(/^\/data\/feeds\/categories\//),
    });
  });

  it("counts skills per platform", () => {
    const index = buildDistributionFeedIndex(ALL_FIXTURES);
    const cursor = index.platforms.find((item) => item.platform === "Cursor");
    expect(cursor?.count).toBe(1);
    expect(cursor?.feedUrl).toBe(dataUrl("feeds", "platforms", "cursor.json"));
  });
});

describe("buildRegistryManifest", () => {
  it("summarizes registry routes and artifact URLs", () => {
    const manifest = buildRegistryManifest(ALL_FIXTURES);
    expect(manifest).toMatchObject({
      schemaVersion: REGISTRY_ARTIFACT_SCHEMA_VERSION,
      kind: "registry-manifest",
      totalEntries: ALL_FIXTURES.length,
      categoryOrder: categorySpec.categoryOrder,
    });
    expect(manifest.routes).toHaveLength(ALL_FIXTURES.length);
    expect(manifest.artifacts.directory).toBe(dataUrl("directory-index.json"));
    expect(manifest.qualitySummary).toBeTypeOf("object");
    expect(manifest.trustSummary).toBeTypeOf("object");
  });

  it("merges artifactContracts from extra params", () => {
    const contracts = {
      "demo.json": {
        path: "/data/demo.json",
        type: "json" as const,
        sha256: "abc",
      },
    };
    expect(
      buildRegistryManifest(ALL_FIXTURES, { artifactContracts: contracts })
        .artifactContracts,
    ).toEqual(contracts);
  });
});

describe("buildArtifactManifestV2", () => {
  it("delegates to buildRegistryManifest", () => {
    expect(buildArtifactManifestV2(ALL_FIXTURES)).toEqual(
      buildRegistryManifest(ALL_FIXTURES),
    );
  });
});

describe("buildRegistryTrustReport", () => {
  it("builds aggregate trust summary", () => {
    const report = buildRegistryTrustReport(ALL_FIXTURES);
    expect(report).toMatchObject({
      schemaVersion: REGISTRY_ARTIFACT_SCHEMA_VERSION,
      kind: "registry-trust-report",
      count: ALL_FIXTURES.length,
      thresholds: {
        recentlyVerifiedDays: 180,
        staleVerificationDays: 365,
      },
    });
    expect(report.summary.sourceAvailableCount).toBeGreaterThan(0);
    expect(report.entries).toHaveLength(ALL_FIXTURES.length);
  });

  it("includes category breakdown for every category", () => {
    const report = buildRegistryTrustReport(ALL_FIXTURES);
    for (const category of categorySpec.categoryOrder) {
      expect(report.categoryBreakdown[category]).toMatchObject({
        count: expect.any(Number),
      });
    }
  });

  it("queues entries needing attention", () => {
    const report = buildRegistryTrustReport([SPARSE_ENTRY, BRANDED_ENTRY]);
    expect(report.summary.entriesNeedingAttention).toBeGreaterThan(0);
    expect(report.queues.missingSource.length).toBeGreaterThan(0);
  });

  it("keeps stale-but-sourced entries out of the missingSource queue", () => {
    const report = buildRegistryTrustReport([
      {
        category: "agents",
        slug: "stale-one",
        title: "Stale One",
        repoUrl: "https://github.com/example/repo",
        verifiedAt: "2020-01-01",
        dateAdded: "2026-07-01",
      },
    ]);
    expect(report.summary.missingSourceCount).toBe(0);
    expect(report.queues.missingSource).toHaveLength(0);
    expect(report.queues.staleVerification.map((entry) => entry.key)).toContain(
      "agents:stale-one",
    );
  });

  it.each([
    ["branded", BRANDED_ENTRY, true],
    ["sparse mcp", SPARSE_ENTRY, false],
  ])("marks brand coverage for %s entries", (_label, entry, branded) => {
    const row = buildRegistryTrustReport([entry]).entries[0];
    expect(Boolean(row?.brandDomain)).toBe(branded);
  });
});

describe("buildContentQualityArtifact", () => {
  it("returns quality report for all fixtures", () => {
    const report = buildContentQualityArtifact(ALL_FIXTURES);
    expect(report.entries).toHaveLength(ALL_FIXTURES.length);
    expect(report.summary).toBeTypeOf("object");
  });
});

describe("buildContentPromptArtifact", () => {
  it("returns prompt report for all fixtures", () => {
    const report = buildContentPromptArtifact(ALL_FIXTURES);
    expect(report.prompts).toHaveLength(ALL_FIXTURES.length);
  });
});

describe("buildJsonLdSnapshots", () => {
  it("builds JSON-LD snapshot envelope", () => {
    const payload = buildJsonLdSnapshots(ALL_FIXTURES, {
      siteUrl: SITE_URL,
      siteName: "HeyClaude",
    });
    expect(payload).toMatchObject({
      schemaVersion: REGISTRY_ARTIFACT_SCHEMA_VERSION,
      kind: "jsonld-snapshots",
      count: ALL_FIXTURES.length,
    });
    expect(payload.entries[0]).toBeTypeOf("object");
  });
});

describe("buildEntryLlmsArtifact", () => {
  it.each([FIXTURE_MCP, FIXTURE_SKILLS, FIXTURE_AGENTS])(
    "renders LLMS text for %s/%s",
    (entry) => {
      const text = buildEntryLlmsArtifact(entry);
      expect(text).toContain(String(entry.title));
      expect(text.length).toBeGreaterThan(20);
    },
  );
});

describe("buildCorpusLlmsArtifact", () => {
  it("renders full corpus export", () => {
    const corpus = buildCorpusLlmsArtifact(ALL_FIXTURES, {
      siteName: "HeyClaude Full Corpus",
    });
    expect(corpus).toContain("HeyClaude Full Corpus");
    for (const entry of ALL_FIXTURES) {
      expect(corpus).toContain(String(entry.title));
    }
  });
});

describe("buildRegistryArtifactSet", () => {
  it("returns core artifact files plus per-entry outputs", () => {
    const files = buildRegistryArtifactSet(ALL_FIXTURES);
    const paths = files.map((file) => file.path);
    expect(paths).toEqual(
      expect.arrayContaining([
        "directory-index.json",
        "search-index.json",
        "raycast-index.json",
        "ecosystem-feed.json",
        "mcp-registry-feed.json",
        "plugin-export-feed.json",
        "registry-changelog.json",
        "relation-graph.json",
        "registry-trust-report.json",
        "feeds/index.json",
        "submission-spec.json",
        "content-quality-report.json",
        "content-quality-prompts.json",
        "jsonld-snapshots.json",
        "registry-manifest.json",
      ]),
    );
    expect(paths.filter((path) => path.startsWith("entries/"))).toHaveLength(
      ALL_FIXTURES.length,
    );
    expect(paths.filter((path) => path.startsWith("raycast/"))).toHaveLength(
      ALL_FIXTURES.length,
    );
    expect(
      paths.filter((path) => path.startsWith("skill-adapters/cursor/")),
    ).toHaveLength(1);
  });

  it("includes every category feed path", () => {
    const files = buildRegistryArtifactSet(ALL_FIXTURES);
    for (const category of categorySpec.categoryOrder) {
      expect(
        files.some((file) => file.path === `feeds/categories/${category}.json`),
      ).toBe(true);
    }
  });

  it("includes platform feeds for discovered platforms", () => {
    const files = buildRegistryArtifactSet(ALL_FIXTURES);
    expect(
      files.some((file) => file.path === "feeds/platforms/cursor.json"),
    ).toBe(true);
  });

  it("records sha256 contracts in registry manifest", () => {
    const files = buildRegistryArtifactSet([FIXTURE_MCP, FIXTURE_SKILLS]);
    const manifest = files.find(
      (file) => file.path === "registry-manifest.json",
    );
    expect(manifest?.value.artifactContracts).toBeTypeOf("object");
    expect(Object.keys(manifest!.value.artifactContracts).length).toBe(
      files.length - 1,
    );
  });

  it("throws for invalid content slugs", () => {
    expect(() =>
      buildRegistryArtifactSet([
        syntheticEntry("mcp", "bad slug!", { slug: "bad slug!" }),
      ]),
    ).toThrow(/Invalid content slug/);
  });
});

describe("cross-cutting artifact coverage", () => {
  it.each([
    "directory-index",
    "search-index",
    "ecosystem-feed",
    "mcp-registry-feed",
    "plugin-export-feed",
    "registry-changelog",
    "registry-trust-report",
    "jsonld-snapshots",
    "distribution-feed-index",
    "registry-manifest",
  ])("buildArtifactEnvelope accepts kind %s", (kind) => {
    const envelope = buildArtifactEnvelope(kind, ALL_FIXTURES);
    expect(envelope.kind).toBe(kind);
    expect(envelope.count).toBe(ALL_FIXTURES.length);
  });

  it.each(ALL_FIXTURES.map((entry) => [entry.category, entry.slug, entry]))(
    "buildRaycastDetail includes key for %s/%s",
    (category, slug) => {
      expect(
        buildRaycastDetail(ALL_FIXTURES.find((e) => e.slug === slug)!),
      ).toMatchObject({
        key: `${category}:${slug}`,
        schemaVersion: RAYCAST_SCHEMA_VERSION,
      });
    },
  );

  it.each(ALL_FIXTURES.map((entry) => [entry.category, entry.slug, entry]))(
    "buildEntryDetail exposes slug for %s/%s",
    (_category, slug, entry) => {
      expect(buildEntryDetail(entry).entry.slug).toBe(slug);
    },
  );

  it.each([
    ["hasCopySnippet", { copySnippet: "copy me" }, true],
    ["hasUsageSnippet default", {}, true],
    ["hasConfigSnippet default", {}, true],
    ["hasScriptBody", { scriptBody: "echo hi" }, true],
    [
      "sparse flags",
      {
        copySnippet: "",
        usageSnippet: "",
        configSnippet: "",
        scriptBody: "",
        hasCopySnippet: false,
        hasScriptBody: false,
      },
      false,
    ],
  ])("buildEntryDetail records %s", (_label, overrides, expected) => {
    const detail = buildEntryDetail(
      syntheticEntry("hooks", "flags", overrides),
    );
    if (_label.startsWith("hasCopySnippet") || _label === "sparse flags") {
      expect(detail.entry.hasCopySnippet).toBe(expected);
    }
    if (_label.startsWith("hasUsageSnippet") || _label === "sparse flags") {
      expect(detail.entry.hasUsageSnippet).toBe(
        _label === "sparse flags" ? false : true,
      );
    }
    if (_label.startsWith("hasConfigSnippet") || _label === "sparse flags") {
      expect(detail.entry.hasConfigSnippet).toBe(
        _label === "sparse flags" ? false : true,
      );
    }
    if (_label.startsWith("hasScriptBody") || _label === "sparse flags") {
      expect(detail.entry.hasScriptBody).toBe(expected);
    }
  });

  it.each(categorySpec.categoryOrder.map((category) => [category]))(
    "buildRegistryManifest counts category %s",
    (category) => {
      const manifest = buildRegistryManifest(ALL_FIXTURES);
      expect(manifest.categories[category]?.count).toBe(
        ALL_FIXTURES.filter((entry) => entry.category === category).length,
      );
    },
  );

  it.each([
    ["agents", 1],
    ["mcp", 1],
    ["skills", 1],
    ["tools", 1],
    ["rules", 1],
    ["commands", 1],
    ["hooks", 1],
    ["guides", 1],
    ["collections", 1],
    ["statuslines", 1],
  ])("buildCategoryDistributionFeed count for %s is %i", (category, count) => {
    expect(buildCategoryDistributionFeed(ALL_FIXTURES, category).count).toBe(
      count,
    );
  });

  it.each([
    ["Claude", 1],
    ["Codex", 1],
    ["Windsurf", 1],
    ["Gemini", 1],
    ["Cursor", 1],
    ["Generic AGENTS", 1],
  ])("buildPlatformDistributionFeed count for %s is %i", (platform, count) => {
    expect(buildPlatformDistributionFeed(ALL_FIXTURES, platform).count).toBe(
      count,
    );
  });

  it.each([
    [FIXTURE_MCP, "demo-server"],
    [FIXTURE_SKILLS, "lint-helper"],
    [FIXTURE_AGENTS, "workflow-agent"],
  ])("buildMcpRegistryFeed excludes non-mcp categories", (entry, slug) => {
    const feed = buildMcpRegistryFeed([entry]);
    if (entry.category === "mcp") {
      expect(feed.servers[0]?.name).toBe(slug);
    } else {
      expect(feed.count).toBe(0);
    }
  });

  it.each([
    ["agents", true],
    ["commands", true],
    ["hooks", true],
    ["mcp", true],
    ["skills", true],
    ["guides", false],
    ["tools", false],
    ["collections", false],
  ])("buildPluginExportFeed includes category %s: %s", (category, included) => {
    const feed = buildPluginExportFeed(ALL_FIXTURES);
    expect(feed.plugins.some((plugin) => plugin.category === category)).toBe(
      included,
    );
  });

  it.each([
    ["cardDescription", "Card text", "Card text"],
    [
      "description",
      undefined,
      "Synthetic mcp entry for artifacts-lib coverage.",
    ],
  ])("buildSearchEntries prefers %s", (field, cardDescription, expected) => {
    const [row] = buildSearchEntries([
      syntheticEntry("mcp", "search-copy", {
        cardDescription,
        description: "Synthetic mcp entry for artifacts-lib coverage.",
      }),
    ]);
    expect(row.description).toBe(expected);
  });

  it.each([
    ["verified", "verified"],
    ["unclaimed", "unclaimed"],
    ["", "unclaimed"],
  ])("buildRegistryTrustReport claimStatus %s", (claimStatus, expected) => {
    const row = buildRegistryTrustReport([
      syntheticEntry("mcp", "claim", { claimStatus }),
    ]).entries[0];
    expect(row?.claimStatus).toBe(expected);
  });
});
