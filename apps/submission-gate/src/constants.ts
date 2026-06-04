export const LABELS = {
  underReview: "submission-under-review",
  manual: "submission-manual-review",
  close: "submission-closed-by-gate",
  merged: "submission-merged-by-gate",
} as const;

export const CONTENT_CATEGORY_LABEL_PREFIX = "category:";

type ReviewablePrAction =
  | "edited"
  | "opened"
  | "synchronize"
  | "reopened"
  | "ready_for_review";

export const REVIEWABLE_PR_ACTIONS: ReadonlySet<string> =
  new Set<ReviewablePrAction>([
    "edited",
    "opened",
    "synchronize",
    "reopened",
    "ready_for_review",
  ]);

export const DEFAULT_REVIEW_MARKER = "<!-- heyclaude-submission-gate -->";
