// Pure parsers behind scripts/validate-mcp-package.mjs: reading the JSON payload
// out of an MCP tool result and out of a CLI JSON blob. Split out from the smoke
// harness so the extraction/branching can be unit-tested without spawning the
// packaged MCP server.

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
