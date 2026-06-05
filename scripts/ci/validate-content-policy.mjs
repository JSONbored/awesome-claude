#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const STATUS_BY_CODE = {
  A: "added",
  C: "added",
  M: "modified",
  R: "modified",
  T: "modified",
  U: "modified",
  D: "removed",
};

const SEVERITY_WEIGHT = {
  info: 0,
  low: 1,
  medium: 3,
  high: 6,
  critical: 100,
};

const HEYCLAUDE_HOSTNAME = "heyclau.de";
const ARCHIVE_PACKAGE_EXTENSIONS = new Set([
  ".zip",
  ".tar",
  ".tar.gz",
  ".tgz",
  ".tar.bz2",
  ".tbz2",
  ".tar.xz",
  ".txz",
  ".mcpb",
]);

const SAFETY_NOTE_REQUIRED_FLAGS = new Set([
  "unsafe_install_pipeline",
  "financial_or_identity_sensitive",
  "external_write_capability",
  "destructive_actions",
  "downloadable_binary_or_installer",
  "community_archive_download",
  "community_local_download_request",
  "background_worker_or_daemon",
]);

const PRIVACY_NOTE_REQUIRED_FLAGS = new Set([
  "requires_credentials",
  "local_or_personal_data_access",
  "malicious_data_theft_capability",
  "embedded_secret",
]);

const UNSAFE_FRONTMATTER_LANGUAGE_ERROR =
  "Executable JavaScript frontmatter is not allowed in content policy validation";
const DEFENSIVE_SECURITY_MITIGATION_PATTERN =
  /\b(prevent|protect|warn(?:s|ing)? before|block|detect|detection|redact|sanitize|audit|review|remediate|remediation|hardening|least privilege|safe configuration|avoid (?:pasting|exposing|leaking)|leak warning)\b[\s\S]{0,160}\b(?:(?:credential|password|cookie|session|token|wallet|secret|leak)s?|expos(?:e|ing|ure))\b|\b(?:credential|password|cookie|session|token|wallet|secret)s?\b[\s\S]{0,160}\b(prevent|protect|warn(?:s|ing)? before|block|detect|detection|redact|sanitize|audit|review|remediate|remediation|hardening|least privilege|safe configuration|avoid (?:pasting|exposing|leaking)|leak warning)\b/i;
const RESOURCE_THEFT_CAPABILITY_PATTERN =
  /\b(?:this|the|our)?\s*(?:agent|command|hook|mcp|server|skill|statusline|tool|workflow)\b[\s\S]{0,40}\b(?:can|will|does|advertises?|offers?|enables?|designed to|built to)\b[\s\S]{0,80}\b(steals?|exfiltrates?|harvests?|dumps?)\b[\s\S]{0,80}\b(credential|password|cookie|session|token|wallet)s?\b|\b(steals?|exfiltrates?|harvests?|dumps?)\b[\s\S]{0,80}\b(credential|password|cookie|session|token|wallet)s?\b[\s\S]{0,80}\b(?:with|using|through|by)\b[\s\S]{0,40}\b(?:agent|command|hook|mcp|server|skill|statusline|tool|workflow)\b/i;
const CREDENTIAL_THEFT_PATTERN =
  /\b(credential|password|cookie|session|token|wallet)s?\b[\s\S]{0,80}\b(steals?|exfiltrat(?:e|es|ing|ion)|harvests?|dumps?)\b|\b(steals?|exfiltrat(?:e|es|ing|ion)|harvests?|dumps?)\b[\s\S]{0,80}\b(credential|password|cookie|session|token|wallet)s?\b/i;
const ABUSE_ENABLEMENT_PATTERN =
  /\b(build|create|generate|run|deploy|use|ship)\b[\s\S]{0,80}\b(credential stealer|password stealer|cookie stealer|keylogger|steal credentials|exfiltrat(?:e|ion)|harvest cookies|dump tokens?)\b/i;

const SAFE_MATTER_OPTIONS = {
  engines: {
    javascript() {
      throw new Error(UNSAFE_FRONTMATTER_LANGUAGE_ERROR);
    },
  },
};

function parseArgs(argv = process.argv.slice(2)) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];
    if (!item.startsWith("--")) continue;
    const key = item.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      args[key] = "true";
    } else {
      args[key] = next;
      index += 1;
    }
  }
  return args;
}

function normalizeText(value) {
  return String(value ?? "").trim();
}

function normalizeRepo(value) {
  return normalizeText(value).toLowerCase();
}

function hasDefensiveSecuritySafeHarbor(text) {
  return (
    DEFENSIVE_SECURITY_MITIGATION_PATTERN.test(text) &&
    !RESOURCE_THEFT_CAPABILITY_PATTERN.test(text) &&
    !ABUSE_ENABLEMENT_PATTERN.test(text)
  );
}

function lower(value) {
  return normalizeText(value).toLowerCase();
}

function looksLikeCommercialApiRelay(fields, text) {
  const body = lower(
    [
      text,
      fields.title,
      fields.description,
      fields.pricing_model,
      fields.pricingModel,
      fields.disclosure,
      fields.website_url,
      fields.websiteUrl,
    ].join("\n"),
  );
  const relaySignal =
    /\b(api relay|api proxy|llm api relay|llm proxy|model gateway|api gateway)\b/i.test(
      body,
    );
  const commercialSignal =
    /\b(pay[- ]?per[- ]?use|paid|pricing|credits?|billing|subscription|commercial|monetiz(?:e|ation))\b/i.test(
      body,
    );
  return relaySignal && commercialSignal;
}

function annotationText(value) {
  return normalizeText(value)
    .replace(/%/g, "%25")
    .replace(/\r/g, "%0D")
    .replace(/\n/g, "%0A");
}

function statusFromNameStatus(value) {
  return STATUS_BY_CODE[normalizeText(value)[0]] || "modified";
}

function parseNameStatus(output) {
  const files = [];
  for (const line of output.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const parts = line.split("\t");
    const code = parts[0] || "M";
    const filename = parts[parts.length - 1];
    if (filename) {
      files.push({ filename, status: statusFromNameStatus(code) });
    }
  }
  return files;
}

function changedFilesFromGit(baseSha) {
  if (!/^[0-9a-f]{40}$/i.test(baseSha)) {
    throw new Error("BASE_SHA must be a full Git commit SHA for PR validation");
  }
  const output = execFileSync(
    "git",
    ["diff", "--name-status", `${baseSha}...HEAD`],
    { encoding: "utf8" },
  );
  return parseNameStatus(output);
}

function changedFilesFromJson(filePath) {
  const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
  if (!Array.isArray(parsed)) {
    throw new Error("--files-json must point to an array");
  }
  return parsed.map((item) =>
    typeof item === "string"
      ? { filename: item, status: "modified" }
      : {
          filename: normalizeText(item.filename || item.path),
          status: normalizeText(item.status) || "modified",
          content: typeof item.content === "string" ? item.content : undefined,
          baseContent:
            typeof item.baseContent === "string" ? item.baseContent : undefined,
        },
  );
}

function readFileContent(repoRoot, filename, status, providedContent) {
  if (typeof providedContent === "string") return providedContent;
  if (status === "removed") return "";
  const filePath = path.join(repoRoot, filename);
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return "";
  }
}

function readBaseFileContent(filename, status, providedBaseContent, baseSha) {
  if (typeof providedBaseContent === "string") return providedBaseContent;
  if (status === "added") return null;
  if (!/^[0-9a-f]{40}$/i.test(baseSha || "")) return null;

  try {
    execFileSync("git", ["cat-file", "-e", `${baseSha}:${filename}`], {
      stdio: "ignore",
    });
    return execFileSync("git", ["show", `${baseSha}:${filename}`], {
      encoding: "utf8",
    });
  } catch {
    return null;
  }
}

function resolveFiles({ repoRoot, args }) {
  const baseSha = args["base-sha"] || process.env.BASE_SHA || "";
  const source = args["files-json"]
    ? changedFilesFromJson(args["files-json"])
    : changedFilesFromGit(baseSha);

  return source
    .map((file) => {
      const filename = normalizeText(file.filename);
      const status = normalizeText(file.status) || "modified";
      return {
        filename,
        status,
        content: readFileContent(repoRoot, filename, status, file.content),
        baseContent: readBaseFileContent(
          filename,
          status,
          file.baseContent,
          baseSha,
        ),
      };
    })
    .filter((file) => file.filename);
}

function sourceTypeFromContext({ args, headRepo, baseRepo, headRef }) {
  if (args["source-type"]) return normalizeText(args["source-type"]);
  if (/^automation\/submission-\d+-/.test(headRef)) return "automation_import";
  if (
    headRepo &&
    baseRepo &&
    normalizeRepo(headRepo) !== normalizeRepo(baseRepo)
  ) {
    return "external_direct";
  }
  return "same_repo_direct";
}

function stringList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeText(item)).filter(Boolean);
  }
  return normalizeText(value)
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseMdxFrontmatter(content) {
  try {
    const parsed = matter(String(content), SAFE_MATTER_OPTIONS);
    return { data: parsed.data || {}, content: parsed.content || "" };
  } catch (error) {
    if (error?.message === UNSAFE_FRONTMATTER_LANGUAGE_ERROR) {
      throw error;
    }
    return { data: {}, content: String(content) };
  }
}

function urlPathname(value) {
  const url = normalizeText(value);
  if (!url) return "";
  if (url.startsWith("/")) return url.split(/[?#]/)[0] || "/";
  try {
    return new URL(url).pathname || "/";
  } catch {
    return "";
  }
}

function hostname(value) {
  const url = normalizeText(value);
  if (!/^[a-z][a-z0-9+.-]*:/i.test(url)) return "";
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return "";
  }
}

function isLikelyAffiliateUrl(value) {
  const raw = normalizeText(value);
  if (!raw) return false;

  try {
    const url = new URL(raw);
    const affiliateParams = new Set([
      "aff",
      "affiliate",
      "affiliate_id",
      "irclickid",
      "partner",
      "partner_id",
      "ref",
      "referral",
      "referral_code",
      "tag",
      "via",
    ]);

    for (const key of url.searchParams.keys()) {
      const normalizedKey = key.toLowerCase();
      if (
        affiliateParams.has(normalizedKey) ||
        normalizedKey.startsWith("utm_aff")
      ) {
        return true;
      }
    }

    return /\/(ref|refer|referral|affiliate|partners?)(?:\/|$)/i.test(
      url.pathname,
    );
  } catch {
    return /\b(affiliate|referral|ref=|via=)\b/i.test(raw);
  }
}

function isArchivePackageUrl(value) {
  const pathname = urlPathname(value).toLowerCase();
  return [...ARCHIVE_PACKAGE_EXTENSIONS].some((extension) =>
    pathname.endsWith(extension),
  );
}

function collectUrls(text) {
  const matches = String(text || "").matchAll(/\bhttps?:\/\/[^\s<>"')]+/gi);
  return [...matches].map((match) => match[0]).slice(0, 50);
}

function sameGitHubLogin(value, login) {
  const expected = normalizeText(login).replace(/^@/, "").toLowerCase();
  if (!expected) return false;
  const text = normalizeText(value).replace(/^@/, "");
  if (text.toLowerCase() === expected) return true;
  try {
    const url = new URL(text);
    if (url.hostname.toLowerCase() !== "github.com") return false;
    return (
      url.pathname.split("/").filter(Boolean)[0]?.toLowerCase() === expected
    );
  } catch {
    return false;
  }
}

function addFlag(report, severity, id, summary, detail = "") {
  if (report.reviewFlags.some((flag) => flag.id === id)) return;
  report.reviewFlags.push({ id, severity, summary, detail });
}

function addClassificationWarning(report, id, summary, detail = "") {
  if (report.classificationWarnings.some((warning) => warning.id === id)) {
    return;
  }
  report.classificationWarnings.push({ id, summary, detail });
}

function addProvenanceFinding(
  report,
  severity,
  id,
  summary,
  detail = "",
  blocking = severity === "error",
) {
  if (report.provenanceFindings.some((finding) => finding.id === id)) return;
  report.provenanceFindings.push({
    id,
    severity,
    summary,
    detail,
    blocking,
  });
}

function prFileCategory(filename) {
  const parts = normalizeText(filename).split("/");
  return parts[0] === "content" && parts.length >= 3 ? parts[1] : "";
}

function frontmatterFields(data = {}, category = "") {
  return {
    category: normalizeText(data.category || category),
    slug: normalizeText(data.slug),
    github_url: normalizeText(data.repoUrl),
    source_url: normalizeText(data.sourceUrl),
    website_url: normalizeText(data.websiteUrl),
    docs_url: normalizeText(data.documentationUrl || data.projectUrl),
    download_url: normalizeText(data.downloadUrl),
    affiliate_url: normalizeText(data.affiliateUrl),
    install_command: normalizeText(data.installCommand),
    usage_snippet: normalizeText(data.usageSnippet),
    full_copyable_content: normalizeText(data.copySnippet),
    safety_notes: stringList(data.safetyNotes).join("\n"),
    privacy_notes: stringList(data.privacyNotes).join("\n"),
  };
}

function frontmatterProvenance(data = {}) {
  const sourceSubmissionNumber = Number(data.sourceSubmissionNumber);
  const importPrNumber = Number(data.importPrNumber);
  return {
    submittedBy: normalizeText(data.submittedBy),
    submittedByUrl: normalizeText(data.submittedByUrl),
    sourceSubmissionNumber:
      Number.isInteger(sourceSubmissionNumber) && sourceSubmissionNumber > 0
        ? sourceSubmissionNumber
        : null,
    sourceSubmissionUrl: normalizeText(data.sourceSubmissionUrl),
    importPrNumber:
      Number.isInteger(importPrNumber) && importPrNumber > 0
        ? importPrNumber
        : null,
    importPrUrl: normalizeText(data.importPrUrl),
  };
}

function submitterProvenanceChanged(entry) {
  const current = entry.provenance || {};
  const base = entry.baseProvenance || {};
  return (
    normalizeText(current.submittedBy) !== normalizeText(base.submittedBy) ||
    normalizeText(current.submittedByUrl) !== normalizeText(base.submittedByUrl)
  );
}

function isNewDirectContentEntry(entry) {
  if (entry.status === "added" || !entry.baseExists) return true;
  return false;
}

const EXISTING_ENTRY_METADATA_UPDATE_KEYS = new Set([
  "privacyNotes",
  "safetyNotes",
]);

function canonicalFrontmatterValue(value) {
  if (Array.isArray(value)) {
    return value.map((item) => canonicalFrontmatterValue(item));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, canonicalFrontmatterValue(value[key])]),
    );
  }

  return normalizeText(value);
}

function frontmatterChangedOutsideAllowedMetadata(
  currentData = {},
  baseData = {},
) {
  for (const key of Object.keys({ ...currentData, ...baseData }).sort()) {
    if (EXISTING_ENTRY_METADATA_UPDATE_KEYS.has(key)) continue;
    if (
      JSON.stringify(canonicalFrontmatterValue(currentData[key])) !==
      JSON.stringify(canonicalFrontmatterValue(baseData[key]))
    ) {
      return true;
    }
  }

  return false;
}

function existingEntryHasOnlyMetadataUpdates(entry) {
  if (
    frontmatterChangedOutsideAllowedMetadata(
      entry.frontmatterData,
      entry.baseFrontmatterData,
    )
  ) {
    return false;
  }

  return (
    normalizeText(entry.contentBody) === normalizeText(entry.baseContentBody)
  );
}

function addGeneratedArtifactSignals(report, files, sourceType) {
  if (sourceType !== "external_direct") return;

  const hasRootReadmeChange = files.some(
    (file) =>
      normalizeText(file.filename).toLowerCase() === "readme.md" &&
      normalizeText(file.status) !== "removed",
  );
  const generatedFiles = files
    .map((file) => normalizeText(file.filename))
    .filter(
      (filename) =>
        filename.startsWith("apps/web/public/data/") ||
        filename.startsWith("apps/web/src/generated/") ||
        filename.startsWith("apps/web/public/downloads/"),
    );
  const packageArtifactFiles = files
    .map((file) => normalizeText(file.filename))
    .filter(
      (filename) =>
        /^content\/skills\/.+\.zip$/i.test(filename) ||
        /^content\/mcp\/.+\.mcpb$/i.test(filename),
    );

  if (hasRootReadmeChange) {
    addClassificationWarning(
      report,
      "generated_readme_change",
      "README.md changes are not accepted in direct content PRs; maintainer automation regenerates README output",
      "Remove README.md from the contributor PR.",
    );
  }

  if (generatedFiles.length) {
    addClassificationWarning(
      report,
      "generated_registry_artifact_change",
      "Generated registry artifacts and public download mirrors are not accepted in direct contributor PRs",
      generatedFiles.slice(0, 10).join(", "),
    );
  }

  if (packageArtifactFiles.length) {
    addClassificationWarning(
      report,
      "community_package_artifact_change",
      "Community PRs cannot add or modify HeyClaude-hosted ZIP/MCPB package artifacts",
      packageArtifactFiles.slice(0, 10).join(", "),
    );
  }
}

function addContentRiskSignals(report, fields, content) {
  const text = [
    fields.github_url,
    fields.source_url,
    fields.website_url,
    fields.docs_url,
    fields.download_url,
    fields.affiliate_url,
    fields.install_command,
    fields.usage_snippet,
    fields.full_copyable_content,
    content,
  ].join("\n");
  const installText = [
    fields.install_command,
    fields.usage_snippet,
    fields.full_copyable_content,
    content,
  ].join("\n");
  const executableSourceUrls = collectUrls(installText);
  const submittedSourceUrls = [
    fields.github_url,
    fields.source_url,
    fields.website_url,
    fields.docs_url,
    fields.download_url,
    fields.affiliate_url,
  ].filter(Boolean);

  if (looksLikeCommercialApiRelay(fields, text)) {
    addFlag(
      report,
      "high",
      "commercial_listing_route",
      "Commercial API relays, paid gateways, and pay-per-use proxy services belong in the tools/listing flow",
      "Use the commercial listing route instead of the free content queue",
    );
  }

  if (submittedSourceUrls.some(isLikelyAffiliateUrl)) {
    addFlag(
      report,
      "high",
      "affiliate_referral_url",
      "Contributor content contains affiliate or referral URL parameters",
      submittedSourceUrls.filter(isLikelyAffiliateUrl).join(", "),
    );
  }

  if (
    /\b(ghp_[a-z0-9_]{20,}|github_pat_[a-z0-9_]{40,}|sk-[a-z0-9]{20,}|akia[0-9a-z]{16}|xq_[a-f0-9]{40,})\b/i.test(
      text,
    )
  ) {
    addFlag(
      report,
      "critical",
      "embedded_secret",
      "Submission appears to include a real secret or API token",
    );
  }

  if (executableSourceUrls.some((url) => url.startsWith("http://"))) {
    addFlag(
      report,
      "critical",
      "non_https_executable_source",
      "Install or usage instructions execute or fetch from a non-HTTPS URL",
    );
  }

  const downloadUrl = normalizeText(fields.download_url);
  const downloadPath = urlPathname(downloadUrl);
  const downloadHost = hostname(downloadUrl);
  const isHeyClaudeDownloadRequest =
    downloadPath.startsWith("/downloads/") &&
    (!downloadHost || downloadHost === HEYCLAUDE_HOSTNAME);
  if (isHeyClaudeDownloadRequest) {
    addFlag(
      report,
      "high",
      "community_local_download_request",
      "Community submissions cannot request HeyClaude-hosted package downloads",
      downloadUrl,
    );
  } else if (isArchivePackageUrl(downloadUrl)) {
    addFlag(
      report,
      "medium",
      "community_archive_download",
      "Submitted package archive URLs require maintainer package review before direct merge",
      downloadUrl,
    );
  }

  if (
    /rm\s+-rf\s+(\/|~|\$home)\b/i.test(installText) ||
    /\b(curl|wget)\b[\s\S]{0,120}\|[\s\S]{0,40}\b(sudo\s+)?(sh|bash)\b/i.test(
      installText,
    ) ||
    /\b(invoke-expression|iex)\b/i.test(installText) ||
    /\bbase64\s+(-d|--decode)\b[\s\S]{0,80}\|[\s\S]{0,40}\b(sh|bash)\b/i.test(
      installText,
    ) ||
    /\bpowershell\b[\s\S]{0,80}\b-encodedcommand\b/i.test(installText)
  ) {
    addFlag(
      report,
      "critical",
      "unsafe_install_pipeline",
      "Install instructions include a destructive or remote-code execution pipeline",
    );
  }

  if (
    !hasDefensiveSecuritySafeHarbor(text) &&
    CREDENTIAL_THEFT_PATTERN.test(text)
  ) {
    addFlag(
      report,
      "critical",
      "malicious_data_theft_capability",
      "Submission appears to advertise credential, token, session, or wallet theft",
    );
  }

  if (
    /\b(csam|child sexual abuse|child exploitation)\b/i.test(text) ||
    /\b(porn|pornographic|explicit sexual|xxx|onlyfans)\b/i.test(text) ||
    /\bterrorist recruitment|violent extremist recruitment\b/i.test(text)
  ) {
    addFlag(
      report,
      "critical",
      "prohibited_content",
      "Submission appears to include clearly unacceptable content",
    );
  }

  if (
    /\b(api[-_ ]?key|token|oauth|bearer|authorization|x-api-key)\b/i.test(
      text,
    ) ||
    /\b(?:api|access|developer|agent)\s+keys?\b/i.test(text) ||
    /\bkeyed\s+(?:api|agent|tool|action|workflow)s?\b/i.test(text)
  ) {
    addFlag(
      report,
      "medium",
      "requires_credentials",
      "Submission requires API keys, tokens, OAuth, or authorization headers",
    );
  }

  if (
    /\b(private key|wallet|kyc|usdc|x402|payment|crypto|on-chain|attestation)\b/i.test(
      text,
    )
  ) {
    addFlag(
      report,
      "high",
      "financial_or_identity_sensitive",
      "Submission touches wallet, payment, KYC, or identity-proof flows",
    );
  }

  if (
    /\b(tweet|twitter|x\.com|post|reply|dm|social media)\b/i.test(text) &&
    /\b(write|send|create|delete|posting|automation|webhook)\b/i.test(text)
  ) {
    addFlag(
      report,
      "high",
      "external_write_capability",
      "Submission can automate public social or external write actions",
    );
  }

  if (
    /\b(mail|email|calendar|messages|filesystem|browser|macos|accessibility|screen|ui automation)\b/i.test(
      text,
    ) ||
    /\b(local workspace|workspace automation|desktop app|daemon)\b/i.test(text)
  ) {
    addFlag(
      report,
      "high",
      "local_or_personal_data_access",
      "Submission can access local apps, personal data, browser state, or automation surfaces",
    );
  }

  if (
    /\b(background worker|background process|daemon|launch agent|startup|cron|sessionstart|scheduled job)\b/i.test(
      text,
    )
  ) {
    addFlag(
      report,
      "medium",
      "background_worker_or_daemon",
      "Submission describes background workers, daemons, scheduled jobs, or startup/session automation",
    );
  }

  if (
    /\b(delete|destroy|purge|remove)\b/i.test(text) &&
    /\b(file|email|record|database|tweet|message|resource)\b/i.test(text)
  ) {
    addFlag(
      report,
      "high",
      "destructive_actions",
      "Submission includes delete or destructive-operation capability",
    );
  }

  if (/\b(dmg|exe|pkg|msi|appimage|binary|installer|download)\b/i.test(text)) {
    addFlag(
      report,
      "medium",
      "downloadable_binary_or_installer",
      "Submission references downloadable binaries or installer-style assets",
    );
  }
}

function addDisclosureNoteSignals(report, fields) {
  const flags = new Set((report.reviewFlags || []).map((flag) => flag.id));
  const safetyRequired = [...flags].filter((id) =>
    SAFETY_NOTE_REQUIRED_FLAGS.has(id),
  );
  const privacyRequired = [...flags].filter((id) =>
    PRIVACY_NOTE_REQUIRED_FLAGS.has(id),
  );
  const safetyNotes = stringList(fields.safety_notes || fields.safetyNotes);
  const privacyNotes = stringList(fields.privacy_notes || fields.privacyNotes);

  if (safetyRequired.length && !safetyNotes.length) {
    addClassificationWarning(
      report,
      "missing_safety_notes",
      "Sensitive execution, install, package, background, or write behavior needs safetyNotes disclosure",
      safetyRequired.join(", "),
    );
  }

  if (privacyRequired.length && !privacyNotes.length) {
    addClassificationWarning(
      report,
      "missing_privacy_notes",
      "Credential, local data, telemetry, or third-party data behavior needs privacyNotes disclosure",
      privacyRequired.join(", "),
    );
  }
}

function validatePrProvenance(report, entries, prAuthor, sourceType) {
  if (!entries.length) return;
  report.contentProvenance = entries.map((entry) => ({
    filename: entry.filename,
    status: entry.status,
    baseExists: entry.baseExists,
    ...entry.provenance,
  }));

  if (sourceType !== "external_direct") return;

  for (const entry of entries) {
    if (!isNewDirectContentEntry(entry)) {
      if (submitterProvenanceChanged(entry)) {
        addProvenanceFinding(
          report,
          "error",
          `direct_pr_existing_provenance_change_${entry.filename}`,
          "Direct contributor PRs cannot change submitter provenance on existing content",
          `${entry.filename}: leave existing submittedBy/submittedByUrl unchanged; maintainers can handle attribution corrections separately.`,
        );
        continue;
      }

      if (existingEntryHasOnlyMetadataUpdates(entry)) {
        continue;
      }
    }

    const provenance = entry.provenance;
    if (!provenance.submittedBy || !provenance.submittedByUrl) {
      addProvenanceFinding(
        report,
        "error",
        `missing_direct_pr_submitter_${entry.filename}`,
        "Direct contributor PR content must include submittedBy and submittedByUrl",
        `${entry.filename}: add submittedBy: ${prAuthor || "<your GitHub handle>"} and submittedByUrl: https://github.com/${prAuthor || "<your GitHub handle>"}`,
      );
      continue;
    }

    if (prAuthor && !sameGitHubLogin(provenance.submittedBy, prAuthor)) {
      addProvenanceFinding(
        report,
        "error",
        `direct_pr_submitter_mismatch_${entry.filename}`,
        "Direct contributor PR submittedBy must match the PR author",
        `${entry.filename}: submittedBy=${provenance.submittedBy}, prAuthor=${prAuthor}`,
      );
    }

    if (
      provenance.submittedByUrl &&
      !sameGitHubLogin(provenance.submittedByUrl, provenance.submittedBy)
    ) {
      addProvenanceFinding(
        report,
        "error",
        `direct_pr_submitter_url_mismatch_${entry.filename}`,
        "Direct contributor PR submittedByUrl must match submittedBy",
        `${entry.filename}: ${provenance.submittedByUrl}`,
      );
    }
  }
}

function tierFromFlags(flags) {
  if (flags.some((flag) => flag.severity === "critical")) return "critical";
  const score = flags.reduce(
    (total, flag) => total + (SEVERITY_WEIGHT[flag.severity] ?? 0),
    0,
  );
  if (score >= 7) return "high";
  if (score >= 3) return "medium";
  return "low";
}

function directContentRequestChangesReasons(report = {}) {
  if (report.subject?.type !== "pull_request") return [];
  const reasons = [];
  const sourceType = report.sourceType || report.subject?.sourceType;
  const isExternalDirect = sourceType === "external_direct";
  const isDirectContentShape =
    Number(report.changedFileCount || 0) === 1 &&
    Number(report.contentFileCount || 0) === 1;
  if (!isExternalDirect && !isDirectContentShape) return [];

  const flags = new Set((report.reviewFlags || []).map((flag) => flag.id));
  const warnings = new Set(
    (report.classificationWarnings || []).map((warning) => warning.id),
  );
  const externalOnlyFlags = new Set(["community_local_download_request"]);
  const externalOnlyWarnings = new Set([
    "generated_readme_change",
    "generated_registry_artifact_change",
    "community_package_artifact_change",
    "unsafe_package_verified_true",
  ]);

  for (const finding of report.provenanceFindings || []) {
    if (finding.blocking) {
      reasons.push(
        `Provenance validation failed: ${finding.summary} (${finding.id}).`,
      );
    }
  }

  const flagReasons = {
    invalid_frontmatter: "Content frontmatter could not be parsed.",
    missing_pr_file_content:
      "Content file could not be read through the GitHub API.",
    community_local_download_request:
      "Community PRs cannot request HeyClaude-hosted /downloads package URLs.",
    commercial_listing_route:
      "Commercial API relays, paid gateways, and pay-per-use proxy services belong in the tools/listing flow.",
    affiliate_referral_url:
      "Contributor content cannot include affiliate or referral URL parameters.",
    non_https_executable_source:
      "Install or usage instructions fetch executable content from a non-HTTPS URL.",
    unsafe_install_pipeline:
      "Install instructions include a destructive or remote-code execution pipeline.",
    embedded_secret:
      "Submission appears to include a real secret or API token.",
    malicious_data_theft_capability:
      "Submission appears to advertise credential, token, session, or wallet theft.",
    prohibited_content:
      "Submission appears to include clearly unacceptable content.",
  };
  for (const [id, reason] of Object.entries(flagReasons)) {
    if (!isExternalDirect && externalOnlyFlags.has(id)) continue;
    if (flags.has(id)) reasons.push(`${reason} (${id}).`);
  }

  for (const flag of report.reviewFlags || []) {
    if (flag.severity === "critical" && !flagReasons[flag.id]) {
      reasons.push(
        `Critical content policy finding must be resolved (${flag.id}).`,
      );
    }
  }

  const warningReasons = {
    category_path_mismatch:
      "Content category frontmatter must match the content path.",
    generated_readme_change:
      "Direct contributor PRs should not edit README.md; maintainer automation regenerates it.",
    generated_registry_artifact_change:
      "Direct contributor PRs should not edit generated registry/data/download artifacts.",
    community_package_artifact_change:
      "Community PRs cannot add HeyClaude-hosted ZIP/MCPB package artifacts.",
    unsafe_package_verified_true:
      "External contributor PRs cannot mark packages as packageVerified: true.",
    missing_safety_notes:
      "Sensitive execution, install, package, background, or write behavior needs safetyNotes disclosure.",
    missing_privacy_notes:
      "Credential, local data, telemetry, or third-party data behavior needs privacyNotes disclosure.",
  };
  for (const [id, reason] of Object.entries(warningReasons)) {
    if (!isExternalDirect && externalOnlyWarnings.has(id)) continue;
    if (warnings.has(id)) reasons.push(`${reason} (${id}).`);
  }

  return [...new Set(reasons)];
}

function buildReport({ args, files, headRepo, baseRepo, headRef, sourceType }) {
  const prAuthor = normalizeText(args["pr-author"] || process.env.PR_AUTHOR);
  const report = {
    subject: {
      type: "pull_request",
      number: Number(args["pr-number"] || process.env.PR_NUMBER) || null,
      sourceType,
    },
    sourceType,
    reviewFlags: [],
    classificationWarnings: [],
    provenanceFindings: [],
    trustSignals: [],
    sourceUrls: [],
    contentProvenance: [],
    pullRequest: {
      title: normalizeText(args["pr-title"] || process.env.PR_TITLE),
      url: normalizeText(args["pr-url"] || process.env.PR_URL),
      user: prAuthor ? { login: prAuthor } : {},
      head: { ref: headRef, repo: { full_name: headRepo } },
      base: { repo: { full_name: baseRepo } },
    },
    changedFileCount: files.length,
  };
  const contentFiles = files.filter(
    (file) =>
      /^content\/[^/]+\/[^/]+\.mdx$/i.test(normalizeText(file.filename)) &&
      normalizeText(file.status) !== "removed",
  );
  report.contentFileCount = contentFiles.length;

  addGeneratedArtifactSignals(report, files, sourceType);

  const entries = [];
  for (const file of contentFiles) {
    const content = normalizeText(file.content);
    if (!content) {
      addFlag(
        report,
        "medium",
        "missing_pr_file_content",
        "PR content file could not be read",
        file.filename,
      );
      continue;
    }

    let parsed;
    try {
      parsed = parseMdxFrontmatter(content);
    } catch (error) {
      addFlag(
        report,
        "medium",
        "invalid_frontmatter",
        "PR content frontmatter could not be parsed",
        `${file.filename}: ${error.message}`,
      );
      parsed = { data: {}, content };
    }

    const category = prFileCategory(file.filename);
    const fields = frontmatterFields(parsed.data, category);
    const provenance = frontmatterProvenance(parsed.data);
    const baseParsed =
      typeof file.baseContent === "string"
        ? parseMdxFrontmatter(file.baseContent)
        : { data: {} };
    const baseProvenance = frontmatterProvenance(baseParsed.data);
    if (fields.category && fields.category !== category) {
      addClassificationWarning(
        report,
        "category_path_mismatch",
        "Content category frontmatter must match the content file path",
        `${file.filename}: ${fields.category} != ${category}`,
      );
    }
    if (
      sourceType === "external_direct" &&
      parsed.data?.packageVerified === true
    ) {
      addClassificationWarning(
        report,
        "unsafe_package_verified_true",
        "External contributor PRs cannot mark packageVerified: true",
        file.filename,
      );
    }

    entries.push({
      filename: file.filename,
      status: normalizeText(file.status) || "modified",
      baseExists: typeof file.baseContent === "string",
      fields,
      provenance,
      baseProvenance,
      frontmatterData: parsed.data || {},
      baseFrontmatterData: baseParsed.data || {},
      contentBody: parsed.content || "",
      baseContentBody: baseParsed.content || "",
    });
    addContentRiskSignals(report, fields, content);
    addDisclosureNoteSignals(report, fields);
  }

  validatePrProvenance(report, entries, prAuthor, sourceType);
  report.riskTier = tierFromFlags(report.reviewFlags);
  return report;
}

function writeOutput(outputPath, report, failures) {
  if (!outputPath) return;
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(
    outputPath,
    `${JSON.stringify(
      {
        ok: failures.length === 0,
        failures,
        riskTier: report.riskTier,
        sourceType: report.sourceType || report.subject?.sourceType,
        requestChangesReasons: report.requestChangesReasons || [],
        reviewFlags: report.reviewFlags || [],
        classificationWarnings: report.classificationWarnings || [],
        provenanceFindings: report.provenanceFindings || [],
      },
      null,
      2,
    )}\n`,
    "utf8",
  );
}

function writeSummary(summaryPath, report, failures) {
  if (!summaryPath) return;
  const lines = [
    "## HeyClaude content policy",
    "",
    failures.length
      ? `Status: failed (${failures.length} blocker${failures.length === 1 ? "" : "s"})`
      : "Status: passed",
    `Risk tier: ${report.riskTier || "unknown"}`,
    "",
  ];
  if (failures.length) {
    lines.push("### Blockers", "");
    for (const failure of failures) lines.push(`- ${failure}`);
    lines.push("");
  }
  fs.appendFileSync(summaryPath, lines.join("\n"));
}

function main() {
  const args = parseArgs();
  const repoRoot = path.resolve(args["repo-root"] || process.cwd());
  const headRepo = normalizeText(args["head-repo"] || process.env.HEAD_REPO);
  const baseRepo = normalizeText(
    args["base-repo"] || process.env.BASE_REPO || process.env.GITHUB_REPOSITORY,
  );
  const headRef = normalizeText(args["head-ref"] || process.env.HEAD_REF);
  const sourceType = sourceTypeFromContext({
    args,
    headRepo,
    baseRepo,
    headRef,
  });
  const files = resolveFiles({ repoRoot, args });

  const report = buildReport({
    args,
    files,
    headRepo,
    baseRepo,
    headRef,
    sourceType,
  });
  const failures = directContentRequestChangesReasons(report);
  report.requestChangesReasons = failures;

  writeOutput(
    args.output || process.env.CONTENT_POLICY_OUTPUT,
    report,
    failures,
  );
  writeSummary(process.env.GITHUB_STEP_SUMMARY, report, failures);

  if (!failures.length) {
    console.log("HeyClaude content policy passed.");
    return;
  }

  for (const failure of failures) {
    console.error(`::error::${annotationText(failure)}`);
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

main();
