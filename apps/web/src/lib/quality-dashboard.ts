import type {
  RegistryTrustReport,
  RegistryTrustReportEntry,
} from "@heyclaude/registry";

const RISK_BEARING_CATEGORIES = [
  "mcp",
  "hooks",
  "skills",
  "statuslines",
  "commands",
] as const;

const RISK_BEARING_CATEGORY_SET: ReadonlySet<string> = new Set(
  RISK_BEARING_CATEGORIES,
);

const DEFAULT_WEAKEST_CATEGORY_LIMIT = 4;
const DEFAULT_GAP_LIMIT = 12;

export interface CategoryTrustRow {
  category: string;
  count: number;
  brandCoverage: number;
  brandPercent: number;
  sourceAvailable: number;
  sourcePercent: number;
  safetyNotesPresent: number;
  safetyNotesPercent: number;
  privacyNotesPresent: number;
  privacyNotesPercent: number;
  claimedOrReviewed: number;
  claimedOrReviewedPercent: number;
  firstPartyPackage: number;
  firstPartyPackagePercent: number;
  provenancePresent: number;
  provenancePercent: number;
  recommendedFixes: number;
  riskBearing: boolean;
  trustCoverageScore: number;
}

export interface SafetyPrivacyGap {
  category: string;
  slug: string;
  key: string;
  title: string;
  missingSafetyNotes: boolean;
  missingPrivacyNotes: boolean;
}

export interface RiskBearingTotals {
  totalEntries: number;
  totalMissingSafetyNotes: number;
  totalMissingPrivacyNotes: number;
  safetyCoveragePercent: number;
  privacyCoveragePercent: number;
}

export interface ProvenanceCoverage {
  totalEntries: number;
  provenancePresent: number;
  provenancePercent: number;
  sourceAvailable: number;
  sourcePercent: number;
  missingSourceCount: number;
}

export interface QualityDashboardSummary {
  riskBearingCategories: string[];
  categoryTrustRows: CategoryTrustRow[];
  missingSafetyNotes: SafetyPrivacyGap[];
  missingPrivacyNotes: SafetyPrivacyGap[];
  weakestCategories: CategoryTrustRow[];
  riskBearingTotals: RiskBearingTotals;
  provenanceCoverage: ProvenanceCoverage;
}

export function isRiskBearingCategory(category: string): boolean {
  return RISK_BEARING_CATEGORY_SET.has(category);
}

export function toSafePathSegment(value: string): string {
  return encodeURIComponent(String(value ?? "").trim());
}

export function buildCategoryHref(category: string): string {
  return `/${toSafePathSegment(category)}`;
}

export function buildEntryHref(category: string, slug: string): string {
  return `/${toSafePathSegment(category)}/${toSafePathSegment(slug)}`;
}

function percent(part: number, total: number): number {
  if (total <= 0) {
    return 0;
  }
  return Math.round((part / total) * 100);
}

function coverageScore(row: {
  sourcePercent: number;
  brandPercent: number;
  safetyNotesPercent: number;
  privacyNotesPercent: number;
  provenancePercent: number;
}): number {
  return (
    row.sourcePercent +
    row.brandPercent +
    row.safetyNotesPercent +
    row.privacyNotesPercent +
    row.provenancePercent
  );
}

function countClaimedOrReviewedByCategory(
  entries: ReadonlyArray<RegistryTrustReportEntry>,
): Map<string, number> {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    if (entry.claimStatus === "verified" || Boolean(entry.reviewedBy)) {
      counts.set(entry.category, (counts.get(entry.category) ?? 0) + 1);
    }
  }
  return counts;
}

export function buildCategoryTrustRows(
  report: RegistryTrustReport,
): CategoryTrustRow[] {
  const entries = Array.isArray(report.entries) ? report.entries : [];
  const claimedByCategory = countClaimedOrReviewedByCategory(entries);
  const breakdown = report.categoryBreakdown ?? {};
  const rows: CategoryTrustRow[] = [];
  for (const [category, value] of Object.entries(breakdown)) {
    if (!value || value.count <= 0) {
      continue;
    }
    const claimedOrReviewedCount = claimedByCategory.get(category) ?? 0;
    const sourcePercent = percent(value.sourceAvailable, value.count);
    const brandPercent = percent(value.brandCoverage, value.count);
    const safetyNotesPercent = percent(value.safetyNotesPresent, value.count);
    const privacyNotesPercent = percent(value.privacyNotesPresent, value.count);
    const provenancePercent = percent(value.provenancePresent, value.count);
    rows.push({
      category,
      count: value.count,
      brandCoverage: value.brandCoverage,
      brandPercent,
      sourceAvailable: value.sourceAvailable,
      sourcePercent,
      safetyNotesPresent: value.safetyNotesPresent,
      safetyNotesPercent,
      privacyNotesPresent: value.privacyNotesPresent,
      privacyNotesPercent,
      claimedOrReviewed: claimedOrReviewedCount,
      claimedOrReviewedPercent: percent(claimedOrReviewedCount, value.count),
      firstPartyPackage: value.firstPartyPackage,
      firstPartyPackagePercent: percent(value.firstPartyPackage, value.count),
      provenancePresent: value.provenancePresent,
      provenancePercent,
      recommendedFixes: value.recommendedFixes,
      riskBearing: isRiskBearingCategory(category),
      trustCoverageScore: coverageScore({
        sourcePercent,
        brandPercent,
        safetyNotesPercent,
        privacyNotesPercent,
        provenancePercent,
      }),
    });
  }
  rows.sort((left, right) => left.category.localeCompare(right.category));
  return rows;
}

export function findSafetyPrivacyGaps(
  report: RegistryTrustReport,
  limit: number = DEFAULT_GAP_LIMIT,
): {
  missingSafetyNotes: SafetyPrivacyGap[];
  missingPrivacyNotes: SafetyPrivacyGap[];
} {
  const entries = Array.isArray(report.entries) ? report.entries : [];
  const missingSafetyNotes: SafetyPrivacyGap[] = [];
  const missingPrivacyNotes: SafetyPrivacyGap[] = [];
  for (const entry of entries) {
    if (!isRiskBearingCategory(entry.category)) {
      continue;
    }
    const lacksSafety = !entry.hasSafetyNotes;
    const lacksPrivacy = !entry.hasPrivacyNotes;
    if (!lacksSafety && !lacksPrivacy) {
      continue;
    }
    const gap: SafetyPrivacyGap = {
      category: entry.category,
      slug: entry.slug,
      key: entry.key,
      title: entry.title,
      missingSafetyNotes: lacksSafety,
      missingPrivacyNotes: lacksPrivacy,
    };
    if (lacksSafety) {
      missingSafetyNotes.push(gap);
    }
    if (lacksPrivacy) {
      missingPrivacyNotes.push(gap);
    }
  }
  const byCategoryThenTitle = (
    left: SafetyPrivacyGap,
    right: SafetyPrivacyGap,
  ): number => {
    const categoryDelta = left.category.localeCompare(right.category);
    if (categoryDelta !== 0) {
      return categoryDelta;
    }
    return left.title.localeCompare(right.title);
  };
  missingSafetyNotes.sort(byCategoryThenTitle);
  missingPrivacyNotes.sort(byCategoryThenTitle);
  return {
    missingSafetyNotes: missingSafetyNotes.slice(0, limit),
    missingPrivacyNotes: missingPrivacyNotes.slice(0, limit),
  };
}

export function rankWeakestTrustCategories(
  rows: ReadonlyArray<CategoryTrustRow>,
  limit: number = DEFAULT_WEAKEST_CATEGORY_LIMIT,
): CategoryTrustRow[] {
  return [...rows]
    .filter((row) => row.count > 0)
    .sort((left, right) => {
      if (left.trustCoverageScore !== right.trustCoverageScore) {
        return left.trustCoverageScore - right.trustCoverageScore;
      }
      if (left.recommendedFixes !== right.recommendedFixes) {
        return right.recommendedFixes - left.recommendedFixes;
      }
      return left.category.localeCompare(right.category);
    })
    .slice(0, limit);
}

export function summarizeRiskBearingTotals(
  report: RegistryTrustReport,
): RiskBearingTotals {
  const entries = Array.isArray(report.entries) ? report.entries : [];
  let totalEntries = 0;
  let totalMissingSafetyNotes = 0;
  let totalMissingPrivacyNotes = 0;
  for (const entry of entries) {
    if (!isRiskBearingCategory(entry.category)) {
      continue;
    }
    totalEntries += 1;
    if (!entry.hasSafetyNotes) {
      totalMissingSafetyNotes += 1;
    }
    if (!entry.hasPrivacyNotes) {
      totalMissingPrivacyNotes += 1;
    }
  }
  return {
    totalEntries,
    totalMissingSafetyNotes,
    totalMissingPrivacyNotes,
    safetyCoveragePercent: percent(
      totalEntries - totalMissingSafetyNotes,
      totalEntries,
    ),
    privacyCoveragePercent: percent(
      totalEntries - totalMissingPrivacyNotes,
      totalEntries,
    ),
  };
}

export function summarizeProvenanceCoverage(
  report: RegistryTrustReport,
): ProvenanceCoverage {
  const entries = Array.isArray(report.entries) ? report.entries : [];
  const total = entries.length;
  let provenancePresent = 0;
  let sourceAvailable = 0;
  for (const entry of entries) {
    if (entry.hasProvenance) {
      provenancePresent += 1;
    }
    if (entry.sourceStatus === "available") {
      sourceAvailable += 1;
    }
  }
  return {
    totalEntries: total,
    provenancePresent,
    provenancePercent: percent(provenancePresent, total),
    sourceAvailable,
    sourcePercent: percent(sourceAvailable, total),
    missingSourceCount: total - sourceAvailable,
  };
}

export function buildQualityDashboardSummary(
  report: RegistryTrustReport,
): QualityDashboardSummary {
  const categoryTrustRows = buildCategoryTrustRows(report);
  const gaps = findSafetyPrivacyGaps(report);
  return {
    riskBearingCategories: [...RISK_BEARING_CATEGORIES],
    categoryTrustRows,
    missingSafetyNotes: gaps.missingSafetyNotes,
    missingPrivacyNotes: gaps.missingPrivacyNotes,
    weakestCategories: rankWeakestTrustCategories(categoryTrustRows),
    riskBearingTotals: summarizeRiskBearingTotals(report),
    provenanceCoverage: summarizeProvenanceCoverage(report),
  };
}
