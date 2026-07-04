/**
 * Public submission-spec surface.
 *
 * Pure field-model and intake-spec builders live in `submission-spec-lib.js`.
 * This module re-exports that surface so existing
 * `@heyclaude/registry/submission-spec` imports stay unchanged.
 */
export {
  SUBMISSION_SPEC_SCHEMA_VERSION,
  RISK_BEARING_SUBMISSION_CATEGORIES,
  BASE_FIELDS,
  FIELD_LIBRARY,
  OPTIONAL_FIELDS,
  fieldFor,
  buildSubmissionFieldModel,
  submitUrlForOrigin,
  buildSubmissionSpecs,
} from "./submission-spec-lib.js";
