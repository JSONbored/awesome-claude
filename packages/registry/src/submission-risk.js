import matter from "gray-matter";

import {
  looksLikeToolAppListing,
  missingToolListingReviewFields,
  TOOLS_CATEGORY,
  TOOLS_LISTING_FLOW_URL,
} from "./submission-classification.js";
import {
  SUBMISSION_RISK_HIGH_LABEL,
  SUBMISSION_RISK_LABEL_DEFINITIONS,
  SUBMISSION_RISK_LOW_LABEL,
  SUBMISSION_RISK_MEDIUM_LABEL,
} from "./submission-labels.js";

export const SUBMISSION_RISK_SCHEMA_VERSION = 1;
export const SUBMISSION_RISK_COMMENT_MARKER = "<!-- submission-risk-report -->";

const SEVERITY_WEIGHT = {
  info: 0,
  low: 1,
  medium: 3,
  high: 6,
  critical: 100,
};

const RISK_LABEL_BY_TIER = {
  low: SUBMISSION_RISK_LOW_LABEL,
  medium: SUBMISSION_RISK_MEDIUM_LABEL,
  high: SUBMISSION_RISK_HIGH_LABEL,
  critical: SUBMISSION_RISK_HIGH_LABEL,
};

function normalizeText(value) {
  return String(value ?? "").trim();
}

function compactWhitespace(value) {
  return normalizeText(value).replace(/\s+/g, " ");
}

function lower(value) {
  return normalizeText(value).toLowerCase();
}

function labelsFromIssue(issue = {}) {
  return Array.isArray(issue.labels)
    ? issue.labels
        .map((label) =>
          typeof label === "string" ? label : String(label?.name ?? ""),
        )
        .map((label) => label.trim())
        .filter(Boolean)
    : [];
}

function issueAuthor(issue = {}) {
  if (typeof issue.author === "string") return issue.author;
  return (
    normalizeText(issue.author?.login) ||
    normalizeText(issue.user?.login) ||
    normalizeText(issue.user?.name)
  );
}

function issueNumber(issue = {}) {
  const value = Number(issue.number);
  return Number.isInteger(value) && value > 0 ? value : null;
}

function issueUrl(issue = {}) {
  return normalizeText(issue.html_url || issue.url);
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
  return githubLoginFromUrl(text) || text.replace(/^@+/, "").trim();
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
  return login ? `@${login}` : normalizeText(value);
}

function splitList(value) {
  return normalizeText(value)
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
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

function contributorSignals(contributor = {}, report) {
  const login = normalizeText(contributor.login || contributor.name);
  if (login) {
    report.trustSignals.push(
      `Contributor analyzed: ${githubUserReference(login)}`,
    );
  }

  const createdAt = Date.parse(contributor.created_at || contributor.createdAt);
  if (Number.isFinite(createdAt)) {
    const ageDays = Math.floor((Date.now() - createdAt) / 86_400_000);
    if (ageDays < 7) {
      addFlag(
        report,
        "high",
        "new_contributor_account",
        "Contributor account is less than 7 days old",
      );
    } else if (ageDays < 30) {
      addFlag(
        report,
        "medium",
        "young_contributor_account",
        "Contributor account is less than 30 days old",
      );
    } else {
      report.trustSignals.push(`Contributor account age: ${ageDays} days`);
    }
  }

  const publicRepos = Number(
    contributor.public_repos ?? contributor.publicRepos,
  );
  if (Number.isFinite(publicRepos) && publicRepos > 0) {
    report.trustSignals.push(`Contributor public repos: ${publicRepos}`);
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
  if (report.provenanceFindings.some((finding) => finding.id === id)) {
    return;
  }
  report.provenanceFindings.push({ id, severity, summary, detail, blocking });
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
    /\b(credential|password|cookie|session|token|wallet)\b[\s\S]{0,80}\b(steal|exfiltrat|harvest|dump)\b/i.test(
      text,
    ) ||
    /\b(steal|exfiltrat|harvest|dump)\b[\s\S]{0,80}\b(credential|password|cookie|session|token|wallet)\b/i.test(
      text,
    )
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

function finalizeReport(report, validationReport) {
  report.riskTier = tierFromFlags(report.reviewFlags);
  report.recommendedLabels = [RISK_LABEL_BY_TIER[report.riskTier]];
  report.recommendedAction = recommendedAction(
    report.riskTier,
    validationReport,
  );
  report.humanReviewNotes = riskNotes(report);
  report.labelDefinitions = SUBMISSION_RISK_LABEL_DEFINITIONS;
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
    pullRequestActor: null,
    riskTier: "low",
    reviewFlags: [],
    trustSignals: [],
    sourceUrls: [],
    classificationWarnings: [],
    recommendedLabels: [],
    recommendedAction: "maintainer_review",
    humanReviewNotes: [],
    labelDefinitions: SUBMISSION_RISK_LABEL_DEFINITIONS,
  };
}

export function analyzeIssueSubmissionRisk(
  issue = {},
  validationReport = null,
  options = {},
) {
  const fields = validationReport?.fields ?? {};
  const text = [issue.title, issue.body, Object.values(fields).join("\n")].join(
    "\n",
  );
  const report = baseReport({
    type: "issue",
    number: issueNumber(issue),
    title: normalizeText(issue.title),
    url: issueUrl(issue),
    author: issueAuthor(issue),
    labels: labelsFromIssue(issue),
    category: validationReport?.category || fields.category || "",
    slug: fields.slug || "",
  });
  const contributor = options.contributor || issue.user || issue.author || {};
  const contributorLogin = normalizeText(contributor.login || contributor.name);
  if (contributorLogin) {
    report.provenanceStatus = "passed";
    report.effectiveContributor = {
      login: contributorLogin,
      htmlUrl: normalizeText(contributor.html_url || contributor.url),
    };
    report.contributorSource = "issue_author";
  }

  addSchemaSignals(report, validationReport);
  addSourceSignals(report, fields, text);
  addContentRiskSignals(report, fields, text);
  addToolListingClassificationSignals(report, fields, text);
  contributorSignals(contributor, report);

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
  };
}

function frontmatterProvenance(data = {}) {
  const submissionIssueNumber = Number(data.submissionIssueNumber);
  const importPrNumber = Number(data.importPrNumber);
  return {
    submittedBy: normalizeText(data.submittedBy),
    submittedByUrl: normalizeText(data.submittedByUrl),
    submissionIssueNumber:
      Number.isInteger(submissionIssueNumber) && submissionIssueNumber > 0
        ? submissionIssueNumber
        : null,
    submissionIssueUrl: normalizeText(data.submissionIssueUrl),
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
  const hasRootReadmeChange = files.some(
    (file) =>
      normalizeText(file.filename).toLowerCase() === "readme.md" &&
      normalizeText(file.status) !== "removed",
  );
  if (!hasRootReadmeChange || !contentFiles.length) return;
  if (sourceType !== "external_direct") return;

  addClassificationWarning(
    report,
    "generated_readme_change",
    "README.md changes are not accepted in direct content PRs; maintainer automation regenerates README output",
    "Remove README.md from the contributor PR. CI regenerates it for validation, and the post-merge README Refresh PR owns committed updates.",
  );
}

function prSourceType(input = {}) {
  if (input.sourceType) return normalizeText(input.sourceType);
  const headRef = normalizeText(input.pullRequest?.head?.ref);
  if (/^automation\/submission-\d+-/.test(headRef)) return "automation_import";
  return "direct_pr";
}

function contributorSummary(contributor = {}) {
  const login = normalizeText(contributor.login || contributor.name);
  if (!login) return null;
  return {
    login,
    htmlUrl: normalizeText(contributor.html_url || contributor.url),
    id: contributor.id ?? null,
  };
}

function issueContributorMap(input = {}) {
  const map = new Map();
  const contributors = Array.isArray(input.submissionIssueContributors)
    ? input.submissionIssueContributors
    : [];
  for (const item of contributors) {
    const issueNumberValue = Number(item.issueNumber || item.issue?.number);
    if (!Number.isInteger(issueNumberValue) || issueNumberValue <= 0) continue;
    map.set(issueNumberValue, {
      issue: item.issue || {},
      contributor: item.contributor || item.issue?.user || {},
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

function issueUrlMatchesNumber(url, number) {
  const text = normalizeText(url);
  if (!text) return false;
  try {
    const parts = new URL(text).pathname.split("/").filter(Boolean);
    const issuesIndex = parts.indexOf("issues");
    return issuesIndex >= 0 && parts[issuesIndex + 1] === String(number);
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

  const issuesByNumber = issueContributorMap(input);
  const contributorsByLogin = frontmatterContributorMap(input);
  let contributorSource =
    sourceType === "automation_import"
      ? "submission_issue_author"
      : sourceType === "external_direct"
        ? "pull_request_author"
        : "pull_request_or_maintainer";
  let effectiveContributor =
    sourceType === "automation_import"
      ? null
      : contributorSummary(input.contributor || input.pullRequest?.user || {});

  if (sourceType === "automation_import") {
    const issueNumbers = [
      ...new Set(
        entries
          .map((entry) => entry.provenance.submissionIssueNumber)
          .filter(Boolean),
      ),
    ];
    if (issueNumbers.length === 1) {
      effectiveContributor = contributorSummary(
        issuesByNumber.get(issueNumbers[0])?.contributor || {},
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

  if (!effectiveContributor) {
    effectiveContributor = contributorSummary(input.contributor || {});
  }

  report.effectiveContributor = effectiveContributor;
  report.contributorSource = contributorSource;

  if (sourceType === "automation_import") {
    for (const entry of entries) {
      const provenance = entry.provenance;
      const required = [
        ["submittedBy", provenance.submittedBy],
        ["submittedByUrl", provenance.submittedByUrl],
        ["submissionIssueNumber", provenance.submissionIssueNumber],
        ["submissionIssueUrl", provenance.submissionIssueUrl],
      ].filter(([, value]) => !value);

      if (required.length) {
        addProvenanceFinding(
          report,
          "error",
          `missing_import_provenance_${entry.filename}`,
          "Automation import content is missing required issue provenance",
          `${entry.filename}: ${required.map(([field]) => field).join(", ")}`,
        );
        continue;
      }

      const issueContributor = issuesByNumber.get(
        provenance.submissionIssueNumber,
      )?.contributor;
      const issueLogin = normalizeText(issueContributor?.login);
      if (!issueLogin) {
        addProvenanceFinding(
          report,
          "error",
          `missing_issue_contributor_${provenance.submissionIssueNumber}`,
          "Could not resolve the original issue submitter for import provenance",
          `Issue #${provenance.submissionIssueNumber}`,
        );
      } else if (!sameGitHubLogin(provenance.submittedBy, issueLogin)) {
        addProvenanceFinding(
          report,
          "error",
          `import_submitter_mismatch_${entry.filename}`,
          "Imported content submitter does not match the linked issue author",
          `${entry.filename}: submittedBy=${provenance.submittedBy}, issueAuthor=${issueLogin}`,
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
        provenance.submissionIssueUrl &&
        !issueUrlMatchesNumber(
          provenance.submissionIssueUrl,
          provenance.submissionIssueNumber,
        )
      ) {
        addProvenanceFinding(
          report,
          "error",
          `import_issue_url_mismatch_${entry.filename}`,
          "Imported content submission issue URL does not match submissionIssueNumber",
          `${entry.filename}: ${provenance.submissionIssueUrl}`,
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
      .map((entry) => entry.provenance.submissionIssueNumber)
      .filter(Boolean);
    for (const issueNumberValue of [...new Set(issues)]) {
      report.trustSignals.push(`Submission issue: #${issueNumberValue}`);
    }
  }
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
    author: normalizeText(
      input.contributor?.login ||
        input.pullRequest?.user?.login ||
        input.author,
    ),
    sourceType,
    contentFiles: contentFiles.map((file) => file.filename),
  });

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
      parsed = matter(content);
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
    entries.push({ filename: file.filename, fields, provenance });
    report.trustSignals.push(`Content file: ${file.filename}`);
    addSourceSignals(report, fields, content);
    addContentRiskSignals(report, fields, content);
    addToolListingClassificationSignals(report, fields, content);
  }

  validatePrProvenance(report, entries, input, sourceType);
  contributorSignals(
    report.effectiveContributor ||
      input.contributor ||
      input.pullRequest?.user ||
      {},
    report,
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
    `- Recommended labels: ${report.recommendedLabels.map((label) => `\`${label}\``).join(", ") || "none"}`,
  ];

  if (report.provenanceStatus && report.provenanceStatus !== "not_applicable") {
    lines.push("", "### Provenance");
    lines.push(`- Status: \`${report.provenanceStatus}\``);
    if (report.effectiveContributor?.login) {
      lines.push(
        `- Contributor analyzed: ${githubUserReference(report.effectiveContributor.login)}`,
      );
    }
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
    if (report.contributorSource) {
      lines.push(`- Contributor source: \`${report.contributorSource}\``);
    }
    for (const provenance of report.contentProvenance || []) {
      const parts = [];
      if (provenance.submittedBy) {
        parts.push(`by ${githubUserReference(provenance.submittedBy)}`);
      }
      if (provenance.submissionIssueNumber) {
        parts.push(`via issue #${provenance.submissionIssueNumber}`);
      } else if (provenance.importPrNumber) {
        parts.push(`via PR #${provenance.importPrNumber}`);
      }
      if (parts.length) {
        lines.push(`- ${provenance.filename}: ${parts.join(" ")}`);
      }
    }
    for (const finding of report.provenanceFindings || []) {
      const detail = finding.detail
        ? ` - ${compactWhitespace(finding.detail)}`
        : "";
      lines.push(
        `- \`${finding.severity}\` ${finding.summary} (\`${finding.id}\`)${detail}`,
      );
    }
  }

  if (report.reviewFlags.length) {
    lines.push("", "### Review flags");
    for (const flag of report.reviewFlags) {
      const detail = flag.detail ? ` - ${compactWhitespace(flag.detail)}` : "";
      lines.push(
        `- \`${flag.severity}\` ${flag.summary} (\`${flag.id}\`)${detail}`,
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
      const detail = warning.detail
        ? ` - ${compactWhitespace(warning.detail)}`
        : "";
      lines.push(`- ${warning.summary} (\`${warning.id}\`)${detail}`);
    }
  }

  if (report.trustSignals.length) {
    lines.push("", "### Trust signals");
    for (const signal of report.trustSignals.slice(0, 12)) {
      lines.push(`- ${compactWhitespace(signal)}`);
    }
  }

  if (report.humanReviewNotes.length) {
    lines.push("", "### Maintainer notes");
    for (const note of report.humanReviewNotes) {
      lines.push(`- ${note}`);
    }
  }

  return `${lines.join("\n")}\n`;
}
