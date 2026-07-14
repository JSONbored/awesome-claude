// Pure parser behind scripts/sync-votes-to-d1.mjs: extract the result rows from
// the JSON that `wrangler d1 execute --json` prints. wrangler returns either a
// single result object or an array of per-statement results; this returns the
// relevant `results` array. Split out from the execFileSync caller so the parsing
// can be unit-tested without invoking wrangler.

/**
 * Parse `wrangler d1 execute --json` output into the result rows. For an array
 * payload, use the last statement that carries a `results` array; for an object
 * payload, use its `results`. Returns [] when no results are present, and throws
 * on empty output.
 */
export function parseWranglerQueryResults(output) {
  const jsonText = String(output ?? "").trim();
  if (!jsonText) {
    throw new Error("Could not parse wrangler prune output");
  }
  const payload = JSON.parse(jsonText);
  if (Array.isArray(payload)) {
    const statement = [...payload]
      .reverse()
      .find((result) => Array.isArray(result?.results));
    return statement?.results ?? [];
  }
  return Array.isArray(payload?.results) ? payload.results : [];
}
