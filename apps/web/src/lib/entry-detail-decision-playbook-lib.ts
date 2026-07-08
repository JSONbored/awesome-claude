/**
 * Pure decision-playbook helpers for entry detail pages.
 *
 * Converts trust metadata + compare-tray context into concrete "next step"
 * guidance so users can decide quickly without scanning every section.
 */

import type { Entry, TrustLevel } from "@/types/registry";
import { sameEntry } from "@/lib/entry-identity";

export type DecisionChecklistTone = "complete" | "warning" | "critical";

export type DecisionChecklistItem = {
  id: string;
  label: string;
  detail: string;
  done: boolean;
  required: boolean;
};

export type DecisionPlaybookSection = {
  id: string;
  title: string;
  tone: DecisionChecklistTone;
  summary: string;
  items: DecisionChecklistItem[];
};

export type DecisionCompareContext = {
  selectedCount: number;
  inCompareTray: boolean;
  baselineTitle: string | null;
  baselineScore: number | null;
  currentScore: number;
  scoreDelta: number | null;
  divergingSignals: string[];
};

export type EntryDetailDecisionPlaybookState = {
  heading: string;
  summary: string;
  compare: DecisionCompareContext;
  sections: DecisionPlaybookSection[];
  showEscalationCallout: boolean;
  escalationText: string | null;
};

const TRUST_RANK: Record<TrustLevel, number> = {
  trusted: 4,
  review: 3,
  limited: 2,
  blocked: 1,
};

function hasSafetyNotes(entry: Pick<Entry, "safetyNotes" | "safetyNotesList">): boolean {
  return Boolean(entry.safetyNotes || entry.safetyNotesList?.length);
}

function hasPrivacyNotes(entry: Pick<Entry, "privacyNotes" | "privacyNotesList">): boolean {
  return Boolean(entry.privacyNotes || entry.privacyNotesList?.length);
}

function hasInstallPayload(
  entry: Pick<Entry, "installCommand" | "configSnippet" | "fullCopy" | "copySnippet">,
): boolean {
  return Boolean(
    entry.installCommand || entry.configSnippet || entry.fullCopy || entry.copySnippet,
  );
}

function hasPackageSignals(
  entry: Pick<Entry, "packageVerified" | "downloadSha256" | "downloadUrl">,
) {
  return Boolean(entry.packageVerified !== undefined || entry.downloadSha256 || entry.downloadUrl);
}

function isSourceBacked(entry: Pick<Entry, "source" | "sourceUrl">): boolean {
  return entry.source !== "unverified" || Boolean(entry.sourceUrl);
}

export function entryDecisionTrustScore(entry: Entry): number {
  let score = TRUST_RANK[entry.trust] * 10;
  if (entry.reviewed || entry.reviewedBy) score += 15;
  if (hasSafetyNotes(entry)) score += 10;
  if (hasPrivacyNotes(entry)) score += 10;
  if (isSourceBacked(entry)) score += 10;
  if (hasPackageSignals(entry)) score += 8;
  if (entry.claimed) score += 4;
  if (hasInstallPayload(entry)) score += 3;
  return score;
}

function decisionHeading(entry: Entry): string {
  if (entry.trust === "blocked") return "Do not install before manual review";
  if (entry.trust === "limited") return "Evaluate carefully before using";
  if (entry.trust === "review") return "Review trust signals before you adopt";
  return "Ready to evaluate for your workflow";
}

function decisionSummary(entry: Entry): string {
  if (entry.trust === "blocked") {
    return "This listing is marked blocked. Treat all install/copy actions as high risk until source and behavior are manually verified.";
  }
  if (entry.trust === "limited") {
    return "Trust metadata is partial. Compare provenance, package details, and safety notes before moving forward.";
  }
  if (entry.trust === "review") {
    return "Signals are present but mixed. Use the checklist below to confirm the source and operational safety for your environment.";
  }
  return "Signals are comparatively strong, but you should still validate source, privacy posture, and package provenance for your environment.";
}

function divergenceLabels(current: Entry, baseline: Entry): string[] {
  const labels: string[] = [];
  if (
    Boolean(current.reviewed || current.reviewedBy) !==
    Boolean(baseline.reviewed || baseline.reviewedBy)
  ) {
    labels.push("review status");
  }
  if (current.source !== baseline.source) labels.push("source provenance");
  if (Boolean(current.packageVerified) !== Boolean(baseline.packageVerified))
    labels.push("package verification");
  if (Boolean(current.claimed) !== Boolean(baseline.claimed)) labels.push("submitter claim");
  if (hasSafetyNotes(current) !== hasSafetyNotes(baseline)) labels.push("safety notes");
  if (hasPrivacyNotes(current) !== hasPrivacyNotes(baseline)) labels.push("privacy notes");
  return labels;
}

function selectBaselinePeer(entry: Entry, compareEntries: Entry[]): Entry | null {
  const peers = compareEntries.filter((candidate) => !sameEntry(candidate, entry));
  if (peers.length === 0) return null;
  return peers
    .slice()
    .sort((left, right) => entryDecisionTrustScore(right) - entryDecisionTrustScore(left))[0];
}

export function entryDecisionCompareContext(
  entry: Entry,
  compareEntries: Entry[],
): DecisionCompareContext {
  const baseline = selectBaselinePeer(entry, compareEntries);
  const currentScore = entryDecisionTrustScore(entry);
  const scoreDelta = baseline ? currentScore - entryDecisionTrustScore(baseline) : null;
  return {
    selectedCount: compareEntries.length,
    inCompareTray: compareEntries.some((candidate) => sameEntry(candidate, entry)),
    baselineTitle: baseline?.title ?? null,
    baselineScore: baseline ? entryDecisionTrustScore(baseline) : null,
    currentScore,
    scoreDelta,
    divergingSignals: baseline ? divergenceLabels(entry, baseline) : [],
  };
}

function checklistTone(items: DecisionChecklistItem[]): DecisionChecklistTone {
  const requiredRemaining = items.some((item) => item.required && !item.done);
  if (requiredRemaining) return "critical";
  const optionalRemaining = items.some((item) => !item.done);
  if (optionalRemaining) return "warning";
  return "complete";
}

function sourceChecklist(entry: Entry): DecisionPlaybookSection {
  const items: DecisionChecklistItem[] = [
    {
      id: "source-linked",
      label: "Source link available",
      detail: entry.sourceUrl
        ? "Open the canonical repository and verify ownership."
        : "No source URL is listed on this entry.",
      done: Boolean(entry.sourceUrl),
      required: true,
    },
    {
      id: "source-backed",
      label: "Source provenance status",
      detail:
        entry.source !== "unverified"
          ? `Marked as ${entry.source}.`
          : "Still marked unverified; treat claims as unconfirmed.",
      done: entry.source !== "unverified",
      required: true,
    },
    {
      id: "reviewed",
      label: "Metadata reviewed",
      detail:
        entry.reviewed || entry.reviewedBy
          ? "Registry metadata indicates a reviewed listing."
          : "No reviewed flag detected in metadata.",
      done: Boolean(entry.reviewed || entry.reviewedBy),
      required: false,
    },
  ];
  return {
    id: "source",
    title: "Source and provenance checks",
    tone: checklistTone(items),
    summary: "Confirm ownership and provenance before trusting install instructions.",
    items,
  };
}

function safetyChecklist(entry: Entry): DecisionPlaybookSection {
  const items: DecisionChecklistItem[] = [
    {
      id: "safety",
      label: "Safety notes present",
      detail: hasSafetyNotes(entry)
        ? "Review the listed safety guidance before running commands."
        : "No safety notes listed.",
      done: hasSafetyNotes(entry),
      required: true,
    },
    {
      id: "privacy",
      label: "Privacy notes present",
      detail: hasPrivacyNotes(entry)
        ? "Review data handling notes before connecting accounts or secrets."
        : "No privacy notes listed.",
      done: hasPrivacyNotes(entry),
      required: true,
    },
    {
      id: "risk",
      label: "Trust level risk gate",
      detail:
        entry.trust === "blocked"
          ? "Blocked trust level requires manual validation before any usage."
          : entry.trust === "limited"
            ? "Limited trust level requires additional due diligence."
            : "Trust level does not block evaluation.",
      done: entry.trust !== "blocked",
      required: true,
    },
  ];
  return {
    id: "safety",
    title: "Safety and privacy checks",
    tone: checklistTone(items),
    summary: "Validate risk disclosures before installation or API wiring.",
    items,
  };
}

function packageChecklist(entry: Entry): DecisionPlaybookSection {
  const items: DecisionChecklistItem[] = [
    {
      id: "installable",
      label: "Install payload available",
      detail: hasInstallPayload(entry)
        ? "Install or copy payload is available for review."
        : "No install payload is present in this listing.",
      done: hasInstallPayload(entry),
      required: false,
    },
    {
      id: "package-verified",
      label: "Package verification flag",
      detail:
        entry.packageVerified === true
          ? "Package marked verified."
          : entry.packageVerified === false
            ? "Package explicitly marked unverified."
            : "No package verification flag provided.",
      done: entry.packageVerified === true,
      required: false,
    },
    {
      id: "sha256",
      label: "Checksum metadata",
      detail: entry.downloadSha256
        ? "SHA-256 hash is present."
        : "No checksum provided for downloaded artifact.",
      done: Boolean(entry.downloadSha256),
      required: false,
    },
  ];
  return {
    id: "package",
    title: "Package and install checks",
    tone: checklistTone(items),
    summary: "Check package metadata and artifact integrity signals.",
    items,
  };
}

function compareChecklist(compare: DecisionCompareContext): DecisionPlaybookSection {
  const hasCompare = compare.selectedCount >= 2;
  const hasBaseline = Boolean(compare.baselineTitle);
  const hasDivergence = compare.divergingSignals.length > 0;
  const items: DecisionChecklistItem[] = [
    {
      id: "compare-active",
      label: "Compare tray has multiple entries",
      detail: hasCompare
        ? `${compare.selectedCount} entries selected.`
        : "Add at least one more entry to compare trust differences.",
      done: hasCompare,
      required: false,
    },
    {
      id: "baseline",
      label: "Baseline comparison available",
      detail: hasBaseline
        ? `Compared against ${compare.baselineTitle}.`
        : "No baseline peer selected yet.",
      done: hasBaseline,
      required: false,
    },
    {
      id: "divergence",
      label: "Diverging trust signals identified",
      detail: hasDivergence
        ? `Signals differ on ${compare.divergingSignals.join(", ")}.`
        : "No major trust-signal divergence found.",
      done: hasDivergence,
      required: false,
    },
  ];
  return {
    id: "compare",
    title: "Compare-driven decision checks",
    tone: checklistTone(items),
    summary: "Use compare context to validate trade-offs before adoption.",
    items,
  };
}

function escalationText(entry: Entry, sections: DecisionPlaybookSection[]): string | null {
  if (entry.trust === "blocked") {
    return "Blocked trust listing: do not run install or config commands until manual source review is complete.";
  }
  const criticalOutstanding = sections.some((section) =>
    section.items.some((item) => item.required && !item.done),
  );
  if (criticalOutstanding) {
    return "Required checks are still incomplete. Finish source and safety verification before adopting this resource.";
  }
  return null;
}

export function entryDetailDecisionPlaybookState(
  entry: Entry,
  compareEntries: Entry[],
): EntryDetailDecisionPlaybookState {
  const compare = entryDecisionCompareContext(entry, compareEntries);
  const sections = [
    sourceChecklist(entry),
    safetyChecklist(entry),
    packageChecklist(entry),
    compareChecklist(compare),
  ];
  const escalation = escalationText(entry, sections);
  return {
    heading: decisionHeading(entry),
    summary: decisionSummary(entry),
    compare,
    sections,
    showEscalationCallout: Boolean(escalation),
    escalationText: escalation,
  };
}
