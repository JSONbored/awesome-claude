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
  import: "Accepted for maintainer import.",
  request_changes: "Changes requested.",
  close: "Closed by the submission gate.",
  manual: "Routed to manual maintainer review.",
  ignore: "No gate action needed.",
};

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

  return [marker, headline, "", decision.summary].join("\n");
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
