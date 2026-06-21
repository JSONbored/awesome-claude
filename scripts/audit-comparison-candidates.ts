/**
 * Surfaces a demand-backed backlog of comparison-page candidates: pairs of
 * same-category entries with strong tag overlap (or a typed "alternative"
 * relation) that no hand-maintained comparison page covers yet.
 *
 *   pnpm audit:comparison-candidates            # human-readable backlog
 *   pnpm audit:comparison-candidates -- --json  # machine-readable JSON
 *
 * It never writes pages — comparisons are hand-curated to stay factual and
 * avoid thin content. Maintainers pick from the ranked output.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  findComparisonCandidates,
  pairKey,
} from "./lib/comparison-candidates.mjs";
import { COMPARISONS } from "../apps/web/src/data/comparisons";

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
  ) as { entries: Array<Record<string, unknown>> };
  return atlas.entries;
}

/** Every entry pair already covered by a comparison page. */
function coveredPairs(): Set<string> {
  const covered = new Set<string>();
  for (const comparison of COMPARISONS) {
    const refs = comparison.refs ?? [];
    for (let i = 0; i < refs.length; i += 1) {
      for (let j = i + 1; j < refs.length; j += 1) {
        covered.add(pairKey(refs[i], refs[j]));
      }
    }
  }
  return covered;
}

function main(argv = process.argv.slice(2)) {
  const json = argv.includes("--json");
  const entries = loadEntries();
  const candidates = findComparisonCandidates(entries, coveredPairs(), {
    minOverlap: 4,
    limit: 40,
  });

  if (json) {
    console.log(
      JSON.stringify({ count: candidates.length, candidates }, null, 2),
    );
    return;
  }

  console.log(
    `Comparison-page candidates (${candidates.length}) — not yet covered, ranked by tag overlap:\n`,
  );
  for (const candidate of candidates) {
    const flag = candidate.isAlternative ? " [alternative]" : "";
    console.log(
      `  [${candidate.score}]${flag} ${candidate.category}: ${candidate.pair.join("  vs  ")}`,
    );
    console.log(`        shared: ${candidate.sharedTags.join(", ")}`);
  }
  console.log(
    "\nThese are leads for hand-curated /compare pages — verify intent and source-backed depth before adding to apps/web/src/data/comparisons.ts.",
  );
}

main();
