#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const zeroUuid = "00000000-0000-0000-0000-000000000000";
const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const configPath = path.join(repoRoot, "apps/submission-gate/wrangler.jsonc");
const source = fs.readFileSync(configPath, "utf8");
const prodD1Block = source.match(
  /"binding"\s*:\s*"SUBMISSION_GATE_DB"[\s\S]{0,240}?"database_id"\s*:\s*"([^"]+)"/,
);

if (!prodD1Block) {
  console.error("Could not find production SUBMISSION_GATE_DB database_id.");
  process.exit(1);
}

if (prodD1Block[1] === zeroUuid) {
  console.error(
    "Production submission gate D1 database_id is still a placeholder. Create the production D1 database, update apps/submission-gate/wrangler.jsonc, and apply migrations before deploying prod.",
  );
  process.exit(1);
}
