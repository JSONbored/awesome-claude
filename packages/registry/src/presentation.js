/**
 * Public registry presentation surface.
 *
 * Pure count formatting, preview/copy builders, distribution badges, and access
 * summaries live in `presentation-lib.js`. This module re-exports that surface
 * so existing `@heyclaude/registry/presentation` and package-root imports stay
 * unchanged.
 */
export {
  compactCount,
  parseAbbreviatedCount,
  firstUsefulLine,
  extractConfigCommand,
  buildCollectionSequence,
  getPreviewLine,
  appendLabeledBlock,
  getCopyText,
  getDistributionBadges,
  getEntryAccessSummary,
} from "./presentation-lib.js";
