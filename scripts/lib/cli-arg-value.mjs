// Pure CLI flag reader behind scripts/analyze-submission-risk.mjs: returns the
// value following a --flag in an argv list. Split out - with argv injected - so
// the lookup can be unit-tested without mutating process.argv.

/**
 * Return the token following `flag` in `argv`, or "" when the flag is absent or
 * is the last token (no value after it).
 */
export function argValue(flag, argv = process.argv) {
  const idx = argv.indexOf(flag);
  if (idx < 0) return "";
  return argv[idx + 1] ?? "";
}
