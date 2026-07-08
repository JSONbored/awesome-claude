import type { Entry } from "@/types/registry";

export type RolloutPresetId = "prototype" | "team" | "production";
export type RolloutChecklistTone = "complete" | "warning" | "blocked";

export type RolloutChecklistItem = {
  id: string;
  label: string;
  tone: RolloutChecklistTone;
  detail: string;
  required: boolean;
};

export type CompareRolloutEntryPlan = {
  entryRef: string;
  title: string;
  score: number;
  tier: "ready" | "review" | "hold";
  summary: string;
  blockers: string[];
  checklist: RolloutChecklistItem[];
};

export type CompareRolloutReadinessState = {
  preset: RolloutPresetId;
  heading: string;
  summary: string;
  comparedCount: number;
  plans: CompareRolloutEntryPlan[];
  trailingEntryRefs: string[];
  highestRiskRefs: string[];
};

type SignalMap = {
  source: boolean;
  reviewed: boolean;
  safety: boolean;
  privacy: boolean;
  package: boolean;
  install: boolean;
};

const PRESET_HEADING: Record<RolloutPresetId, string> = {
  prototype: "Prototype rollout readiness",
  team: "Team rollout readiness",
  production: "Production rollout readiness",
};

function entryRef(entry: Entry): string {
  return `${entry.category}/${entry.slug}`;
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

function hasSource(entry: Entry): boolean {
  return entry.source !== "unverified" || Boolean(entry.sourceUrl);
}

function hasReviewed(entry: Entry): boolean {
  return Boolean(entry.reviewed || entry.reviewedBy);
}

function signalMap(entry: Entry): SignalMap {
  return {
    source: hasSource(entry),
    reviewed: hasReviewed(entry),
    safety: hasSafety(entry),
    privacy: hasPrivacy(entry),
    package: hasPackage(entry),
    install: hasInstall(entry),
  };
}

function weightsForPreset(preset: RolloutPresetId): Record<keyof SignalMap, number> {
  if (preset === "prototype") {
    return { source: 24, reviewed: 12, safety: 18, privacy: 10, package: 8, install: 28 };
  }
  if (preset === "production") {
    return { source: 20, reviewed: 20, safety: 20, privacy: 14, package: 14, install: 12 };
  }
  return { source: 22, reviewed: 16, safety: 20, privacy: 12, package: 10, install: 20 };
}

function requiredByPreset(preset: RolloutPresetId): Record<keyof SignalMap, boolean> {
  if (preset === "prototype") {
    return {
      source: true,
      reviewed: false,
      safety: true,
      privacy: false,
      package: false,
      install: true,
    };
  }
  if (preset === "production") {
    return {
      source: true,
      reviewed: true,
      safety: true,
      privacy: true,
      package: true,
      install: true,
    };
  }
  return {
    source: true,
    reviewed: true,
    safety: true,
    privacy: false,
    package: false,
    install: true,
  };
}

function scorePlan(signals: SignalMap, preset: RolloutPresetId): number {
  const weights = weightsForPreset(preset);
  let score = 0;
  (Object.keys(weights) as (keyof SignalMap)[]).forEach((key) => {
    if (signals[key]) score += weights[key];
  });
  return score;
}

function tierFromScore(score: number): "ready" | "review" | "hold" {
  if (score >= 80) return "ready";
  if (score >= 55) return "review";
  return "hold";
}

function itemTone(signalPresent: boolean, required: boolean): RolloutChecklistTone {
  if (signalPresent) return "complete";
  return required ? "blocked" : "warning";
}

function detailForSignal(key: keyof SignalMap, present: boolean): string {
  if (present) {
    if (key === "source") return "Source provenance is documented.";
    if (key === "reviewed") return "Metadata review signal is present.";
    if (key === "safety") return "Safety notes are available.";
    if (key === "privacy") return "Privacy notes are available.";
    if (key === "package") return "Package integrity metadata is available.";
    return "Install payload is documented for execution.";
  }
  if (key === "source") return "No reliable source provenance listed.";
  if (key === "reviewed") return "No metadata review signal listed.";
  if (key === "safety") return "No safety notes listed.";
  if (key === "privacy") return "No privacy notes listed.";
  if (key === "package") return "No package verification/integrity metadata listed.";
  return "No install payload listed.";
}

function checklistForEntry(signals: SignalMap, preset: RolloutPresetId): RolloutChecklistItem[] {
  const required = requiredByPreset(preset);
  const labels: Record<keyof SignalMap, string> = {
    source: "Source provenance",
    reviewed: "Metadata reviewed",
    safety: "Safety notes",
    privacy: "Privacy notes",
    package: "Package integrity",
    install: "Install payload",
  };
  return (Object.keys(labels) as (keyof SignalMap)[]).map((key) => ({
    id: key,
    label: labels[key],
    required: required[key],
    tone: itemTone(signals[key], required[key]),
    detail: detailForSignal(key, signals[key]),
  }));
}

function blockersFromChecklist(items: RolloutChecklistItem[]): string[] {
  return items.filter((item) => item.tone === "blocked").map((item) => `${item.label} missing`);
}

function summaryForPlan(plan: {
  tier: "ready" | "review" | "hold";
  blockers: string[];
  score: number;
}): string {
  if (plan.tier === "ready") return `Ready to roll with score ${plan.score}.`;
  if (plan.tier === "hold") {
    if (plan.blockers.length > 0) {
      return `Hold rollout until blockers clear: ${plan.blockers.slice(0, 2).join(", ")}.`;
    }
    return `Hold rollout; insufficient trust evidence (score ${plan.score}).`;
  }
  if (plan.blockers.length > 0) {
    return `Review before rollout: ${plan.blockers.slice(0, 2).join(", ")}.`;
  }
  return `Needs review before rollout (score ${plan.score}).`;
}

function compareSummary(preset: RolloutPresetId, plans: CompareRolloutEntryPlan[]): string {
  if (plans.length === 0) return "Add entries to generate rollout readiness guidance.";
  const readyCount = plans.filter((plan) => plan.tier === "ready").length;
  const holdCount = plans.filter((plan) => plan.tier === "hold").length;
  if (preset === "prototype") {
    return `${readyCount}/${plans.length} entries are ready for quick prototype rollout.`;
  }
  if (preset === "production") {
    return `${holdCount} entries currently blocked for production rollout.`;
  }
  return `${readyCount} ready, ${holdCount} hold, ${plans.length - readyCount - holdCount} review.`;
}

export function compareRolloutReadinessState(
  entries: Entry[],
  preset: RolloutPresetId,
): CompareRolloutReadinessState {
  const plans: CompareRolloutEntryPlan[] = entries
    .map((entry) => {
      const signals = signalMap(entry);
      const checklist = checklistForEntry(signals, preset);
      const blockers = blockersFromChecklist(checklist);
      const score = scorePlan(signals, preset);
      const tier = tierFromScore(score);
      return {
        entryRef: entryRef(entry),
        title: entry.title,
        score,
        tier,
        blockers,
        checklist,
        summary: summaryForPlan({ tier, blockers, score }),
      };
    })
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));

  const trailingEntryRefs = plans.slice(-2).map((plan) => plan.entryRef);
  const highestRiskRefs = plans.filter((plan) => plan.tier === "hold").map((plan) => plan.entryRef);
  return {
    preset,
    heading: PRESET_HEADING[preset],
    summary: compareSummary(preset, plans),
    comparedCount: entries.length,
    plans,
    trailingEntryRefs,
    highestRiskRefs,
  };
}
