import { DEFAULT_REVIEW_MARKER, LABELS } from "./constants";

export type GateVerdict =
  | "import"
  | "request_changes"
  | "close"
  | "manual"
  | "ignore";

export type GateDecision = {
  verdict: GateVerdict;
  summary: string;
  labels: string[];
  close?: boolean;
  importJob?: Record<string, unknown>;
};

const VERDICT_HEADLINES: Record<GateVerdict, string> = {
  import: "Verdict: Accepted for import",
  request_changes: "Verdict: Request changes",
  close: "Verdict: Close",
  manual: "Verdict: Manual review",
  ignore: "Verdict: Ignore",
};

function singleShotFooter(verdict: GateVerdict) {
  if (verdict === "ignore") return "";
  if (verdict === "import") {
    return [
      "---",
      "Automated review by HeyClaude Maintainer Agent.",
      "",
      "This source PR passed the private review gate and was accepted for maintainer-owned import. Generated artifacts and full repository validation run on the import PR, which still requires normal checks and manual maintainer merge.",
    ].join("\n");
  }
  return [
    "---",
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
      "Thanks for the submission. The public validation lane is running now.",
      "",
      "After the required validation checks are green, the private submission gate will review category fit, source of truth, duplicate history, safety/privacy, provenance, and generated-artifact scope.",
    ].join("\n");
  }

  const headline = VERDICT_HEADLINES[decision.verdict];
  const footer = singleShotFooter(decision.verdict);

  const parts = [marker, headline, "", decision.summary.trim()];
  if (footer) {
    parts.push("", footer);
  }
  return parts.join("\n");
}

export function defaultManualDecision(
  reason = "Private corpus review is not configured.",
): GateDecision {
  return {
    verdict: "manual" as const,
    summary: `${reason} A maintainer needs to review category fit, source of truth, duplicate history, safety/privacy notes, and provenance before import.`,
    labels: [LABELS.manual],
  };
}

export function validationFailedDecision(summary: string): GateDecision {
  return {
    verdict: "request_changes" as const,
    summary: `${summary} The private content review will run after the public validation lane is green.`,
    labels: [LABELS.requestChanges],
  };
}
