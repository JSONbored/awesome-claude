export const SUBMISSION_BASE_LABELS = ["content-submission", "needs-review"];
export const SUBMISSION_NEEDS_AUTHOR_INPUT_LABEL = "needs-author-input";
export const SUBMISSION_SOURCE_NEEDS_VERIFICATION_LABEL =
  "source-needs-verification";
export const SUBMISSION_STALE_LABEL = "stale-submission";
export const SUBMISSION_RISK_LOW_LABEL = "risk-low";
export const SUBMISSION_RISK_MEDIUM_LABEL = "risk-medium";
export const SUBMISSION_RISK_HIGH_LABEL = "risk-high";
export const SUBMISSION_PROTECTED_REVIEW_LABELS = [
  "accepted",
  "import-approved",
  "import-pr-open",
];
export const SUBMISSION_MANAGED_VALIDATION_LABELS = [
  SUBMISSION_NEEDS_AUTHOR_INPUT_LABEL,
  SUBMISSION_SOURCE_NEEDS_VERIFICATION_LABEL,
  SUBMISSION_STALE_LABEL,
];
export const SUBMISSION_RISK_LABELS = [
  SUBMISSION_RISK_LOW_LABEL,
  SUBMISSION_RISK_MEDIUM_LABEL,
  SUBMISSION_RISK_HIGH_LABEL,
];

export const SUBMISSION_VALIDATION_LABEL_DEFINITIONS = {
  [SUBMISSION_NEEDS_AUTHOR_INPUT_LABEL]: {
    color: "b60205",
    description:
      "Submission needs changes from the author before review can continue",
  },
  [SUBMISSION_SOURCE_NEEDS_VERIFICATION_LABEL]: {
    color: "d93f0b",
    description:
      "Submission source, package, or canonical URL needs maintainer verification",
  },
  [SUBMISSION_STALE_LABEL]: {
    color: "cfd3d7",
    description:
      "Submission has been waiting on author input past the reminder window",
  },
};

export const SUBMISSION_RISK_LABEL_DEFINITIONS = {
  [SUBMISSION_RISK_LOW_LABEL]: {
    color: "0e8a16",
    description:
      "Automated submission security/safety review found only low-risk signals",
  },
  [SUBMISSION_RISK_MEDIUM_LABEL]: {
    color: "fbca04",
    description:
      "Automated submission security/safety review found signals that need maintainer review",
  },
  [SUBMISSION_RISK_HIGH_LABEL]: {
    color: "d93f0b",
    description:
      "Automated submission security/safety review found high-risk or critical signals",
  },
};

export const COMMUNITY_CATEGORY_LABELS = {
  agents: "community-agents",
  collections: "community-collections",
  commands: "community-commands",
  guides: "guide",
  hooks: "community-hooks",
  mcp: "community-mcp",
  rules: "community-rules",
  skills: "skills",
  statuslines: "community-statuslines",
};

export function submissionLabelsForCategory(category) {
  return [
    "content-submission",
    COMMUNITY_CATEGORY_LABELS[category] || category,
  ].filter(Boolean);
}

export function recommendedLabelsForCategory(category) {
  return [
    ...SUBMISSION_BASE_LABELS,
    COMMUNITY_CATEGORY_LABELS[category] || category,
  ].filter(Boolean);
}
