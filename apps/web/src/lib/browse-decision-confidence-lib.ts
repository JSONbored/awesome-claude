import type { Entry } from "@/types/registry";

export type BrowseConfidencePresetId = "balanced" | "strict" | "pilot";
export type BrowseConfidenceBand = "high" | "medium" | "low";
export type BrowseConfidenceSignalId =
  | "source"
  | "reviewed"
  | "safety"
  | "privacy"
  | "package"
  | "install";

export type BrowseConfidenceEntry = {
  entryRef: string;
  title: string;
  trust: Entry["trust"];
  confidenceScore: number;
  band: BrowseConfidenceBand;
  missingSignals: string[];
  recommendation: string;
};

export type BrowseDecisionConfidenceState = {
  preset: BrowseConfidencePresetId;
  heading: string;
  summary: string;
  scannedCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  entries: BrowseConfidenceEntry[];
  lowRefs: string[];
};

const SIGNAL_LABELS: Record<BrowseConfidenceSignalId, string> = {
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

function headingForPreset(preset: BrowseConfidencePresetId): string {
  if (preset === "strict") return "Decision confidence scan · strict";
  if (preset === "pilot") return "Decision confidence scan · pilot";
  return "Decision confidence scan · balanced";
}

function signalWeights(preset: BrowseConfidencePresetId): Record<BrowseConfidenceSignalId, number> {
  if (preset === "strict") {
    return {
      source: 20,
      reviewed: 16,
      safety: 18,
      privacy: 16,
      package: 16,
      install: 14,
    };
  }
  if (preset === "pilot") {
    return {
      source: 14,
      reviewed: 10,
      safety: 12,
      privacy: 10,
      package: 10,
      install: 24,
    };
  }
  return {
    source: 18,
    reviewed: 14,
    safety: 14,
    privacy: 12,
    package: 12,
    install: 18,
  };
}

function trustPenalty(entry: Entry): number {
  if (entry.trust === "blocked") return 24;
  if (entry.trust === "limited") return 14;
  if (entry.trust === "review") return 8;
  return 0;
}

function confidenceBand(score: number, entry: Entry): BrowseConfidenceBand {
  if (entry.trust === "blocked") return "low";
  if (score >= 74) return "high";
  if (score >= 46) return "medium";
  return "low";
}

function signals(entry: Entry): Record<BrowseConfidenceSignalId, boolean> {
  return {
    source: hasSource(entry),
    reviewed: hasReviewed(entry),
    safety: hasSafety(entry),
    privacy: hasPrivacy(entry),
    package: hasPackage(entry),
    install: hasInstall(entry),
  };
}

function scoreEntry(
  entry: Entry,
  preset: BrowseConfidencePresetId,
  state: Record<BrowseConfidenceSignalId, boolean>,
): number {
  const weights = signalWeights(preset);
  const points = (Object.keys(weights) as BrowseConfidenceSignalId[]).reduce((sum, key) => {
    return sum + (state[key] ? weights[key] : 0);
  }, 0);
  return Math.max(0, Math.min(100, points - trustPenalty(entry)));
}

function recommendationFor(score: number, missing: string[], entry: Entry): string {
  if (entry.trust === "blocked") return "Hold adoption until registry trust is restored.";
  if (score >= 74) return "Confident candidate for staged adoption.";
  if (score >= 46) {
    return missing.length > 0
      ? `Address ${missing.slice(0, 2).join(", ")} before broader rollout.`
      : "Proceed with a guarded pilot rollout.";
  }
  return missing.length > 0
    ? `Hold adoption until ${missing.slice(0, 2).join(", ")} are resolved.`
    : "Hold adoption pending additional verification.";
}

function summary(rows: BrowseConfidenceEntry[], scannedCount: number): string {
  if (rows.length === 0) return "Add visible results to generate a confidence scan.";
  const low = rows.filter((row) => row.band === "low").length;
  const high = rows.filter((row) => row.band === "high").length;
  if (low > 0) {
    return `${low}/${scannedCount} results are low-confidence and need review before adoption.`;
  }
  return `${high}/${scannedCount} results are high-confidence for the selected preset.`;
}

export function browseConfidenceBandClass(band: BrowseConfidenceBand): string {
  if (band === "high") return "border-trust-trusted/35 bg-trust-trusted/5 text-trust-trusted";
  if (band === "medium") return "border-amber-500/35 bg-amber-500/5 text-amber-900";
  return "border-trust-blocked/35 bg-trust-blocked/5 text-trust-blocked";
}

export function browseDecisionConfidenceState(
  entries: Entry[],
  preset: BrowseConfidencePresetId,
  maxEntries = 8,
): BrowseDecisionConfidenceState {
  const mapped = entries
    .map((entry) => {
      const signalState = signals(entry);
      const missingSignals = (Object.keys(signalState) as BrowseConfidenceSignalId[])
        .filter((key) => !signalState[key])
        .map((key) => SIGNAL_LABELS[key]);
      const confidenceScore = scoreEntry(entry, preset, signalState);
      const band = confidenceBand(confidenceScore, entry);
      return {
        entryRef: entryRef(entry),
        title: entry.title,
        trust: entry.trust,
        confidenceScore,
        band,
        missingSignals,
        recommendation: recommendationFor(confidenceScore, missingSignals, entry),
      } satisfies BrowseConfidenceEntry;
    })
    .sort((a, b) => b.confidenceScore - a.confidenceScore || a.title.localeCompare(b.title))
    .slice(0, maxEntries);

  return {
    preset,
    heading: headingForPreset(preset),
    summary: summary(mapped, entries.length),
    scannedCount: entries.length,
    highCount: mapped.filter((row) => row.band === "high").length,
    mediumCount: mapped.filter((row) => row.band === "medium").length,
    lowCount: mapped.filter((row) => row.band === "low").length,
    entries: mapped,
    lowRefs: mapped.filter((row) => row.band === "low").map((row) => row.entryRef),
  };
}
