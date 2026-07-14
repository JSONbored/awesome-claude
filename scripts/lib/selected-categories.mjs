// Pure CLI parser shared by scripts/audit-content.mjs and
// scripts/validate-content.mjs: collect the category filter from --category /
// --categories flags (space- or =-separated, each a comma list) into a Set.
// Split out so the parsing can be unit-tested without process.argv.

/**
 * Parse the category-filter flags out of `argv` into a Set of category names.
 * Accepts `--category <list>`, `--categories <list>`, `--category=<list>`, and
 * `--categories=<list>`, where <list> is a comma-separated list; blank entries
 * are skipped. Unrecognized args are ignored.
 */
export function parseSelectedCategories(argv) {
  const selected = new Set();
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--category" || arg === "--categories") {
      const value = argv[index + 1] || "";
      for (const category of value.split(",")) {
        const normalized = category.trim();
        if (normalized) selected.add(normalized);
      }
      index += 1;
    } else if (arg.startsWith("--category=")) {
      const value = arg.slice("--category=".length);
      for (const category of value.split(",")) {
        const normalized = category.trim();
        if (normalized) selected.add(normalized);
      }
    } else if (arg.startsWith("--categories=")) {
      const value = arg.slice("--categories=".length);
      for (const category of value.split(",")) {
        const normalized = category.trim();
        if (normalized) selected.add(normalized);
      }
    }
  }
  return selected;
}
