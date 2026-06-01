import { execFileSync } from "node:child_process";
import path from "node:path";

import { enumerateContentVoteKeys } from "./lib/enumerate-content-vote-keys.mjs";

const repoRoot = process.cwd();
const d1Binding = process.env.SITE_D1_BINDING || "SITE_DB";

const modeArg =
  process.argv.find((arg) => arg.startsWith("--mode=")) ?? "--mode=both";
const mode = modeArg.split("=")[1] ?? "both";
const prune =
  process.argv.includes("--prune") ||
  String(process.env.D1_SYNC_PRUNE ?? "1") !== "0";

if (!["local", "remote", "both"].includes(mode)) {
  console.error(`Invalid mode "${mode}". Use --mode=local|remote|both.`);
  process.exit(1);
}

const expected = enumerateContentVoteKeys(repoRoot);

const statements = [];
const preview = [];
for (const entryKey of [...expected].sort()) {
  const safeKey = entryKey.replaceAll("'", "''");
  statements.push(
    `INSERT OR IGNORE INTO votes_entries (entry_key, upvote_count, updated_at) VALUES ('${safeKey}', 0, CURRENT_TIMESTAMP);`,
  );
  if (preview.length < 10) {
    preview.push({ entryKey, upvoteCount: 0 });
  }
}

if (process.env.DEBUG_SYNC === "1") {
  console.log("sync preview", preview);
}

function wranglerArgs(runMode, command) {
  return [
    "d1",
    "execute",
    d1Binding,
    runMode === "remote" ? "--remote" : "--local",
    "--command",
    command,
  ];
}

function runWrangler(args) {
  execFileSync("pnpm", ["--filter", "web", "exec", "wrangler", ...args], {
    cwd: repoRoot,
    stdio: "inherit",
  });
}

function runWranglerQuery(args) {
  const output = execFileSync(
    "pnpm",
    ["--filter", "web", "exec", "wrangler", ...args],
    { cwd: repoRoot, encoding: "utf8" },
  );
  const jsonMatch = output.match(/(\[\s*\{[\s\S]*\])\s*$/);
  if (!jsonMatch) {
    throw new Error("Could not parse wrangler prune output");
  }
  return JSON.parse(jsonMatch[1])?.[0]?.results ?? [];
}

function sqlString(value) {
  return `'${value.replaceAll("'", "''")}'`;
}

function expectedKeyExclusionPredicate(keys) {
  const chunkSize = 200;
  const sortedKeys = [...keys].sort();
  if (sortedKeys.length === 0) {
    return "1 = 1";
  }

  const clauses = [];
  for (let index = 0; index < sortedKeys.length; index += chunkSize) {
    const inList = sortedKeys
      .slice(index, index + chunkSize)
      .map(sqlString)
      .join(", ");
    clauses.push(`entry_key NOT IN (${inList})`);
  }
  return clauses.join(" AND ");
}

function pruneTableOrphans(runMode, tableName, whereClause) {
  const rows = runWranglerQuery(
    wranglerArgs(
      runMode,
      `DELETE FROM ${tableName} WHERE ${whereClause}; SELECT changes() AS pruned;`,
    ),
  );
  return Number(rows?.[0]?.pruned ?? 0);
}

function applyMode(runMode) {
  const chunkSize = 50;
  for (let index = 0; index < statements.length; index += chunkSize) {
    const chunk = statements.slice(index, index + chunkSize).join(" ");
    runWrangler([
      "d1",
      "execute",
      d1Binding,
      runMode === "remote" ? "--remote" : "--local",
      "--command",
      chunk,
    ]);
  }

  if (!prune) {
    return;
  }

  const orphanPredicate = expectedKeyExclusionPredicate(expected);
  const clientPruned = pruneTableOrphans(
    runMode,
    "votes_by_client",
    orphanPredicate,
  );
  const entryPruned = pruneTableOrphans(
    runMode,
    "votes_entries",
    orphanPredicate,
  );

  // Defensive reconciliation in case a stale client vote points to a missing entry key.
  runWrangler(
    wranglerArgs(
      runMode,
      "DELETE FROM votes_by_client WHERE entry_key NOT IN (SELECT entry_key FROM votes_entries);",
    ),
  );

  if (entryPruned === 0 && clientPruned === 0) {
    console.log(`${runMode}: no orphan vote rows to prune`);
    return;
  }

  console.log(
    `${runMode}: pruned ${entryPruned} orphan votes_entries row(s) and ${clientPruned} orphan votes_by_client row(s)`,
  );
}

if (mode === "local" || mode === "both") applyMode("local");
if (mode === "remote" || mode === "both") applyMode("remote");

console.log(
  `Ensured ${statements.length} vote rows in D1 (${mode})${prune ? ", prune enabled" : ""}.`,
);
