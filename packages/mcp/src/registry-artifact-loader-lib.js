import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  isSafePathPart,
  safeRelativePath,
} from "./registry-artifact-path-lib.js";

export function dataDirFromOptions(options = {}) {
  const envDataDir =
    typeof process !== "undefined" ? process.env?.HEYCLAUDE_DATA_DIR : "";
  if (options.dataDir || envDataDir) {
    return options.dataDir || envDataDir;
  }

  const moduleUrl = import.meta.url;
  if (!moduleUrl) {
    throw new Error(
      "HEYCLAUDE_DATA_DIR or readTextArtifact is required outside the Node package runtime.",
    );
  }

  const repoRoot = path.resolve(
    path.dirname(fileURLToPath(moduleUrl)),
    "../../..",
  );
  return path.join(repoRoot, "apps", "web", "public", "data");
}

export async function readTextArtifact(relativePath, options = {}) {
  if (typeof options.readTextArtifact === "function") {
    return options.readTextArtifact(relativePath);
  }

  const dataDir = dataDirFromOptions(options);
  const filePath = path.join(dataDir, safeRelativePath(relativePath));
  return readFile(filePath, "utf8");
}

// Generated registry artifacts are immutable for the lifetime of a server
// instance, so an opt-in cache (wired up in `createHeyClaudeMcpServer`) lets the
// long-lived stdio process parse each multi-MB artifact — most tools read the
// ~2 MB search-index.json, and the workflow tools read it several times — once
// instead of on every tool call. The cache is bypassed when a caller injects its
// own loader, which owns its caching/revalidation.
export async function readJsonArtifact(relativePath, options = {}) {
  if (typeof options.readJsonArtifact === "function") {
    return options.readJsonArtifact(relativePath);
  }

  const cache = options.artifactCache;
  if (!cache) {
    return JSON.parse(await readTextArtifact(relativePath, options));
  }

  const cacheKey = path.join(
    dataDirFromOptions(options),
    safeRelativePath(relativePath),
  );
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  const parsed = JSON.parse(await readTextArtifact(relativePath, options));
  cache.set(cacheKey, parsed);
  return parsed;
}

export async function readEntry(category, slug, options = {}) {
  if (!isSafePathPart(category) || !isSafePathPart(slug)) {
    return null;
  }
  try {
    const payload = await readJsonArtifact(
      `entries/${category}/${slug}.json`,
      options,
    );
    return payload?.entry || null;
  } catch {
    return null;
  }
}
