/**
 * Escape a single value for safe inclusion in a CSV cell. Prefixes formula-
 * injection characters (`= + - @`) with a literal `'` and double-quotes any
 * cell that contains `"`, `,`, or a newline per RFC 4180.
 */
export function csvEscape(value: unknown) {
  const raw = String(value ?? "");
  const trimmedStart = raw.trimStart();
  const normalized =
    trimmedStart.startsWith("=") ||
    trimmedStart.startsWith("+") ||
    trimmedStart.startsWith("-") ||
    trimmedStart.startsWith("@")
      ? `'${raw}`
      : raw;
  return /[",\n\r]/.test(normalized)
    ? `"${normalized.replaceAll('"', '""')}"`
    : normalized;
}

/**
 * Build a single CSV row by escaping each value in `cells` and joining them
 * with a comma. Returns a bare string without a trailing newline so callers
 * can join rows with the line ending of their choice.
 *
 * @example csvRow(["Alice", 'She said "hi"', 42]) // 'Alice,"She said ""hi""",42'
 */
export function csvRow(cells: readonly unknown[]): string {
  return cells.map(csvEscape).join(",");
}

/**
 * Serialise a complete CSV document: a header row followed by zero or more
 * data rows, each separated by `\n`. The resulting string does not have a
 * trailing newline.
 *
 * @example
 * csvDocument(["name", "score"], [["Alice", 95], ["Bob", 87]])
 * // "name,score\nAlice,95\nBob,87"
 */
export function csvDocument(
  header: readonly string[],
  rows: ReadonlyArray<readonly unknown[]>,
): string {
  return [csvRow(header), ...rows.map(csvRow)].join("\n");
}
