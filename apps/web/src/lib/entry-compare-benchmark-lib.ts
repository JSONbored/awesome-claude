import type { Entry } from "@/types/registry";
import { sameEntry } from "@/lib/entry-identity";

export type CompareBenchmarkPresetId = "balanced" | "security" | "rollout";
export type CompareBenchmarkVerdict = "stronger" | "weaker" | "aligned";
export type CompareBenchmarkDimensionId = "trust" | "evidence" | "operability" | "risk";

export type CompareBenchmarkDimensionScore = {
  id: CompareBenchmarkDimensionId;
  label: string;
  score: number;
  detail: string;
};

export type CompareBenchmarkRow = {
  entryRef: string;
  title: string;
  trust: Entry["trust"];
  totalScore: number;
  delta: number;
  verdict: CompareBenchmarkVerdict;
  dimensions: CompareBenchmarkDimensionScore[];
  summary: string;
};

export type EntryCompareBenchmarkState = {
  preset: CompareBenchmarkPresetId;
  heading: string;
  summary: string;
  targetRef: string;
  targetTitle: string;
  targetScore: number;
  rows: CompareBenchmarkRow[];
  strongerCount: number;
  weakerCount: number;
  benchmarkSummary: string | null;
  showPanel: boolean;
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

function headingForPreset(preset: CompareBenchmarkPresetId): string {
  if (preset === "security") return "Compare benchmark · security posture";
  if (preset === "rollout") return "Compare benchmark · rollout readiness";
  return "Compare benchmark · balanced";
}

function weightsForPreset(
  preset: CompareBenchmarkPresetId,
): Record<CompareBenchmarkDimensionId, number> {
  if (preset === "security") {
    return { trust: 30, evidence: 35, operability: 10, risk: 25 };
  }
  if (preset === "rollout") {
    return { trust: 15, evidence: 20, operability: 40, risk: 25 };
  }
  return { trust: 25, evidence: 30, operability: 25, risk: 20 };
}

function trustScore(entry: Entry): number {
  if (entry.trust === "trusted") return 100;
  if (entry.trust === "review") return 60;
  if (entry.trust === "limited") return 32;
  return 0;
}

function evidenceScore(entry: Entry): number {
  const signals = [
    hasSource(entry),
    hasReviewed(entry),
    hasSafety(entry),
    hasPrivacy(entry),
    hasPackage(entry),
    hasInstall(entry),
  ];
  return Math.round((signals.filter(Boolean).length / signals.length) * 100);
}

function operabilityScore(entry: Entry): number {
  if (hasInstall(entry) && hasPackage(entry)) return 100;
  if (hasInstall(entry) || hasPackage(entry)) return 55;
  return 0;
}

function riskScore(entry: Entry): number {
  const penalties = [
    !hasSource(entry) ? 22 : 0,
    !hasReviewed(entry) ? 16 : 0,
    !hasSafety(entry) ? 14 : 0,
    !hasPrivacy(entry) ? 12 : 0,
    !hasPackage(entry) ? 10 : 0,
    !hasInstall(entry) ? 8 : 0,
    entry.trust === "blocked" ? 18 : entry.trust === "limited" ? 10 : 0,
  ];
  return Math.max(0, 100 - penalties.reduce((sum, value) => sum + value, 0));
}

function dimensionScores(entry: Entry): CompareBenchmarkDimensionScore[] {
  const trust = trustScore(entry);
  const evidence = evidenceScore(entry);
  const operability = operabilityScore(entry);
  const risk = riskScore(entry);
  return [
    {
      id: "trust",
      label: "Trust tier",
      score: trust,
      detail:
        trust >= 90
          ? "Trusted posture."
          : trust >= 50
            ? "Review-first posture."
            : trust >= 20
              ? "Limited posture."
              : "Blocked posture.",
    },
    {
      id: "evidence",
      label: "Evidence coverage",
      score: evidence,
      detail:
        evidence >= 90
          ? "Evidence signals are complete."
          : evidence >= 50
            ? "Partial evidence coverage."
            : "Sparse evidence coverage.",
    },
    {
      id: "operability",
      label: "Operability",
      score: operability,
      detail:
        operability >= 90
          ? "Install and package metadata present."
          : "Rollout payload gaps remain.",
    },
    {
      id: "risk",
      label: "Risk posture",
      score: risk,
      detail:
        risk >= 75
          ? "Low residual deployment risk."
          : risk >= 45
            ? "Moderate deployment risk."
            : "High deployment risk.",
    },
  ];
}

function totalScore(entry: Entry, preset: CompareBenchmarkPresetId): number {
  const weights = weightsForPreset(preset);
  const dimensions = dimensionScores(entry);
  const weighted = dimensions.reduce((sum, dimension) => {
    return sum + (dimension.score / 100) * weights[dimension.id];
  }, 0);
  return Math.round(weighted);
}

function verdictForDelta(delta: number): CompareBenchmarkVerdict {
  if (delta >= 8) return "stronger";
  if (delta <= -8) return "weaker";
  return "aligned";
}

function rowSummary(verdict: CompareBenchmarkVerdict, delta: number): string {
  if (verdict === "stronger") return `Scores ${Math.abs(delta)} points higher than this entry.`;
  if (verdict === "weaker") return `Scores ${Math.abs(delta)} points lower than this entry.`;
  return "Scores within alignment range for this preset.";
}

function benchmarkSummary(rows: CompareBenchmarkRow[]): string | null {
  if (rows.length === 0) return null;
  const stronger = rows.filter((row) => row.verdict === "stronger").length;
  const weaker = rows.filter((row) => row.verdict === "weaker").length;
  if (stronger === 0 && weaker === 0) {
    return "Compared entries are aligned with this entry on benchmark score.";
  }
  if (stronger > weaker) {
    return `${stronger} compared entries currently benchmark stronger than this entry.`;
  }
  if (weaker > stronger) {
    return `${weaker} compared entries currently benchmark weaker than this entry.`;
  }
  return "Compared entries show mixed benchmark deltas against this entry.";
}

function summary(targetScore: number, rows: CompareBenchmarkRow[]): string {
  if (rows.length === 0) {
    return "Add other entries to compare tray to benchmark this dossier.";
  }
  const stronger = rows.filter((row) => row.verdict === "stronger").length;
  if (stronger > 0) {
    return `This entry scores ${targetScore}/100 with ${stronger} stronger compare candidates.`;
  }
  return `This entry leads the compare tray at ${targetScore}/100 for the selected preset.`;
}

export function compareBenchmarkVerdictClass(verdict: CompareBenchmarkVerdict): string {
  if (verdict === "stronger")
    return "border-trust-trusted/35 bg-trust-trusted/5 text-trust-trusted";
  if (verdict === "weaker") return "border-trust-blocked/35 bg-trust-blocked/5 text-trust-blocked";
  return "border-border bg-background text-ink-muted";
}

export function entryCompareBenchmarkState(
  entry: Entry,
  preset: CompareBenchmarkPresetId,
  compareItems: Entry[],
): EntryCompareBenchmarkState {
  const targetScore = totalScore(entry, preset);
  const peers = compareItems.filter((candidate) => !sameEntry(candidate, entry));
  const rows: CompareBenchmarkRow[] = peers
    .map((candidate) => {
      const score = totalScore(candidate, preset);
      const delta = score - targetScore;
      const verdict = verdictForDelta(delta);
      return {
        entryRef: entryRef(candidate),
        title: candidate.title,
        trust: candidate.trust,
        totalScore: score,
        delta,
        verdict,
        dimensions: dimensionScores(candidate),
        summary: rowSummary(verdict, delta),
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore || a.title.localeCompare(b.title));

  return {
    preset,
    heading: headingForPreset(preset),
    summary: summary(targetScore, rows),
    targetRef: entryRef(entry),
    targetTitle: entry.title,
    targetScore,
    rows,
    strongerCount: rows.filter((row) => row.verdict === "stronger").length,
    weakerCount: rows.filter((row) => row.verdict === "weaker").length,
    benchmarkSummary: benchmarkSummary(rows),
    showPanel: peers.length > 0,
  };
}
