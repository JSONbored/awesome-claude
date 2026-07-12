/**
 * Pure browse author-concentration helpers.
 *
 * Summarizes how many distinct authors the current browse result set draws
 * from, and whether it leans on a few prolific authors or is broadly
 * independent. Aggregates author frequency across the scoped results, reports
 * the most-represented authors with their share, and classifies the overall
 * concentration. Purely derived from the entries passed in — distinct from the
 * contributor *profile* helpers, which summarize a single author's catalog.
 */

import type { Entry } from "@/types/registry";

export type AuthorConcentrationLevel = "concentrated" | "mixed" | "diverse";

export type BrowseAuthorRow = {
  author: string;
  count: number;
  percent: number;
};

export type BrowseAuthorConcentrationState = {
  showPanel: boolean;
  heading: string;
  summary: string;
  scannedCount: number;
  distinctAuthors: number;
  topShare: number;
  concentration: AuthorConcentrationLevel;
  topAuthors: BrowseAuthorRow[];
};

const MAX_TOP_AUTHORS = 8;

function classifyConcentration(
  topShare: number,
  distinctAuthors: number,
  scannedCount: number,
): AuthorConcentrationLevel {
  if (topShare >= 35) {
    return "concentrated";
  }
  if (distinctAuthors >= Math.ceil(scannedCount * 0.75)) {
    return "diverse";
  }
  return "mixed";
}

function summarize(
  concentration: AuthorConcentrationLevel,
  topAuthors: BrowseAuthorRow[],
  distinctAuthors: number,
  scannedCount: number,
): { heading: string; summary: string } {
  const leadNames = topAuthors
    .slice(0, 3)
    .map((row) => row.author)
    .join(", ");
  if (concentration === "concentrated") {
    return {
      heading: `Results lean on ${topAuthors[0]?.author ?? "a single author"}`,
      summary: `${topAuthors[0]?.percent ?? 0}% of this view is from the top author. Most represented: ${leadNames}.`,
    };
  }
  if (concentration === "diverse") {
    return {
      heading: "Authors are broadly independent in this view",
      summary: `${distinctAuthors} distinct authors across ${scannedCount} scanned, with no dominant one.`,
    };
  }
  return {
    heading: "A few authors lead this view",
    summary: `${distinctAuthors} distinct authors; the most active are ${leadNames}.`,
  };
}

/**
 * Build the author-concentration state for the current browse results. Authors
 * are counted case-insensitively (first-seen spelling is kept for display).
 * `scannedCount` caps how many of the top results are summarized.
 */
export function browseAuthorConcentrationState(
  entries: Entry[],
  scannedCount = 24,
): BrowseAuthorConcentrationState {
  const scoped = entries.slice(0, scannedCount);

  const counts = new Map<string, { author: string; count: number }>();
  for (const entry of scoped) {
    const author = entry.author?.trim();
    if (!author) {
      continue;
    }
    const key = author.toLowerCase();
    const existing = counts.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      counts.set(key, { author, count: 1 });
    }
  }

  const rows: BrowseAuthorRow[] = Array.from(counts.values())
    .map((value) => ({
      author: value.author,
      count: value.count,
      percent: scoped.length === 0 ? 0 : Math.round((value.count / scoped.length) * 100),
    }))
    .sort((a, b) => b.count - a.count || a.author.localeCompare(b.author));

  const topAuthors = rows.slice(0, MAX_TOP_AUTHORS);
  const distinctAuthors = rows.length;
  const topShare = topAuthors[0]?.percent ?? 0;
  const concentration = classifyConcentration(topShare, distinctAuthors, scoped.length);
  const summary = summarize(concentration, topAuthors, distinctAuthors, scoped.length);

  return {
    showPanel: scoped.length >= 4 && distinctAuthors >= 2,
    heading: summary.heading,
    summary: summary.summary,
    scannedCount: scoped.length,
    distinctAuthors,
    topShare,
    concentration,
    topAuthors,
  };
}
