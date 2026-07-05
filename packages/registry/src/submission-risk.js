/**
 * Submission risk analysis surface.
 *
 * Pure submission risk helpers live in `submission-risk-lib.js`. This module
 * re-exports that surface so existing `@heyclaude/registry/submission-risk`
 * imports stay unchanged.
 */
export {
  SUBMISSION_RISK_COMMENT_MARKER,
  SUBMISSION_RISK_SCHEMA_VERSION,
  analyzeDirectContentRisk,
  analyzeSubmissionDraftRisk,
  directContentRequestChangesReasons,
  formatSubmissionRiskMarkdown,
} from "./submission-risk-lib.js";
