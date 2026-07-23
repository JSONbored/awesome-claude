import type { Entry } from "@/types/registry";

export type BrowseAdoptionPresetId = "balanced" | "security-first" | "fast-pilot";
export type BrowseAdoptionTier = "ready" | "caution" | "hold";
export type BrowseAdoptionSignalId =
  | "source"
  | "reviewed"
  | "safety"
  | "privacy"
  | "package"
  | "install";

export type BrowseAdoptionQueueRow = {
  entryRef: string;
  title: string;
  trust: Entry["trust"];
  readinessScore: number;
  tier: BrowseAdoptionTier;
  blockers: string[];
  nextSteps: string[];
  confidence: number;
};

export type BrowseAdoptionQueueState = {
  preset: BrowseAdoptionPresetId;
  heading: string;
  summary: string;
  scannedCount: number;
  rows: BrowseAdoptionQueueRow[];
  readyCount: number;
  cautionCount: number;
  holdCount: number;
};

const SIGNAL_LABELS: Record<BrowseAdoptionSignalId, string> = {
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

function headingForPreset(preset: BrowseAdoptionPresetId): string {
  if (preset === "security-first") return "Browse adoption queue · security-first";
  if (preset === "fast-pilot") return "Browse adoption queue · fast pilot";
  return "Browse adoption queue · balanced";
}

function weightMap(preset: BrowseAdoptionPresetId): Record<BrowseAdoptionSignalId, number> {
  if (preset === "security-first") {
    return {
      source: 22,
      reviewed: 16,
      safety: 18,
      privacy: 16,
      package: 14,
      install: 8,
    };
  }
  if (preset === "fast-pilot") {
    return {
      source: 12,
      reviewed: 10,
      safety: 10,
      privacy: 8,
      package: 8,
      install: 22,
    };
  }
  return {
    source: 18,
    reviewed: 14,
    safety: 14,
    privacy: 12,
    package: 12,
    install: 14,
  };
}

function trustPenalty(entry: Entry): number {
  if (entry.trust === "blocked") return 26;
  if (entry.trust === "limited") return 16;
  if (entry.trust === "review") return 8;
  return 0;
}

function tierFromScore(score: number): BrowseAdoptionTier {
  if (score >= 75) return "ready";
  if (score >= 45) return "caution";
  return "hold";
}

function signalMap(entry: Entry): Record<BrowseAdoptionSignalId, boolean> {
  return {
    source: hasSource(entry),
    reviewed: hasReviewed(entry),
    safety: hasSafety(entry),
    privacy: hasPrivacy(entry),
    package: hasPackage(entry),
    install: hasInstall(entry),
  };
}

function blockersFromSignals(
  signals: Record<BrowseAdoptionSignalId, boolean>,
  preset: BrowseAdoptionPresetId,
): string[] {
  const required: BrowseAdoptionSignalId[] =
    preset === "security-first"
      ? ["source", "reviewed", "safety", "privacy", "package"]
      : preset === "fast-pilot"
        ? ["source", "install"]
        : ["source", "reviewed", "safety", "install"];
  return required.filter((id) => !signals[id]).map((id) => SIGNAL_LABELS[id]);
}

function stepForSignal(id: BrowseAdoptionSignalId): string {
  if (id === "source") return "Confirm repository/source URL and maintainer ownership.";
  if (id === "reviewed") return "Request metadata review from maintainers or internal owners.";
  if (id === "safety") return "Capture safety notes with misuse/guardrail guidance.";
  if (id === "privacy") return "Document privacy posture and data handling expectations.";
  if (id === "package") return "Collect package checksum or signed artifact information.";
  return "Add install/config payload for reproducible team rollout.";
}

function nextSteps(signals: Record<BrowseAdoptionSignalId, boolean>, blockers: string[]): string[] {
  const missing = (Object.keys(signals) as BrowseAdoptionSignalId[]).filter((id) => !signals[id]);
  const ordered = missing
    .sort((a, b) => {
      const blockerA = blockers.includes(SIGNAL_LABELS[a]) ? 0 : 1;
      const blockerB = blockers.includes(SIGNAL_LABELS[b]) ? 0 : 1;
      return blockerA - blockerB;
    })
    .slice(0, 3)
    .map((id) => stepForSignal(id));
  return ordered;
}

function confidenceScore(signals: Record<BrowseAdoptionSignalId, boolean>): number {
  const present = (Object.values(signals).filter(Boolean).length / 6) * 100;
  return Math.round(present);
}

function rowScore(
  entry: Entry,
  signals: Record<BrowseAdoptionSignalId, boolean>,
  preset: BrowseAdoptionPresetId,
): number {
  const weights = weightMap(preset);
  const achieved = (Object.keys(weights) as BrowseAdoptionSignalId[]).reduce((sum, id) => {
    return sum + (signals[id] ? weights[id] : 0);
  }, 0);
  const raw = achieved - trustPenalty(entry);
  return Math.max(0, Math.min(100, raw));
}

function summary(rows: BrowseAdoptionQueueRow[], scannedCount: number): string {
  if (rows.length === 0) return "Add visible results to generate an adoption queue.";
  const ready = rows.filter((row) => row.tier === "ready").length;
  const hold = rows.filter((row) => row.tier === "hold").length;
  if (hold > 0) {
    return `${hold}/${scannedCount} visible results are in hold tier and need mitigation before adoption.`;
  }
  return `${ready}/${scannedCount} visible results are ready for staged adoption under this preset.`;
}

export function browseAdoptionTierClass(tier: BrowseAdoptionTier): string {
  if (tier === "ready") return "border-trust-trusted/35 bg-trust-trusted/5 text-trust-trusted";
  if (tier === "caution") return "border-amber-500/35 bg-amber-500/5 text-trust-review";
  return "border-trust-blocked/35 bg-trust-blocked/5 text-trust-blocked";
}

export function browseAdoptionQueueState(
  entries: Entry[],
  preset: BrowseAdoptionPresetId,
  maxRows = 8,
): BrowseAdoptionQueueState {
  // Scored across the whole result set. `rows` slices this for display, but the
  // summary counts stay on the full population so its numerator and
  // `scannedCount` denominator describe the same set - counting only the
  // top-scored slice reported "0 in hold tier" while hold-tier entries sat just
  // outside it.
  const scored = entries
    .map((entry) => {
      const signals = signalMap(entry);
      const blockers = blockersFromSignals(signals, preset);
      const readinessScore = rowScore(entry, signals, preset);
      const tier = tierFromScore(readinessScore);
      return {
        entryRef: entryRef(entry),
        title: entry.title,
        trust: entry.trust,
        readinessScore,
        tier,
        blockers,
        nextSteps: nextSteps(signals, blockers),
        confidence: confidenceScore(signals),
      } satisfies BrowseAdoptionQueueRow;
    })
    .sort((a, b) => b.readinessScore - a.readinessScore || a.title.localeCompare(b.title));
  const rows = scored.slice(0, maxRows);

  return {
    preset,
    heading: headingForPreset(preset),
    summary: summary(scored, scored.length),
    scannedCount: entries.length,
    rows,
    readyCount: scored.filter((row) => row.tier === "ready").length,
    cautionCount: scored.filter((row) => row.tier === "caution").length,
    holdCount: scored.filter((row) => row.tier === "hold").length,
  };
}
