export interface SubmissionDraftFields {
  category?: unknown;
  slug?: unknown;
  name?: unknown;
  title?: unknown;
  description?: unknown;
  card_description?: unknown;
  contact_email?: unknown;
  [key: string]: unknown;
}

const SUPPORTED_CATEGORIES = new Set([
  "agents",
  "mcp",
  "skills",
  "hooks",
  "commands",
  "rules",
  "guides",
  "collections",
  "statuslines",
  "tools",
]);
const MAX_BRANCH_NAME_LENGTH = 120;
const MAX_SOURCE_CONTENT_CHARS = 20_000;
const MAX_SLUG_INPUT_CHARS = 400;
const MIN_BRANCH_SLUG_CHARS = 16;
const SUBMISSION_BRANCH_PREFIX = "heyclaude/submit-";

function text(value: unknown) {
  return String(value ?? "").trim();
}

function mdxPlainText(value: unknown) {
  return text(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/{/g, "&#123;")
    .replace(/}/g, "&#125;")
    .replace(/\\/g, "\\\\")
    .replace(/([`*_[\]()!])/g, "\\$1")
    .replace(/^(import|export)(\s)/gim, "\\$1$2")
    .replace(/^(#+)/gm, "\\$1");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

export function draftFieldsFromBody(body: unknown): SubmissionDraftFields {
  if (!isRecord(body)) return {};
  return isRecord(body.fields) ? body.fields : body;
}

export function slugify(value: unknown) {
  // Bound regex work before normalization; the final slice controls output length.
  return text(value)
    .slice(0, MAX_SLUG_INPUT_CHARS)
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

export function normalizeCategory(value: unknown) {
  const category = text(value).toLowerCase();
  return SUPPORTED_CATEGORIES.has(category) ? category : "";
}

function shortHash(value: string) {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(36).padStart(8, "0").slice(0, 8);
}

function submissionBranchName(category: string, slug: string) {
  const prefix = `${SUBMISSION_BRANCH_PREFIX}${category}-`;
  const full = `${prefix}${slug}`;
  if (full.length <= MAX_BRANCH_NAME_LENGTH) return full;
  const suffix = `-${shortHash(slug)}`;
  const available = MAX_BRANCH_NAME_LENGTH - prefix.length - suffix.length;
  if (available < MIN_BRANCH_SLUG_CHARS) {
    throw new Error(
      "Draft category leaves too little room for a safe branch name.",
    );
  }
  return `${prefix}${slug.slice(0, available).replace(/-+$/g, "")}${suffix}`;
}

export function buildDraftTarget(
  fields: SubmissionDraftFields,
  baseRef: string,
) {
  const category = normalizeCategory(fields.category);
  const slug = slugify(fields.slug || fields.name || fields.title);
  if (!category || !slug) {
    throw new Error("Draft requires a supported category and slug.");
  }

  const branchName = submissionBranchName(category, slug);
  return {
    category,
    slug,
    baseRef,
    branchName,
    targetPath: `content/${category}/${slug}.mdx`,
  };
}

function yamlScalar(value: unknown) {
  const normalized = text(value).replace(/\r\n?/g, "\n");
  if (normalized.includes("\n")) {
    return `|\n${normalized
      .split("\n")
      .map((line) => `  ${line}`)
      .join("\n")}`;
  }
  return JSON.stringify(normalized);
}

function yamlArray(values: unknown[]) {
  // Flow sequences cannot contain block scalars, so collapse multiline items.
  const normalized = values
    .map((value) =>
      text(value)
        .replaceAll("\r\n", "\n")
        .replaceAll("\r", "\n")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .join(" "),
    )
    .filter(Boolean);
  return `[${normalized.map(yamlScalar).join(", ")}]`;
}

function lines(value: unknown) {
  return text(value)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function oneLine(value: unknown, fallback = "") {
  const normalized = text(value || fallback).replace(/\s+/g, " ");
  const codePoints = Array.from(normalized);
  return codePoints.length <= 160
    ? normalized
    : `${codePoints.slice(0, 157).join("").trimEnd()}...`;
}

function validGitHubLogin(value: string) {
  return /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/.test(value);
}

function boundedText(value: unknown, maxChars: number) {
  return text(value).slice(0, maxChars);
}

export function buildContributorMdx(
  fields: SubmissionDraftFields,
  githubLogin?: string,
) {
  const target = buildDraftTarget(fields, "main");
  const title = text(fields.name || fields.title);
  const description = text(fields.description || fields.card_description);
  const safeGitHubLogin =
    githubLogin && validGitHubLogin(githubLogin) ? githubLogin : "";
  const submittedBy = safeGitHubLogin ? `@${safeGitHubLogin}` : "website";
  const submittedByUrl = safeGitHubLogin
    ? `https://github.com/${safeGitHubLogin}`
    : "";
  const tags = text(fields.tags)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 8);
  const sourceContent = boundedText(
    fields.full_copyable_content || fields.guide_content,
    MAX_SOURCE_CONTENT_CHARS,
  );
  const safetyNotes = lines(fields.safety_notes);
  const privacyNotes = lines(fields.privacy_notes);
  const safeDescription = mdxPlainText(description);
  const timestamp = new Date();
  const submittedAt = timestamp.toISOString();
  const frontmatter: Array<string | null> = [
    "---",
    `title: ${yamlScalar(title)}`,
    `slug: ${yamlScalar(target.slug)}`,
    `category: ${yamlScalar(target.category)}`,
    `description: ${yamlScalar(description)}`,
    `cardDescription: ${yamlScalar(fields.card_description || oneLine(description))}`,
    `seoTitle: ${yamlScalar(fields.seo_title || `${title} for Claude`)}`,
    `seoDescription: ${yamlScalar(fields.seo_description || oneLine(description))}`,
    `author: ${yamlScalar(fields.author || submittedBy)}`,
    submittedByUrl ? `authorProfileUrl: ${yamlScalar(submittedByUrl)}` : null,
    `dateAdded: ${yamlScalar(submittedAt.slice(0, 10))}`,
    `submittedBy: ${yamlScalar(submittedBy)}`,
    submittedByUrl ? `submittedByUrl: ${yamlScalar(submittedByUrl)}` : null,
    `submittedAt: ${yamlScalar(submittedAt)}`,
    tags.length ? `tags: [${tags.map(yamlScalar).join(", ")}]` : "tags: []",
    text(fields.brand_name)
      ? `brandName: ${yamlScalar(fields.brand_name)}`
      : null,
    text(fields.brand_domain)
      ? `brandDomain: ${yamlScalar(fields.brand_domain)}`
      : null,
    text(fields.github_url)
      ? `repoUrl: ${yamlScalar(fields.github_url)}`
      : null,
    text(fields.docs_url)
      ? `documentationUrl: ${yamlScalar(fields.docs_url)}`
      : null,
    text(fields.website_url)
      ? `websiteUrl: ${yamlScalar(fields.website_url)}`
      : null,
    text(fields.download_url)
      ? `downloadUrl: ${yamlScalar(fields.download_url)}`
      : null,
    text(fields.install_command)
      ? `installCommand: ${yamlScalar(fields.install_command)}`
      : null,
    text(fields.usage_snippet)
      ? `usageSnippet: ${yamlScalar(fields.usage_snippet)}`
      : null,
    text(fields.config_snippet)
      ? `configSnippet: ${yamlScalar(fields.config_snippet)}`
      : null,
    sourceContent ? `copySnippet: ${yamlScalar(sourceContent)}` : null,
    text(fields.command_syntax)
      ? `commandSyntax: ${yamlScalar(fields.command_syntax)}`
      : null,
    text(fields.trigger) ? `trigger: ${yamlScalar(fields.trigger)}` : null,
    text(fields.script_language)
      ? `scriptLanguage: ${yamlScalar(fields.script_language)}`
      : null,
    text(fields.prerequisites)
      ? `prerequisites: ${yamlArray(lines(fields.prerequisites))}`
      : null,
    safetyNotes.length ? `safetyNotes: ${yamlArray(safetyNotes)}` : null,
    privacyNotes.length ? `privacyNotes: ${yamlArray(privacyNotes)}` : null,
    text(fields.retrieval_sources)
      ? `retrievalSources: ${yamlArray(lines(fields.retrieval_sources))}`
      : null,
    text(fields.tested_platforms)
      ? `testedPlatforms: ${yamlArray(lines(fields.tested_platforms))}`
      : null,
    text(fields.skill_type)
      ? `skillType: ${yamlScalar(fields.skill_type)}`
      : null,
    text(fields.skill_level)
      ? `skillLevel: ${yamlScalar(fields.skill_level)}`
      : null,
    text(fields.verification_status)
      ? `verificationStatus: ${yamlScalar(fields.verification_status)}`
      : null,
    text(fields.verified_at)
      ? `verifiedAt: ${yamlScalar(fields.verified_at)}`
      : null,
    text(fields.items) ? `items: ${yamlArray(lines(fields.items))}` : null,
    text(fields.pricing_model)
      ? `pricingModel: ${yamlScalar(fields.pricing_model)}`
      : null,
    text(fields.disclosure)
      ? `disclosure: ${yamlScalar(fields.disclosure)}`
      : null,
    "---",
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
  const sourceLines = lines(sourceContent).map(mdxPlainText).slice(0, 200);
  const safetyBody =
    mdxPlainText(fields.safety_notes) || "Maintainer review required.";
  const privacyBody =
    mdxPlainText(fields.privacy_notes) || "Maintainer review required.";
  const body = [
    "",
    safeDescription,
    "",
    ...(sourceLines.length ? [...sourceLines, ""] : []),
    "## Safety",
    "",
    safetyBody,
    "",
    "## Privacy",
    "",
    privacyBody,
    "",
  ].join("\n");

  return `${frontmatter}\n${body}`;
}
