import fs from "node:fs";
import path from "node:path";

import { parseSafeFrontmatter } from "@heyclaude/registry/frontmatter";

/**
 * Build the set of `category:slug` keys for every MDX entry under content/.
 * @param {string} repoRoot
 * @returns {Set<string>}
 */
export function enumerateContentVoteKeys(repoRoot) {
  const contentRoot = path.join(repoRoot, "content");
  const expected = new Set();

  const categories = fs
    .readdirSync(contentRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== "data")
    .map((entry) => entry.name)
    .sort();

  for (const category of categories) {
    const categoryDir = path.join(contentRoot, category);
    const files = fs
      .readdirSync(categoryDir)
      .filter((fileName) => fileName.endsWith(".mdx"));

    for (const fileName of files) {
      const filePath = path.join(categoryDir, fileName);
      const source = fs.readFileSync(filePath, "utf8");
      const { data } = parseSafeFrontmatter(source);
      const slug = String(data.slug ?? fileName.replace(/\.mdx$/, ""));
      expected.add(`${category}:${slug}`);
    }
  }

  return expected;
}

/**
 * @param {Iterable<string>} actualKeys
 * @param {Set<string>} expectedKeys
 * @returns {string[]}
 */
export function findOrphanVoteKeys(actualKeys, expectedKeys) {
  const orphans = [];
  for (const key of actualKeys) {
    if (!expectedKeys.has(key)) {
      orphans.push(key);
    }
  }
  return orphans.sort();
}
