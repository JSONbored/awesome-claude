/**
 * Pure compare scenario ranking helpers.
 *
 * Computes per-entry ranking under different decision presets so users can
 * choose the best candidate for their current risk appetite or speed target.
 */

import type { Entry } from "@/types/registry";
import { compareBriefEntryScore } from "@/lib/compare-decision-brief";

export type CompareScenarioId = "balanced" | "safety-first" | "speed-first" | "minimal-risk";

export type CompareScenarioPreset = {
  id: CompareScenarioId;
  label: string;
  shortLabel: string;
  description: string;
};

export type CompareScenarioRankedEntry = {
  entryRef: string;
  title: string;
  rank: number;
  score: number;
  deltaFromTop: number;
  rationale: string[];
};

export type CompareScenarioRankingState = {
  scenario: CompareScenarioPreset;
  summary: string;
  ranked: CompareScenarioRankedEntry[];
};

export const COMPARE_SCENARIO_PRESETS: CompareScenarioPreset[] = [
  {
    id: "balanced",
    label: "Balanced",
    shortLabel: "Balanced",
    description: "Mix trust, safety, and practical adoption signals.",
  },
  {
    id: "safety-first",
    label: "Safety first",
    shortLabel: "Safety",
    description: "Prioritize strong trust, source, and disclosure signals.",
  },
  {
    id: "speed-first",
    label: "Speed first",
    shortLabel: "Speed",
    description: "Prioritize install-ready entries for fast adoption.",
  },
  {
    id: "minimal-risk",
    label: "Minimal risk",
    shortLabel: "Low risk",
    description: "Deprioritize entries with missing trust metadata.",
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

function isSourceBacked(entry: Pick<Entry, "source" | "sourceUrl">): boolean {
  return entry.source !== "unverified" || Boolean(entry.sourceUrl);
}

function isPackageReady(entry: Pick<Entry, "packageVerified" | "downloadSha256">): boolean {
  return entry.packageVerified === true || Boolean(entry.downloadSha256);
}

function scenarioBonus(entry: Entry, scenario: CompareScenarioId): number {
  if (scenario === "balanced") {
    let score = 0;
    if (hasSafety(entry)) score += 4;
    if (hasPrivacy(entry)) score += 4;
    if (hasInstallPayload(entry)) score += 3;
    if (isSourceBacked(entry)) score += 3;
    return score;
  }

  if (scenario === "safety-first") {
    let score = 0;
    if (entry.trust === "trusted") score += 16;
    if (entry.trust === "blocked") score -= 25;
    if (isSourceBacked(entry)) score += 10;
    if (hasSafety(entry)) score += 9;
    if (hasPrivacy(entry)) score += 9;
    if (entry.reviewed || entry.reviewedBy) score += 8;
    if (!isPackageReady(entry)) score -= 4;
    return score;
  }

  if (scenario === "speed-first") {
    let score = 0;
    if (hasInstallPayload(entry)) score += 18;
    if (entry.installCommand) score += 6;
    if (entry.configSnippet) score += 4;
    if (entry.fullCopy || entry.copySnippet) score += 3;
    if (entry.claimed) score += 3;
    if (entry.trust === "blocked") score -= 30;
    return score;
  }

  // minimal-risk
  let score = 0;
  if (entry.trust === "trusted") score += 14;
  if (entry.trust === "review") score += 5;
  if (entry.trust === "limited") score -= 6;
  if (entry.trust === "blocked") score -= 35;
  if (isSourceBacked(entry)) score += 8;
  if (hasSafety(entry)) score += 7;
  if (hasPrivacy(entry)) score += 7;
  if (isPackageReady(entry)) score += 6;
  if (!(entry.reviewed || entry.reviewedBy)) score -= 6;
  if (entry.source === "unverified") score -= 8;
  return score;
}

function scenarioPenalty(entry: Entry, scenario: CompareScenarioId): number {
  if (scenario === "speed-first") {
    let penalty = 0;
    if (!hasInstallPayload(entry)) penalty -= 15;
    if (entry.source === "unverified") penalty -= 4;
    return penalty;
  }
  if (scenario === "balanced") {
    let penalty = 0;
    if (!hasSafety(entry)) penalty -= 3;
    if (!hasPrivacy(entry)) penalty -= 3;
    if (entry.trust === "blocked") penalty -= 10;
    return penalty;
  }
  if (scenario === "safety-first") {
    let penalty = 0;
    if (!hasSafety(entry)) penalty -= 8;
    if (!hasPrivacy(entry)) penalty -= 8;
    if (!isSourceBacked(entry)) penalty -= 9;
    return penalty;
  }
  // minimal-risk
  let penalty = 0;
  if (!hasSafety(entry)) penalty -= 10;
  if (!hasPrivacy(entry)) penalty -= 10;
  if (!isSourceBacked(entry)) penalty -= 10;
  if (!isPackageReady(entry)) penalty -= 6;
  return penalty;
}

function scenarioScore(entry: Entry, scenario: CompareScenarioId): number {
  const base = compareBriefEntryScore(entry);
  return base + scenarioBonus(entry, scenario) + scenarioPenalty(entry, scenario);
}

function scenarioRationale(entry: Entry, scenario: CompareScenarioId, score: number): string[] {
  const reasons: string[] = [];
  if (entry.trust === "trusted") reasons.push("Trusted trust level");
  if (entry.trust === "blocked") reasons.push("Blocked trust level");
  if (hasSafety(entry)) reasons.push("Safety notes present");
  if (hasPrivacy(entry)) reasons.push("Privacy notes present");
  if (isSourceBacked(entry)) reasons.push("Source provenance available");
  if (isPackageReady(entry)) reasons.push("Package integrity metadata available");
  if (hasInstallPayload(entry)) reasons.push("Install payload available");
  if (scenario === "speed-first" && !hasInstallPayload(entry))
    reasons.push("Missing install payload");
  if (scenario === "minimal-risk" && entry.source === "unverified")
    reasons.push("Unverified source");
  if (reasons.length === 0) reasons.push(`Scenario score ${score}`);
  return reasons.slice(0, 4);
}

function summaryText(scenario: CompareScenarioId, topTitle: string | null): string {
  if (!topTitle) return "Add entries to see scenario-based ranking.";
  if (scenario === "balanced") return `${topTitle} leads under balanced weighting.`;
  if (scenario === "safety-first")
    return `${topTitle} leads when safety and provenance are prioritized.`;
  if (scenario === "speed-first")
    return `${topTitle} leads when fast adoption signals are prioritized.`;
  return `${topTitle} leads under strict risk-minimization weighting.`;
}

function resolvePreset(scenario: CompareScenarioId): CompareScenarioPreset {
  return (
    COMPARE_SCENARIO_PRESETS.find((preset) => preset.id === scenario) ?? COMPARE_SCENARIO_PRESETS[0]
  );
}

export function compareScenarioRankingState(
  entries: Entry[],
  scenario: CompareScenarioId,
): CompareScenarioRankingState {
  const ranked = entries
    .map((entry) => ({
      entry,
      score: scenarioScore(entry, scenario),
    }))
    .sort((left, right) => right.score - left.score);

  const topScore = ranked[0]?.score ?? 0;
  const rankedEntries: CompareScenarioRankedEntry[] = ranked.map((row, index) => ({
    entryRef: `${row.entry.category}/${row.entry.slug}`,
    title: row.entry.title,
    rank: index + 1,
    score: row.score,
    deltaFromTop: row.score - topScore,
    rationale: scenarioRationale(row.entry, scenario, row.score),
  }));

  return {
    scenario: resolvePreset(scenario),
    summary: summaryText(scenario, ranked[0]?.entry.title ?? null),
    ranked: rankedEntries,
  };
}
