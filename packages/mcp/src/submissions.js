export const SUBMISSION_SITE_URL = "https://heyclau.de/submit";

function normalizeText(value) {
  return String(value || "").trim();
}

function normalizeLower(value) {
  return normalizeText(value).toLowerCase();
}

export function slugify(value) {
  let output = "";
  let lastWasSeparator = false;

  for (const char of normalizeLower(value)) {
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

function normalizeDomain(value) {
  const trimmed = normalizeText(value);
  if (!trimmed) return "";
  try {
    const url = new URL(
      trimmed.includes("://") ? trimmed : `https://${trimmed}`,
    );
    return stripWww(url.hostname).toLowerCase();
  } catch {
    return stripWww(trimmed).toLowerCase();
  }
}

function stripWww(value) {
  const text = normalizeText(value);
  return text.toLowerCase().startsWith("www.") ? text.slice(4) : text;
}

function isCanonicalDomain(value) {
  const domain = normalizeDomain(value);
  const labels = domain.split(".");
  if (labels.length < 2) return false;
  return labels.every((label) => {
    if (!label || label.length > 63) return false;
    if (label.startsWith("-") || label.endsWith("-")) return false;
    return [...label].every(
      (char) =>
        (char >= "a" && char <= "z") ||
        (char >= "0" && char <= "9") ||
        char === "-",
    );
  });
}

function isHttpsUrl(value) {
  const trimmed = normalizeText(value);
  if (!trimmed) return true;
  try {
    return new URL(trimmed).protocol === "https:";
  } catch {
    return false;
  }
}

const TRACKING_QUERY_KEYS = new Set([
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

function isTrackingQueryKey(key) {
  const normalized = key.trim().toLowerCase();
  return normalized.startsWith("utm_") || TRACKING_QUERY_KEYS.has(normalized);
}

function isLikelyAffiliateUrl(value) {
  const trimmed = normalizeText(value);
  if (!trimmed) return false;
  try {
    const url = new URL(trimmed);
    for (const key of url.searchParams.keys()) {
      if (isTrackingQueryKey(key)) return true;
    }
  } catch {
    return false;
  }
  return false;
}

function isPublicContact(value) {
  const contact = normalizeText(value);
  if (!contact) return true;
  if (isEmailLike(contact)) return true;
  if (isGitHubHandle(contact)) return true;
  try {
    const url = new URL(contact);
    return (
      url.protocol === "https:" &&
      url.hostname === "github.com" &&
      url.pathname.split("/").filter(Boolean).length === 1
    );
  } catch {
    return false;
  }
}

function isEmailLike(value) {
  const contact = normalizeText(value);
  const parts = contact.split("@");
  if (parts.length !== 2 || !parts[0] || !parts[1]) return false;
  if (
    [...contact].some((char) => char === " " || char === "\n" || char === "\t")
  ) {
    return false;
  }
  return parts[1].includes(".");
}

function isGitHubHandle(value) {
  const handle = normalizeText(value).startsWith("@")
    ? normalizeText(value).slice(1)
    : normalizeText(value);
  if (!handle || handle.length > 39) return false;
  if (handle.startsWith("-") || handle.endsWith("-")) return false;
  return [...handle].every(
    (char) =>
      (char >= "a" && char <= "z") ||
      (char >= "A" && char <= "Z") ||
      (char >= "0" && char <= "9") ||
      char === "-",
  );
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

function isIsoDate(value) {
  const text = normalizeText(value);
  if (text.length !== 10) return false;
  return [...text].every((char, index) => {
    if (index === 4 || index === 7) return char === "-";
    return char >= "0" && char <= "9";
  });
}

function tagsToText(value) {
  return Array.isArray(value)
    ? value.map(normalizeText).filter(Boolean).join(", ")
    : normalizeText(value);
}

export function normalizeSubmissionFields(fields = {}) {
  const normalized = {};
  for (const [key, value] of Object.entries(fields || {})) {
    if (value === undefined || value === null) continue;
    normalized[key] = key === "tags" ? tagsToText(value) : normalizeText(value);
  }

  if (!normalized.name && normalized.title) normalized.name = normalized.title;
  if (!normalized.slug && normalized.name)
    normalized.slug = slugify(normalized.name);
  if (normalized.brand_domain) {
    normalized.brand_domain = normalizeDomain(normalized.brand_domain);
  }

  const sourceUrl = normalized.source_url;
  if (sourceUrl && !normalized.github_url && !normalized.docs_url) {
    try {
      const url = new URL(sourceUrl);
      if (url.hostname === "github.com") {
        normalized.github_url = sourceUrl;
      } else {
        normalized.docs_url = sourceUrl;
      }
    } catch {
      normalized.docs_url = sourceUrl;
    }
  }

  if (!normalized.card_description && normalized.description) {
    const oneLine = compactWhitespace(normalized.description);
    normalized.card_description =
      oneLine.length <= 140 ? oneLine : `${oneLine.slice(0, 137).trimEnd()}...`;
  }

  return normalized;
}

function categoryKeys(spec) {
  return Object.keys(spec?.categories || {});
}

function modelFor(spec, category) {
  return spec?.categories?.[category] || null;
}

function requiredFields(model) {
  return (model?.fields || [])
    .filter((field) => field.required)
    .map((field) => field.id);
}

function fieldLabels(model) {
  return new Map((model?.fields || []).map((field) => [field.id, field.label]));
}

function fieldOptions(model, fieldId) {
  const field = (model?.fields || []).find((item) => item.id === fieldId);
  return new Set((field?.options || []).map(normalizeLower).filter(Boolean));
}

function validateSelectOptions(model, normalized, errors) {
  for (const field of model?.fields || []) {
    if (!Array.isArray(field.options) || !field.options.length) continue;
    const value = normalizeLower(normalized[field.id]);
    if (!value) continue;
    const validValues = new Set(field.options.map(normalizeLower));
    if (!validValues.has(value)) {
      errors.push(`Invalid ${field.id}: ${value}`);
    }
  }
}

function selectedCategory(spec, category) {
  const normalized = normalizeLower(category);
  return categoryKeys(spec).includes(normalized) ? normalized : "";
}

function validateAgainstSpec(spec, fields = {}) {
  const normalized = normalizeSubmissionFields(fields);
  const category = selectedCategory(spec, normalized.category);
  const model = modelFor(spec, category);
  const errors = [];
  const warnings = [];

  if (!category || !model) {
    errors.push("Missing or unsupported submission category.");
    return {
      valid: false,
      category: normalized.category || "",
      normalized,
      errors,
      warnings,
    };
  }

  normalized.category = category;
  const missingRequiredFields = requiredFields(model).filter(
    (field) => !normalizeText(normalized[field]),
  );
  for (const field of missingRequiredFields) {
    errors.push(`Missing required field: ${field}`);
  }

  if (normalized.slug && slugify(normalized.slug) !== normalized.slug) {
    errors.push("Invalid slug format: expected kebab-case.");
  }
  if (normalized.description && normalized.description.length < 12) {
    errors.push("Description is too short for review.");
  }
  if (normalized.card_description && normalized.card_description.length < 8) {
    errors.push("Card description is too short for review.");
  }
  if (!isPublicContact(normalized.contact_email)) {
    errors.push(
      "Invalid public contact: use a GitHub handle, GitHub profile URL, or email.",
    );
  }

  for (const field of [
    "github_url",
    "docs_url",
    "download_url",
    "source_url",
  ]) {
    if (!isHttpsUrl(normalized[field])) {
      errors.push(`${field} must be a valid https URL.`);
    }
    if (isLikelyAffiliateUrl(normalized[field])) {
      errors.push(
        `Contributor submissions cannot include affiliate/referral URLs: ${field}.`,
      );
    }
  }

  if (normalized.brand_domain && !isCanonicalDomain(normalized.brand_domain)) {
    errors.push("brand_domain must be a canonical domain such as asana.com.");
  }

  validateSelectOptions(model, normalized, errors);

  if (
    category === "skills" &&
    !normalizeText(normalized.install_command) &&
    !normalizeText(normalized.download_url) &&
    !normalizeText(normalized.github_url) &&
    !normalizeText(normalized.docs_url) &&
    !normalizeText(normalized.full_copyable_content) &&
    !normalizeText(normalized.retrieval_sources)
  ) {
    errors.push(
      "Skills submissions require install_command, source URL, retrieval_sources, or full_copyable_content.",
    );
  }
  if (category === "collections" && !normalizeText(normalized.items)) {
    errors.push("Collections submissions require items.");
  }
  if (category === "guides" && !normalizeText(normalized.guide_content)) {
    errors.push("Guide submissions require guide_content.");
  }
  if (category === "skills") {
    const skillType = normalizeLower(normalized.skill_type);
    const skillLevel = normalizeLower(normalized.skill_level);
    const verifiedAt = normalizeText(normalized.verified_at);
    const retrievalSources = normalizeText(normalized.retrieval_sources);
    if (verifiedAt && !isIsoDate(verifiedAt)) {
      errors.push("verified_at must use YYYY-MM-DD format.");
    }
    if (skillType === "capability-pack") {
      if (!verifiedAt)
        errors.push("capability-pack skills require verified_at.");
      if (!retrievalSources) {
        errors.push("capability-pack skills require retrieval_sources.");
      }
      if (skillLevel && skillLevel !== "expert") {
        errors.push("capability-pack skills must use skill_level=expert.");
      }
    }
    if (retrievalSources) {
      for (const url of splitList(retrievalSources)) {
        if (!isHttpsUrl(url)) {
          errors.push(`retrieval_sources must use https URLs: ${url}`);
        }
      }
    }
  }
  if (!normalized.github_url && !normalized.docs_url) {
    warnings.push("No github_url/docs_url provided.");
  }
  if (category === "skills" && !normalized.tested_platforms) {
    warnings.push("No tested_platforms provided.");
  }

  return {
    valid: errors.length === 0,
    category,
    normalized,
    errors,
    warnings,
    missingRequiredFields,
    requiredFields: requiredFields(model),
  };
}

export function buildPrDraftFromSpec(spec, fields = {}) {
  const validation = validateAgainstSpec(spec, fields);
  const category = validation.category;
  const model = modelFor(spec, category);
  const labelsById = fieldLabels(model);
  const fieldIds = [
    ...(model?.fields || []).map((field) => field.id),
    ...Object.keys(validation.normalized).filter(
      (field) =>
        !(model?.fields || []).some((candidate) => candidate.id === field),
    ),
  ];
  const body = fieldIds
    .filter((field) => field !== "title" && field !== "source_url")
    .map((field) => {
      const value = normalizeText(validation.normalized[field]);
      if (!value && field !== "category") return "";
      return [
        `### ${labelsById.get(field) || field.replaceAll("_", " ")}`,
        "",
        value || category,
        "",
      ].join("\n");
    })
    .filter(Boolean)
    .join("\n")
    .trimEnd();
  const modelLabel = model?.label || "Entry";
  const label = modelLabel.endsWith("s") ? modelLabel.slice(0, -1) : modelLabel;

  return {
    title: `Add ${label}: ${validation.normalized.name || "New directory entry"}`,
    body,
  };
}

function setParam(params, key, value) {
  const normalized = tagsToText(value);
  if (normalized) params.set(key, normalized);
}

export function buildSubmissionUrlsFromSpec(spec, args = {}) {
  const fields = normalizeSubmissionFields(args.fields || {});
  const validation = validateAgainstSpec(spec, fields);
  const category = validation.category || fields.category || "";
  const prDraft = buildPrDraftFromSpec(spec, fields);
  const submitUrl = new URL(SUBMISSION_SITE_URL);

  for (const [key, value] of Object.entries(fields)) {
    if (key === "source_url" && (fields.github_url || fields.docs_url))
      continue;
    setParam(submitUrl.searchParams, key, value);
  }
  if (category) {
    submitUrl.searchParams.set("category", category);
  }

  return {
    ok: true,
    valid: validation.valid,
    category,
    slug: fields.slug || "",
    submitUrl: submitUrl.toString(),
    reviewUrl: submitUrl.toString(),
    prDraft: args.includePrBody ? prDraft : { title: prDraft.title },
    validation: {
      errors: validation.errors,
      warnings: validation.warnings,
      missingRequiredFields: validation.missingRequiredFields || [],
    },
    reviewModel:
      "PR-first: source-backed submissions are opened as single-entry PRs. Content-only PRs may be merged automatically after content validation, Superagent, and private maintainer-agent review pass.",
    artifactPolicy:
      "Community ZIP/MCPB artifacts are review material only and are not published as HeyClaude-hosted downloads.",
  };
}

export function getSubmissionSchemaFromSpec(spec, args = {}) {
  const category = selectedCategory(spec, args.category);
  if (args.category && !category) {
    return {
      ok: false,
      error: {
        code: "not_found",
        message: `No HeyClaude submission schema found for ${args.category}.`,
      },
    };
  }

  return {
    ok: true,
    schemaVersion: spec.schemaVersion,
    categories: categoryKeys(spec),
    category: category || "",
    schema: category ? spec.categories[category] : spec.categories,
    prIntake: spec.prIntake || null,
  };
}

export function validateSubmissionDraftFromSpec(spec, args = {}) {
  const validation = validateAgainstSpec(spec, args.fields || {});
  const prDraft = validation.category
    ? buildPrDraftFromSpec(spec, validation.normalized)
    : null;

  return {
    ok: true,
    valid: validation.valid,
    category: validation.category,
    slug: validation.normalized.slug || "",
    fields: validation.normalized,
    requiredFields: validation.requiredFields || [],
    missingRequiredFields: validation.missingRequiredFields || [],
    errors: validation.errors,
    warnings: validation.warnings,
    prPreview: prDraft
      ? {
          title: prDraft.title,
        }
      : null,
    nextSteps: validation.valid
      ? [
          "Check for duplicate registry entries.",
          "Open the generated HeyClaude submit URL and continue with GitHub.",
          "Source-backed, non-artifact submissions are reviewed through the private PR gate.",
          "Eligible content PRs may be merged automatically after validation, Superagent, and private maintainer-agent review pass.",
        ]
      : ["Fix validation errors before opening a public submission PR."],
    artifactPolicy:
      "Do not request HeyClaude /downloads hosting for community-submitted ZIP/MCPB artifacts.",
  };
}

function singularLabel(value) {
  const label = normalizeText(value || "Entry");
  return label.endsWith("s") ? label.slice(0, -1) : label;
}

function exampleValueForField(fieldId, category, label) {
  switch (fieldId) {
    case "name":
    case "title":
      return `Example ${singularLabel(label)}`;
    case "slug":
      return `example-${category || "entry"}`;
    case "category":
      return category;
    case "github_url":
      return `https://github.com/example/example-${category || "entry"}`;
    case "docs_url":
    case "source_url":
      return `https://example.com/${category || "entry"}/docs`;
    case "download_url":
      return `https://example.com/${category || "entry"}/download.zip`;
    case "brand_name":
      return "Example";
    case "brand_domain":
      return "example.com";
    case "author":
      return "@example";
    case "contact_email":
      return "@example";
    case "tags":
      return "claude, workflow, example";
    case "description":
      return `A practical ${singularLabel(label).toLowerCase()} for Claude users that includes source-backed setup and usage details.`;
    case "card_description":
      return `Practical ${singularLabel(label).toLowerCase()} for Claude workflows.`;
    case "full_copyable_content":
      return `# Example ${singularLabel(label)}\n\nUse this complete content as the copyable public artifact.`;
    case "install_command":
      return `npx -y example-${category || "entry"}`;
    case "usage_snippet":
      return `Use this ${singularLabel(label).toLowerCase()} to speed up a Claude workflow.`;
    case "command_syntax":
      return `/example-${category || "entry"} <input>`;
    case "trigger":
      return "PostToolUse";
    case "guide_content":
      return `# Example ${singularLabel(label)}\n\nExplain the setup, usage, verification, and troubleshooting steps.`;
    case "items":
      return `- Example ${singularLabel(label)} item\n- Source-backed companion resource`;
    case "script_language":
      return "bash";
    case "skill_type":
      return "workflow";
    case "skill_level":
      return "intermediate";
    case "verification_status":
      return "validated";
    case "verified_at":
      return "2026-05-17";
    case "config_snippet":
      return JSON.stringify({ example: true }, null, 2);
    case "retrieval_sources":
      return "- https://example.com/docs";
    case "tested_platforms":
      return "Claude Code, Codex, Cursor";
    case "prerequisites":
      return "- Node.js 20+\n- Claude-compatible MCP client";
    case "safety_notes":
      return "- Runs user-configured code with local workspace permissions";
    case "privacy_notes":
      return "- Reads local project files and may send selected context to the configured API";
    case "troubleshooting_section":
      return "If setup fails, verify the install command and source URL first.";
    case "installation_order":
      return "Install dependencies, configure the entry, then run the verification step.";
    case "estimated_setup_time":
      return "10 minutes";
    case "difficulty":
      return "intermediate";
    default:
      return `Example ${fieldId.replaceAll("_", " ")}`;
  }
}

function exampleForCategory(spec, category) {
  const model = modelFor(spec, category);
  const fields = Object.fromEntries(
    (model?.fields || []).map((field) => [
      field.id,
      exampleValueForField(field.id, category, model?.label),
    ]),
  );
  fields.category = category;

  const minimalFields = {};
  for (const field of requiredFields(model)) {
    minimalFields[field] = fields[field];
  }
  minimalFields.category = category;

  for (const field of [
    "name",
    "description",
    "github_url",
    "docs_url",
    "install_command",
    "usage_snippet",
    "download_url",
    "full_copyable_content",
    "guide_content",
    "items",
  ]) {
    if (fields[field]) minimalFields[field] = fields[field];
  }

  return {
    category,
    label: model?.label || category,
    template: model?.template || "",
    requiredFields: requiredFields(model),
    minimalFields,
    completeFields: fields,
    notes: [
      "Use canonical source URLs and avoid affiliate/referral links.",
      "The generated PR draft can become a reviewable submission after gates pass, but it is not automatic publication.",
      "Community package archives are quarantine/review material, not public HeyClaude-hosted downloads.",
    ],
  };
}

export function getSubmissionExamplesFromSpec(spec, args = {}) {
  const category = selectedCategory(spec, args.category);
  if (args.category && !category) {
    return {
      ok: false,
      error: {
        code: "not_found",
        message: `No HeyClaude submission examples found for ${args.category}.`,
      },
    };
  }

  const categories = category ? [category] : categoryKeys(spec);
  return {
    ok: true,
    categories: categories.map((key) => exampleForCategory(spec, key)),
    reviewModel:
      "Examples are draft helpers only; maintainers review generated PRs before merge.",
  };
}

export function prepareSubmissionDraftFromSpec(spec, args = {}) {
  const fields = normalizeSubmissionFields(args.fields || {});
  const validation = validateAgainstSpec(spec, fields);
  const prDraft = validation.category
    ? buildPrDraftFromSpec(spec, validation.normalized)
    : null;
  const urls = buildSubmissionUrlsFromSpec(spec, {
    fields: validation.normalized,
    includePrBody: true,
  });

  return {
    ok: true,
    valid: validation.valid,
    category: validation.category,
    slug: validation.normalized.slug || "",
    normalizedFields: validation.normalized,
    requiredFields: validation.requiredFields || [],
    missingRequiredFields: validation.missingRequiredFields || [],
    errors: validation.errors,
    warnings: validation.warnings,
    prDraft: prDraft ? { ...prDraft } : null,
    submitUrl: urls.submitUrl,
    reviewUrl: urls.reviewUrl,
    reviewChecklist: [
      "Confirm category fit and required fields before opening the PR.",
      "Check for existing registry entries with the same source, slug, or title.",
      "Verify source URLs, install commands, and copied content before maintainer approval.",
      "Add safety_notes/privacy_notes when a submission runs code, handles credentials, reads local data, writes externally, or uses background workers.",
      "Use source-backed or copyable-content submissions; do not request public /downloads hosting for community ZIPs.",
      "Disclose paid, sponsored, affiliate, or commercial content separately from free community submissions.",
    ],
    submissionPolicy:
      "This tool prepares a PR-first submission draft only. Eligible content-only PRs may be merged automatically after content validation, Superagent, and private maintainer-agent review pass; platform, workflow, package, and generated-artifact changes are never auto-merged by this path.",
    artifactPolicy:
      "Community ZIP/MCPB artifacts are quarantine/review material only. Maintainer-built packages are the only HeyClaude-hosted downloads.",
  };
}

export function reviewSubmissionDraftFromSpec(spec, args = {}, entries = []) {
  const validation = validateAgainstSpec(spec, args.fields || {});
  const duplicateArgs = {
    category: validation.category,
    slug: validation.normalized.slug,
    title: validation.normalized.title || validation.normalized.name,
    name: validation.normalized.name,
    // Forward every candidate URL the submission carries rather than picking a
    // single winner via `||` — see `collectSubmissionCandidateUrls`. A
    // submission with both `github_url` and `docs_url` was previously dropping
    // the second candidate from duplicate detection.
    sourceUrls: [
      validation.normalized.github_url,
      validation.normalized.docs_url,
      validation.normalized.source_url,
      validation.normalized.download_url,
      validation.normalized.website_url,
    ].filter(Boolean),
    brandDomain: validation.normalized.brand_domain,
    limit: args.duplicateLimit || 5,
  };
  const duplicates = searchDuplicateEntries(entries, duplicateArgs);
  const recommendedAction = validation.valid
    ? duplicates.count > 0
      ? "review_possible_duplicate"
      : "open_review_pr"
    : "fix_required_fields";

  return {
    ok: true,
    valid: validation.valid,
    category: validation.category,
    slug: validation.normalized.slug || "",
    recommendedAction,
    errors: validation.errors,
    warnings: validation.warnings,
    missingRequiredFields: validation.missingRequiredFields || [],
    duplicateReview: duplicates,
    reviewChecklist: [
      "Schema-valid is not publish-valid; maintainer review is still required.",
      "Check category fit against the actual artifact, not only the submitter's selected category.",
      "Verify source availability, install commands, and any credential/payment-sensitive behavior.",
      "Keep packages source-backed unless maintainers explicitly rebuild and verify a first-party artifact.",
      "Reject or request edits for affiliate/referral links, unsupported claims, or unclear paid/sponsored positioning.",
    ],
    nextSteps: validation.valid
      ? [
          "Open or update the canonical single-entry GitHub submission PR.",
          "Let the private gate apply review labels after source, duplicate, and safety checks.",
        ]
      : ["Fix required fields and validation errors before opening a PR."],
    artifactPolicy:
      "Community-submitted ZIP/MCPB packages must not be treated as trusted public downloads.",
  };
}

// Normalize a URL for duplicate-detection matching. Lowercases scheme + host,
// strips `www.`, drops `#hash`, drops `utm_*` and known affiliate/tracking
// query params (so links shared with marketing parameters still match the
// canonical form), and strips a trailing `/` on non-root paths. Returns "" for
// unparseable input — unparseable URLs simply don't match anything, which is
// safe (the slug/title/brand_domain matches still run).
function normalizeSubmissionUrlForMatch(value) {
  const trimmed = normalizeText(value);
  if (!trimmed) return "";
  let url;
  try {
    url = new URL(trimmed);
  } catch {
    return "";
  }
  url.protocol = url.protocol.toLowerCase();
  url.hostname = url.hostname.toLowerCase().replace(/^www\./, "");
  url.hash = "";
  const droppedKeys = [];
  for (const key of url.searchParams.keys()) {
    if (isTrackingQueryKey(key)) droppedKeys.push(key);
  }
  for (const key of droppedKeys) url.searchParams.delete(key);
  // Normalize the pathname before serializing so a trailing `/` is stripped on
  // non-root paths regardless of any query string. Checking the serialized
  // string's `endsWith("/")` misses cases like
  // `https://example.com/foo/?ref=x`, where the slash sits before the query and
  // is never the last character — leaving it would break the match against the
  // canonical `https://example.com/foo?ref=x`.
  if (url.pathname !== "/" && url.pathname.endsWith("/")) {
    url.pathname = url.pathname.slice(0, -1);
  }
  return url.toString();
}

// Every external-publisher URL field the indexed entry may carry. Includes
// `downloadUrl`, `websiteUrl`, `githubUrl`, and `trustSignals.sourceUrls` —
// each is a real entry field today and a duplicate that lives only on one of
// them must still match a submitter's URL. Internal `url`/`canonicalUrl`/
// `llmsUrl`/`apiUrl` stay in the list because a submitter who pastes the
// HeyClaude canonical URL of an existing entry is still describing the same
// resource and should be flagged as a duplicate.
function collectEntrySourceUrls(entry) {
  const candidates = [
    entry.documentationUrl,
    entry.repoUrl,
    entry.githubUrl,
    entry.websiteUrl,
    entry.downloadUrl,
    entry.url,
    entry.canonicalUrl,
    entry.llmsUrl,
    entry.apiUrl,
  ];
  const trustSourceUrls = entry?.trustSignals?.sourceUrls;
  if (Array.isArray(trustSourceUrls)) {
    for (const value of trustSourceUrls) candidates.push(value);
  }
  const normalized = new Set();
  for (const candidate of candidates) {
    const value = normalizeSubmissionUrlForMatch(candidate);
    if (value) normalized.add(value);
  }
  return normalized;
}

// Collect every URL the caller has offered as a duplicate-search candidate.
// Accepts the legacy scalar `sourceUrl`, the new `sourceUrls` array, and the
// fielded `githubUrl`/`docsUrl`/`downloadUrl`/`websiteUrl` keys so callers
// don't have to `||`-chain a single winner and silently drop the rest.
function collectSubmissionCandidateUrls(args = {}) {
  const candidates = [
    args.sourceUrl,
    args.githubUrl,
    args.docsUrl,
    args.downloadUrl,
    args.websiteUrl,
  ];
  if (Array.isArray(args.sourceUrls)) {
    for (const value of args.sourceUrls) candidates.push(value);
  }
  const normalized = new Set();
  for (const candidate of candidates) {
    const value = normalizeSubmissionUrlForMatch(candidate);
    if (value) normalized.add(value);
  }
  return normalized;
}

// First URL that appears in both Sets, or "" if none. Returning the matched
// URL (rather than just a boolean) lets callers surface which URL hit if they
// ever want to extend the `reasons` payload — today the predicate path is
// boolean-only, but the value is free.
function findOverlappingSourceUrl(entryUrls, candidateUrls) {
  for (const value of candidateUrls) {
    if (entryUrls.has(value)) return value;
  }
  return "";
}

export function searchDuplicateEntries(entries = [], args = {}) {
  const limit = Math.max(1, Math.min(10, Math.trunc(Number(args.limit) || 5)));
  const category = normalizeLower(args.category);
  const slug = normalizeLower(args.slug);
  const title = normalizeLower(args.title || args.name);
  const brandDomain = normalizeDomain(args.brandDomain);
  const candidateUrls = collectSubmissionCandidateUrls(args);

  const matches = [];
  for (const entry of entries) {
    const reasons = [];
    if (category && entry.category !== category) continue;
    if (slug && normalizeLower(entry.slug) === slug) reasons.push("slug");
    if (title && normalizeLower(entry.title) === title) reasons.push("title");
    if (brandDomain && normalizeDomain(entry.brandDomain) === brandDomain) {
      reasons.push("brand_domain");
    }
    if (
      candidateUrls.size > 0 &&
      findOverlappingSourceUrl(collectEntrySourceUrls(entry), candidateUrls)
    ) {
      reasons.push("source_url");
    }

    if (!reasons.length) continue;
    matches.push({
      key: `${entry.category}:${entry.slug}`,
      category: entry.category,
      slug: entry.slug,
      title: entry.title,
      description: entry.description || entry.seoDescription || "",
      canonicalUrl: entry.canonicalUrl || entry.url || "",
      brandName: entry.brandName || "",
      brandDomain: entry.brandDomain || "",
      reasons,
    });
    if (matches.length >= limit) break;
  }

  return {
    ok: true,
    count: matches.length,
    matches,
    reviewNote:
      matches.length > 0
        ? "Potential duplicates require maintainer review before submitting a new entry."
        : "No obvious registry duplicate found in the generated search index.",
  };
}

export function getCategorySubmissionGuidanceFromSpec(spec, args = {}) {
  const category = selectedCategory(spec, args.category);
  if (args.category && !category) {
    return {
      ok: false,
      error: {
        code: "not_found",
        message: `No HeyClaude submission guidance found for ${args.category}.`,
      },
    };
  }

  const categories = category ? [category] : categoryKeys(spec);
  return {
    ok: true,
    categories: categories.map((key) => {
      const model = modelFor(spec, key);
      return {
        category: key,
        label: model?.label || key,
        description: model?.description || "",
        template: model?.template || "",
        requiredFields: requiredFields(model),
        optionalFields: (model?.fields || [])
          .filter((field) => !field.required)
          .map((field) => field.id),
        guidance: [
          "Use canonical source URLs and avoid affiliate/referral links.",
          "Brand domain is optional but helps HeyClaude show accurate logos and trust signals.",
          "Schema-valid submissions still require maintainer review before publication.",
        ],
      };
    }),
  };
}
