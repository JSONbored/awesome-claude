/**
 * Public LLMS artifact renderer surface.
 *
 * Pure citation-fact builders and markdown exporters live in `llms-lib.js`.
 * This module re-exports that surface so existing `@heyclaude/registry/llms`
 * imports stay unchanged.
 */
export {
  LLMS_ARTIFACT_SCHEMA_VERSION,
  clean,
  trimLineEndings,
  sectionText,
  listValue,
  bulletList,
  entrySourceUrls,
  entryLastVerified,
  entryCitationFacts,
  buildEntryCitationFacts,
  renderEntryLlms,
  renderCorpusLlms,
} from "./llms-lib.js";
