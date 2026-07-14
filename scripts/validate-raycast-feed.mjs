import fs from "node:fs";
import path from "node:path";

import { RAYCAST_COPY_PREVIEW_LIMIT } from "@heyclaude/registry";
import { isAllowedBrandAssetUrl } from "@heyclaude/registry/brand-assets";
import {
  MCP_INSTALL_TARGET_IDS,
  extractMcpServerConfig,
  mcpConfigSupportsTarget,
} from "@heyclaude/registry/mcp-install-config";

import { stringHasLoneSurrogate } from "./lib/lone-surrogate.mjs";

const repoRoot = process.cwd();
const feedPath = path.join(repoRoot, "apps/web/public/data/raycast-index.json");
const directoryPath = path.join(
  repoRoot,
  "apps/web/public/data/directory-index.json",
);
const raycastFeedSourcePath = path.join(
  repoRoot,
  "integrations/raycast/src/feed.ts",
);
const raycastRegistryCommandSourcePath = path.join(
  repoRoot,
  "integrations/raycast/src/registry-command.tsx",
);
const requiredEntryFields = [
  "category",
  "slug",
  "title",
  "description",
  "tags",
  "detailUrl",
  "webUrl",
];
const forbiddenEntryFields = [
  "body",
  "sections",
  "headings",
  "codeBlocks",
  "scriptBody",
];
const allowedMcpInstallTargets = new Set(MCP_INSTALL_TARGET_IDS);

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    fail(`Missing required file: ${path.relative(repoRoot, filePath)}`);
    return null;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function readSource(filePath) {
  if (!fs.existsSync(filePath)) {
    fail(`Missing required file: ${path.relative(repoRoot, filePath)}`);
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}

function assertNoLoneSurrogates(value, label) {
  if (typeof value === "string") {
    if (stringHasLoneSurrogate(value))
      fail(`${label}: contains invalid UTF-16`);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      assertNoLoneSurrogates(item, `${label}[${index}]`),
    );
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      assertNoLoneSurrogates(item, `${label}.${key}`);
    }
  }
}

function objectBlock(source, name) {
  const match = source.match(
    new RegExp(`(?:const|export const)\\s+${name}[^=]*=\\s*{([\\s\\S]*?)\\n};`),
  );
  return match?.[1] ?? "";
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function objectDefinesKey(block, key) {
  const escapedKey = escapeRegExp(key);
  return new RegExp(
    `(^|\\n)\\s*(?:${escapedKey}|["']${escapedKey}["'])\\s*:`,
  ).test(block);
}

function normalizeMcpInstallTargets(value, label) {
  if (value === undefined) return [];
  if (!Array.isArray(value)) {
    fail(`${label}: mcpInstallTargets must be an array`);
    return [];
  }
  const targets = [];
  const seenTargets = new Set();
  for (const item of value) {
    if (typeof item !== "string" || !allowedMcpInstallTargets.has(item)) {
      fail(`${label}: invalid MCP install target ${String(item)}`);
      continue;
    }
    if (seenTargets.has(item)) {
      fail(`${label}: duplicate MCP install target ${item}`);
      continue;
    }
    seenTargets.add(item);
    targets.push(item);
  }
  return targets;
}

function equalStringArrays(left, right) {
  return (
    left.length === right.length &&
    left.every((item, index) => item === right[index])
  );
}

if (!fs.existsSync(feedPath)) {
  fail(`Missing Raycast feed: ${path.relative(repoRoot, feedPath)}`);
  process.exit();
}

const payload = readJson(feedPath);
const directoryPayload = readJson(directoryPath);
const feedSource = readSource(raycastFeedSourcePath);
const registryCommandSource = readSource(raycastRegistryCommandSourcePath);
const categoryLabelsBlock = objectBlock(feedSource, "categoryLabels");
const categoryIconsBlock = objectBlock(registryCommandSource, "categoryIcons");

assertNoLoneSurrogates(payload, "Raycast feed");

if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
  fail("Raycast feed must be a versioned object envelope");
  process.exit();
}
if (
  !directoryPayload ||
  typeof directoryPayload !== "object" ||
  Array.isArray(directoryPayload) ||
  !Array.isArray(directoryPayload.entries)
) {
  fail("Directory index must be a versioned object envelope with entries");
  process.exit();
}

if (payload.schemaVersion !== 2) {
  fail(`Raycast feed schemaVersion must be 2, got ${payload.schemaVersion}`);
}
if (payload.kind !== "raycast-index") {
  fail(`Raycast feed kind must be raycast-index, got ${payload.kind}`);
}
if (
  !/^\d{4}-\d{2}-\d{2}T00:00:00\.000Z$/.test(String(payload.generatedAt ?? ""))
) {
  fail(
    "Raycast feed generatedAt must be deterministic YYYY-MM-DDT00:00:00.000Z",
  );
}
if (!Array.isArray(payload.entries) || payload.entries.length === 0) {
  fail("Raycast feed entries must be a non-empty array");
  process.exit();
}
if (payload.count !== payload.entries.length) {
  fail("Raycast feed count must match entries length");
}
if (payload.entries.length !== directoryPayload.entries.length) {
  fail(
    `Raycast feed count ${payload.entries.length} must match directory count ${directoryPayload.entries.length}`,
  );
}

const directoryKeys = new Set(
  directoryPayload.entries.map((entry) => `${entry.category}:${entry.slug}`),
);
const raycastKeys = new Set(
  payload.entries.map((entry) => `${entry.category}:${entry.slug}`),
);
for (const key of directoryKeys) {
  if (!raycastKeys.has(key)) fail(`${key}: missing from Raycast feed`);
}
for (const key of raycastKeys) {
  if (!directoryKeys.has(key)) fail(`${key}: extra entry in Raycast feed`);
}

const seen = new Set();
const categories = new Set();
for (const entry of payload.entries) {
  const key = `${entry.category}:${entry.slug}`;
  categories.add(entry.category);
  if (seen.has(key)) fail(`Duplicate Raycast entry: ${key}`);
  seen.add(key);

  for (const field of requiredEntryFields) {
    if (
      entry[field] === undefined ||
      entry[field] === null ||
      entry[field] === ""
    ) {
      fail(`${key}: missing Raycast field ${field}`);
    }
  }
  for (const field of forbiddenEntryFields) {
    if (entry[field] !== undefined)
      fail(`${key}: forbidden Raycast field ${field}`);
  }
  if (!Array.isArray(entry.tags)) fail(`${key}: tags must be an array`);
  if (entry.brandIconUrl && !isAllowedBrandAssetUrl(entry.brandIconUrl)) {
    fail(`${key}: invalid brandIconUrl`);
  }
  if (entry.brandLogoUrl && !isAllowedBrandAssetUrl(entry.brandLogoUrl)) {
    fail(`${key}: invalid brandLogoUrl`);
  }
  if (
    entry.copyText !== undefined &&
    String(entry.copyText ?? "").length > RAYCAST_COPY_PREVIEW_LIMIT + 3
  ) {
    fail(`${key}: feed copyText exceeds preview cap`);
  }

  const detailUrl = String(entry.detailUrl ?? "");
  if (!detailUrl.startsWith("/data/raycast/")) {
    fail(`${key}: detailUrl must point under /data/raycast`);
    continue;
  }

  const detailPath = path.join(repoRoot, "apps/web/public", detailUrl);
  if (!fs.existsSync(detailPath)) {
    fail(
      `${key}: missing detail payload ${path.relative(repoRoot, detailPath)}`,
    );
    continue;
  }

  const detail = JSON.parse(fs.readFileSync(detailPath, "utf8"));
  const entryMcpTargets = normalizeMcpInstallTargets(
    entry.mcpInstallTargets,
    `${key} entry`,
  );
  const detailMcpTargets = normalizeMcpInstallTargets(
    detail.mcpInstallTargets,
    `${key} detail`,
  );
  assertNoLoneSurrogates(detail, `${key} detail`);
  if (detail.schemaVersion !== 2)
    fail(`${key}: detail schemaVersion must be 2`);
  if (
    detail.copyText !== undefined &&
    (typeof detail.copyText !== "string" || detail.copyText.trim() === "")
  ) {
    fail(`${key}: detail copyText must be non-empty when present`);
  }
  if (detail.copyText === undefined) {
    const llmsUrl = String(detail.llmsUrl || "");
    const validLlmsUrl =
      /^\/api\/registry\/entries\/[^/]+\/[^/]+\/llms\/?$/.test(llmsUrl);
    if (!validLlmsUrl) {
      fail(`${key}: detail without copyText must expose llmsUrl`);
    }
  }
  if (
    entry.copyText !== undefined &&
    entry.copyTextTruncated &&
    detail.copyText.length <= String(entry.copyText ?? "").length
  ) {
    fail(`${key}: truncated feed entry must have longer detail copyText`);
  }
  for (const field of [
    "brandName",
    "brandDomain",
    "brandIconUrl",
    "brandLogoUrl",
    "brandAssetSource",
  ]) {
    if (entry[field] && entry[field] !== detail[field]) {
      fail(`${key}: detail ${field} must match feed ${field}`);
    }
  }

  if (!equalStringArrays(entryMcpTargets, detailMcpTargets)) {
    fail(`${key}: detail mcpInstallTargets must match feed entry`);
  }
  if (entry.category !== "mcp") {
    if (entryMcpTargets.length || detailMcpTargets.length) {
      fail(`${key}: non-MCP entry must not advertise MCP install targets`);
    }
    continue;
  }

  const detailConfigSnippet = String(detail.configSnippet || "").trim();
  const advertisesMcpInstall =
    entry.hasConfigSnippet ||
    detail.hasConfigSnippet ||
    entryMcpTargets.length ||
    detailMcpTargets.length;
  if (!advertisesMcpInstall) {
    if (detailConfigSnippet) {
      fail(`${key}: manual MCP entry must not publish Raycast configSnippet`);
    }
    continue;
  }

  if (!entry.hasConfigSnippet || !detail.hasConfigSnippet) {
    fail(`${key}: MCP install target requires hasConfigSnippet in feed/detail`);
  }
  if (!entryMcpTargets.length) {
    fail(`${key}: MCP install target list must not be empty`);
  }
  let extractedMcpConfig = null;
  try {
    extractedMcpConfig = extractMcpServerConfig(detailConfigSnippet);
  } catch {
    extractedMcpConfig = null;
  }
  if (!extractedMcpConfig) {
    fail(`${key}: advertised MCP install target requires valid detail config`);
    continue;
  }
  for (const target of entryMcpTargets) {
    if (!mcpConfigSupportsTarget(extractedMcpConfig.config, target)) {
      fail(`${key}: unsupported MCP install target ${target}`);
    }
  }
}

for (const category of [...categories].sort()) {
  if (!objectDefinesKey(categoryLabelsBlock, category)) {
    fail(`${category}: missing Raycast category label`);
  }
  if (!objectDefinesKey(categoryIconsBlock, category)) {
    fail(`${category}: missing Raycast icon mapping`);
  }
}

if (!process.exitCode) {
  console.log(`Validated ${payload.entries.length} Raycast feed entries.`);
}
