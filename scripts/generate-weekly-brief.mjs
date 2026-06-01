#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import {
  buildWeeklyBrief,
  renderWeeklyBriefMarkdown,
} from "@heyclaude/registry/weekly-brief";

const repoRoot = process.cwd();
const defaultDataDir = path.join(repoRoot, "apps/web/public/data");

function argValue(name, fallback = "") {
  const prefix = `${name}=`;
  const match = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  return match ? match.slice(prefix.length) : fallback;
}

function hasFlag(name) {
  return process.argv.slice(2).includes(name);
}

function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

function readJson(filePath, artifactName) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    throw new Error(
      `Unable to read ${artifactName} at ${filePath}. Original error: ${errorMessage(
        error,
      )}`,
    );
  }
}

function envelopeEntries(payload, label) {
  if (!payload || !Array.isArray(payload.entries)) {
    throw new Error(`${label} must contain an entries array.`);
  }
  return payload.entries;
}

function usage() {
  return [
    "Usage: pnpm brief:weekly [--format=markdown|json] [--days=7] [--data-dir=apps/web/public/data]",
    "",
    "Generates a manual-review weekly brief draft from local registry artifacts.",
    "This command prints to stdout only; it does not publish, email, or write files.",
  ].join("\n");
}

if (hasFlag("--help") || hasFlag("-h")) {
  console.log(usage());
  process.exit(0);
}

const format = argValue("--format", "markdown");
const days = Number(argValue("--days", "7"));
const dataDir = path.resolve(repoRoot, argValue("--data-dir", defaultDataDir));

if (!["markdown", "json"].includes(format)) {
  console.error("Invalid --format. Expected markdown or json.");
  process.exit(1);
}

if (!Number.isFinite(days) || days < 1 || days > 31) {
  console.error("Invalid --days. Expected a number from 1 to 31.");
  process.exit(1);
}

try {
  const directoryPayload = readJson(
    path.join(dataDir, "directory-index.json"),
    "directory-index.json",
  );
  const changelogPayload = readJson(
    path.join(dataDir, "registry-changelog.json"),
    "registry-changelog.json",
  );
  const entries = envelopeEntries(directoryPayload, "directory-index.json");
  const changelogEntries = envelopeEntries(
    changelogPayload,
    "registry-changelog.json",
  );

  const brief = buildWeeklyBrief(entries, {
    generatedAt: directoryPayload.generatedAt || changelogPayload.generatedAt,
    days,
    changelogEntries,
  });

  if (format === "json") {
    console.log(JSON.stringify(brief, null, 2));
  } else {
    process.stdout.write(renderWeeklyBriefMarkdown(brief));
  }
} catch (error) {
  console.error(errorMessage(error));
  process.exit(1);
}
