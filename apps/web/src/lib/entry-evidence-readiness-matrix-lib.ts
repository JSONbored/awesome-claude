import type { Entry } from "@/types/registry";
import { sameEntry } from "@/lib/entry-identity";

export type EvidenceMatrixPresetId = "balanced" | "strict" | "pilot";

export type EvidenceMatrixSignalId =
  | "source"
  | "reviewed"
  | "safety"
  | "privacy"
  | "package"
  | "install";

export type EvidenceMatrixTone = "complete" | "warning" | "critical";

export type EntryEvidenceMatrixCell = {
  id: EvidenceMatrixSignalId;
  label: string;
  required: boolean;
  present: boolean;
  tone: EvidenceMatrixTone;
  detail: string;
};

export type EntryEvidenceBenchmark = {
  entryRef: string;
  title: string;
  trust: Entry["trust"];
  score: number;
  strongerThanTarget: boolean;
  weakerThanTarget: boolean;
};

export type EntryEvidenceReadinessMatrixState = {
  preset: EvidenceMatrixPresetId;
  heading: string;
  summary: string;
  riskScore: number;
  completeCount: number;
  requiredMissing: string[];
  cells: EntryEvidenceMatrixCell[];
  benchmarkSummary: string | null;
  benchmarks: EntryEvidenceBenchmark[];
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

function signalPresent(entry: Entry, id: EvidenceMatrixSignalId): boolean {
  if (id === "source") return hasSource(entry);
  if (id === "reviewed") return hasReviewed(entry);
  if (id === "safety") return hasSafety(entry);
  if (id === "privacy") return hasPrivacy(entry);
  if (id === "package") return hasPackage(entry);
  return hasInstall(entry);
}

function signalLabel(id: EvidenceMatrixSignalId): string {
  if (id === "source") return "Source provenance";
  if (id === "reviewed") return "Metadata review";
  if (id === "safety") return "Safety notes";
  if (id === "privacy") return "Privacy notes";
  if (id === "package") return "Package integrity";
  return "Install payload";
}

function requiredSignals(preset: EvidenceMatrixPresetId): Record<EvidenceMatrixSignalId, boolean> {
  if (preset === "pilot") {
    return {
      source: true,
      reviewed: false,
      safety: true,
      privacy: false,
      package: false,
      install: true,
    };
  }
  if (preset === "strict") {
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

function signalWeight(id: EvidenceMatrixSignalId): number {
  if (id === "source") return 24;
  if (id === "reviewed") return 16;
  if (id === "safety") return 20;
  if (id === "privacy") return 12;
  if (id === "package") return 10;
  return 18;
}

function cellDetail(id: EvidenceMatrixSignalId, present: boolean): string {
  if (present) {
    if (id === "source") return "Source repository/provenance is listed.";
    if (id === "reviewed") return "Review metadata is present.";
    if (id === "safety") return "Safety notes are present.";
    if (id === "privacy") return "Privacy notes are present.";
    if (id === "package") return "Package integrity metadata is present.";
    return "Install payload is available.";
  }
  if (id === "source") return "Source provenance is missing.";
  if (id === "reviewed") return "Review metadata is missing.";
  if (id === "safety") return "Safety notes are missing.";
  if (id === "privacy") return "Privacy notes are missing.";
  if (id === "package") return "Package integrity metadata is missing.";
  return "Install payload is missing.";
}

function headingForPreset(preset: EvidenceMatrixPresetId): string {
  if (preset === "strict") return "Evidence readiness matrix · strict";
  if (preset === "pilot") return "Evidence readiness matrix · pilot";
  return "Evidence readiness matrix · balanced";
}

function trustPenalty(trust: Entry["trust"]): number {
  if (trust === "blocked") return 34;
  if (trust === "limited") return 20;
  if (trust === "review") return 10;
  return 0;
}

function riskScore(entry: Entry, cells: EntryEvidenceMatrixCell[]): number {
  const requiredMissPenalty = cells.filter((cell) => cell.required && !cell.present).length * 16;
  const optionalMissPenalty = cells.filter((cell) => !cell.required && !cell.present).length * 5;
  return Math.min(100, trustPenalty(entry.trust) + requiredMissPenalty + optionalMissPenalty);
}

function evidenceScore(entry: Entry): number {
  const ids: EvidenceMatrixSignalId[] = [
    "source",
    "reviewed",
    "safety",
    "privacy",
    "package",
    "install",
  ];
  return ids.reduce((score, id) => score + (signalPresent(entry, id) ? signalWeight(id) : 0), 0);
}

function compareSummary(targetScore: number, benchmarks: EntryEvidenceBenchmark[]): string | null {
  if (benchmarks.length === 0) return null;
  const stronger = benchmarks.filter((item) => item.strongerThanTarget).length;
  const weaker = benchmarks.filter((item) => item.weakerThanTarget).length;
  if (stronger === 0 && weaker === 0) {
    return "Compared entries are tied on evidence coverage.";
  }
  if (stronger > weaker) {
    return `${stronger} compared entr${stronger === 1 ? "y is" : "ies are"} stronger than this entry on evidence coverage.`;
  }
  if (weaker > stronger) {
    return `${weaker} compared entr${weaker === 1 ? "y is" : "ies are"} weaker than this entry on evidence coverage.`;
  }
  return `Evidence coverage is mixed across compared entries (target score ${targetScore}).`;
}

function summaryForState(input: {
  riskScore: number;
  requiredMissing: string[];
  preset: EvidenceMatrixPresetId;
  completeCount: number;
}): string {
  if (input.requiredMissing.length === 0) {
    if (input.preset === "strict") {
      return `All strict evidence gates are covered (${input.completeCount}/6 signals complete).`;
    }
    return `Required evidence gates are covered (${input.completeCount}/6 signals complete).`;
  }
  const top = input.requiredMissing.slice(0, 2).join(", ");
  return `Missing required evidence: ${top}. Risk score ${input.riskScore}.`;
}

export function entryEvidenceReadinessMatrixState(
  entry: Entry,
  preset: EvidenceMatrixPresetId,
  compareItems: Entry[],
): EntryEvidenceReadinessMatrixState {
  const required = requiredSignals(preset);
  const ids: EvidenceMatrixSignalId[] = [
    "source",
    "reviewed",
    "safety",
    "privacy",
    "package",
    "install",
  ];
  const cells: EntryEvidenceMatrixCell[] = ids.map((id) => {
    const present = signalPresent(entry, id);
    const req = required[id];
    const tone: EvidenceMatrixTone = present ? "complete" : req ? "critical" : "warning";
    return {
      id,
      label: signalLabel(id),
      required: req,
      present,
      tone,
      detail: cellDetail(id, present),
    };
  });

  const completeCount = cells.filter((cell) => cell.present).length;
  const requiredMissing = cells
    .filter((cell) => cell.required && !cell.present)
    .map((cell) => cell.label);
  const matrixRiskScore = riskScore(entry, cells);
  const targetScore = evidenceScore(entry);

  const benchmarks: EntryEvidenceBenchmark[] = compareItems
    .filter((candidate) => !sameEntry(candidate, entry))
    .map((candidate) => {
      const score = evidenceScore(candidate);
      return {
        entryRef: `${candidate.category}/${candidate.slug}`,
        title: candidate.title,
        trust: candidate.trust,
        score,
        strongerThanTarget: score > targetScore,
        weakerThanTarget: score < targetScore,
      };
    })
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, 4);

  return {
    preset,
    heading: headingForPreset(preset),
    summary: summaryForState({
      riskScore: matrixRiskScore,
      requiredMissing,
      preset,
      completeCount,
    }),
    riskScore: matrixRiskScore,
    completeCount,
    requiredMissing,
    cells,
    benchmarkSummary: compareSummary(targetScore, benchmarks),
    benchmarks,
  };
}
