import categorySpec from "./category-spec.json" with { type: "json" };
import { getCopyText } from "./presentation.js";

export const QUALITY_REPORT_SCHEMA_VERSION = 2;
export const SOURCE_HEALTH_REPORT_SCHEMA_VERSION = 1;

// Freshness buckets are derived from the most recent observable source
// timestamp on an entry (repoUpdatedAt preferred, dateAdded fallback).
// Bucket thresholds are intentionally aligned with the trust report's
// verification thresholds (180/365 days) so downstream surfaces can
// reason about "fresh" / "stale" uniformly across signals.
export const SOURCE_FRESHNESS_THRESHOLDS = Object.freeze({
  freshDays: 180,
  agingDays: 365,
  staleDays: 730,
});

// Categories where safety_notes / privacy_notes coverage is meaningful.
// Pulled from CONTRIBUTING.md and AGENTS.md: hooks, MCP servers,
// skills, commands, and statuslines should disclose safety/privacy
// behavior. Other categories (guides, collections, rules) have no
// runtime side-effects to disclose.
export const SAFETY_RELEVANT_CATEGORIES = Object.freeze([
  "hooks",
  "mcp",
  "skills",
  "commands",
  "statuslines",
]);

// Categories that ship installable packages whose trust metadata
// (downloadTrust / packageVerified / packageVerifiedAt) the directory
// surfaces to users.
export const PACKAGEABLE_CATEGORIES = Object.freeze(["skills", "mcp"]);

function clean(value) {
  return String(value ?? "").trim();
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function generatedAtForEntries(entries) {
  const latestDate = entries
    .map((entry) => clean(entry.dateAdded).slice(0, 10))
    .filter((value) => /^\d{4}-\d{2}-\d{2}$/.test(value))
    .sort()
    .at(-1);

  return latestDate
    ? `${latestDate}T00:00:00.000Z`
    : "1970-01-01T00:00:00.000Z";
}

function normalizeBodyForDuplicateCheck(entry) {
  return clean(entry.body)
    .replace(/```[\s\S]*?```/g, "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .trim();
}

function hashString(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

export function buildSourceProvenance(entry) {
  const sourceUrls = [
    entry.documentationUrl,
    entry.repoUrl,
    entry.githubUrl,
    entry.websiteUrl,
  ]
    .map(clean)
    .filter(Boolean);
  const externalSourceUrls = sourceUrls.filter(
    (url) => !url.includes("github.com/JSONbored/awesome-claude"),
  );
  const firstPartyPackage = entry.downloadTrust === "first-party";
  const hasExternalSource = externalSourceUrls.length > 0;
  const hasRepository = Boolean(clean(entry.repoUrl));
  const hasDocumentation = Boolean(clean(entry.documentationUrl));

  let sourceQuality = "source-free-first-party";
  if (hasRepository && hasDocumentation) sourceQuality = "repo-and-docs";
  else if (hasRepository) sourceQuality = "repo";
  else if (hasDocumentation) sourceQuality = "docs";
  else if (firstPartyPackage) sourceQuality = "verified-first-party-package";
  else if (clean(entry.githubUrl)) sourceQuality = "local-editorial-source";

  return {
    sourceQuality,
    hasExternalSource,
    hasRepository,
    hasDocumentation,
    hasFirstPartyPackage: firstPartyPackage,
    sourceUrls,
    externalSourceUrls,
  };
}

function scoreFreshness(entry, referenceDate = new Date()) {
  const date = clean(entry.repoUpdatedAt || entry.dateAdded);
  if (!date) return 35;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return 45;
  const referenceTime =
    referenceDate instanceof Date
      ? referenceDate.getTime()
      : new Date(referenceDate).getTime();
  const ageDays = Math.max(0, (referenceTime - parsed.getTime()) / 86_400_000);
  if (ageDays <= 180) return 100;
  if (ageDays <= 365) return 85;
  if (ageDays <= 730) return 65;
  return 45;
}

export function buildEntryQuality(entry, referenceDate) {
  const provenance = buildSourceProvenance(entry);
  const copyText = getCopyText(entry);
  const warnings = [];
  const descriptionLength = clean(entry.description).length;
  const seoDescriptionLength = clean(
    entry.seoDescription || entry.description,
  ).length;
  const hasUsableBody =
    clean(entry.body).length > 160 || clean(entry.usageSnippet).length > 40;
  const hasCopyableAsset = clean(copyText).length > 40;
  const hasActionPath = Boolean(
    clean(entry.installCommand) ||
    clean(entry.commandSyntax) ||
    clean(entry.configSnippet) ||
    clean(entry.downloadUrl) ||
    clean(entry.documentationUrl),
  );
  const hasExplicitEditorialProvenance = [
    "local-editorial-source",
    "source-free-first-party",
  ].includes(provenance.sourceQuality);

  if (
    !provenance.hasExternalSource &&
    !provenance.hasFirstPartyPackage &&
    !hasExplicitEditorialProvenance
  ) {
    warnings.push(
      "No external docs/repo source; label as editorial first-party content.",
    );
  }
  if (descriptionLength > 220) {
    warnings.push("Description is long for browse/search display.");
  }
  if (!clean(entry.seoTitle)) warnings.push("Missing explicit seoTitle.");
  if (!clean(entry.seoDescription))
    warnings.push("Missing explicit seoDescription.");
  if (!hasCopyableAsset) warnings.push("No substantial copyable asset text.");
  if (!hasActionPath)
    warnings.push("No install, config, download, or documentation path.");

  const usefulness = clampScore(
    20 +
      (descriptionLength >= 80 ? 25 : 10) +
      (hasUsableBody ? 25 : 0) +
      (hasActionPath ? 20 : 0) +
      (Array.isArray(entry.tags) && entry.tags.length >= 2 ? 10 : 0),
  );
  const source = clampScore(
    (provenance.hasRepository ? 35 : 0) +
      (provenance.hasDocumentation ? 30 : 0) +
      (provenance.hasFirstPartyPackage ? 25 : 0) +
      (hasExplicitEditorialProvenance ? 20 : 0) +
      (clean(entry.githubUrl) ? 10 : 0),
  );
  const copyability = clampScore(
    (hasCopyableAsset ? 45 : 0) +
      (clean(entry.installCommand) ? 20 : 0) +
      (clean(entry.configSnippet) ? 15 : 0) +
      (clean(entry.downloadUrl) ? 10 : 0) +
      (clean(entry.usageSnippet) ? 10 : 0),
  );
  const freshness = clampScore(scoreFreshness(entry, referenceDate));
  const seo = clampScore(
    (clean(entry.seoTitle) ? 20 : 0) +
      (seoDescriptionLength >= 80 && seoDescriptionLength <= 180 ? 30 : 12) +
      (Array.isArray(entry.keywords) && entry.keywords.length >= 2 ? 20 : 0) +
      (Array.isArray(entry.tags) && entry.tags.length >= 2 ? 20 : 0) +
      (entry.robotsIndex === false ? 0 : 10),
  );
  const total = clampScore(
    usefulness * 0.28 +
      source * 0.2 +
      copyability * 0.22 +
      freshness * 0.12 +
      seo * 0.18,
  );

  return {
    key: `${entry.category}:${entry.slug}`,
    category: entry.category,
    slug: entry.slug,
    title: entry.title,
    scores: {
      total,
      usefulness,
      source,
      copyability,
      freshness,
      seo,
    },
    provenance,
    warnings,
  };
}

export function findDuplicateBodyGroups(entries) {
  const buckets = new Map();

  for (const entry of entries) {
    const normalized = normalizeBodyForDuplicateCheck(entry);
    if (normalized.length < 180) continue;
    const key = hashString(normalized);
    const existing = buckets.get(key) ?? [];
    existing.push({
      key: `${entry.category}:${entry.slug}`,
      category: entry.category,
      slug: entry.slug,
      title: entry.title,
      normalizedLength: normalized.length,
    });
    buckets.set(key, existing);
  }

  return [...buckets.values()]
    .filter((items) => items.length > 1)
    .sort(
      (left, right) =>
        right.length - left.length || left[0].key.localeCompare(right[0].key),
    );
}

export function buildContentQualityReport(entries) {
  const generatedAt = generatedAtForEntries(entries);
  const referenceDate = new Date(generatedAt);
  const entryReports = entries.map((entry) =>
    buildEntryQuality(entry, referenceDate),
  );
  const duplicateBodyGroups = findDuplicateBodyGroups(entries);
  const noExternalSourceCount = entryReports.filter(
    (entry) => !entry.provenance.hasExternalSource,
  ).length;
  const firstPartyEditorialCount = entryReports.filter((entry) =>
    ["local-editorial-source", "source-free-first-party"].includes(
      entry.provenance.sourceQuality,
    ),
  ).length;
  const unprovenancedSourceCount = entryReports.filter(
    (entry) =>
      !entry.provenance.hasExternalSource &&
      !entry.provenance.hasFirstPartyPackage &&
      !["local-editorial-source", "source-free-first-party"].includes(
        entry.provenance.sourceQuality,
      ),
  ).length;
  const missingSeoCount = entryReports.filter((entry) =>
    entry.warnings.some((warning) =>
      warning.startsWith("Missing explicit seo"),
    ),
  ).length;
  const categoryBreakdown = Object.fromEntries(
    categorySpec.categoryOrder.map((category) => {
      const reports = entryReports.filter(
        (entry) => entry.category === category,
      );
      const averageScore = reports.length
        ? clampScore(
            reports.reduce((sum, entry) => sum + entry.scores.total, 0) /
              reports.length,
          )
        : 0;

      return [
        category,
        {
          count: reports.length,
          averageScore,
          warningCount: reports.reduce(
            (sum, entry) => sum + entry.warnings.length,
            0,
          ),
        },
      ];
    }),
  );

  return {
    schemaVersion: QUALITY_REPORT_SCHEMA_VERSION,
    kind: "content-quality-report",
    generatedAt,
    count: entryReports.length,
    summary: {
      averageScore: entryReports.length
        ? clampScore(
            entryReports.reduce((sum, entry) => sum + entry.scores.total, 0) /
              entryReports.length,
          )
        : 0,
      noExternalSourceCount,
      firstPartyEditorialCount,
      unprovenancedSourceCount,
      missingSeoCount,
      duplicateBodyGroupCount: duplicateBodyGroups.length,
    },
    categoryBreakdown,
    duplicateBodyGroups,
    entries: entryReports,
  };
}

export function buildContentPromptReport(entries, maxPrompts = 30) {
  const quality = buildContentQualityReport(entries);
  const prompts = quality.entries
    .filter((entry) => entry.warnings.length > 0 || entry.scores.total < 80)
    .sort(
      (left, right) =>
        left.scores.total - right.scores.total ||
        right.warnings.length - left.warnings.length ||
        left.key.localeCompare(right.key),
    )
    .slice(0, maxPrompts)
    .map((entry) => ({
      key: entry.key,
      category: entry.category,
      slug: entry.slug,
      title: entry.title,
      score: entry.scores.total,
      priority:
        entry.scores.total < 60
          ? "high"
          : entry.scores.total < 75
            ? "medium"
            : "low",
      prompt: [
        `Improve ${entry.title} (${entry.key}).`,
        entry.warnings.length
          ? `Address: ${entry.warnings.join(" ")}`
          : "Tighten usefulness, source, copyability, freshness, or SEO metadata.",
      ].join(" "),
      warnings: entry.warnings,
    }));

  return {
    schemaVersion: QUALITY_REPORT_SCHEMA_VERSION,
    kind: "content-quality-prompts",
    generatedAt: quality.generatedAt,
    count: prompts.length,
    prompts,
  };
}

function pickSourceDate(entry) {
  const repoUpdated = clean(entry.repoUpdatedAt);
  if (repoUpdated) return { sourceDate: repoUpdated, source: "repoUpdatedAt" };
  const lastVerified = clean(entry.lastVerifiedAt);
  if (lastVerified)
    return { sourceDate: lastVerified, source: "lastVerifiedAt" };
  const added = clean(entry.dateAdded);
  if (added) return { sourceDate: added, source: "dateAdded" };
  return { sourceDate: "", source: "" };
}

export function deriveSourceFreshness(entry, referenceDate = new Date()) {
  const { sourceDate, source } = pickSourceDate(entry);
  if (!sourceDate) {
    return { bucket: "unknown", ageDays: null, sourceDate: "", source: "" };
  }
  const parsed = new Date(sourceDate);
  if (Number.isNaN(parsed.getTime())) {
    return { bucket: "unknown", ageDays: null, sourceDate, source };
  }
  const referenceTime =
    referenceDate instanceof Date
      ? referenceDate.getTime()
      : new Date(referenceDate).getTime();
  const ageDays = Math.max(
    0,
    Math.floor((referenceTime - parsed.getTime()) / 86_400_000),
  );
  let bucket;
  if (ageDays <= SOURCE_FRESHNESS_THRESHOLDS.freshDays) bucket = "fresh";
  else if (ageDays <= SOURCE_FRESHNESS_THRESHOLDS.agingDays) bucket = "aging";
  else if (ageDays <= SOURCE_FRESHNESS_THRESHOLDS.staleDays) bucket = "stale";
  else bucket = "dormant";
  return { bucket, ageDays, sourceDate, source };
}

function hasNonEmptyStringArray(value) {
  return (
    Array.isArray(value) &&
    value.some((item) => clean(typeof item === "string" ? item : "").length > 0)
  );
}

function isSafetyRelevant(category) {
  return SAFETY_RELEVANT_CATEGORIES.includes(category);
}

function isPackageable(category) {
  return PACKAGEABLE_CATEGORIES.includes(category);
}

export function buildEntrySourceHealth(entry, referenceDate = new Date()) {
  const provenance = buildSourceProvenance(entry);
  const freshness = deriveSourceFreshness(entry, referenceDate);
  const hasSafetyNotes = hasNonEmptyStringArray(entry.safetyNotes);
  const hasPrivacyNotes = hasNonEmptyStringArray(entry.privacyNotes);
  const sourceBacked =
    provenance.hasExternalSource ||
    provenance.hasFirstPartyPackage ||
    provenance.sourceQuality === "local-editorial-source" ||
    provenance.sourceQuality === "source-free-first-party";
  const unprovenancedSource =
    !provenance.hasExternalSource &&
    !provenance.hasFirstPartyPackage &&
    provenance.sourceQuality !== "local-editorial-source" &&
    provenance.sourceQuality !== "source-free-first-party";

  const safetyRelevant = isSafetyRelevant(entry.category);
  const packageable = isPackageable(entry.category);

  const missingSafetyNotes = safetyRelevant && !hasSafetyNotes;
  const missingPrivacyNotes = safetyRelevant && !hasPrivacyNotes;
  const packageTrust = entry.downloadTrust || null;
  const packageVerified = entry.packageVerified === true;
  // Skills/MCP entries that don't disclose a downloadTrust label OR
  // aren't first-party packages are the ones a tenant needs to evaluate
  // manually. We don't gate on packageVerified here because community
  // submissions are intentionally not auto-verified.
  const missingPackageTrust = packageable && !packageTrust;

  const stale = freshness.bucket === "stale" || freshness.bucket === "dormant";
  const attentionReasons = [];
  if (unprovenancedSource) attentionReasons.push("unprovenanced-source");
  if (stale) attentionReasons.push("stale-source");
  if (freshness.bucket === "unknown")
    attentionReasons.push("unknown-source-date");
  if (missingSafetyNotes) attentionReasons.push("missing-safety-notes");
  if (missingPrivacyNotes) attentionReasons.push("missing-privacy-notes");
  if (missingPackageTrust) attentionReasons.push("missing-package-trust");

  return {
    key: `${entry.category}:${entry.slug}`,
    category: entry.category,
    slug: entry.slug,
    title: entry.title,
    freshness,
    sourceBacked,
    unprovenancedSource,
    hasSafetyNotes,
    hasPrivacyNotes,
    missingSafetyNotes,
    missingPrivacyNotes,
    packageTrust,
    packageVerified,
    missingPackageTrust,
    needsAttention: attentionReasons.length > 0,
    attentionReasons,
  };
}

function emptyFreshnessBuckets() {
  return { fresh: 0, aging: 0, stale: 0, dormant: 0, unknown: 0 };
}

function incrementBucket(buckets, bucket) {
  if (Object.hasOwn(buckets, bucket)) {
    buckets[bucket] += 1;
  }
}

function buildSourceHealthCategoryBreakdown(rows) {
  return Object.fromEntries(
    categorySpec.categoryOrder.map((category) => {
      const categoryRows = rows.filter((row) => row.category === category);
      const buckets = emptyFreshnessBuckets();
      for (const row of categoryRows) {
        incrementBucket(buckets, row.freshness.bucket);
      }
      return [
        category,
        {
          count: categoryRows.length,
          freshness: buckets,
          sourceBackedCount: categoryRows.filter((row) => row.sourceBacked)
            .length,
          unprovenancedSourceCount: categoryRows.filter(
            (row) => row.unprovenancedSource,
          ).length,
          missingSafetyNotesCount: categoryRows.filter(
            (row) => row.missingSafetyNotes,
          ).length,
          missingPrivacyNotesCount: categoryRows.filter(
            (row) => row.missingPrivacyNotes,
          ).length,
          missingPackageTrustCount: categoryRows.filter(
            (row) => row.missingPackageTrust,
          ).length,
          packageVerifiedCount: categoryRows.filter(
            (row) => row.packageVerified,
          ).length,
          needsAttentionCount: categoryRows.filter((row) => row.needsAttention)
            .length,
        },
      ];
    }),
  );
}

export function buildSourceHealthReport(entries) {
  const generatedAt = generatedAtForEntries(entries);
  const referenceDate = new Date(generatedAt);
  const rows = entries.map((entry) =>
    buildEntrySourceHealth(entry, referenceDate),
  );

  const freshnessBuckets = emptyFreshnessBuckets();
  for (const row of rows) {
    incrementBucket(freshnessBuckets, row.freshness.bucket);
  }

  const sourceBackedCount = rows.filter((row) => row.sourceBacked).length;
  const unprovenancedSourceCount = rows.filter(
    (row) => row.unprovenancedSource,
  ).length;
  const missingSafetyNotesCount = rows.filter(
    (row) => row.missingSafetyNotes,
  ).length;
  const missingPrivacyNotesCount = rows.filter(
    (row) => row.missingPrivacyNotes,
  ).length;
  const missingPackageTrustCount = rows.filter(
    (row) => row.missingPackageTrust,
  ).length;
  const packageVerifiedCount = rows.filter((row) => row.packageVerified).length;
  const needsAttentionCount = rows.filter((row) => row.needsAttention).length;

  return {
    schemaVersion: SOURCE_HEALTH_REPORT_SCHEMA_VERSION,
    kind: "content-source-health-report",
    generatedAt,
    count: rows.length,
    thresholds: { ...SOURCE_FRESHNESS_THRESHOLDS },
    safetyRelevantCategories: [...SAFETY_RELEVANT_CATEGORIES],
    packageableCategories: [...PACKAGEABLE_CATEGORIES],
    summary: {
      freshness: freshnessBuckets,
      sourceBackedCount,
      unprovenancedSourceCount,
      missingSafetyNotesCount,
      missingPrivacyNotesCount,
      missingPackageTrustCount,
      packageVerifiedCount,
      needsAttentionCount,
    },
    categoryBreakdown: buildSourceHealthCategoryBreakdown(rows),
    entries: rows,
  };
}
