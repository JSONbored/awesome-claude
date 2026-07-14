// Pure markdown table-cell escaper behind scripts/summarize-job-source-check.mjs:
// escape backslashes/pipes and collapse each internal whitespace run to a single
// space so multi-line/tabbed values stay on one table row. Split out so the
// escaping can be unit-tested in isolation.

/**
 * Escape `value` for a markdown table cell: backslashes then pipes are escaped
 * (backslash-first so the escape can't be neutralized), and every run of
 * whitespace is collapsed to a single space with the result trimmed.
 */
export function escapeTableCell(value) {
  const escaped = String(value ?? "")
    .replaceAll("\\", "\\\\")
    .replaceAll("|", "\\|");

  let output = "";
  let lastWasWhitespace = false;
  for (const char of escaped.trim()) {
    if (char === " " || char === "\n" || char === "\t" || char === "\r") {
      if (!lastWasWhitespace) output += " ";
      lastWasWhitespace = true;
      continue;
    }
    output += char;
    lastWasWhitespace = false;
  }

  return output.trim();
}
