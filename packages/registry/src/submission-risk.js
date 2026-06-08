import {
  looksLikeToolAppListing,
  missingToolListingReviewFields,
  TOOLS_CATEGORY,
  TOOLS_LISTING_FLOW_URL,
} from "./submission-classification.js";
import { parseSafeFrontmatter } from "./frontmatter.js";

export const SUBMISSION_RISK_SCHEMA_VERSION = 1;
export const SUBMISSION_RISK_COMMENT_MARKER = "<!-- submission-risk-report -->";

const SEVERITY_WEIGHT = {
  info: 0,
  low: 1,
  medium: 3,
  high: 6,
  critical: 100,
};

const HEYCLAUDE_HOSTNAME = "heyclau.de";

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

function normalizeText(value) {
  return String(value ?? "").trim();
}

function compactWhitespace(value) {
  return normalizeText(value).replace(/\s+/g, " ");
}

const GITHUB_LOGIN_PATTERN =
  /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?(?:\[bot\])?$/;
const FINANCIAL_OR_IDENTITY_PATTERN =
  /\b(private key|wallet|kyc|usdc|x402|payment|crypto|on-chain)\b/i;
const IDENTITY_ATTESTATION_PATTERN =
  /\battestations?\b[\s\S]{0,120}\b(wallet|kyc|payment|crypto|on-chain identity|identity proof|identity verification|proof of personhood|verifiable credential)\b/i;
const IDENTITY_ATTESTATION_REVERSE_PATTERN =
  /\b(wallet|kyc|payment|crypto|on-chain identity|identity proof|identity verification|proof of personhood|verifiable credential)\b[\s\S]{0,120}\battestations?\b/i;
const DEFENSIVE_SECURITY_MITIGATION_PATTERN =
  /\b(prevent|protect|warn(?:s|ing)? before|block|detect|detection|redact|sanitize|audit|review|remediate|remediation|hardening|least privilege|safe configuration|avoid (?:pasting|exposing|leaking)|leak warning)\b[\s\S]{0,160}\b(?:(?:credential|password|cookie|session|token|wallet|secret|leak)s?|expos(?:e|ing|ure))\b|\b(?:credential|password|cookie|session|token|wallet|secret)s?\b[\s\S]{0,160}\b(prevent|protect|warn(?:s|ing)? before|block|detect|detection|redact|sanitize|audit|review|remediate|remediation|hardening|least privilege|safe configuration|avoid (?:pasting|exposing|leaking)|leak warning)\b/i;
const RESOURCE_THEFT_CAPABILITY_PATTERN =
  /\b(?:this|the|our)?\s*(?:agent|command|hook|mcp|server|skill|statusline|tool|workflow)\b[\s\S]{0,40}\b(?:can|will|does|advertises?|offers?|enables?|designed to|built to)\b[\s\S]{0,80}\b(steals?|exfiltrates?|harvests?|dumps?)\b[\s\S]{0,80}\b(credential|password|cookie|session|token|wallet)s?\b|\b(steals?|exfiltrates?|harvests?|dumps?)\b[\s\S]{0,80}\b(credential|password|cookie|session|token|wallet)s?\b[\s\S]{0,80}\b(?:with|using|through|by)\b[\s\S]{0,40}\b(?:agent|command|hook|mcp|server|skill|statusline|tool|workflow)\b/i;
const CREDENTIAL_THEFT_PATTERN =
  /\b(credential|password|cookie|session|token|wallet)s?\b[\s\S]{0,80}\b(steals?|exfiltrat(?:e|es|ing|ion)|harvests?|dumps?)\b|\b(steals?|exfiltrat(?:e|es|ing|ion)|harvests?|dumps?)\b[\s\S]{0,80}\b(credential|password|cookie|session|token|wallet)s?\b/i;
const EXPLICIT_CREDENTIAL_STEALING_PATTERN =
  /\b(?:credential|password|cookie|session|token|wallet)s?\b[\s\S]{0,80}\bsteals?\b|\bsteals?\b[\s\S]{0,80}\b(?:credential|password|cookie|session|token|wallet)s?\b|\b(?:credential|password|cookie) stealer|keylogger\b/i;
const ABUSE_ENABLEMENT_PATTERN =
  /\b(build|create|generate|run|deploy|use|ship)\b[\s\S]{0,80}\b(credential stealer|password stealer|cookie stealer|keylogger|steal credentials|exfiltrat(?:e|ion)|harvest cookies|dump tokens?)\b/i;

// Keep these Markdown/login helpers in sync with CI policy reporting so issue
// and PR review summaries escape contributor-controlled text consistently.
function isGitHubLogin(value) {
  return GITHUB_LOGIN_PATTERN.test(normalizeText(value));
}

function escapeMarkdownText(value) {
  return compactWhitespace(value)
    .replace(/([\\`*_{}\[\]()#+\-.!|>])/g, "\\$1")
    .replace(/@/g, "\\@");
}

function markdownCodeSpan(value) {
  const text = compactWhitespace(value).slice(0, 1000);
  if (!text) return "";
  const maxBackticks = Math.max(
    0,
    ...(text.match(/`+/g) || []).map((match) => match.length),
  );
  const fence = "`".repeat(maxBackticks + 1);
  const padding = text.startsWith("`") || text.endsWith("`") ? " " : "";
  return `${fence}${padding}${text}${padding}${fence}`;
}

function markdownDetail(value) {
  const detail = markdownCodeSpan(value);
  return detail ? ` - ${detail}` : "";
}

function markdownLabelValue(value) {
  const text = compactWhitespace(value);
  if (!text) return "";
  const delimiter = text.indexOf(":");
  if (delimiter > 0 && delimiter <= 48) {
    const label = text.slice(0, delimiter);
    const detail = text.slice(delimiter + 1).trim();
    return detail
      ? `${escapeMarkdownText(label)}: ${markdownCodeSpan(detail)}`
      : escapeMarkdownText(label);
  }
  return markdownCodeSpan(text);
}

function hasFinancialOrIdentitySensitiveSignal(text) {
  return (
    FINANCIAL_OR_IDENTITY_PATTERN.test(text) ||
    IDENTITY_ATTESTATION_PATTERN.test(text) ||
    IDENTITY_ATTESTATION_REVERSE_PATTERN.test(text)
  );
}

function hasDefensiveSecuritySafeHarbor(text) {
  return (
    DEFENSIVE_SECURITY_MITIGATION_PATTERN.test(text) &&
    !RESOURCE_THEFT_CAPABILITY_PATTERN.test(text) &&
    !EXPLICIT_CREDENTIAL_STEALING_PATTERN.test(text) &&
    !ABUSE_ENABLEMENT_PATTERN.test(text)
  );
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

function lower(value) {
  return normalizeText(value).toLowerCase();
}

function labelsFromDraft(draft = {}) {
  return Array.isArray(draft.labels)
    ? draft.labels
        .map((label) =>
          typeof label === "string" ? label : String(label?.name ?? ""),
        )
        .map((label) => label.trim())
        .filter(Boolean)
    : [];
}

function draftAuthor(draft = {}) {
  if (typeof draft.author === "string") {
    return normalizeGitHubLogin(draft.author) || normalizeText(draft.author);
  }
  return (
    normalizeGitHubLogin(draft.author?.login) ||
    normalizeGitHubLogin(draft.user?.login) ||
    ""
  );
}

function draftNumber(draft = {}) {
  const value = Number(draft.number);
  return Number.isInteger(value) && value > 0 ? value : null;
}

function draftUrl(draft = {}) {
  return normalizeText(draft.html_url || draft.url);
}

function isHttpsUrl(value) {
  const text = normalizeText(value);
  if (!text) return false;
  try {
    return new URL(text).protocol === "https:";
  } catch {
    return false;
  }
}

function hostname(value) {
  try {
    return new URL(normalizeText(value)).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function githubRepoFromUrl(value) {
  try {
    const url = new URL(normalizeText(value));
    if (url.protocol !== "https:" || url.hostname !== "github.com") return "";
    const [owner, repo] = url.pathname.split("/").filter(Boolean);
    return owner && repo ? `${owner}/${repo}` : "";
  } catch {
    return "";
  }
}

function githubLoginFromUrl(value) {
  try {
    const url = new URL(normalizeText(value));
    if (url.protocol !== "https:" || url.hostname !== "github.com") return "";
    const [login] = url.pathname.split("/").filter(Boolean);
    return login || "";
  } catch {
    return "";
  }
}

function normalizeGitHubLogin(value) {
  const text = normalizeText(value);
  if (!text) return "";
  const login = githubLoginFromUrl(text) || text.replace(/^@+/, "").trim();
  return isGitHubLogin(login) ? login : "";
}

function sameGitHubLogin(left, right) {
  const normalizedLeft = normalizeGitHubLogin(left).toLowerCase();
  const normalizedRight = normalizeGitHubLogin(right).toLowerCase();
  return Boolean(
    normalizedLeft && normalizedRight && normalizedLeft === normalizedRight,
  );
}

function githubUserReference(value) {
  const login = normalizeGitHubLogin(value);
  return login ? `@${login}` : markdownCodeSpan(value);
}

function uniquePush(list, value) {
  const normalized = normalizeText(value);
  if (normalized && !list.includes(normalized)) list.push(normalized);
}

function uniquePushMany(list, values) {
  for (const value of values || []) uniquePush(list, value);
}

function splitList(value) {
  return normalizeText(value)
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function stringList(value) {
  return Array.isArray(value)
    ? value.map((item) => normalizeText(item)).filter(Boolean)
    : normalizeText(value)
        .split(/\n+/)
        .map((item) => item.trim())
        .filter(Boolean);
}

function parseContentFrontmatter(value) {
  try {
    const parsed = parseSafeFrontmatter(value);
    return { data: parsed.data || {}, content: parsed.content || "" };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(message);
  }
}

const MAX_URL_SCAN_LENGTH = 200_000;
const MAX_COLLECTED_URLS = 50;
const URL_PREFIXES = ["https://", "http://"];
const URL_TERMINATORS = new Set([
  " ",
  "\n",
  "\r",
  "\t",
  "<",
  ">",
  '"',
  "'",
  ")",
  "]",
  "`",
]);
const TRAILING_URL_PUNCTUATION = new Set([".", ",", ";", ":"]);

function trimTrailingUrlPunctuation(value) {
  let end = value.length;
  while (end > 0 && TRAILING_URL_PUNCTUATION.has(value[end - 1])) {
    end -= 1;
  }
  return value.slice(0, end);
}

function collectUrls(value) {
  const urls = new Set();
  const text = normalizeText(value).slice(0, MAX_URL_SCAN_LENGTH);
  let index = 0;

  while (index < text.length && urls.size < MAX_COLLECTED_URLS) {
    let start = -1;
    for (const prefix of URL_PREFIXES) {
      const next = text.indexOf(prefix, index);
      if (next >= 0 && (start < 0 || next < start)) start = next;
    }
    if (start < 0) break;

    let end = start;
    while (end < text.length && !URL_TERMINATORS.has(text[end])) {
      end += 1;
    }

    const url = trimTrailingUrlPunctuation(text.slice(start, end));
    if (url) urls.add(url);
    index = Math.max(end, start + 1);
  }

  return [...urls];
}

const ARCHIVE_PACKAGE_EXTENSIONS = new Set([
  ".zip",
  ".mcpb",
  ".tar",
  ".tar.gz",
  ".tgz",
  ".tar.bz2",
  ".tbz2",
  ".tar.xz",
  ".txz",
  ".7z",
  ".rar",
  ".gz",
  ".bz2",
  ".xz",
  ".deb",
  ".rpm",
  ".dmg",
  ".exe",
  ".pkg",
  ".msi",
  ".appimage",
]);

function urlPathname(value) {
  const text = normalizeText(value);
  if (!text) return "";
  try {
    return new URL(text).pathname.toLowerCase();
  } catch {
    return text.split(/[?#]/)[0].toLowerCase();
  }
}

function isArchivePackageUrl(value) {
  const pathname = urlPathname(value);
  return [...ARCHIVE_PACKAGE_EXTENSIONS].some((extension) =>
    pathname.endsWith(extension),
  );
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
  if (report.provenanceFindings.some((finding) => finding.id === id)) {
    return;
  }
  report.provenanceFindings.push({ id, severity, summary, detail, blocking });
}

function baseContributorAnalysis(source = "") {
  return {
    login: "",
    rawLogin: "",
    source,
    profileUrl: "",
    id: null,
    accountType: "unknown",
    resolutionStatus: "unresolved",
    accountAgeDays: null,
    publicRepos: null,
    reviewSignals: [],
    warnings: [],
  };
}

function contributorProfileUrl(contributor = {}, login = "") {
  const url = normalizeText(contributor.html_url || contributor.htmlUrl);
  if (url && sameGitHubLogin(url, login)) return url;
  return login ? `https://github.com/${login}` : "";
}

function contributorSummary(contributor = {}) {
  const login = normalizeGitHubLogin(contributor.login);
  if (!login) return null;
  return {
    login,
    htmlUrl: contributorProfileUrl(contributor, login),
    id: contributor.id ?? null,
    accountType: normalizeText(contributor.type) || undefined,
    createdAt: normalizeText(contributor.created_at || contributor.createdAt),
    publicRepos: contributor.public_repos ?? contributor.publicRepos ?? null,
    error: normalizeText(contributor.error),
  };
}

function contributorAnalysis(contributor = {}, source = "", fallback = {}) {
  const profile =
    contributorSummary(contributor) || contributorSummary(fallback);
  const analysis = baseContributorAnalysis(source);
  const rawLogin = normalizeText(
    contributor.login || fallback.login || contributor.name || fallback.name,
  );
  analysis.rawLogin = rawLogin;

  if (!profile) {
    if (rawLogin) {
      analysis.warnings.push(
        `Unresolved GitHub contributor login: ${rawLogin}`,
      );
    } else {
      analysis.warnings.push("No GitHub contributor login was available");
    }
    analysis.reviewSignals.push("identity_unresolved");
    return analysis;
  }

  analysis.login = profile.login;
  analysis.profileUrl = profile.htmlUrl;
  analysis.id = profile.id;
  analysis.accountType =
    profile.accountType || (profile.login.endsWith("[bot]") ? "Bot" : "User");
  analysis.resolutionStatus = profile.error
    ? "metadata_unavailable"
    : "resolved";
  if (profile.error) {
    analysis.warnings.push(
      `GitHub profile metadata unavailable: ${profile.error}`,
    );
    analysis.reviewSignals.push("profile_metadata_unavailable");
  }
  if (analysis.accountType.toLowerCase() === "bot") {
    analysis.reviewSignals.push("bot_account");
  }

  const createdAt = Date.parse(profile.createdAt);
  if (Number.isFinite(createdAt)) {
    const ageDays = Math.floor((Date.now() - createdAt) / 86_400_000);
    analysis.accountAgeDays = ageDays;
    if (ageDays < 7) {
      analysis.reviewSignals.push("new_account");
    } else if (ageDays < 30) {
      analysis.reviewSignals.push("young_account");
    } else {
      analysis.reviewSignals.push("established_account");
    }
  } else {
    analysis.reviewSignals.push("account_age_unknown");
  }

  const hasPublicRepos =
    profile.publicRepos !== null &&
    profile.publicRepos !== undefined &&
    profile.publicRepos !== "";
  const publicRepos = Number(profile.publicRepos);
  if (hasPublicRepos && Number.isFinite(publicRepos)) {
    analysis.publicRepos = publicRepos;
    if (publicRepos <= 0) analysis.reviewSignals.push("no_public_repositories");
  } else {
    analysis.reviewSignals.push("public_repository_count_unknown");
  }

  return analysis;
}

function applyContributorAnalysis(
  report,
  contributor = {},
  source = "",
  fallback = {},
) {
  const analysis = contributorAnalysis(contributor, source, fallback);
  report.contributorAnalysis = analysis;

  if (analysis.accountAgeDays !== null) {
    if (analysis.accountAgeDays < 7) {
      addFlag(
        report,
        "high",
        "new_contributor_account",
        "Contributor account is less than 7 days old",
      );
    } else if (analysis.accountAgeDays < 30) {
      addFlag(
        report,
        "medium",
        "young_contributor_account",
        "Contributor account is less than 30 days old",
      );
    } else {
      report.trustSignals.push(
        `Contributor account age: ${analysis.accountAgeDays} days`,
      );
    }
  }

  if (Number.isFinite(analysis.publicRepos) && analysis.publicRepos > 0) {
    report.trustSignals.push(
      `Contributor public repos: ${analysis.publicRepos}`,
    );
  }
}

const CAPABILITY_BUCKET_BY_FLAG = {
  embedded_secret: "unsafe_install_or_secret",
  community_local_download_request: "package_policy",
  community_archive_download: "package_policy",
  commercial_listing_route: "commercial_or_listing_route",
  non_https_executable_source: "unsafe_install_or_secret",
  unsafe_install_pipeline: "unsafe_install_or_secret",
  malicious_data_theft_capability: "abuse_or_malware",
  malware_or_abuse_surface: "abuse_or_malware",
  prohibited_content: "abuse_or_malware",
  requires_credentials: "credentials_or_auth",
  financial_or_identity_sensitive: "financial_or_identity",
  external_write_capability: "external_write",
  local_or_personal_data_access: "local_or_personal_data",
  destructive_actions: "destructive_actions",
  background_worker_or_daemon: "background_automation",
  downloadable_binary_or_installer: "binary_or_installer",
  no_canonical_source: "source_review",
  non_https_source_url: "source_review",
  invalid_source_url: "source_review",
  schema_skipped: "schema_review",
  schema_invalid: "schema_review",
  missing_pr_file_content: "content_review",
  invalid_frontmatter: "content_review",
};

function baseContributionAnalysis() {
  return {
    schemaState: "not_checked",
    sourceState: "unknown",
    contentFiles: [],
    sourceUrls: [],
    githubSourceRepos: [],
    capabilityRiskBuckets: [],
    provenanceState: "not_applicable",
    maintainerActionItems: [],
  };
}

function schemaStateFromValidation(validationReport) {
  if (!validationReport) return "not_checked";
  if (validationReport.skipped) return "skipped";
  return validationReport.ok ? "passed" : "failed";
}

function addContentFileAnalysis(report, file = {}) {
  const existing = report.contributionAnalysis.contentFiles.find(
    (entry) => entry.filename === file.filename,
  );
  if (existing) Object.assign(existing, file);
  else report.contributionAnalysis.contentFiles.push(file);
}

function addGithubSourceRepo(report, repo) {
  const fullName = normalizeText(repo.fullName || repo.full_name || repo);
  if (!fullName) return;
  const existing = report.contributionAnalysis.githubSourceRepos.find(
    (entry) => entry.fullName.toLowerCase() === fullName.toLowerCase(),
  );
  const next = {
    fullName,
    url: normalizeText(repo.htmlUrl || repo.html_url),
    defaultBranch: normalizeText(repo.defaultBranch || repo.default_branch),
    visibility: normalizeText(repo.visibility),
    archived: repo.archived === undefined ? undefined : Boolean(repo.archived),
    disabled: repo.disabled === undefined ? undefined : Boolean(repo.disabled),
    stargazersCount:
      repo.stargazersCount ?? repo.stargazers_count ?? repo.stars ?? null,
    forksCount: repo.forksCount ?? repo.forks_count ?? null,
  };
  if (existing) {
    for (const [key, value] of Object.entries(next)) {
      if (value !== "" && value !== null && value !== undefined) {
        existing[key] = value;
      }
    }
  } else {
    report.contributionAnalysis.githubSourceRepos.push(next);
  }
}

function setMaintainerAction(report, action) {
  uniquePush(report.contributionAnalysis.maintainerActionItems, action);
}

function finalizeContributionAnalysis(report, validationReport) {
  const analysis = report.contributionAnalysis;
  analysis.schemaState = schemaStateFromValidation(validationReport);
  analysis.sourceState = report.reviewFlags.some(
    (flag) => flag.id === "no_canonical_source",
  )
    ? "missing"
    : report.reviewFlags.some((flag) =>
          ["non_https_source_url", "invalid_source_url"].includes(flag.id),
        )
      ? "needs_verification"
      : analysis.sourceUrls.length
        ? "provided"
        : "unknown";
  analysis.provenanceState = report.provenanceStatus || "not_applicable";

  for (const flag of report.reviewFlags) {
    uniquePush(
      analysis.capabilityRiskBuckets,
      CAPABILITY_BUCKET_BY_FLAG[flag.id],
    );
  }
  if (report.classificationWarnings.length) {
    uniquePush(analysis.capabilityRiskBuckets, "classification_review");
  }
  if (report.provenanceFindings.some((finding) => finding.blocking)) {
    uniquePush(analysis.capabilityRiskBuckets, "provenance_review");
  }

  if (analysis.sourceState === "missing") {
    setMaintainerAction(
      report,
      "Ask for a canonical source, docs, repository, or package URL.",
    );
  } else if (analysis.sourceState === "needs_verification") {
    setMaintainerAction(report, "Verify source URLs before import or merge.");
  }
  if (analysis.schemaState === "failed") {
    setMaintainerAction(report, "Request author input for schema errors.");
  } else if (analysis.schemaState === "skipped") {
    setMaintainerAction(
      report,
      "Confirm category fit before review continues.",
    );
  }
  if (analysis.capabilityRiskBuckets.includes("credentials_or_auth")) {
    setMaintainerAction(
      report,
      "Check credential scope and setup instructions.",
    );
  }
  if (
    analysis.capabilityRiskBuckets.some((bucket) =>
      ["external_write", "destructive_actions"].includes(bucket),
    )
  ) {
    setMaintainerAction(
      report,
      "Confirm user-consent and permission boundaries before listing.",
    );
  }
  if (analysis.capabilityRiskBuckets.includes("local_or_personal_data")) {
    setMaintainerAction(
      report,
      "Review local app, browser, workspace, or personal data access.",
    );
  }
  if (analysis.capabilityRiskBuckets.includes("binary_or_installer")) {
    setMaintainerAction(report, "Verify binary or installer provenance.");
  }
  if (analysis.capabilityRiskBuckets.includes("classification_review")) {
    setMaintainerAction(
      report,
      "Confirm this belongs in the submitted category.",
    );
  }
  if (analysis.capabilityRiskBuckets.includes("provenance_review")) {
    setMaintainerAction(report, "Resolve provenance blockers before merge.");
  }
  if (report.riskTier === "critical") {
    setMaintainerAction(
      report,
      "Block import or merge until critical findings are resolved.",
    );
  }
}

function addSourceSignals(report, fields, text) {
  const urls = [
    fields.github_url,
    fields.docs_url,
    fields.download_url,
    fields.website_url,
    fields.repoUrl,
    fields.documentationUrl,
    fields.websiteUrl,
  ]
    .flatMap((value) => splitList(value))
    .filter(Boolean);

  for (const url of collectUrls(text)) urls.push(url);

  const uniqueUrls = [...new Set(urls)];
  report.sourceUrls = [
    ...new Set([...(report.sourceUrls || []), ...uniqueUrls]),
  ];
  uniquePushMany(report.contributionAnalysis.sourceUrls, uniqueUrls);

  const sourceFields = [
    fields.github_url,
    fields.docs_url,
    fields.download_url,
    fields.website_url,
    fields.repoUrl,
    fields.documentationUrl,
    fields.websiteUrl,
  ].filter(Boolean);

  if (sourceFields.length === 0) {
    addFlag(
      report,
      "high",
      "no_canonical_source",
      "No canonical source, docs, repository, or download URL was provided",
    );
  }

  for (const url of sourceFields) {
    if (!isHttpsUrl(url)) {
      addFlag(
        report,
        "medium",
        "non_https_source_url",
        "A submitted source URL is not HTTPS",
        normalizeText(url),
      );
    }
  }

  const githubSources = sourceFields.map(githubRepoFromUrl).filter(Boolean);
  if (githubSources.length) {
    report.trustSignals.push(`GitHub source: ${githubSources.join(", ")}`);
    for (const source of githubSources) addGithubSourceRepo(report, source);
  }

  const docsHost = hostname(fields.docs_url || fields.documentationUrl);
  if (docsHost) report.trustSignals.push(`Docs host: ${docsHost}`);

  const brandDomain = normalizeText(fields.brand_domain || fields.brandDomain);
  if (brandDomain) report.trustSignals.push(`Brand domain: ${brandDomain}`);
}

function addSchemaSignals(report, validationReport) {
  if (!validationReport) return;
  if (validationReport.skipped) {
    addFlag(
      report,
      "medium",
      "schema_skipped",
      "Submission did not resolve to a core category",
    );
    return;
  }
  if (validationReport.ok) {
    report.trustSignals.push("Schema validation passed");
    return;
  }
  addFlag(
    report,
    "medium",
    "schema_invalid",
    "Submission schema validation is not passing",
    validationReport.errors?.join("; ") || "",
  );
}

function addContentRiskSignals(report, fields, text) {
  const installText = lower(
    [
      fields.install_command,
      fields.installCommand,
      fields.usage_snippet,
      fields.usageSnippet,
      fields.copySnippet,
      fields.configSnippet,
    ].join("\n"),
  );
  const executableSourceUrls = collectUrls(installText);

  if (looksLikeCommercialApiRelay(fields, text)) {
    addFlag(
      report,
      "high",
      "commercial_listing_route",
      "Commercial API relays, paid gateways, and pay-per-use proxy services belong in the tools/listing flow",
      "Use the commercial listing route instead of the free content queue",
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

  const downloadUrl = normalizeText(fields.download_url || fields.downloadUrl);
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
    /\b(ransomware|trojan|keylogger|credential stealer|password stealer|cookie stealer|backdoor|botnet|worm|cryptojacker|malware)\b/i.test(
      text,
    )
  ) {
    addFlag(
      report,
      "high",
      "malware_or_abuse_surface",
      "Submission uses malware or abuse tooling terms that need security review",
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

  if (hasFinancialOrIdentitySensitiveSignal(text)) {
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

function addToolListingClassificationSignals(report, fields, text) {
  const category = normalizeText(fields.category);
  if (category && category !== TOOLS_CATEGORY) {
    if (looksLikeToolAppListing(fields, text)) {
      addClassificationWarning(
        report,
        "tools_category_routing",
        "This looks like a hosted tool/app/service/product and should route to tools listing review",
        `Use content/tools or ${TOOLS_LISTING_FLOW_URL}`,
      );
    }
    return;
  }

  if (category === TOOLS_CATEGORY) {
    const missing = missingToolListingReviewFields(fields);
    if (missing.length) {
      addClassificationWarning(
        report,
        "tools_listing_metadata_missing",
        "Tools listings should include website, docs/demo, pricing, disclosure, application category, and operating system fields",
        missing.join(", "),
      );
    }
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
      "Sensitive execution, install, package, background, or write behavior needs safetyNotes/safety_notes disclosure before direct merge",
      safetyRequired.join(", "),
    );
  }

  if (privacyRequired.length && !privacyNotes.length) {
    addClassificationWarning(
      report,
      "missing_privacy_notes",
      "Credential, local data, telemetry, or third-party data behavior needs privacyNotes/privacy_notes disclosure before direct merge",
      privacyRequired.join(", "),
    );
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

function recommendedAction(tier, validationReport) {
  if (tier === "critical") return "block_until_resolved";
  if (validationReport && !validationReport.skipped && !validationReport.ok) {
    return "request_author_input";
  }
  return "maintainer_review";
}

function riskNotes(report) {
  const notes = [
    "This deterministic security/safety review is advisory unless the tier is critical.",
    "Schema-valid does not mean publish-valid; maintainer source and safety review is still required.",
    "Category fit, regulated-domain status, and promotional tone are not treated as security risk by this check.",
  ];
  if (report.riskTier === "critical") {
    notes.push(
      "Critical findings should block import or merge until resolved.",
    );
  }
  if (report.reviewFlags.some((flag) => flag.id === "no_canonical_source")) {
    notes.push("Ask for a canonical source, docs, repository, or package URL.");
  }
  if (
    report.reviewFlags.some((flag) =>
      ["external_write_capability", "destructive_actions"].includes(flag.id),
    )
  ) {
    notes.push(
      "Confirm user-consent and permission boundaries before listing.",
    );
  }
  return notes;
}

function hasReviewFlag(report, ids) {
  const idSet = new Set(Array.isArray(ids) ? ids : [ids]);
  return report.reviewFlags.some((flag) => idSet.has(flag.id));
}

function flagIds(report, ids) {
  const idSet = new Set(Array.isArray(ids) ? ids : [ids]);
  return report.reviewFlags
    .filter((flag) => idSet.has(flag.id))
    .map((flag) => flag.id);
}

function policyGate(status, summary, detail = []) {
  return {
    status,
    summary,
    detail: Array.isArray(detail)
      ? detail.filter(Boolean)
      : [detail].filter(Boolean),
  };
}

function buildPolicyMatrix(report, validationReport) {
  const contribution =
    report.contributionAnalysis || baseContributionAnalysis();
  const criticalFlags = report.reviewFlags
    .filter((flag) => flag.severity === "critical")
    .map((flag) => flag.id);
  const highFlags = report.reviewFlags
    .filter((flag) => flag.severity === "high")
    .map((flag) => flag.id);
  const packageFlags = flagIds(report, [
    "community_local_download_request",
    "community_archive_download",
    "downloadable_binary_or_installer",
  ]);

  const schema =
    validationReport?.skipped || contribution.schemaState === "skipped"
      ? policyGate(
          "block",
          "Submission did not resolve to a supported category.",
        )
      : validationReport && !validationReport.ok
        ? policyGate("block", "Submission schema validation is failing.")
        : contribution.schemaState === "passed"
          ? policyGate("pass", "Required submission fields are present.")
          : policyGate("warn", "Submission schema has not been checked.");

  const source =
    contribution.sourceState === "missing"
      ? policyGate("block", "Canonical source, docs, or repo URL is missing.")
      : contribution.sourceState === "needs_verification"
        ? policyGate("block", "Source URL format or trust needs verification.")
        : contribution.sourceState === "provided"
          ? policyGate("pass", "Canonical source signal is present.")
          : policyGate("warn", "Source state is unknown.");

  const packageGate = hasReviewFlag(report, "community_local_download_request")
    ? policyGate(
        "block",
        "Community content cannot request HeyClaude local package hosting.",
        packageFlags,
      )
    : hasReviewFlag(report, "community_archive_download")
      ? policyGate(
          "warn",
          "Package archive URLs require maintainer quarantine review before publication.",
          packageFlags,
        )
      : hasReviewFlag(report, "downloadable_binary_or_installer")
        ? policyGate(
            "warn",
            "Installer or binary package references need maintainer review.",
            packageFlags,
          )
        : policyGate("pass", "No community-hosted package artifact requested.");

  const provenance =
    contribution.provenanceState === "failed" ||
    report.provenanceStatus === "failed"
      ? policyGate("block", "Submission provenance failed validation.")
      : contribution.provenanceState === "passed" ||
          report.provenanceStatus === "passed"
        ? policyGate("pass", "Contributor provenance is consistent.")
        : policyGate(
            "pass",
            "Provenance is not required for this intake path.",
          );

  const capability = criticalFlags.length
    ? policyGate(
        "block",
        "Critical unsafe capability signals block import.",
        criticalFlags,
      )
    : highFlags.length
      ? policyGate(
          "warn",
          "High-risk capability signals require maintainer review.",
          highFlags,
        )
      : report.reviewFlags.length
        ? policyGate(
            "warn",
            "Automated review found non-blocking capability signals.",
            report.reviewFlags.map((flag) => flag.id),
          )
        : policyGate("pass", "No deterministic capability flags found.");

  const quality = report.classificationWarnings.length
    ? policyGate(
        "warn",
        "Category fit or generated-artifact hygiene needs review.",
        report.classificationWarnings.map((warning) => warning.id),
      )
    : policyGate("pass", "No classification or quality warnings found.");

  return {
    schema,
    source,
    package: packageGate,
    provenance,
    capability,
    quality,
  };
}

function policyDecisionForReport(report) {
  const matrix = report.policyMatrix || {};
  const gates = Object.values(matrix);
  if (gates.some((gate) => gate?.status === "block")) return "blocked";
  if (report.subject?.type !== "submission_draft") return "maintainer_review";
  const sourcePass = matrix.source?.status === "pass";
  const packagePass = matrix.package?.status === "pass";
  const qualityPass = matrix.quality?.status === "pass";
  const riskAllowed = report.riskTier === "low" || report.riskTier === "medium";
  return sourcePass && packagePass && qualityPass && riskAllowed
    ? "submit_pr_eligible"
    : "maintainer_review";
}

export function directContentRequestChangesReasons(report = {}) {
  if (report.subject?.type !== "pull_request") return [];
  const reasons = [];
  const sourceType = report.sourceType || report.subject?.sourceType;
  const isExternalDirect = sourceType === "external_direct";
  const isDirectContentShape =
    Number(report.subject?.changedFileCount || report.changedFileCount || 0) ===
      1 &&
    Number(report.subject?.contentFileCount || report.contentFileCount || 0) ===
      1;
  if (!isExternalDirect && !isDirectContentShape) return [];

  const flags = new Set((report.reviewFlags || []).map((flag) => flag.id));
  const warnings = new Set(
    (report.classificationWarnings || []).map((warning) => warning.id),
  );

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
    if (warnings.has(id)) reasons.push(`${reason} (${id}).`);
  }

  return [...new Set(reasons)];
}

function finalizeReport(report, validationReport) {
  report.riskTier = tierFromFlags(report.reviewFlags);
  report.recommendedAction = recommendedAction(
    report.riskTier,
    validationReport,
  );
  finalizeContributionAnalysis(report, validationReport);
  report.policyMatrix = buildPolicyMatrix(report, validationReport);
  report.policyDecision = policyDecisionForReport(report);
  report.requestChangesReasons = directContentRequestChangesReasons(report);
  report.humanReviewNotes = riskNotes(report);
  return report;
}

function baseReport(subject) {
  return {
    schemaVersion: SUBMISSION_RISK_SCHEMA_VERSION,
    kind: "submission-risk",
    generatedAt: new Date().toISOString(),
    subject,
    provenanceStatus: "not_applicable",
    provenanceFindings: [],
    contentProvenance: [],
    effectiveContributor: null,
    contributorSource: "",
    contributorAnalysis: baseContributorAnalysis(),
    contributionAnalysis: baseContributionAnalysis(),
    pullRequestActor: null,
    riskTier: "low",
    reviewFlags: [],
    trustSignals: [],
    sourceUrls: [],
    classificationWarnings: [],
    recommendedAction: "maintainer_review",
    policyMatrix: {},
    policyDecision: "maintainer_review",
    requestChangesReasons: [],
    humanReviewNotes: [],
  };
}

function selectContributor(contributor, fallbackContributor = {}) {
  if (normalizeGitHubLogin(contributor?.login)) return contributor;
  if (normalizeGitHubLogin(fallbackContributor.login)) {
    return fallbackContributor;
  }
  return contributor || fallbackContributor;
}

function selectSourceRepositories(input = {}) {
  const githubSourceRepositories = Array.isArray(input.githubSourceRepositories)
    ? input.githubSourceRepositories
    : [];
  if (githubSourceRepositories.length) return githubSourceRepositories;
  return Array.isArray(input.sourceRepositories)
    ? input.sourceRepositories
    : [];
}

export function analyzeSubmissionDraftRisk(
  draft = {},
  validationReport = null,
  options = {},
) {
  const fields = validationReport?.fields ?? {};
  const text = [draft.title, draft.body, Object.values(fields).join("\n")].join(
    "\n",
  );
  const report = baseReport({
    type: "submission_draft",
    number: draftNumber(draft),
    title: normalizeText(draft.title),
    url: draftUrl(draft),
    author: draftAuthor(draft),
    labels: labelsFromDraft(draft),
    category: validationReport?.category || fields.category || "",
    slug: fields.slug || "",
  });
  for (const repo of selectSourceRepositories(options)) {
    addGithubSourceRepo(report, repo);
  }
  const fallbackContributor =
    draft.user || (typeof draft.author === "object" ? draft.author : {}) || {};
  const contributor = selectContributor(
    options.contributor,
    fallbackContributor,
  );
  const contributorProfile = contributorSummary(contributor);
  if (contributorProfile) {
    report.provenanceStatus = "passed";
    report.effectiveContributor = contributorProfile;
    report.contributorSource = "draft_author";
  }

  addSchemaSignals(report, validationReport);
  addSourceSignals(report, fields, text);
  addContentRiskSignals(report, fields, text);
  addToolListingClassificationSignals(report, fields, text);
  addDisclosureNoteSignals(report, fields);
  applyContributorAnalysis(
    report,
    contributor,
    "draft_author",
    fallbackContributor,
  );

  return finalizeReport(report, validationReport);
}

function frontmatterFields(data = {}, category = "") {
  return {
    category: normalizeText(data.category || category),
    slug: normalizeText(data.slug),
    name: normalizeText(data.title || data.name),
    description: normalizeText(data.description),
    card_description: normalizeText(data.cardDescription),
    github_url: normalizeText(data.repoUrl),
    website_url: normalizeText(data.websiteUrl),
    affiliate_url: normalizeText(data.affiliateUrl),
    docs_url: normalizeText(data.documentationUrl || data.projectUrl),
    pricing_model: normalizeText(data.pricingModel),
    disclosure: normalizeText(data.disclosure),
    application_category: normalizeText(data.applicationCategory),
    operating_system: normalizeText(data.operatingSystem),
    download_url: normalizeText(data.downloadUrl),
    install_command: normalizeText(data.installCommand),
    usage_snippet: normalizeText(data.usageSnippet),
    full_copyable_content: normalizeText(data.copySnippet),
    brand_domain: normalizeText(data.brandDomain),
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

function prFileCategory(filename) {
  const parts = normalizeText(filename).split("/");
  return parts[0] === "content" && parts.length >= 3 ? parts[1] : "";
}

function addGeneratedArtifactSignals(report, files, contentFiles, sourceType) {
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
      "Remove README.md from the contributor PR. CI regenerates it for validation, and maintainer/internal branches own committed README updates.",
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

function prSourceType(input = {}) {
  if (input.sourceType) return normalizeText(input.sourceType);
  const headRef = normalizeText(input.pullRequest?.head?.ref);
  if (/^automation\/submission-\d+-/.test(headRef)) return "automation_import";
  const headRepo = normalizeText(
    input.pullRequest?.head?.repo?.full_name ||
      input.pullRequest?.head?.repo?.fullName,
  );
  const baseRepo = normalizeText(
    input.pullRequest?.base?.repo?.full_name ||
      input.pullRequest?.base?.repo?.fullName,
  );
  if (headRepo && baseRepo) {
    return headRepo.toLowerCase() === baseRepo.toLowerCase()
      ? "same_repo_direct"
      : "external_direct";
  }
  return "same_repo_direct";
}

function sourceSubmissionContributorMap(input = {}) {
  const map = new Map();
  const contributors = Array.isArray(input.sourceSubmissionContributors)
    ? input.sourceSubmissionContributors
    : [];
  for (const item of contributors) {
    const submissionNumberValue = Number(
      item.number || item.submission?.number,
    );
    if (
      !Number.isInteger(submissionNumberValue) ||
      submissionNumberValue <= 0
    ) {
      continue;
    }
    map.set(submissionNumberValue, {
      submission: item.submission || {},
      contributor: item.contributor || item.submission?.user || {},
    });
  }
  return map;
}

function frontmatterContributorMap(input = {}) {
  const map = new Map();
  const contributors = Array.isArray(input.frontmatterContributors)
    ? input.frontmatterContributors
    : [];
  for (const contributor of contributors) {
    const login = normalizeGitHubLogin(contributor?.login || contributor?.name);
    if (login) map.set(login.toLowerCase(), contributor);
  }
  return map;
}

function submissionUrlMatchesNumber(url, number) {
  const text = normalizeText(url);
  if (!text) return false;
  try {
    const parts = new URL(text).pathname.split("/").filter(Boolean);
    const issueIndex = parts.indexOf("issues");
    const pullIndex = parts.indexOf("pull");
    return (
      (issueIndex >= 0 && parts[issueIndex + 1] === String(number)) ||
      (pullIndex >= 0 && parts[pullIndex + 1] === String(number))
    );
  } catch {
    return false;
  }
}

function validatePrProvenance(report, entries, input, sourceType) {
  if (!entries.length) return;

  report.contentProvenance = entries.map((entry) => ({
    filename: entry.filename,
    ...entry.provenance,
  }));

  const prActor = contributorSummary(
    input.pullRequestActor || input.pullRequest?.user || {},
  );
  report.pullRequestActor = prActor;
  if (prActor?.login) {
    report.trustSignals.push(
      `PR opened by: ${githubUserReference(prActor.login)}`,
    );
  }

  const sourceSubmissionsByNumber = sourceSubmissionContributorMap(input);
  const contributorsByLogin = frontmatterContributorMap(input);
  let contributorSource =
    sourceType === "automation_import"
      ? "source_submission_author"
      : sourceType === "external_direct"
        ? "pull_request_author"
        : "pull_request_or_maintainer";
  let effectiveContributor =
    sourceType === "automation_import"
      ? null
      : contributorSummary(input.contributor || input.pullRequest?.user || {});

  if (sourceType === "automation_import") {
    const sourceSubmissionNumbers = [
      ...new Set(
        entries
          .map((entry) => entry.provenance.sourceSubmissionNumber)
          .filter(Boolean),
      ),
    ];
    if (sourceSubmissionNumbers.length === 1) {
      effectiveContributor = contributorSummary(
        sourceSubmissionsByNumber.get(sourceSubmissionNumbers[0])
          ?.contributor || {},
      );
    }
  } else if (sourceType === "same_repo_direct") {
    const submittedLogins = [
      ...new Set(
        entries
          .map((entry) => normalizeGitHubLogin(entry.provenance.submittedBy))
          .filter(Boolean)
          .map((login) => login.toLowerCase()),
      ),
    ];
    if (submittedLogins.length === 1) {
      const submittedLogin = submittedLogins[0];
      const contributor = contributorsByLogin.get(submittedLogin);
      const provenance = entries.find((entry) =>
        sameGitHubLogin(entry.provenance.submittedBy, submittedLogin),
      )?.provenance;
      effectiveContributor = contributorSummary(
        contributor || {
          login: provenance?.submittedBy || submittedLogin,
          html_url: provenance?.submittedByUrl,
        },
      );
      contributorSource = "content_frontmatter";
    }
  }

  if (
    !effectiveContributor &&
    contributorSource !== "source_submission_author"
  ) {
    const fallbackCandidates = [
      [input.contributor, contributorSource || "provided_contributor"],
      [input.pullRequestActor, "pull_request_actor"],
      [input.pullRequest?.user, "pr_user"],
    ];
    for (const [candidate, source] of fallbackCandidates) {
      effectiveContributor = contributorSummary(candidate || {});
      if (effectiveContributor) {
        contributorSource = source;
        break;
      }
    }
  }

  report.effectiveContributor = effectiveContributor;
  report.contributorSource = contributorSource;

  if (sourceType === "automation_import") {
    for (const entry of entries) {
      const provenance = entry.provenance;
      const required = [
        ["submittedBy", provenance.submittedBy],
        ["submittedByUrl", provenance.submittedByUrl],
        ["sourceSubmissionNumber", provenance.sourceSubmissionNumber],
        ["sourceSubmissionUrl", provenance.sourceSubmissionUrl],
      ].filter(([, value]) => !value);

      if (required.length) {
        addProvenanceFinding(
          report,
          "error",
          `missing_import_provenance_${entry.filename}`,
          "Automation import content is missing required source-submission provenance",
          `${entry.filename}: ${required.map(([field]) => field).join(", ")}`,
        );
        continue;
      }

      const sourceSubmissionContributor = sourceSubmissionsByNumber.get(
        provenance.sourceSubmissionNumber,
      )?.contributor;
      const sourceSubmissionLogin = normalizeGitHubLogin(
        sourceSubmissionContributor?.login,
      );
      if (!sourceSubmissionLogin) {
        addProvenanceFinding(
          report,
          "error",
          `missing_source_submission_contributor_${provenance.sourceSubmissionNumber}`,
          "Could not resolve the original source-submission contributor for import provenance",
          `Submission #${provenance.sourceSubmissionNumber}`,
        );
      } else if (
        !sameGitHubLogin(provenance.submittedBy, sourceSubmissionLogin)
      ) {
        addProvenanceFinding(
          report,
          "error",
          `import_submitter_mismatch_${entry.filename}`,
          "Imported content submitter does not match the linked source-submission contributor",
          `${entry.filename}: submittedBy=${provenance.submittedBy}, sourceSubmissionContributor=${sourceSubmissionLogin}`,
        );
      }

      if (
        provenance.submittedByUrl &&
        !sameGitHubLogin(provenance.submittedByUrl, provenance.submittedBy)
      ) {
        addProvenanceFinding(
          report,
          "error",
          `import_submitter_url_mismatch_${entry.filename}`,
          "Imported content submitter URL does not match submittedBy",
          `${entry.filename}: ${provenance.submittedByUrl}`,
        );
      }

      if (
        provenance.sourceSubmissionUrl &&
        !submissionUrlMatchesNumber(
          provenance.sourceSubmissionUrl,
          provenance.sourceSubmissionNumber,
        )
      ) {
        addProvenanceFinding(
          report,
          "error",
          `import_source_submission_url_mismatch_${entry.filename}`,
          "Imported content source submission URL does not match sourceSubmissionNumber",
          `${entry.filename}: ${provenance.sourceSubmissionUrl}`,
        );
      }
    }
  } else if (sourceType === "external_direct") {
    for (const entry of entries) {
      const provenance = entry.provenance;
      if (!provenance.submittedBy || !provenance.submittedByUrl) {
        addProvenanceFinding(
          report,
          "error",
          `missing_direct_pr_submitter_${entry.filename}`,
          "Direct contributor PR content must include submittedBy and submittedByUrl",
          `${entry.filename}: add submittedBy: ${prActor?.login || "<your GitHub handle>"} and submittedByUrl: https://github.com/${prActor?.login || "<your GitHub handle>"}`,
        );
        continue;
      }

      if (
        prActor?.login &&
        !sameGitHubLogin(provenance.submittedBy, prActor.login)
      ) {
        addProvenanceFinding(
          report,
          "error",
          `direct_pr_submitter_mismatch_${entry.filename}`,
          "Direct contributor PR submittedBy must match the PR author",
          `${entry.filename}: submittedBy=${provenance.submittedBy}, prAuthor=${prActor.login}`,
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
  } else if (sourceType === "same_repo_direct") {
    for (const entry of entries) {
      const provenance = entry.provenance;
      if (provenance.submittedBy && !provenance.submittedByUrl) {
        addProvenanceFinding(
          report,
          "error",
          `missing_same_repo_submitter_url_${entry.filename}`,
          "Content provenance with submittedBy must also include submittedByUrl",
          `${entry.filename}: submittedBy=${provenance.submittedBy}`,
        );
      }

      if (
        provenance.submittedByUrl &&
        !sameGitHubLogin(provenance.submittedByUrl, provenance.submittedBy)
      ) {
        addProvenanceFinding(
          report,
          "error",
          `same_repo_submitter_url_mismatch_${entry.filename}`,
          "Content submittedByUrl must match submittedBy",
          `${entry.filename}: ${provenance.submittedByUrl}`,
        );
      }
    }
  }

  report.provenanceStatus = report.provenanceFindings.some(
    (finding) => finding.blocking,
  )
    ? "failed"
    : "passed";

  if (sourceType === "automation_import") {
    const issues = entries
      .map((entry) => entry.provenance.sourceSubmissionNumber)
      .filter(Boolean);
    for (const issueNumberValue of [...new Set(issues)]) {
      report.trustSignals.push(`Original submission: #${issueNumberValue}`);
    }
  }
}

function contributorAnalysisTarget(report, input = {}) {
  const pullRequestUser = input.pullRequest?.user || {};
  if (
    report.contributorSource === "source_submission_author" &&
    !report.effectiveContributor
  ) {
    return {
      contributor: {},
      source: report.contributorSource,
      fallback: {},
    };
  }
  const candidates = [
    [input.contributor, report.contributorSource || "provided_contributor"],
    [input.pullRequestActor, "pull_request_actor"],
    [pullRequestUser, "pr_user"],
  ];
  for (const [contributor, source] of candidates) {
    const summary = contributorSummary(contributor);
    if (!summary) continue;
    if (
      report.effectiveContributor &&
      !sameGitHubLogin(summary.login, report.effectiveContributor.login)
    ) {
      continue;
    }
    return {
      contributor,
      source,
      fallback: pullRequestUser,
    };
  }
  if (report.effectiveContributor) {
    return {
      contributor: report.effectiveContributor,
      source: report.contributorSource,
      fallback: pullRequestUser,
    };
  }
  return {
    contributor: {},
    source: report.contributorSource,
    fallback: pullRequestUser,
  };
}

export function analyzeDirectContentRisk(input = {}) {
  const files = Array.isArray(input.files) ? input.files : [];
  const contentFiles = files.filter(
    (file) =>
      /^content\/[^/]+\/[^/]+\.mdx$/i.test(normalizeText(file.filename)) &&
      normalizeText(file.status) !== "removed",
  );
  const sourceType = prSourceType(input);
  const report = baseReport({
    type: "pull_request",
    number: input.pullRequest?.number ?? input.number ?? null,
    title: normalizeText(input.pullRequest?.title || input.title),
    url: normalizeText(input.pullRequest?.html_url || input.url),
    author:
      normalizeGitHubLogin(input.contributor?.login) ||
      normalizeGitHubLogin(input.pullRequest?.user?.login) ||
      normalizeGitHubLogin(input.author) ||
      normalizeText(input.author),
    sourceType,
    contentFiles: contentFiles.map((file) => file.filename),
    changedFileCount: files.length,
    contentFileCount: contentFiles.length,
  });

  for (const repo of selectSourceRepositories(input)) {
    addGithubSourceRepo(report, repo);
  }

  if (!contentFiles.length) {
    addFlag(
      report,
      "low",
      "no_content_mdx_files",
      "No added or modified content MDX files were available for risk analysis",
    );
  }

  addGeneratedArtifactSignals(report, files, contentFiles, sourceType);

  const entries = [];
  for (const file of contentFiles) {
    const content = normalizeText(file.content);
    if (!content) {
      addFlag(
        report,
        "medium",
        "missing_pr_file_content",
        "PR content file could not be read through the GitHub API",
        file.filename,
      );
      continue;
    }

    let parsed;
    try {
      parsed = parseContentFrontmatter(content);
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
    entries.push({ filename: file.filename, fields, provenance });
    addContentFileAnalysis(report, {
      filename: file.filename,
      status: normalizeText(file.status),
      category,
      slug: fields.slug,
      sourceUrls: [
        fields.github_url,
        fields.docs_url,
        fields.download_url,
        fields.website_url,
      ].filter(Boolean),
      githubSources: [
        fields.github_url,
        fields.docs_url,
        fields.download_url,
        fields.website_url,
      ]
        .map(githubRepoFromUrl)
        .filter(Boolean),
    });
    report.trustSignals.push(`Content file: ${file.filename}`);
    addSourceSignals(report, fields, content);
    addContentRiskSignals(report, fields, content);
    addToolListingClassificationSignals(report, fields, content);
    addDisclosureNoteSignals(report, fields);
  }

  validatePrProvenance(report, entries, input, sourceType);
  const analysisTarget = contributorAnalysisTarget(report, input);
  const analysisContributor = contributorSummary(analysisTarget.contributor);
  if (
    analysisContributor &&
    (!report.effectiveContributor ||
      sameGitHubLogin(
        analysisContributor.login,
        report.effectiveContributor.login,
      ))
  ) {
    report.effectiveContributor = analysisContributor;
    report.contributorSource = analysisTarget.source;
  }
  applyContributorAnalysis(
    report,
    analysisTarget.contributor,
    analysisTarget.source,
    analysisTarget.fallback,
  );
  return finalizeReport(report, null);
}

export function formatSubmissionRiskMarkdown(report) {
  const marker = SUBMISSION_RISK_COMMENT_MARKER;
  const lines = [
    marker,
    `## Submission security/safety review: ${report.riskTier}`,
    "",
    `- Recommended action: \`${report.recommendedAction}\``,
    `- Policy decision: \`${report.policyDecision || "maintainer_review"}\``,
  ];

  if (report.provenanceStatus && report.provenanceStatus !== "not_applicable") {
    lines.push("", "### Provenance");
    lines.push(`- Status: \`${report.provenanceStatus}\``);
    if (
      report.pullRequestActor?.login &&
      !sameGitHubLogin(
        report.pullRequestActor.login,
        report.effectiveContributor?.login,
      )
    ) {
      lines.push(
        `- PR opened by: ${githubUserReference(report.pullRequestActor.login)}`,
      );
    }
    for (const provenance of report.contentProvenance || []) {
      const parts = [];
      if (provenance.submittedBy) {
        parts.push(`by ${githubUserReference(provenance.submittedBy)}`);
      }
      if (provenance.sourceSubmissionNumber) {
        parts.push(`via submission #${provenance.sourceSubmissionNumber}`);
      } else if (provenance.importPrNumber) {
        parts.push(`via PR #${provenance.importPrNumber}`);
      }
      if (parts.length) {
        lines.push(
          `- ${markdownCodeSpan(provenance.filename)}: ${parts.join(" ")}`,
        );
      }
    }
    for (const finding of report.provenanceFindings || []) {
      lines.push(
        `- \`${finding.severity}\` ${escapeMarkdownText(finding.summary)} (\`${finding.id}\`)${markdownDetail(finding.detail)}`,
      );
    }
  }

  const contributor = report.contributorAnalysis || baseContributorAnalysis();
  if (
    contributor.login ||
    contributor.rawLogin ||
    contributor.warnings?.length
  ) {
    lines.push("", "### Contributor");
    const analyzed = contributor.login
      ? githubUserReference(contributor.login)
      : markdownCodeSpan(contributor.rawLogin);
    if (analyzed) lines.push(`- Contributor analyzed: ${analyzed}`);
    if (contributor.source) lines.push(`- Source: \`${contributor.source}\``);
    lines.push(`- Resolution: \`${contributor.resolutionStatus}\``);
    if (contributor.accountType) {
      lines.push(`- Account type: \`${contributor.accountType}\``);
    }
    if (contributor.profileUrl) {
      lines.push(`- Profile: ${markdownCodeSpan(contributor.profileUrl)}`);
    }
    if (contributor.accountAgeDays !== null) {
      lines.push(`- Account age: ${contributor.accountAgeDays} days`);
    }
    if (contributor.publicRepos !== null) {
      lines.push(`- Public repos: ${contributor.publicRepos}`);
    }
    if (contributor.reviewSignals?.length) {
      lines.push(
        `- Signals: ${contributor.reviewSignals.map((signal) => `\`${signal}\``).join(", ")}`,
      );
    }
    for (const warning of contributor.warnings || []) {
      lines.push(`- Warning: ${escapeMarkdownText(warning)}`);
    }
  }

  const contribution =
    report.contributionAnalysis || baseContributionAnalysis();
  lines.push("", "### Contribution");
  lines.push(`- Schema: \`${contribution.schemaState}\``);
  lines.push(`- Sources: \`${contribution.sourceState}\``);
  if (contribution.contentFiles?.length) {
    const files = contribution.contentFiles
      .slice(0, 8)
      .map((file) => markdownCodeSpan(file.filename))
      .join(", ");
    lines.push(`- Content files: ${files}`);
  }
  if (contribution.sourceUrls?.length) {
    lines.push(`- Source URLs: ${contribution.sourceUrls.length}`);
  }
  if (contribution.githubSourceRepos?.length) {
    const repos = contribution.githubSourceRepos
      .slice(0, 8)
      .map((repo) => markdownCodeSpan(repo.fullName))
      .join(", ");
    lines.push(`- GitHub sources: ${repos}`);
  }
  if (contribution.capabilityRiskBuckets?.length) {
    lines.push(
      `- Capability buckets: ${contribution.capabilityRiskBuckets.map((bucket) => `\`${bucket}\``).join(", ")}`,
    );
  } else {
    lines.push("- Capability buckets: none");
  }
  lines.push(`- Provenance: \`${contribution.provenanceState}\``);

  const policyMatrix = report.policyMatrix || {};
  if (Object.keys(policyMatrix).length) {
    lines.push("", "### Policy matrix");
    for (const [name, gate] of Object.entries(policyMatrix)) {
      if (!gate) continue;
      lines.push(
        `- ${escapeMarkdownText(name)}: \`${gate.status}\` - ${escapeMarkdownText(gate.summary || "")}`,
      );
      if (Array.isArray(gate.detail) && gate.detail.length) {
        lines.push(
          `  - Signals: ${gate.detail.map((item) => markdownCodeSpan(item)).join(", ")}`,
        );
      }
    }
  }

  if (report.reviewFlags.length) {
    lines.push("", "### Review flags");
    for (const flag of report.reviewFlags) {
      lines.push(
        `- \`${flag.severity}\` ${escapeMarkdownText(flag.summary)} (\`${flag.id}\`)${markdownDetail(flag.detail)}`,
      );
    }
  } else {
    lines.push(
      "",
      "### Review flags",
      "- No deterministic security/safety flags found.",
    );
  }

  if (report.classificationWarnings.length) {
    lines.push("", "### Classification warnings");
    for (const warning of report.classificationWarnings) {
      lines.push(
        `- ${escapeMarkdownText(warning.summary)} (\`${warning.id}\`)${markdownDetail(warning.detail)}`,
      );
    }
  }

  if (report.requestChangesReasons?.length) {
    lines.push("", "### Blocking findings");
    for (const reason of report.requestChangesReasons) {
      lines.push(`- ${escapeMarkdownText(reason)}`);
    }
  }

  if (report.trustSignals.length) {
    lines.push("", "### Trust signals");
    for (const signal of report.trustSignals.slice(0, 12)) {
      const formatted = markdownLabelValue(signal);
      if (formatted) lines.push(`- ${formatted}`);
    }
  }

  const maintainerChecks = [
    ...(contribution.maintainerActionItems || []),
    ...(report.humanReviewNotes || []),
  ].filter(
    (item, index, list) =>
      normalizeText(item) &&
      list.findIndex((candidate) => candidate === item) === index,
  );
  if (maintainerChecks.length) {
    lines.push("", "### Maintainer checks");
    for (const note of maintainerChecks) {
      lines.push(`- ${escapeMarkdownText(note)}`);
    }
  }

  return `${lines.join("\n")}\n`;
}
