/**
 * Public weekly-brief draft surface.
 *
 * Pure selection, scoring, theme, and markdown helpers live in
 * `weekly-brief-lib.js`. This module re-exports that surface so existing
 * `@heyclaude/registry/weekly-brief`, package-root, and script imports stay
 * unchanged.
 */
export {
  WEEKLY_BRIEF_SCHEMA_VERSION,
  DEFAULT_LIMITS,
  text,
  list,
  keyFor,
  httpUrl,
  siteUrlBase,
  entryUrl,
  entryDescription,
  isoDate,
  isoTimestamp,
  daysBetween,
  normalizeDays,
  TERMINAL_CONTROL_PATTERN,
  markdownText,
  markdownUrl,
  sourceUrls,
  hasSource,
  hasInstallSurface,
  hasSaferInstallSignal,
  hasSafetyNotes,
  hasPrivacyNotes,
  trustScore,
  richnessScore,
  sortEntries,
  itemFromEntry,
  newEntryReasons,
  sourceBackedReasons,
  saferInstallReasons,
  selectEntries,
  changelogItem,
  selectChangelogChanges,
  CATEGORY_NOUNS,
  categoryNoun,
  briefTheme,
  buildWeeklyBrief,
  bullet,
  changeBullet,
  section,
  renderWeeklyBriefMarkdown,
} from "./weekly-brief-lib.js";
