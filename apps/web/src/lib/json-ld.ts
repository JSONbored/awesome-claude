const SCRIPT_JSON_ESCAPE_PATTERN = /[<>&\u2028\u2029]/g;
const SCRIPT_JSON_ESCAPES: Record<string, string> = {
  "<": "\\u003c",
  ">": "\\u003e",
  "&": "\\u0026",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029",
};

export function stringifyJsonLd(value: unknown) {
  return JSON.stringify(value).replace(
    SCRIPT_JSON_ESCAPE_PATTERN,
    (character) => SCRIPT_JSON_ESCAPES[character] ?? character,
  );
}

/**
 * Safely parse a JSON-LD string. Returns the parsed object when the input is
 * valid JSON, or `null` when the input is missing, empty, or syntactically
 * invalid. Never throws.
 *
 * Use this to parse JSON-LD from server responses or script tags where the
 * source is not fully trusted or may be empty.
 */
export function parseJsonLd(raw: string | null | undefined): Record<string, unknown> | null {
  if (!raw || !raw.trim()) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) return null;
    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}

/**
 * Type guard: returns true when `value` looks like a JSON-LD node — a plain
 * object that carries at least a `@context` or `@type` property. Useful for
 * narrowing values received from an API before passing them to a renderer.
 */
export function isJsonLdNode(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  const obj = value as Record<string, unknown>;
  return "@context" in obj || "@type" in obj;
}
