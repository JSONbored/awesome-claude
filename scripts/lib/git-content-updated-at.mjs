// Pure parser behind scripts/build-content-index.mjs: turning the
// `git log --format=@@heyclaude:%cI --name-only -- content` output into a
// map of content file path -> most-recent commit ISO timestamp. Split out from
// the execFileSync caller so the parsing can be unit-tested without a git
// checkout.

/**
 * Parse `git log` output (commit markers interleaved with changed file names)
 * into a Map of "content/....mdx" -> the commit timestamp of its most recent
 * change. Because git logs newest-first, the first timestamp seen for a path
 * wins; blank/unknown commit markers reset the current timestamp so orphan file
 * lines are skipped.
 */
export function parseGitContentUpdatedAt(output) {
  const values = new Map();
  let commitUpdatedAt = null;

  for (const line of String(output ?? "").split("\n")) {
    if (line.startsWith("@@heyclaude:")) {
      commitUpdatedAt = line.slice("@@heyclaude:".length).trim() || null;
      continue;
    }

    const relativePath = line.trim();
    if (
      !commitUpdatedAt ||
      !relativePath.startsWith("content/") ||
      !relativePath.endsWith(".mdx") ||
      values.has(relativePath)
    ) {
      continue;
    }

    values.set(relativePath, commitUpdatedAt);
  }

  return values;
}
