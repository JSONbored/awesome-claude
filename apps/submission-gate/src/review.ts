import { DEFAULT_REVIEW_MARKER, LABELS } from "./constants";

export const GATE_DECISION_SCHEMA_VERSION = 2;
export const GATE_COMMENT_FORMATTER_VERSION = 2;

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

export type GateDecision = {
  verdict: GateVerdict;
  summary: string;
  labels: string[];
  close?: boolean;
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
  raw_evidence: "Raw Evidence",
};

const DETAILS_SECTION_ORDER = [
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
  return {
    decision: {
      verdict,
      summary: normalizeSummary(raw.summary),
      labels: normalizeLabels(raw.labels),
      close: raw.close === true,
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

function escapeTableCell(value: unknown) {
  return String(value || "")
    .replace(/\\/g, "\\\\")
    .replace(/\|/g, "\\|")
    .replace(/\r?\n/g, " ")
    .trim();
}

function confidenceText(value: number | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value))
    return "not provided";
  return `${Math.round(value * 100)}%`;
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
        `\`${check.status}\` ${check.name}`,
        check.details ? `- ${check.details}` : "",
      ]
        .filter(Boolean)
        .join(" "),
    ),
  };
}

function renderDetails(section: GateDecisionSection) {
  return [
    "<details>",
    `<summary><strong>${sectionTitle(section.id, section.title)}</strong> · ${section.status || "info"}</summary>`,
    "",
    bulletsMarkdown(section.bullets),
    "",
    "</details>",
  ].join("\n");
}

function renderDecisionComment(decision: GateDecision, marker: string) {
  const sections = mergeDecisionSections(decision);
  const summary = sections.find((section) => section.id === "summary");
  const recommended = sections.find(
    (section) => section.id === "recommended_action",
  );
  const checks = checksSection(decision);
  const detailSections = [
    ...(checks ? [checks] : []),
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

  const parts = [
    marker,
    `> [!${VERDICT_ALERTS[decision.verdict]}]`,
    `> **${VERDICT_HEADLINES[decision.verdict]}**`,
    `> ${VERDICT_ACTIONS[decision.verdict]}`,
    "",
    "| Field | Result |",
    "| --- | --- |",
    `| Verdict | \`${escapeTableCell(decision.verdict)}\` |`,
    `| Confidence | ${escapeTableCell(confidenceText(decision.confidence))} |`,
    `| Scope | ${escapeTableCell(scopeText(decision.scope))} |`,
    `| Formatter | \`gate-comment-v${GATE_COMMENT_FORMATTER_VERSION}\` |`,
    "",
  ];

  if (summary?.bullets.length) {
    parts.push("## Summary", "", bulletsMarkdown(summary.bullets), "");
  }
  if (recommended?.bullets.length) {
    parts.push(
      "## Recommended Action",
      "",
      bulletsMarkdown(recommended.bullets),
      "",
    );
  }
  for (const section of detailSections) {
    parts.push(renderDetails(section), "");
  }

  const footer = singleShotFooter(decision.verdict);
  if (footer) parts.push("---", footer);
  return parts.join("\n").trim();
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
    return [
      marker,
      "> [!NOTE]",
      "> **Public validation running**",
      "> HeyClaude is checking this direct content submission before private review.",
      "",
      "| Stage | Status |",
      "| --- | --- |",
      "| Public validation | `pending` |",
      "| Private maintainer gate | `waiting` |",
      "",
      "<details>",
      "<summary><strong>What happens next</strong></summary>",
      "",
      "- Required validation checks must pass first.",
      "- The private gate then reviews category fit, source of truth, duplicate history, safety/privacy, provenance, and generated-artifact scope.",
      "- No contributor action is needed unless the gate posts a terminal decision.",
      "",
      "</details>",
    ].join("\n");
  }

  return renderDecisionComment(decision, marker);
}

export function retryingReviewComment(marker = DEFAULT_REVIEW_MARKER) {
  return [
    marker,
    "> [!IMPORTANT]",
    "> **Review retrying**",
    "> Public validation is green, but the private reviewer returned a retryable infrastructure result.",
    "",
    "| Stage | Status |",
    "| --- | --- |",
    "| Public validation | `passed` |",
    "| Private maintainer gate | `retrying` |",
    "",
    "<details>",
    "<summary><strong>Contributor action</strong></summary>",
    "",
    "- No contributor action is needed yet.",
    "- The submission gate will retry automatically.",
    "",
    "</details>",
  ].join("\n");
}

export function supersededReviewComment(
  marker = DEFAULT_REVIEW_MARKER,
  canonicalUrl?: string,
) {
  return [
    marker,
    "> [!NOTE]",
    "> **Superseded gate report**",
    "> A newer canonical HeyClaude maintainer-gate report replaced this comment.",
    "",
    canonicalUrl
      ? `Current report: ${canonicalUrl}`
      : "Current report: see the newest HeyClaude maintainer-gate comment on this PR.",
  ].join("\n");
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

export function validationFailedDecision(summary: string): GateDecision {
  return {
    verdict: "close" as const,
    summary: `${summary} The private content review will run after the public validation lane is green.`,
    labels: [LABELS.close],
    close: true,
  };
}
