import { DEFAULT_REVIEW_MARKER, LABELS } from "./constants";

export type GateVerdict = "import" | "request_changes" | "close" | "manual" | "ignore";

export type GateDecision = {
  verdict: GateVerdict;
  summary: string;
  labels: string[];
  close?: boolean;
  importJob?: Record<string, unknown>;
};

export function markerComment(decision?: GateDecision, marker = DEFAULT_REVIEW_MARKER) {
  if (!decision) {
    return [
      marker,
      "Thanks for the submission. The private submission gate is reviewing this now.",
      "",
      "You should see a decision here shortly. The gate may close hard failures, request one round of changes, route ambiguous entries to manual review, or open a maintainer-owned import PR.",
    ].join("\n");
  }

  const headline =
    decision.verdict === "import"
      ? "Accepted for maintainer import."
      : decision.verdict === "request_changes"
        ? "Changes requested."
        : decision.verdict === "close"
          ? "Closed by the submission gate."
          : decision.verdict === "manual"
            ? "Routed to manual maintainer review."
            : "No gate action needed.";

  return [marker, headline, "", decision.summary].join("\n");
}

export function defaultManualDecision(reason = "Private corpus review is not configured.") {
  return {
    verdict: "manual" as const,
    summary:
      `${reason} A maintainer needs to review category fit, source truth, duplicate history, safety/privacy notes, and provenance before import.`,
    labels: [LABELS.manual],
  };
}
