export const LABELS = {
  underReview: "submission-under-review",
  requestChanges: "submission-needs-changes",
  manual: "submission-manual-review",
  close: "submission-closed-by-gate",
  merged: "submission-merged-by-gate",
} as const;

export const PILOT_LABEL = "submission-gate-pilot";
export const CONTENT_CATEGORY_LABEL_PREFIX = "category:";

type ReviewablePrAction =
  | "opened"
  | "synchronize"
  | "reopened"
  | "ready_for_review";

export const REVIEWABLE_PR_ACTIONS: ReadonlySet<string> =
  new Set<ReviewablePrAction>([
    "opened",
    "synchronize",
    "reopened",
    "ready_for_review",
  ]);

export const DEFAULT_REVIEW_MARKER = "<!-- heyclaude-submission-gate -->";
