import { describe, expect, it } from "vitest";

import type { ContentEntry } from "@heyclaude/registry";
import {
  buildAllPlatformPages,
  buildPlatformPage,
  findPlatformPageDefinition,
  getPlatformPageDefinitions,
  platformPageDefinitions,
  type PlatformPageDefinition,
} from "../apps/web/src/lib/platform-pages-lib";

function skill(partial: Partial<ContentEntry> = {}): ContentEntry {
  return {
    category: "skills",
    slug: "demo-skill",
    title: "Demo Skill",
    description: "A demo skill for platform page tests.",
    ...partial,
  } as ContentEntry;
}

function mcpEntry(partial: Partial<ContentEntry> = {}): ContentEntry {
  return {
    category: "mcp",
    slug: "demo-mcp",
    title: "Demo MCP",
    description: "Not a skill entry.",
    ...partial,
  } as ContentEntry;
}

describe("platformPageDefinitions", () => {
  it("lists every supported platform hub slug", () => {
    expect(platformPageDefinitions.map((item) => item.slug)).toEqual([
      "claude",
      "codex",
      "windsurf",
      "gemini",
      "cursor-rules",
      "agents-context",
    ]);
  });

  it("maps each slug to a distinct platform label", () => {
    const platforms = platformPageDefinitions.map((item) => item.platform);
    expect(new Set(platforms).size).toBe(platforms.length);
  });

  it.each(platformPageDefinitions)(
    "includes SEO and CTA copy for $slug",
    (definition) => {
      expect(definition.title.length).toBeGreaterThan(0);
      expect(definition.eyebrow.length).toBeGreaterThan(0);
      expect(definition.description.length).toBeGreaterThan(20);
      expect(definition.seoTitle.length).toBeGreaterThan(0);
      expect(definition.seoDescription.length).toBeGreaterThan(20);
      expect(definition.ctaLabel).toMatch(/View .+ feed|View .+ context/);
    },
  );

  it("keeps Claude and Codex definitions aligned with native skill platforms", () => {
    const claude = findPlatformPageDefinition("claude");
    const codex = findPlatformPageDefinition("codex");
    expect(claude?.platform).toBe("Claude");
    expect(codex?.platform).toBe("Codex");
    expect(claude?.title).toContain("Claude");
    expect(codex?.title).toContain("Codex");
  });

  it("uses adapter-oriented copy for Cursor rules", () => {
    const cursor = findPlatformPageDefinition("cursor-rules");
    expect(cursor?.platform).toBe("Cursor");
    expect(cursor?.description).toContain("adapter");
    expect(cursor?.seoTitle).toContain("Cursor");
  });

  it("uses manual-context copy for Generic AGENTS", () => {
    const agents = findPlatformPageDefinition("agents-context");
    expect(agents?.platform).toBe("Generic AGENTS");
    expect(agents?.description).toContain("AGENTS.md");
    expect(agents?.ctaLabel).toContain("AGENTS");
  });
});

describe("getPlatformPageDefinitions", () => {
  it("returns the canonical definition list", () => {
    expect(getPlatformPageDefinitions()).toBe(platformPageDefinitions);
    expect(getPlatformPageDefinitions()).toHaveLength(6);
  });
});

describe("findPlatformPageDefinition", () => {
  it("resolves known slugs and rejects unknown slugs", () => {
    expect(findPlatformPageDefinition("windsurf")?.platform).toBe("Windsurf");
    expect(findPlatformPageDefinition("gemini")?.slug).toBe("gemini");
    expect(findPlatformPageDefinition("missing")).toBeNull();
    expect(findPlatformPageDefinition("")).toBeNull();
  });
});

describe("buildPlatformPage", () => {
  const claudeDef = findPlatformPageDefinition("claude")!;

  it("returns zero items for non-skill entries", () => {
    const page = buildPlatformPage(claudeDef, [
      mcpEntry(),
      mcpEntry({ slug: "x" }),
    ]);
    expect(page.count).toBe(0);
    expect(page.items).toEqual([]);
    expect(page.feedUrl).toBe("/data/feeds/platforms/claude.json");
  });

  it("includes skill entries with default platform compatibility", () => {
    const page = buildPlatformPage(claudeDef, [
      skill({ slug: "alpha", title: "Alpha Skill" }),
      skill({ slug: "beta", title: "Beta Skill" }),
    ]);
    expect(page.count).toBe(2);
    expect(page.items.map((item) => item.slug)).toEqual(["alpha", "beta"]);
    expect(page.items.every((item) => item.url.startsWith("/skills/"))).toBe(
      true,
    );
    expect(
      page.items.every((item) => item.supportLevel === "native-skill"),
    ).toBe(true);
  });

  it("sorts items alphabetically by title", () => {
    const page = buildPlatformPage(claudeDef, [
      skill({ slug: "zulu", title: "Zulu Pack" }),
      skill({ slug: "alpha", title: "Alpha Pack" }),
      skill({ slug: "mike", title: "Mike Pack" }),
    ]);
    expect(page.items.map((item) => item.title)).toEqual([
      "Alpha Pack",
      "Mike Pack",
      "Zulu Pack",
    ]);
  });

  it("prefers cardDescription over description for item blurbs", () => {
    const page = buildPlatformPage(claudeDef, [
      skill({
        slug: "carded",
        title: "Carded",
        cardDescription: "Short card copy",
        description: "Longer dossier description",
      }),
    ]);
    expect(page.items[0]?.description).toBe("Short card copy");
  });

  it("falls back to description when cardDescription is absent", () => {
    const page = buildPlatformPage(claudeDef, [
      skill({
        slug: "plain",
        title: "Plain",
        description: "Dossier description only",
      }),
    ]);
    expect(page.items[0]?.description).toBe("Dossier description only");
  });

  it("carries tags from the registry entry", () => {
    const page = buildPlatformPage(claudeDef, [
      skill({ slug: "tagged", title: "Tagged", tags: ["testing", "docs"] }),
    ]);
    expect(page.items[0]?.tags).toEqual(["testing", "docs"]);
  });

  it("omits skills that declare incompatible platform lists", () => {
    const codexDef = findPlatformPageDefinition("codex")!;
    const page = buildPlatformPage(codexDef, [
      skill({
        slug: "claude-only",
        title: "Claude Only",
        platformCompatibility: [
          {
            platform: "Claude",
            supportLevel: "native-skill",
            installPath: ".claude/skills/x/SKILL.md",
            verifiedAt: "2026-01-01",
          },
        ],
      }),
    ]);
    expect(page.count).toBe(0);
    expect(page.items).toEqual([]);
  });

  it("honors custom platformCompatibility rows for the target platform", () => {
    const cursorDef = findPlatformPageDefinition("cursor-rules")!;
    const page = buildPlatformPage(cursorDef, [
      skill({
        slug: "cursor-adapter",
        title: "Cursor Adapter",
        platformCompatibility: [
          {
            platform: "Cursor",
            supportLevel: "adapter",
            installPath: ".cursor/rules/cursor-adapter.mdc",
            adapterPath: "/data/skill-adapters/cursor/cursor-adapter.mdc",
            verifiedAt: "2026-02-01",
          },
        ],
      }),
    ]);
    expect(page.count).toBe(1);
    expect(page.items[0]).toMatchObject({
      slug: "cursor-adapter",
      supportLevel: "adapter",
      installPath: ".cursor/rules/cursor-adapter.mdc",
      adapterPath: "/data/skill-adapters/cursor/cursor-adapter.mdc",
      verifiedAt: "2026-02-01",
    });
  });

  it.each([
    ["claude", "Claude", "claude.json"],
    ["codex", "Codex", "codex.json"],
    ["windsurf", "Windsurf", "windsurf.json"],
    ["gemini", "Gemini", "gemini.json"],
    ["cursor-rules", "Cursor", "cursor.json"],
    ["agents-context", "Generic AGENTS", "generic-agents.json"],
  ] as const)("builds feed URL for %s hub", (slug, _platform, feedFile) => {
    const definition = findPlatformPageDefinition(slug)!;
    const page = buildPlatformPage(definition, [
      skill({ slug: "x", title: "X" }),
    ]);
    expect(page.feedUrl).toBe(`/data/feeds/platforms/${feedFile}`);
    expect(page.slug).toBe(slug);
  });

  it("spreads definition metadata onto the built page", () => {
    const page = buildPlatformPage(claudeDef, []);
    expect(page.title).toBe(claudeDef.title);
    expect(page.eyebrow).toBe(claudeDef.eyebrow);
    expect(page.description).toBe(claudeDef.description);
    expect(page.seoTitle).toBe(claudeDef.seoTitle);
    expect(page.seoDescription).toBe(claudeDef.seoDescription);
    expect(page.ctaLabel).toBe(claudeDef.ctaLabel);
  });
});

describe("buildAllPlatformPages", () => {
  it("builds one page per definition", () => {
    const pages = buildAllPlatformPages([
      skill({ slug: "shared", title: "Shared" }),
    ]);
    expect(pages).toHaveLength(platformPageDefinitions.length);
    expect(pages.map((page) => page.slug)).toEqual(
      platformPageDefinitions.map((item) => item.slug),
    );
  });

  it("reuses the same skill across multiple platform hubs when compatible", () => {
    const pages = buildAllPlatformPages([
      skill({ slug: "multi", title: "Multi Platform" }),
    ]);
    const withItems = pages.filter((page) => page.count > 0);
    expect(withItems.length).toBeGreaterThan(1);
    expect(withItems.every((page) => page.items[0]?.slug === "multi")).toBe(
      true,
    );
  });

  it("returns empty hubs when the catalog has no skills", () => {
    const pages = buildAllPlatformPages([mcpEntry(), mcpEntry({ slug: "b" })]);
    expect(pages.every((page) => page.count === 0)).toBe(true);
    expect(pages.every((page) => page.items.length === 0)).toBe(true);
  });

  it("returns empty hubs for an empty entry list", () => {
    const pages = buildAllPlatformPages([]);
    expect(pages).toHaveLength(6);
    expect(pages.every((page) => page.count === 0)).toBe(true);
  });
});

describe("per-platform filtering", () => {
  const customCompatibility = (platform: string): ContentEntry =>
    skill({
      slug: `${platform.toLowerCase().replace(/\s+/g, "-")}-only`,
      title: `${platform} Only`,
      platformCompatibility: [
        {
          platform,
          supportLevel: "native-skill",
          installPath: `install/${platform}`,
          verifiedAt: "2026-03-01",
        },
      ],
    });

  it.each(platformPageDefinitions)(
    "includes only $platform-compatible skills on the $slug hub",
    (definition: PlatformPageDefinition) => {
      const matching = customCompatibility(definition.platform);
      const other = customCompatibility(
        definition.platform === "Claude" ? "Codex" : "Claude",
      );
      const page = buildPlatformPage(definition, [matching, other]);
      expect(page.count).toBe(1);
      expect(page.items[0]?.title).toBe(`${definition.platform} Only`);
    },
  );
});

describe("install metadata defaults", () => {
  it("uses registry default install paths for Claude skills", () => {
    const page = buildPlatformPage(findPlatformPageDefinition("claude")!, [
      skill({ slug: "defaults", title: "Defaults", verifiedAt: "2026-04-01" }),
    ]);
    expect(page.items[0]?.installPath).toContain(".claude/skills");
    expect(page.items[0]?.verifiedAt).toBe("2026-04-01");
  });

  it("uses registry default install paths for Codex skills", () => {
    const page = buildPlatformPage(findPlatformPageDefinition("codex")!, [
      skill({ slug: "codex-default", title: "Codex Default" }),
    ]);
    expect(page.items[0]?.installPath).toContain(".agents/skills");
  });

  it("uses registry default install paths for Windsurf skills", () => {
    const page = buildPlatformPage(findPlatformPageDefinition("windsurf")!, [
      skill({ slug: "wind", title: "Wind" }),
    ]);
    expect(page.items[0]?.installPath).toContain(".windsurf/skills");
  });

  it("uses registry default install paths for Gemini skills", () => {
    const page = buildPlatformPage(findPlatformPageDefinition("gemini")!, [
      skill({ slug: "gem", title: "Gem" }),
    ]);
    expect(page.items[0]?.installPath).toContain(".gemini/skills");
  });

  it("includes adapter metadata for default Cursor compatibility", () => {
    const page = buildPlatformPage(
      findPlatformPageDefinition("cursor-rules")!,
      [skill({ slug: "cursor-default", title: "Cursor Default" })],
    );
    expect(page.items[0]?.supportLevel).toBe("adapter");
    expect(page.items[0]?.adapterPath).toContain("skill-adapters/cursor");
  });

  it("marks Generic AGENTS compatibility as manual-context", () => {
    const page = buildPlatformPage(
      findPlatformPageDefinition("agents-context")!,
      [skill({ slug: "agents", title: "Agents" })],
    );
    expect(page.items[0]?.supportLevel).toBe("manual-context");
    expect(page.items[0]?.installPath).toContain("AGENTS.md");
  });
});

describe("large catalog aggregation", () => {
  it("counts and sorts a large mixed catalog deterministically", () => {
    const skills = Array.from({ length: 30 }, (_, index) =>
      skill({
        slug: `skill-${index}`,
        title: `Skill ${String(index).padStart(2, "0")}`,
        tags: index % 2 === 0 ? ["automation"] : ["docs"],
      }),
    );
    const noise = Array.from({ length: 10 }, (_, index) =>
      mcpEntry({ slug: `mcp-${index}`, title: `MCP ${index}` }),
    );
    const page = buildPlatformPage(findPlatformPageDefinition("claude")!, [
      ...skills,
      ...noise,
    ]);
    expect(page.count).toBe(30);
    expect(page.items[0]?.title).toBe("Skill 00");
    expect(page.items.at(-1)?.title).toBe("Skill 29");
    expect(
      page.items.every((item) => item.url === `/skills/${item.slug}`),
    ).toBe(true);
  });

  it("builds all hubs with consistent totals for a shared catalog", () => {
    const catalog = [
      skill({ slug: "a", title: "Alpha" }),
      skill({ slug: "b", title: "Bravo" }),
      skill({ slug: "c", title: "Charlie" }),
    ];
    const pages = buildAllPlatformPages(catalog);
    const claude = pages.find((page) => page.slug === "claude");
    const codex = pages.find((page) => page.slug === "codex");
    expect(claude?.count).toBe(3);
    expect(codex?.count).toBe(3);
    expect(claude?.items.map((item) => item.slug)).toEqual(
      codex?.items.map((item) => item.slug),
    );
  });
});

describe("edge cases", () => {
  it("treats missing tags as an empty array", () => {
    const page = buildPlatformPage(findPlatformPageDefinition("claude")!, [
      skill({ slug: "no-tags", title: "No Tags", tags: undefined }),
    ]);
    expect(page.items[0]?.tags).toEqual([]);
  });

  it("keeps duplicate skill slugs when the catalog repeats entries", () => {
    const duplicate = skill({ slug: "dup", title: "Dup" });
    const page = buildPlatformPage(findPlatformPageDefinition("codex")!, [
      duplicate,
      duplicate,
    ]);
    expect(page.count).toBe(2);
    expect(page.items.every((item) => item.slug === "dup")).toBe(true);
  });

  it("does not mutate the input definition or entries", () => {
    const definition = { ...findPlatformPageDefinition("gemini")! };
    const entries = [skill({ slug: "frozen", title: "Frozen" })];
    const frozenDefinition = JSON.stringify(definition);
    const frozenEntries = JSON.stringify(entries);
    buildPlatformPage(definition, entries);
    expect(JSON.stringify(definition)).toBe(frozenDefinition);
    expect(JSON.stringify(entries)).toBe(frozenEntries);
  });

  it("returns null adapterPath when compatibility has no adapter", () => {
    const page = buildPlatformPage(findPlatformPageDefinition("claude")!, [
      skill({ slug: "native", title: "Native" }),
    ]);
    expect(page.items[0]?.adapterPath).toBeUndefined();
  });
});

describe("definition copy invariants", () => {
  it.each(platformPageDefinitions)(
    "$slug description mentions skills or adapters",
    (definition) => {
      const hay =
        `${definition.description} ${definition.seoDescription}`.toLowerCase();
      expect(
        hay.includes("skill") ||
          hay.includes("adapter") ||
          hay.includes("agents"),
      ).toBe(true);
    },
  );

  it.each(platformPageDefinitions)(
    "$slug SEO title is unique across hubs",
    (definition) => {
      const duplicates = platformPageDefinitions.filter(
        (item) => item.seoTitle === definition.seoTitle,
      );
      expect(duplicates).toHaveLength(1);
    },
  );

  it.each(platformPageDefinitions)("$slug slug is kebab-case", (definition) => {
    expect(definition.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  });
});

describe("title collation", () => {
  it("uses locale-aware alphabetical ordering for mixed-case titles", () => {
    const page = buildPlatformPage(findPlatformPageDefinition("codex")!, [
      skill({ slug: "a", title: "alpha" }),
      skill({ slug: "b", title: "Beta" }),
      skill({ slug: "c", title: "charlie" }),
    ]);
    expect(page.items.map((item) => item.title)).toEqual([
      "alpha",
      "Beta",
      "charlie",
    ]);
  });

  it("places numeric-leading titles before alphabetic titles", () => {
    const page = buildPlatformPage(findPlatformPageDefinition("windsurf")!, [
      skill({ slug: "z", title: "Zulu" }),
      skill({ slug: "1", title: "1st Skill" }),
      skill({ slug: "a", title: "Alpha" }),
    ]);
    const titles = page.items.map((item) => item.title);
    expect(titles.indexOf("1st Skill")).toBeLessThan(titles.indexOf("Alpha"));
  });
});

describe("verifiedAt propagation", () => {
  it("uses verifiedAt when present on the skill entry", () => {
    const page = buildPlatformPage(findPlatformPageDefinition("gemini")!, [
      skill({ slug: "v", title: "Verified", verifiedAt: "2026-05-10" }),
    ]);
    expect(page.items[0]?.verifiedAt).toBe("2026-05-10");
  });

  it("falls back to dateAdded for default compatibility rows", () => {
    const page = buildPlatformPage(findPlatformPageDefinition("claude")!, [
      skill({ slug: "dated", title: "Dated", dateAdded: "2026-06-01" }),
    ]);
    expect(page.items[0]?.verifiedAt).toBe("2026-06-01");
  });

  it("prefers explicit verifiedAt over dateAdded", () => {
    const page = buildPlatformPage(findPlatformPageDefinition("codex")!, [
      skill({
        slug: "both",
        title: "Both",
        verifiedAt: "2026-07-01",
        dateAdded: "2026-01-01",
      }),
    ]);
    expect(page.items[0]?.verifiedAt).toBe("2026-07-01");
  });
});

describe("multi-definition build matrix", () => {
  const catalog = [
    skill({ slug: "shared", title: "Shared Skill", tags: ["shared"] }),
  ];

  it.each(platformPageDefinitions)(
    "builds non-empty $slug page for default-compatible skills",
    (definition) => {
      const page = buildPlatformPage(definition, catalog);
      expect(page.slug).toBe(definition.slug);
      expect(page.platform).toBe(definition.platform);
      expect(page.count).toBeGreaterThanOrEqual(1);
      expect(page.items[0]?.slug).toBe("shared");
    },
  );
});

describe("url and slug shape", () => {
  it("builds skill URLs from entry slugs", () => {
    const page = buildPlatformPage(findPlatformPageDefinition("claude")!, [
      skill({ slug: "my-skill", title: "My Skill" }),
    ]);
    expect(page.items[0]?.url).toBe("/skills/my-skill");
  });

  it.each(["simple", "with-dashes", "numbers-123"])(
    "accepts slug %s in item URLs",
    (slug) => {
      const page = buildPlatformPage(findPlatformPageDefinition("codex")!, [
        skill({ slug, title: slug }),
      ]);
      expect(page.items[0]?.url).toBe(`/skills/${slug}`);
    },
  );
});

describe("integration snapshot", () => {
  it("produces a stable multi-platform page bundle", () => {
    const catalog = [
      skill({
        slug: "writer",
        title: "Writer",
        cardDescription: "Writing workflows",
        tags: ["writing"],
        dateAdded: "2026-01-15",
      }),
      skill({
        slug: "reviewer",
        title: "Reviewer",
        platformCompatibility: [
          {
            platform: "Cursor",
            supportLevel: "adapter",
            installPath: ".cursor/rules/reviewer.mdc",
            adapterPath: "/data/skill-adapters/cursor/reviewer.mdc",
            verifiedAt: "2026-01-20",
          },
        ],
      }),
      mcpEntry({ slug: "ignored", title: "Ignored MCP" }),
    ];

    const pages = buildAllPlatformPages(catalog);
    const claude = pages.find((page) => page.slug === "claude");
    const cursor = pages.find((page) => page.slug === "cursor-rules");
    const agents = pages.find((page) => page.slug === "agents-context");

    expect(claude?.items).toEqual([
      expect.objectContaining({
        slug: "writer",
        description: "Writing workflows",
        tags: ["writing"],
      }),
    ]);
    expect(cursor?.count).toBe(2);
    expect(cursor?.items.map((item) => item.slug).sort()).toEqual([
      "reviewer",
      "writer",
    ]);
    expect(agents?.count).toBe(1);
    expect(agents?.items[0]?.slug).toBe("writer");
  });
});
