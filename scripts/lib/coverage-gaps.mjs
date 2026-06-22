// Surfaces content-expansion gaps from the registry: per category, the
// high-demand intents (tags that are well-represented across the whole catalog)
// that are thin or absent in that category. It points maintainers at where to
// look — the source URLs and specific candidates are then researched and
// recorded in docs/content-expansion-backlog.md. Deterministic; reads only the
// public registry.

// Tags that describe a platform, packaging, or category rather than a content
// intent — excluded so the gap list surfaces real topics to cover, not
// attributes every entry already carries.
export const NON_INTENT_TAGS = new Set([
  // platforms
  "claude",
  "claude-code",
  "claude-desktop",
  "cursor",
  "codex",
  "gemini-cli",
  "windsurf",
  "raycast",
  "aider",
  "zed",
  "vscode",
  "opencode",
  // packaging / skill attributes
  "capability-pack",
  "general",
  "agent-skills",
  "skill",
  "mcp",
  "hook",
  // category names
  "agents",
  "skills",
  "hooks",
  "commands",
  "rules",
  "guides",
  "tools",
  "statuslines",
  "collections",
]);

/** Per-tag entry counts across all entries, and per category. */
function tally(entries, exclude) {
  const global = new Map();
  const perCategory = new Map();
  for (const entry of entries) {
    const cat = entry.category;
    if (!perCategory.has(cat)) perCategory.set(cat, new Map());
    const catTags = perCategory.get(cat);
    for (const raw of entry.tags ?? []) {
      const tag = String(raw).toLowerCase();
      if (exclude.has(tag)) continue;
      global.set(tag, (global.get(tag) ?? 0) + 1);
      catTags.set(tag, (catTags.get(tag) ?? 0) + 1);
    }
  }
  return { global, perCategory };
}

/**
 * Priority groups of under-covered intents.
 * @param opts.minDemand global tag count to be considered a real intent (default 8)
 * @param opts.maxInCategory at-or-below this count in a category = under-covered (default 1)
 * @param opts.perCategory max gaps surfaced per category (default 12)
 */
export function findCoverageGaps(entries, opts = {}) {
  const minDemand = opts.minDemand ?? 8;
  const maxInCategory = opts.maxInCategory ?? 1;
  const perCategoryLimit = opts.perCategory ?? 12;
  const exclude = opts.exclude ?? NON_INTENT_TAGS;
  const { global, perCategory } = tally(entries, exclude);

  const groups = [];
  for (const [category, catTags] of [...perCategory.entries()].sort()) {
    const gaps = [];
    for (const [tag, demand] of global) {
      if (demand < minDemand) continue;
      const inCategory = catTags.get(tag) ?? 0;
      if (inCategory > maxInCategory) continue;
      // Demand the category does not yet serve.
      gaps.push({ tag, demand, inCategory, gap: demand - inCategory });
    }
    gaps.sort((a, b) => b.gap - a.gap || a.tag.localeCompare(b.tag));
    if (gaps.length > 0) {
      groups.push({
        category,
        gaps: gaps.slice(0, perCategoryLimit),
      });
    }
  }
  return groups;
}
