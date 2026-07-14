// Pure helpers behind scripts/validate-mcp-package.mjs: reading the JSON payload
// out of an MCP tool result / CLI JSON blob, and asserting the safety-metadata
// shape an entry must expose. Split out from the smoke harness so the parsing and
// the shape check can be unit-tested without spawning the packaged MCP server.

/**
 * Assert that `payload` exposes `safetyNotes` and `privacyNotes` as arrays,
 * throwing a labelled error otherwise. Mirrors the safety-metadata contract the
 * packaged MCP server must satisfy.
 */
export function assertSafetyMetadataShape(payload, label) {
  if (!Array.isArray(payload?.safetyNotes)) {
    throw new Error(`${label} did not expose safetyNotes as an array.`);
  }
  if (!Array.isArray(payload?.privacyNotes)) {
    throw new Error(`${label} did not expose privacyNotes as an array.`);
  }
}

/** Parse a JSON blob; when it is an array, return its first element. */
export function parseJsonOutput(output) {
  const parsed = JSON.parse(output);
  return Array.isArray(parsed) ? parsed[0] : parsed;
}

/**
 * Extract the structured JSON payload from an MCP tool result: prefer
 * `structuredContent`, otherwise parse the first text content block. Throws when
 * the result carries no JSON text.
 */
export function parseToolPayload(result) {
  if (result?.structuredContent) return result.structuredContent;
  const text = result?.content?.find((item) => item.type === "text")?.text;
  if (!text) throw new Error("MCP tool response did not include JSON text.");
  return JSON.parse(text);
}
