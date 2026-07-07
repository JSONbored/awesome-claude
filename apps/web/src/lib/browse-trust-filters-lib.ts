/**
 * Pure browse trust-signal filter helpers.
 *
 * Centralizes trust quick-filter options, facet counting, and utility
 * dropdown labels for the browse directory. Given the same registry slice
 * and URL state the output is deterministic.
 */

import { countSearchResults, TRUST_SIGNAL_FILTERS, type TrustSignalFilter } from "@/data/search";
import type { Category, Platform, SourceStatus, TrustLevel } from "@/types/registry";

export const BROWSE_TRUST_SIGNAL_OPTIONS: { id: TrustSignalFilter; label: string }[] = [
  { id: "safety-notes", label: "Safety notes" },
  { id: "privacy-notes", label: "Privacy notes" },
  { id: "source-backed", label: "Source-backed" },
  { id: "trusted-package", label: "Trusted package" },
  { id: "reviewed", label: "Reviewed" },
  { id: "checksums", label: "Checksums" },
];

const BROWSE_TRUST_SIGNAL_LABEL = Object.fromEntries(
  BROWSE_TRUST_SIGNAL_OPTIONS.map((option) => [option.id, option.label]),
) as Record<TrustSignalFilter, string>;

export type BrowseTrustSearchSlice = {
  q: string;
  category: string;
  trust: string;
  source: string;
  signal: string;
  platform: string;
  sort: "popular" | "newest" | "title";
};

export type BrowseTrustUtilityOption = {
  id: "" | TrustSignalFilter;
  label: string;
  count: number;
};

export function isBrowseTrustSignalFilter(value: string): value is TrustSignalFilter {
  return TRUST_SIGNAL_FILTERS.includes(value as TrustSignalFilter);
}

export function browseTrustSignalLabel(value: string): string {
  return isBrowseTrustSignalFilter(value) ? BROWSE_TRUST_SIGNAL_LABEL[value] : "";
}

export function toggleBrowseTrustSignal(
  current: string,
  next: TrustSignalFilter,
): "" | TrustSignalFilter {
  return current === next ? "" : next;
}

function toSearchFilters(slice: BrowseTrustSearchSlice, signalOverride?: string) {
  const signal = signalOverride ?? slice.signal;
  return {
    q: slice.q,
    categories: slice.category ? [slice.category as Category] : undefined,
    trust: slice.trust ? [slice.trust as TrustLevel] : undefined,
    source: slice.source ? [slice.source as SourceStatus] : undefined,
    signal: isBrowseTrustSignalFilter(signal) ? signal : ("" as const),
    platforms: slice.platform ? [slice.platform as Platform] : undefined,
    sort: slice.sort,
  };
}

export function buildBrowseTrustSignalCounts(
  slice: BrowseTrustSearchSlice,
  countFn: typeof countSearchResults = countSearchResults,
): Record<TrustSignalFilter, number> {
  return Object.fromEntries(
    BROWSE_TRUST_SIGNAL_OPTIONS.map((option) => [
      option.id,
      countFn(toSearchFilters(slice, option.id)),
    ]),
  ) as Record<TrustSignalFilter, number>;
}

export function formatBrowseTrustUtilityOptionLabel(label: string, count: number): string {
  return `${label} (${count})`;
}

export function buildBrowseTrustUtilityOptions(
  counts: Record<TrustSignalFilter, number>,
): BrowseTrustUtilityOption[] {
  return [
    { id: "", label: "All trust signals", count: 0 },
    ...BROWSE_TRUST_SIGNAL_OPTIONS.map((option) => ({
      id: option.id,
      label: formatBrowseTrustUtilityOptionLabel(option.label, counts[option.id] ?? 0),
      count: counts[option.id] ?? 0,
    })),
  ];
}

export function browseTrustRelaxationTrials(
  slice: BrowseTrustSearchSlice,
): { label: string; patch: Partial<BrowseTrustSearchSlice> }[] {
  const trials: { label: string; patch: Partial<BrowseTrustSearchSlice> }[] = [];
  if (slice.platform) {
    trials.push({ label: `Remove platform "${slice.platform}"`, patch: { platform: "" } });
  }
  if (isBrowseTrustSignalFilter(slice.signal)) {
    trials.push({
      label: `Remove signal "${browseTrustSignalLabel(slice.signal)}"`,
      patch: { signal: "" },
    });
  }
  if (slice.source) {
    trials.push({ label: `Remove source "${slice.source}"`, patch: { source: "" } });
  }
  if (slice.trust) {
    trials.push({ label: `Remove trust "${slice.trust}"`, patch: { trust: "" } });
  }
  if (slice.category) {
    trials.push({ label: `Remove category "${slice.category}"`, patch: { category: "" } });
  }
  if (slice.q) {
    trials.push({ label: `Clear search "${slice.q}"`, patch: { q: "" } });
  }
  return trials;
}
