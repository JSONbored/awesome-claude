/**
 * Display labels for the browse sidebar's facet axes.
 *
 * The chips used to render raw registry ids and lean on CSS `capitalize` to
 * tidy them up. That only uppercases the first letter of each word, so slugs
 * came out as "Claude-Code", "Vscode", "Cli" and "First-Party" — wrong for
 * acronyms and wrong for hyphenated compounds. These maps carry the real
 * labels; chips rendering them opt out of `capitalize` via `preserveCase`.
 */

import type { Platform, SourceStatus, TrustLevel } from "@/types/registry";

// Deliberately a total Record rather than Partial: adding a Platform to the
// union should fail type-check here until it is given a real label, instead of
// silently falling through to the humanized slug.
const PLATFORM_LABELS: Record<Platform, string> = {
  "claude-code": "Claude Code",
  "claude-desktop": "Claude Desktop",
  cursor: "Cursor",
  vscode: "VS Code",
  windsurf: "Windsurf",
  codex: "Codex",
  gemini: "Gemini",
  raycast: "Raycast",
  cli: "CLI",
  aider: "Aider",
  zed: "Zed",
  continue: "Continue",
};

const TRUST_LABELS: Record<TrustLevel, string> = {
  trusted: "Trusted",
  review: "Review first",
  limited: "Limited",
  blocked: "Blocked",
};

const SOURCE_LABELS: Record<SourceStatus, string> = {
  "first-party": "First-party",
  "source-backed": "Source-backed",
  external: "External",
  unverified: "Unverified",
};

/** Fallback for an id not in a map: de-slug and sentence-case it. */
function humanizeFacetId(id: string): string {
  const spaced = id.replace(/[-_]+/g, " ").trim();
  if (!spaced) return id;
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export function platformLabel(id: Platform | string): string {
  return PLATFORM_LABELS[id as Platform] ?? humanizeFacetId(id);
}

export function trustLabel(id: TrustLevel | string): string {
  return TRUST_LABELS[id as TrustLevel] ?? humanizeFacetId(id);
}

export function sourceLabel(id: SourceStatus | string): string {
  return SOURCE_LABELS[id as SourceStatus] ?? humanizeFacetId(id);
}
