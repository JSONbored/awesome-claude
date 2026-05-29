import categorySpec from "./category-spec.json" with { type: "json" };
import { normalizeBrandDomain } from "./brand-assets.js";
import {
  looksLikeToolAppListing,
  missingToolListingReviewFields,
  TOOLS_CATEGORY,
  toolListingApprovalMessage,
  toolListingRoutingMessage,
} from "./submission-classification.js";
import { analyzeIssueSubmissionRisk } from "./submission-risk.js";
import {
  recommendedLabelsForCategory,
  SUBMISSION_NEEDS_AUTHOR_INPUT_LABEL,
  SUBMISSION_PROTECTED_REVIEW_LABELS,
  SUBMISSION_SOURCE_NEEDS_VERIFICATION_LABEL,
  SUBMISSION_STALE_LABEL,
} from "./submission-labels.js";
import { buildSubmissionFieldModel } from "./submission-spec.js";

export const CORE_CATEGORIES = categorySpec.categoryOrder;

export const CATEGORY_REQUIREMENTS = Object.fromEntries(
  Object.entries(categorySpec.categories).map(([category, spec]) => [
    category,
    spec.submissionRequired,
  ]),
);

export const COMMON_REQUIRED_FIELDS = categorySpec.commonIssueRequiredFields;
const DAY_MS = 24 * 60 * 60 * 1000;
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

export const SUBMISSION_STALE_POLICY = {
  reminderDays: 7,
  closeDays: 14,
};

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
  email: "contact_email",
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
  return (
    HEADING_KEY_MAP[normalized] ??
    (normalized.startsWith("download-url") ? "download_url" : normalized)
  );
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

export function parseIssueFormBody(body) {
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

export function buildSubmissionIssueTitle(fields = {}) {
  const normalized = normalizeSubmissionPayloadFields(fields);
  const category = normalizeCategory(normalized.category);
  const label = singularLabel(categorySpec.categories[category]?.label || "");
  return `Submit ${label || "Entry"}: ${normalizeValue(normalized.name) || "New directory entry"}`;
}

export function buildSubmissionIssueBody(fields = {}) {
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

export function buildSubmissionIssueDraft(fields = {}) {
  const normalized = normalizeSubmissionPayloadFields(fields);
  const category = normalizeCategory(normalized.category);
  return {
    title: buildSubmissionIssueTitle(normalized),
    body: buildSubmissionIssueBody(normalized),
    labels: CORE_CATEGORIES.includes(category)
      ? recommendedLabelsForCategory(category)
      : ["content-submission", "needs-review"],
  };
}

export function issueLabels(issue) {
  return Array.isArray(issue.labels)
    ? issue.labels
        .map((label) => {
          if (typeof label === "string") return label.trim().toLowerCase();
          return String(label?.name ?? "")
            .trim()
            .toLowerCase();
        })
        .filter(Boolean)
    : [];
}

export function looksLikeSubmissionIssue(issue = {}) {
  const labels = issueLabels(issue);
  const title = String(issue.title || "").trim();
  const body = String(issue.body || "");
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

  if (labels.includes("content-submission")) {
    return looksLikeSubmitTitle(title) || hasSubmissionShape;
  }

  if (looksLikeSubmitTitle(title)) return true;

  return hasSubmissionShape;
}

export function isLikelyAffiliateUrl(value) {
  const normalized = normalizeValue(value);
  if (!normalized) return false;

  try {
    const url = new URL(normalized);
    const affiliateParams = new Set([
      "aff",
      "affiliate",
      "affiliate_id",
      "campaign",
      "coupon",
      "irclickid",
      "partner",
      "referral",
      "referral_code",
      "via",
    ]);

    for (const key of url.searchParams.keys()) {
      const normalizedKey = key.trim().toLowerCase();
      if (normalizedKey.startsWith("utm_")) return true;
      if (affiliateParams.has(normalizedKey)) return true;
    }
  } catch {
    return false;
  }

  return false;
}

function isHttpsUrl(value) {
  const normalized = normalizeValue(value);
  if (!normalized) return true;
  try {
    const url = new URL(normalized);
    return url.protocol === "https:";
  } catch {
    return false;
  }
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
  if (normalized.includes("@")) {
    const [local, domain] = normalized.split("@");
    if (local && domain && domain.includes(".") && !normalized.includes(" ")) {
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

  try {
    const url = new URL(normalized);
    return (
      url.protocol === "https:" &&
      url.hostname === "github.com" &&
      url.pathname.split("/").filter(Boolean).length === 1
    );
  } catch {
    return false;
  }
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

export function recommendedSubmissionLabels(
  issue,
  report = validateSubmission(issue),
) {
  if (!looksLikeSubmissionIssue(issue)) return [];
  const labels = new Set(issueLabels(issue));
  if (report?.category && CORE_CATEGORIES.includes(report.category)) {
    for (const label of recommendedLabelsForCategory(report.category)) {
      labels.add(label);
    }
  } else {
    labels.add("content-submission");
    labels.add("needs-review");
  }
  if (report && (report.skipped || !report.ok)) {
    labels.add(SUBMISSION_NEEDS_AUTHOR_INPUT_LABEL);
  }
  if (submissionSourceNeedsVerification(report, issue)) {
    labels.add(SUBMISSION_SOURCE_NEEDS_VERIFICATION_LABEL);
  }
  const staleState = submissionStaleState(issue, report);
  if (staleState === "reminder_due" || staleState === "close_eligible") {
    labels.add(SUBMISSION_STALE_LABEL);
  }
  return [...labels].sort();
}

export function hasProtectedSubmissionLabel(issue = {}) {
  const labels = new Set(issueLabels(issue));
  return SUBMISSION_PROTECTED_REVIEW_LABELS.some((label) => labels.has(label));
}

export function submissionSourceNeedsVerification(report, issue = {}) {
  if (!report || report.skipped) return false;
  const labels = new Set(issueLabels(issue));
  if (labels.has(SUBMISSION_SOURCE_NEEDS_VERIFICATION_LABEL)) return true;
  if (
    report.warnings?.some((warning) =>
      String(warning).includes("No github_url/docs_url provided"),
    )
  ) {
    return true;
  }
  return Boolean(
    report.errors?.some((error) =>
      /must be a valid https URL|affiliate\/referral URLs|local \/downloads hosting/.test(
        String(error),
      ),
    ),
  );
}

function parseTimestamp(value) {
  const timestamp = Date.parse(String(value || ""));
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function stableTextFingerprint(value) {
  const text = String(value ?? "")
    .replace(/\r\n/g, "\n")
    .trim();
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return `fnv1a:${hash.toString(16).padStart(8, "0")}`;
}

export function submissionBodyFingerprint(issue = {}) {
  return stableTextFingerprint(issue.body || "");
}

function submissionSourceFieldsFingerprint(body = "") {
  const fields = parseIssueFormBody(body);
  const pairs = Object.entries(fields)
    .map(([key, value]) => [key, normalizeValue(value)])
    .filter(([, value]) => value)
    .sort(([left], [right]) => left.localeCompare(right));
  return stableTextFingerprint(JSON.stringify(pairs));
}

function issueTimelineEvents(issue = {}) {
  if (Array.isArray(issue.timeline)) return issue.timeline;
  if (Array.isArray(issue.events)) return issue.events;
  return [];
}

function issueComments(issue = {}) {
  return Array.isArray(issue.comments) ? issue.comments : [];
}

function commentAuthor(comment = {}) {
  if (typeof comment.author === "string") return comment.author;
  if (typeof comment.user === "string") return comment.user;
  return String(comment.author?.login || comment.user?.login || "");
}

function issueAuthor(issue = {}) {
  if (typeof issue.author === "string") return issue.author;
  if (typeof issue.user === "string") return issue.user;
  return String(issue.author?.login || issue.user?.login || "");
}

function commentTimestamp(comment = {}) {
  return parseTimestamp(comment.createdAt || comment.created_at);
}

const MAINTAINER_REVIEW_ASSOCIATIONS = new Set([
  "OWNER",
  "MEMBER",
  "COLLABORATOR",
]);

function commentAuthorAssociation(comment = {}) {
  return String(
    comment.authorAssociation ||
      comment.author_association ||
      comment.association ||
      "",
  ).toUpperCase();
}

function isTrustedReviewBotComment(comment = {}) {
  const login = commentAuthor(comment).toLowerCase();
  if (
    !["github-actions[bot]", "heyclaude[bot]", "heyclaude-bot"].includes(login)
  ) {
    return false;
  }

  const body = String(comment.body || "").toLowerCase();
  return (
    body.includes("needs author input") ||
    body.includes("edit the original issue") ||
    body.includes("original issue fields") ||
    body.includes("issue body")
  );
}

function isMaintainerReviewComment(comment = {}) {
  return (
    MAINTAINER_REVIEW_ASSOCIATIONS.has(commentAuthorAssociation(comment)) ||
    isTrustedReviewBotComment(comment)
  );
}

export function submissionBodyUpdatedAt(issue = {}) {
  const explicit = parseTimestamp(issue.bodyUpdatedAt || issue.body_updated_at);
  if (explicit) return new Date(explicit).toISOString();

  const currentFieldsFingerprint = submissionSourceFieldsFingerprint(
    issue.body || "",
  );
  const bodyEditTimestamps = issueTimelineEvents(issue)
    .filter((event) => {
      const changes = event?.changes || {};
      const previousBody =
        typeof changes.body?.from === "string"
          ? changes.body.from
          : typeof changes.body_from === "string"
            ? changes.body_from
            : typeof changes.old_body === "string"
              ? changes.old_body
              : "";
      const changedSubmissionFields = previousBody
        ? submissionSourceFieldsFingerprint(previousBody) !==
          currentFieldsFingerprint
        : Boolean(changes.body || changes.body_from || changes.old_body);
      return (
        String(event?.event || "").toLowerCase() === "edited" &&
        changedSubmissionFields
      );
    })
    .map((event) => parseTimestamp(event.createdAt || event.created_at))
    .filter(Boolean);
  const latestEdit = bodyEditTimestamps.length
    ? Math.max(...bodyEditTimestamps)
    : 0;
  if (latestEdit) return new Date(latestEdit).toISOString();

  const createdAt = parseTimestamp(issue.createdAt || issue.created_at);
  if (createdAt) return new Date(createdAt).toISOString();

  const updatedAt = parseTimestamp(issue.updatedAt || issue.updated_at);
  return updatedAt ? new Date(updatedAt).toISOString() : "";
}

export function submissionActivityState(issue = {}) {
  const author = issueAuthor(issue).toLowerCase();
  const bodyUpdatedAt = submissionBodyUpdatedAt(issue);
  const bodyUpdatedAtMs = parseTimestamp(bodyUpdatedAt);
  const comments = issueComments(issue);
  const authorCommentTimestamps = [];
  const reviewCommentTimestamps = [];

  for (const comment of comments) {
    const timestamp = commentTimestamp(comment);
    if (!timestamp) continue;
    const commentAuthorLogin = commentAuthor(comment).toLowerCase();
    if (author && commentAuthorLogin === author) {
      authorCommentTimestamps.push(timestamp);
    } else if (isMaintainerReviewComment(comment)) {
      reviewCommentTimestamps.push(timestamp);
    }
  }

  const lastAuthorCommentMs = authorCommentTimestamps.length
    ? Math.max(...authorCommentTimestamps)
    : 0;
  const lastReviewCommentMs = reviewCommentTimestamps.length
    ? Math.max(...reviewCommentTimestamps)
    : 0;
  const authorCommentedAfterReview =
    Boolean(lastAuthorCommentMs && lastReviewCommentMs) &&
    lastAuthorCommentMs > lastReviewCommentMs;
  const authorCommentedWithoutBodyUpdate =
    authorCommentedAfterReview &&
    Boolean(bodyUpdatedAtMs) &&
    lastAuthorCommentMs > bodyUpdatedAtMs;

  return {
    bodyFingerprint: submissionBodyFingerprint(issue),
    bodyUpdatedAt,
    lastAuthorCommentAt: lastAuthorCommentMs
      ? new Date(lastAuthorCommentMs).toISOString()
      : "",
    authorCommentedAfterReview,
    authorCommentedWithoutBodyUpdate,
  };
}

export function submissionAgeDays(issue = {}, options = {}) {
  const updatedAt = parseTimestamp(submissionBodyUpdatedAt(issue));
  const createdAt = parseTimestamp(issue.createdAt || issue.created_at);
  const reference = updatedAt || createdAt;
  if (!reference) return 0;
  const now = options.now ? parseTimestamp(options.now) : Date.now();
  if (!Number.isFinite(now) || now <= reference) return 0;
  return Math.floor((now - reference) / DAY_MS);
}

export function submissionStaleState(
  issue = {},
  report = validateSubmission(issue),
  options = {},
) {
  if (report?.skipped || hasProtectedSubmissionLabel(issue)) {
    return "not_applicable";
  }
  if (report?.ok) return "not_applicable";

  const ageDays = submissionAgeDays(issue, options);
  if (ageDays >= SUBMISSION_STALE_POLICY.closeDays) {
    return "close_eligible";
  }
  if (ageDays >= SUBMISSION_STALE_POLICY.reminderDays) {
    return "reminder_due";
  }
  return "fresh";
}

export function submissionQueueStatus(report, issue = {}, options = {}) {
  if (report?.skipped) return "skipped";
  if (hasProtectedSubmissionLabel(issue)) return "maintainer_review";
  const staleState = submissionStaleState(issue, report, options);
  if (staleState === "close_eligible") return "close_eligible";
  if (staleState === "reminder_due") return "stale_reminder_due";
  if (!report?.ok) return "needs_author_input";
  if (submissionSourceNeedsVerification(report, issue)) {
    return "source_needs_verification";
  }
  return "import_ready";
}

function submissionQueueNextAction(
  status,
  issue = {},
  riskTier = "low",
  policyDecision = "maintainer_review",
  activity = submissionActivityState(issue),
) {
  const labels = new Set(issueLabels(issue));
  if (labels.has("import-pr-open")) return "skip";
  if (labels.has("accepted") || labels.has("import-approved")) return "import";
  if (status === "skipped") return "skip";
  if (status === "close_eligible") return "close_stale";
  if (status === "stale_reminder_due") return "send_stale_reminder";
  if (status === "needs_author_input") {
    return activity.authorCommentedWithoutBodyUpdate
      ? "update_issue_body_required"
      : "request_author_input";
  }
  if (status === "source_needs_verification") return "verify_source";
  if (policyDecision === "blocked") return "review_risk";
  if (riskTier === "high" || riskTier === "critical") return "review_risk";
  if (status === "maintainer_review") return "review_risk";
  return policyDecision === "auto_import_eligible" ? "import" : "review_risk";
}

function formatRiskSummary(riskTier, capabilityBuckets = []) {
  const tier = String(riskTier || "low");
  const label = `${tier[0]?.toUpperCase() || "L"}${tier.slice(1)} risk`;
  return capabilityBuckets.length
    ? `${label}: ${capabilityBuckets.join(", ")}`
    : label;
}

function policyHasBlockingGate(policyMatrix = {}, options = {}) {
  const { ignoredGates = [] } = options;
  const ignored = new Set(ignoredGates);
  return Object.entries(policyMatrix || {}).some(
    ([name, gate]) => gate?.status === "block" && !ignored.has(name),
  );
}

function textMatchesAny(values = [], patterns = []) {
  const text = values.flat().filter(Boolean).join("\n");
  return patterns.some((pattern) => pattern.test(text));
}

function submissionLooksPromotional({ report, risk }) {
  const classificationIds = new Set(
    (risk.classificationWarnings || []).map((warning) => warning.id),
  );
  if (
    classificationIds.has("tools_category_routing") ||
    classificationIds.has("tools_listing_metadata_missing")
  ) {
    return true;
  }

  return textMatchesAny(
    [
      report?.errors || [],
      report?.warnings || [],
      risk.reviewFlags?.map((flag) => flag.summary) || [],
    ],
    [
      /tools\/app listing flow/i,
      /paid listing/i,
      /affiliate\/referral/i,
      /hosted tool\/app\/service\/product/i,
    ],
  );
}

function submissionLooksBlocked({ report, risk }) {
  if (
    policyHasBlockingGate(risk.policyMatrix, {
      ignoredGates: ["schema", "source", "quality"],
    })
  ) {
    return true;
  }
  if (risk.riskTier === "critical") return true;

  return textMatchesAny(
    [
      report?.errors || [],
      report?.warnings || [],
      risk.reviewFlags?.map((flag) => flag.id) || [],
    ],
    [
      /local \/downloads hosting/i,
      /community.*(?:zip|mcpb|archive|package)/i,
      /community_local_download_request/i,
      /community_archive_download/i,
      /unsafe packageverified/i,
      /forbidden \/downloads/i,
    ],
  );
}

function submissionTriageGroup({ report, risk, status }) {
  if (status === "skipped") return "skipped";
  if (status === "close_eligible") return "close_eligible";
  if (status === "stale_reminder_due") return "stale";
  if (submissionLooksBlocked({ report, risk })) return "blocked";
  if (status === "import_ready" && risk.riskTier === "high") return "blocked";
  if (submissionLooksPromotional({ report, risk })) {
    return "likely_promo_spam";
  }
  if (status === "needs_author_input") return "needs_author_input";
  if (status === "source_needs_verification") return "source_verification";
  if (status === "import_ready") return "ready";
  return "maintainer_review";
}

function submissionTriageReason({ entry, report, risk }) {
  if (entry.triageGroup === "ready") {
    return entry.autoImportEligible
      ? "Deterministic gates passed; maintainer approval is still required before import."
      : "Schema passed and the submission is ready for maintainer review.";
  }
  if (entry.triageGroup === "blocked") {
    if (entry.status === "import_ready" && risk.riskTier === "high") {
      return "High-risk import-ready submissions require manual maintainer risk review before import.";
    }
    const blockedGate = Object.entries(risk.policyMatrix || {}).find(
      ([, gate]) => gate?.status === "block",
    );
    if (blockedGate) {
      return `${blockedGate[0]} gate is blocking: ${blockedGate[1]?.summary || "review required"}`;
    }
    return "A deterministic policy or package safety blocker must be resolved first.";
  }
  if (entry.triageGroup === "likely_promo_spam") {
    return "This looks like a hosted product, paid placement, affiliate, or tools listing flow rather than free community content.";
  }
  if (entry.triageGroup === "needs_author_input") {
    return "Required schema fields or category metadata are missing or invalid.";
  }
  if (entry.triageGroup === "source_verification") {
    return "Maintainers need to verify the canonical source, docs, package, or repository.";
  }
  if (entry.triageGroup === "stale") {
    return "Author input has been pending long enough for a reminder.";
  }
  if (entry.triageGroup === "close_eligible") {
    return "Author input has been pending past the close window.";
  }
  if (report?.skipped) {
    return "The issue does not resolve cleanly to a supported submission category.";
  }
  return "Maintainer judgment is required before this can progress.";
}

function firstSubmissionSourceUrl(fields = {}) {
  return (
    normalizeValue(fields.github_url) ||
    normalizeValue(fields.docs_url) ||
    normalizeValue(fields.source_url) ||
    normalizeValue(fields.download_url) ||
    normalizeValue(fields.website_url) ||
    ""
  );
}

function buildSubmissionReviewChecklist({
  report,
  risk,
  status,
  sourceNeedsVerification,
  maintainerActions,
  activity,
}) {
  const items = [];
  if (report?.skipped) {
    items.push("Confirm whether this is a supported HeyClaude category.");
  } else {
    items.push("Confirm the category, slug, and public-facing metadata.");
  }
  if (!report?.ok) {
    items.push(
      activity?.authorCommentedWithoutBodyUpdate
        ? "Ask the author to edit the original issue body; comments do not update validation."
        : "Wait for the author to fix required fields before import.",
    );
  }
  if (sourceNeedsVerification) {
    items.push(
      "Verify the canonical source, docs, repository, or package URL.",
    );
  }
  if (risk.riskTier === "high" || risk.riskTier === "critical") {
    items.push(
      "Review high-risk permissions, auth, local data, or payment scope.",
    );
  } else if (risk.riskTier === "medium") {
    items.push("Review medium-risk capability and source signals.");
  }
  for (const action of maintainerActions) {
    if (!items.includes(action)) items.push(action);
  }
  if (status === "import_ready") {
    if (risk.policyDecision === "auto_import_eligible") {
      items.push(
        "Auto-import may open a PR after gates pass; maintainer review still gates merge.",
      );
    } else {
      items.push(
        "Apply import-approved only after source and category review.",
      );
    }
  }
  return items.slice(0, 7);
}

function buildSubmissionCommentDraft({ entry, report }) {
  const title = entry.name || entry.title || "this submission";
  if (entry.nextAction === "update_issue_body_required") {
    return [
      `Thanks for following up on ${title}. I still need the original issue fields updated before review can continue.`,
      "",
      "Please edit the issue body itself with the corrected metadata/source details. Comments are useful for discussion, but they do not update the validation source of truth or import preview.",
    ].join("\n");
  }
  if (entry.nextAction === "request_author_input") {
    const problems = [...(report.errors || []), ...(report.warnings || [])]
      .filter(Boolean)
      .slice(0, 8)
      .map((item) => `- ${item}`)
      .join("\n");
    return [
      `Thanks for submitting ${title}. I can't continue review until the issue has the required metadata.`,
      "",
      problems ||
        "- Please update the issue body with the required fields from the category template.",
      "",
      "Please edit the issue body with the missing details. Comments do not update the validation source of truth. Once the issue body is updated, the validator can re-check it and maintainer review can continue.",
    ].join("\n");
  }
  if (entry.nextAction === "verify_source") {
    return [
      `Thanks for submitting ${title}. This needs source verification before it can be imported.`,
      "",
      "Please make sure the issue includes the canonical GitHub repository, documentation URL, package URL, or other official source maintainers should review.",
    ].join("\n");
  }
  if (entry.nextAction === "send_stale_reminder") {
    return [
      `This submission is still waiting on author input before review can continue.`,
      "",
      "Please edit the original issue body with the missing details. Comments do not update validation. If there is no issue-body update after the stale window, maintainers may close it as not planned. You can reopen or resubmit when the details are ready.",
    ].join("\n");
  }
  if (entry.nextAction === "close_stale") {
    return [
      "Closing this submission as not planned because it has been waiting on required author input past the stale window.",
      "",
      "You can reopen or resubmit when the missing fields or source details are ready.",
    ].join("\n");
  }
  return "";
}

export function buildSubmissionQueue(issues = [], options = {}) {
  const entries = issues
    .filter(looksLikeSubmissionIssue)
    .map((issue) => {
      const report = validateSubmission(issue);
      const risk = analyzeIssueSubmissionRisk(issue, report);
      const status = submissionQueueStatus(report, issue, options);
      const staleState = submissionStaleState(issue, report, options);
      const contributorReview =
        risk.contributorAnalysis?.reviewSignals?.slice(0, 4) || [];
      const capabilityBuckets =
        risk.contributionAnalysis?.capabilityRiskBuckets || [];
      const maintainerActions =
        risk.contributionAnalysis?.maintainerActionItems || [];
      const activity = submissionActivityState(issue);
      const recommendedLabels = recommendedSubmissionLabels(issue, report);
      const labels = issueLabels(issue);
      const missingLabels = recommendedLabels.filter(
        (label) => !labels.includes(label),
      );
      const nextAction = submissionQueueNextAction(
        status,
        issue,
        risk.riskTier,
        risk.policyDecision,
        activity,
      );
      const sourceNeedsVerification = submissionSourceNeedsVerification(
        report,
        issue,
      );
      const entry = {
        number: issue.number ?? null,
        title: String(issue.title || ""),
        url: String(issue.url || ""),
        author:
          typeof issue.author === "string"
            ? issue.author
            : String(issue.author?.login || ""),
        updatedAt: String(issue.updatedAt || issue.updated_at || ""),
        bodyFingerprint: activity.bodyFingerprint,
        bodyUpdatedAt: activity.bodyUpdatedAt,
        authorCommentedAfterReview: activity.authorCommentedAfterReview,
        authorCommentedWithoutBodyUpdate:
          activity.authorCommentedWithoutBodyUpdate,
        lastAuthorCommentAt: activity.lastAuthorCommentAt,
        labels,
        recommendedLabels,
        missingLabels,
        status,
        nextAction,
        staleState,
        ageDays: submissionAgeDays(issue, options),
        sourceNeedsVerification,
        riskTier: risk.riskTier,
        riskFlags: risk.reviewFlags.map((flag) => flag.id),
        riskSummary: formatRiskSummary(risk.riskTier, capabilityBuckets),
        policyMatrix: risk.policyMatrix || {},
        policyDecision: risk.policyDecision || "maintainer_review",
        autoImportEligible: risk.policyDecision === "auto_import_eligible",
        contributorReview,
        sourceState: risk.contributionAnalysis?.sourceState || "unknown",
        maintainerActions,
        riskRecommendedAction: risk.recommendedAction,
        actionDue:
          status === "close_eligible"
            ? "close"
            : status === "stale_reminder_due"
              ? "remind"
              : nextAction === "update_issue_body_required"
                ? "update_issue_body"
                : status === "needs_author_input"
                  ? "author_input"
                  : status === "source_needs_verification"
                    ? "verify_source"
                    : "",
        category: report.category || "",
        slug: report.fields?.slug || "",
        name: report.fields?.name || "",
        sourceUrl: firstSubmissionSourceUrl(report.fields),
        sourceUrls: risk.contributionAnalysis?.sourceUrls?.slice(0, 5) || [],
        contributorContext: {
          login: risk.contributorAnalysis?.login || "",
          profileUrl: risk.contributorAnalysis?.profileUrl || "",
          resolutionStatus:
            risk.contributorAnalysis?.resolutionStatus || "unresolved",
          accountAgeDays: risk.contributorAnalysis?.accountAgeDays ?? null,
          publicRepos: risk.contributorAnalysis?.publicRepos ?? null,
          signals: contributorReview,
          warnings: risk.contributorAnalysis?.warnings || [],
        },
        policyReasons: Object.entries(risk.policyMatrix || {}).map(
          ([name, gate]) => ({
            name,
            status: gate?.status || "unknown",
            summary: gate?.summary || "",
            detail: gate?.detail || [],
          }),
        ),
        errors: report.errors || [],
        warnings: report.warnings || [],
        importPath:
          status === "import_ready" && report.category && report.fields?.slug
            ? `content/${report.category}/${report.fields.slug}.mdx`
            : "",
      };
      entry.triageGroup = submissionTriageGroup({ report, risk, status });
      entry.triageReason = submissionTriageReason({ entry, report, risk });
      entry.reviewChecklist = buildSubmissionReviewChecklist({
        report,
        risk,
        status,
        sourceNeedsVerification,
        maintainerActions,
        activity,
      });
      entry.commentDraft = buildSubmissionCommentDraft({ entry, report });
      return entry;
    })
    .sort((left, right) => {
      const statusOrder = {
        import_ready: 0,
        maintainer_review: 1,
        close_eligible: 2,
        stale_reminder_due: 3,
        needs_author_input: 4,
        source_needs_verification: 5,
        skipped: 6,
      };
      return (
        (statusOrder[left.status] ?? 99) - (statusOrder[right.status] ?? 99) ||
        right.updatedAt.localeCompare(left.updatedAt) ||
        Number(left.number ?? 0) - Number(right.number ?? 0)
      );
    });

  return {
    schemaVersion: 4,
    kind: "submission-queue",
    generatedAt: new Date().toISOString(),
    count: entries.length,
    summary: {
      ready: entries.filter((entry) => entry.triageGroup === "ready").length,
      blocked: entries.filter((entry) => entry.triageGroup === "blocked")
        .length,
      likelyPromoSpam: entries.filter(
        (entry) => entry.triageGroup === "likely_promo_spam",
      ).length,
      stale: entries.filter((entry) => entry.triageGroup === "stale").length,
      importReady: entries.filter((entry) => entry.status === "import_ready")
        .length,
      maintainerReview: entries.filter(
        (entry) => entry.status === "maintainer_review",
      ).length,
      needsAuthorInput: entries.filter(
        (entry) => entry.status === "needs_author_input",
      ).length,
      sourceNeedsVerification: entries.filter(
        (entry) => entry.sourceNeedsVerification,
      ).length,
      staleReminderDue: entries.filter(
        (entry) => entry.status === "stale_reminder_due",
      ).length,
      closeEligible: entries.filter(
        (entry) => entry.status === "close_eligible",
      ).length,
      highRisk: entries.filter(
        (entry) => entry.riskTier === "high" || entry.riskTier === "critical",
      ).length,
      needsChanges: entries.filter((entry) =>
        [
          "needs_author_input",
          "source_needs_verification",
          "stale_reminder_due",
          "close_eligible",
        ].includes(entry.status),
      ).length,
      skipped: entries.filter((entry) => entry.status === "skipped").length,
    },
    entries,
  };
}

export function validateSubmission(issue) {
  const labels = issueLabels(issue);
  const fields = parseIssueFormBody(issue.body ?? "");
  const categoryFromField = normalizeCategory(fields.category);
  const categoryFromLabels =
    labels
      .map(normalizeCategory)
      .find((category) => CORE_CATEGORIES.includes(category)) ?? "";
  const category = categoryFromLabels || categoryFromField;
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

  const productLike = looksLikeToolAppListing(fields, issue.body ?? "");
  if (category !== TOOLS_CATEGORY && productLike) {
    errors.push(
      `${toolListingRoutingMessage()}. Change the category to tools for maintainer-reviewed editorial listing prep, or submit the tools/app lead form instead.`,
    );
  }

  if (category === TOOLS_CATEGORY) {
    if (!hasProtectedSubmissionLabel(issue)) {
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
