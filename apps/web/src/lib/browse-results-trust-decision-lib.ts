/**
 * Pure browse results trust decision helpers.
 *
 * Summarizes trust coverage and divergence across the current browse result
 * set so users can decide whether to compare before opening every dossier.
 */

import type { Entry, TrustLevel } from "@/types/registry";
import {
  compareDecisionSummary,
  divergingDecisionRowLabels,
} from "@/lib/compare-table-decision-rows-lib";

export const BROWSE_TRUST_PANEL_MIN_RESULTS = 3;
export const BROWSE_TRUST_PANEL_SAMPLE_MAX = 40;

const TRUST_LEVEL_ORDER: TrustLevel[] = ["trusted", "review", "limited", "blocked"];

export type BrowseTrustLevelCount = {
  level: TrustLevel;
  count: number;
};

export type BrowseTrustCoverageChip = {
  id: string;
  label: string;
  count: number;
  total: number;
  percent: number;
  emphasis: "high" | "low" | "neutral";
};

export type BrowseResultsTrustDecisionUiState =
  | { showPanel: false }
  | {
      showPanel: true;
      resultCount: number;
      sampleCount: number;
      trustLevels: BrowseTrustLevelCount[];
      coverage: BrowseTrustCoverageChip[];
      divergingCount: number;
      divergingLabels: string[];
      decisionHint: string | null;
      compareNudge: string | null;
      hasMixedTrust: boolean;
    };

export function browseTrustLevelBreakdown(entries: Entry[]): BrowseTrustLevelCount[] {
  const counts: Partial<Record<TrustLevel, number>> = {};
  for (const entry of entries) {
    counts[entry.trust] = (counts[entry.trust] ?? 0) + 1;
  }
  return TRUST_LEVEL_ORDER.filter((level) => (counts[level] ?? 0) > 0).map((level) => ({
    level,
    count: counts[level] ?? 0,
  }));
}

function coverageChip(
  id: string,
  label: string,
  count: number,
  total: number,
): BrowseTrustCoverageChip {
  const percent = total > 0 ? Math.round((count / total) * 100) : 0;
  const emphasis = percent >= 80 ? "high" : percent <= 20 ? "low" : "neutral";
  return { id, label, count, total, percent, emphasis };
}

export function browseTrustCoverageChips(entries: Entry[]): BrowseTrustCoverageChip[] {
  const total = entries.length;
  if (total === 0) return [];

  const countWhere = (predicate: (entry: Entry) => boolean) => entries.filter(predicate).length;

  return [
    coverageChip(
      "safety",
      "Safety notes",
      countWhere((entry) => Boolean(entry.safetyNotes || entry.safetyNotesList?.length)),
      total,
    ),
    coverageChip(
      "privacy",
      "Privacy notes",
      countWhere((entry) => Boolean(entry.privacyNotes || entry.privacyNotesList?.length)),
      total,
    ),
    coverageChip(
      "reviewed",
      "Reviewed",
      countWhere((entry) => Boolean(entry.reviewed || entry.reviewedBy)),
      total,
    ),
    coverageChip(
      "source-backed",
      "Source-backed",
      countWhere((entry) => entry.source !== "unverified"),
      total,
    ),
    coverageChip(
      "claimed",
      "Claimed",
      countWhere((entry) => Boolean(entry.claimed)),
      total,
    ),
  ];
}

export function browseTrustPanelDecisionHint(
  entries: Entry[],
  compareCount: number,
  divergingLabels: string[],
): string | null {
  if (divergingLabels.length > 0) {
    const labels = divergingLabels.slice(0, 3).join(", ");
    return compareCount >= 2
      ? `Trust signals differ on ${labels} — open compare to review side by side.`
      : `Signals differ on ${labels} — add entries to compare before you install.`;
  }

  const trustLevels = browseTrustLevelBreakdown(entries);
  if (trustLevels.length >= 2 && compareCount < 2) {
    return "Mixed trust levels in this set — compare candidates before installing.";
  }

  const coverage = browseTrustCoverageChips(entries);
  const weakCoverage = coverage.filter((chip) => chip.emphasis === "low");
  if (weakCoverage.length >= 2 && compareCount < 2) {
    return `Only ${weakCoverage[0]?.percent ?? 0}%–${weakCoverage[weakCoverage.length - 1]?.percent ?? 0}% of results have key trust signals — compare before you commit.`;
  }

  return null;
}

export function browseResultsTrustDecisionUiState(
  results: Entry[],
  compareCount = 0,
): BrowseResultsTrustDecisionUiState {
  if (results.length < BROWSE_TRUST_PANEL_MIN_RESULTS) {
    return { showPanel: false };
  }

  const sample = results.slice(0, BROWSE_TRUST_PANEL_SAMPLE_MAX);
  const divergingLabels = divergingDecisionRowLabels(sample);
  const decision = compareDecisionSummary(sample);
  const trustLevels = browseTrustLevelBreakdown(sample);
  const coverage = browseTrustCoverageChips(sample);

  return {
    showPanel: true,
    resultCount: results.length,
    sampleCount: sample.length,
    trustLevels,
    coverage,
    divergingCount: decision.divergingCount,
    divergingLabels,
    decisionHint: browseTrustPanelDecisionHint(sample, compareCount, divergingLabels),
    compareNudge:
      compareCount >= 2
        ? `You have ${compareCount} entries selected — open compare to inspect trust gaps.`
        : null,
    hasMixedTrust: trustLevels.length >= 2,
  };
}
