#!/usr/bin/env node
import { readFile } from "node:fs/promises";

const logPath = process.argv[2] || "reports/web-build-cleanup.log";
const forbiddenPatterns = [
  {
    pattern: /externalized for browser compatibility/i,
    message: "browser build externalized a server-only Node module",
  },
  {
    pattern: /\[EVAL\]/i,
    message: "browser build emitted an eval warning",
  },
  {
    pattern: /gray-matter\/lib\/engines/i,
    message: "gray-matter reached the browser build graph",
  },
];

let log;
try {
  log = await readFile(logPath, "utf8");
} catch (error) {
  console.error(`Missing web build log: ${logPath}`);
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

const failures = forbiddenPatterns
  .filter(({ pattern }) => pattern.test(log))
  .map(({ message }) => message);

if (failures.length) {
  console.error("Web build log failed server-boundary checks:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Web build log passed server-boundary checks: ${logPath}`);
