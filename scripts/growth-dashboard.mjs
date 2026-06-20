/**
 * Maintainer growth dashboard — one prioritized worklist of what registry pages
 * to improve next and why, combining SEO snippet gaps and trust-metadata gaps,
 * optionally weighted by Search Console impressions.
 *
 *   pnpm growth:dashboard                       # registry signals only
 *   pnpm growth:dashboard -- --gsc gsc.csv      # demand-weight by GSC impressions
 *   pnpm growth:dashboard -- --json             # machine-readable
 *   pnpm growth:dashboard -- --limit 20
 *
 * Reads the public registry and an optional local GSC export the maintainer
 * supplies; every finding is source-labeled and no private analytics are
 * embedded.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { parseGscImpressions } from "./audit-seo-snippets.mjs";
import { buildWorklist } from "./lib/growth-dashboard.mjs";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

function loadEntries() {
  const atlas = JSON.parse(
    fs.readFileSync(
      path.join(repoRoot, "apps/web/src/generated/atlas-registry.json"),
      "utf8",
    ),
  );
  return atlas.entries ?? [];
}

function parseArgs(argv) {
  const args = { json: false, gsc: "", limit: 50 };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--json") args.json = true;
    else if (argv[i] === "--gsc") args.gsc = argv[++i] || "";
    else if (argv[i] === "--limit") args.limit = Number(argv[++i]) || 50;
  }
  return args;
}

function loadGsc(file) {
  if (!file) return new Map();
  const absolute = path.isAbsolute(file) ? file : path.join(repoRoot, file);
  return parseGscImpressions(fs.readFileSync(absolute, "utf8"));
}

function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const report = buildWorklist(loadEntries(), loadGsc(args.gsc), {
    limit: args.limit,
  });

  if (args.json) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  console.log(
    `Growth worklist — ${report.total} pages with opportunities (source: ${report.source}` +
      `${report.weightedByImpressions ? ", ranked by impressions × gaps" : ", ranked by gap count"}).\n`,
  );
  for (const item of report.items) {
    const demand = item.impressions ? ` · ${item.impressions} impressions` : "";
    console.log(`  ${item.path}${demand}`);
    for (const finding of item.findings) {
      console.log(
        `      [${finding.source}] ${finding.field}: ${finding.detail}`,
      );
    }
  }
  if (!report.weightedByImpressions) {
    console.log(
      "\nTip: pass --gsc <Search Console Pages export.csv> to rank by real demand.",
    );
  }
}

main();
