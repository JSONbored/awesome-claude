/**
 * Pure resource card trust decision helpers.
 *
 * Builds browse-card hints that explain how an entry compares to the current
 * compare tray selection without opening dossiers.
 */

import type { Entry, TrustLevel } from "@/types/registry";
import { sameEntry } from "@/lib/entry-identity";
import {
  divergingDecisionRowLabels,
  compareDecisionSummary,
} from "@/lib/compare-table-decision-rows-lib";

export const RESOURCE_CARD_TRUST_HINT_MIN_COMPARE = 1;

const TRUST_RANK: Record<TrustLevel, number> = {
  trusted: 4,
  review: 3,
  limited: 2,
  blocked: 1,
};

export function resourceCardTrustScore(entry: Entry): number {
  let score = TRUST_RANK[entry.trust] * 10;
  if (entry.safetyNotes || entry.safetyNotesList?.length) score += 15;
  if (entry.privacyNotes || entry.privacyNotesList?.length) score += 10;
  if (entry.reviewed || entry.reviewedBy) score += 15;
  if (entry.source !== "unverified") score += 10;
  if (entry.installCommand) score += 5;
  if (entry.claimed) score += 5;
  return score;
}

export type ResourceCardTrustHintKind =
  | "aligns"
  | "stronger"
  | "weaker"
  | "diverges"
  | "mixed-trust";

const TRUST_HINT_TONE_CLASS: Record<ResourceCardTrustHintKind, string> = {
  aligns: "border-border bg-surface text-ink-muted",
  stronger: "border-trust-trusted/30 bg-trust-trusted/5 text-trust-trusted",
  weaker: "border-trust-review/30 bg-trust-review/5 text-amber-900",
  diverges: "border-amber-500/30 bg-amber-500/5 text-amber-900",
  "mixed-trust": "border-accent/30 bg-accent/5 text-ink",
};

export function resourceCardTrustHintToneClass(kind: ResourceCardTrustHintKind): string {
  return TRUST_HINT_TONE_CLASS[kind];
}

export type ResourceCardTrustDecisionState = {
  showHint: boolean;
  kind: ResourceCardTrustHintKind;
  hint: string;
  divergingLabels: string[];
  trustScore: number;
  compareAverageScore: number;
  inCompareTray: boolean;
};

function compareTrayAverageScore(entries: Entry[]): number {
  if (entries.length === 0) return 0;
  const total = entries.reduce((sum, entry) => sum + resourceCardTrustScore(entry), 0);
  return Math.round(total / entries.length);
}

function resourceCardTrustHintKind(
  entry: Entry,
  compareEntries: Entry[],
  divergingLabels: string[],
  trustScore: number,
  averageScore: number,
): ResourceCardTrustHintKind {
  if (divergingLabels.length > 0) return "diverges";

  const trustLevels = new Set([entry.trust, ...compareEntries.map((item) => item.trust)]);
  if (trustLevels.size > 1) return "mixed-trust";

  if (trustScore > averageScore + 5) return "stronger";
  if (trustScore < averageScore - 5) return "weaker";
  return "aligns";
}

function resourceCardTrustHintText(
  entry: Entry,
  compareEntries: Entry[],
  kind: ResourceCardTrustHintKind,
  divergingLabels: string[],
): string {
  const compareTitles = compareEntries.map((item) => item.title);
  const versus =
    compareEntries.length === 1 ? compareTitles[0] : `${compareEntries.length} selected entries`;

  switch (kind) {
    case "diverges": {
      const labels = divergingLabels.slice(0, 2).join(", ");
      return `Differs from ${versus} on ${labels} — open compare before installing.`;
    }
    case "mixed-trust":
      return `Mixed trust levels versus ${versus} — compare trust signals side by side.`;
    case "stronger":
      return `Stronger trust signals than ${versus} in this selection.`;
    case "weaker":
      return `Weaker trust signals than ${versus} — review safety and source first.`;
    case "aligns":
    default:
      return `Trust signals align with ${versus}.`;
  }
}

export function resourceCardVersusCompareEntries(entry: Entry, compareEntries: Entry[]): Entry[] {
  return compareEntries.filter((item) => !sameEntry(item, entry));
}

export function resourceCardTrustDecisionState(
  entry: Entry,
  compareEntries: Entry[],
): ResourceCardTrustDecisionState | null {
  const peers = resourceCardVersusCompareEntries(entry, compareEntries);
  if (peers.length < RESOURCE_CARD_TRUST_HINT_MIN_COMPARE) {
    return null;
  }

  const combined = [...peers, entry];
  const divergingLabels = divergingDecisionRowLabels(combined);
  const trustScore = resourceCardTrustScore(entry);
  const compareAverageScore = compareTrayAverageScore(peers);
  const kind = resourceCardTrustHintKind(
    entry,
    peers,
    divergingLabels,
    trustScore,
    compareAverageScore,
  );

  return {
    showHint: true,
    kind,
    hint: resourceCardTrustHintText(entry, peers, kind, divergingLabels),
    divergingLabels,
    trustScore,
    compareAverageScore,
    inCompareTray: compareEntries.some((item) => sameEntry(item, entry)),
  };
}

export type BrowseCompareSelectionContextState = {
  showBanner: boolean;
  selectedCount: number;
  divergingCount: number;
  divergingLabels: string[];
  headline: string | null;
  hint: string | null;
};

export function browseCompareSelectionContextState(
  compareEntries: Entry[],
): BrowseCompareSelectionContextState {
  if (compareEntries.length < 2) {
    return {
      showBanner: false,
      selectedCount: compareEntries.length,
      divergingCount: 0,
      divergingLabels: [],
      headline: null,
      hint: null,
    };
  }

  const decision = compareDecisionSummary(compareEntries);
  const divergingLabels = decision.divergingLabels;
  const headline =
    divergingLabels.length > 0
      ? `${decision.divergingCount} trust ${decision.divergingCount === 1 ? "signal differs" : "signals differ"} across your selection.`
      : "Selected entries share the same trust signals so far.";

  const hint =
    divergingLabels.length > 0
      ? `Browse cards below show how each result compares to ${compareEntries.length} selected entries.`
      : "Add one more entry with different trust metadata to spot gaps faster.";

  return {
    showBanner: true,
    selectedCount: compareEntries.length,
    divergingCount: decision.divergingCount,
    divergingLabels,
    headline,
    hint,
  };
}

export function browseCompareSelectionDivergingLine(labels: string[]): string | null {
  if (labels.length === 0) return null;
  return `Differs on: ${labels.join(", ")}`;
}
