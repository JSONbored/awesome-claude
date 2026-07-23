import { describe, expect, it } from "vitest";

import {
  asCategory,
  buildEntryFromRegistry,
  compactText,
  inferInstallType,
  inferPlatforms,
  inferSource,
  inferTrust,
  listText,
  normalizeClaimStatus,
  normalizeCompatibility,
  normalizeItems,
  normalizeRelatedEntries,
  normalizeRepoStats,
  normalizeSupportLevel,
  type RegistryEntry,
} from "../apps/web/src/lib/entry-normalize-lib";
import { installRiskLevel } from "../apps/web/src/lib/trust-lib";

function baseEntry(overrides: Partial<RegistryEntry> = {}): RegistryEntry {
  return {
    category: "skills",
    slug: "fixture-skill",
    title: "Fixture Skill",
    description: "Fixture entry for entry-normalize lib coverage.",
    tags: [],
    ...overrides,
  };
}

function attribution(entry: RegistryEntry = baseEntry()) {
  const author =
    entry.author ?? entry.submittedBy ?? entry.brandName ?? "Unknown";
  return {
    author,
    authorProfileUrl: entry.authorProfileUrl,
    submittedByUrl: entry.submittedByUrl ?? entry.authorProfileUrl,
  };
}

describe("entry normalize lib helpers", () => {
  describe("normalizeSupportLevel", () => {
    it("maps aliases and defaults unknown values to manual-context", () => {
      expect(normalizeSupportLevel("full")).toBe("native-skill");
      expect(normalizeSupportLevel("partial")).toBe("adapter");
      expect(normalizeSupportLevel("manual")).toBe("manual-context");
      expect(normalizeSupportLevel("none")).toBe("unsupported");
      expect(normalizeSupportLevel("Native_Skill")).toBe("native-skill");
      expect(normalizeSupportLevel("Manual Context")).toBe("manual-context");
      expect(normalizeSupportLevel("constructor")).toBe("manual-context");
      expect(normalizeSupportLevel("experimental-beta")).toBe("manual-context");
      expect(normalizeSupportLevel("")).toBe("manual-context");
      expect(normalizeSupportLevel(null)).toBe("manual-context");
    });
  });

  describe("asCategory", () => {
    it("keeps known categories and falls back to tools", () => {
      expect(asCategory("mcp")).toBe("mcp");
      expect(asCategory("hooks")).toBe("hooks");
      expect(asCategory("unknown-category")).toBe("tools");
    });
  });

  describe("compactText and listText", () => {
    it("normalizes strings and arrays", () => {
      expect(compactText("  note  ")).toBe("note");
      expect(compactText("   ")).toBeUndefined();
      expect(compactText([" first ", "", "second "])).toBe(" first \nsecond ");
      expect(compactText(["", "   "])).toBeUndefined();
      expect(compactText(42)).toBeUndefined();

      expect(listText(" one ")).toEqual(["one"]);
      expect(listText([" a ", "b"])).toEqual([" a ", "b"]);
      expect(listText([])).toBeUndefined();
    });
  });

  describe("inferPlatforms", () => {
    it("collects platforms from compatibility, trust signals, and tested lists", () => {
      const platforms = inferPlatforms(
        baseEntry({
          platformCompatibility: [{ platform: "cursor", support: "adapter" }],
          trustSignals: { platforms: ["windsurf"] },
          testedPlatforms: ["zed"],
        }),
      );
      expect(platforms).toEqual(
        expect.arrayContaining(["cursor", "windsurf", "zed", "claude-code"]),
      );
    });

    it("infers platforms from tags and category defaults", () => {
      expect(inferPlatforms(baseEntry({ category: "mcp", tags: [] }))).toEqual(
        expect.arrayContaining(["claude-code", "claude-desktop"]),
      );
      expect(
        inferPlatforms(baseEntry({ category: "tools", tags: ["raycast"] })),
      ).toEqual(expect.arrayContaining(["raycast", "cli"]));
      expect(
        inferPlatforms(
          baseEntry({
            category: "guides",
            keywords: ["windsurf", "zed"],
            tags: ["cursor", "codex", "gemini", "aider", "continue"],
          }),
        ),
      ).toEqual(
        expect.arrayContaining([
          "claude-code",
          "cursor",
          "codex",
          "gemini",
          "windsurf",
          "zed",
          "aider",
          "continue",
        ]),
      );
      expect(
        inferPlatforms(baseEntry({ category: "collections", tags: [] })),
      ).toEqual(["claude-code"]);
      expect(
        inferPlatforms(
          baseEntry({
            platformCompatibility: [
              { platform: "invalid-platform", support: "full" },
            ],
            trustSignals: { platforms: ["also-invalid"] },
            testedPlatforms: ["nope"],
          }),
        ),
      ).toEqual(["claude-code"]);
    });
  });

  describe("inferInstallType", () => {
    it("classifies install surfaces in priority order", () => {
      expect(
        inferInstallType(
          baseEntry({ downloadUrl: "https://example.com/pkg.zip" }),
        ),
      ).toBe("package");
      expect(
        inferInstallType(baseEntry({ installCommand: "npm i -g tool" })),
      ).toBe("cli");
      expect(inferInstallType(baseEntry({ configSnippet: "{}" }))).toBe(
        "config",
      );
      expect(inferInstallType(baseEntry({ copySnippet: "copy me" }))).toBe(
        "copy",
      );
      expect(inferInstallType(baseEntry({ body: "docs body" }))).toBe("copy");
      expect(inferInstallType(baseEntry())).toBe("manual");
    });
  });

  describe("inferSource and inferTrust", () => {
    it("derives source status from registry evidence", () => {
      expect(inferSource(baseEntry({ downloadTrust: "first-party" }))).toBe(
        "first-party",
      );
      expect(
        inferSource(
          baseEntry({
            trustSignals: { firstPartyEditorial: true },
          }),
        ),
      ).toBe("first-party");
      expect(
        inferSource(
          baseEntry({ githubUrl: "https://github.com/example/repo" }),
        ),
      ).toBe("source-backed");
      expect(
        inferSource(
          baseEntry({ documentationUrl: "https://docs.example.com" }),
        ),
      ).toBe("external");
      expect(inferSource(baseEntry())).toBe("unverified");
    });

    it("derives trust posture from verification and notes", () => {
      const trusted = baseEntry({
        packageVerified: true,
        downloadSha256: "deadbeef",
      });
      expect(inferTrust(trusted, inferSource(trusted))).toBe("trusted");

      const editorial = baseEntry({
        trustSignals: { firstPartyEditorial: true },
      });
      expect(inferTrust(editorial, inferSource(editorial))).toBe("trusted");

      expect(inferTrust(baseEntry(), "unverified")).toBe("limited");

      // Risk-bearing category with no safety/privacy notes → blocked.
      // This is the only path that produces TrustLevel "blocked".
      const blocked = baseEntry({
        category: "mcp",
        githubUrl: "https://github.com/example/repo",
      });
      expect(inferTrust(blocked, inferSource(blocked))).toBe("blocked");

      // Same risk category with mitigating notes stays at review.
      const reviewed = baseEntry({
        category: "mcp",
        githubUrl: "https://github.com/example/repo",
        safetyNotes: "Runs locally only.",
      });
      expect(inferTrust(reviewed, inferSource(reviewed))).toBe("review");

      // Privacy notes alone also clear the blocked gate.
      const privacyNoted = baseEntry({
        category: "hooks",
        githubUrl: "https://github.com/example/hooks",
        privacyNotes: "Reads local git config only.",
      });
      expect(inferTrust(privacyNoted, inferSource(privacyNoted))).toBe(
        "review",
      );

      // Non-risk categories without notes are review, not blocked.
      const guide = baseEntry({
        category: "guides",
        githubUrl: "https://github.com/example/guide",
      });
      expect(inferTrust(guide, inferSource(guide))).toBe("review");
    });

    it("can produce blocked for every risk-bearing category without notes", () => {
      for (const category of [
        "mcp",
        "hooks",
        "skills",
        "commands",
        "statuslines",
      ] as const) {
        const entry = baseEntry({
          category,
          githubUrl: "https://github.com/example/risk",
        });
        expect(inferTrust(entry, inferSource(entry))).toBe("blocked");
      }
    });

    it("unblocks installRiskLevel high via normalize → blocked cascade", () => {
      const registry = baseEntry({
        category: "mcp",
        slug: "blocked-fixture",
        title: "Blocked Fixture MCP",
        githubUrl: "https://github.com/example/blocked-fixture",
      });
      const normalized = buildEntryFromRegistry(
        registry,
        attribution(registry),
      );
      expect(normalized.trust).toBe("blocked");
      expect(installRiskLevel(normalized)).toBe("high");
    });
  });

  describe("normalizeClaimStatus", () => {
    it("accepts verified and pending and defaults to unclaimed", () => {
      expect(normalizeClaimStatus("VERIFIED")).toBe("verified");
      expect(normalizeClaimStatus("pending")).toBe("pending");
      expect(normalizeClaimStatus("bogus")).toBe("unclaimed");
    });
  });

  describe("normalizeCompatibility", () => {
    it("skips unknown platforms and preserves install metadata", () => {
      expect(
        normalizeCompatibility(
          baseEntry({
            platformCompatibility: [
              {
                platform: "claude-code",
                supportLevel: "full",
                installPath: "/skills",
                adapterPath: "/adapters",
                verifiedAt: "2026-01-01",
              },
              {
                platform: "cursor",
                support: "partial",
              },
              {
                platform: "windsurf",
              },
              { platform: "not-a-platform", support: "full" },
            ],
          }),
        ),
      ).toEqual([
        {
          platform: "claude-code",
          support: "native-skill",
          installPath: "/skills",
          adapterPath: "/adapters",
          verifiedAt: "2026-01-01",
        },
        {
          platform: "cursor",
          support: "adapter",
        },
        {
          platform: "windsurf",
          support: "manual-context",
        },
      ]);
    });
  });

  describe("normalizeItems", () => {
    it("normalizes string and object collection members", () => {
      expect(normalizeItems(["skills/a", "hooks/b"])).toEqual([
        "skills/a",
        "hooks/b",
      ]);
      expect(
        normalizeItems([
          { category: "mcp", slug: "server" },
          { category: "tools", slug: "cli" },
        ]),
      ).toEqual(["mcp/server", "tools/cli"]);
      expect(normalizeItems([{ category: "mcp" }])).toBeUndefined();
      expect(normalizeItems("nope")).toBeUndefined();
    });
  });

  describe("normalizeRepoStats", () => {
    it("merges legacy github fields and preserves labels", () => {
      expect(
        normalizeRepoStats(
          baseEntry({
            githubStars: 12,
            githubForks: 3,
            repoUpdatedAt: "2026-01-02",
            repoUrl: "https://github.com/example/repo",
          }),
        ),
      ).toEqual({
        url: "https://github.com/example/repo",
        stars: 12,
        forks: 3,
        updatedAt: "2026-01-02",
        appliesTo: "listing_source_repo",
        label: "Source repo",
      });

      expect(
        normalizeRepoStats(
          baseEntry({
            repoStats: {
              repository: "example/repo",
              stars: 99,
              appliesTo: "upstream_reference",
              label: "Upstream",
            },
          }),
        ),
      ).toMatchObject({
        repository: "example/repo",
        stars: 99,
        appliesTo: "upstream_reference",
        label: "Upstream",
      });

      expect(normalizeRepoStats(baseEntry())).toBeUndefined();

      expect(
        normalizeRepoStats(
          baseEntry({
            repoStats: {
              stars: "many" as unknown as number,
              forks: "few" as unknown as number,
              updatedAt: "",
              url: "",
            },
          }),
        ),
      ).toMatchObject({
        stars: undefined,
        forks: undefined,
        updatedAt: undefined,
        appliesTo: "none",
      });
    });
  });

  describe("normalizeRelatedEntries", () => {
    it("whitelists relation types and drops invalid rows", () => {
      const relations = [
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
        "bogus",
      ] as const;

      const rows = normalizeRelatedEntries(
        relations.map((relation, index) => ({
          category: "skills",
          slug: `entry-${index}`,
          title: `Entry ${index}`,
          relation,
          score: index,
          reasons: [`reason-${index}`],
          url: `/custom/${index}`,
        })),
      );

      expect(rows).toHaveLength(relations.length);
      for (const [index, relation] of relations.entries()) {
        expect(rows?.[index]).toMatchObject({
          key: `skills:entry-${index}`,
          relation: relation === "bogus" ? "related" : relation,
          score: index,
          reasons: [`reason-${index}`],
          url: `/custom/${index}`,
        });
      }

      expect(
        normalizeRelatedEntries([
          {
            key: "custom:key",
            category: "mcp",
            slug: "server",
            title: "Server",
            relation: "extends",
          },
          {
            slug: "default-category",
            title: "Default Category",
          },
          {
            category: "skills",
            title: "No Slug Field",
          },
          {
            category: "skills",
            slug: "default-url",
            title: "Default URL",
            score: "high" as unknown as number,
            reasons: "not-an-array" as unknown as string[],
          },
          { category: "mcp", slug: "missing-title", title: "" },
        ]),
      ).toEqual([
        expect.objectContaining({
          key: "custom:key",
          relation: "extends",
        }),
        expect.objectContaining({
          category: "tools",
          slug: "default-category",
        }),
        expect.objectContaining({
          key: "skills:default-url",
          score: 0,
          reasons: [],
          url: "/entry/skills/default-url",
        }),
      ]);

      expect(normalizeRelatedEntries([])).toBeUndefined();
    });
  });
});

describe("buildEntryFromRegistry", () => {
  it("assembles normalized entry fields with attribution overrides", () => {
    const entry = buildEntryFromRegistry(
      baseEntry({
        category: "hooks",
        trigger: "PreToolUse",
        scriptLanguage: "bash",
        scriptBody: "echo hello",
        allowedTools: [" Bash ", ""],
        skillType: "capability-pack",
        skillLevel: "expert",
        verificationStatus: "production",
        retrievalSources: ["docs"],
        installationOrder: ["install", "configure"],
        contentUpdatedAt: "2026-03-01T12:00:00.000Z",
        claimStatus: "verified",
        relatedEntries: [
          {
            category: "mcp",
            slug: "related",
            title: "Related MCP",
            relation: "works-with",
          },
        ],
      }),
      {
        author: "Fixture Author",
        authorProfileUrl: "https://github.com/fixture",
        submittedByUrl: "https://github.com/submitter",
      },
    );

    expect(entry).toMatchObject({
      category: "hooks",
      author: "Fixture Author",
      authorProfileUrl: "https://github.com/fixture",
      submittedByUrl: "https://github.com/submitter",
      trigger: "PreToolUse",
      scriptLanguage: "bash",
      scriptBody: "echo hello",
      allowedTools: [" Bash "],
      skillType: "capability-pack",
      skillLevel: "expert",
      verificationStatus: "production",
      retrievalSources: ["docs"],
      installationOrder: ["install", "configure"],
      dateAdded: "2026-03-01",
      claimStatus: "verified",
      claimed: true,
      // This fixture has no `reviewedBy`, so there is no named maintainer
      // sign-off to report.
      reviewed: false,
      harness: ["claude-code"],
    });
    expect(entry.relatedEntries).toEqual([
      expect.objectContaining({
        key: "mcp:related",
        relation: "works-with",
      }),
    ]);
  });

  it("copies brandVerifiedAt/brandColors from the registry entry", () => {
    const entry = buildEntryFromRegistry(
      baseEntry({
        brandName: "Example",
        brandVerifiedAt: "2026-05-01T00:00:00.000Z",
        brandColors: ["#101010", "#f0f0f0"],
      }),
      attribution(),
    );

    expect(entry.brandVerifiedAt).toBe("2026-05-01T00:00:00.000Z");
    expect(entry.brandColors).toEqual(["#101010", "#f0f0f0"]);
  });

  it("rejects invalid hook triggers and script languages", () => {
    const entry = buildEntryFromRegistry(
      baseEntry({
        category: "hooks",
        trigger: "NotARealTrigger",
        scriptLanguage: "powershell",
      }),
      attribution(),
    );

    expect(entry.trigger).toBeUndefined();
    expect(entry.scriptLanguage).toBeUndefined();

    const supported = buildEntryFromRegistry(
      baseEntry({
        category: "hooks",
        trigger: "Stop",
        scriptLanguage: "fish",
        commandSyntax: 123 as unknown as string,
      }),
      attribution(),
    );
    expect(supported.trigger).toBe("Stop");
    expect(supported.scriptLanguage).toBe("fish");
    expect(supported.commandSyntax).toBeUndefined();

    expect(
      buildEntryFromRegistry(
        baseEntry({ category: "commands", commandSyntax: "/fix" }),
        attribution(),
      ).commandSyntax,
    ).toBe("/fix");

    for (const language of ["python", "javascript", "other"] as const) {
      expect(
        buildEntryFromRegistry(
          baseEntry({ category: "hooks", scriptLanguage: language }),
          attribution(),
        ).scriptLanguage,
      ).toBe(language);
    }
  });

  it("normalizes optional metadata and note lists", () => {
    const entry = buildEntryFromRegistry(
      baseEntry({
        tags: undefined,
        keywords: ["search"],
        privacyNotes: [" keeps local ", ""],
        skillType: "general",
        skillLevel: "foundational",
        verificationStatus: "validated",
        packageVerified: true,
        reviewedAt: "2026-02-01",
        repoUrl: null,
        githubUrl: "https://github.com/example/repo",
      }),
      attribution(),
    );

    expect(entry.keywords).toEqual(["search"]);
    expect(entry.privacyNotesList).toEqual([" keeps local "]);
    expect(entry.skillType).toBe("general");
    expect(entry.skillLevel).toBe("foundational");
    expect(entry.verificationStatus).toBe("validated");
    // `packageVerified` + `reviewedAt` are automated signals, not a maintainer
    // sign-off, so they must not satisfy `reviewed`.
    expect(entry.reviewed).toBe(false);
    expect(entry.repoUrl).toBeUndefined();
    expect(entry.sourceUrl).toBe("https://github.com/example/repo");
  });

  it("only reports reviewed for an actual named reviewer", () => {
    // `contentUpdatedAt` is a build-time stamp the content pipeline sets when
    // frontmatter omits one — no human reviewed anything, so the
    // "Maintainer-reviewed" claim must not be satisfied by it.
    const buildStampOnly = buildEntryFromRegistry(
      baseEntry({ contentUpdatedAt: "2026-02-01T00:00:00.000Z" }),
      attribution(),
    );
    expect(buildStampOnly.reviewed).toBe(false);

    // Automated package verification is likewise not a maintainer sign-off.
    const packageVerifiedOnly = buildEntryFromRegistry(
      baseEntry({ packageVerified: true }),
      attribution(),
    );
    expect(packageVerifiedOnly.reviewed).toBe(false);

    const namedReviewer = buildEntryFromRegistry(
      baseEntry({ reviewedBy: "Maintainer Name" }),
      attribution(),
    );
    expect(namedReviewer.reviewed).toBe(true);
  });

  it("uses copy payload precedence and source url fallbacks", () => {
    const withCopy = buildEntryFromRegistry(
      baseEntry({
        copySnippet: "copy",
        body: "body",
        usageSnippet: "usage",
        websiteUrl: "https://example.com",
      }),
      attribution(),
    );
    expect(withCopy.fullCopy).toBe("copy");
    expect(withCopy.sourceUrl).toBe("https://example.com");

    const withDocs = buildEntryFromRegistry(
      baseEntry({
        documentationUrl: "https://docs.example.com/guide",
      }),
      attribution(),
    );
    expect(withDocs.sourceUrl).toBe("https://docs.example.com/guide");
  });
});
