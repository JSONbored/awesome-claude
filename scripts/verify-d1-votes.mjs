import { execFileSync } from "node:child_process";

import {
  enumerateContentVoteKeys,
  findOrphanVoteKeys,
} from "./lib/enumerate-content-vote-keys.mjs";

const repoRoot = process.cwd();
const d1Binding = process.env.SITE_D1_BINDING || "SITE_DB";

const modeArg =
  process.argv.find((arg) => arg.startsWith("--mode=")) ?? "--mode=both";
const mode = modeArg.split("=")[1] ?? "both";
if (!["local", "remote", "both"].includes(mode)) {
  console.error(`Invalid mode "${mode}". Use --mode=local|remote|both.`);
  process.exit(1);
}

const expected = enumerateContentVoteKeys(repoRoot);

function getRows(runMode, query) {
  const args = [
    "--filter",
    "web",
    "exec",
    "wrangler",
    "d1",
    "execute",
    d1Binding,
    runMode === "remote" ? "--remote" : "--local",
    "--command",
    query,
  ];
  const output = execFileSync("pnpm", args, {
    cwd: repoRoot,
    encoding: "utf8",
  });
  const jsonMatch = output.match(/(\[\s*\{[\s\S]*\])\s*$/);
  if (!jsonMatch) {
    throw new Error(`Could not parse wrangler output for ${runMode}`);
  }
  const payload = JSON.parse(jsonMatch[1]);
  return payload?.[0]?.results ?? [];
}

function verifyRunMode(runMode) {
  const rows = getRows(
    runMode,
    "SELECT entry_key, upvote_count FROM votes_entries;",
  );
  const clientRows = getRows(
    runMode,
    "SELECT DISTINCT entry_key FROM votes_by_client;",
  );
  const actual = new Map(
    rows.map((row) => [String(row.entry_key), Number(row.upvote_count ?? 0)]),
  );
  const clientKeys = clientRows.map((row) => String(row.entry_key));

  const missing = [];
  const negativeCounts = [];
  for (const entryKey of expected.values()) {
    if (!actual.has(entryKey)) {
      missing.push(entryKey);
      continue;
    }
    const count = actual.get(entryKey) ?? 0;
    if (!Number.isFinite(count) || count < 0) {
      negativeCounts.push({ entryKey, actualCount: count });
    }
  }

  const orphans = findOrphanVoteKeys(actual.keys(), expected);
  const clientOrphans = findOrphanVoteKeys(clientKeys, expected);

  return {
    runMode,
    totalExpected: expected.size,
    totalRows: rows.length,
    totalClientRows: clientRows.length,
    missing,
    negativeCounts,
    orphans,
    clientOrphans,
  };
}

const results = [];
if (mode === "local" || mode === "both") results.push(verifyRunMode("local"));
if (mode === "remote" || mode === "both") results.push(verifyRunMode("remote"));

let failed = false;
for (const result of results) {
  if (
    result.missing.length > 0 ||
    result.negativeCounts.length > 0 ||
    result.totalRows < result.totalExpected ||
    result.orphans.length > 0 ||
    result.clientOrphans.length > 0
  ) {
    failed = true;
  }

  console.log(
    `${result.runMode}: expected=${result.totalExpected} rows=${result.totalRows} clientRows=${result.totalClientRows} missing=${result.missing.length} orphans=${result.orphans.length} clientOrphans=${result.clientOrphans.length} invalidCounts=${result.negativeCounts.length}`,
  );

  if (result.missing.length > 0) {
    console.log("First missing rows:");
    for (const entryKey of result.missing.slice(0, 20))
      console.log(`- ${entryKey}`);
  }

  if (result.orphans.length > 0) {
    console.log("First orphan rows:");
    for (const entryKey of result.orphans.slice(0, 20))
      console.log(`- ${entryKey}`);
  }

  if (result.clientOrphans.length > 0) {
    console.log("First orphan client-vote rows:");
    for (const entryKey of result.clientOrphans.slice(0, 20))
      console.log(`- ${entryKey}`);
  }

  if (result.negativeCounts.length > 0) {
    console.log("First invalid counts:");
    for (const item of result.negativeCounts.slice(0, 20)) {
      console.log(`- ${item.entryKey}: actual=${item.actualCount}`);
    }
  }
}

if (failed) {
  process.exit(1);
}
