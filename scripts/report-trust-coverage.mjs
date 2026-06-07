import fs from "node:fs";
import path from "node:path";

import prettier from "prettier";

import { CATEGORY_SCHEMAS } from "@heyclaude/registry/content-schema";
import { parseSafeFrontmatter } from "@heyclaude/registry/frontmatter";

/*
 * Trust-coverage report.
 *
 * Measures safety / privacy / provenance metadata coverage across the content
 * directory and writes a quality report. Complements audit-content.mjs (which
 * covers SEO + schema completeness) by focusing on the trust surface that
 * epic #552 / #550 is about.
 *
 * Per AGENTS.md, risk-bearing categories (hooks, MCP servers, skills, commands,
 * statuslines) "should disclose meaningful safety/privacy behavior", so a
 * risk-bearing entry missing safetyNotes/privacyNotes is the priority gap.
 *
 *   node scripts/report-trust-coverage.mjs                 # all categories
 *   node scripts/report-trust-coverage.mjs --category mcp,hooks
 */

const repoRoot = process.cwd();
const contentRoot = path.join(repoRoot, "content");

const RISK_BEARING = new Set([
  "hooks",
  "mcp",
  "skills",
  "commands",
  "statuslines",
]);

const SOURCE_URL_FIELDS = [
  "repoUrl",
  "websiteUrl",
  "documentationUrl",
  "sourceUrl",
];

// --- args (mirrors audit-content.mjs) ---
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
  } else if (arg.startsWith("--category=") || arg.startsWith("--categories=")) {
    const value = arg.slice(arg.indexOf("=") + 1);
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
        "reports/trust-coverage",
        `${[...selectedCategories].sort().join("-")}.json`,
      )
    : path.join(repoRoot, "content/data/trust-coverage.json");

const has = (value) =>
  Array.isArray(value)
    ? value.length > 0
    : value !== undefined && value !== null && String(value).trim() !== "";

const entries = [];

for (const category of Object.keys(CATEGORY_SCHEMAS)) {
  if (selectedCategories.size > 0 && !selectedCategories.has(category)) {
    continue;
  }

  const categoryDir = path.join(contentRoot, category);
  if (!fs.existsSync(categoryDir)) continue;

  const riskBearing = RISK_BEARING.has(category);

  for (const fileName of fs.readdirSync(categoryDir)) {
    if (!fileName.endsWith(".mdx")) continue;

    const filePath = path.join(categoryDir, fileName);
    const { data } = parseSafeFrontmatter(fs.readFileSync(filePath, "utf8"));

    const trust = {
      safetyNotes: has(data.safetyNotes),
      privacyNotes: has(data.privacyNotes),
      sourceBacked: SOURCE_URL_FIELDS.some((field) => has(data[field])),
      repoUrl: has(data.repoUrl),
      attributed: has(data.submittedBy) || has(data.authorProfileUrl),
      disclosure: has(data.disclosure),
      packageVerified: data.packageVerified === true,
    };

    // Missing risk-disclosures: safety/privacy notes are expected on
    // risk-bearing entries. Source-backing is tracked separately as
    // trust.sourceBacked and in the aggregate coverage block.
    const trustGaps = [];
    if (riskBearing && !trust.safetyNotes) trustGaps.push("safetyNotes");
    if (riskBearing && !trust.privacyNotes) trustGaps.push("privacyNotes");

    entries.push({
      category,
      slug: String(data.slug ?? fileName.replace(/\.mdx$/, "")),
      filePath: path.relative(repoRoot, filePath),
      riskBearing,
      trust,
      trustGaps,
    });
  }
}

// --- aggregate ---
const pct = (count, total) =>
  total === 0 ? 0 : Math.round((count / total) * 100);
const countWhere = (list, fn) => list.filter(fn).length;

const presentCategories = [...new Set(entries.map((e) => e.category))].sort();

const perCategory = {};
for (const category of presentCategories) {
  const list = entries.filter((e) => e.category === category);
  perCategory[category] = {
    entries: list.length,
    riskBearing: RISK_BEARING.has(category),
    safetyNotes: pct(
      countWhere(list, (e) => e.trust.safetyNotes),
      list.length,
    ),
    privacyNotes: pct(
      countWhere(list, (e) => e.trust.privacyNotes),
      list.length,
    ),
    sourceBacked: pct(
      countWhere(list, (e) => e.trust.sourceBacked),
      list.length,
    ),
    attributed: pct(
      countWhere(list, (e) => e.trust.attributed),
      list.length,
    ),
  };
}

const risk = entries.filter((e) => e.riskBearing);
const riskWithBoth = countWhere(
  risk,
  (e) => e.trust.safetyNotes && e.trust.privacyNotes,
);

const riskCategories = [...RISK_BEARING]
  .filter((category) => entries.some((e) => e.category === category))
  .sort();

const riskByCategory = {};
for (const category of riskCategories) {
  const list = entries.filter((e) => e.category === category);
  const covered = countWhere(
    list,
    (e) => e.trust.safetyNotes && e.trust.privacyNotes,
  );
  riskByCategory[category] = {
    entries: list.length,
    covered,
    missing: list.length - covered,
    coveragePct: pct(covered, list.length),
  };
}

// Prioritized worklist: risk-bearing entries missing safety/privacy, with the
// lowest-coverage categories first.
const categoryRank = Object.fromEntries(
  Object.entries(riskByCategory)
    .sort((a, b) => a[1].coveragePct - b[1].coveragePct)
    .map(([category], index) => [category, index]),
);
const gaps = risk
  .filter((e) => e.trustGaps.length > 0)
  .sort(
    (a, b) =>
      (categoryRank[a.category] ?? 99) - (categoryRank[b.category] ?? 99) ||
      a.slug.localeCompare(b.slug),
  )
  .map((e) => ({
    category: e.category,
    slug: e.slug,
    filePath: e.filePath,
    missing: e.trustGaps,
  }));

const summary = {
  totals: {
    entries: entries.length,
    categories: Object.fromEntries(
      presentCategories.map((category) => [
        category,
        perCategory[category].entries,
      ]),
    ),
  },
  riskBearing: {
    categories: riskCategories,
    entries: risk.length,
    withSafetyAndPrivacy: riskWithBoth,
    coveragePct: pct(riskWithBoth, risk.length),
    missing: risk.length - riskWithBoth,
    byCategory: riskByCategory,
  },
  coverage: {
    safetyNotes: pct(
      countWhere(entries, (e) => e.trust.safetyNotes),
      entries.length,
    ),
    privacyNotes: pct(
      countWhere(entries, (e) => e.trust.privacyNotes),
      entries.length,
    ),
    sourceBacked: pct(
      countWhere(entries, (e) => e.trust.sourceBacked),
      entries.length,
    ),
    attributed: pct(
      countWhere(entries, (e) => e.trust.attributed),
      entries.length,
    ),
  },
  perCategory,
};

const out = { summary, gaps, entries };

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(
  reportPath,
  await prettier.format(JSON.stringify(out), { parser: "json" }),
);

// --- console summary ---
console.log(`Wrote ${path.relative(repoRoot, reportPath)}`);
if (selectedCategories.size > 0) {
  console.log(`Selected categories: ${[...selectedCategories].join(", ")}`);
}
console.log(`Entries scanned: ${entries.length}`);
console.log(
  `Risk-bearing entries (${riskCategories.join(", ")}): ${risk.length}`,
);
console.log(
  `  with safety + privacy notes: ${riskWithBoth} (${summary.riskBearing.coveragePct}%), missing ${summary.riskBearing.missing}`,
);
console.log("By risk-bearing category (lowest coverage first):");
for (const [category, value] of Object.entries(riskByCategory).sort(
  (a, b) => a[1].coveragePct - b[1].coveragePct,
)) {
  console.log(
    `  ${category.padEnd(12)} ${String(value.covered).padStart(3)}/${String(
      value.entries,
    ).padEnd(
      4,
    )} (${String(value.coveragePct).padStart(3)}%)  missing ${value.missing}`,
  );
}
console.log(
  `Provenance (all ${entries.length}): source-backed ${summary.coverage.sourceBacked}%, attributed ${summary.coverage.attributed}%`,
);
