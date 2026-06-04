import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  buildContentQualityArtifact,
  buildContentPromptArtifact,
  buildCategoryDistributionFeed,
  buildDirectoryEntries,
  buildDistributionFeedIndex,
  buildEntryTrustSignals,
  buildMcpRegistryFeed,
  buildPlatformDistributionFeed,
  buildPluginExportFeed,
  buildCursorSkillAdapter,
  buildJsonLdSnapshots,
  buildRegistryChangelogFeed,
  buildEntryRelations,
  buildRegistryRelationGraph,
  buildRegistryTrustReport,
  buildSourceHealthReport,
  buildEntrySourceHealth,
  SOURCE_HEALTH_REPORT_SCHEMA_VERSION,
  buildReadOnlyEcosystemFeed,
  buildRaycastEnvelope,
  buildRaycastDetailMarkdown,
  parseAbbreviatedCount,
  renderEntryLlms,
  RAYCAST_COPY_PREVIEW_LIMIT,
  buildSearchEntries,
  brandAssetProxyUrl,
  brandfetchLogoUrl,
  detectKnownBrand,
  getCopyText,
  isAllowedBrandAssetUrl,
  truncateText,
} from "@heyclaude/registry";
import {
  buildContentEntryFromMdx,
  parseGitHubRepo,
} from "@heyclaude/registry/content-builder";

import {
  dataRoot,
  loadContentEntries,
  loadDirectoryEntries,
  loadSearchEntries,
  readDataJson,
  repoRoot,
} from "./helpers/registry-fixtures";

const sharedTmpHookLogPathPattern =
  /(^|[^A-Za-z0-9_$\/{.-])(\/tmp\/[A-Za-z0-9_.$\/{}-]*(?:debug|startup)[A-Za-z0-9_.$\/{}-]*)/gi;
const nonPredictableTmpHookLogPathPattern = /\$\$|\$RANDOM|\$\{RANDOM\}|X{3,}/i;

function findPredictableSharedTmpHookLogPaths(scriptBody: string) {
  const paths = new Set<string>();
  for (const match of scriptBody.matchAll(sharedTmpHookLogPathPattern)) {
    const tmpPath = match[2];
    if (!tmpPath || nonPredictableTmpHookLogPathPattern.test(tmpPath)) {
      continue;
    }
    paths.add(tmpPath);
  }
  return [...paths];
}

function artifactSize(relativePath: string) {
  return fs.statSync(path.join(dataRoot, relativePath)).size;
}

function artifactTreeSize(relativePath: string) {
  const target = path.join(dataRoot, relativePath);
  if (!fs.existsSync(target)) return 0;
  const stat = fs.statSync(target);
  if (stat.isFile()) return stat.size;
  return fs
    .readdirSync(target, { withFileTypes: true })
    .reduce(
      (sum, item) =>
        sum +
        artifactTreeSize(
          path.join(relativePath, item.name).replaceAll(path.sep, "/"),
        ),
      0,
    );
}

describe("registry artifacts", () => {
  const contentEntries = loadContentEntries();
  const directoryEntries = loadDirectoryEntries();
  const searchEntries = loadSearchEntries();
  const raycastPayload = readDataJson<{
    schemaVersion: number;
    kind: string;
    count: number;
    entries: any[];
  }>("raycast-index.json");
  const manifest = readDataJson<{
    schemaVersion: number;
    kind: string;
    totalEntries: number;
    artifacts: Record<string, string>;
    routes: Array<{ key: string; canonicalUrl: string; llmsUrl: string }>;
    qualitySummary: Record<string, unknown>;
    trustSummary: Record<string, unknown>;
    artifactContracts: Record<
      string,
      { path: string; type: "json" | "text"; sha256: string }
    >;
  }>("registry-manifest.json");
  const qualityPayload = readDataJson<{ schemaVersion: number; count: number }>(
    "content-quality-report.json",
  );
  const qualityPromptsPayload = readDataJson<{
    schemaVersion: number;
    count: number;
  }>("content-quality-prompts.json");
  const jsonLdSnapshotsPayload = readDataJson<{
    schemaVersion: number;
    count: number;
  }>("jsonld-snapshots.json");
  const trustReportPayload = readDataJson<{
    schemaVersion: number;
    kind: string;
    count: number;
    summary: {
      brandedCount: number;
      sourceAvailableCount: number;
      checksumPresentCount: number;
      claimedOrReviewedPercent: number;
      safetyNotesCount: number;
      privacyNotesCount: number;
      firstPartyPackageCount: number;
      recommendedFixCount: number;
      entriesNeedingAttention: number;
    };
    queues: Record<string, any[]>;
    entries: any[];
  }>("registry-trust-report.json");

  function renderEntryLlmsByKey(key: string) {
    const entry = contentEntries.find(
      (item) => `${item.category}:${item.slug}` === key,
    );
    expect(entry).toBeTruthy();
    return renderEntryLlms(entry!);
  }

  it("parses abbreviated Shields fallback counts", () => {
    expect(parseAbbreviatedCount("987")).toBe(987);
    expect(parseAbbreviatedCount("1.2k")).toBe(1200);
    expect(parseAbbreviatedCount("3.4m")).toBe(3_400_000);
    expect(parseAbbreviatedCount("2.5b")).toBe(2_500_000_000);
    expect(parseAbbreviatedCount("")).toBeNull();
    expect(parseAbbreviatedCount("n/a")).toBeNull();
    expect(parseAbbreviatedCount("1.2t")).toBeNull();
    expect(parseAbbreviatedCount("1.2k stars")).toBeNull();
    expect(parseAbbreviatedCount("1.2.3k")).toBeNull();
    expect(parseAbbreviatedCount("1.")).toBeNull();
    expect(parseAbbreviatedCount(null)).toBeNull();
  });

  it("does not publish the retired full content corpus JSON", () => {
    expect(fs.existsSync(path.join(dataRoot, "content-index.json"))).toBe(
      false,
    );
    expect(manifest.artifacts.content).toBeUndefined();
  });

  it("keeps compact public indexes envelope-versioned", () => {
    const directoryPayload = readDataJson<{
      schemaVersion: number;
      kind: string;
      count: number;
    }>("directory-index.json");
    const searchPayload = readDataJson<{
      schemaVersion: number;
      kind: string;
      count: number;
    }>("search-index.json");

    expect(Array.isArray(directoryPayload)).toBe(false);
    expect(Array.isArray(searchPayload)).toBe(false);
    expect(Array.isArray(raycastPayload)).toBe(false);
    expect(directoryPayload).toMatchObject({
      schemaVersion: 2,
      kind: "directory-index",
      count: directoryEntries.length,
    });
    expect(searchPayload).toMatchObject({
      schemaVersion: 2,
      kind: "search-index",
      count: searchEntries.length,
    });
    expect(directoryEntries.length).toBe(contentEntries.length);
    expect(searchEntries.length).toBe(contentEntries.length);
  });

  it("keeps public registry payloads within reviewable byte budgets", () => {
    const entryCount = contentEntries.length;
    expect(artifactTreeSize(".")).toBeLessThan(20_000_000);
    expect(artifactSize("directory-index.json")).toBeLessThan(1_000_000);
    expect(artifactSize("search-index.json")).toBeLessThan(750_000);
    expect(artifactSize("raycast-index.json")).toBeLessThan(500_000);
    expect(artifactSize("relation-graph.json")).toBeLessThan(
      150_000 + entryCount * 1_500,
    );
    expect(artifactTreeSize("feeds/categories")).toBeLessThan(1_250_000);
    expect(artifactTreeSize("feeds/platforms")).toBeLessThan(1_500_000);
    expect(artifactTreeSize("entries")).toBeLessThan(
      500_000 + entryCount * 17_500,
    );
  });

  it("keeps Atlas list data compact while preserving canonical entry detail fields", () => {
    const atlasPayload = JSON.parse(
      fs.readFileSync(
        path.join(repoRoot, "apps/web/src/generated/atlas-registry.json"),
        "utf8",
      ),
    ) as { entries: Array<Record<string, unknown>> };
    const atlasSkill = atlasPayload.entries.find(
      (entry) =>
        entry.category === "skills" &&
        entry.slug === "agent-evals-regression-gate",
    );
    const skillDetail = readDataJson<{ entry: Record<string, unknown> }>(
      "entries/skills/agent-evals-regression-gate.json",
    ).entry;

    expect(atlasSkill).toMatchObject({
      skillType: "general",
      skillLevel: "advanced",
      verificationStatus: "draft",
      testedPlatforms: expect.arrayContaining(["Claude", "Codex"]),
    });
    expect(atlasSkill).not.toHaveProperty("body");
    expect(atlasSkill).not.toHaveProperty("sections");
    expect(atlasSkill).not.toHaveProperty("copySnippet");
    expect(skillDetail).toMatchObject({
      body: expect.any(String),
      relatedEntries: expect.any(Array),
    });
    expect(atlasSkill).not.toHaveProperty("relatedEntries");
    expect(skillDetail).not.toHaveProperty("sections");
    expect(skillDetail).not.toHaveProperty("headings");
    expect(skillDetail).not.toHaveProperty("codeBlocks");
  });

  it("publishes schema-specific fields for category-aware detail rendering", () => {
    const cases = [
      [
        "entries/hooks/accessibility-checker.json",
        {
          trigger: "PostToolUse",
          body: expect.any(String),
        },
      ],
      [
        "entries/commands/cursor-rules.json",
        {
          commandSyntax: expect.any(String),
          body: expect.any(String),
        },
      ],
      [
        "entries/statuslines/accessibility-first-statusline.json",
        {
          scriptLanguage: "bash",
          body: expect.any(String),
        },
      ],
      [
        "entries/collections/agent-operator-growth-master-pack.json",
        {
          items: expect.arrayContaining([
            expect.objectContaining({ slug: expect.any(String) }),
          ]),
          installationOrder: expect.arrayContaining([expect.any(String)]),
          estimatedSetupTime: "95 minutes",
        },
      ],
      [
        "entries/tools/aider.json",
        {
          websiteUrl: "https://aider.chat",
          pricingModel: "open-source",
          disclosure: "editorial",
        },
      ],
    ] as const;

    for (const [relativePath, expected] of cases) {
      const detail = readDataJson<{ entry: Record<string, unknown> }>(
        relativePath,
      ).entry;
      expect(detail).toMatchObject(expected);
    }
  });

  it("keeps GitHub stars as optional source repository stats instead of listing popularity", () => {
    const sourceStatEntry = directoryEntries.find((entry) => entry.repoUrl);
    expect(sourceStatEntry).toBeTruthy();
    expect(sourceStatEntry).not.toHaveProperty("stars");

    if (typeof sourceStatEntry?.githubStars === "number") {
      expect(sourceStatEntry.repoStats).toMatchObject({
        appliesTo: "listing_source_repo",
        label: "Source repo",
        stars: sourceStatEntry.githubStars,
      });
    } else {
      expect(sourceStatEntry?.repoStats?.stars).toBeUndefined();
    }

    const detail = readDataJson<{ entry: Record<string, unknown> }>(
      `entries/${sourceStatEntry!.category}/${sourceStatEntry!.slug}.json`,
    ).entry;
    expect(detail).not.toHaveProperty("stars");
    if (typeof sourceStatEntry?.githubStars === "number") {
      expect(detail.repoStats).toMatchObject({
        appliesTo: "listing_source_repo",
        label: "Source repo",
        stars: sourceStatEntry.githubStars,
      });
    } else {
      expect(
        (detail.repoStats as { stars?: unknown } | undefined)?.stars,
      ).toBeUndefined();
    }
  });

  it("does not split surrogate pairs when truncating JSON-backed text", () => {
    const value = `${"a".repeat(RAYCAST_COPY_PREVIEW_LIMIT - 3)}📚 tail`;
    const truncated = truncateText(value, RAYCAST_COPY_PREVIEW_LIMIT);

    expect(truncated).toContain("...");
    expect(truncated).not.toMatch(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])/u);
    expect(truncated).not.toMatch(/(?:^|[^\uD800-\uDBFF])[\uDC00-\uDFFF]/u);
    expect(() => JSON.parse(JSON.stringify({ truncated }))).not.toThrow();
  });

  it("publishes explicit source freshness bumps in entry detail artifacts", () => {
    const detail = readDataJson<{ entry: Record<string, unknown> }>(
      "entries/skills/heyclaude-content-submission-factory.json",
    ).entry;

    expect(detail.contentUpdatedAt).toBe("2026-06-02T00:00:00-07:00");
    expect(detail.verifiedAt).toBe("2026-06-02");
  });

  it("preserves verified brand metadata across registry surfaces", () => {
    const key = "mcp:asana-mcp-server";
    const directoryEntry = directoryEntries.find(
      (entry) => `${entry.category}:${entry.slug}` === key,
    );
    const searchEntry = searchEntries.find(
      (entry) => `${entry.category}:${entry.slug}` === key,
    );
    const raycastEntry = raycastPayload.entries.find(
      (entry) => `${entry.category}:${entry.slug}` === key,
    );
    const raycastDetail = readDataJson<Record<string, unknown>>(
      "raycast/mcp/asana-mcp-server.json",
    );
    const llmsText = renderEntryLlmsByKey(key);

    expect(directoryEntry).toMatchObject({
      brandName: "Asana",
      brandDomain: "asana.com",
      brandAssetSource: "brandfetch",
    });
    expect(searchEntry).toMatchObject({
      brandName: "Asana",
      brandDomain: "asana.com",
      brandAssetSource: "brandfetch",
      downloadUrl: expect.any(String),
    });
    expect(raycastEntry).toMatchObject({
      brandName: "Asana",
      brandDomain: "asana.com",
      brandIconUrl: "/api/brand-assets/icon/asana.com",
      brandAssetSource: "brandfetch",
    });
    expect(raycastDetail).toMatchObject({
      brandName: "Asana",
      brandDomain: "asana.com",
      brandIconUrl: "/api/brand-assets/icon/asana.com",
      brandAssetSource: "brandfetch",
    });
    expect(raycastDetail).toHaveProperty("author");
    expect(String(raycastDetail.detailMarkdown)).toContain("## Trust");
    expect(llmsText).toContain("- Brand: Asana");
    expect(llmsText).toContain("- Brand domain: asana.com");

    const brandfetchUrl = brandfetchLogoUrl("asana.com", {
      clientId: "test-client",
    });
    expect(brandfetchUrl).toContain(
      "https://cdn.brandfetch.io/domain/asana.com/",
    );
    expect(isAllowedBrandAssetUrl(brandfetchUrl)).toBe(true);
    expect(brandAssetProxyUrl("asana.com")).toBe(
      "/api/brand-assets/icon/asana.com",
    );
    expect(isAllowedBrandAssetUrl(brandAssetProxyUrl("asana.com"))).toBe(true);
    expect(isAllowedBrandAssetUrl("https://example.com/logo.png")).toBe(false);
  });

  it("generates a registry trust report for brand, source, checksum, adapter, and provenance coverage", () => {
    const rebuilt = buildRegistryTrustReport(contentEntries);

    expect(trustReportPayload).toMatchObject({
      schemaVersion: 2,
      kind: "registry-trust-report",
      count: contentEntries.length,
    });
    expect(rebuilt.summary.brandedCount).toBe(
      trustReportPayload.summary.brandedCount,
    );
    expect(rebuilt.summary).toEqual(trustReportPayload.summary);
    expect(trustReportPayload.summary.sourceAvailableCount).toBeGreaterThan(0);
    expect(trustReportPayload.summary.checksumPresentCount).toBeGreaterThan(0);
    expect(trustReportPayload.summary).toHaveProperty("safetyNotesCount");
    expect(trustReportPayload.summary).toHaveProperty("privacyNotesCount");
    expect(trustReportPayload.summary).toHaveProperty("firstPartyPackageCount");
    expect(trustReportPayload.summary.recommendedFixCount).toBe(
      trustReportPayload.entries.reduce(
        (sum, entry) => sum + entry.recommendations.length,
        0,
      ),
    );
    expect(trustReportPayload.summary.entriesNeedingAttention).toBe(
      trustReportPayload.entries.filter(
        (entry) => entry.recommendations.length > 0,
      ).length,
    );
    expect(trustReportPayload.entries).toHaveLength(contentEntries.length);
    expect(trustReportPayload.entries[0]).toHaveProperty("recommendations");
    for (const entry of trustReportPayload.entries) {
      expect(Number.isNaN(Date.parse(entry.lastVerifiedAt))).toBe(false);
    }
    expect(Array.isArray(trustReportPayload.queues.missingBrand)).toBe(true);
    expect(Array.isArray(trustReportPayload.queues.missingSource)).toBe(true);
    expect(manifest.artifacts.registryTrust).toBe(
      "/data/registry-trust-report.json",
    );
    expect(manifest.trustSummary).toEqual(trustReportPayload.summary);
  });

  it("preserves UGC provenance across registry surfaces", () => {
    const key = "mcp:contrastapi-mcp-server";
    const directoryEntry = directoryEntries.find(
      (entry) => `${entry.category}:${entry.slug}` === key,
    );
    const searchEntry = searchEntries.find(
      (entry) => `${entry.category}:${entry.slug}` === key,
    );
    const raycastEntry = raycastPayload.entries.find(
      (entry) => `${entry.category}:${entry.slug}` === key,
    );
    const raycastDetail = readDataJson<Record<string, unknown>>(
      "raycast/mcp/contrastapi-mcp-server.json",
    );
    const entryDetail = readDataJson<{ entry: Record<string, unknown> }>(
      "entries/mcp/contrastapi-mcp-server.json",
    );
    const llmsText = renderEntryLlmsByKey(key);

    for (const surface of [
      directoryEntry,
      searchEntry,
      raycastEntry,
      raycastDetail,
      entryDetail.entry,
    ]) {
      expect(surface).toMatchObject({
        submittedBy: "UPinar",
        submittedByUrl: "https://github.com/UPinar",
        sourceSubmissionNumber: 304,
        sourceSubmissionUrl:
          "https://github.com/JSONbored/awesome-claude/issues/304",
        importPrNumber: 311,
        importPrUrl: "https://github.com/JSONbored/awesome-claude/pull/311",
        reviewedBy: "JSONbored",
        claimStatus: "unclaimed",
      });
    }

    expect(llmsText).toContain("- Submitted by: UPinar");
    expect(llmsText).toContain(
      "- Original submission: https://github.com/JSONbored/awesome-claude/issues/304",
    );
    expect(llmsText).toContain(
      "- Import PR: https://github.com/JSONbored/awesome-claude/pull/311",
    );

    const zyntraEntry = directoryEntries.find(
      (entry) => `${entry.category}:${entry.slug}` === "mcp:zyntra-mail",
    );
    expect(zyntraEntry).toMatchObject({
      submittedBy: "dd77ss",
      submittedByUrl: "https://github.com/dd77ss",
      sourceSubmissionNumber: 310,
      sourceSubmissionUrl:
        "https://github.com/JSONbored/awesome-claude/issues/310",
      importPrNumber: 314,
      importPrUrl: "https://github.com/JSONbored/awesome-claude/pull/314",
      reviewedBy: "JSONbored",
      claimStatus: "unclaimed",
    });
  });

  it("derives known first-party brand icons without unsafe generic fallbacks", () => {
    expect(
      detectKnownBrand({
        title: "Discord MCP Server for Claude",
        tags: ["discord", "bot"],
      }),
    ).toMatchObject({
      name: "Discord",
      domain: "discord.com",
    });

    const key = "mcp:discord-mcp-server";
    const directoryEntry = directoryEntries.find(
      (entry) => `${entry.category}:${entry.slug}` === key,
    );
    const raycastEntry = raycastPayload.entries.find(
      (entry) => `${entry.category}:${entry.slug}` === key,
    );
    const raycastDetail = readDataJson<Record<string, unknown>>(
      "raycast/mcp/discord-mcp-server.json",
    );

    expect(directoryEntry).toMatchObject({
      brandName: "Discord",
      brandDomain: "discord.com",
      brandIconUrl: "/api/brand-assets/icon/discord.com",
      brandAssetSource: "brandfetch",
    });
    expect(raycastEntry).toMatchObject({
      brandName: "Discord",
      brandDomain: "discord.com",
      brandIconUrl: "/api/brand-assets/icon/discord.com",
      brandAssetSource: "brandfetch",
    });
    expect(String(raycastDetail.detailMarkdown)).not.toContain("**Brand:**");
    expect(String(raycastDetail.detailMarkdown)).not.toContain("**Category:**");
    expect(String(raycastDetail.detailMarkdown)).not.toContain("## Links");
  });

  it("publishes factual trust signals across compact and detail artifacts", () => {
    const contentByKey = new Map(
      contentEntries.map((entry) => [`${entry.category}:${entry.slug}`, entry]),
    );

    for (const entry of directoryEntries) {
      const key = `${entry.category}:${entry.slug}`;
      const contentEntry = contentByKey.get(key);
      expect(contentEntry).toBeTruthy();
      expect(entry.trustSignals).toEqual(buildEntryTrustSignals(contentEntry!));
      expect(entry.trustSignals).toMatchObject({
        sourceStatus: expect.stringMatching(/^(available|missing)$/),
        checksumPresent: Boolean(
          contentEntry!.downloadSha256 || contentEntry!.skillPackage?.sha256,
        ),
      });
      expect(entry.trustSignals.sourceUrlCount).toBe(
        entry.trustSignals.sourceUrls.length,
      );

      const detailPayload = readDataJson<{
        trustSignals: Record<string, unknown>;
      }>(`entries/${entry.category}/${entry.slug}.json`);
      expect(detailPayload.trustSignals).toEqual(entry.trustSignals);
    }

    expect(
      directoryEntries.some((entry) => entry.trustSignals.checksumPresent),
    ).toBe(true);
    expect(
      directoryEntries.some((entry) => entry.trustSignals.adapterGenerated),
    ).toBe(true);
    for (const entry of searchEntries) {
      expect(entry.trustSignals).toMatchObject({
        lastVerifiedAt: expect.any(String),
        platforms: expect.any(Array),
        supportLevels: expect.any(Array),
      });
    }
  });

  it("derives all generated aggregate artifacts from registry builders", () => {
    const relationGraphPayload = readDataJson<Record<string, unknown>>(
      "relation-graph.json",
    );
    expect(buildDirectoryEntries(contentEntries)).toEqual(directoryEntries);
    expect(buildSearchEntries(contentEntries)).toEqual(searchEntries);
    expect(buildRaycastEnvelope(contentEntries)).toEqual(raycastPayload);
    expect(
      buildRegistryRelationGraph(contentEntries, {
        generatedAt: String(relationGraphPayload.generatedAt),
      }),
    ).toEqual(relationGraphPayload);
    expect(buildContentQualityArtifact(contentEntries)).toEqual(qualityPayload);
    expect(buildContentPromptArtifact(contentEntries)).toEqual(
      qualityPromptsPayload,
    );
    expect(
      JSON.parse(
        JSON.stringify(
          buildJsonLdSnapshots(contentEntries, {
            siteUrl: "https://heyclau.de",
            siteName: "HeyClaude",
          }),
        ),
      ),
    ).toEqual(jsonLdSnapshotsPayload);
  });

  it("does not derive comparative safety relations from safety notes alone", () => {
    const target = {
      category: "skills",
      slug: "shared-target",
      title: "Shared Workflow Target",
      description: "A shared workflow target without safety notes.",
      tags: ["shared"],
      keywords: [],
      safetyNotes: [],
    };
    const candidate = {
      category: "skills",
      slug: "shared-candidate",
      title: "Shared Workflow Candidate",
      description:
        "A shared workflow candidate with self-declared safety notes.",
      tags: ["shared"],
      keywords: [],
      safetyNotes: ["Review permissions before installing."],
      downloadTrust: "source-backed",
    };

    const [relation] = buildEntryRelations(target, [target, candidate], {
      limit: 1,
    });

    expect(relation).toMatchObject({
      key: "skills:shared-candidate",
      relation: "alternative",
    });
    expect(relation?.reasons).not.toContain("safer_metadata");
    expect(
      buildRegistryRelationGraph([target, candidate]).relationTypes,
    ).toEqual(
      expect.arrayContaining([
        "duplicate",
        "complementary",
        "same-ecosystem",
        "prerequisite",
      ]),
    );
    expect(
      buildRegistryRelationGraph([target, candidate]).relationTypes,
    ).not.toContain("safer-alternative");
  });

  it("preserves same-project relations across categories", () => {
    const repoUrl = "https://github.com/example/langchain-helper";
    const target = {
      category: "mcp",
      slug: "langchain-helper-mcp",
      title: "LangChain Helper MCP",
      description: "An MCP integration for LangChain workflows.",
      tags: ["langchain", "mcp"],
      keywords: ["langchain"],
      repoUrl,
    };
    const candidate = {
      category: "skills",
      slug: "langchain-helper-skill",
      title: "LangChain Helper Skill",
      description: "A skill for LangChain workflow prompting.",
      tags: ["langchain", "skills"],
      keywords: ["langchain"],
      repoUrl,
    };

    const [relation] = buildEntryRelations(target, [target, candidate], {
      limit: 1,
    });

    expect(relation).toMatchObject({
      key: "skills:langchain-helper-skill",
      relation: "same-project",
    });
    expect(relation?.relation).not.toBe("duplicate");
    expect(relation?.relation).not.toBe("complementary");
  });

  it("publishes deterministic relation graph refs into entry details", () => {
    const graph = readDataJson<{
      kind: string;
      count: number;
      entries: Array<{
        key: string;
        related: Array<{
          key: string;
          category: string;
          slug: string;
          relation: string;
          score: number;
          reasons: string[];
          url: string;
        }>;
      }>;
    }>("relation-graph.json");

    expect(graph).toMatchObject({
      kind: "registry-relation-graph",
      count: contentEntries.length,
    });

    const rowsWithRelations = graph.entries.filter(
      (entry) => entry.related.length > 0,
    );
    expect(rowsWithRelations.length).toBeGreaterThan(0);
    for (const row of rowsWithRelations.slice(0, 25)) {
      expect(row.related.length).toBeLessThanOrEqual(4);
      expect(row.related.map((relation) => relation.key)).not.toContain(
        row.key,
      );
      expect(row.related).toEqual(
        [...row.related].sort((left, right) => right.score - left.score),
      );
    }

    const collectionRow = graph.entries.find(
      (entry) => entry.key === "collections:browser-automation-mcp-stack",
    );
    if (collectionRow) {
      expect(
        collectionRow.related.some(
          (relation) => relation.relation === "collection-member",
        ),
      ).toBe(true);
    }

    const [sample] = rowsWithRelations;
    const detailPayload = readDataJson<{
      entry: { relatedEntries?: unknown[] };
    }>(`entries/${sample.key.replace(":", "/")}.json`);
    expect(detailPayload.entry.relatedEntries).toEqual(sample.related);
  });

  it("derives compact search URLs from unhydrated source entries", () => {
    const sourceEntry = {
      ...contentEntries[0],
      canonicalUrl: undefined,
      llmsUrl: undefined,
      apiUrl: undefined,
    };
    const [searchEntry] = buildSearchEntries([sourceEntry]);

    expect(searchEntry?.canonicalUrl).toBe(searchEntry?.url);
    expect(searchEntry?.llmsUrl).toBeUndefined();
    expect(searchEntry?.apiUrl).toBe(
      `https://heyclau.de/api/registry/entries/${sourceEntry.category}/${sourceEntry.slug}`,
    );
  });

  it("normalizes and publishes safety and privacy notes across artifacts", () => {
    const entry = buildContentEntryFromMdx({
      category: "hooks",
      fileName: "safe-background-hook.mdx",
      filePath: path.join(repoRoot, "content/hooks/safe-background-hook.mdx"),
      repoRoot,
      contentRoot: path.join(repoRoot, "content"),
      source: `---
title: Safe Background Hook
slug: safe-background-hook
category: hooks
description: Demonstrates structured safety and privacy notes.
cardDescription: Structured safety and privacy notes.
dateAdded: 2026-05-19
tags:
  - hooks
safetyNotes:
  - "Runs as a background worker during the configured Claude Code session."
privacyNotes:
  - "Reads local workspace metadata and does not send it to third parties."
---
Use this hook after reviewing the notes.`,
    });

    expect(entry.safetyNotes).toEqual([
      "Runs as a background worker during the configured Claude Code session.",
    ]);
    expect(entry.privacyNotes).toEqual([
      "Reads local workspace metadata and does not send it to third parties.",
    ]);

    const [directoryEntry] = buildDirectoryEntries([entry]);
    expect(directoryEntry.safetyNotes).toBeUndefined();
    expect(directoryEntry.privacyNotes).toBeUndefined();
    expect(directoryEntry.trustSignals).toMatchObject({
      hasSafetyNotes: true,
      hasPrivacyNotes: true,
    });

    const [searchEntry] = buildSearchEntries([entry]);
    expect(searchEntry.safetyNotes).toBeUndefined();
    expect(searchEntry.privacyNotes).toBeUndefined();
    expect(searchEntry.trustSignals).toMatchObject({
      hasSafetyNotes: true,
      hasPrivacyNotes: true,
    });
    expect(searchEntry.downloadUrl).toBe("");
    expect(buildRaycastDetailMarkdown(entry)).toContain("## Safety notes");
    expect(buildRaycastDetailMarkdown(entry)).toContain("## Privacy notes");
    expect(buildRaycastDetailMarkdown(entry)).toContain("## Trust");
    expect(renderEntryLlms(entry)).toContain("## Safety Notes");
    expect(renderEntryLlms(entry)).toContain("## Privacy Notes");
  });

  it("rejects executable JavaScript frontmatter without executing it", () => {
    // gray-matter's default `javascript` engine executes `---js` frontmatter.
    // Use a unique global as an execution sentinel: with the SAFE_MATTER_OPTIONS
    // guard, parsing must throw before the body runs, so the sentinel stays false.
    const sentinel = `__heyclaudeFrontmatterExecuted_${process.pid}_${Date.now()}`;
    globalThis[sentinel] = false;
    const source = [
      "---js",
      `globalThis[${JSON.stringify(sentinel)}] = true;`,
      'module.exports = { title: "Pwned", slug: "pwned", category: "hooks" };',
      "---",
      "Body content.",
    ].join("\n");

    try {
      expect(() =>
        buildContentEntryFromMdx({
          category: "hooks",
          fileName: "malicious.mdx",
          filePath: path.join(repoRoot, "content/hooks/malicious.mdx"),
          repoRoot,
          contentRoot: path.join(repoRoot, "content"),
          source,
        }),
      ).toThrow(/Executable JavaScript frontmatter is not allowed/);
      expect(globalThis[sentinel]).toBe(false);
    } finally {
      delete globalThis[sentinel];
    }
  });

  it("deduplicates repeated JSON-LD values while preserving order", () => {
    const [snapshot] = buildJsonLdSnapshots([
      {
        category: "mcp",
        slug: "duplicate-jsonld",
        title: "Duplicate JSON-LD",
        description: "Fixture entry with intentionally repeated source values.",
        seoDescription:
          "Fixture entry with intentionally repeated JSON-LD source values.",
        dateAdded: "2026-05-20",
        keywords: ["mcp", "fixture"],
        tags: ["fixture", "mcp"],
        documentationUrl: "https://github.com/example/duplicate-jsonld",
        repoUrl: "https://github.com/example/duplicate-jsonld",
        githubUrl: "https://github.com/example/duplicate-jsonld",
      },
    ]).entries;
    const entryJsonLd = snapshot.documents.find(
      (document) =>
        document["@id"] ===
        "https://heyclau.de/entry/mcp/duplicate-jsonld#entry",
    );

    expect(entryJsonLd?.keywords).toBe("mcp, fixture");
    expect(entryJsonLd?.sameAs).toEqual([
      "https://github.com/example/duplicate-jsonld",
    ]);
    expect(entryJsonLd?.isBasedOn).toEqual([
      "https://github.com/example/duplicate-jsonld",
    ]);
  });

  it("publishes registry moat feeds with deterministic contract hashes", () => {
    const ecosystemFeed = readDataJson<{
      schemaVersion: number;
      kind: string;
      count: number;
      signature: string;
      entries: Array<Record<string, unknown>>;
    }>("ecosystem-feed.json");
    const mcpFeed = readDataJson<{
      schemaVersion: number;
      kind: string;
      count: number;
      servers: Array<Record<string, unknown>>;
    }>("mcp-registry-feed.json");
    const pluginFeed = readDataJson<{
      schemaVersion: number;
      kind: string;
      count: number;
      plugins: Array<Record<string, unknown>>;
    }>("plugin-export-feed.json");
    const changelogFeed = readDataJson<{
      schemaVersion: number;
      kind: string;
      count: number;
      signature: string;
      entries: Array<Record<string, unknown>>;
    }>("registry-changelog.json");

    expect(ecosystemFeed).toEqual(
      buildReadOnlyEcosystemFeed(contentEntries, {
        siteUrl: "https://heyclau.de",
      }),
    );
    expect(mcpFeed).toEqual(buildMcpRegistryFeed(contentEntries));
    expect(pluginFeed).toEqual(buildPluginExportFeed(contentEntries));
    expect(changelogFeed).toEqual(buildRegistryChangelogFeed(contentEntries));
    expect(ecosystemFeed).toMatchObject({
      schemaVersion: 2,
      kind: "ecosystem-feed",
      count: contentEntries.length,
    });
    expect(ecosystemFeed.signature).toMatch(/^[a-f0-9]{64}$/);
    expect(mcpFeed.kind).toBe("mcp-registry-feed");
    expect(pluginFeed.kind).toBe("plugin-export-feed");
    expect(changelogFeed.kind).toBe("registry-changelog");
    expect(changelogFeed.signature).toMatch(/^[a-f0-9]{64}$/);
    expect(manifest.artifactContracts["ecosystem-feed.json"]).toMatchObject({
      path: "/data/ecosystem-feed.json",
      type: "json",
    });
    expect(manifest.artifactContracts["registry-changelog.json"]).toMatchObject(
      {
        path: "/data/registry-changelog.json",
        type: "json",
      },
    );
    expect(manifest.artifactContracts["llms-full.txt"]).toBeUndefined();
    for (const contract of Object.values(manifest.artifactContracts)) {
      expect(contract.sha256).toMatch(/^[a-f0-9]{64}$/);
    }
  });

  it("publishes category and platform sharded distribution feeds", () => {
    const feedIndex = readDataJson<{
      schemaVersion: number;
      kind: string;
      categories: Array<{ category: string; feedUrl: string; count: number }>;
      platforms: Array<{ platform: string; feedUrl: string; count: number }>;
    }>("feeds/index.json");
    const skillsCategory = readDataJson<{ kind: string; count: number }>(
      "feeds/categories/skills.json",
    );
    const claudePlatform = readDataJson<{ kind: string; count: number }>(
      "feeds/platforms/claude.json",
    );

    expect(feedIndex).toEqual(
      buildDistributionFeedIndex(contentEntries, {
        siteUrl: "https://heyclau.de",
      }),
    );
    expect(skillsCategory).toEqual(
      buildCategoryDistributionFeed(contentEntries, "skills", {
        siteUrl: "https://heyclau.de",
      }),
    );
    expect(claudePlatform).toEqual(
      buildPlatformDistributionFeed(contentEntries, "Claude", {
        siteUrl: "https://heyclau.de",
      }),
    );
    expect(feedIndex).toMatchObject({
      schemaVersion: 2,
      kind: "distribution-feed-index",
    });
    expect(feedIndex.categories).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          category: "skills",
          feedUrl: "/data/feeds/categories/skills.json",
        }),
      ]),
    );
    expect(feedIndex.platforms).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          platform: "Claude",
          feedUrl: "/data/feeds/platforms/claude.json",
        }),
      ]),
    );
    expect(manifest.artifacts.distributionFeeds).toBe("/data/feeds");
    expect(manifest.artifactContracts["feeds/index.json"]).toMatchObject({
      path: "/data/feeds%2Findex.json",
      type: "json",
    });
  });

  it("keeps full body fields out of compact indexes", () => {
    for (const entry of directoryEntries) {
      expect(entry.body).toBeUndefined();
      expect(entry.sections).toBeUndefined();
      expect(entry.headings).toBeUndefined();
      expect(entry.codeBlocks).toBeUndefined();
      expect(entry.scriptBody).toBeUndefined();
      expect((entry as Record<string, unknown>).copySnippet).toBeUndefined();
      expect((entry as Record<string, unknown>).usageSnippet).toBeUndefined();
      expect((entry as Record<string, unknown>).configSnippet).toBeUndefined();
      expect(typeof (entry as Record<string, unknown>).installable).toBe(
        "boolean",
      );
      expect(entry.canonicalUrl).toBe(
        `https://heyclau.de/entry/${entry.category}/${entry.slug}`,
      );
      expect(entry.llmsUrl).toBe(
        `https://heyclau.de/api/registry/entries/${entry.category}/${entry.slug}/llms`,
      );
      expect(entry.apiUrl).toBe(
        `https://heyclau.de/api/registry/entries/${entry.category}/${entry.slug}`,
      );
    }
    for (const entry of searchEntries) {
      expect(entry.url).toBeTruthy();
      expect(entry.seoTitle).toBeTruthy();
      expect(entry.canonicalUrl).toBe(entry.url);
      expect(entry.apiUrl).toBe(
        `https://heyclau.de/api/registry/entries/${entry.category}/${entry.slug}`,
      );
      expect((entry as Record<string, unknown>).body).toBeUndefined();
      expect((entry as Record<string, unknown>).copySnippet).toBeUndefined();
      expect((entry as Record<string, unknown>).seoDescription).toBeUndefined();
      expect((entry as Record<string, unknown>).llmsUrl).toBeUndefined();
      expect((entry as Record<string, unknown>).safetyNotes).toBeUndefined();
      expect((entry as Record<string, unknown>).privacyNotes).toBeUndefined();
      expect(entry.trustSignals).toHaveProperty("hasSafetyNotes");
      expect(entry.trustSignals).toHaveProperty("hasPrivacyNotes");
    }
    expect(
      searchEntries.some((entry) => entry.platforms?.includes("Gemini")),
    ).toBe(true);
  });

  it("keeps Retro Daily startup debug logs in the user's private metrics directory", () => {
    const detailPayload = readDataJson<{
      entry: {
        body: string;
      };
    }>("entries/hooks/retro-daily.json");
    const scriptBody = detailPayload.entry.scriptBody;

    expect(scriptBody).not.toContain("/tmp/claude-startup.log");
    expect(findPredictableSharedTmpHookLogPaths(scriptBody)).toEqual([]);
    expect(scriptBody).toContain(
      'DEBUG_LOG_DIR="${RETRO_DAILY_HOME:-$HOME/.claude/metrics}"',
    );
    expect(scriptBody).toContain('DEBUG_LOG="$DEBUG_LOG_DIR/startup.log"');

    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "retro-daily-hook-"));
    try {
      const homeDir = path.join(tmpDir, "home");
      const metricsDir = path.join(homeDir, ".claude", "metrics");
      fs.mkdirSync(metricsDir, { recursive: true });

      const scriptPath = path.join(metricsDir, "startup.sh");
      fs.writeFileSync(scriptPath, scriptBody, "utf8");
      fs.chmodSync(scriptPath, 0o700);
      fs.writeFileSync(
        path.join(metricsDir, "_paths.sh"),
        'RETRO_DAILY_HOME="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"\n',
        "utf8",
      );

      for (const name of [
        "daily-insights",
        "scout",
        "tag-sessions",
        "scout-review",
      ]) {
        const helperPath = path.join(metricsDir, `${name}.sh`);
        fs.writeFileSync(
          helperPath,
          `#!/bin/bash\necho "${name} private output"\n`,
          "utf8",
        );
        fs.chmodSync(helperPath, 0o700);
      }

      execFileSync("bash", ["-n", scriptPath], { stdio: "pipe" });
      const output = execFileSync("bash", [scriptPath], {
        cwd: tmpDir,
        encoding: "utf8",
        env: {
          ...process.env,
          HOME: homeDir,
          USER: "victim",
          CLAUDE_CODE_SESSION: "session-abc",
        },
        stdio: "pipe",
      });

      expect(output).toContain("daily-insights private output");
      const logPath = path.join(metricsDir, "startup.log");
      const logMode = fs.statSync(logPath).mode & 0o777;
      const dirMode = fs.statSync(metricsDir).mode & 0o777;
      expect(logMode).toBe(0o600);
      expect(dirMode).toBe(0o700);
      expect(fs.readFileSync(logPath, "utf8")).toContain(
        "CLAUDE_CODE_SESSION=session-abc",
      );
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });

  it("writes per-entry detail and Raycast payloads without static LLM shards", () => {
    const raycastEntryByKey = new Map(
      raycastPayload.entries.map((entry) => [
        `${entry.category}:${entry.slug}`,
        entry,
      ]),
    );

    for (const entry of contentEntries) {
      const key = `${entry.category}:${entry.slug}`;
      const detailPayload = readDataJson<{
        schemaVersion: number;
        key: string;
        entry: typeof entry;
      }>(`entries/${entry.category}/${entry.slug}.json`);
      const raycastDetail = readDataJson<{
        schemaVersion: number;
        key: string;
        copyText?: string;
        llmsUrl: string;
      }>(`raycast/${entry.category}/${entry.slug}.json`);
      const raycastFeedEntry = raycastEntryByKey.get(key);

      expect(detailPayload).toMatchObject({
        schemaVersion: 1,
        key,
      });
      expect(detailPayload.entry.title).toBe(entry.title);
      expect(raycastFeedEntry).toBeTruthy();
      expect(raycastDetail).toMatchObject({
        schemaVersion: 2,
        key,
        llmsUrl: `/api/registry/entries/${entry.category}/${entry.slug}/llms`,
      });
      expect(raycastDetail).not.toHaveProperty("copyText");
      expect(raycastFeedEntry.canonicalUrl).toBe(
        `https://heyclau.de/entry/${entry.category}/${entry.slug}`,
      );
      expect(raycastFeedEntry).not.toHaveProperty("llmsUrl");
      expect(raycastFeedEntry).not.toHaveProperty("copyText");
      expect(raycastFeedEntry).not.toHaveProperty("copyTextLength");
      expect(raycastFeedEntry).not.toHaveProperty("copyTextTruncated");
      expect(raycastFeedEntry).not.toHaveProperty("detailMarkdown");
    }
    expect(fs.existsSync(path.join(dataRoot, "llms"))).toBe(false);
  });

  it("publishes skill compatibility metadata and Cursor adapters", () => {
    const skills = contentEntries.filter(
      (entry) => entry.category === "skills",
    );
    expect(skills.length).toBeGreaterThan(0);

    for (const entry of skills) {
      expect(entry.skillPackage?.format).toBe("agent-skill");
      expect(entry.skillPackage?.entrypoint).toBe("SKILL.md");
      expect(entry.platformCompatibility?.map((item) => item.platform)).toEqual(
        expect.arrayContaining([
          "Claude",
          "Codex",
          "Windsurf",
          "Gemini",
          "Cursor",
          "Generic AGENTS",
        ]),
      );
      expect(
        entry.platformCompatibility?.filter(
          (item) => item.supportLevel === "native-skill",
        ),
      ).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ platform: "Claude" }),
          expect.objectContaining({ platform: "Codex" }),
          expect.objectContaining({ platform: "Windsurf" }),
          expect.objectContaining({ platform: "Gemini" }),
        ]),
      );
      expect(entry.platformCompatibility).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            platform: "Cursor",
            supportLevel: "adapter",
          }),
        ]),
      );

      const cursorAdapterPath = path.join(
        dataRoot,
        "skill-adapters",
        "cursor",
        `${entry.slug}.mdc`,
      );
      expect(fs.existsSync(cursorAdapterPath)).toBe(true);
      expect(fs.readFileSync(cursorAdapterPath, "utf8").trimEnd()).toBe(
        buildCursorSkillAdapter(entry),
      );
    }
  });

  it("publishes full corpus LLM text through the dynamic site route", () => {
    const llmsFullPath = path.join(dataRoot, "llms-full.txt");
    expect(fs.existsSync(llmsFullPath)).toBe(false);
    expect(contentEntries.some((entry) => getCopyText(entry).trim())).toBe(
      true,
    );
    expect(manifest).toMatchObject({
      schemaVersion: 2,
      kind: "registry-manifest",
      totalEntries: contentEntries.length,
    });
    expect(manifest.routes).toHaveLength(contentEntries.length);
    expect(manifest.routes[0]?.canonicalUrl).toMatch(
      /^https:\/\/heyclau\.de\//,
    );
    expect(manifest.routes[0]?.llmsUrl).toMatch(
      /^https:\/\/heyclau\.de\/api\/registry\/entries\/.+\/llms$/,
    );
    expect(manifest.qualitySummary).toBeTruthy();
    expect(manifest.artifacts.llmsFull).toBe("/llms-full.txt");
    expect(manifest.artifacts.contentQualityPrompts).toBe(
      "/data/content-quality-prompts.json",
    );
    expect(
      fs.existsSync(
        path.join(
          repoRoot,
          "apps/web/src/generated/content-category-spec.json",
        ),
      ),
    ).toBe(false);
  });

  it("keeps generated entry LLM exports free of duplicated code blocks", () => {
    const yieldLlms = renderEntryLlmsByKey("mcp:yield-intelligence-mcp");

    expect(yieldLlms.match(/^## Content$/gm)).toHaveLength(1);
    expect(
      yieldLlms.match(
        /claude mcp add --transport sse yield-intelligence https:\/\/api\.intuitek\.ai\/yield\/mcp/g,
      ),
    ).toHaveLength(1);
    expect(
      yieldLlms.match(/Ask Claude: "What are the best passive income/g),
    ).toHaveLength(1);
  });
});

type SourceHealthFixture = {
  category: string;
  slug: string;
  title?: string;
  dateAdded?: string;
  repoUpdatedAt?: string;
  repoUrl?: string;
  documentationUrl?: string;
  downloadTrust?: string;
  packageVerified?: boolean;
  safetyNotes?: unknown;
  privacyNotes?: unknown;
};

function healthEntry(input: SourceHealthFixture) {
  return { title: `${input.category}:${input.slug}`, ...input };
}

// Anchor entry fixes the deterministic reference date at 2026-05-01.
const sourceHealthFixtures = [
  healthEntry({
    category: "mcp",
    slug: "fresh-secure",
    dateAdded: "2026-05-01",
    repoUpdatedAt: "2026-04-15",
    repoUrl: "https://github.com/acme/fresh-secure",
    downloadTrust: "first-party",
    packageVerified: true,
    safetyNotes: ["Runs a background worker."],
    privacyNotes: ["Stores OAuth tokens locally."],
  }),
  healthEntry({
    category: "hooks",
    slug: "aging-gap",
    dateAdded: "2026-01-01",
    repoUpdatedAt: "2025-08-01",
    documentationUrl: "https://example.com/docs",
  }),
  healthEntry({
    category: "tools",
    slug: "stale-tool",
    dateAdded: "2025-01-01",
    repoUpdatedAt: "2024-06-01",
    repoUrl: "https://github.com/acme/stale-tool",
  }),
  healthEntry({
    category: "agents",
    slug: "dormant-agent",
    dateAdded: "2024-01-01",
    repoUpdatedAt: "2023-01-01",
    repoUrl: "https://github.com/acme/dormant-agent",
  }),
  healthEntry({
    category: "skills",
    slug: "unknown-missing",
    dateAdded: "",
    repoUpdatedAt: "",
  }),
];

describe("source health report", () => {
  it("produces a deterministic, versioned report envelope", () => {
    const first = buildSourceHealthReport(sourceHealthFixtures);
    const second = buildSourceHealthReport(sourceHealthFixtures);
    expect(first).toEqual(second);
    expect(first.schemaVersion).toBe(SOURCE_HEALTH_REPORT_SCHEMA_VERSION);
    expect(first.kind).toBe("source-health-report");
    expect(first.generatedAt).toBe("2026-05-01T00:00:00.000Z");
    expect(first.count).toBe(sourceHealthFixtures.length);
    expect(first.thresholds).toEqual({
      freshMaxDays: 180,
      agingMaxDays: 365,
      staleMaxDays: 730,
    });
  });

  it("classifies freshness buckets relative to the generated date", () => {
    const byKey = Object.fromEntries(
      buildSourceHealthReport(sourceHealthFixtures).entries.map((row) => [
        row.key,
        row,
      ]),
    );
    expect(byKey["mcp:fresh-secure"].freshness).toBe("fresh");
    expect(byKey["hooks:aging-gap"].freshness).toBe("aging");
    expect(byKey["tools:stale-tool"].freshness).toBe("stale");
    expect(byKey["agents:dormant-agent"].freshness).toBe("dormant");
    expect(byKey["skills:unknown-missing"].freshness).toBe("unknown");
    expect(byKey["skills:unknown-missing"].ageDays).toBeNull();
  });

  it("derives source-backed status and package trust", () => {
    const byKey = Object.fromEntries(
      buildSourceHealthReport(sourceHealthFixtures).entries.map((row) => [
        row.key,
        row,
      ]),
    );
    expect(byKey["mcp:fresh-secure"].sourceStatus).toBe("available");
    expect(byKey["mcp:fresh-secure"].hasPackageTrust).toBe(true);
    expect(byKey["mcp:fresh-secure"].packageTrust).toBe("first-party");
    expect(byKey["skills:unknown-missing"].sourceStatus).toBe("missing");
    expect(byKey["skills:unknown-missing"].hasPackageTrust).toBe(false);
    expect(byKey["skills:unknown-missing"].packageTrust).toBeNull();
  });

  it("flags missing safety/privacy notes only on risk-bearing categories", () => {
    const byKey = Object.fromEntries(
      buildSourceHealthReport(sourceHealthFixtures).entries.map((row) => [
        row.key,
        row,
      ]),
    );
    const hook = byKey["hooks:aging-gap"];
    expect(hook.riskBearing).toBe(true);
    expect(hook.attentionReasons).toEqual(
      expect.arrayContaining(["missing-safety-notes", "missing-privacy-notes"]),
    );
    const tool = byKey["tools:stale-tool"];
    expect(tool.riskBearing).toBe(false);
    expect(tool.attentionReasons).not.toContain("missing-safety-notes");
    expect(tool.attentionReasons).not.toContain("missing-privacy-notes");
    expect(byKey["mcp:fresh-secure"].needsAttention).toBe(false);
    expect(byKey["mcp:fresh-secure"].attentionReasons).toEqual([]);
  });

  it("marks stale, dormant, and source-less entries as needing attention", () => {
    const byKey = Object.fromEntries(
      buildSourceHealthReport(sourceHealthFixtures).entries.map((row) => [
        row.key,
        row,
      ]),
    );
    expect(byKey["tools:stale-tool"].attentionReasons).toContain(
      "stale-source",
    );
    expect(byKey["agents:dormant-agent"].attentionReasons).toContain(
      "stale-source",
    );
    expect(byKey["skills:unknown-missing"].attentionReasons).toContain(
      "missing-source",
    );
  });

  it("aggregates summary counts and percentages deterministically", () => {
    const { summary } = buildSourceHealthReport(sourceHealthFixtures);
    expect(summary.sourceBackedCount).toBe(4);
    expect(summary.missingSourceCount).toBe(1);
    expect(summary.sourceBackedPercent).toBe(80);
    expect(summary.freshCount).toBe(1);
    expect(summary.agingCount).toBe(1);
    expect(summary.staleCount).toBe(1);
    expect(summary.dormantCount).toBe(1);
    expect(summary.unknownFreshnessCount).toBe(1);
    expect(summary.packageTrustCount).toBe(1);
    expect(summary.packageTrustPercent).toBe(20);
    expect(summary.riskBearingCount).toBe(3);
    expect(summary.missingSafetyNotesCount).toBe(2);
    expect(summary.missingPrivacyNotesCount).toBe(2);
    expect(summary.needsAttentionCount).toBe(4);
  });

  it("builds a per-category breakdown across the full category order", () => {
    const report = buildSourceHealthReport(sourceHealthFixtures);
    expect(report.categoryBreakdown.hooks).toMatchObject({
      count: 1,
      missingSafetyNotes: 1,
      missingPrivacyNotes: 1,
      needsAttention: 1,
    });
    expect(report.categoryBreakdown.mcp).toMatchObject({
      count: 1,
      sourceBacked: 1,
      packageTrust: 1,
      needsAttention: 0,
    });
    expect(report.categoryBreakdown.rules).toMatchObject({
      count: 0,
      sourceBacked: 0,
      needsAttention: 0,
    });
  });

  it("handles an empty registry without dividing by zero", () => {
    const report = buildSourceHealthReport([]);
    expect(report.count).toBe(0);
    expect(report.summary.sourceBackedPercent).toBe(0);
    expect(report.summary.packageTrustPercent).toBe(0);
    expect(report.entries).toEqual([]);
  });

  it("returns unknown (not dormant) for unparsable entry or reference dates", () => {
    const base = healthEntry({
      category: "mcp",
      slug: "guard",
      dateAdded: "2026-05-01",
      repoUpdatedAt: "2026-04-01",
      repoUrl: "https://github.com/acme/guard",
    });
    const badEntryDate = buildEntrySourceHealth(
      { ...base, repoUpdatedAt: "not-a-date", dateAdded: "also-bad" },
      new Date("2026-05-01T00:00:00.000Z"),
    );
    expect(badEntryDate.freshness).toBe("unknown");
    expect(badEntryDate.ageDays).toBeNull();
    expect(badEntryDate.lastActivityAt).toBe("");

    const badReferenceDate = buildEntrySourceHealth(base, "not-a-date");
    expect(badReferenceDate.freshness).toBe("unknown");
    expect(badReferenceDate.ageDays).toBeNull();

    const stringReference = buildEntrySourceHealth(
      base,
      "2026-05-01T00:00:00.000Z",
    );
    expect(stringReference.freshness).toBe("fresh");
    expect(typeof stringReference.ageDays).toBe("number");
  });

  it("uses floor semantics for elapsed full days at freshness boundaries", () => {
    const reference = new Date("2026-05-01T00:00:00.000Z");
    const day = 86_400_000;
    const hour = 3_600_000;
    const ageOf = (daysBefore: number, extraHours = 0) =>
      buildEntrySourceHealth(
        {
          category: "tools",
          slug: "boundary",
          repoUrl: "https://github.com/acme/boundary",
          repoUpdatedAt: new Date(
            reference.getTime() - daysBefore * day - extraHours * hour,
          ).toISOString(),
        },
        reference,
      );

    // Exactly on the fresh/aging boundary stays fresh.
    expect(ageOf(180).ageDays).toBe(180);
    expect(ageOf(180).freshness).toBe("fresh");
    // A partial extra day must NOT advance the bucket (Math.round would have
    // rounded 180.5 -> 181 and mislabeled this "aging").
    expect(ageOf(180, 12).ageDays).toBe(180);
    expect(ageOf(180, 12).freshness).toBe("fresh");
    // A full extra day crosses into the next bucket.
    expect(ageOf(181).ageDays).toBe(181);
    expect(ageOf(181).freshness).toBe("aging");

    // aging/stale boundary at 365 days.
    expect(ageOf(365).freshness).toBe("aging");
    expect(ageOf(365, 12).freshness).toBe("aging");
    expect(ageOf(366).freshness).toBe("stale");

    // stale/dormant boundary at 730 days.
    expect(ageOf(730).freshness).toBe("stale");
    expect(ageOf(730, 12).freshness).toBe("stale");
    expect(ageOf(731).freshness).toBe("dormant");
  });

  it("derives a consistent report from the real registry content", () => {
    const entries = loadContentEntries();
    const report = buildSourceHealthReport(entries);
    expect(report.count).toBe(entries.length);
    expect(report.entries).toHaveLength(entries.length);
    const summedAttention = report.entries.filter(
      (row) => row.needsAttention,
    ).length;
    expect(report.summary.needsAttentionCount).toBe(summedAttention);
    expect(
      report.summary.sourceBackedCount + report.summary.missingSourceCount,
    ).toBe(report.count);
    const freshnessTotal =
      report.summary.freshCount +
      report.summary.agingCount +
      report.summary.staleCount +
      report.summary.dormantCount +
      report.summary.unknownFreshnessCount;
    expect(freshnessTotal).toBe(report.count);
  });
});

describe("parseGitHubRepo", () => {
  it("parses github.com repo URLs, including the www. alias", () => {
    expect(parseGitHubRepo("https://github.com/OpenAI/whisper.git")).toEqual({
      owner: "OpenAI",
      repo: "whisper",
      key: "OpenAI/whisper",
      url: "https://github.com/OpenAI/whisper",
    });
    // The www. alias resolves to the same repo as the bare host.
    expect(parseGitHubRepo("https://www.github.com/OpenAI/whisper")).toEqual({
      owner: "OpenAI",
      repo: "whisper",
      key: "OpenAI/whisper",
      url: "https://github.com/OpenAI/whisper",
    });
  });

  it("rejects non-github hosts, other subdomains, and empty input", () => {
    expect(parseGitHubRepo("https://example.com/OpenAI/whisper")).toBeNull();
    expect(
      parseGitHubRepo("https://gist.github.com/OpenAI/whisper"),
    ).toBeNull();
    expect(parseGitHubRepo("")).toBeNull();
  });
});
