/**
 * Public MDX content-entry builder surface.
 *
 * Pure field normalizers and entry assembly live in `content-builder-lib.js`.
 * This module re-exports that surface so existing
 * `@heyclaude/registry/content-builder`, scripts, and package-root imports stay
 * unchanged.
 */
export {
  DEFAULT_DIRECTORY_REPO_URL,
  buildGitHubUrl,
  parseGitHubRepo,
  normalizeDownloadUrl,
  normalizeDateAdded,
  normalizeTextField,
  normalizeStringList,
  normalizeDateTimeField,
  normalizePositiveInteger,
  normalizeClaimStatus,
  buildProvenanceFields,
  isFirstPartyPackage,
  isLocalDownloadUrl,
  localDownloadSourcePath,
  buildDefaultSkillPlatformCompatibility,
  normalizePlatformCompatibility,
  buildContentEntryFromMdx,
} from "./content-builder-lib.js";
