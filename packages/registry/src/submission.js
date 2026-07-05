/**
 * Submission parsing and validation surface.
 *
 * Pure submission helpers live in `submission-lib.js`. This module re-exports
 * that surface so existing `@heyclaude/registry/submission` imports stay
 * unchanged.
 */
export {
  CATEGORY_REQUIREMENTS,
  COMMON_REQUIRED_FIELDS,
  CORE_CATEGORIES,
  HEADING_KEY_MAP,
  buildSubmissionPrBody,
  buildSubmissionPrDraft,
  buildSubmissionPrTitle,
  isLikelyAffiliateUrl,
  looksLikeSubmissionPrDraft,
  normalizeCategory,
  normalizeHeading,
  normalizeParsedFields,
  normalizeSubmissionPayloadFields,
  normalizeValue,
  parseSubmissionPrBody,
  slugify,
  validateSubmission,
} from "./submission-lib.js";
