/**
 * Pure browse theme-distribution helpers.
 *
 * Summarizes which themes (tags) dominate the current browse result set so a
 * user can tell, at a glance, whether a filtered view is focused on a few
 * topics or spread broadly across many. Aggregates tag frequency across the
 * scoped results, reports the top themes with their coverage, and classifies
 * the overall concentration. Purely derived from the entries passed in.
 */

import type { Entry } from "@/types/registry";
import { tagSlug } from "@/lib/tags-lib";

export type BrowseThemeConcentration = "focused" | "mixed" | "diverse";

export type BrowseThemeRow = {
  tag: string;
  slug: string;
  count: number;
  percent: number;
};

export type BrowseThemeDistributionState = {
  showPanel: boolean;
  heading: string;
  summary: string;
  scannedCount: number;
  distinctThemes: number;
  focusPercent: number;
  concentration: BrowseThemeConcentration;
  topThemes: BrowseThemeRow[];
};

const MAX_TOP_THEMES = 8;

function normalizeTags(entry: Entry): string[] {
  const seen = new Set<string>();
  const tags: string[] = [];
  for (const raw of entry.tags ?? []) {
    const tag = raw.trim();
    if (tag.length === 0) {
      continue;
    }
    const key = tag.toLowerCase();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    tags.push(tag);
  }
  return tags;
}

function classifyConcentration(
  focusPercent: number,
  distinctThemes: number,
  scannedCount: number,
): BrowseThemeConcentration {
  if (focusPercent >= 50) {
    return "focused";
  }
  if (distinctThemes >= scannedCount * 2) {
    return "diverse";
  }
  return "mixed";
}

function summarize(
  concentration: BrowseThemeConcentration,
  topThemes: BrowseThemeRow[],
  distinctThemes: number,
): { heading: string; summary: string } {
  const leadNames = topThemes
    .slice(0, 3)
    .map((row) => row.tag)
    .join(", ");
  if (concentration === "focused") {
    return {
      heading: `Results center on ${topThemes[0]?.tag ?? "a single theme"}`,
      summary: `${topThemes[0]?.percent ?? 0}% of this view shares the top theme. Leading themes: ${leadNames}.`,
    };
  }
  if (concentration === "diverse") {
    return {
      heading: "Themes are broadly spread across this view",
      summary: `${distinctThemes} distinct themes with no dominant one. Most common: ${leadNames}.`,
    };
  }
  return {
    heading: "A few themes lead this view",
    summary: `${distinctThemes} distinct themes; the most common are ${leadNames}.`,
  };
}

/**
 * Build the theme-distribution state for the current browse results. Tag
 * frequency is counted as the number of scoped entries carrying each tag
 * (case-insensitive, de-duplicated within an entry). `scannedCount` caps how
 * many of the top results are summarized.
 */
export function browseThemeDistributionState(
  entries: Entry[],
  scannedCount = 24,
): BrowseThemeDistributionState {
  const scoped = entries.slice(0, scannedCount);

  const counts = new Map<string, { tag: string; count: number }>();
  for (const entry of scoped) {
    for (const tag of normalizeTags(entry)) {
      const slug = tagSlug(tag);
      const existing = counts.get(slug);
      if (existing) {
        existing.count += 1;
      } else {
        counts.set(slug, { tag, count: 1 });
      }
    }
  }

  const rows: BrowseThemeRow[] = Array.from(counts.entries())
    .map(([slug, value]) => ({
      tag: value.tag,
      slug,
      count: value.count,
      percent: scoped.length === 0 ? 0 : Math.round((value.count / scoped.length) * 100),
    }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));

  const topThemes = rows.slice(0, MAX_TOP_THEMES);
  const distinctThemes = rows.length;
  const focusPercent = topThemes[0]?.percent ?? 0;
  const concentration = classifyConcentration(focusPercent, distinctThemes, scoped.length);
  const summary = summarize(concentration, topThemes, distinctThemes);

  return {
    showPanel: scoped.length >= 3 && topThemes.length >= 2,
    heading: summary.heading,
    summary: summary.summary,
    scannedCount: scoped.length,
    distinctThemes,
    focusPercent,
    concentration,
    topThemes,
  };
}
