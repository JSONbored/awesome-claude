/**
 * Pure browse active-filter decision hint helpers.
 *
 * Builds trust-oriented guidance when browse filters narrow the registry
 * without touching the network. Given the same slice and result metadata the
 * output is deterministic.
 */

import type { Entry, TrustLevel } from "@/types/registry";
import {
  browseTrustSignalLabel,
  isBrowseTrustSignalFilter,
  type BrowseTrustSearchSlice,
} from "@/lib/browse-trust-filters-lib";

const TRUST_LEVEL_ORDER: TrustLevel[] = ["trusted", "review", "limited", "blocked"];

export type BrowseFilterDecisionKind =
  | "trust-mix"
  | "signal-filter"
  | "trust-filter"
  | "narrow-set"
  | "compare";

export type BrowseFilterDecisionUiState = {
  hint: string | null;
  kind: BrowseFilterDecisionKind | null;
};

export function browseActiveFilterCount(slice: BrowseTrustSearchSlice): number {
  return (
    Number(!!slice.q) +
    Number(!!slice.category) +
    Number(!!slice.trust) +
    Number(!!slice.source) +
    Number(!!slice.signal) +
    Number(!!slice.platform)
  );
}

export function browseFilteredTrustMixHint(entries: Entry[]): string | null {
  if (entries.length < 2) return null;

  const counts: Partial<Record<TrustLevel, number>> = {};
  for (const entry of entries) {
    counts[entry.trust] = (counts[entry.trust] ?? 0) + 1;
  }

  const levels = TRUST_LEVEL_ORDER.filter((level) => (counts[level] ?? 0) > 0);
  if (levels.length < 2) return null;

  const parts = levels.map((level) => `${counts[level]} ${level}`);
  return `${parts.join(" · ")} in this set — compare to see which signals differ.`;
}

export function browseFilterDecisionUiState(
  slice: BrowseTrustSearchSlice,
  results: Entry[],
  compareCount = 0,
): BrowseFilterDecisionUiState {
  const activeCount = browseActiveFilterCount(slice);
  if (activeCount === 0 || results.length === 0) {
    return { hint: null, kind: null };
  }

  const trustMixHint = browseFilteredTrustMixHint(results);
  if (trustMixHint) {
    return { hint: trustMixHint, kind: "trust-mix" };
  }

  if (isBrowseTrustSignalFilter(slice.signal)) {
    const label = browseTrustSignalLabel(slice.signal);
    const hint =
      compareCount >= 2
        ? `${label} filter — open compare to see trust gaps in your selection.`
        : `${label} filter active — add entries to compare trust side by side.`;
    return { hint, kind: "signal-filter" };
  }

  if (slice.trust) {
    return {
      hint: `All ${results.length} results are ${slice.trust} trust — check install risk per entry.`,
      kind: "trust-filter",
    };
  }

  if (activeCount >= 2) {
    const hint =
      compareCount >= 2
        ? "Narrow filter set — open compare to review trust differences."
        : "Narrow filter set — select entries to compare trust side by side.";
    return { hint, kind: "narrow-set" };
  }

  if (compareCount >= 2) {
    return {
      hint: "Open compare to review trust and next steps across your selection.",
      kind: "compare",
    };
  }

  if (
    (slice.q || slice.category || slice.source || slice.platform) &&
    results.length >= 3 &&
    compareCount < 2
  ) {
    return {
      hint: "Select entries to compare install and trust signals side by side.",
      kind: "compare",
    };
  }

  return { hint: null, kind: null };
}
