/**
 * Pure MCP registry normalization helpers.
 *
 * Platform alias resolution and bounded pagination/filter normalization live
 * here. Runtime registry handlers stay in `registry.js`.
 */

// Maps a slugified platform filter input to a canonical platform ID, matching
// the canonical IDs in generated artifacts (see packages/registry platforms.js).
const platformAliases = new Map([
  ["claude", "claude-code"],
  ["claude-code", "claude-code"],
  ["claude-desktop", "claude-desktop"],
  ["codex", "codex"],
  ["openai", "codex"],
  ["windsurf", "windsurf"],
  ["gemini", "gemini"],
  ["cursor", "cursor"],
  ["cursor-rules", "cursor"],
  ["vscode", "vscode"],
  ["vs-code", "vscode"],
  ["raycast", "raycast"],
  ["aider", "aider"],
  ["zed", "zed"],
  ["continue", "continue"],
  ["cli", "cli"],
  ["generic-agents", "cli"],
  ["agents", "cli"],
  ["agents-context", "cli"],
  ["agents-md", "cli"],
  ["antigravity", "antigravity"],
]);

export function normalizeText(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

export function normalizeLimit(value, fallback = 10) {
  // Present-but-empty query params (e.g. `?limit=`) coerce to Number("") === 0
  // and would otherwise clamp to 1. Treat blank strings as "absent".
  if (typeof value === "string" && value.trim() === "") return fallback;
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.max(1, Math.min(25, Math.trunc(numeric)));
}

export function normalizeOffset(value) {
  if (typeof value === "string" && value.trim() === "") return 0;
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return Math.max(0, Math.min(5000, Math.trunc(numeric)));
}

export function normalizePlatform(value) {
  const normalized = normalizeText(value).replace(/[^a-z0-9]+/g, "-");
  if (!normalized) return "";
  // Unrecognized input -> "" (callers treat falsy as "no filter"), not raw leak.
  return platformAliases.get(normalized) || "";
}
