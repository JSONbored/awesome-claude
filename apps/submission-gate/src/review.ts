import { DEFAULT_REVIEW_MARKER, LABELS } from "./constants";

export const GATE_DECISION_SCHEMA_VERSION = 2;
export const GATE_COMMENT_FORMATTER_VERSION = 5;
export const DEFAULT_AUTO_MERGE_CONFIDENCE_FLOOR = 0.85;
const DEFAULT_CLEAN_MERGE_CONFIDENCE_FLOOR = 0.75;
const HEYCLAUDE_SITE_URL = "https://heyclau.de";
const HEYCLAUDE_REPO_URL = "https://github.com/JSONbored/awesome-claude";
const HEYCLAUDE_FORK_URL = "https://github.com/JSONbored/awesome-claude/fork";
const SHARE_TITLE =
  "HeyClaude - source-backed Claude and AI workflow directory";
const SHARE_TEXT =
  "I just used HeyClaude's maintainer gate for source-backed Claude and AI workflow submissions. It keeps the directory useful, practical, and reviewable.";

export type GateVerdict =
  | "merge"
  | "request_changes"
  | "close"
  | "manual"
  | "ignore";

export type GateDecisionV2Verdict = Exclude<GateVerdict, "request_changes">;

export type GateDecisionSectionStatus = "pass" | "warn" | "fail" | "info";

export type GateDecisionSection = {
  id: string;
  title?: string;
  status?: GateDecisionSectionStatus;
  bullets: string[];
};

export type GateDecisionCheck = {
  name: string;
  status: "passed" | "pending" | "failed" | "neutral" | "skipped" | "unknown";
  details?: string;
};

export type GateDecisionScope = {
  filePath?: string;
  category?: string;
  slug?: string;
  status?: string;
};

export type GateDecisionError = {
  code: string;
  retryable?: boolean;
  message?: string;
};

export type GateDecisionReasonCode =
  | "scope_failure"
  | "validation_failure"
  | "provenance_failure"
  | "protected_metadata_edit"
  | "strict_duplicate"
  | "source_hard_failure"
  | "commercial_listing_route"
  | "embedded_secret"
  | "unsafe_install_pipeline"
  | "malicious_data_theft"
  | "prohibited_content"
  | "policy_fit_failure";

export type GateDecisionEvidence = {
  ruleId?: string;
  snippet?: string;
  behavior?: string;
  policy?: string;
  source?: string;
  fix?: string;
  whyNotDefensive?: string;
};

export type GateDecision = {
  verdict: GateVerdict;
  summary: string;
  labels: string[];
  close?: boolean;
  reasonCode?: GateDecisionReasonCode;
  evidence?: GateDecisionEvidence[];
  schemaVersion?: typeof GATE_DECISION_SCHEMA_VERSION;
  confidence?: number;
  scope?: GateDecisionScope;
  checks?: GateDecisionCheck[];
  sections?: GateDecisionSection[];
  errors?: GateDecisionError[];
  decisionId?: string;
  sourceEvidenceHash?: string;
};

export type GateDecisionV2 = GateDecision & {
  schemaVersion: typeof GATE_DECISION_SCHEMA_VERSION;
  verdict: GateDecisionV2Verdict;
  confidence: number;
  checks: GateDecisionCheck[];
  sections: GateDecisionSection[];
};

const V1_GATE_VERDICTS = new Set<GateVerdict>([
  "merge",
  "request_changes",
  "close",
  "manual",
  "ignore",
]);
const V2_GATE_VERDICTS = new Set<GateDecisionV2Verdict>([
  "merge",
  "close",
  "manual",
  "ignore",
]);
const CLOSE_REASON_CODES = new Set<GateDecisionReasonCode>([
  "scope_failure",
  "validation_failure",
  "provenance_failure",
  "protected_metadata_edit",
  "strict_duplicate",
  "source_hard_failure",
  "commercial_listing_route",
  "embedded_secret",
  "unsafe_install_pipeline",
  "malicious_data_theft",
  "prohibited_content",
  "policy_fit_failure",
]);
const SAFETY_CLOSE_REASON_CODES = new Set<GateDecisionReasonCode>([
  "embedded_secret",
  "unsafe_install_pipeline",
  "malicious_data_theft",
  "prohibited_content",
]);

const RETRYABLE_PRIVATE_REVIEW_CODES = new Set([
  "invalid_private_response",
  "private_reviewer_unavailable",
  "github_rate_limited",
  "source_evidence_timeout",
]);

const VERDICT_HEADLINES: Record<GateVerdict, string> = {
  merge: "Accepted and merged",
  request_changes: "Needs changes",
  close: "Closed by gate",
  manual: "Manual review needed",
  ignore: "Ignored",
};

const VERDICT_ALERTS: Record<GateVerdict, string> = {
  merge: "TIP",
  request_changes: "WARNING",
  close: "CAUTION",
  manual: "IMPORTANT",
  ignore: "NOTE",
};

const VERDICT_ACTIONS: Record<GateVerdict, string> = {
  merge: "Accepted by the maintainer gate.",
  request_changes: "Close and resubmit a clean one-file content PR.",
  close:
    "Close this PR and resubmit a clean one-file content PR if appropriate.",
  manual: "A maintainer needs to review this before automation continues.",
  ignore: "No content-gate action is required.",
};

const SECTION_TITLES: Record<string, string> = {
  summary: "Summary",
  recommended_action: "Recommended Action",
  confidence_review: "Confidence Review",
  ci: "CI",
  scope: "Scope",
  source_review: "Source Review",
  source: "Source Review",
  duplicate_history: "Duplicate and History Review",
  duplicate: "Duplicate and History Review",
  safety_privacy: "Safety and Privacy",
  safety: "Safety and Privacy",
  privacy: "Safety and Privacy",
  factual_editorial_issues: "Factual and Editorial Issues",
  validation_review: "Validation Review",
  security_review: "Security Review",
  required_shape: "Required Shape",
  merge_result: "Merge Result",
  one_shot_review: "One-shot Review",
  decision_evidence: "Decision Evidence",
  raw_evidence: "Raw Evidence",
};

const DETAILS_SECTION_ORDER = [
  "confidence_review",
  "source_review",
  "duplicate_history",
  "safety_privacy",
  "factual_editorial_issues",
  "ci",
  "scope",
  "validation_review",
  "security_review",
  "required_shape",
  "merge_result",
  "one_shot_review",
  "decision_evidence",
  "raw_evidence",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cleanText(value: unknown) {
  return String(value || "").trim();
}

function normalizeSummary(value: unknown) {
  if (Array.isArray(value)) {
    return value.map(cleanText).filter(Boolean).join("\n");
  }
  return cleanText(value);
}

function normalizeLabels(value: unknown) {
  return Array.isArray(value) ? value.map(cleanText).filter(Boolean) : [];
}

function normalizeConfidence(value: unknown) {
  const confidence = Number(value);
  if (!Number.isFinite(confidence)) return null;
  if (confidence < 0 || confidence > 1) return null;
  return confidence;
}

function normalizeCheck(value: unknown): GateDecisionCheck | null {
  if (!isRecord(value)) return null;
  const name = cleanText(value.name);
  if (!name) return null;
  const rawStatus = cleanText(value.status).toLowerCase();
  const status = (
    ["passed", "pending", "failed", "neutral", "skipped", "unknown"].includes(
      rawStatus,
    )
      ? rawStatus
      : "unknown"
  ) as GateDecisionCheck["status"];
  return {
    name,
    status,
    details: cleanText(value.details) || undefined,
  };
}

function normalizeSection(value: unknown): GateDecisionSection | null {
  if (!isRecord(value)) return null;
  const id = sectionId(cleanText(value.id || value.title));
  if (!id) return null;
  const bullets = Array.isArray(value.bullets)
    ? value.bullets.map(cleanText).filter(Boolean)
    : normalizeSummary(value.bullets)
        .split("\n")
        .map(cleanText)
        .filter(Boolean);
  if (!bullets.length) return null;
  const rawStatus = cleanText(value.status).toLowerCase();
  const status = (
    ["pass", "warn", "fail", "info"].includes(rawStatus) ? rawStatus : "info"
  ) as GateDecisionSectionStatus;
  return {
    id,
    title: cleanText(value.title) || SECTION_TITLES[id],
    status,
    bullets,
  };
}

function normalizeError(value: unknown): GateDecisionError | null {
  if (!isRecord(value)) return null;
  const code = cleanText(value.code);
  if (!code) return null;
  return {
    code,
    retryable: value.retryable === true,
    message: cleanText(value.message) || undefined,
  };
}

function normalizeReasonCode(
  value: unknown,
): GateDecisionReasonCode | undefined {
  const code = cleanText(value) as GateDecisionReasonCode;
  return CLOSE_REASON_CODES.has(code) ? code : undefined;
}

function normalizeEvidence(value: unknown): GateDecisionEvidence | null {
  if (!isRecord(value)) return null;
  const evidence: GateDecisionEvidence = {
    ruleId: cleanText(value.ruleId) || undefined,
    snippet: cleanText(value.snippet) || undefined,
    behavior: cleanText(value.behavior) || undefined,
    policy: cleanText(value.policy) || undefined,
    source: cleanText(value.source) || undefined,
    fix: cleanText(value.fix) || undefined,
    whyNotDefensive: cleanText(value.whyNotDefensive) || undefined,
  };
  return Object.values(evidence).some(Boolean) ? evidence : null;
}

function evidenceHasConcreteDetail(evidence: GateDecisionEvidence[]) {
  return evidence.some((item) =>
    [
      item.snippet,
      item.behavior,
      item.policy,
      item.source,
      item.fix,
      item.whyNotDefensive,
    ].some(Boolean),
  );
}

function closeEvidenceContractError(params: {
  reasonCode?: GateDecisionReasonCode;
  evidence?: GateDecisionEvidence[];
}) {
  if (!params.reasonCode) {
    return "Private close decisions must include a supported reasonCode.";
  }
  const evidence = params.evidence || [];
  if (!evidence.length || !evidenceHasConcreteDetail(evidence)) {
    return "Private close decisions must include public-safe evidence.";
  }
  if (SAFETY_CLOSE_REASON_CODES.has(params.reasonCode)) {
    const hasRule = evidence.some((item) => item.ruleId);
    const hasMatchedBehavior = evidence.some(
      (item) => item.snippet || item.behavior,
    );
    const hasDefensiveAssessment = evidence.some(
      (item) => item.whyNotDefensive,
    );
    if (!hasRule || !hasMatchedBehavior || !hasDefensiveAssessment) {
      return "Private safety close decisions must include ruleId, matched behavior, and whyNotDefensive evidence.";
    }
  }
  return "";
}

function looksLikeGenericSafetyClose(summary: string) {
  return (
    /\bhard safety\b/i.test(summary) ||
    /\bsecret, package, or abuse gate\b/i.test(summary) ||
    /\bcontains patterns that cannot be accepted\b/i.test(summary) ||
    /\bcredential-theft,? or malware\/abuse pattern\b/i.test(summary) ||
    /\bmatched pattern is concrete enough\b/i.test(summary)
  );
}

export function privateReviewErrorDecision(
  reason: string,
  code: string,
  retryable = true,
) {
  return defaultManualDecision(reason, { code, retryable, message: reason });
}

export function isRetryableGateDecision(decision: GateDecision) {
  if (decision.verdict !== "manual") return false;
  if (
    decision.errors?.some(
      (error) =>
        error.retryable || RETRYABLE_PRIVATE_REVIEW_CODES.has(error.code),
    )
  ) {
    return true;
  }
  const summary = decision.summary.toLowerCase();
  return (
    summary.includes("could not determine the github app installation") ||
    summary.includes("ai maintainer review returned an unexpected payload") ||
    summary.includes("private corpus review request failed") ||
    summary.includes("private corpus review returned") ||
    summary.includes("private corpus review returned an unexpected payload")
  );
}

export function normalizePrivateGateDecisionPayload(raw: unknown): {
  decision?: GateDecision;
  error?: GateDecisionError;
} {
  if (!isRecord(raw)) {
    return {
      error: {
        code: "invalid_private_response",
        retryable: true,
        message: "Private corpus review returned an unexpected payload.",
      },
    };
  }

  if (raw.schemaVersion === GATE_DECISION_SCHEMA_VERSION) {
    const verdict = cleanText(raw.verdict) as GateDecisionV2Verdict;
    const confidence = normalizeConfidence(raw.confidence);
    const summary = normalizeSummary(raw.summary);
    const labels = normalizeLabels(raw.labels);
    const checks = Array.isArray(raw.checks)
      ? raw.checks
          .map(normalizeCheck)
          .filter((check): check is GateDecisionCheck => Boolean(check))
      : null;
    const sections = Array.isArray(raw.sections)
      ? raw.sections
          .map(normalizeSection)
          .filter((section): section is GateDecisionSection => Boolean(section))
      : null;
    const reasonCode = normalizeReasonCode(raw.reasonCode);
    const evidence = Array.isArray(raw.evidence)
      ? raw.evidence
          .map(normalizeEvidence)
          .filter((item): item is GateDecisionEvidence => Boolean(item))
      : undefined;

    if (
      !V2_GATE_VERDICTS.has(verdict) ||
      confidence === null ||
      !summary ||
      !checks ||
      !sections
    ) {
      return {
        error: {
          code: "invalid_private_response",
          retryable: true,
          message:
            "Private corpus review returned an invalid GateDecisionV2 payload.",
        },
      };
    }
    const closeContractError =
      verdict === "close"
        ? closeEvidenceContractError({ reasonCode, evidence })
        : "";
    if (closeContractError) {
      return {
        error: {
          code: "invalid_private_response",
          retryable: true,
          message: closeContractError,
        },
      };
    }

    const scope = isRecord(raw.scope)
      ? {
          filePath: cleanText(raw.scope.filePath) || undefined,
          category: cleanText(raw.scope.category) || undefined,
          slug: cleanText(raw.scope.slug) || undefined,
          status: cleanText(raw.scope.status) || undefined,
        }
      : undefined;
    const errors = Array.isArray(raw.errors)
      ? raw.errors
          .map(normalizeError)
          .filter((error): error is GateDecisionError => Boolean(error))
      : undefined;

    return {
      decision: {
        schemaVersion: GATE_DECISION_SCHEMA_VERSION,
        verdict,
        confidence,
        summary,
        labels,
        close: raw.close === true,
        reasonCode,
        evidence,
        checks,
        sections,
        scope,
        errors,
        decisionId: cleanText(raw.decisionId) || undefined,
        sourceEvidenceHash: cleanText(raw.sourceEvidenceHash) || undefined,
      },
    };
  }

  if (raw.schemaVersion !== undefined) {
    return {
      error: {
        code: "invalid_private_response",
        retryable: true,
        message:
          "Private corpus review returned an unsupported schema version.",
      },
    };
  }

  const verdict = cleanText(raw.verdict) as GateVerdict;
  if (!V1_GATE_VERDICTS.has(verdict)) {
    return {
      error: {
        code: "invalid_private_response",
        retryable: true,
        message: "Private corpus review returned an unexpected payload.",
      },
    };
  }
  const summary = normalizeSummary(raw.summary);
  const reasonCode = normalizeReasonCode(raw.reasonCode);
  const evidence = Array.isArray(raw.evidence)
    ? raw.evidence
        .map(normalizeEvidence)
        .filter((item): item is GateDecisionEvidence => Boolean(item))
    : undefined;
  if (
    verdict === "close" &&
    !reasonCode &&
    !evidence?.length &&
    looksLikeGenericSafetyClose(summary)
  ) {
    return {
      error: {
        code: "invalid_private_response",
        retryable: true,
        message:
          "Private safety close decisions must include public-safe evidence.",
      },
    };
  }
  return {
    decision: {
      verdict,
      summary,
      labels: normalizeLabels(raw.labels),
      close: raw.close === true,
      reasonCode,
      evidence,
      confidence: normalizeConfidence(raw.confidence) ?? undefined,
      sourceEvidenceHash: cleanText(raw.sourceEvidenceHash) || undefined,
    },
  };
}

function sectionId(value: string) {
  let id = "";
  const appendToken = (token: string) => {
    id += token;
  };
  const appendSeparator = () => {
    if (id && !id.endsWith("_")) id += "_";
  };

  for (const char of value.toLowerCase()) {
    if (char === "&") {
      appendToken("and");
    } else if ((char >= "a" && char <= "z") || (char >= "0" && char <= "9")) {
      appendToken(char);
    } else {
      appendSeparator();
    }
  }

  return id.endsWith("_") ? id.slice(0, -1) : id;
}

function sectionTitle(id: string, fallback?: string) {
  return fallback || SECTION_TITLES[id] || id.replace(/_/g, " ");
}

function splitLegacySummary(summary: string) {
  const sections: GateDecisionSection[] = [];
  let current: GateDecisionSection = {
    id: "summary",
    title: "Summary",
    status: "info",
    bullets: [],
  };
  const pushCurrent = () => {
    if (current.bullets.length) sections.push(current);
  };

  for (const line of summary.split("\n")) {
    const trimmed = line.trim();
    const heading = trimmed.match(/^(?:#{1,3}\s*)?([A-Za-z][A-Za-z0-9 /-]+):$/);
    if (heading) {
      const id = sectionId(heading[1]);
      if (SECTION_TITLES[id]) {
        pushCurrent();
        current = {
          id,
          title: SECTION_TITLES[id],
          status: "info",
          bullets: [],
        };
        continue;
      }
    }
    if (trimmed) current.bullets.push(trimmed);
  }
  pushCurrent();
  return sections;
}

function mergeDecisionSections(decision: GateDecision) {
  const structured = decision.sections?.length ? decision.sections : [];
  const legacy = splitLegacySummary(decision.summary);
  const seen = new Set<string>();
  const sections: GateDecisionSection[] = [];
  for (const section of [...structured, ...legacy]) {
    if (seen.has(section.id)) continue;
    seen.add(section.id);
    sections.push(section);
  }
  return sections;
}

function bulletsMarkdown(bullets: string[]) {
  return bullets
    .map((bullet) => {
      const trimmed = bullet.trim();
      if (!trimmed) return "";
      if (/^[-*]\s+/.test(trimmed) || /^\d+[.)]\s+/.test(trimmed)) {
        return trimmed;
      }
      return `- ${trimmed}`;
    })
    .filter(Boolean)
    .join("\n");
}

function confidenceText(value: number | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value))
    return "not applicable";
  return `${Math.round(value * 100)}%`;
}

function normalizedConfidenceFloor(value: number) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? Math.min(value, 1)
    : DEFAULT_AUTO_MERGE_CONFIDENCE_FLOOR;
}

function hasFailedChecks(decision: GateDecision) {
  return (decision.checks || []).some((check) =>
    ["failed", "error", "cancelled"].includes(check.status),
  );
}

function hasBlockingOrAmbiguousSections(decision: GateDecision) {
  return (decision.sections || []).some((section) =>
    ["fail", "warn"].includes(section.status),
  );
}

function mergeSummarySignalsAcceptance(summary: string) {
  const value = summary.toLowerCase();
  return (
    value.includes("no blocking") ||
    value.includes("none blocking") ||
    value.includes("recommend direct merge") ||
    value.includes("direct merge is recommended") ||
    value.includes("can be merged directly") ||
    value.includes("meets all repository policies")
  );
}

function mergeSummarySignalsAmbiguity(summary: string) {
  const value = summary.toLowerCase();
  const nonBlocking =
    value.includes("non-blocking") ||
    value.includes("not a blocker") ||
    value.includes("not blocking");
  if (nonBlocking) return false;
  return (
    value.includes("unresolved") ||
    value.includes("ambiguous") ||
    value.includes("could not verify") ||
    value.includes("contradictory") ||
    value.includes("manual review")
  );
}

function isCleanStructuredMergeDecision(
  decision: GateDecision,
  cleanFloor = DEFAULT_CLEAN_MERGE_CONFIDENCE_FLOOR,
) {
  return (
    decision.verdict === "merge" &&
    typeof decision.confidence === "number" &&
    Number.isFinite(decision.confidence) &&
    decision.confidence >= cleanFloor &&
    !(decision.errors || []).length &&
    !hasFailedChecks(decision) &&
    !hasBlockingOrAmbiguousSections(decision) &&
    mergeSummarySignalsAcceptance(decision.summary || "") &&
    !mergeSummarySignalsAmbiguity(decision.summary || "")
  );
}

function decisionConfidenceText(decision: GateDecision) {
  if (
    typeof decision.confidence === "number" &&
    Number.isFinite(decision.confidence)
  ) {
    return confidenceText(decision.confidence);
  }
  if (decision.verdict === "close" || decision.verdict === "request_changes") {
    return "rule-based";
  }
  return "not applicable";
}

function scopeText(scope?: GateDecisionScope) {
  if (!scope) return "not provided";
  const path = scope.filePath ? `\`${scope.filePath}\`` : "";
  const parts = [path, scope.category, scope.slug, scope.status]
    .filter(Boolean)
    .join(" · ");
  return parts || "not provided";
}

function checksSection(decision: GateDecision): GateDecisionSection | null {
  if (!decision.checks?.length) return null;
  return {
    id: "ci",
    title: "CI",
    status: decision.checks.some((check) => check.status === "failed")
      ? "fail"
      : decision.checks.some((check) => check.status === "pending")
        ? "warn"
        : "pass",
    bullets: decision.checks.map((check) =>
      [
        `${checkStatusLabel(check.status)} \`${check.status}\` ${check.name}`,
        check.details ? `- ${check.details}` : "",
      ]
        .filter(Boolean)
        .join(" "),
    ),
  };
}

function decisionEvidenceSection(
  decision: GateDecision,
): GateDecisionSection | null {
  const evidence = decision.evidence || [];
  if (!evidence.length) return null;
  const bullets = evidence
    .map((item) =>
      [
        item.ruleId ? `rule: \`${item.ruleId}\`` : "",
        item.policy ? `policy: ${item.policy}` : "",
        item.behavior ? `behavior: ${item.behavior}` : "",
        item.snippet ? `snippet: \`${item.snippet}\`` : "",
        item.source ? `source: ${item.source}` : "",
        item.fix ? `fix: ${item.fix}` : "",
        item.whyNotDefensive
          ? `why not defensive: ${item.whyNotDefensive}`
          : "",
      ]
        .filter(Boolean)
        .join("; "),
    )
    .filter(Boolean);
  if (!bullets.length) return null;
  return {
    id: "decision_evidence",
    title: "Decision Evidence",
    status:
      decision.verdict === "close" || decision.verdict === "request_changes"
        ? "fail"
        : "info",
    bullets,
  };
}

function sectionStatusLabel(status?: GateDecisionSectionStatus) {
  switch (status) {
    case "pass":
      return "✅ pass";
    case "warn":
      return "⚠️ review";
    case "fail":
      return "❌ blocked";
    default:
      return "ℹ️ info";
  }
}

function checkStatusLabel(status: GateDecisionCheck["status"]) {
  switch (status) {
    case "passed":
      return "✅";
    case "failed":
      return "❌";
    case "pending":
      return "⏳";
    case "neutral":
    case "skipped":
      return "⚠️";
    default:
      return "ℹ️";
  }
}

function confidenceStatusLabel(value: number | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "ℹ️";
  if (value >= DEFAULT_AUTO_MERGE_CONFIDENCE_FLOOR) return "✅";
  return "⚠️";
}

function verdictStatusLabel(verdict: GateVerdict) {
  switch (verdict) {
    case "merge":
      return "✅";
    case "close":
    case "request_changes":
      return "❌";
    case "manual":
      return "⚠️";
    default:
      return "ℹ️";
  }
}

function blockquote(text: string) {
  return text
    .split("\n")
    .map((line) => (line ? `> ${line}` : ">"))
    .join("\n");
}

function renderAlertCard(
  marker: string,
  alert: string,
  body: string[] | string,
) {
  const cardBody = Array.isArray(body) ? body.join("\n") : body;
  return [marker, `> [!${alert}]`, blockquote(cardBody)].join("\n").trim();
}

function renderDetails(section: GateDecisionSection) {
  const bullets = cleanSectionBullets(section);
  if (!bullets.length) return "";
  return [
    "<details>",
    `<summary><strong>${sectionStatusLabel(section.status)} · ${sectionTitle(section.id, section.title)}</strong></summary>`,
    "",
    bulletsMarkdown(bullets),
    "",
    "</details>",
  ].join("\n");
}

function renderDetailsBlock(title: string, bullets: string[]) {
  return [
    "<details>",
    `<summary><strong>${title}</strong></summary>`,
    "",
    bulletsMarkdown(bullets),
    "",
    "</details>",
  ].join("\n");
}

function shareUrl(baseUrl: string, params: Record<string, string>) {
  const search = new URLSearchParams(params);
  return `${baseUrl}?${search.toString()}`;
}

function renderAttributionFooter() {
  const xUrl = shareUrl("https://twitter.com/intent/tweet", {
    text: SHARE_TEXT,
    url: HEYCLAUDE_SITE_URL,
  });
  const redditUrl = shareUrl("https://www.reddit.com/submit", {
    title: SHARE_TITLE,
    text: `${SHARE_TEXT} ${HEYCLAUDE_SITE_URL}`,
  });
  const linkedInUrl = shareUrl(
    "https://www.linkedin.com/sharing/share-offsite/",
    {
      url: HEYCLAUDE_SITE_URL,
      mini: "true",
      title: SHARE_TITLE,
      summary: SHARE_TEXT,
    },
  );

  return [
    `Thanks for using [HeyClaude](${HEYCLAUDE_SITE_URL}) to keep Claude and AI workflow submissions source-backed and useful. If this gate helped, consider starring or forking [JSONbored/awesome-claude](${HEYCLAUDE_REPO_URL}).`,
    "",
    "<details>",
    "<summary><strong>❤️ Share</strong></summary>",
    "",
    `- [X](${xUrl})`,
    `- [Reddit](${redditUrl})`,
    `- [LinkedIn](${linkedInUrl})`,
    `- [Fork HeyClaude](${HEYCLAUDE_FORK_URL})`,
    "",
    "</details>",
  ].join("\n");
}

function stripBulletMarker(value: string) {
  return value
    .trim()
    .replace(/^[-*]\s+/, "")
    .replace(/^\d+[.)]\s+/, "")
    .trim();
}

function normalizedBulletKey(value: string) {
  return stripBulletMarker(value)
    .replace(/^#{1,6}\s+/, "")
    .replace(/\*\*/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function isSectionLabelBullet(value: string, section?: GateDecisionSection) {
  const key = normalizedBulletKey(value).replace(/:$/, "");
  if (!key) return true;
  const id = sectionId(key);
  if (section && id === section.id) return true;
  return Boolean(SECTION_TITLES[id]);
}

function isDanglingLeadInBullet(value: string) {
  const key = normalizedBulletKey(value);
  return key.endsWith(":") && !key.includes("`") && key.length <= 80;
}

function isPreviewNoiseBullet(value: string) {
  const text = stripBulletMarker(value);
  return isDanglingLeadInBullet(value) || /^`[^`]+`$/.test(text);
}

function cleanSectionBullets(section: GateDecisionSection) {
  return section.bullets.filter(
    (bullet) => !isSectionLabelBullet(bullet, section),
  );
}

function sectionPreview(
  section: GateDecisionSection | undefined,
  limit: number,
) {
  if (!section) return [];
  return cleanSectionBullets(section)
    .filter((bullet) => !isPreviewNoiseBullet(bullet))
    .slice(0, limit);
}

function detailRemainderBullets(
  section: GateDecisionSection | undefined,
  preview: string[],
) {
  if (!section) return [];
  const previewKeys = new Set(preview.map(normalizedBulletKey));
  return cleanSectionBullets(section).filter(
    (bullet) => !previewKeys.has(normalizedBulletKey(bullet)),
  );
}

function reviewMetadataBullets(decision: GateDecision) {
  return [
    `${verdictStatusLabel(decision.verdict)} **Verdict:** \`${decision.verdict}\``,
    `${confidenceStatusLabel(decision.confidence)} **Confidence:** ${decisionConfidenceText(decision)}`,
    decision.reasonCode ? `ℹ️ **Reason:** \`${decision.reasonCode}\`` : "",
    `ℹ️ **Scope:** ${scopeText(decision.scope)}`,
    `ℹ️ **Formatter:** \`gate-comment-v${GATE_COMMENT_FORMATTER_VERSION}\``,
  ].filter(Boolean);
}

function renderDecisionComment(decision: GateDecision, marker: string) {
  const sections = mergeDecisionSections(decision);
  const summary = sections.find((section) => section.id === "summary");
  const recommended = sections.find(
    (section) => section.id === "recommended_action",
  );
  const checks = checksSection(decision);
  const evidence = decisionEvidenceSection(decision);
  const detailSections = [
    ...(checks ? [checks] : []),
    ...(evidence ? [evidence] : []),
    ...sections.filter(
      (section) =>
        section.id !== "summary" &&
        section.id !== "recommended_action" &&
        section.id !== "ci",
    ),
  ].sort((left, right) => {
    const leftIndex = DETAILS_SECTION_ORDER.indexOf(left.id);
    const rightIndex = DETAILS_SECTION_ORDER.indexOf(right.id);
    return (
      (leftIndex === -1 ? DETAILS_SECTION_ORDER.length : leftIndex) -
      (rightIndex === -1 ? DETAILS_SECTION_ORDER.length : rightIndex)
    );
  });

  const summaryPreview = sectionPreview(summary, 3);
  const recommendedPreview = sectionPreview(recommended, 2);
  const card = [
    `## ${verdictStatusLabel(decision.verdict)} ${VERDICT_HEADLINES[decision.verdict]}`,
    VERDICT_ACTIONS[decision.verdict],
    "",
    "**Status**",
    "",
    ...reviewMetadataBullets(decision),
    "",
  ];

  if (summaryPreview.length) {
    card.push("**Summary**", "", bulletsMarkdown(summaryPreview), "");
    if (detailRemainderBullets(summary, summaryPreview).length) {
      card.push(
        "- More review detail is collapsed below for maintainers and contributors who want the full evidence.",
        "",
      );
    }
  }

  if (recommendedPreview.length) {
    card.push(
      "**Recommended action**",
      "",
      bulletsMarkdown(recommendedPreview),
      "",
    );
  }

  const summaryRemainder = detailRemainderBullets(summary, summaryPreview);
  if (summary && summaryRemainder.length) {
    card.push(
      renderDetails({
        ...summary,
        title: "More Summary Detail",
        bullets: summaryRemainder,
      }),
      "",
    );
  }
  if (recommended && recommended.bullets.length > recommendedPreview.length) {
    const recommendedRemainder = detailRemainderBullets(
      recommended,
      recommendedPreview,
    );
    if (recommendedRemainder.length) {
      card.push(
        renderDetails({
          ...recommended,
          title: "More Recommended Action Detail",
          bullets: recommendedRemainder,
        }),
        "",
      );
    }
  }
  for (const section of detailSections) {
    const rendered = renderDetails(section);
    if (rendered) card.push(rendered, "");
  }

  const footer = singleShotFooter(decision.verdict);
  if (footer) {
    card.push(
      "---",
      renderDetailsBlock("Automation notes", footer.split(/\r?\n/)),
      "",
      renderAttributionFooter(),
    );
  }
  return renderAlertCard(marker, VERDICT_ALERTS[decision.verdict], card);
}

function singleShotFooter(verdict: GateVerdict) {
  if (verdict === "ignore") return "";
  if (verdict === "merge") {
    return [
      "Automated review by HeyClaude Maintainer Agent.",
      "",
      "This content-only PR passed content validation, Superagent, and private review. HeyClaude merges accepted source PRs directly; generated artifacts are produced at build/deploy time.",
    ].join("\n");
  }
  if (verdict === "manual") {
    return [
      "Automated review by HeyClaude Maintainer Agent.",
      "",
      "This content-only PR needs maintainer judgment before automation continues. Manual review can approve, merge, close, or recheck the submission.",
    ].join("\n");
  }
  return [
    "Automated review by HeyClaude Maintainer Agent.",
    "",
    "HeyClaude uses single-shot submission review for direct content PRs. Rejected PRs should be resubmitted as a new focused PR instead of iterated in place.",
  ].join("\n");
}

export function markerComment(
  decision?: GateDecision,
  marker = DEFAULT_REVIEW_MARKER,
) {
  if (!decision) {
    return renderAlertCard(marker, "NOTE", [
      "## ℹ️ Public validation running",
      "HeyClaude is checking this direct content submission before private review.",
      "",
      "**Progress**",
      "",
      "- ⏳ **Public validation:** `running`",
      "- ⏸️ **Private maintainer gate:** `waiting`",
      "",
      "<details>",
      "<summary><strong>What happens next</strong></summary>",
      "",
      "- Required validation checks must pass first.",
      "- The private gate then reviews category fit, source of truth, duplicate history, safety/privacy, provenance, and generated-artifact scope.",
      "- No contributor action is needed unless the gate posts a terminal decision.",
      "",
      "</details>",
    ]);
  }

  return renderDecisionComment(decision, marker);
}

export function retryingReviewComment(marker = DEFAULT_REVIEW_MARKER) {
  return renderAlertCard(marker, "IMPORTANT", [
    "## ⚠️ Review retrying",
    "Public validation is green, but the private reviewer returned a retryable infrastructure result.",
    "",
    "**Progress**",
    "",
    "- ✅ **Public validation:** `passed`",
    "- ⚠️ **Private maintainer gate:** `retrying`",
    "",
    "<details>",
    "<summary><strong>Contributor action</strong></summary>",
    "",
    "- No contributor action is needed yet.",
    "- The submission gate will retry automatically.",
    "",
    "</details>",
  ]);
}

export function supersededReviewComment(
  marker = DEFAULT_REVIEW_MARKER,
  canonicalUrl?: string,
) {
  return renderAlertCard(marker, "NOTE", [
    "## ℹ️ Superseded gate report",
    "A newer canonical HeyClaude maintainer-gate report replaced this comment.",
    "",
    canonicalUrl
      ? `Current report: ${canonicalUrl}`
      : "Current report: see the newest HeyClaude maintainer-gate comment on this PR.",
  ]);
}

export function approvalReviewBody(reportUrl?: string) {
  return [
    "Approved by HeyClaude Maintainer Agent.",
    "",
    reportUrl
      ? `Full gate report: ${reportUrl}`
      : "The full gate report is in the canonical HeyClaude maintainer-gate comment on this PR.",
  ].join("\n");
}

export function defaultManualDecision(
  reason = "Private corpus review is not configured.",
  error?: GateDecisionError,
): GateDecision {
  return {
    verdict: "manual" as const,
    summary: `${reason} A maintainer needs to review category fit, source of truth, duplicate history, safety/privacy notes, and provenance before merge.`,
    labels: [LABELS.manual],
    errors: error ? [error] : undefined,
  };
}

export function enforceAutoMergeConfidenceFloor(
  decision: GateDecision,
  floor = DEFAULT_AUTO_MERGE_CONFIDENCE_FLOOR,
): GateDecision {
  if (decision.verdict !== "merge") return decision;
  const normalizedFloor = normalizedConfidenceFloor(floor);
  if (
    typeof decision.confidence === "number" &&
    Number.isFinite(decision.confidence) &&
    decision.confidence >= normalizedFloor
  ) {
    return decision;
  }
  if (isCleanStructuredMergeDecision(decision)) {
    return decision;
  }

  const confidenceSummary = [
    `Private reviewer confidence was ${confidenceText(decision.confidence)}; unattended merge floor is ${confidenceText(normalizedFloor)}.`,
    "Manual maintainer review is required before merge.",
  ];
  const confidenceSection: GateDecisionSection = {
    id: "confidence_review",
    title: "Confidence Review",
    status: "warn",
    bullets: confidenceSummary,
  };
  const summary = [
    decision.summary.trim(),
    "",
    "Confidence Review:",
    ...confidenceSummary.map((item) => `- ${item}`),
  ]
    .filter(Boolean)
    .join("\n");

  return {
    ...decision,
    verdict: "manual",
    summary,
    labels: [
      ...new Set([
        ...decision.labels.filter(
          (label) => label !== LABELS.merged && label !== LABELS.close,
        ),
        LABELS.manual,
      ]),
    ],
    close: false,
    sections: [
      confidenceSection,
      ...(decision.sections || []).filter(
        (section) => section.id !== "confidence_review",
      ),
    ],
    errors: [
      ...(decision.errors || []),
      {
        code: "low_private_review_confidence",
        retryable: false,
        message: confidenceSummary[0],
      },
    ],
  };
}

export function validationFailedDecision(summary: string): GateDecision {
  return {
    verdict: "close" as const,
    reasonCode: "validation_failure",
    evidence: [
      {
        ruleId: "validation_failure",
        behavior: summary,
        fix: "Fix public validation failures before private review can run.",
      },
    ],
    summary: `${summary} The private content review will run after the public validation lane is green.`,
    labels: [LABELS.close],
    close: true,
  };
}
