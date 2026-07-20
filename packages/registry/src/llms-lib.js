/**
 * Pure LLMS artifact renderers.
 *
 * This module holds the deterministic citation-fact and markdown export layer
 * used for per-entry and corpus LLMS endpoints. Nothing here touches the
 * filesystem or network — given the same entry snapshot the output is
 * byte-stable.
 *
 * The public package surface (`llms.js` / `@heyclaude/registry/llms`)
 * re-exports everything below so existing imports stay unchanged.
 */
export const LLMS_ARTIFACT_SCHEMA_VERSION = 3;

export function clean(value) {
  return String(value ?? "").trim();
}

export function trimLineEndings(value) {
  return String(value)
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n");
}

export function sectionText(entry) {
  const chunks = [];

  if (entry.sections?.length) {
    for (const section of entry.sections) {
      const title = clean(section.title);
      const markdown = clean(section.markdown);
      if (!title && !markdown) continue;
      chunks.push(`## ${title || "Section"}`);
      if (markdown) chunks.push(markdown);
      if (!markdown && section.codeBlocks?.length) {
        for (const block of section.codeBlocks) {
          const code = clean(block.code);
          if (!code) continue;
          const language = clean(block.language) || "text";
          chunks.push(`\`\`\`${language}\n${code}\n\`\`\``);
        }
      }
      chunks.push("");
    }
  }

  if (!chunks.length) {
    const body = clean(entry.body);
    if (body) chunks.push(body);
  }

  return chunks.join("\n").trim();
}

export function listValue(values) {
  // Accepts an array (raw entries store notes as YAML lists) or a single string
  // (the normalized client entry stores `safetyNotes`/`privacyNotes` as strings),
  // so the same citation-fact builder works on both shapes.
  const source = Array.isArray(values) ? values : values ? [values] : [];
  const items = source.map((value) => clean(value)).filter(Boolean);
  return items.length ? items.join(", ") : "";
}

export function bulletList(values) {
  return Array.isArray(values)
    ? values
        .map((value) => clean(value))
        .filter(Boolean)
        .map((value) => `- ${value}`)
    : [];
}

export function entrySourceUrls(entry) {
  return [
    // Use `||`, not `??`: normalized entries default missing URLs to "" rather
    // than undefined, and `??` would let an empty-string primary swallow a real
    // docsUrl/sourceUrl alias. The array is clean()+filter(Boolean) guarded.
    entry.documentationUrl || entry.docsUrl,
    entry.repoUrl,
    entry.githubUrl || entry.sourceUrl,
    entry.websiteUrl,
  ]
    .map(clean)
    .filter(Boolean)
    .filter((value, index, list) => list.indexOf(value) === index);
}

export function entryLastVerified(entry) {
  return (
    clean(entry.verifiedAt) ||
    clean(entry.contentUpdatedAt) ||
    clean(entry.repoUpdatedAt) ||
    clean(entry.dateAdded)
  );
}

/**
 * Per-entry citation facts as ordered `[label, value]` pairs, filtered to
 * non-empty values. Single source of truth shared by the plain-text LLMS
 * endpoint (`buildEntryCitationFacts`) and the visible citation-facts block on
 * entry pages, so the two can never drift. Every value is a real registry
 * field — nothing is fabricated. Works on raw registry entries (notes as
 * arrays) and normalized client entries (notes as strings) alike.
 */
export function entryCitationFacts(entry, params = {}) {
  const siteUrl = params.siteUrl || "https://heyclau.de";
  const permalink = `${siteUrl.replace(/\/$/, "")}/entry/${entry.category}/${entry.slug}`;
  return [
    ["Canonical URL", permalink],
    ["Source URLs", listValue(entrySourceUrls(entry))],
    ["Brand", clean(entry.brandName)],
    ["Brand domain", clean(entry.brandDomain)],
    ["Brand asset source", clean(entry.brandAssetSource)],
    ["Package URL", clean(entry.downloadUrl)],
    ["Package SHA256", clean(entry.downloadSha256)],
    ["Safety notes", listValue(entry.safetyNotesList ?? entry.safetyNotes)],
    ["Privacy notes", listValue(entry.privacyNotesList ?? entry.privacyNotes)],
    [
      "Platform compatibility",
      listValue(
        entry.platformCompatibility?.map((item) => {
          const support = item.supportLevel ?? item.support;
          return support ? `${item.platform} (${support})` : item.platform;
        }),
      ),
    ],
    ["Author", clean(entry.author)],
    ["Submitted by", clean(entry.submittedBy)],
    ["Original submission", clean(entry.sourceSubmissionUrl)],
    ["Import PR", clean(entry.importPrUrl)],
    ["Reviewed by", clean(entry.reviewedBy)],
    ["Claim status", clean(entry.claimStatus)],
    ["Claimed by", clean(entry.claimedBy)],
    ["License", clean(entry.license)],
    ["Last verified", entryLastVerified(entry)],
    ["Robots", entry.robotsIndex === false ? "noindex" : "indexable"],
  ].filter(([, value]) => value);
}

export function buildEntryCitationFacts(entry, params = {}) {
  return entryCitationFacts(entry, params)
    .map(([label, value]) => `- ${label}: ${value}`)
    .join("\n");
}

export function renderEntryLlms(entry, params = {}) {
  const siteUrl = params.siteUrl || "https://heyclau.de";
  const permalink = `${siteUrl.replace(/\/$/, "")}/entry/${entry.category}/${entry.slug}`;
  // `undefined` marks a line to omit entirely; `""` is an intentional blank-line
  // separator that must survive the filter. (A single `""` sentinel for both
  // intents is the bug this fixes — `.filter(Boolean)` dropped every blank line.)
  const lines = [
    `# ${clean(entry.title)}`,
    "",
    `URL: ${permalink}`,
    `Category: ${entry.category}`,
    entry.author ? `Author: ${entry.author}` : undefined,
    entry.submittedBy ? `Submitted by: ${entry.submittedBy}` : undefined,
    entry.sourceSubmissionUrl
      ? `Original submission: ${entry.sourceSubmissionUrl}`
      : undefined,
    entry.importPrUrl ? `Import PR: ${entry.importPrUrl}` : undefined,
    entry.dateAdded ? `Date added: ${entry.dateAdded}` : undefined,
    entry.documentationUrl
      ? `Documentation: ${entry.documentationUrl}`
      : undefined,
    entry.repoUrl ? `Repository: ${entry.repoUrl}` : undefined,
    entry.githubUrl ? `Directory source: ${entry.githubUrl}` : undefined,
    entry.downloadUrl ? `Download: ${entry.downloadUrl}` : undefined,
    "",
    "## Citation Facts",
    buildEntryCitationFacts(entry, { siteUrl }),
    "",
    "## Summary",
    clean(entry.description),
    "",
    "## Tags",
    entry.tags?.length
      ? entry.tags.map((tag) => `- ${tag}`).join("\n")
      : "- none",
    "",
    entry.safetyNotes?.length ? "## Safety Notes" : undefined,
    ...bulletList(entry.safetyNotes),
    entry.safetyNotes?.length ? "" : undefined,
    entry.privacyNotes?.length ? "## Privacy Notes" : undefined,
    ...bulletList(entry.privacyNotes),
    entry.privacyNotes?.length ? "" : undefined,
    "## Content",
    sectionText(entry),
    "",
  ].filter((line) => line !== undefined);

  return trimLineEndings(lines.join("\n"));
}

export function renderCorpusLlms(entries, params = {}) {
  const siteName = params.siteName || "HeyClaude";
  const siteDescription =
    params.siteDescription || "A directory for Claude resources and tools.";
  const siteUrl = params.siteUrl || "https://heyclau.de";
  const normalizedSiteUrl = siteUrl.replace(/\/$/, "");
  const lines = [
    `# ${siteName} Full Corpus`,
    siteDescription,
    "",
    `Base URL: ${normalizedSiteUrl}`,
    `Total entries: ${entries.length}`,
    "",
    "## Entry Index",
  ];

  for (const entry of entries) {
    lines.push(
      `- [${entry.title}](${normalizedSiteUrl}/entry/${entry.category}/${entry.slug}) (${entry.category})`,
    );
  }

  lines.push("", "## Entry Content");

  for (const entry of entries) {
    lines.push(
      "---",
      "",
      renderEntryLlms(entry, { siteUrl: normalizedSiteUrl }),
    );
  }

  return trimLineEndings(lines.join("\n"));
}
