import type { Entry } from "@/types/registry";

/**
 * Deterministic, structured-field-derived ecosystem statistics for the
 * `/state-of-claude-tooling` data report. Every value is computed from real
 * registry fields (no estimates, no LLM-generated prose) so the numbers — and
 * the `Dataset` JSON-LD that advertises them — are accurate by construction.
 */

export interface StatRow {
  label: string;
  count: number;
}

// Ordered: first matching rule wins. Patterns anchor on the first token of the
// (lowercased) install command so classification is unambiguous.
const INSTALL_METHOD_RULES: ReadonlyArray<readonly [RegExp, string]> = [
  [/^(?:npx|npm)\b/, "npm / npx"],
  [/^pnpm\b/, "pnpm"],
  [/^yarn\b/, "yarn"],
  [/^bunx?\b/, "bun"],
  [/^deno\b/, "deno"],
  [/^(?:uvx?|pipx?)\b|\bpip3? install\b/, "Python (pip / uv)"],
  [/^docker\b/, "Docker"],
  [/^go\b/, "Go"],
  [/^cargo\b/, "Cargo"],
  [/^brew\b/, "Homebrew"],
  [/^claude\b/, "Claude CLI (claude mcp add …)"],
  [/^\//, "Claude slash command"],
  [/^git\b/, "Git clone"],
  [/^(?:curl|wget)\b/, "Shell (curl / wget)"],
  [/^(?:mkdir|cat|cp|mv|echo|touch|tee)\b/, "Manual file setup"],
];

/**
 * Classify an entry's `installCommand` into an install-method bucket.
 * Returns `null` when there is no install command (the resource is a
 * config/file drop-in, not a package install).
 */
export function installMethodOf(installCommand?: string | null): string | null {
  const command = String(installCommand ?? "")
    .trim()
    .toLowerCase();
  if (!command) return null;
  for (const [pattern, label] of INSTALL_METHOD_RULES) {
    if (pattern.test(command)) return label;
  }
  return "Other";
}

/**
 * Distribution of install methods across the entries that declare an
 * `installCommand`. `total` is the size of that installable subset (not the
 * whole catalog), and the row counts sum to exactly `total`.
 */
export function installMethodDistribution(entries: ReadonlyArray<Entry>): {
  rows: StatRow[];
  total: number;
} {
  const counts = new Map<string, number>();
  let total = 0;
  for (const entry of entries) {
    const method = installMethodOf(entry.installCommand);
    if (!method) continue;
    counts.set(method, (counts.get(method) ?? 0) + 1);
    total += 1;
  }
  const rows = [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  return { rows, total };
}

/**
 * Coverage of safety / privacy notes across the catalog. These are HeyClaude's
 * differentiating metadata, so quantifying them is high-signal original data.
 * `both` is bounded by `min(safety, privacy)`; all counts are bounded by
 * `total`.
 */
export function notesCoverage(entries: ReadonlyArray<Entry>): {
  total: number;
  safety: number;
  privacy: number;
  both: number;
} {
  let safety = 0;
  let privacy = 0;
  let both = 0;
  for (const entry of entries) {
    const hasSafety = Boolean(entry.safetyNotes);
    const hasPrivacy = Boolean(entry.privacyNotes);
    if (hasSafety) safety += 1;
    if (hasPrivacy) privacy += 1;
    if (hasSafety && hasPrivacy) both += 1;
  }
  return { total: entries.length, safety, privacy, both };
}

/**
 * Frequency table of every tag across the catalog, sorted by descending count.
 * Tags are normalised to lowercase and stripped of surrounding whitespace.
 * Empty or whitespace-only tag values are skipped. Entries with no tags
 * contribute nothing to the table, but are still counted in `total`.
 *
 * `topN` caps the returned rows (default: unlimited). Useful when the caller
 * only wants the most common tags without pulling hundreds of long-tail rows.
 */
export function tagDistribution(
  entries: ReadonlyArray<Entry>,
  options: { topN?: number } = {},
): { rows: StatRow[]; uniqueTags: number; total: number } {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    const seen = new Set<string>();
    for (const raw of entry.tags ?? []) {
      const tag = String(raw ?? "")
        .trim()
        .toLowerCase();
      if (!tag || seen.has(tag)) continue;
      seen.add(tag);
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  const uniqueTags = counts.size;
  let rows = [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  if (typeof options.topN === "number" && options.topN > 0) {
    rows = rows.slice(0, options.topN);
  }
  return { rows, uniqueTags, total: entries.length };
}

/**
 * Distribution of `difficulty` field values across the catalog.
 * Entries that omit `difficulty` are grouped under the `"unspecified"` bucket.
 * The rows are sorted so that canonical difficulty levels appear in ascending
 * order of experience required (`"beginner"` → `"intermediate"` → `"advanced"`)
 * before any non-standard or `"unspecified"` values.
 */
const DIFFICULTY_ORDER: ReadonlyArray<string> = [
  "beginner",
  "intermediate",
  "advanced",
];

export function difficultyDistribution(entries: ReadonlyArray<Entry>): {
  rows: StatRow[];
  total: number;
} {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    const raw = String(entry.difficulty ?? "")
      .trim()
      .toLowerCase();
    const bucket = raw || "unspecified";
    counts.set(bucket, (counts.get(bucket) ?? 0) + 1);
  }
  const rows = [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => {
      const ai = DIFFICULTY_ORDER.indexOf(a.label);
      const bi = DIFFICULTY_ORDER.indexOf(b.label);
      if (ai !== -1 && bi !== -1) return ai - bi;
      if (ai !== -1) return -1;
      if (bi !== -1) return 1;
      if (a.label === "unspecified") return 1;
      if (b.label === "unspecified") return -1;
      return b.count - a.count || a.label.localeCompare(b.label);
    });
  return { rows, total: entries.length };
}

/**
 * Distribution of `platforms` across installable catalog entries.
 * Each entry's platform list is de-duplicated before tallying so a single
 * entry cannot inflate any bucket's count. Entries with an empty platform list
 * are counted in `total` but contribute nothing to the rows.
 *
 * `total` is the number of entries that declare at least one platform.
 */
export function platformDistribution(entries: ReadonlyArray<Entry>): {
  rows: StatRow[];
  total: number;
} {
  const counts = new Map<string, number>();
  let total = 0;
  for (const entry of entries) {
    const seen = new Set<string>();
    for (const raw of entry.platforms ?? []) {
      const platform = String(raw ?? "").trim().toLowerCase();
      if (!platform || seen.has(platform)) continue;
      seen.add(platform);
      counts.set(platform, (counts.get(platform) ?? 0) + 1);
    }
    if (seen.size > 0) total += 1;
  }
  const rows = [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  return { rows, total };
}

/**
 * Per-category breakdown of safety-note and privacy-note coverage.
 * Useful for identifying which content categories have the weakest metadata
 * quality and where editorial effort should be focused.
 */
export interface CategoryNotesCoverage {
  category: string;
  total: number;
  safety: number;
  privacy: number;
  both: number;
}

export function notesCoverageByCategory(
  entries: ReadonlyArray<Entry>,
): CategoryNotesCoverage[] {
  const byCategory = new Map<
    string,
    { total: number; safety: number; privacy: number; both: number }
  >();

  for (const entry of entries) {
    const cat = String(entry.category ?? "unknown").trim();
    if (!byCategory.has(cat)) {
      byCategory.set(cat, { total: 0, safety: 0, privacy: 0, both: 0 });
    }
    const bucket = byCategory.get(cat)!;
    bucket.total += 1;
    const hasSafety = Boolean(entry.safetyNotes);
    const hasPrivacy = Boolean(entry.privacyNotes);
    if (hasSafety) bucket.safety += 1;
    if (hasPrivacy) bucket.privacy += 1;
    if (hasSafety && hasPrivacy) bucket.both += 1;
  }

  return [...byCategory.entries()]
    .map(([category, counts]) => ({ category, ...counts }))
    .sort((a, b) => b.total - a.total || a.category.localeCompare(b.category));
}
