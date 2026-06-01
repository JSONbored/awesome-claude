import fs from "node:fs";
import path from "node:path";

import categorySpec from "@heyclaude/registry/category-spec";

const repoRoot = process.cwd();
const templateRoot = path.join(repoRoot, ".github/ISSUE_TEMPLATE");
const contentRoot = path.join(repoRoot, "content");
const failures = [];
const submissionCategories = new Set(categorySpec.submissionOrder ?? []);

function fail(message) {
  failures.push(message);
}

for (const category of categorySpec.categoryOrder) {
  const spec = categorySpec.categories?.[category];
  if (!spec) {
    fail(`Missing category spec for ${category}`);
    continue;
  }

  if (!fs.existsSync(path.join(contentRoot, category))) {
    fail(`Missing content directory for ${category}`);
  }

  if (!Array.isArray(spec.quickstart) || spec.quickstart.length < 2) {
    fail(`${category}: quickstart must include at least two steps`);
  }

  const seoDescription = String(spec.seoDescription ?? "").trim();
  if (seoDescription.length < 120 || seoDescription.length > 170) {
    fail(
      `${category}: seoDescription must be 120-170 characters for search snippets`,
    );
  }

  if (!submissionCategories.has(category)) {
    continue;
  }

  if (spec.template) {
    fail(`${category}: public issue template reference should be removed`);
  }
}

if (fs.existsSync(templateRoot)) {
  for (const fileName of fs.readdirSync(templateRoot)) {
    if (/^submit-/.test(fileName)) {
      fail(`content issue template should not exist: ${fileName}`);
    }
  }
}

for (const [alias, target] of Object.entries(categorySpec.aliases ?? {})) {
  if (!categorySpec.categoryOrder.includes(target)) {
    fail(`Alias ${alias} points to unknown category ${target}`);
  }
}

if (failures.length) {
  console.error("Category spec validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Category spec validation passed.");
