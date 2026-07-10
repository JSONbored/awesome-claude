/**
 * Pure entry prerequisite-readiness helpers.
 *
 * Turns an entry's declared `prerequisites` strings into a categorized,
 * actionable pre-install checklist so users can line up accounts, installs,
 * config, permissions, and review gates before adopting a resource. Purely
 * scoped to the entry's own declared prerequisites — no risk scoring or
 * preset logic (that lives in the adoption-plan helpers).
 */

import type { Entry } from "@/types/registry";

export type PrerequisiteKind =
  | "account"
  | "install"
  | "config"
  | "permission"
  | "network"
  | "review"
  | "general";

export type PrerequisiteStep = {
  id: string;
  label: string;
  kind: PrerequisiteKind;
  kindLabel: string;
  hint: string;
};

export type PrerequisiteKindSummary = {
  kind: PrerequisiteKind;
  kindLabel: string;
  count: number;
};

export type EntryPrerequisiteReadinessState = {
  showPanel: boolean;
  heading: string;
  summary: string;
  steps: PrerequisiteStep[];
  kinds: PrerequisiteKindSummary[];
  total: number;
  setupTime: string | null;
  hasCredentialStep: boolean;
  hasReviewStep: boolean;
};

export const PREREQUISITE_KIND_LABEL: Record<PrerequisiteKind, string> = {
  account: "Account & credentials",
  install: "Install & runtime",
  config: "Configuration",
  permission: "Permissions & scopes",
  network: "Network & hosting",
  review: "Review & approval",
  general: "General",
};

const PREREQUISITE_KIND_HINT: Record<PrerequisiteKind, string> = {
  account: "Provision the account, plan, or API credentials before you start.",
  install: "Have the runtime, package, or deployment target ready to install.",
  config: "Gather the configuration values and connection details.",
  permission: "Confirm the required scopes, roles, or access grants.",
  network: "Prepare the network path, ports, or hosting endpoint.",
  review: "Complete this review or approval step with your team first.",
  general: "Confirm this requirement before setup.",
};

/**
 * Display order for the kind summary (distinct from the classification
 * precedence below).
 */
const KIND_DISPLAY_ORDER: PrerequisiteKind[] = [
  "account",
  "install",
  "config",
  "permission",
  "network",
  "review",
  "general",
];

/**
 * Classification precedence — first matching group wins. `account` and
 * `review` are checked early so credential and approval gates are surfaced
 * even when a line also mentions install or config details.
 */
const KIND_MATCHERS: Array<[PrerequisiteKind, string[]]> = [
  [
    "account",
    [
      "account",
      "sign up",
      "signup",
      "sign-up",
      "register",
      "api key",
      "api-key",
      "apikey",
      "token",
      "credential",
      "oauth",
      "subscription",
      "billing",
      "workspace",
      "tenant",
      "log in",
      "login",
    ],
  ],
  [
    "review",
    ["review", "audit", "approv", "compliance", "governance", "sign-off", "sign off", "assess"],
  ],
  [
    "permission",
    ["permission", "scope", "grant", "role", "authoriz", "access control", "allowlist", "consent"],
  ],
  ["network", ["network", "firewall", "port", "proxy", "vpc", "ingress", "egress", "whitelist ip"]],
  [
    "install",
    [
      "install",
      "docker",
      "kubernetes",
      "k8s",
      "npm",
      "pnpm",
      "pip",
      "node.js",
      "nodejs",
      "python",
      "runtime",
      "cli",
      "download",
      "binary",
      "deploy",
      "self-host",
      "self host",
      "hosting",
      "container",
    ],
  ],
  [
    "config",
    [
      "config",
      "environment variable",
      "env var",
      ".env",
      "setting",
      "endpoint",
      "connection string",
      "yaml",
      "toml",
      "webhook",
      "database",
      "schema",
      "integration",
    ],
  ],
];

/**
 * Classify a single prerequisite line into a readiness kind. Deterministic,
 * case-insensitive, first-match-wins; falls back to `general`.
 */
export function classifyPrerequisite(text: string): PrerequisiteKind {
  const value = text.toLowerCase();
  for (const [kind, needles] of KIND_MATCHERS) {
    if (needles.some((needle) => value.includes(needle))) {
      return kind;
    }
  }
  return "general";
}

function buildSummary(total: number, hasCredentialStep: boolean, hasReviewStep: boolean): string {
  if (total === 0) {
    return "No prerequisites declared — you can proceed straight to setup.";
  }
  const noun = total === 1 ? "prerequisite" : "prerequisites";
  let summary = `${total} ${noun} to line up before setup.`;
  if (hasCredentialStep) {
    summary += " Have accounts and credentials ready first.";
  }
  if (hasReviewStep) {
    summary += " Includes a review or approval gate.";
  }
  return summary;
}

/**
 * Build the prerequisite-readiness state for the detail page from an entry's
 * declared `prerequisites`. Blank lines are ignored and step ids are stable
 * (`prereq-1`, `prereq-2`, …) so client check state stays consistent.
 */
export function entryPrerequisiteReadinessState(entry: Entry): EntryPrerequisiteReadinessState {
  const raw = (entry.prerequisites ?? [])
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const steps: PrerequisiteStep[] = raw.map((label, index) => {
    const kind = classifyPrerequisite(label);
    return {
      id: `prereq-${index + 1}`,
      label,
      kind,
      kindLabel: PREREQUISITE_KIND_LABEL[kind],
      hint: PREREQUISITE_KIND_HINT[kind],
    };
  });

  const counts = new Map<PrerequisiteKind, number>();
  for (const step of steps) {
    counts.set(step.kind, (counts.get(step.kind) ?? 0) + 1);
  }

  const kinds: PrerequisiteKindSummary[] = KIND_DISPLAY_ORDER.filter((kind) =>
    counts.has(kind),
  ).map((kind) => ({
    kind,
    kindLabel: PREREQUISITE_KIND_LABEL[kind],
    count: counts.get(kind) ?? 0,
  }));

  const hasCredentialStep = counts.has("account");
  const hasReviewStep = counts.has("review");
  const trimmedSetup = entry.estimatedSetupTime?.trim();
  const setupTime = trimmedSetup ? trimmedSetup : null;

  return {
    showPanel: steps.length > 0,
    heading: "Prerequisite readiness",
    summary: buildSummary(steps.length, hasCredentialStep, hasReviewStep),
    steps,
    kinds,
    total: steps.length,
    setupTime,
    hasCredentialStep,
    hasReviewStep,
  };
}
