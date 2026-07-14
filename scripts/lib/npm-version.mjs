// Pure parser behind scripts/check-mcp-release-due.mjs: interpret the stdout of
// `npm view <pkg> version --json`. npm prints a JSON string for a single version,
// but can emit a bare (non-JSON) line in some environments. Split out from the
// spawnSync caller so the parsing can be unit-tested without invoking npm.

/**
 * Parse `npm view ... version --json` stdout into a version string, or null.
 * A JSON string payload is returned as-is; any other JSON shape yields null; a
 * non-JSON payload falls back to the trimmed text (null when empty).
 */
export function parseNpmVersionOutput(stdout) {
  try {
    const parsed = JSON.parse(stdout);
    return typeof parsed === "string" ? parsed : null;
  } catch {
    return String(stdout ?? "").trim() || null;
  }
}
