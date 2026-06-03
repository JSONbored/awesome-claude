import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import categorySpec from "@heyclaude/registry/category-spec";
import { parseSafeFrontmatter } from "@heyclaude/registry/frontmatter";

import { repoRoot } from "./helpers/registry-fixtures";

type ReadmeEntry = {
  category: string;
  slug: string;
  title: string;
  description: string;
};

function readContentEntries() {
  const contentRoot = path.join(repoRoot, "content");
  const entries: ReadmeEntry[] = [];

  for (const category of categorySpec.categoryOrder) {
    const categoryDir = path.join(contentRoot, category);
    for (const fileName of fs
      .readdirSync(categoryDir)
      .filter((name) => name.endsWith(".mdx"))
      .sort()) {
      const source = fs.readFileSync(path.join(categoryDir, fileName), "utf8");
      const { data } = parseSafeFrontmatter(source);
      entries.push({
        category,
        slug: String(data.slug ?? fileName.replace(/\.mdx$/, "")),
        title: String(data.title ?? fileName.replace(/\.mdx$/, "")),
        description: String(data.description ?? ""),
      });
    }
  }

  return entries;
}

function headingAnchor(label: string) {
  return label
    .replace(/^#+\s*/, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

const categoryReadmeLabels: Record<string, string> = {
  agents: "AI Agents",
  collections: "Collections",
  commands: "Commands",
  guides: "Guides",
  hooks: "Hooks",
  mcp: "MCP Servers",
  rules: "Rules",
  skills: "Skills",
  statuslines: "Statuslines",
  tools: "Tools",
};

function generateReadme() {
  return execFileSync(
    process.execPath,
    [path.join(repoRoot, "scripts/generate-readme.mjs"), "--stdout"],
    {
      cwd: repoRoot,
      encoding: "utf8",
    },
  );
}

describe("generated README catalog", () => {
  const readme = generateReadme();
  const entries = readContentEntries();

  it("includes every file-backed content entry with its canonical URL and description", () => {
    for (const entry of entries) {
      expect(readme, `${entry.category}/${entry.slug}`).toContain(
        `https://heyclau.de/entry/${entry.category}/${entry.slug}`,
      );
      expect(readme, `${entry.category}/${entry.slug}`).toContain(
        entry.description,
      );
    }
  });

  it("keeps category counts aligned with content files", () => {
    const total = entries.length;
    expect(readme).toContain(`${total}+ file-backed entries`);

    for (const category of categorySpec.categoryOrder) {
      const count = entries.filter(
        (entry) => entry.category === category,
      ).length;
      const label = categorySpec.categories[category]?.label ?? category;
      expect(readme).toContain(
        `href="#${headingAnchor(categoryReadmeLabels[category] ?? label)}"`,
      );
      expect(readme).toContain(`<code>${count}</code>`);
      expect(readme).toContain(`(${count})`);
    }
  });

  it("keeps machine-readable distribution links visible near the top", () => {
    const top = readme.slice(0, 5200);
    expect(top).toContain("https://heyclau.de/api/registry/feed");
    expect(top).toContain("https://heyclau.de/llms-full.txt");
    expect(top).toContain("integrations/raycast");
    expect(top).toContain("packages/mcp");
    expect(top).toContain("https://heyclau.de/api/mcp");
    expect(top).toContain("https://heyclau.de/jobs");
    expect(top).toContain("https://heyclau.de/claim");
    expect(top).toContain("https://awesome.re/mentioned-badge.svg");
    expect(top).toContain("https://gittensor.io/repositories");
  });
});
