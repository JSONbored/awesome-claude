export type SubmissionDraftFields = Record<string, unknown>;

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

function text(value: unknown) {
  return String(value ?? "").trim();
}

export function slugify(value: unknown) {
  return text(value)
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

export function buildDraftTarget(fields: SubmissionDraftFields, baseRef: string) {
  const category = normalizeCategory(fields.category);
  const slug = slugify(fields.slug || fields.name || fields.title);
  if (!category || !slug) {
    throw new Error("Draft requires a supported category and slug.");
  }

  const branchName = `heyclaude/submit-${category}-${slug}`;
  return {
    category,
    slug,
    baseRef,
    branchName,
    targetPath: `content/${category}/${slug}.mdx`,
  };
}

function yamlScalar(value: unknown) {
  const normalized = text(value).replace(/\r\n/g, "\n");
  return JSON.stringify(normalized);
}

function yamlArray(values: unknown[]) {
  const normalized = values.map(text).filter(Boolean);
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
  return normalized.length <= 160 ? normalized : `${normalized.slice(0, 157).trimEnd()}...`;
}

export function buildContributorMdx(fields: SubmissionDraftFields, githubLogin?: string) {
  const target = buildDraftTarget(fields, "main");
  const title = text(fields.name || fields.title);
  const description = text(fields.description || fields.card_description);
  const submittedBy = githubLogin ? `@${githubLogin}` : text(fields.contact_email || "website");
  const submittedByUrl = githubLogin ? `https://github.com/${githubLogin}` : "";
  const tags = text(fields.tags)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 8);
  const sourceContent = text(fields.full_copyable_content || fields.guide_content);
  const safetyNotes = lines(fields.safety_notes);
  const privacyNotes = lines(fields.privacy_notes);
  const body = [
    "---",
    `title: ${yamlScalar(title)}`,
    `slug: ${yamlScalar(target.slug)}`,
    `category: ${yamlScalar(target.category)}`,
    `description: ${yamlScalar(description)}`,
    `cardDescription: ${yamlScalar(fields.card_description || oneLine(description))}`,
    `seoTitle: ${yamlScalar(fields.seo_title || `${title} for Claude`)}`,
    `seoDescription: ${yamlScalar(fields.seo_description || oneLine(description))}`,
    `author: ${yamlScalar(fields.author || submittedBy)}`,
    submittedByUrl ? `authorProfileUrl: ${yamlScalar(submittedByUrl)}` : "",
    `dateAdded: ${yamlScalar(new Date().toISOString().slice(0, 10))}`,
    `submittedBy: ${yamlScalar(submittedBy)}`,
    submittedByUrl ? `submittedByUrl: ${yamlScalar(submittedByUrl)}` : "",
    `submittedAt: ${yamlScalar(new Date().toISOString())}`,
    tags.length ? `tags: [${tags.map(yamlScalar).join(", ")}]` : "tags: []",
    text(fields.brand_name) ? `brandName: ${yamlScalar(fields.brand_name)}` : "",
    text(fields.brand_domain) ? `brandDomain: ${yamlScalar(fields.brand_domain)}` : "",
    text(fields.github_url) ? `repoUrl: ${yamlScalar(fields.github_url)}` : "",
    text(fields.docs_url) ? `documentationUrl: ${yamlScalar(fields.docs_url)}` : "",
    text(fields.website_url) ? `websiteUrl: ${yamlScalar(fields.website_url)}` : "",
    text(fields.download_url) ? `downloadUrl: ${yamlScalar(fields.download_url)}` : "",
    text(fields.install_command) ? `installCommand: ${yamlScalar(fields.install_command)}` : "",
    text(fields.usage_snippet) ? `usageSnippet: ${yamlScalar(fields.usage_snippet)}` : "",
    text(fields.config_snippet) ? `configSnippet: ${yamlScalar(fields.config_snippet)}` : "",
    sourceContent ? `copySnippet: ${yamlScalar(sourceContent)}` : "",
    text(fields.command_syntax) ? `commandSyntax: ${yamlScalar(fields.command_syntax)}` : "",
    text(fields.trigger) ? `trigger: ${yamlScalar(fields.trigger)}` : "",
    text(fields.script_language) ? `scriptLanguage: ${yamlScalar(fields.script_language)}` : "",
    text(fields.prerequisites) ? `prerequisites: ${yamlArray(lines(fields.prerequisites))}` : "",
    safetyNotes.length ? `safetyNotes: ${yamlArray(safetyNotes)}` : "",
    privacyNotes.length ? `privacyNotes: ${yamlArray(privacyNotes)}` : "",
    text(fields.retrieval_sources) ? `retrievalSources: ${yamlArray(lines(fields.retrieval_sources))}` : "",
    text(fields.tested_platforms) ? `testedPlatforms: ${yamlArray(lines(fields.tested_platforms))}` : "",
    text(fields.skill_type) ? `skillType: ${yamlScalar(fields.skill_type)}` : "",
    text(fields.skill_level) ? `skillLevel: ${yamlScalar(fields.skill_level)}` : "",
    text(fields.verification_status)
      ? `verificationStatus: ${yamlScalar(fields.verification_status)}`
      : "",
    text(fields.verified_at) ? `verifiedAt: ${yamlScalar(fields.verified_at)}` : "",
    text(fields.items) ? `items: ${yamlArray(lines(fields.items))}` : "",
    text(fields.pricing_model) ? `pricingModel: ${yamlScalar(fields.pricing_model)}` : "",
    text(fields.disclosure) ? `disclosure: ${yamlScalar(fields.disclosure)}` : "",
    "---",
    "",
    description,
    "",
    ...lines(sourceContent).slice(0, 200),
    "",
    "## Safety",
    "",
    text(fields.safety_notes) || "Maintainer review required.",
    "",
    "## Privacy",
    "",
    text(fields.privacy_notes) || "Maintainer review required.",
    "",
  ]
    .filter((line) => line !== "")
    .join("\n");

  return `${body}\n`;
}
