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
