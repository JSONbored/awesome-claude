export const LABELS = {
  underReview: "submission-under-review",
  requestChanges: "submission-needs-changes",
  manual: "submission-manual-review",
  close: "submission-closed-by-gate",
  importOpen: "import-pr-open",
  superseded: "superseded-by-import-pr",
} as const;

export const PILOT_LABEL = "submission-gate-pilot";

export const REVIEWABLE_PR_ACTIONS = new Set([
  "opened",
  "synchronize",
  "reopened",
  "ready_for_review",
]);

export const REVIEWABLE_ISSUE_ACTIONS = new Set(["opened", "edited", "reopened", "labeled"]);

export const REVIEWABLE_COMMENT_ACTIONS = new Set(["created"]);

export const DEFAULT_REVIEW_MARKER = "<!-- heyclaude-submission-gate -->";
