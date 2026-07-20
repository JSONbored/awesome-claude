/**
 * Pure registry artifact builders.
 *
 * Feed envelopes, Raycast payloads, trust reports, distribution feeds, and
 * manifest builders live here. Given the same normalized entry list the output
 * is deterministic — network I/O stays outside this module.
 *
 * The public surface (`artifacts.js` / `@heyclaude/registry`) re-exports
 * everything below so existing imports stay unchanged.
 */
import crypto from "node:crypto";

import { getCopyText } from "./presentation.js";
import categorySpec from "./category-spec.json" with { type: "json" };
import {
  buildEntryQuality,
  buildContentPromptReport,
  buildContentQualityReport,
} from "./quality.js";
import { renderCorpusLlms, renderEntryLlms } from "./llms.js";
import { buildEntryJsonLdSnapshot } from "./seo.js";
import { buildSubmissionSpecs } from "./submission-spec.js";
import { SAFE_CONTENT_SLUG_PATTERN } from "./content-schema.js";
import { resolveMcpInstallConfig } from "./mcp-install-config.js";
import { normalizePlatforms } from "./platforms.js";
import {
  buildRegistryRelationGraph,
  relationLookupFromGraph,
} from "./relationships.js";

export const ENTRY_SCHEMA_VERSION = 1;
export const RAYCAST_SCHEMA_VERSION = 2;
export const REGISTRY_ARTIFACT_SCHEMA_VERSION = 2;
export const SITE_URL = "https://heyclau.de";
export const RAYCAST_COPY_PREVIEW_LIMIT = 800;

const RAYCAST_ONE_CLICK_STDIO_COMMANDS = new Set(["npx", "uvx"]);

function stripLoneSurrogates(value) {
  const text = String(value || "");
  let output = "";

  for (let index = 0; index < text.length; index += 1) {
    const code = text.charCodeAt(index);

    if (code >= 0xd800 && code <= 0xdbff) {
      const nextCode = text.charCodeAt(index + 1);
      if (nextCode >= 0xdc00 && nextCode <= 0xdfff) {
        output += text[index] + text[index + 1];
        index += 1;
      }
      continue;
    }

    if (code >= 0xdc00 && code <= 0xdfff) continue;
    output += text[index];
  }

  return output;
}

export function truncateText(value, maxLength) {
  const normalized = stripLoneSurrogates(value).trim();
  if (normalized.length <= maxLength) return normalized;

  let truncated = "";
  const bodyLimit = maxLength - 3;
  for (const codepoint of normalized) {
    if (truncated.length + codepoint.length > bodyLimit) break;
    truncated += codepoint;
  }

  return `${truncated.trimEnd()}...`;
}

function codeBlock(language, value) {
  const normalized = String(value || "").trim();
  if (!normalized) return "";
  return `\`\`\`${language}\n${normalized}\n\`\`\``;
}

function noteList(values) {
  return Array.isArray(values)
    ? values.map((value) => String(value || "").trim()).filter(Boolean)
    : [];
}

function pushNoteSection(lines, title, values) {
  const notes = noteList(values);
  if (!notes.length) return;
  lines.push("", `## ${title}`, ...notes.map((note) => `- ${note}`));
}

function raycastPackageTrust(entry) {
  if (entry.downloadTrust === "first-party" || entry.packageVerified) {
    return "maintainer-built/verified package";
  }
  if (entry.downloadUrl) return "external package";
  return "no package download";
}

function pushRaycastTrustSection(lines, entry) {
  const source =
    entry.repoUrl || entry.documentationUrl
      ? "source-backed"
      : "source not provided";
  const review =
    entry.claimStatus === "verified" || entry.reviewedBy
      ? "reviewed or claimed"
      : "unclaimed";
  lines.push(
    "",
    "## Trust",
    `- Source: ${source}`,
    `- Package: ${raycastPackageTrust(entry)}`,
    `- Review: ${review}`,
  );
}

function buildEntryNoteFields(entry) {
  const fields = {};
  const safetyNotes = noteList(entry.safetyNotes);
  const privacyNotes = noteList(entry.privacyNotes);
  if (safetyNotes.length) fields.safetyNotes = safetyNotes;
  if (privacyNotes.length) fields.privacyNotes = privacyNotes;
  return fields;
}

function buildEntryBrandFields(entry) {
  const fields = {};
  for (const field of [
    "brandName",
    "brandDomain",
    "brandIconUrl",
    "brandLogoUrl",
    "brandAssetSource",
    "brandVerifiedAt",
    "brandColors",
  ]) {
    const value = entry[field];
    if (Array.isArray(value) && value.length) {
      fields[field] = value;
    } else if (value !== undefined && value !== null && value !== "") {
      fields[field] = value;
    }
  }
  return fields;
}

function buildEntryProvenanceFields(entry) {
  const fields = {};
  for (const field of [
    "submittedBy",
    "submittedByUrl",
    "submittedAt",
    "sourceSubmissionNumber",
    "sourceSubmissionUrl",
    "importPrNumber",
    "importPrUrl",
    "reviewedBy",
    "reviewedAt",
    "claimStatus",
    "claimedBy",
    "claimedByUrl",
    "claimedAt",
  ]) {
    const value = entry[field];
    if (value !== undefined && value !== null && value !== "") {
      fields[field] = value;
    }
  }
  return fields;
}

function compactDefinedObject(value) {
  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => item !== undefined),
  );
}

function raycastOneClickStdioCommandName(value) {
  const command = String(value || "").trim();
  if (!command || command.includes("/") || command.includes("\\")) return "";
  return command.toLowerCase();
}

function isRaycastOneClickMcpInstallConfig(config) {
  const type = String(config?.type || "")
    .trim()
    .toLowerCase();
  if (type !== "stdio") return true;
  return RAYCAST_ONE_CLICK_STDIO_COMMANDS.has(
    raycastOneClickStdioCommandName(config.command),
  );
}

function resolveRaycastMcpInstallConfig(entry) {
  const mcpInstallConfig = resolveMcpInstallConfig(entry);
  if (!mcpInstallConfig) return null;
  return isRaycastOneClickMcpInstallConfig(mcpInstallConfig.config)
    ? mcpInstallConfig
    : null;
}

export function buildRaycastDetailMarkdown(entry) {
  const lines = [`# ${entry.title}`, "", entry.description];
  const mcpInstallConfig =
    entry.category === "mcp" ? resolveRaycastMcpInstallConfig(entry) : null;
  const configSnippet =
    entry.category === "mcp"
      ? mcpInstallConfig?.configSnippet
      : entry.configSnippet;

  pushRaycastTrustSection(lines, entry);
  pushNoteSection(lines, "Safety notes", entry.safetyNotes);
  pushNoteSection(lines, "Privacy notes", entry.privacyNotes);

  if (entry.installCommand || entry.commandSyntax) {
    lines.push(
      "",
      "## Install",
      codeBlock("bash", entry.installCommand || entry.commandSyntax),
    );
  }

  if (configSnippet) {
    lines.push("", "## Config", codeBlock("json", configSnippet));
  }

  if (entry.usageSnippet) {
    lines.push("", "## Usage", entry.usageSnippet);
  }

  return truncateText(lines.join("\n"), 6000);
}

export function generatedAtForEntries(entries) {
  const latestDate = entries
    .map((entry) => String(entry.dateAdded || "").slice(0, 10))
    .concat(
      entries.map((entry) => String(entry.contentUpdatedAt || "").slice(0, 10)),
    )
    .concat(entries.map((entry) => String(entry.verifiedAt || "").slice(0, 10)))
    .filter((value) => /^\d{4}-\d{2}-\d{2}$/.test(value))
    .sort()
    .at(-1);

  return latestDate
    ? `${latestDate}T00:00:00.000Z`
    : "1970-01-01T00:00:00.000Z";
}

export function dataUrl(...segments) {
  return `/data/${segments.map((segment) => encodeURIComponent(String(segment))).join("/")}`;
}

function entryCanonicalUrl(entry, siteUrl = SITE_URL) {
  return `${siteUrl.replace(/\/$/, "")}/entry/${entry.category}/${entry.slug}`;
}

function categoryCanonicalUrl(category, siteUrl = SITE_URL) {
  return `${siteUrl.replace(/\/$/, "")}/browse?category=${encodeURIComponent(category)}`;
}

function entryLlmsUrl(entry, siteUrl = SITE_URL) {
  return `${entryApiUrl(entry, siteUrl)}/llms`;
}

function entryApiUrl(entry, siteUrl = SITE_URL) {
  return `${siteUrl.replace(/\/$/, "")}/api/registry/entries/${entry.category}/${entry.slug}`;
}

function buildRepoStats(entry) {
  const hasStats =
    typeof entry.githubStars === "number" ||
    typeof entry.githubForks === "number" ||
    typeof entry.repoUpdatedAt === "string";
  if (!entry.repoUrl && !hasStats) return undefined;
  return {
    repository: entry.repoUrl
      ? String(entry.repoUrl).replace(/^https:\/\/github\.com\//, "")
      : undefined,
    url: entry.repoUrl || undefined,
    stars:
      typeof entry.githubStars === "number" ? entry.githubStars : undefined,
    forks:
      typeof entry.githubForks === "number" ? entry.githubForks : undefined,
    updatedAt: entry.repoUpdatedAt || undefined,
    appliesTo: entry.repoUrl ? "listing_source_repo" : "none",
    label: "Source repo",
  };
}

export function buildDirectoryEntries(entries) {
  return entries.map((entry) => {
    return compactDefinedObject({
      category: entry.category,
      slug: entry.slug,
      title: entry.title,
      description: entry.cardDescription || entry.description,
      author: entry.author || "",
      dateAdded: entry.dateAdded || "",
      contentUpdatedAt: entry.contentUpdatedAt || "",
      tags: entry.tags ?? [],
      keywords: entry.keywords ?? [],
      documentationUrl: entry.documentationUrl || "",
      docsUrl: entry.docsUrl || undefined,
      sourceUrl: entry.sourceUrl || undefined,
      sourceUrls:
        Array.isArray(entry.sourceUrls) && entry.sourceUrls.length
          ? entry.sourceUrls
          : undefined,
      packageUrl: entry.packageUrl || undefined,
      repositoryUrl: entry.repositoryUrl || undefined,
      websiteUrl: entry.websiteUrl || undefined,
      ...buildEntryProvenanceFields(entry),
      ...buildEntryBrandFields(entry),
      repoUrl: entry.repoUrl || "",
      downloadUrl: entry.downloadUrl || "",
      downloadTrust: entry.downloadTrust ?? null,
      packageVerified: Boolean(entry.packageVerified),
      hasCopySnippet: Boolean(entry.copySnippet || entry.hasCopySnippet),
      hasUsageSnippet: Boolean(entry.usageSnippet),
      hasConfigSnippet: Boolean(entry.configSnippet),
      hasScriptBody: Boolean(entry.scriptBody || entry.hasScriptBody),
      installable: Boolean(
        entry.installable ||
        entry.installCommand ||
        entry.downloadUrl ||
        entry.configSnippet,
      ),
      canonicalUrl: entryCanonicalUrl(entry),
      llmsUrl: entryLlmsUrl(entry),
      apiUrl: entryApiUrl(entry),
      repoStats: buildRepoStats(entry),
      trustSignals: buildEntryTrustSignals(entry),
    });
  });
}

export function buildSearchEntries(entries) {
  return entries.map((entry) =>
    compactDefinedObject({
      category: entry.category,
      slug: entry.slug,
      title: entry.title,
      seoTitle: entry.seoTitle || entry.title,
      description: entry.cardDescription || entry.description,
      tags: entry.tags ?? [],
      keywords: entry.keywords ?? [],
      author: entry.author || "",
      ...buildEntryProvenanceFields(entry),
      ...buildEntryBrandFields(entry),
      dateAdded: entry.dateAdded || "",
      ...buildCompactInstallFields(entry),
      downloadUrl: entry.downloadUrl || "",
      downloadTrust: entry.downloadTrust ?? null,
      verificationStatus: entry.verificationStatus || "",
      platforms: buildEntryPlatformNames(entry),
      supportLevels: buildSkillPlatformCompatibility(entry).map(
        (item) => item.supportLevel,
      ),
      documentationUrl: entry.documentationUrl || "",
      repoUrl: entry.repoUrl || "",
      repoStats: buildRepoStats(entry),
      url: entryCanonicalUrl(entry),
      canonicalUrl: entryCanonicalUrl(entry),
      apiUrl: entryApiUrl(entry),
      trustSignals: buildListTrustSignals(entry),
    }),
  );
}

function sha256Text(value) {
  return crypto.createHash("sha256").update(String(value)).digest("hex");
}

export function buildArtifactHash(value, type = "json") {
  return sha256Text(type === "json" ? JSON.stringify(value) : String(value));
}

export function buildSkillPlatformCompatibility(entry) {
  if (entry.category !== "skills") return [];
  if (Array.isArray(entry.platformCompatibility)) {
    return entry.platformCompatibility;
  }

  const verifiedAt = entry.verifiedAt || entry.dateAdded || "";
  return [
    {
      platform: "Claude",
      supportLevel: "native-skill",
      installPath: ".claude/skills/<skill-name>/SKILL.md",
      verifiedAt,
    },
    {
      platform: "Codex",
      supportLevel: "native-skill",
      installPath: ".agents/skills/<skill-name>/SKILL.md",
      verifiedAt,
    },
    {
      platform: "Windsurf",
      supportLevel: "native-skill",
      installPath: ".windsurf/skills/<skill-name>/SKILL.md",
      verifiedAt,
    },
    {
      platform: "Gemini",
      supportLevel: "native-skill",
      installPath:
        ".gemini/skills/<skill-name>/SKILL.md or .agents/skills/<skill-name>/SKILL.md",
      verifiedAt,
    },
    {
      platform: "Cursor",
      supportLevel: "adapter",
      installPath: ".cursor/rules/<skill-name>.mdc",
      adapterPath: dataUrl("skill-adapters", "cursor", `${entry.slug}.mdc`),
      verifiedAt,
    },
    {
      platform: "Generic AGENTS",
      supportLevel: "manual-context",
      installPath: "AGENTS.md or tool-specific context file",
      verifiedAt,
    },
  ];
}

function buildEntryPlatformNames(entry) {
  const platforms = new Set(
    buildSkillPlatformCompatibility(entry)
      .map((item) => item.platform)
      .filter(Boolean),
  );
  const tokens = new Set(
    [entry.category, ...(entry.tags ?? []), ...(entry.keywords ?? [])].map(
      (item) => String(item || "").toLowerCase(),
    ),
  );

  if (entry.category === "mcp") {
    const mcpInstallConfig = resolveMcpInstallConfig(entry);
    for (const target of mcpInstallConfig?.targets ?? []) {
      platforms.add(target);
    }
  }
  if (
    ["agents", "commands", "hooks", "rules", "statuslines"].includes(
      entry.category,
    )
  ) {
    platforms.add("claude-code");
  }
  for (const platform of [
    "cursor",
    "codex",
    "gemini",
    "windsurf",
    "raycast",
    "aider",
    "zed",
    "continue",
  ]) {
    if (tokens.has(platform)) platforms.add(platform);
  }

  // Canonicalize so the same platform is never split across a free-form skill
  // compatibility label ("Codex") and a slug ("codex") in generated facets.
  return normalizePlatforms([...platforms]);
}

function sourceUrlsForEntry(entry) {
  return [
    entry.documentationUrl,
    entry.docsUrl,
    entry.downloadUrl,
    entry.repoUrl,
    entry.githubUrl,
    entry.packageUrl,
    entry.repositoryUrl,
    entry.sourceUrl,
    entry.websiteUrl,
    ...(Array.isArray(entry.sourceUrls) ? entry.sourceUrls : []),
    ...(Array.isArray(entry.retrievalSources) ? entry.retrievalSources : []),
  ]
    .map((value) => String(value || "").trim())
    .filter(Boolean)
    .filter((value, index, list) => list.indexOf(value) === index);
}

function lastVerifiedForEntry(entry) {
  return (
    entry.verifiedAt ||
    entry.contentUpdatedAt ||
    entry.repoUpdatedAt ||
    entry.dateAdded ||
    ""
  );
}

function normalizedIsoTimestamp(value) {
  const timestamp = Date.parse(String(value || ""));
  if (!Number.isFinite(timestamp)) return "";
  return new Date(timestamp).toISOString();
}

export function buildEntryTrustSignals(entry) {
  const platformCompatibility = buildSkillPlatformCompatibility(entry);
  const adapterGenerated = platformCompatibility.some(
    (item) => item.supportLevel === "adapter" && item.adapterPath,
  );
  const packageChecksum =
    entry.downloadSha256 || entry.skillPackage?.sha256 || "";
  const sourceUrls = sourceUrlsForEntry(entry);
  const hasSafetyNotes = noteList(entry.safetyNotes).length > 0;
  const hasPrivacyNotes = noteList(entry.privacyNotes).length > 0;

  return {
    firstPartyEditorial: entry.disclosure === "heyclaude_pick",
    packageVerified: entry.packageVerified === true,
    packageTrust: entry.downloadTrust || null,
    packageChecksum,
    checksumPresent: Boolean(packageChecksum),
    sourceUrlCount: sourceUrls.length,
    sourceUrls,
    sourceStatus: sourceUrls.length ? "available" : "missing",
    lastVerifiedAt: lastVerifiedForEntry(entry),
    adapterGenerated,
    hasSafetyNotes,
    hasPrivacyNotes,
    platforms: buildEntryPlatformNames(entry),
    supportLevels: platformCompatibility.map((item) => item.supportLevel),
  };
}

function buildListTrustSignals(entry) {
  const trustSignals = buildEntryTrustSignals(entry);
  return {
    firstPartyEditorial: trustSignals.firstPartyEditorial,
    packageVerified: trustSignals.packageVerified,
    sourceStatus: trustSignals.sourceStatus,
    lastVerifiedAt: trustSignals.lastVerifiedAt,
    hasSafetyNotes: trustSignals.hasSafetyNotes,
    hasPrivacyNotes: trustSignals.hasPrivacyNotes,
    platforms: trustSignals.platforms,
    supportLevels: trustSignals.supportLevels,
  };
}

function buildCompactInstallFields(entry) {
  const mcpInstallConfig =
    entry.category === "mcp" ? resolveRaycastMcpInstallConfig(entry) : null;
  if (entry.category === "mcp") {
    return compactDefinedObject({
      installable: Boolean(
        entry.installable ||
        entry.installCommand ||
        entry.commandSyntax ||
        entry.downloadUrl ||
        mcpInstallConfig,
      ),
      hasInstallCommand: Boolean(entry.installCommand || entry.commandSyntax),
      hasConfigSnippet: Boolean(mcpInstallConfig),
      mcpInstallTargets: mcpInstallConfig?.targets,
    });
  }

  return {
    installable: Boolean(
      entry.installable ||
      entry.installCommand ||
      entry.commandSyntax ||
      entry.downloadUrl ||
      entry.configSnippet,
    ),
    hasInstallCommand: Boolean(entry.installCommand || entry.commandSyntax),
    hasConfigSnippet: Boolean(entry.configSnippet),
  };
}

function buildRaycastInstallDetailFields(entry) {
  const mcpInstallConfig =
    entry.category === "mcp" ? resolveRaycastMcpInstallConfig(entry) : null;
  if (entry.category === "mcp") {
    return compactDefinedObject({
      ...buildCompactInstallFields(entry),
      installCommand: entry.installCommand || entry.commandSyntax || "",
      configSnippet: mcpInstallConfig?.configSnippet || "",
      mcpInstallTargets: mcpInstallConfig?.targets,
    });
  }

  return compactDefinedObject({
    ...buildCompactInstallFields(entry),
    installCommand: entry.installCommand || entry.commandSyntax || "",
    configSnippet: entry.configSnippet || "",
  });
}

function verificationAgeDays(entry, generatedAt) {
  const verifiedAt = lastVerifiedForEntry(entry);
  const verifiedTime = Date.parse(String(verifiedAt || ""));
  const generatedTime = Date.parse(String(generatedAt || ""));
  if (!Number.isFinite(verifiedTime) || !Number.isFinite(generatedTime)) {
    return null;
  }
  return Math.max(0, Math.floor((generatedTime - verifiedTime) / 86_400_000));
}

function booleanCount(entries, predicate) {
  return entries.filter(predicate).length;
}

function percentage(count, total) {
  return total > 0 ? Math.round((count / total) * 100) : 0;
}

function entryTrustReportRow(entry, generatedAt) {
  const trustSignals = buildEntryTrustSignals(entry);
  const ageDays = verificationAgeDays(entry, generatedAt);
  const hasBrand = Boolean(entry.brandDomain || entry.brandIconUrl);
  const hasSafetyNotes = Array.isArray(entry.safetyNotes)
    ? entry.safetyNotes.length > 0
    : false;
  const hasPrivacyNotes = Array.isArray(entry.privacyNotes)
    ? entry.privacyNotes.length > 0
    : false;
  const hasProvenance = Boolean(
    entry.submittedBy ||
    entry.reviewedBy ||
    entry.sourceSubmissionUrl ||
    entry.importPrUrl,
  );
  const recommendations = [];

  if (!hasBrand && ["mcp", "tools"].includes(entry.category)) {
    recommendations.push("Add brandDomain or reviewed brand asset metadata.");
  }
  if (trustSignals.sourceStatus === "missing") {
    recommendations.push(
      "Add source, docs, repository, or editorial provenance.",
    );
  }
  if (entry.category === "skills" && !trustSignals.checksumPresent) {
    recommendations.push(
      "Add package checksum or validate the downloadable package.",
    );
  }
  if (ageDays !== null && ageDays > 365) {
    recommendations.push(
      "Refresh verification date from current source facts.",
    );
  }
  if (entry.category === "skills" && !trustSignals.adapterGenerated) {
    recommendations.push(
      "Confirm platform compatibility or generated adapter coverage.",
    );
  }

  return {
    key: `${entry.category}:${entry.slug}`,
    category: entry.category,
    slug: entry.slug,
    title: entry.title,
    brandName: entry.brandName || "",
    brandDomain: entry.brandDomain || "",
    brandAssetSource: entry.brandAssetSource || "",
    sourceStatus: trustSignals.sourceStatus,
    sourceUrlCount: trustSignals.sourceUrlCount,
    checksumPresent: trustSignals.checksumPresent,
    adapterGenerated: trustSignals.adapterGenerated,
    firstPartyEditorial: trustSignals.firstPartyEditorial,
    packageVerified: trustSignals.packageVerified,
    packageTrust: trustSignals.packageTrust,
    hasSafetyNotes,
    hasPrivacyNotes,
    lastVerifiedAt: normalizedIsoTimestamp(trustSignals.lastVerifiedAt),
    verificationAgeDays: ageDays,
    hasProvenance,
    submittedBy: entry.submittedBy || "",
    reviewedBy: entry.reviewedBy || "",
    claimStatus: entry.claimStatus || "unclaimed",
    recommendations,
  };
}

function buildTrustCategoryBreakdown(entries, rows) {
  return Object.fromEntries(
    categorySpec.categoryOrder.map((category) => {
      const categoryRows = rows.filter((entry) => entry.category === category);
      const count = categoryRows.length;
      return [
        category,
        {
          count,
          brandCoverage: booleanCount(categoryRows, (entry) =>
            Boolean(entry.brandDomain),
          ),
          sourceAvailable: booleanCount(
            categoryRows,
            (entry) => entry.sourceStatus === "available",
          ),
          checksumPresent: booleanCount(
            categoryRows,
            (entry) => entry.checksumPresent,
          ),
          adapterGenerated: booleanCount(
            categoryRows,
            (entry) => entry.adapterGenerated,
          ),
          provenancePresent: booleanCount(
            categoryRows,
            (entry) => entry.hasProvenance,
          ),
          safetyNotesPresent: booleanCount(
            categoryRows,
            (entry) => entry.hasSafetyNotes,
          ),
          privacyNotesPresent: booleanCount(
            categoryRows,
            (entry) => entry.hasPrivacyNotes,
          ),
          firstPartyPackage: booleanCount(
            categoryRows,
            (entry) => entry.packageTrust === "first-party",
          ),
          recommendedFixes: categoryRows.reduce(
            (sum, entry) => sum + entry.recommendations.length,
            0,
          ),
        },
      ];
    }),
  );
}

export function buildRegistryTrustReport(entries) {
  const generatedAt = generatedAtForEntries(entries);
  const rows = entries.map((entry) => entryTrustReportRow(entry, generatedAt));
  const total = rows.length;
  const brandedCount = booleanCount(rows, (entry) =>
    Boolean(entry.brandDomain),
  );
  const brandfetchCount = booleanCount(
    rows,
    (entry) => entry.brandAssetSource === "brandfetch",
  );
  const sourceAvailableCount = booleanCount(
    rows,
    (entry) => entry.sourceStatus === "available",
  );
  const checksumPresentCount = booleanCount(
    rows,
    (entry) => entry.checksumPresent,
  );
  const adapterGeneratedCount = booleanCount(
    rows,
    (entry) => entry.adapterGenerated,
  );
  const recentlyVerifiedCount = booleanCount(
    rows,
    (entry) =>
      entry.verificationAgeDays !== null && entry.verificationAgeDays <= 180,
  );
  const staleVerificationCount = booleanCount(
    rows,
    (entry) =>
      entry.verificationAgeDays !== null && entry.verificationAgeDays > 365,
  );
  const provenanceCount = booleanCount(rows, (entry) => entry.hasProvenance);
  const claimedOrReviewedCount = booleanCount(
    rows,
    (entry) => entry.claimStatus === "verified" || Boolean(entry.reviewedBy),
  );
  const safetyNotesCount = booleanCount(rows, (entry) => entry.hasSafetyNotes);
  const privacyNotesCount = booleanCount(
    rows,
    (entry) => entry.hasPrivacyNotes,
  );
  const firstPartyPackageCount = booleanCount(
    rows,
    (entry) => entry.packageTrust === "first-party",
  );

  const needsAttention = rows
    .filter((entry) => entry.recommendations.length)
    .sort(
      (left, right) =>
        right.recommendations.length - left.recommendations.length ||
        left.category.localeCompare(right.category) ||
        left.title.localeCompare(right.title),
    );

  return {
    schemaVersion: REGISTRY_ARTIFACT_SCHEMA_VERSION,
    kind: "registry-trust-report",
    generatedAt,
    count: total,
    thresholds: {
      recentlyVerifiedDays: 180,
      staleVerificationDays: 365,
    },
    summary: {
      brandedCount,
      brandedPercent: percentage(brandedCount, total),
      brandfetchCount,
      sourceAvailableCount,
      sourceAvailablePercent: percentage(sourceAvailableCount, total),
      missingSourceCount: total - sourceAvailableCount,
      checksumPresentCount,
      checksumPresentPercent: percentage(checksumPresentCount, total),
      adapterGeneratedCount,
      recentlyVerifiedCount,
      staleVerificationCount,
      provenanceCount,
      provenancePercent: percentage(provenanceCount, total),
      claimedOrReviewedCount,
      claimedOrReviewedPercent: percentage(claimedOrReviewedCount, total),
      safetyNotesCount,
      safetyNotesPercent: percentage(safetyNotesCount, total),
      privacyNotesCount,
      privacyNotesPercent: percentage(privacyNotesCount, total),
      firstPartyPackageCount,
      firstPartyPackagePercent: percentage(firstPartyPackageCount, total),
      recommendedFixCount: rows.reduce(
        (sum, entry) => sum + entry.recommendations.length,
        0,
      ),
      entriesNeedingAttention: needsAttention.length,
    },
    categoryBreakdown: buildTrustCategoryBreakdown(entries, rows),
    queues: {
      missingBrand: needsAttention
        .filter((entry) =>
          entry.recommendations.some((item) => item.includes("brandDomain")),
        )
        .slice(0, 50),
      missingSource: needsAttention
        .filter((entry) =>
          // Match the "Add source, …" recommendation specifically. A plain
          // "source" substring also matches the stale-verification text
          // ("…from current source facts."), which pulled entries that already
          // have a source into this queue, contradicting missingSourceCount.
          entry.recommendations.some((item) => item.includes("Add source")),
        )
        .slice(0, 50),
      missingChecksum: needsAttention
        .filter((entry) =>
          entry.recommendations.some((item) => item.includes("checksum")),
        )
        .slice(0, 50),
      staleVerification: needsAttention
        .filter((entry) =>
          entry.recommendations.some((item) => item.includes("verification")),
        )
        .slice(0, 50),
    },
    entries: rows,
  };
}

export function buildCursorSkillAdapter(entry) {
  const description = truncateText(
    entry.cardDescription || entry.description,
    240,
  ).replaceAll('"', '\\"');
  const install = entry.installCommand || "";
  const source = entry.downloadUrl
    ? entry.downloadUrl.startsWith("/")
      ? `${SITE_URL}${entry.downloadUrl}`
      : entry.downloadUrl
    : entry.repoUrl || entry.documentationUrl || entryCanonicalUrl(entry);

  return [
    "---",
    `description: "${description}"`,
    "globs:",
    "alwaysApply: false",
    "---",
    "",
    `# ${entry.title}`,
    "",
    entry.description,
    "",
    "Use this rule when the user asks for this reusable skill workflow in Cursor. Cursor does not natively install Agent Skills from this package, so follow the SKILL.md instructions as a scoped workflow adapter.",
    "",
    // `undefined` omits the optional Install block; `""` entries are intentional
    // blank-line separators that must survive the filter (the previous `!== ""`
    // filter stripped every blank line, collapsing the adapter into one block).
    install ? "## Install" : undefined,
    install ? codeBlock("bash", install) : undefined,
    "## Source",
    source,
  ]
    .filter((line) => line !== undefined)
    .join("\n");
}

export function buildRaycastEntries(entries) {
  return entries.map((entry) => {
    return compactDefinedObject({
      category: entry.category,
      slug: entry.slug,
      title: entry.title,
      description: entry.cardDescription || entry.description,
      tags: entry.tags,
      author: entry.author || "",
      ...buildEntryProvenanceFields(entry),
      ...buildEntryBrandFields(entry),
      detailUrl: dataUrl("raycast", entry.category, `${entry.slug}.json`),
      webUrl: entryCanonicalUrl(entry),
      canonicalUrl: entryCanonicalUrl(entry),
      repoUrl: entry.repoUrl || "",
      repoStats: buildRepoStats(entry),
      documentationUrl: entry.documentationUrl || "",
      downloadTrust: entry.downloadTrust,
      verificationStatus: entry.verificationStatus || "",
      ...buildCompactInstallFields(entry),
      platformCompatibility:
        entry.category === "skills"
          ? buildSkillPlatformCompatibility(entry)
          : buildEntryPlatformNames(entry),
    });
  });
}

export function buildEntryDetail(entry, params = {}) {
  const {
    codeBlocks: _codeBlocks,
    sections: _sections,
    headings: _headings,
    ...detailEntry
  } = entry;
  const relatedEntries =
    params.relatedEntries ??
    params.relationLookup?.get?.(`${entry.category}:${entry.slug}`) ??
    undefined;
  return {
    schemaVersion: ENTRY_SCHEMA_VERSION,
    key: `${entry.category}:${entry.slug}`,
    entry: compactDefinedObject({
      ...detailEntry,
      relatedEntries,
      hasCopySnippet: Boolean(entry.copySnippet || entry.hasCopySnippet),
      hasUsageSnippet: Boolean(entry.usageSnippet),
      hasConfigSnippet: Boolean(entry.configSnippet),
      hasScriptBody: Boolean(entry.scriptBody || entry.hasScriptBody),
      repoStats: buildRepoStats(entry),
    }),
    trustSignals: buildEntryTrustSignals(entry),
  };
}

export function buildRaycastDetail(entry) {
  return {
    schemaVersion: RAYCAST_SCHEMA_VERSION,
    key: `${entry.category}:${entry.slug}`,
    category: entry.category,
    slug: entry.slug,
    title: entry.title,
    author: entry.author || "",
    ...buildEntryProvenanceFields(entry),
    ...buildEntryBrandFields(entry),
    detailMarkdown: buildRaycastDetailMarkdown(entry),
    webUrl: entryCanonicalUrl(entry),
    canonicalUrl: entryCanonicalUrl(entry),
    llmsUrl: `/api/registry/entries/${entry.category}/${entry.slug}/llms`,
    apiUrl: entryApiUrl(entry),
    seoTitle: entry.seoTitle || entry.title,
    seoDescription: entry.seoDescription || entry.description,
    ...buildEntryNoteFields(entry),
    repoUrl: entry.repoUrl || "",
    repoStats: buildRepoStats(entry),
    documentationUrl: entry.documentationUrl || "",
    downloadTrust: entry.downloadTrust ?? null,
    verificationStatus: entry.verificationStatus || "",
    packageVerified: Boolean(entry.packageVerified),
    trustSignals: buildEntryTrustSignals(entry),
    ...buildRaycastInstallDetailFields(entry),
  };
}

export function buildArtifactEnvelope(kind, entries, extra = {}) {
  return {
    schemaVersion: REGISTRY_ARTIFACT_SCHEMA_VERSION,
    kind,
    generatedAt: generatedAtForEntries(entries),
    count: entries.length,
    ...extra,
    entries,
  };
}

export function buildEnvelopeEntries(payload) {
  if (!payload || !Array.isArray(payload.entries)) {
    throw new TypeError(
      "Registry artifacts must use an envelope with an entries array.",
    );
  }
  return payload.entries;
}

export function buildRaycastEnvelope(entries) {
  return {
    schemaVersion: RAYCAST_SCHEMA_VERSION,
    kind: "raycast-index",
    generatedAt: generatedAtForEntries(entries),
    count: entries.length,
    entries: buildRaycastEntries(entries),
  };
}

export function buildReadOnlyEcosystemFeed(entries, params = {}) {
  const siteUrl = params.siteUrl ?? SITE_URL;
  const payload = {
    schemaVersion: REGISTRY_ARTIFACT_SCHEMA_VERSION,
    kind: "ecosystem-feed",
    generatedAt: generatedAtForEntries(entries),
    count: entries.length,
    entries: entries.map((entry) => {
      const quality = buildEntryQuality(entry);
      return {
        key: `${entry.category}:${entry.slug}`,
        category: entry.category,
        slug: entry.slug,
        title: entry.title,
        description: entry.cardDescription || entry.description,
        url: entryCanonicalUrl(entry, siteUrl),
        ...buildEntryProvenanceFields(entry),
        ...buildEntryBrandFields(entry),
        websiteUrl: entry.websiteUrl || "",
        documentationUrl: entry.documentationUrl || "",
        repoUrl: entry.repoUrl || "",
        pricingModel: entry.pricingModel || "",
        disclosure: entry.disclosure || "editorial",
        tags: entry.tags || [],
        qualityScore: quality.scores.total,
        provenance: quality.provenance,
        trustSignals: buildEntryTrustSignals(entry),
      };
    }),
  };

  return {
    ...payload,
    signatureAlgorithm: "sha256",
    signature: buildArtifactHash(payload),
  };
}

function inferRepositorySource(repoUrl) {
  try {
    const hostname = new URL(repoUrl).hostname.toLowerCase();
    if (hostname === "github.com" || hostname.endsWith(".github.com")) {
      return "github";
    }
    if (hostname === "gitlab.com" || hostname.endsWith(".gitlab.com")) {
      return "gitlab";
    }
    if (hostname === "bitbucket.org" || hostname.endsWith(".bitbucket.org")) {
      return "bitbucket";
    }
    return hostname;
  } catch {
    return "unknown";
  }
}

export function buildMcpRegistryFeed(entries) {
  const mcpEntries = entries.filter((entry) => entry.category === "mcp");
  return {
    schemaVersion: REGISTRY_ARTIFACT_SCHEMA_VERSION,
    kind: "mcp-registry-feed",
    generatedAt: generatedAtForEntries(mcpEntries),
    count: mcpEntries.length,
    servers: mcpEntries.map((entry) => ({
      name: entry.slug,
      title: entry.title,
      description: entry.description,
      websiteUrl: entry.websiteUrl || entry.documentationUrl || "",
      ...buildEntryProvenanceFields(entry),
      ...buildEntryBrandFields(entry),
      repository: entry.repoUrl
        ? {
            url: entry.repoUrl,
            source: inferRepositorySource(entry.repoUrl),
          }
        : undefined,
      installCommand: entry.installCommand || "",
      configSnippet: entry.configSnippet || "",
      heyclaudeUrl: entryCanonicalUrl(entry),
    })),
  };
}

export function buildPluginExportFeed(entries) {
  const pluginEntries = entries.filter((entry) =>
    ["agents", "commands", "hooks", "mcp", "skills"].includes(entry.category),
  );
  const plugins = pluginEntries.map((entry) => ({
    name: entry.slug,
    title: entry.title,
    description: entry.cardDescription || entry.description,
    category: entry.category,
    ...buildEntryProvenanceFields(entry),
    ...buildEntryBrandFields(entry),
    sourceUrl: entry.repoUrl || entry.githubUrl || entry.documentationUrl,
    installCommand: entry.installCommand || entry.commandSyntax || "",
    platformCompatibility:
      entry.category === "skills" ? buildSkillPlatformCompatibility(entry) : [],
    heyclaudeUrl: entryCanonicalUrl(entry),
  }));

  return {
    schemaVersion: REGISTRY_ARTIFACT_SCHEMA_VERSION,
    kind: "plugin-export-feed",
    generatedAt: generatedAtForEntries(pluginEntries),
    count: plugins.length,
    plugins,
  };
}

export function buildRegistryChangelogFeed(entries, params = {}) {
  const relationLookup =
    params.relationLookup ??
    relationLookupFromGraph(
      buildRegistryRelationGraph(entries, {
        siteUrl: params.siteUrl ?? SITE_URL,
        generatedAt: generatedAtForEntries(entries),
        limit: params.relationLimit,
      }),
    );
  const changes = [...entries]
    .sort((left, right) => {
      const dateCompare = String(right.dateAdded || "").localeCompare(
        String(left.dateAdded || ""),
      );
      return dateCompare || left.title.localeCompare(right.title);
    })
    .map((entry) => ({
      key: `${entry.category}:${entry.slug}`,
      type: "added",
      category: entry.category,
      slug: entry.slug,
      title: entry.title,
      dateAdded: entry.dateAdded || "",
      canonicalUrl: entryCanonicalUrl(entry),
      llmsUrl: entryLlmsUrl(entry),
      apiUrl: entryApiUrl(entry),
      artifactHash: buildArtifactHash(
        buildEntryDetail(entry, { ...params, relationLookup }),
      ),
    }));

  const payload = {
    schemaVersion: REGISTRY_ARTIFACT_SCHEMA_VERSION,
    kind: "registry-changelog",
    generatedAt: generatedAtForEntries(entries),
    count: changes.length,
    entries: changes,
  };

  return {
    ...payload,
    signatureAlgorithm: "sha256",
    signature: buildArtifactHash(payload),
  };
}

export function platformFeedSlug(platform) {
  const text = String(platform || "")
    .trim()
    .toLowerCase();
  let output = "";
  let lastWasSeparator = false;

  for (const char of text) {
    const isAlphaNumeric =
      (char >= "a" && char <= "z") || (char >= "0" && char <= "9");
    if (isAlphaNumeric) {
      output += char;
      lastWasSeparator = false;
      continue;
    }
    if (char === "&") {
      if (output && !lastWasSeparator) output += "-";
      output += "and";
      lastWasSeparator = false;
      continue;
    }
    if (output && !lastWasSeparator) {
      output += "-";
      lastWasSeparator = true;
    }
  }

  return lastWasSeparator ? output.slice(0, -1) : output;
}

export function buildCategoryDistributionFeed(entries, category, params = {}) {
  const siteUrl = params.siteUrl ?? SITE_URL;
  const categoryEntries = entries.filter(
    (entry) => entry.category === category,
  );
  return {
    schemaVersion: REGISTRY_ARTIFACT_SCHEMA_VERSION,
    kind: "category-feed",
    category,
    generatedAt: generatedAtForEntries(categoryEntries),
    count: categoryEntries.length,
    entries: buildDirectoryEntries(categoryEntries).map((entry) => ({
      ...entry,
      canonicalUrl: entryCanonicalUrl(entry, siteUrl),
    })),
  };
}

export function buildPlatformDistributionFeed(entries, platform, params = {}) {
  const siteUrl = params.siteUrl ?? SITE_URL;
  const platformEntries = entries.filter((entry) =>
    buildSkillPlatformCompatibility(entry).some(
      (item) => item.platform === platform,
    ),
  );

  return {
    schemaVersion: REGISTRY_ARTIFACT_SCHEMA_VERSION,
    kind: "platform-feed",
    platform,
    platformSlug: platformFeedSlug(platform),
    generatedAt: generatedAtForEntries(platformEntries),
    count: platformEntries.length,
    entries: buildDirectoryEntries(platformEntries).map((entry) => ({
      ...entry,
      canonicalUrl: entryCanonicalUrl(entry, siteUrl),
    })),
  };
}

export function buildDistributionFeedIndex(entries, params = {}) {
  const siteUrl = params.siteUrl ?? SITE_URL;
  const categories = categorySpec.categoryOrder.map((category) => {
    const spec = categorySpec.categories[category];
    const count = entries.filter((entry) => entry.category === category).length;
    return {
      category,
      label: spec?.label ?? category,
      count,
      feedUrl: dataUrl("feeds", "categories", `${category}.json`),
      canonicalUrl: categoryCanonicalUrl(category, siteUrl),
    };
  });
  const platforms = [
    ...new Set(
      entries.flatMap((entry) =>
        buildSkillPlatformCompatibility(entry).map((item) => item.platform),
      ),
    ),
  ].map((platform) => ({
    platform,
    platformSlug: platformFeedSlug(platform),
    count: entries.filter((entry) =>
      buildSkillPlatformCompatibility(entry).some(
        (item) => item.platform === platform,
      ),
    ).length,
    feedUrl: dataUrl(
      "feeds",
      "platforms",
      `${platformFeedSlug(platform)}.json`,
    ),
  }));

  return {
    schemaVersion: REGISTRY_ARTIFACT_SCHEMA_VERSION,
    kind: "distribution-feed-index",
    generatedAt: generatedAtForEntries(entries),
    categories,
    platforms,
  };
}

export function buildRegistryManifest(entries, extra = {}) {
  const categories = {};
  for (const category of categorySpec.categoryOrder) {
    const categoryEntries = entries.filter(
      (entry) => entry.category === category,
    );
    categories[category] = {
      count: categoryEntries.length,
      label: categorySpec.categories[category]?.label ?? category,
    };
  }

  return {
    schemaVersion: REGISTRY_ARTIFACT_SCHEMA_VERSION,
    kind: "registry-manifest",
    generatedAt: generatedAtForEntries(entries),
    totalEntries: entries.length,
    categoryOrder: categorySpec.categoryOrder,
    categories,
    routes: entries.map((entry) => ({
      key: `${entry.category}:${entry.slug}`,
      category: entry.category,
      slug: entry.slug,
      canonicalUrl: entryCanonicalUrl(entry),
      llmsUrl: entryLlmsUrl(entry),
      apiUrl: entryApiUrl(entry),
    })),
    qualitySummary: buildContentQualityReport(entries).summary,
    trustSummary: buildRegistryTrustReport(entries).summary,
    artifacts: {
      directory: dataUrl("directory-index.json"),
      search: dataUrl("search-index.json"),
      raycast: dataUrl("raycast-index.json"),
      ecosystemFeed: dataUrl("ecosystem-feed.json"),
      mcpRegistryFeed: dataUrl("mcp-registry-feed.json"),
      pluginExportFeed: dataUrl("plugin-export-feed.json"),
      registryChangelog: dataUrl("registry-changelog.json"),
      registryManifest: dataUrl("registry-manifest.json"),
      registryTrust: dataUrl("registry-trust-report.json"),
      relationGraph: dataUrl("relation-graph.json"),
      contentQuality: dataUrl("content-quality-report.json"),
      contentQualityPrompts: dataUrl("content-quality-prompts.json"),
      qualityMethodology: "/quality#methodology",
      jsonLdSnapshots: dataUrl("jsonld-snapshots.json"),
      llmsFull: "/llms-full.txt",
      entryDetails: dataUrl("entries"),
      raycastDetails: dataUrl("raycast"),
      skillAdapters: dataUrl("skill-adapters"),
      distributionFeeds: dataUrl("feeds"),
      categoryFeeds: dataUrl("feeds", "categories"),
      platformFeeds: dataUrl("feeds", "platforms"),
    },
    artifactContracts: extra.artifactContracts ?? {},
  };
}

export function buildArtifactManifestV2(entries, extra = {}) {
  return buildRegistryManifest(entries, extra);
}

export function buildContentQualityArtifact(entries) {
  return buildContentQualityReport(entries);
}

export function buildContentPromptArtifact(entries) {
  return buildContentPromptReport(entries);
}

export function buildJsonLdSnapshots(entries, params = {}) {
  return {
    schemaVersion: REGISTRY_ARTIFACT_SCHEMA_VERSION,
    kind: "jsonld-snapshots",
    generatedAt: generatedAtForEntries(entries),
    count: entries.length,
    entries: entries.map((entry) => buildEntryJsonLdSnapshot(entry, params)),
  };
}

export function buildEntryLlmsArtifact(entry, params = {}) {
  return renderEntryLlms(entry, params);
}

export function buildCorpusLlmsArtifact(entries, params = {}) {
  return renderCorpusLlms(entries, params);
}

export function buildRegistryArtifactSet(entries, params = {}) {
  const siteUrl = params.siteUrl ?? SITE_URL;
  const siteName = params.siteName ?? "HeyClaude";
  const relationGraph = buildRegistryRelationGraph(entries, {
    siteUrl,
    limit: params.relationLimit,
    generatedAt: generatedAtForEntries(entries),
  });
  const relationLookup = relationLookupFromGraph(relationGraph);
  const files = [
    {
      path: "directory-index.json",
      type: "json",
      value: buildArtifactEnvelope(
        "directory-index",
        buildDirectoryEntries(entries),
      ),
    },
    {
      path: "search-index.json",
      type: "json",
      value: buildArtifactEnvelope("search-index", buildSearchEntries(entries)),
    },
    {
      path: "raycast-index.json",
      type: "json",
      value: buildRaycastEnvelope(entries),
    },
    {
      path: "ecosystem-feed.json",
      type: "json",
      value: buildReadOnlyEcosystemFeed(entries, { siteUrl }),
    },
    {
      path: "mcp-registry-feed.json",
      type: "json",
      value: buildMcpRegistryFeed(entries),
    },
    {
      path: "plugin-export-feed.json",
      type: "json",
      value: buildPluginExportFeed(entries),
    },
    {
      path: "registry-changelog.json",
      type: "json",
      value: buildRegistryChangelogFeed(entries, { relationLookup }),
    },
    {
      path: "relation-graph.json",
      type: "json",
      value: relationGraph,
    },
    {
      path: "registry-trust-report.json",
      type: "json",
      value: buildRegistryTrustReport(entries),
    },
    {
      path: "feeds/index.json",
      type: "json",
      value: buildDistributionFeedIndex(entries, { siteUrl }),
    },
    {
      path: "submission-spec.json",
      type: "json",
      value: buildSubmissionSpecs({ siteUrl }),
    },
    {
      path: "content-quality-report.json",
      type: "json",
      value: buildContentQualityArtifact(entries),
    },
    {
      path: "content-quality-prompts.json",
      type: "json",
      value: buildContentPromptArtifact(entries),
    },
    {
      path: "jsonld-snapshots.json",
      type: "json",
      value: buildJsonLdSnapshots(entries, { siteUrl, siteName }),
    },
  ];

  for (const entry of entries) {
    if (!SAFE_CONTENT_SLUG_PATTERN.test(String(entry.slug || ""))) {
      throw new Error(`Invalid content slug for artifact path: ${entry.slug}`);
    }

    files.push(
      {
        path: `entries/${entry.category}/${entry.slug}.json`,
        type: "json",
        value: buildEntryDetail(entry, { relationLookup }),
      },
      {
        path: `raycast/${entry.category}/${entry.slug}.json`,
        type: "json",
        value: buildRaycastDetail(entry),
      },
    );

    if (entry.category === "skills") {
      files.push({
        path: `skill-adapters/cursor/${entry.slug}.mdc`,
        type: "text",
        value: buildCursorSkillAdapter(entry),
      });
    }
  }

  for (const category of categorySpec.categoryOrder) {
    files.push({
      path: `feeds/categories/${category}.json`,
      type: "json",
      value: buildCategoryDistributionFeed(entries, category, { siteUrl }),
    });
  }

  const platforms = [
    ...new Set(
      entries.flatMap((entry) =>
        buildSkillPlatformCompatibility(entry).map((item) => item.platform),
      ),
    ),
  ];
  for (const platform of platforms) {
    files.push({
      path: `feeds/platforms/${platformFeedSlug(platform)}.json`,
      type: "json",
      value: buildPlatformDistributionFeed(entries, platform, { siteUrl }),
    });
  }

  const artifactContracts = Object.fromEntries(
    files.map((file) => [
      file.path,
      {
        path: dataUrl(file.path),
        type: file.type,
        sha256: buildArtifactHash(file.value, file.type),
      },
    ]),
  );

  files.push({
    path: "registry-manifest.json",
    type: "json",
    value: buildRegistryManifest(entries, { artifactContracts }),
  });

  return files;
}
