// Pure parser behind scripts/verify-d1-votes.mjs: extracting the result rows from
// the text `pnpm wrangler d1 execute` prints. Split out from the execFileSync
// caller so the output parsing can be unit-tested without invoking wrangler.

/**
 * Parse the trailing JSON array of a wrangler d1 execute run and return its
 * first statement's `results` (or [] when absent). Throws with the run label
 * when no JSON array can be found in the output.
 */
export function parseWranglerRows(output, label) {
  const jsonMatch = String(output).match(/(\[\s*\{[\s\S]*\])\s*$/);
  if (!jsonMatch) {
    throw new Error(`Could not parse wrangler output for ${label}`);
  }
  const payload = JSON.parse(jsonMatch[1]);
  return payload?.[0]?.results ?? [];
}
