/**
 * Pure canonical platform taxonomy helpers.
 *
 * Normalizes free-form platform names from content frontmatter and skill
 * compatibility into canonical IDs. Nothing here touches the network — given
 * the same input strings the output is deterministic.
 *
 * The public surface (`platforms.js` / `@heyclaude/registry`) re-exports
 * everything below so existing imports stay unchanged.
 */

/** Canonical platform IDs (kebab). Mirrors the `Platform` type in apps/web. */
export const PLATFORM_IDS = [
  "claude-code",
  "claude-desktop",
  "cursor",
  "vscode",
  "windsurf",
  "codex",
  "gemini",
  "raycast",
  "cli",
  "aider",
  "zed",
  "continue",
];

/** Human-readable label per canonical ID. */
export const PLATFORM_LABELS = {
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

// Free-form / display aliases -> canonical ID (matched lowercased + trimmed).
export const PLATFORM_ALIASES = Object.freeze({
  claude: "claude-code",
  "claude code": "claude-code",
  "claude-code": "claude-code",
  "claude desktop": "claude-desktop",
  "claude-desktop": "claude-desktop",
  codex: "codex",
  openai: "codex",
  cursor: "cursor",
  "cursor-rules": "cursor",
  windsurf: "windsurf",
  gemini: "gemini",
  raycast: "raycast",
  "generic agents": "cli",
  "generic agents.md": "cli",
  "generic-agents": "cli",
  agents: "cli",
  "agents-md": "cli",
  cli: "cli",
  vscode: "vscode",
  "vs code": "vscode",
  aider: "aider",
  zed: "zed",
  continue: "continue",
});

/** Canonical platform ID for a free-form value, or undefined when unknown. */
export function normalizePlatform(value) {
  if (typeof value !== "string") return undefined;
  const key = value.trim().toLowerCase();
  return Object.hasOwn(PLATFORM_ALIASES, key)
    ? PLATFORM_ALIASES[key]
    : undefined;
}

/**
 * De-duplicated list of canonical platform IDs from free-form values, in first-
 * seen order. Unknown values are dropped rather than emitted as raw labels.
 */
export function normalizePlatforms(values) {
  const out = [];
  const seen = new Set();
  for (const value of values ?? []) {
    const id = normalizePlatform(value);
    if (id && !seen.has(id)) {
      seen.add(id);
      out.push(id);
    }
  }
  return out;
}
