/**
 * Pure comparison tray UI helpers.
 *
 * Builds compact trust summaries and chip metadata for the fixed compare
 * tray shown on browse/detail surfaces. Given the same entry metadata the
 * output is deterministic.
 */

import type { Entry } from "@/types/registry";
import {
  compareCuratedActionBannerText,
  compareCuratedDecisionBannerText,
} from "@/lib/compare-curated-summary";
import {
  packageTrustCompareSignal,
  reviewCompareSignal,
  sourceProvenanceCompareSignal,
  type CompareSignalTone,
} from "@/lib/compare-entry-signals-lib";
import { compareSurfaceSummary } from "@/lib/compare-surface-summary-lib";

export type ComparisonTrayChipSignals = {
  hasSafetyNotes: boolean;
  hasPrivacyNotes: boolean;
  reviewed: boolean;
  claimed: boolean;
  installable: boolean;
  packageTrustTone: CompareSignalTone;
  sourceProvenanceTone: CompareSignalTone;
};

export type ComparisonTrayUiState = {
  count: number;
  maxCount: number;
  canQuickCompare: boolean;
  canOpenFullCompare: boolean;
  compareIds: string;
  primaryHint: string | null;
  hints: string[];
  hasTrustDivergence: boolean;
};

export const COMPARISON_TRAY_MAX_ITEMS = 4;

function hasSafetyNotes(entry: Pick<Entry, "safetyNotes" | "safetyNotesList">) {
  return Boolean(entry.safetyNotes || entry.safetyNotesList?.length);
}

function hasPrivacyNotes(entry: Pick<Entry, "privacyNotes" | "privacyNotesList">) {
  return Boolean(entry.privacyNotes || entry.privacyNotesList?.length);
}

function isInstallable(
  entry: Pick<Entry, "installCommand" | "configSnippet" | "fullCopy" | "copySnippet">,
) {
  return Boolean(
    entry.installCommand || entry.configSnippet || entry.fullCopy || entry.copySnippet,
  );
}

export function comparisonTrayChipSignals(
  entry: Pick<
    Entry,
    | "safetyNotes"
    | "safetyNotesList"
    | "privacyNotes"
    | "privacyNotesList"
    | "reviewed"
    | "reviewedBy"
    | "reviewedAt"
    | "claimed"
    | "installCommand"
    | "configSnippet"
    | "fullCopy"
    | "copySnippet"
    | "packageVerified"
    | "verifiedAt"
    | "trustSignals"
    | "downloadSha256"
    | "source"
    | "sourceSubmissionUrl"
    | "importPrUrl"
  >,
): ComparisonTrayChipSignals {
  const packageTrust = packageTrustCompareSignal(entry);
  const sourceProvenance = sourceProvenanceCompareSignal(entry);

  return {
    hasSafetyNotes: hasSafetyNotes(entry),
    hasPrivacyNotes: hasPrivacyNotes(entry),
    reviewed: reviewCompareSignal(entry).tone !== "missing",
    claimed: Boolean(entry.claimed),
    installable: isInstallable(entry),
    packageTrustTone: packageTrust.tone,
    sourceProvenanceTone: sourceProvenance.tone,
  };
}

export function comparisonTrayHintMessages(entries: Entry[]): string[] {
  const summary = compareSurfaceSummary(entries);
  const hints: string[] = [];
  const decisionHint = compareCuratedDecisionBannerText(summary.decision);
  const actionHint = compareCuratedActionBannerText(summary.actionsDiverge);
  if (decisionHint) hints.push(decisionHint);
  if (actionHint) hints.push(actionHint);
  return hints;
}

export function comparisonTrayUiState(entries: Entry[]): ComparisonTrayUiState {
  const summary = compareSurfaceSummary(entries);
  const hints = comparisonTrayHintMessages(entries);

  return {
    count: entries.length,
    maxCount: COMPARISON_TRAY_MAX_ITEMS,
    canQuickCompare: entries.length >= 2,
    canOpenFullCompare: entries.length >= 2,
    compareIds: entries.map((entry) => `${entry.category}/${entry.slug}`).join(","),
    primaryHint: hints[0] ?? null,
    hints,
    hasTrustDivergence: summary.hasAnyDivergence,
  };
}

export function comparisonTrayClearAriaLabel(count: number): string {
  return count === 1 ? "Clear 1 entry from compare" : `Clear ${count} entries from compare`;
}

export function comparisonTrayTrustDivergenceBadgeLabel(
  hasTrustDivergence: boolean,
): string | null {
  return hasTrustDivergence ? "Trust gap" : null;
}

export function comparisonTraySecondaryHint(hints: string[]): string | null {
  return hints[1] ?? null;
}
