/**
 * Content-expansion gap finder — per category, the high-demand intents that are
 * thin or absent, so maintainers know where to add source-backed entries next.
 *
 *   pnpm audit:coverage-gaps                 # human-readable priority groups
 *   pnpm audit:coverage-gaps -- --json       # machine-readable
 *   pnpm audit:coverage-gaps -- --min-demand 16
 *
 * It surfaces gap *areas* with demand evidence; record the specific candidates
 * (with source URLs and policy-fit) in docs/content-expansion-backlog.md.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { findCoverageGaps } from "./lib/coverage-gaps.mjs";

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
  const args = { json: false, minDemand: 12, perCategory: 12 };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--json") args.json = true;
    else if (argv[i] === "--min-demand")
      args.minDemand = Number(argv[++i]) || 12;
    else if (argv[i] === "--per-category")
      args.perCategory = Number(argv[++i]) || 12;
  }
  return args;
}

function main(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const groups = findCoverageGaps(loadEntries(), {
    minDemand: args.minDemand,
    maxInCategory: 1,
    perCategory: args.perCategory,
  });

  if (args.json) {
    console.log(JSON.stringify({ groups }, null, 2));
    return;
  }

  console.log(
    `Content-expansion gaps — high-demand intents thin or absent per category (demand >= ${args.minDemand}):\n`,
  );
  for (const group of groups) {
    console.log(`  ${group.category}`);
    for (const gap of group.gaps) {
      console.log(
        `      ${gap.tag} — demand ${gap.demand} across the catalog, ${gap.inCategory} in ${group.category}`,
      );
    }
  }
  console.log(
    "\nRecord specific source-backed candidates per gap in docs/content-expansion-backlog.md.",
  );
}

main();
