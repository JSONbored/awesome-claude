/**
 * Pure compare page trust decision helpers.
 *
 * Builds entry trust snapshots, diverging decision rows, and guidance for the
 * full compare page without touching the network.
 */

import type { Entry, TrustLevel } from "@/types/registry";
import {
  COMPARE_DECISION_ROWS,
  compareSignalToneClass,
  resolveCompareSignal,
  type CompareSignalTone,
} from "@/lib/compare-entry-signals-lib";
import {
  compareDecisionSummary,
  divergingDecisionRowLabels,
} from "@/lib/compare-table-decision-rows-lib";
import { comparePageActionSummary } from "@/lib/compare-page-actions-ui-lib";

export const COMPARE_PAGE_TRUST_PANEL_MIN_ITEMS = 2;

const TRUST_RANK: Record<TrustLevel, number> = {
  trusted: 4,
  review: 3,
  limited: 2,
  blocked: 1,
};

export type CompareEntryTrustSnapshot = {
  entryKey: string;
  category: string;
  slug: string;
  title: string;
  trust: TrustLevel;
  hasSafetyNotes: boolean;
  hasPrivacyNotes: boolean;
  reviewed: boolean;
  sourceBacked: boolean;
  installable: boolean;
  claimed: boolean;
  trustScore: number;
  recommendedAction: string;
  caution: string | null;
};

export type CompareDivergingDecisionRow = {
  label: string;
  cells: {
    entryKey: string;
    title: string;
    label: string;
    tone: CompareSignalTone;
    toneClass: string;
  }[];
};

export type ComparePageTrustDecisionUiState =
  | { showPanel: false }
  | {
      showPanel: true;
      headline: string | null;
      primaryHint: string | null;
      entrySnapshots: CompareEntryTrustSnapshot[];
      divergingRows: CompareDivergingDecisionRow[];
      divergingLabels: string[];
      divergingCount: number;
      safestEntryKey: string | null;
      actionsDiverge: boolean;
      sharedActionIds: string[];
    };

export function compareEntryKey(entry: Pick<Entry, "category" | "slug">): string {
  return `${entry.category}/${entry.slug}`;
}

export function compareEntryTrustScore(entry: Entry): number {
  let score = TRUST_RANK[entry.trust] * 10;
  if (entry.safetyNotes || entry.safetyNotesList?.length) score += 15;
  if (entry.privacyNotes || entry.privacyNotesList?.length) score += 10;
  if (entry.reviewed || entry.reviewedBy) score += 15;
  if (entry.source !== "unverified") score += 10;
  if (entry.installCommand) score += 5;
  if (entry.claimed) score += 5;
  return score;
}

export function compareEntryTrustCaution(entry: Entry): string | null {
  if (entry.trust === "blocked") {
    return "Blocked trust level — do not install without maintainer review.";
  }
  if (!entry.safetyNotes && !entry.safetyNotesList?.length) {
    return "No safety notes on file.";
  }
  if (entry.source === "unverified") {
    return "Source is unverified.";
  }
  if (!entry.reviewed && !entry.reviewedBy) {
    return "Not maintainer-reviewed yet.";
  }
  return null;
}

export function compareEntryRecommendedAction(entry: Entry): string {
  if (entry.trust === "blocked" || entry.trust === "limited") {
    return "Review safety notes and source before any install.";
  }
  if (!entry.reviewed && !entry.reviewedBy) {
    return "Open the dossier and source repo before installing.";
  }
  if (entry.installCommand) {
    return "Copy install after confirming trust signals match your risk tolerance.";
  }
  return "Open the dossier for setup guidance and prerequisites.";
}

export function compareEntryTrustSnapshot(entry: Entry): CompareEntryTrustSnapshot {
  return {
    entryKey: compareEntryKey(entry),
    category: entry.category,
    slug: entry.slug,
    title: entry.title,
    trust: entry.trust,
    hasSafetyNotes: Boolean(entry.safetyNotes || entry.safetyNotesList?.length),
    hasPrivacyNotes: Boolean(entry.privacyNotes || entry.privacyNotesList?.length),
    reviewed: Boolean(entry.reviewed || entry.reviewedBy),
    sourceBacked: entry.source !== "unverified",
    installable: Boolean(entry.installCommand),
    claimed: Boolean(entry.claimed),
    trustScore: compareEntryTrustScore(entry),
    recommendedAction: compareEntryRecommendedAction(entry),
    caution: compareEntryTrustCaution(entry),
  };
}

export function comparePageDivergingDecisionRows(entries: Entry[]): CompareDivergingDecisionRow[] {
  return COMPARE_DECISION_ROWS.map((row) => ({
    label: row.label,
    cells: entries.map((entry) => {
      const signal = resolveCompareSignal(row.resolve(entry));
      return {
        entryKey: compareEntryKey(entry),
        title: entry.title,
        label: signal.label,
        tone: signal.tone,
        toneClass: compareSignalToneClass(signal.tone),
      };
    }),
  })).filter((row) => {
    const signatures = row.cells.map((cell) => `${cell.tone}:${cell.label}`);
    return new Set(signatures).size > 1;
  });
}

export function comparePageSafestEntryKey(snapshots: CompareEntryTrustSnapshot[]): string | null {
  if (snapshots.length === 0) return null;
  const sorted = [...snapshots].sort((left, right) => right.trustScore - left.trustScore);
  const top = sorted[0];
  const tied = sorted.filter((snapshot) => snapshot.trustScore === top.trustScore);
  return tied.length === 1 ? top.entryKey : null;
}

export function comparePageTrustDecisionHeadline(
  entries: Entry[],
  divergingLabels: string[],
  safestEntryKey: string | null,
): string | null {
  if (divergingLabels.length > 0) {
    const labels = divergingLabels.slice(0, 3).join(", ");
    return `${labels} differ across this comparison.`;
  }

  const trustLevels = new Set(entries.map((entry) => entry.trust));
  if (trustLevels.size > 1) {
    return "Trust levels differ — confirm install risk before you choose.";
  }

  if (safestEntryKey) {
    const safest = entries.find((entry) => compareEntryKey(entry) === safestEntryKey);
    if (safest) {
      return `${safest.title} has the strongest trust signals in this set.`;
    }
  }

  return null;
}

export function comparePageTrustPrimaryHint(
  entries: Entry[],
  actionsDiverge: boolean,
  safestEntryKey: string | null,
): string | null {
  if (actionsDiverge) {
    return "Next steps differ per entry — use the action row below or open each dossier.";
  }

  const missingSafety = entries.filter(
    (entry) => !entry.safetyNotes && !entry.safetyNotesList?.length,
  ).length;
  if (missingSafety > 0 && entries.length > 1) {
    return `${missingSafety} of ${entries.length} entries are missing safety notes — compare before installing.`;
  }

  if (safestEntryKey && entries.length > 2) {
    return "Start with the highlighted entry, then spot-check the others for gaps.";
  }

  return null;
}

export function comparePageTrustDecisionUiState(entries: Entry[]): ComparePageTrustDecisionUiState {
  if (entries.length < COMPARE_PAGE_TRUST_PANEL_MIN_ITEMS) {
    return { showPanel: false };
  }

  const entrySnapshots = entries.map(compareEntryTrustSnapshot);
  const divergingRows = comparePageDivergingDecisionRows(entries);
  const divergingLabels = divergingDecisionRowLabels(entries);
  const decision = compareDecisionSummary(entries);
  const actionSummary = comparePageActionSummary(entries);
  const safestEntryKey = comparePageSafestEntryKey(entrySnapshots);

  return {
    showPanel: true,
    headline: comparePageTrustDecisionHeadline(entries, divergingLabels, safestEntryKey),
    primaryHint: comparePageTrustPrimaryHint(entries, actionSummary.diverges, safestEntryKey),
    entrySnapshots,
    divergingRows,
    divergingLabels,
    divergingCount: decision.divergingCount,
    safestEntryKey,
    actionsDiverge: actionSummary.diverges,
    sharedActionIds: actionSummary.sharedActionIds,
  };
}
