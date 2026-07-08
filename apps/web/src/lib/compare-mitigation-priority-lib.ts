import type { Entry } from "@/types/registry";

export type MitigationPriorityPresetId = "balanced" | "security-first" | "rollout-first";
export type MitigationPriorityTier = "urgent" | "watch" | "optional";
export type MitigationSignalId =
  | "source"
  | "reviewed"
  | "safety"
  | "privacy"
  | "package"
  | "install";

export type MitigationPriorityAction = {
  signalId: MitigationSignalId;
  label: string;
  detail: string;
  weight: number;
};

export type MitigationPriorityEntry = {
  entryRef: string;
  title: string;
  priorityScore: number;
  tier: MitigationPriorityTier;
  trust: string;
  actions: MitigationPriorityAction[];
  rationale: string;
};

export type CompareMitigationPriorityState = {
  preset: MitigationPriorityPresetId;
  heading: string;
  summary: string;
  entries: MitigationPriorityEntry[];
  urgentCount: number;
  watchCount: number;
  topEntryRef: string | null;
};

const SIGNAL_LABELS: Record<MitigationSignalId, string> = {
  source: "Source provenance",
  reviewed: "Metadata review",
  safety: "Safety notes",
  privacy: "Privacy notes",
  package: "Package integrity",
  install: "Install payload",
};

function hasSource(entry: Entry): boolean {
  return entry.source !== "unverified" || Boolean(entry.sourceUrl);
}

function hasReviewed(entry: Entry): boolean {
  return Boolean(entry.reviewed || entry.reviewedBy);
}

function hasSafety(entry: Entry): boolean {
  return Boolean(entry.safetyNotes || entry.safetyNotesList?.length);
}

function hasPrivacy(entry: Entry): boolean {
  return Boolean(entry.privacyNotes || entry.privacyNotesList?.length);
}

function hasPackage(entry: Entry): boolean {
  return entry.packageVerified === true || Boolean(entry.downloadSha256);
}

function hasInstall(entry: Entry): boolean {
  return Boolean(
    entry.installCommand || entry.configSnippet || entry.copySnippet || entry.fullCopy,
  );
}

function entryRef(entry: Entry): string {
  return `${entry.category}/${entry.slug}`;
}

function headingForPreset(preset: MitigationPriorityPresetId): string {
  if (preset === "security-first") return "Mitigation priority queue · security-first";
  if (preset === "rollout-first") return "Mitigation priority queue · rollout-first";
  return "Mitigation priority queue · balanced";
}

function weightsForPreset(preset: MitigationPriorityPresetId): Record<MitigationSignalId, number> {
  if (preset === "security-first") {
    return {
      source: 24,
      reviewed: 18,
      safety: 20,
      privacy: 18,
      package: 14,
      install: 6,
    };
  }
  if (preset === "rollout-first") {
    return {
      source: 12,
      reviewed: 10,
      safety: 12,
      privacy: 10,
      package: 8,
      install: 28,
    };
  }
  return {
    source: 18,
    reviewed: 14,
    safety: 16,
    privacy: 14,
    package: 12,
    install: 16,
  };
}

function trustPenalty(entry: Entry): number {
  if (entry.trust === "blocked") return 28;
  if (entry.trust === "limited") return 18;
  if (entry.trust === "review") return 8;
  return 0;
}

function tierFromScore(score: number): MitigationPriorityTier {
  if (score >= 70) return "urgent";
  if (score >= 40) return "watch";
  return "optional";
}

function actionDetail(signalId: MitigationSignalId): string {
  if (signalId === "source") return "Confirm repository or source URL before adoption.";
  if (signalId === "reviewed") return "Request maintainer review or internal metadata audit.";
  if (signalId === "safety") return "Collect safety notes and required guardrails.";
  if (signalId === "privacy") return "Document privacy posture and data handling.";
  if (signalId === "package") return "Verify package checksum or signed artifact metadata.";
  return "Capture install/config payload for reproducible rollout.";
}

function missingSignals(entry: Entry): MitigationSignalId[] {
  const missing: MitigationSignalId[] = [];
  if (!hasSource(entry)) missing.push("source");
  if (!hasReviewed(entry)) missing.push("reviewed");
  if (!hasSafety(entry)) missing.push("safety");
  if (!hasPrivacy(entry)) missing.push("privacy");
  if (!hasPackage(entry)) missing.push("package");
  if (!hasInstall(entry)) missing.push("install");
  return missing;
}

function rationaleForEntry(
  entry: Entry,
  actions: MitigationPriorityAction[],
  tier: MitigationPriorityTier,
): string {
  if (actions.length === 0) return "No blocking mitigation items detected.";
  if (tier === "urgent") {
    return `${actions.length} high-priority gaps require action before rollout.`;
  }
  if (tier === "watch") {
    return `${actions.length} mitigation items should be addressed in pilot phase.`;
  }
  return `${actions.length} optional improvements remain for ${entry.title}.`;
}

function summary(entries: MitigationPriorityEntry[]): string {
  if (entries.length === 0) return "Add entries to build a mitigation priority queue.";
  const urgent = entries.filter((entry) => entry.tier === "urgent").length;
  const watch = entries.filter((entry) => entry.tier === "watch").length;
  if (urgent === 0 && watch === 0) {
    return "All compared entries are in optional mitigation territory.";
  }
  if (urgent > 0) {
    return `${urgent} entries need urgent mitigation before deployment.`;
  }
  return `${watch} entries need watch-level mitigation during pilot rollout.`;
}

export function mitigationPriorityTierClass(tier: MitigationPriorityTier): string {
  if (tier === "urgent") return "border-trust-blocked/35 bg-trust-blocked/5 text-trust-blocked";
  if (tier === "watch") return "border-amber-500/35 bg-amber-500/5 text-amber-900";
  return "border-trust-trusted/35 bg-trust-trusted/5 text-trust-trusted";
}

export function compareMitigationPriorityState(
  entries: Entry[],
  preset: MitigationPriorityPresetId,
): CompareMitigationPriorityState {
  const weights = weightsForPreset(preset);
  const mapped: MitigationPriorityEntry[] = entries
    .map((entry) => {
      const gaps = missingSignals(entry);
      const actions: MitigationPriorityAction[] = gaps.map((signalId) => ({
        signalId,
        label: SIGNAL_LABELS[signalId],
        detail: actionDetail(signalId),
        weight: weights[signalId],
      }));
      const actionWeight = actions.reduce((sum, action) => sum + action.weight, 0);
      const priorityScore = Math.min(100, actionWeight + trustPenalty(entry));
      const tier = tierFromScore(priorityScore);
      return {
        entryRef: entryRef(entry),
        title: entry.title,
        priorityScore,
        tier,
        trust: entry.trust,
        actions,
        rationale: rationaleForEntry(entry, actions, tier),
      };
    })
    .sort(
      (a, b) =>
        b.priorityScore - a.priorityScore ||
        a.title.localeCompare(b.title) ||
        a.entryRef.localeCompare(b.entryRef),
    );

  return {
    preset,
    heading: headingForPreset(preset),
    summary: summary(mapped),
    entries: mapped,
    urgentCount: mapped.filter((entry) => entry.tier === "urgent").length,
    watchCount: mapped.filter((entry) => entry.tier === "watch").length,
    topEntryRef: mapped[0]?.entryRef ?? null,
  };
}
