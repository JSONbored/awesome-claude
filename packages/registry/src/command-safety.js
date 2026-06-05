// Heuristic detection of high-risk shell patterns in submitted text (skill
// scripts, MCP commands, install snippets). Advisory only — a triage signal for
// human/maintainer review, never a sandbox or a guarantee of safety.

// Each entry is a recognizable, high-confidence destructive or remote-exec
// pattern. Kept conservative to avoid flagging ordinary scripts.
const DANGEROUS_PATTERNS = [
  {
    label: "pipe-to-shell install",
    pattern: /(?:curl|wget)\b[^\n|]*\|\s*(?:sudo\s+)?(?:ba|z)?sh\b/i,
  },
  {
    label: "recursive force remove",
    pattern: /\brm\s+-[a-z]*r[a-z]*f|\brm\s+-[a-z]*f[a-z]*r/i,
  },
  {
    label: "world-writable chmod",
    pattern: /\bchmod\s+(?:-R\s+)?0?777\b/i,
  },
  {
    label: "raw disk write",
    pattern: /\bdd\b[^\n]*\bof=\/dev\/|\bmkfs(?:\.\w+)?\b/i,
  },
  {
    label: "base64-decoded shell",
    pattern: /\bbase64\s+(?:-d|--decode)\b[^\n|]*\|\s*(?:ba|z)?sh\b/i,
  },
  {
    label: "fork bomb",
    pattern: /:\s*\(\s*\)\s*\{\s*:\s*\|\s*:\s*&\s*\}\s*;\s*:/,
  },
  {
    label: "inline eval of command substitution",
    pattern: /\beval\s+["'`]?\$\(/i,
  },
];

/**
 * Scan text for high-risk shell patterns.
 *
 * @param {unknown} text
 * @returns {string[]} Labels of the matched patterns (empty when none match).
 */
export function scanDangerousShellPatterns(text) {
  const value = String(text ?? "");
  if (!value) return [];

  const labels = [];
  for (const { label, pattern } of DANGEROUS_PATTERNS) {
    if (pattern.test(value)) labels.push(label);
  }
  return labels;
}
