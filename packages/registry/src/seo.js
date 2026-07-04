/**
 * Public SEO / JSON-LD document surface.
 *
 * Pure structured-data builders live in `seo-lib.js`. This module re-exports
 * that surface so existing `@heyclaude/registry/seo` and package-root imports
 * stay unchanged.
 */
export {
  absoluteSiteUrl,
  uniqueValues,
  buildOrganizationJsonLd,
  buildWebsiteJsonLd,
  buildSearchActionJsonLd,
  buildWebPageJsonLd,
  buildCollectionPageJsonLd,
  buildBreadcrumbJsonLd,
  buildItemListJsonLd,
  buildEntryJsonLd,
  buildToolSoftwareApplicationJsonLd,
  buildJobPostingJsonLd,
  buildJobPostingDescription,
  cleanJobDescriptionText,
  jobBenefitsFromJob,
  parseJobCompensation,
  buildEntryJsonLdSnapshot,
} from "./seo-lib.js";
