// Pure frontmatter linter behind scripts/validate-content.mjs: find duplicated
// top-level YAML keys, which the site build's YAML parser rejects ("duplicated
// mapping key") — breaking the content-index build and every deploy. The lenient
// review parser keeps the last value, so a dupe otherwise slips through; this
// catches it. Split out so the scan can be unit-tested in isolation.

/**
 * Return the list of top-level (indent-0) frontmatter keys that appear more than
 * once in `source`. Block scalars (`key: |`/`>`) and empty-value blocks have
 * their indented continuation lines skipped so nested/list content is not
 * mistaken for a top-level key; sequence items (`- ...`) and comments are ignored.
 * Returns [] when there is no frontmatter block.
 */
export function duplicateTopLevelFrontmatterKeys(source) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(
    String(source || ""),
  );
  if (!match) return [];
  const lines = match[1].split(/\r?\n/);
  const seen = new Set();
  const dupes = new Set();
  let i = 0;
  while (i < lines.length) {
    const head = /^(?!-\s)([^#\s][^:]*?)\s*:(.*)$/.exec(lines[i]);
    if (!head) {
      i += 1;
      continue;
    }
    const key = head[1].trim().replace(/^['"]|['"]$/g, "");
    if (seen.has(key)) dupes.add(key);
    else seen.add(key);
    const inline = head[2].trim();
    i += 1;
    if (/^[|>][+-]?\d*$/.test(inline)) {
      while (
        i < lines.length &&
        (lines[i].trim() === "" || /^\s/.test(lines[i]))
      )
        i += 1;
    } else if (inline === "") {
      while (i < lines.length && /^\s/.test(lines[i]) && lines[i].trim() !== "")
        i += 1;
    }
  }
  return [...dupes];
}
