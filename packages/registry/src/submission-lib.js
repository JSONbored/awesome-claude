/**
 * Pure submission parsing and validation helpers.
 *
 * Heading normalization, PR body parsing, draft builders, and category-specific
 * validation live here. Nothing touches the network — given the same submission
 * text the output is deterministic.
 *
 * The public surface (`submission.js` / `@heyclaude/registry/submission`)
 * re-exports everything below so existing imports stay unchanged.
 */
import categorySpec from "./category-spec.json" with { type: "json" };
import { normalizeBrandDomain } from "./brand-assets.js";
import { hasAffiliateParam, isPublicHttpsUrl } from "./source-url.js";
import {
  looksLikeToolAppListing,
  missingToolListingReviewFields,
  TOOLS_CATEGORY,
  toolListingApprovalMessage,
  toolListingRoutingMessage,
} from "./submission-classification.js";
import { buildSubmissionFieldModel } from "./submission-spec.js";

export const CORE_CATEGORIES = categorySpec.categoryOrder;

export const CATEGORY_REQUIREMENTS = Object.fromEntries(
  Object.entries(categorySpec.categories).map(([category, spec]) => [
    category,
    spec.submissionRequired,
  ]),
);

export const COMMON_REQUIRED_FIELDS = categorySpec.commonIssueRequiredFields;
const HEYCLAUDE_HOSTNAME = "heyclau.de";
const RISK_BEARING_SUBMISSION_CATEGORIES = new Set([
  "mcp",
  "hooks",
  "skills",
  "commands",
  "statuslines",
]);
const LOW_DETAIL_DISCLOSURE_NOTES = new Set([
  "n/a",
  "na",
  "none",
  "no",
  "not applicable",
]);

export const HEADING_KEY_MAP = {
  name: "name",
  title: "name",
  slug: "slug",
  category: "category",
  "content-type": "category",
  "git-hub-url": "github_url",
  "github-url": "github_url",
  github: "github_url",
  "source-url": "github_url",
  website: "docs_url",
  "website-url": "website_url",
  "product-url": "website_url",
  "canonical-product-url": "website_url",
  "docs-url": "docs_url",
  documentation: "docs_url",
  "documentation-url": "docs_url",
  "demo-url": "docs_url",
  "features-page": "docs_url",
  "features-url": "docs_url",
  "brand-name": "brand_name",
  brand: "brand_name",
  provider: "brand_name",
  "brand-domain": "brand_domain",
  "provider-domain": "brand_domain",
  author: "author",
  "author-profile-url": "author_profile_url",
  "submitted-via": "submitted_via",
  "contact-email": "contact_email",
  contact: "contact_email",
  contactemail: "contact_email",
  email: "contact_email",
  "public-contact": "contact_email",
  "public-email": "contact_email",
  tags: "tags",
  description: "description",
  "what-it-does": "description",
  "description-1-3-sentences": "description",
  "card-description": "card_description",
  "card-description-short-preview": "card_description",
  "full-copyable-content": "full_copyable_content",
  "full-copyable-agent-prompt-config": "full_copyable_content",
  "full-copyable-command-content": "full_copyable_content",
  "full-copyable-hook-script-config": "full_copyable_content",
  "copy-snippet-full-usable-asset": "full_copyable_content",
  "full-copyable-rule-content": "full_copyable_content",
  "copy-snippet-full-usable-asset-optional": "full_copyable_content",
  "full-copyable-statusline-script-config": "full_copyable_content",
  "required-content": "required_content",
  "install-usage-optional": "install_or_usage",
  "install-usage": "install_or_usage",
  install: "install_command",
  package: "package_name",
  npm: "download_url",
  "command-syntax": "command_syntax",
  "usage-snippet": "usage_snippet",
  usage: "usage_snippet",
  configuration: "config_snippet",
  config: "config_snippet",
  "config-snippet": "config_snippet",
  trigger: "trigger",
  "config-snippet-optional": "config_snippet",
  "script-language-optional": "script_language",
  "install-command": "install_command",
  "auth-requirements-env-vars-optional": "auth_requirements",
  "verification-steps-optional": "verification_steps",
  "verification-steps": "verification_steps",
  "download-url-optional": "download_url",
  "affiliate-url": "affiliate_url",
  "pricing-model": "pricing_model",
  pricing: "pricing_model",
  disclosure: "disclosure",
  "application-category": "application_category",
  "operating-system": "operating_system",
  "install-command-required-unless-download-url-is-provided": "install_command",
  "script-language": "script_language",
  "skill-type": "skill_type",
  "skill-level": "skill_level",
  "verification-status": "verification_status",
  "verified-date-yyyy-mm-dd": "verified_at",
  "retrieval-sources": "retrieval_sources",
  "tested-platforms": "tested_platforms",
  items: "items",
  "items-category-slug-list": "items",
  "guide-content-markdown": "guide_content",
  prerequisites: "prerequisites",
  "safety-notes": "safety_notes",
  "safety-notes-optional": "safety_notes",
  safetynotes: "safety_notes",
  safety_notes: "safety_notes",
  "privacy-notes": "privacy_notes",
  "privacy-notes-optional": "privacy_notes",
  privacynotes: "privacy_notes",
  privacy_notes: "privacy_notes",
  "troubleshooting-section": "troubleshooting_section",
  "installation-order": "installation_order",
  "estimated-setup-time": "estimated_setup_time",
  difficulty: "difficulty",
};

const CATEGORY_ALIASES = new Map(Object.entries(categorySpec.aliases));

export function normalizeHeading(label) {
  let output = "";
  let lastWasSeparator = false;

  for (const char of String(label).trim().toLowerCase()) {
    const isAlphaNumeric =
      (char >= "a" && char <= "z") || (char >= "0" && char <= "9");
    if (isAlphaNumeric) {
      output += char;
      lastWasSeparator = false;
      continue;
    }
    if (output && !lastWasSeparator) {
      output += "-";
      lastWasSeparator = true;
    }
  }

  return lastWasSeparator ? output.slice(0, -1) : output;
}

export function normalizeValue(value) {
  const text = String(value ?? "").trim();
  if (!text || text === "_No response_") return "";
  return text;
}

function compactWhitespace(value) {
  let output = "";
  let lastWasWhitespace = false;
  for (const char of String(value || "").trim()) {
    if (char === " " || char === "\n" || char === "\t" || char === "\r") {
      if (!lastWasWhitespace) output += " ";
      lastWasWhitespace = true;
      continue;
    }
    output += char;
    lastWasWhitespace = false;
  }
  return output.trim();
}

function singularLabel(value) {
  const label = normalizeValue(value);
  return label.endsWith("s") ? label.slice(0, -1) : label;
}

function looksLikeSubmitTitle(value) {
  const title = normalizeValue(value).toLowerCase();
  return /^(?:\[submit\]|submit)(?:\s|:|-|$)/.test(title);
}

function isIsoDate(value) {
  const text = normalizeValue(value);
  if (text.length !== 10) return false;
  return [...text].every((char, index) => {
    if (index === 4 || index === 7) return char === "-";
    return char >= "0" && char <= "9";
  });
}

function splitList(value) {
  const items = [];
  let current = "";
  for (const char of String(value || "")) {
    if (char === "\n" || char === ",") {
      const next = current.trim();
      if (next) items.push(next);
      current = "";
      continue;
    }
    current += char;
  }
  const next = current.trim();
  if (next) items.push(next);
  return items;
}

function splitNoteList(value) {
  return normalizeValue(value)
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function containsForbiddenCounter(value) {
  const text = String(value || "").toLowerCase();
  return (
    text.includes("viewcount") ||
    text.includes("copycount") ||
    text.includes("popularityscore")
  );
}

export function slugify(value) {
  let output = "";
  let lastWasSeparator = false;

  for (const char of String(value || "")
    .trim()
    .toLowerCase()) {
    const isAlphaNumeric =
      (char >= "a" && char <= "z") || (char >= "0" && char <= "9");
    if (isAlphaNumeric) {
      output += char;
      lastWasSeparator = false;
      continue;
    }
    if (char === "'" || char === '"') continue;
    if (output && !lastWasSeparator) {
      output += "-";
      lastWasSeparator = true;
    }
  }

  return lastWasSeparator ? output.slice(0, -1) : output;
}

export function normalizeCategory(value) {
  const normalized = normalizeHeading(value);
  if (CATEGORY_ALIASES.has(normalized)) return CATEGORY_ALIASES.get(normalized);
  if (normalized.split("-").includes("mcp")) return "mcp";
  return "";
}

function fieldKey(label) {
  const normalized = normalizeHeading(label);
  if (Object.hasOwn(HEADING_KEY_MAP, normalized)) {
    return HEADING_KEY_MAP[normalized];
  }
  return normalized.startsWith("download-url") ? "download_url" : normalized;
}

function parseJsonCodeBlock(value) {
  const raw = String(value || "").trim();
  let code = raw;
  if (raw.startsWith("```")) {
    const firstLineEnd = raw.indexOf("\n");
    const closingFence = raw.lastIndexOf("```");
    if (firstLineEnd >= 0 && closingFence > firstLineEnd) {
      code = raw.slice(firstLineEnd + 1, closingFence).trim();
    }
  }
  try {
    const parsed = JSON.parse(code);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? parsed
      : null;
  } catch {
    return null;
  }
}

function mapJsonData(data) {
  const mapped = {};
  const source = data || {};
  const pairs = {
    name: "name",
    title: "name",
    slug: "slug",
    category: "category",
    description: "description",
    author: "author",
    contact: "contact_email",
    contactEmail: "contact_email",
    publicContact: "contact_email",
    github: "github_url",
    githubUrl: "github_url",
    repoUrl: "github_url",
    website: "docs_url",
    websiteUrl: "website_url",
    productUrl: "website_url",
    canonicalProductUrl: "website_url",
    docs: "docs_url",
    docsUrl: "docs_url",
    documentationUrl: "docs_url",
    demoUrl: "docs_url",
    featuresUrl: "docs_url",
    affiliateUrl: "affiliate_url",
    pricingModel: "pricing_model",
    disclosure: "disclosure",
    applicationCategory: "application_category",
    operatingSystem: "operating_system",
    brandName: "brand_name",
    brandDomain: "brand_domain",
    npm: "download_url",
    install: "install_command",
    installCommand: "install_command",
    safetyNotes: "safety_notes",
    safety_notes: "safety_notes",
    privacyNotes: "privacy_notes",
    privacy_notes: "privacy_notes",
    license: "license",
  };

  for (const [inputKey, outputKey] of Object.entries(pairs)) {
    if (source[inputKey] !== undefined) mapped[outputKey] = source[inputKey];
  }

  if (Array.isArray(source.tags)) mapped.tags = source.tags.join(", ");
  return mapped;
}

function parseBulletLine(line) {
  const trimmed = String(line || "").trimStart();
  if (!trimmed.startsWith("- ")) return null;
  const withoutMarker = trimmed.slice(2);
  const colonIndex = withoutMarker.indexOf(":");
  if (colonIndex <= 0) return null;
  return {
    label: withoutMarker.slice(0, colonIndex),
    value: withoutMarker.slice(colonIndex + 1).trimStart(),
  };
}

function parseBoldFieldLine(line) {
  const trimmed = String(line || "").trim();
  if (!trimmed.startsWith("**")) return null;
  const labelEnd = trimmed.indexOf(":**");
  if (labelEnd <= 2) return null;
  return {
    label: trimmed.slice(2, labelEnd),
    value: trimmed.slice(labelEnd + 3).trimStart(),
  };
}

function parsePlainFieldLine(line) {
  const trimmed = String(line || "").trim();
  if (
    !trimmed.endsWith(":") ||
    trimmed.startsWith("#") ||
    trimmed.startsWith("- ") ||
    trimmed.startsWith("**")
  ) {
    return null;
  }
  const label = trimmed.slice(0, -1).trim();
  return label ? { label, value: "" } : null;
}

function normalizePlainFieldValue(lines) {
  return normalizeValue(
    lines
      .map((line) => {
        const trimmed = String(line || "").trim();
        if (trimmed.startsWith("- ") && !parseBulletLine(trimmed)) {
          return trimmed.slice(2).trim();
        }
        return String(line || "").trimStart();
      })
      .join("\n"),
  );
}

export function parseSubmissionPrBody(body) {
  const sections = {};
  const text = String(body || "");
  let currentLabel = "";
  let currentLines = [];

  const commitSection = () => {
    if (!currentLabel) return;
    sections[fieldKey(currentLabel)] = normalizeValue(currentLines.join("\n"));
  };

  for (const line of text.split("\n")) {
    const trimmedStart = line.trimStart();
    if (trimmedStart.startsWith("### ")) {
      commitSection();
      currentLabel = trimmedStart.slice(4).trim();
      currentLines = [];
      continue;
    }
    if (currentLabel) currentLines.push(line);
  }
  commitSection();

  if (Object.keys(sections).length === 0) {
    const lines = text.split("\n");
    for (let i = 0; i < lines.length; i += 1) {
      const match = parseBulletLine(lines[i]);
      if (!match) continue;
      const valueLines = [match.value];
      for (let j = i + 1; j < lines.length; j += 1) {
        const nextLine = lines[j];
        if (
          parseBulletLine(nextLine) ||
          parsePlainFieldLine(nextLine) ||
          parseBoldFieldLine(nextLine)
        ) {
          break;
        }
        valueLines.push(nextLine.trimStart());
        i = j;
      }
      sections[fieldKey(match.label)] = normalizeValue(valueLines.join("\n"));
    }
  }

  const plainLines = text.split("\n");
  for (let i = 0; i < plainLines.length; i += 1) {
    const match = parsePlainFieldLine(plainLines[i]);
    if (!match) continue;
    const key = fieldKey(match.label);
    if (sections[key]) continue;

    const valueLines = [];
    for (let j = i + 1; j < plainLines.length; j += 1) {
      const nextLine = plainLines[j];
      if (
        parsePlainFieldLine(nextLine) ||
        parseBoldFieldLine(nextLine) ||
        parseBulletLine(nextLine)
      ) {
        break;
      }
      valueLines.push(nextLine);
    }

    const value = normalizePlainFieldValue(valueLines);
    if (value) sections[key] = value;
  }

  for (const line of text.split("\n")) {
    const match = parseBoldFieldLine(line);
    if (!match) continue;
    const key = fieldKey(match.label);
    if (!sections[key]) sections[key] = normalizeValue(match.value);
  }

  const jsonData = parseJsonCodeBlock(sections["json-data"]);
  if (jsonData) {
    Object.assign(sections, mapJsonData(jsonData), sections);
  }

  return normalizeParsedFields(sections);
}

export function normalizeParsedFields(fields) {
  const normalized = { ...fields };
  const category = normalizeCategory(normalized.category);
  if (category) normalized.category = category;

  const slugSource = normalized.slug || normalized.name;
  const nextSlug = slugify(slugSource);
  if (nextSlug) normalized.slug = nextSlug;

  if (!normalized.card_description && normalized.description) {
    const oneLine = compactWhitespace(normalized.description);
    normalized.card_description =
      oneLine.length <= 140 ? oneLine : `${oneLine.slice(0, 137).trimEnd()}...`;
  }

  if (!normalized.usage_snippet && normalized.install_or_usage) {
    normalized.usage_snippet = normalized.install_or_usage;
  }

  if (!normalized.install_command && normalized.install_or_usage) {
    normalized.install_command = normalized.install_or_usage;
  }

  if (normalized.brand_domain) {
    normalized.brand_domain =
      normalizeBrandDomain(normalized.brand_domain) || normalized.brand_domain;
  }

  return normalized;
}

export function normalizeSubmissionPayloadFields(fields = {}) {
  const normalized = {};
  for (const [key, value] of Object.entries(fields || {})) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      const separator =
        key === "safety_notes" ||
        key === "privacy_notes" ||
        key === "safetyNotes" ||
        key === "privacyNotes"
          ? "\n"
          : ", ";
      normalized[key] = value.map(String).join(separator);
      continue;
    }
    if (typeof value === "object") continue;
    normalized[key] = String(value);
  }
  return normalizeParsedFields(normalized);
}

export function buildSubmissionPrTitle(fields = {}) {
  const normalized = normalizeSubmissionPayloadFields(fields);
  const category = normalizeCategory(normalized.category);
  const label = singularLabel(categorySpec.categories[category]?.label || "");
  return `Add ${label || "Entry"}: ${normalizeValue(normalized.name) || "New directory entry"}`;
}

export function buildSubmissionPrBody(fields = {}) {
  const normalized = normalizeSubmissionPayloadFields(fields);
  const category = normalizeCategory(normalized.category);
  const model = buildSubmissionFieldModel(category);
  const fieldIds = model?.fields?.map((field) => field.id) ?? [
    "name",
    "slug",
    "category",
    "github_url",
    "docs_url",
    "author",
    "contact_email",
    "tags",
    "description",
    "card_description",
  ];
  const labelsById = new Map(
    (model?.fields ?? []).map((field) => [field.id, field.label || field.id]),
  );
  const allFieldIds = [
    ...fieldIds,
    ...Object.keys(normalized).filter((id) => !fieldIds.includes(id)),
  ];
  const lines = [];

  for (const id of allFieldIds) {
    const value = normalizeValue(normalized[id]);
    if (!value && id !== "category") continue;
    const label = labelsById.get(id) || id.replaceAll("_", " ");
    lines.push(`### ${label}`, "", value || category, "");
  }

  return lines.join("\n").trimEnd();
}

export function buildSubmissionPrDraft(fields = {}) {
  const normalized = normalizeSubmissionPayloadFields(fields);
  return {
    title: buildSubmissionPrTitle(normalized),
    body: buildSubmissionPrBody(normalized),
  };
}

export function looksLikeSubmissionPrDraft(draft = {}) {
  const title = String(draft.title || "").trim();
  const body = String(draft.body || "");
  const normalizedBody = body.toLowerCase();
  const hasCategoryField =
    normalizedBody.includes("### category") ||
    normalizedBody.includes("**category:**") ||
    normalizedBody.includes("\ncategory:") ||
    normalizedBody.startsWith("category:") ||
    normalizedBody.includes("content type");
  const hasNameOrSourceField =
    normalizedBody.includes("### name") ||
    normalizedBody.includes("**name:**") ||
    normalizedBody.includes("\nname:") ||
    normalizedBody.startsWith("name:") ||
    normalizedBody.includes("json data") ||
    normalizedBody.includes("github url") ||
    normalizedBody.includes("docs url");
  const hasSubmissionShape = hasCategoryField && hasNameOrSourceField;

  if (looksLikeSubmitTitle(title) || /^add(?:\s|:|-|$)/i.test(title)) {
    return true;
  }

  return hasSubmissionShape;
}

export function isLikelyAffiliateUrl(value) {
  return hasAffiliateParam(normalizeValue(value));
}

function isHttpsUrl(value) {
  return isPublicHttpsUrl(normalizeValue(value));
}

function urlPathname(value) {
  const normalized = normalizeValue(value);
  if (!normalized) return "";
  try {
    return new URL(normalized).pathname.toLowerCase();
  } catch {
    return normalized.split(/[?#]/)[0].toLowerCase();
  }
}

function urlHostname(value) {
  const normalized = normalizeValue(value);
  if (!normalized) return "";
  try {
    return new URL(normalized).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

function isGitHubSourcePath(value) {
  const normalized = normalizeValue(value);
  if (!normalized) return false;
  try {
    const url = new URL(normalized);
    if (url.protocol !== "https:" || url.hostname !== "github.com") {
      return false;
    }
    const [, , pathType] = url.pathname.split("/").filter(Boolean);
    return pathType === "tree" || pathType === "blob";
  } catch {
    return false;
  }
}

function installCommandReferencesLocalScript(value) {
  return /(?:^|[\s;&|])(?:\.{1,2}\/|[\w.-]+\/)[\w./-]*(?:install|setup)\.(?:sh|bash|zsh|ps1)\b/i.test(
    normalizeValue(value),
  );
}

function hasInstallerSourceReference(fields = {}) {
  const combined = [
    fields.github_url,
    fields.docs_url,
    fields.download_url,
    fields.retrieval_sources,
  ]
    .map(normalizeValue)
    .join("\n")
    .toLowerCase();
  return /\b(?:install|setup)\.(?:sh|bash|zsh|ps1)\b/.test(combined);
}

function normalizeDisclosureNoteForComparison(value) {
  let text = normalizeValue(value).toLowerCase();
  while (text.endsWith(".") || text.endsWith(" ")) {
    text = text.slice(0, -1);
  }
  return text;
}

function isUsefulDisclosureNote(value) {
  const text = normalizeValue(value);
  if (!text) return false;
  const normalized = normalizeDisclosureNoteForComparison(text);
  if (LOW_DETAIL_DISCLOSURE_NOTES.has(normalized)) return false;
  if (normalized.startsWith("not applicable:")) {
    return normalized.slice("not applicable:".length).trim().length >= 8;
  }
  return text.length >= 12;
}

function isValidPublicContact(value) {
  const normalized = normalizeValue(value);
  if (!normalized) return true;
  if (/^https?:\/\//i.test(normalized)) {
    try {
      const url = new URL(normalized);
      return (
        url.protocol === "https:" &&
        url.username === "" &&
        url.password === "" &&
        url.hostname === "github.com" &&
        url.pathname.split("/").filter(Boolean).length === 1
      );
    } catch {
      return false;
    }
  }
  if (normalized.includes("@")) {
    const parts = normalized.split("@");
    const [local, domain] = parts;
    if (
      parts.length === 2 &&
      local &&
      domain &&
      domain.includes(".") &&
      !domain.startsWith(".") &&
      !domain.endsWith(".") &&
      !normalized.includes(" ")
    ) {
      return true;
    }
  }
  const handle = normalized.startsWith("@") ? normalized.slice(1) : normalized;
  if (
    handle.length >= 1 &&
    handle.length <= 39 &&
    !handle.startsWith("-") &&
    !handle.endsWith("-") &&
    [...handle].every(
      (char) =>
        (char >= "A" && char <= "Z") ||
        (char >= "a" && char <= "z") ||
        (char >= "0" && char <= "9") ||
        char === "-",
    )
  ) {
    return true;
  }

  return false;
}

const TOOL_PRICING_MODELS = new Set([
  "free",
  "freemium",
  "paid",
  "open-source",
  "subscription",
  "usage-based",
  "contact-sales",
]);

const TOOL_DISCLOSURES = new Set([
  "editorial",
  "heyclaude_pick",
  "affiliate",
  "sponsored",
  "claimed",
]);

const PROTECTED_SUBMISSION_LABELS = new Set(["accepted"]);

function labelName(label) {
  if (typeof label === "string") return label;
  if (label && typeof label === "object") return label.name;
  return "";
}

function hasProtectedSubmissionLabel(draft = {}) {
  return Array.isArray(draft.labels)
    ? draft.labels.some((label) =>
        PROTECTED_SUBMISSION_LABELS.has(
          String(labelName(label) || "")
            .trim()
            .toLowerCase(),
        ),
      )
    : false;
}

export function validateSubmission(draft) {
  const fields = parseSubmissionPrBody(draft.body ?? "");
  const categoryFromField = normalizeCategory(fields.category);
  const category = categoryFromField;
  const warnings = [];

  if (fields.slug && fields.slug !== normalizeValue(fields.slug)) {
    warnings.push(`Slug normalized to ${fields.slug}`);
  }

  if (!category || !CORE_CATEGORIES.includes(category)) {
    return {
      ok: true,
      skipped: true,
      reason: "non_core_category_submission",
      category,
      errors: [],
      warnings,
      fields,
    };
  }

  fields.category = category;

  const errors = [];
  const requiredFields = [
    ...COMMON_REQUIRED_FIELDS,
    ...(CATEGORY_REQUIREMENTS[category] ?? []),
  ];

  for (const field of requiredFields) {
    if (!normalizeValue(fields[field])) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  if (RISK_BEARING_SUBMISSION_CATEGORIES.has(category)) {
    for (const field of ["safety_notes", "privacy_notes"]) {
      const notes = splitNoteList(fields[field]);
      if (!notes.length) {
        errors.push(`Missing required field: ${field}`);
      } else if (!notes.some(isUsefulDisclosureNote)) {
        errors.push(
          `${field} must explain the relevant behavior, or use "Not applicable: ..." with a specific reason`,
        );
      }
    }
  }

  if (fields.slug && slugify(fields.slug) !== fields.slug) {
    errors.push("Invalid slug format: expected kebab-case");
  }

  if (!isValidPublicContact(fields.contact_email)) {
    errors.push(
      "Invalid public contact: use a GitHub handle, GitHub profile URL, or email",
    );
  }

  if (fields.description && normalizeValue(fields.description).length < 12) {
    errors.push("Description is too short for review");
  }

  if (
    fields.card_description &&
    normalizeValue(fields.card_description).length < 8
  ) {
    errors.push("Card description is too short for review");
  }

  const downloadPath = urlPathname(fields.download_url);
  const downloadHost = urlHostname(fields.download_url);
  if (
    downloadPath.startsWith("/downloads/") &&
    (!downloadHost || downloadHost === HEYCLAUDE_HOSTNAME)
  ) {
    errors.push(
      "Community submissions cannot request local /downloads hosting",
    );
  }

  for (const field of [
    "github_url",
    "docs_url",
    "download_url",
    "website_url",
    "affiliate_url",
  ]) {
    if (!isHttpsUrl(fields[field])) {
      errors.push(`${field} must be a valid https URL`);
    }
    if (field !== "affiliate_url" && isLikelyAffiliateUrl(fields[field])) {
      errors.push(
        `Contributor submissions cannot include affiliate/referral URLs: ${field}`,
      );
    }
  }

  if (normalizeValue(fields.affiliate_url) && category !== TOOLS_CATEGORY) {
    errors.push(
      "Contributor submissions cannot include affiliate_url outside maintainer-reviewed tools listings",
    );
  }

  if (category === "skills" && isGitHubSourcePath(fields.download_url)) {
    errors.push(
      "download_url must point to a package, archive, or release download; use github_url or retrieval_sources for GitHub source tree/blob paths",
    );
  }

  if (fields.brand_domain && !normalizeBrandDomain(fields.brand_domain)) {
    errors.push("brand_domain must be a canonical domain such as asana.com");
  }

  const productLike = looksLikeToolAppListing(fields, draft.body ?? "");
  if (category !== TOOLS_CATEGORY && productLike) {
    errors.push(
      `${toolListingRoutingMessage()}. Change the category to tools for maintainer-reviewed editorial listing prep, or submit the tools/app lead form instead.`,
    );
  }

  if (category === TOOLS_CATEGORY) {
    if (!hasProtectedSubmissionLabel(draft)) {
      errors.push(toolListingApprovalMessage());
    }

    const missingToolFields = missingToolListingReviewFields(fields);
    for (const field of missingToolFields) {
      errors.push(`Tools listings require ${field}`);
    }

    const pricingModel = String(fields.pricing_model || "")
      .trim()
      .toLowerCase();
    const disclosure = String(fields.disclosure || "")
      .trim()
      .toLowerCase();

    if (pricingModel && !TOOL_PRICING_MODELS.has(pricingModel)) {
      errors.push("pricing_model is not recognized");
    }
    if (disclosure && !TOOL_DISCLOSURES.has(disclosure)) {
      errors.push(
        "disclosure must be editorial, heyclaude_pick, affiliate, sponsored, or claimed",
      );
    }
    if (disclosure === "affiliate" && !normalizeValue(fields.affiliate_url)) {
      errors.push("affiliate tools listings require affiliate_url");
    }
  }

  if (category === "skills") {
    const hasSkillInstallPath =
      normalizeValue(fields.install_command) ||
      normalizeValue(fields.download_url) ||
      normalizeValue(fields.github_url) ||
      normalizeValue(fields.docs_url) ||
      normalizeValue(fields.full_copyable_content) ||
      normalizeValue(fields.retrieval_sources);
    if (!hasSkillInstallPath) {
      errors.push(
        "Skills submissions require install_command, source URL, retrieval_sources, or full_copyable_content",
      );
    }
    if (
      installCommandReferencesLocalScript(fields.install_command) &&
      isGitHubSourcePath(fields.github_url) &&
      !hasInstallerSourceReference(fields) &&
      !normalizeValue(fields.full_copyable_content)
    ) {
      errors.push(
        "Skills install_command references a local installer script; include the exact installer source URL in retrieval_sources or provide full_copyable_content",
      );
    }
  }

  if (category === "collections" && !normalizeValue(fields.items)) {
    errors.push("Collections submissions require items");
  }

  if (category === "guides" && !normalizeValue(fields.guide_content)) {
    errors.push("Guide submissions require guide_content");
  }

  if (category === "skills") {
    const skillType = String(fields.skill_type ?? "")
      .trim()
      .toLowerCase();
    const skillLevel = String(fields.skill_level ?? "")
      .trim()
      .toLowerCase();
    const verificationStatus = String(fields.verification_status ?? "")
      .trim()
      .toLowerCase();
    const verifiedAt = String(fields.verified_at ?? "").trim();
    const retrievalSources = String(fields.retrieval_sources ?? "").trim();
    const testedPlatforms = String(fields.tested_platforms ?? "").trim();

    const validSkillTypes = new Set(categorySpec.skillTypeValues);
    const validSkillLevels = new Set(categorySpec.skillLevelValues);
    const validStatuses = new Set(categorySpec.verificationStatusValues);

    if (skillType && !validSkillTypes.has(skillType)) {
      errors.push(`Invalid skill_type: ${skillType}`);
    }
    if (skillLevel && !validSkillLevels.has(skillLevel)) {
      errors.push(`Invalid skill_level: ${skillLevel}`);
    }
    if (verificationStatus && !validStatuses.has(verificationStatus)) {
      errors.push(`Invalid verification_status: ${verificationStatus}`);
    }
    if (verifiedAt && !isIsoDate(verifiedAt)) {
      errors.push("verified_at must use YYYY-MM-DD format");
    }
    if (skillType === "capability-pack") {
      if (!verifiedAt)
        errors.push("capability-pack skills require verified_at");
      if (!retrievalSources)
        errors.push("capability-pack skills require retrieval_sources");
      if (skillLevel && skillLevel !== "expert") {
        errors.push("capability-pack skills must use skill_level=expert");
      }
    }
    if (retrievalSources) {
      const urls = splitList(retrievalSources);
      for (const url of urls) {
        if (!isHttpsUrl(url)) {
          errors.push(`retrieval_sources must use https URLs: ${url}`);
        }
      }
    }
    if (!testedPlatforms) {
      warnings.push("No tested_platforms provided");
    }
  }

  const fullCopyable = String(fields.full_copyable_content ?? "");
  if (containsForbiddenCounter(fullCopyable)) {
    errors.push("Forbidden counters detected in full_copyable_content");
  }

  for (const field of ["safety_notes", "privacy_notes"]) {
    const notes = splitNoteList(fields[field]);
    if (!notes.length) continue;
    if (notes.length > 8) {
      errors.push(`${field} must include 8 items or fewer`);
    }
    for (const note of notes) {
      if (note.length > 320) {
        errors.push(`${field} items must be 320 characters or fewer`);
      }
    }
  }

  if (!fields.github_url && !fields.docs_url) {
    warnings.push("No github_url/docs_url provided");
  }

  return {
    ok: errors.length === 0,
    skipped: false,
    reason: "",
    category,
    errors,
    warnings,
    fields,
  };
}
