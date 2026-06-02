import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  enumerateContentVoteKeys,
  findOrphanVoteKeys,
} from "../scripts/lib/enumerate-content-vote-keys.mjs";

describe("d1 vote key helpers", () => {
  it("findOrphanVoteKeys returns keys not in the catalog set", () => {
    const expected = new Set(["mcp:alpha", "skills:beta"]);
    const orphans = findOrphanVoteKeys(
      ["mcp:alpha", "mcp:old-slug", "skills:beta"],
      expected,
    );
    expect(orphans).toEqual(["mcp:old-slug"]);
  });

  it("enumerateContentVoteKeys includes category:slug for mdx entries", () => {
    const keys = enumerateContentVoteKeys(process.cwd());
    expect(keys.size).toBeGreaterThan(0);
    for (const key of keys) {
      expect(key).toMatch(/^[a-z0-9-]+:[a-z0-9-]+$/);
    }
  });

  it("flags orphan votes_by_client entry keys after slug rename", () => {
    const expectedAfterRename = new Set(["skills:new-slug"]);
    const clientVoteKeys = ["skills:old-slug", "skills:new-slug"];
    expect(findOrphanVoteKeys(clientVoteKeys, expectedAfterRename)).toEqual([
      "skills:old-slug",
    ]);
  });

  it("flags orphan votes_by_client entry keys after entry deletion", () => {
    const expectedAfterDelete = new Set(["mcp:kept-entry"]);
    const clientVoteKeys = ["mcp:deleted-entry", "mcp:kept-entry"];
    expect(findOrphanVoteKeys(clientVoteKeys, expectedAfterDelete)).toEqual([
      "mcp:deleted-entry",
    ]);
  });

  it("prunes orphan client votes without reading every votes_by_client row", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "heyclaude-d1-sync-"));
    const fakeBin = path.join(tmpDir, "bin");
    const logPath = path.join(tmpDir, "pnpm-calls.jsonl");
    fs.mkdirSync(fakeBin, { recursive: true });

    const fakePnpm = path.join(fakeBin, "pnpm");
    fs.writeFileSync(
      fakePnpm,
      `#!/usr/bin/env node
const fs = require("node:fs");
const args = process.argv.slice(2);
fs.appendFileSync(process.env.FAKE_PNPM_LOG, JSON.stringify(args) + "\\n");
const json = args.includes("--json");
const commandIndex = args.indexOf("--command");
const command = commandIndex === -1 ? "" : args[commandIndex + 1] || "";
if (/SELECT\\s+entry_key\\s+FROM\\s+votes_by_client/i.test(command)) {
  console.error("unbounded votes_by_client scan detected");
  process.exit(99);
}
if (/SELECT\\s+COUNT\\(\\*\\)\\s+AS\\s+pruned/i.test(command)) {
  if (!json) {
    console.error("expected --json for prune count query");
    process.exit(98);
  }
  process.stdout.write('[{"results":[{"pruned":1}],"success":true}]\\n');
}
`,
      { mode: 0o755 },
    );

    const result = spawnSync(
      process.execPath,
      ["scripts/sync-votes-to-d1.mjs", "--mode=local"],
      {
        cwd: process.cwd(),
        encoding: "utf8",
        env: {
          ...process.env,
          FAKE_PNPM_LOG: logPath,
          PATH: `${fakeBin}${path.delimiter}${process.env.PATH ?? ""}`,
        },
      },
    );

    expect(result.status).toBe(0);
    const calls = fs
      .readFileSync(logPath, "utf8")
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line) as string[]);
    const commands = calls
      .map((args) => args[args.indexOf("--command") + 1] ?? "")
      .filter(Boolean);

    expect(commands.join("\n")).not.toMatch(
      /SELECT\s+entry_key\s+FROM\s+votes_by_client/i,
    );
    expect(commands).toContainEqual(
      expect.stringMatching(
        /SELECT COUNT\(\*\) AS pruned FROM votes_by_client WHERE entry_key NOT IN/,
      ),
    );
    expect(commands).toContainEqual(
      expect.stringMatching(
        /DELETE FROM votes_by_client WHERE entry_key NOT IN/,
      ),
    );
  });

  it("skips prune when no content vote keys are enumerated", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "heyclaude-empty-"));
    const fakeBin = path.join(tmpDir, "bin");
    const logPath = path.join(tmpDir, "pnpm-calls.jsonl");
    fs.mkdirSync(fakeBin, { recursive: true });
    fs.mkdirSync(path.join(tmpDir, "content"), { recursive: true });

    const fakePnpm = path.join(fakeBin, "pnpm");
    fs.writeFileSync(
      fakePnpm,
      `#!/usr/bin/env node
const fs = require("node:fs");
fs.appendFileSync(process.env.FAKE_PNPM_LOG, JSON.stringify(process.argv.slice(2)) + "\\n");
`,
      { mode: 0o755 },
    );

    const result = spawnSync(
      process.execPath,
      [
        path.join(process.cwd(), "scripts/sync-votes-to-d1.mjs"),
        "--mode=local",
      ],
      {
        cwd: tmpDir,
        encoding: "utf8",
        env: {
          ...process.env,
          FAKE_PNPM_LOG: logPath,
          PATH: `${fakeBin}${path.delimiter}${process.env.PATH ?? ""}`,
        },
      },
    );

    expect(result.status).toBe(0);
    expect(result.stderr).toContain(
      "skipping prune because no expected vote keys were enumerated",
    );
    expect(fs.existsSync(logPath)).toBe(false);
  });
});
