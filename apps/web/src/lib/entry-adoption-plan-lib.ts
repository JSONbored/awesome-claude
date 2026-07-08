/**
 * Pure entry adoption-plan helpers.
 *
 * Builds scenario-specific adoption steps for the detail page so users can
 * decide how aggressively to adopt an entry based on trust and compare context.
 */

import type { Entry } from "@/types/registry";
import { sameEntry } from "@/lib/entry-identity";

export type AdoptionPlanPresetId =
  | "pilot-fast"
  | "balanced-rollout"
  | "strict-security"
  | "reference-only";

export type AdoptionPlanPreset = {
  id: AdoptionPlanPresetId;
  label: string;
  description: string;
};

export type AdoptionPlanStep = {
  id: string;
  title: string;
  detail: string;
  required: boolean;
  done: boolean;
  severity: "ok" | "warn" | "critical";
};

export type AdoptionPlanStage = {
  id: string;
  title: string;
  summary: string;
  steps: AdoptionPlanStep[];
};

export type EntryAdoptionPlanState = {
  preset: AdoptionPlanPreset;
  heading: string;
  summary: string;
  compareSummary: string | null;
  riskScore: number;
  stages: AdoptionPlanStage[];
  blockers: string[];
};

export const ENTRY_ADOPTION_PLAN_PRESETS: AdoptionPlanPreset[] = [
  {
    id: "pilot-fast",
    label: "Pilot fast",
    description: "Validate quickly in a sandbox and ship with guardrails.",
  },
  {
    id: "balanced-rollout",
    label: "Balanced rollout",
    description: "Use staged verification before team-wide adoption.",
  },
  {
    id: "strict-security",
    label: "Strict security",
    description: "Require full trust and provenance checks before usage.",
  },
  {
    id: "reference-only",
    label: "Reference only",
    description: "Keep for research; avoid operational integration.",
  },
];

function hasSafety(entry: Pick<Entry, "safetyNotes" | "safetyNotesList">): boolean {
  return Boolean(entry.safetyNotes || entry.safetyNotesList?.length);
}

function hasPrivacy(entry: Pick<Entry, "privacyNotes" | "privacyNotesList">): boolean {
  return Boolean(entry.privacyNotes || entry.privacyNotesList?.length);
}

function hasInstallPayload(
  entry: Pick<Entry, "installCommand" | "configSnippet" | "fullCopy" | "copySnippet">,
): boolean {
  return Boolean(
    entry.installCommand || entry.configSnippet || entry.fullCopy || entry.copySnippet,
  );
}

function sourceBacked(entry: Pick<Entry, "source" | "sourceUrl">): boolean {
  return entry.source !== "unverified" || Boolean(entry.sourceUrl);
}

function packageReady(entry: Pick<Entry, "packageVerified" | "downloadSha256">): boolean {
  return entry.packageVerified === true || Boolean(entry.downloadSha256);
}

function reviewed(entry: Pick<Entry, "reviewed" | "reviewedBy">): boolean {
  return Boolean(entry.reviewed || entry.reviewedBy);
}

function trustRiskPenalty(entry: Pick<Entry, "trust">): number {
  if (entry.trust === "blocked") return 40;
  if (entry.trust === "limited") return 22;
  if (entry.trust === "review") return 10;
  return 0;
}

export function entryAdoptionRiskScore(entry: Entry): number {
  let score = trustRiskPenalty(entry);
  if (!sourceBacked(entry)) score += 16;
  if (!hasSafety(entry)) score += 14;
  if (!hasPrivacy(entry)) score += 14;
  if (!reviewed(entry)) score += 8;
  if (!packageReady(entry)) score += 6;
  if (!hasInstallPayload(entry)) score += 4;
  return Math.min(100, score);
}

function stepSeverity(required: boolean, done: boolean): "ok" | "warn" | "critical" {
  if (done) return "ok";
  return required ? "critical" : "warn";
}

function stage(
  title: string,
  summary: string,
  steps: AdoptionPlanStep[],
  id: string,
): AdoptionPlanStage {
  return { id, title, summary, steps };
}

function prerequisiteSteps(entry: Entry, strict: boolean): AdoptionPlanStep[] {
  const sourceDone = sourceBacked(entry);
  const reviewedDone = reviewed(entry);
  const installDone = hasInstallPayload(entry);
  return [
    {
      id: "source",
      title: "Confirm source provenance",
      detail: sourceDone
        ? "Source URL/provenance metadata is present."
        : "Source is unverified. Confirm repository ownership manually.",
      required: true,
      done: sourceDone,
      severity: stepSeverity(true, sourceDone),
    },
    {
      id: "reviewed",
      title: "Confirm metadata review state",
      detail: reviewedDone
        ? "Listing has review metadata."
        : "No review metadata found; increase manual validation.",
      required: strict,
      done: reviewedDone,
      severity: stepSeverity(strict, reviewedDone),
    },
    {
      id: "payload",
      title: "Verify install payload",
      detail: installDone
        ? "Install/config payload exists and can be inspected."
        : "No install payload available; treat as reference guidance only.",
      required: false,
      done: installDone,
      severity: stepSeverity(false, installDone),
    },
  ];
}

function safetySteps(entry: Entry, strict: boolean): AdoptionPlanStep[] {
  const safetyDone = hasSafety(entry);
  const privacyDone = hasPrivacy(entry);
  const packageDone = packageReady(entry);
  return [
    {
      id: "safety",
      title: "Review safety notes",
      detail: safetyDone
        ? "Safety notes are present."
        : "Safety notes missing; review source code paths before execution.",
      required: true,
      done: safetyDone,
      severity: stepSeverity(true, safetyDone),
    },
    {
      id: "privacy",
      title: "Review privacy notes",
      detail: privacyDone
        ? "Privacy notes are present."
        : "Privacy notes missing; inspect network/data behavior manually.",
      required: true,
      done: privacyDone,
      severity: stepSeverity(true, privacyDone),
    },
    {
      id: "package",
      title: "Verify package integrity metadata",
      detail: packageDone
        ? "Package verification/checksum metadata is available."
        : "No package verification/checksum metadata.",
      required: strict,
      done: packageDone,
      severity: stepSeverity(strict, packageDone),
    },
  ];
}

function rolloutSteps(entry: Entry, preset: AdoptionPlanPresetId): AdoptionPlanStep[] {
  if (preset === "reference-only") {
    return [
      {
        id: "reference",
        title: "Use as reference only",
        detail:
          "Keep this entry for comparison and research. Avoid install/integration in production.",
        required: true,
        done: true,
        severity: "ok",
      },
    ];
  }

  const strict = preset === "strict-security";
  const fast = preset === "pilot-fast";
  return [
    {
      id: "sandbox",
      title: "Run in isolated sandbox first",
      detail: fast
        ? "Run one pilot task in a disposable environment."
        : "Use a constrained sandbox and observe behavior across multiple tasks.",
      required: true,
      done: false,
      severity: "critical",
    },
    {
      id: "team-rollout",
      title: "Roll out gradually",
      detail: strict
        ? "Require sign-off before team rollout."
        : "Roll out to a small cohort before wider usage.",
      required: true,
      done: false,
      severity: "critical",
    },
    {
      id: "monitoring",
      title: "Set monitoring and fallback",
      detail: "Define rollback path and monitor errors after adoption.",
      required: false,
      done: false,
      severity: "warn",
    },
  ];
}

function presetHeading(preset: AdoptionPlanPresetId): string {
  if (preset === "pilot-fast") return "Fast pilot adoption plan";
  if (preset === "balanced-rollout") return "Balanced adoption plan";
  if (preset === "strict-security") return "Strict security adoption plan";
  return "Reference-only usage plan";
}

function presetSummary(preset: AdoptionPlanPresetId, riskScore: number): string {
  if (preset === "reference-only") {
    return "Avoid operational use and keep this entry as a reference baseline for compare decisions.";
  }
  if (preset === "strict-security") {
    return `Current risk score ${riskScore}/100. Require all critical checks before any rollout.`;
  }
  if (preset === "pilot-fast") {
    return `Current risk score ${riskScore}/100. Move quickly, but keep sandbox and rollback controls in place.`;
  }
  return `Current risk score ${riskScore}/100. Use staged verification before broader rollout.`;
}

function compareSummary(entry: Entry, compareEntries: Entry[]): string | null {
  if (compareEntries.length < 2) return null;
  const peers = compareEntries.filter((candidate) => !sameEntry(candidate, entry));
  if (peers.length === 0) return null;
  const bestPeer = peers
    .slice()
    .sort((left, right) => entryAdoptionRiskScore(left) - entryAdoptionRiskScore(right))[0];
  const delta = entryAdoptionRiskScore(entry) - entryAdoptionRiskScore(bestPeer);
  if (delta <= 0) {
    return `Lower or equal risk than ${bestPeer.title} in current compare selection (${delta}).`;
  }
  return `Higher risk than ${bestPeer.title} by ${delta} points; complete additional checks before adoption.`;
}

export function entryAdoptionPlanState(
  entry: Entry,
  preset: AdoptionPlanPresetId,
  compareEntries: Entry[],
): EntryAdoptionPlanState {
  const riskScore = entryAdoptionRiskScore(entry);
  const strict = preset === "strict-security";
  const blockers: string[] = [];
  if (entry.trust === "blocked") blockers.push("Trust level is blocked.");
  if (!sourceBacked(entry)) blockers.push("Source provenance is unverified.");
  if (!hasSafety(entry)) blockers.push("Safety notes are missing.");
  if (!hasPrivacy(entry)) blockers.push("Privacy notes are missing.");

  const stages: AdoptionPlanStage[] = [
    stage(
      "Pre-adoption checks",
      "Validate source and review signals before any execution.",
      prerequisiteSteps(entry, strict),
      "prereq",
    ),
    stage(
      "Security checks",
      "Confirm safety, privacy, and package integrity signals.",
      safetySteps(entry, strict),
      "security",
    ),
    stage(
      "Rollout",
      "Adopt in controlled steps based on the selected plan.",
      rolloutSteps(entry, preset),
      "rollout",
    ),
  ];

  const selectedPreset =
    ENTRY_ADOPTION_PLAN_PRESETS.find((item) => item.id === preset) ??
    ENTRY_ADOPTION_PLAN_PRESETS[0];

  return {
    preset: selectedPreset,
    heading: presetHeading(selectedPreset.id),
    summary: presetSummary(selectedPreset.id, riskScore),
    compareSummary: compareSummary(entry, compareEntries),
    riskScore,
    stages,
    blockers,
  };
}
