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

function runWrangler(args) {
  execFileSync("pnpm", ["--filter", "web", "exec", "wrangler", ...args], {
    cwd: repoRoot,
    stdio: "inherit",
  });
}

function getVoteEntryKeys(runMode, tableName) {
  const output = execFileSync(
    "pnpm",
    [
      "--filter",
      "web",
      "exec",
      "wrangler",
      "d1",
      "execute",
      d1Binding,
      runMode === "remote" ? "--remote" : "--local",
      "--command",
      `SELECT entry_key FROM ${tableName};`,
    ],
    { cwd: repoRoot, encoding: "utf8" },
  );
  const jsonMatch = output.match(/(\[\s*\{[\s\S]*\])\s*$/);
  if (!jsonMatch) {
    throw new Error(`Could not parse wrangler output for ${runMode}`);
  }
  const payload = JSON.parse(jsonMatch[1]);
  return (payload?.[0]?.results ?? []).map((row) => String(row.entry_key));
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

  const actualEntryKeys = getVoteEntryKeys(runMode, "votes_entries");
  const actualClientKeys = getVoteEntryKeys(runMode, "votes_by_client");
  const entryOrphans = actualEntryKeys.filter((key) => !expected.has(key));
  const clientOrphans = actualClientKeys.filter((key) => !expected.has(key));

  const pruneTableKeys = (tableName, keys) => {
    for (let index = 0; index < keys.length; index += chunkSize) {
      const chunk = keys.slice(index, index + chunkSize);
      const inList = chunk
        .map((key) => `'${key.replaceAll("'", "''")}'`)
        .join(", ");
      runWrangler([
        "d1",
        "execute",
        d1Binding,
        runMode === "remote" ? "--remote" : "--local",
        "--command",
        `DELETE FROM ${tableName} WHERE entry_key IN (${inList});`,
      ]);
    }
  };

  if (entryOrphans.length === 0 && clientOrphans.length === 0) {
    console.log(`${runMode}: no orphan vote rows to prune`);
    return;
  }

  pruneTableKeys("votes_entries", entryOrphans);
  pruneTableKeys("votes_by_client", clientOrphans);

  // Defensive reconciliation in case a stale client vote points to a missing entry key.
  runWrangler([
    "d1",
    "execute",
    d1Binding,
    runMode === "remote" ? "--remote" : "--local",
    "--command",
    "DELETE FROM votes_by_client WHERE entry_key NOT IN (SELECT entry_key FROM votes_entries);",
  ]);

  console.log(
    `${runMode}: pruned ${entryOrphans.length} orphan votes_entries row(s) and ${clientOrphans.length} orphan votes_by_client row(s)`,
  );
}

if (mode === "local" || mode === "both") applyMode("local");
if (mode === "remote" || mode === "both") applyMode("remote");

console.log(
  `Ensured ${statements.length} vote rows in D1 (${mode})${prune ? ", prune enabled" : ""}.`,
);
