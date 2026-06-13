import categorySpec from "./category-spec.json" with { type: "json" };
import { getCopyText } from "./presentation.js";

export const QUALITY_REPORT_SCHEMA_VERSION = 2;

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

export const SOURCE_HEALTH_REPORT_SCHEMA_VERSION = 1;

const SOURCE_HEALTH_RISK_CATEGORIES = new Set([
  "mcp",
  "hooks",
  "skills",
  "statuslines",
  "commands",
]);

const SOURCE_FRESHNESS_THRESHOLDS = {
  freshMaxDays: 180,
  agingMaxDays: 365,
  staleMaxDays: 730,
};

function isRiskBearingSourceCategory(category) {
  return SOURCE_HEALTH_RISK_CATEGORIES.has(clean(category));
}

function hasMeaningfulNotes(value) {
  return Array.isArray(value) && value.some((item) => clean(item).length > 0);
}

function percentOf(count, total) {
  return total > 0 ? Math.round((count / total) * 100) : 0;
}

function deriveSourceFreshness(entry, referenceDate = new Date()) {
  const raw = clean(entry.repoUpdatedAt || entry.dateAdded);
  if (!raw) {
    return { freshness: "unknown", ageDays: null, lastActivityAt: "" };
  }
  const parsedTime = new Date(raw).getTime();
  if (!Number.isFinite(parsedTime)) {
    return { freshness: "unknown", ageDays: null, lastActivityAt: "" };
  }
  const referenceTime =
    referenceDate instanceof Date
      ? referenceDate.getTime()
      : new Date(referenceDate).getTime();
  if (!Number.isFinite(referenceTime)) {
    return {
      freshness: "unknown",
      ageDays: null,
      lastActivityAt: new Date(parsedTime).toISOString(),
    };
  }
  const ageDays = Math.max(
    0,
    Math.floor((referenceTime - parsedTime) / 86_400_000),
  );
  let freshness = "dormant";
  if (ageDays <= SOURCE_FRESHNESS_THRESHOLDS.freshMaxDays) {
    freshness = "fresh";
  } else if (ageDays <= SOURCE_FRESHNESS_THRESHOLDS.agingMaxDays) {
    freshness = "aging";
  } else if (ageDays <= SOURCE_FRESHNESS_THRESHOLDS.staleMaxDays) {
    freshness = "stale";
  }
  return {
    freshness,
    ageDays,
    lastActivityAt: new Date(parsedTime).toISOString(),
  };
}

function derivePackageTrust(entry) {
  const downloadTrust = clean(entry.downloadTrust);
  const packageVerified = entry.packageVerified === true;
  return {
    packageTrust: downloadTrust || null,
    packageVerified,
    hasPackageTrust: downloadTrust === "first-party" || packageVerified,
  };
}

export function buildEntrySourceHealth(entry, referenceDate) {
  const provenance = buildSourceProvenance(entry);
  const sourceStatus =
    provenance.sourceUrls.length > 0 ? "available" : "missing";
  const { freshness, ageDays, lastActivityAt } = deriveSourceFreshness(
    entry,
    referenceDate,
  );
  const pkg = derivePackageTrust(entry);
  const hasSafetyNotes = hasMeaningfulNotes(entry.safetyNotes);
  const hasPrivacyNotes = hasMeaningfulNotes(entry.privacyNotes);
  const riskBearing = isRiskBearingSourceCategory(entry.category);

  const attentionReasons = [];
  if (sourceStatus === "missing") {
    attentionReasons.push("missing-source");
  }
  if (freshness === "stale" || freshness === "dormant") {
    attentionReasons.push("stale-source");
  }
  if (riskBearing && !hasSafetyNotes) {
    attentionReasons.push("missing-safety-notes");
  }
  if (riskBearing && !hasPrivacyNotes) {
    attentionReasons.push("missing-privacy-notes");
  }

  return {
    key: `${entry.category}:${entry.slug}`,
    category: entry.category,
    slug: entry.slug,
    title: entry.title,
    sourceStatus,
    sourceQuality: provenance.sourceQuality,
    freshness,
    ageDays,
    lastActivityAt,
    hasSafetyNotes,
    hasPrivacyNotes,
    packageTrust: pkg.packageTrust,
    packageVerified: pkg.packageVerified,
    hasPackageTrust: pkg.hasPackageTrust,
    riskBearing,
    needsAttention: attentionReasons.length > 0,
    attentionReasons,
  };
}

function buildSourceHealthCategoryBreakdown(rows) {
  return Object.fromEntries(
    categorySpec.categoryOrder.map((category) => {
      const categoryRows = rows.filter((row) => row.category === category);
      const countWhere = (predicate) =>
        categoryRows.reduce((sum, row) => sum + (predicate(row) ? 1 : 0), 0);

      return [
        category,
        {
          count: categoryRows.length,
          sourceBacked: countWhere((row) => row.sourceStatus === "available"),
          stale: countWhere(
            (row) => row.freshness === "stale" || row.freshness === "dormant",
          ),
          missingSafetyNotes: countWhere(
            (row) => row.riskBearing && !row.hasSafetyNotes,
          ),
          missingPrivacyNotes: countWhere(
            (row) => row.riskBearing && !row.hasPrivacyNotes,
          ),
          packageTrust: countWhere((row) => row.hasPackageTrust),
          needsAttention: countWhere((row) => row.needsAttention),
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
  const total = rows.length;
  const countWhere = (predicate) =>
    rows.reduce((sum, row) => sum + (predicate(row) ? 1 : 0), 0);

  const sourceBackedCount = countWhere(
    (row) => row.sourceStatus === "available",
  );
  const packageTrustCount = countWhere((row) => row.hasPackageTrust);

  return {
    schemaVersion: SOURCE_HEALTH_REPORT_SCHEMA_VERSION,
    kind: "source-health-report",
    generatedAt,
    count: total,
    thresholds: { ...SOURCE_FRESHNESS_THRESHOLDS },
    summary: {
      sourceBackedCount,
      sourceBackedPercent: percentOf(sourceBackedCount, total),
      missingSourceCount: total - sourceBackedCount,
      freshCount: countWhere((row) => row.freshness === "fresh"),
      agingCount: countWhere((row) => row.freshness === "aging"),
      staleCount: countWhere((row) => row.freshness === "stale"),
      dormantCount: countWhere((row) => row.freshness === "dormant"),
      unknownFreshnessCount: countWhere((row) => row.freshness === "unknown"),
      riskBearingCount: countWhere((row) => row.riskBearing),
      missingSafetyNotesCount: countWhere(
        (row) => row.riskBearing && !row.hasSafetyNotes,
      ),
      missingPrivacyNotesCount: countWhere(
        (row) => row.riskBearing && !row.hasPrivacyNotes,
      ),
      packageTrustCount,
      packageTrustPercent: percentOf(packageTrustCount, total),
      needsAttentionCount: countWhere((row) => row.needsAttention),
    },
    categoryBreakdown: buildSourceHealthCategoryBreakdown(rows),
    entries: rows,
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
