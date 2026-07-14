// Pure content-quality issue detector behind scripts/audit-content.mjs: given a
// parsed entry's frontmatter, raw source, category, and section booleans, return
// the list of semantic issue codes. Split out so the rule set can be unit-tested
// without walking the content tree.

import {
  DEFAULT_DIRECTORY_REPO_URL,
  FORBIDDEN_CONTENT_FIELDS,
} from "@heyclaude/registry/content-schema";

// Matches leftover references to the pre-rebrand name/domain in an entry's body.
export const oldBrandOrDomainPattern = new RegExp(
  `${["claude", "pro"].join("")}\\.directory|${[
    "Claude",
    " Pro ",
    "Directory",
  ].join("")}`,
  "i",
);

/**
 * Collect semantic issue codes for one content entry.
 * @param {object} args
 * @param {object} args.data parsed frontmatter
 * @param {string} args.source raw file source (for text pattern checks)
 * @param {string} args.category the entry's directory category
 * @param {object} args.sectionFlags inferred section booleans (hasPrerequisites, hasTroubleshooting)
 * @returns {string[]}
 */
export function collectContentIssues({ data, source, category, sectionFlags }) {
  const issues = [];

  if (data.repoUrl === DEFAULT_DIRECTORY_REPO_URL) {
    issues.push("uses_default_directory_repo_url");
  }

  if (String(data.description ?? "").trim().length > 320) {
    issues.push("description_too_long");
  }

  if (!String(data.seoTitle ?? "").trim()) {
    issues.push("missing_seoTitle");
  }

  if (!String(data.seoDescription ?? "").trim()) {
    issues.push("missing_seoDescription");
  }

  if (!Array.isArray(data.keywords) || data.keywords.length === 0) {
    issues.push("missing_keywords");
  }

  if (oldBrandOrDomainPattern.test(source)) {
    issues.push("old_brand_or_domain_reference");
  }

  if (/\[Script content from first example\]/.test(source)) {
    issues.push("placeholder_script_marker");
  }

  if (data.category && String(data.category).trim() !== category) {
    issues.push("category_mismatch");
  }

  for (const field of FORBIDDEN_CONTENT_FIELDS) {
    if (data[field] !== undefined) {
      issues.push(`forbidden_field_${field}`);
    }
  }

  if (
    category === "guides" &&
    data.copySnippet &&
    String(data.copySnippet).trim()
  ) {
    issues.push("guide_copy_snippet_present");
  }

  if (
    category === "collections" &&
    data.copySnippet &&
    String(data.copySnippet).trim()
  ) {
    issues.push("collection_copy_snippet_present");
  }

  if (data.hasPrerequisites === false && sectionFlags.hasPrerequisites) {
    issues.push("hasPrerequisites_false_but_section_exists");
  }

  if (data.hasTroubleshooting === false && sectionFlags.hasTroubleshooting) {
    issues.push("hasTroubleshooting_false_but_section_exists");
  }

  return issues;
}
