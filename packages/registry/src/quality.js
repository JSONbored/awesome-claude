/**
 * Public content-quality and source-health report surface.
 *
 * Pure scoring, provenance classification, freshness derivation, and report
 * aggregation live in `quality-lib.js`. This module re-exports that surface so
 * existing `@heyclaude/registry/quality`, `artifacts.js`, and package-root
 * imports stay unchanged.
 */
export {
  QUALITY_REPORT_SCHEMA_VERSION,
  SOURCE_HEALTH_REPORT_SCHEMA_VERSION,
  SOURCE_HEALTH_RISK_CATEGORIES,
  SOURCE_FRESHNESS_THRESHOLDS,
  clean,
  clampScore,
  generatedAtForEntries,
  normalizeBodyForDuplicateCheck,
  buildSourceProvenance,
  scoreFreshness,
  buildEntryQuality,
  findDuplicateBodyGroups,
  buildContentQualityReport,
  isRiskBearingSourceCategory,
  hasMeaningfulNotes,
  percentOf,
  deriveSourceFreshness,
  derivePackageTrust,
  buildEntrySourceHealth,
  buildSourceHealthCategoryBreakdown,
  buildSourceHealthReport,
  buildContentPromptReport,
} from "./quality-lib.js";
