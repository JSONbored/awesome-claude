import fs from "node:fs";
import path from "node:path";

import prettier from "prettier";

import {
  CATEGORY_SCHEMAS,
  inferSectionBooleans,
  inferStructuredFields,
  normalizeBody,
  validateEntry,
} from "@heyclaude/registry/content-schema";
import { parseSafeFrontmatter } from "@heyclaude/registry/frontmatter";

import { collectContentIssues } from "./lib/content-audit-issues.mjs";

const repoRoot = process.cwd();
const contentRoot = path.join(repoRoot, "content");
const selectedCategories = new Set();

for (let index = 2; index < process.argv.length; index += 1) {
  const arg = process.argv[index];
  if (arg === "--category" || arg === "--categories") {
    const value = process.argv[index + 1] || "";
    for (const category of value.split(",")) {
      const normalized = category.trim();
      if (normalized) selectedCategories.add(normalized);
    }
    index += 1;
  } else if (arg.startsWith("--category=")) {
    const value = arg.slice("--category=".length);
    for (const category of value.split(",")) {
      const normalized = category.trim();
      if (normalized) selectedCategories.add(normalized);
    }
  } else if (arg.startsWith("--categories=")) {
    const value = arg.slice("--categories=".length);
    for (const category of value.split(",")) {
      const normalized = category.trim();
      if (normalized) selectedCategories.add(normalized);
    }
  }
}

const reportPath =
  selectedCategories.size > 0
    ? path.join(
        repoRoot,
        "reports/content-audit",
        `${[...selectedCategories].sort().join("-")}.json`,
      )
    : path.join(repoRoot, "content/data/content-audit.json");

const report = [];

for (const category of Object.keys(CATEGORY_SCHEMAS)) {
  if (selectedCategories.size > 0 && !selectedCategories.has(category)) {
    continue;
  }

  const categoryDir = path.join(contentRoot, category);
  if (!fs.existsSync(categoryDir)) continue;

  for (const fileName of fs.readdirSync(categoryDir)) {
    if (!fileName.endsWith(".mdx")) continue;

    const filePath = path.join(categoryDir, fileName);
    const source = fs.readFileSync(filePath, "utf8");
    const parsed = parseSafeFrontmatter(source);
    const normalizedBody = normalizeBody(parsed.content, category);
    const inferred = inferStructuredFields(
      parsed.data,
      normalizedBody,
      category,
    );
    const validation = validateEntry(category, parsed.data, inferred);
    const sectionFlags = inferSectionBooleans(normalizedBody);
    const issues = collectContentIssues({
      data: parsed.data,
      source,
      category,
      sectionFlags,
    });

    report.push({
      category,
      filePath: path.relative(repoRoot, filePath),
      slug: String(parsed.data.slug ?? fileName.replace(/\.mdx$/, "")),
      sourceType:
        String(parsed.data.repoUrl ?? "").trim() ||
        String(parsed.data.documentationUrl ?? "").trim()
          ? "external"
          : "first_party",
      metadataOnly: !normalizedBody.trim(),
      missingRequired: validation.missingRequired,
      missingRecommended: validation.missingRecommended,
      issues,
    });
  }
}

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(
  reportPath,
  await prettier.format(JSON.stringify(report), { parser: "json" }),
);

const requiredIssues = report.filter(
  (item) => item.missingRequired.length > 0,
).length;
const recommendedIssues = report.filter(
  (item) => item.missingRecommended.length > 0,
).length;
const metadataOnly = report.filter((item) => item.metadataOnly).length;
const semanticIssues = report.filter((item) => item.issues.length > 0).length;

console.log(`Wrote ${path.relative(repoRoot, reportPath)}`);
if (selectedCategories.size > 0) {
  console.log(`Selected categories: ${[...selectedCategories].join(", ")}`);
}
console.log(`Entries with missing required fields: ${requiredIssues}`);
console.log(`Entries with missing recommended fields: ${recommendedIssues}`);
console.log(`Metadata-only entries: ${metadataOnly}`);
console.log(`Entries with semantic issues: ${semanticIssues}`);
