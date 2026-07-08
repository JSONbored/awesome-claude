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
