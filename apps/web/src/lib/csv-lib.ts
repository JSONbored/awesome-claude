/**
 * Pure CSV-cell escaping helper.
 *
 * `csvEscape` normalizes a single cell value for safe CSV output: it neutralizes
 * spreadsheet formula-injection prefixes (`=`, `+`, `-`, `@`) by prepending a
 * single quote, and quotes/escapes values that contain commas, quotes, or line
 * breaks. Everything here is deterministic given its input; the public surface
 * (`csv.ts` / `@/lib/csv`) re-exports the helper below.
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
  return /[",\n\r]/.test(normalized) ? `"${normalized.replaceAll('"', '""')}"` : normalized;
}
