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

const voteTables = new Set(["votes_by_client", "votes_entries"]);

function wranglerArgs(runMode, command, { json = false } = {}) {
  return [
    "d1",
    "execute",
    d1Binding,
    runMode === "remote" ? "--remote" : "--local",
    "--command",
    command,
    ...(json ? ["--json"] : []),
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
  const jsonText = output.trim();
  if (!jsonText) {
    throw new Error("Could not parse wrangler prune output");
  }
  const payload = JSON.parse(jsonText);
  if (Array.isArray(payload)) {
    const statement = [...payload]
      .reverse()
      .find((result) => Array.isArray(result?.results));
    return statement?.results ?? [];
  }
  return Array.isArray(payload?.results) ? payload.results : [];
}

function sqlString(value) {
  return `'${value.replaceAll("'", "''")}'`;
}

function expectedKeyExclusionPredicate(keys) {
  const chunkSize = 200;
  const sortedKeys = [...keys].sort();
  if (sortedKeys.length === 0) {
    throw new Error(
      "Refusing to build prune predicate for empty content key set",
    );
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
  if (!voteTables.has(tableName)) {
    throw new Error(`Refusing to prune unsupported vote table "${tableName}"`);
  }

  const countRows = runWranglerQuery(
    wranglerArgs(
      runMode,
      `SELECT COUNT(*) AS pruned FROM ${tableName} WHERE ${whereClause};`,
      { json: true },
    ),
  );
  const pruned = Number(countRows?.[0]?.pruned ?? 0);
  if (pruned === 0) {
    return 0;
  }

  runWrangler(
    wranglerArgs(runMode, `DELETE FROM ${tableName} WHERE ${whereClause};`),
  );
  return pruned;
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

  if (expected.size === 0) {
    console.warn(
      `${runMode}: skipping prune because no expected vote keys were enumerated`,
    );
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
