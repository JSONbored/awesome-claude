import { cache } from "react";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import type {
  ArtifactManifestV2,
  CategorySummary,
  ContentEntry,
  DirectoryEntry,
  RegistryTrustReport,
  RegistryEnvelope,
  SearchDocument,
} from "@heyclaude/registry";

import { getCloudflareBinding } from "@/lib/cloudflare-env.server";
import { categoryDescriptions, categoryLabels, siteConfig } from "@/lib/site";
import {
  applySourceRepoSignalToEntry,
  applySourceRepoSignals,
} from "@/lib/source-repo-signals.server";

export type { CategorySummary, ContentEntry, DirectoryEntry };

const DATA_ORIGIN = "https://heyclau.de";
const MAX_ENTRY_DETAIL_CACHE_SIZE = 512;
let directoryIndexPromise: Promise<DirectoryEntry[]> | null = null;
const entryDetailPromises = new Map<string, Promise<ContentEntry | null>>();

function localDataFilePaths(fileName: string) {
  return [
    path.join(process.cwd(), "public", "data", fileName),
    path.join(process.cwd(), "apps", "web", "public", "data", fileName),
  ].filter((filePath, index, paths) => paths.indexOf(filePath) === index);
}

async function readLocalDataFile(fileName: string) {
  let lastError: unknown = null;
  for (const filePath of localDataFilePaths(fileName)) {
    try {
      return await readFile(filePath, "utf8");
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error(`Local data artifact not found: ${fileName}`);
}

async function readLocalJsonDataFile<T>(fileName: string): Promise<T> {
  let lastError: unknown = null;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const raw = await readLocalDataFile(fileName);
      return JSON.parse(raw) as T;
    } catch (error) {
      lastError = error;
      if (attempt < 2) await sleep(25);
    }
  }
  throw lastError || new Error(`Invalid local data artifact: ${fileName}`);
}

export async function loadJsonDataFile<T>(fileName: string): Promise<T> {
  try {
    return await readLocalJsonDataFile<T>(fileName);
  } catch {
    // In the Cloudflare Worker runtime, read from the static ASSETS binding.
    const assets = getCloudflareBinding<{
      fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
    }>("ASSETS");
    if (!assets) {
      throw new Error(`Static ASSETS binding is not available for ${fileName}`);
    }
    const response = await assets.fetch(new Request(`${DATA_ORIGIN}/data/${fileName}`));
    if (!response.ok) {
      throw new Error(`Failed to load ${fileName} asset (${response.status})`);
    }
    return (await response.json()) as T;
  }
}

export async function loadTextDataFile(fileName: string): Promise<string> {
  try {
    return await readLocalDataFile(fileName);
  } catch {
    const assets = getCloudflareBinding<{
      fetch: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
    }>("ASSETS");
    if (!assets) {
      throw new Error(`Static ASSETS binding is not available for ${fileName}`);
    }
    const response = await assets.fetch(new Request(`${DATA_ORIGIN}/data/${fileName}`));
    if (!response.ok) {
      throw new Error(`Failed to load ${fileName} asset (${response.status})`);
    }
    return response.text();
  }
}

export function normalizeRegistryEntries<T>(payload: RegistryEnvelope<T>): T[] {
  if (!Array.isArray(payload?.entries)) {
    throw new Error("Invalid registry artifact: expected entries envelope");
  }
  return payload.entries;
}

const loadDirectoryIndex = cache(async (): Promise<DirectoryEntry[]> => {
  directoryIndexPromise ??=
    loadJsonDataFile<RegistryEnvelope<DirectoryEntry>>("directory-index.json").then(
      normalizeRegistryEntries,
    );
  return directoryIndexPromise;
});

const loadSearchIndex = cache(async () => {
  return loadJsonDataFile<RegistryEnvelope<SearchDocument>>("search-index.json").then(
    normalizeRegistryEntries,
  );
});

export function isSafeContentPathPart(value: string) {
  return /^[a-z0-9-]+$/.test(value);
}

async function loadEntryDetail(category: string, slug: string) {
  if (!isSafeContentPathPart(category) || !isSafeContentPathPart(slug)) {
    return null;
  }

  const key = `${category}:${slug}`;
  let promise = entryDetailPromises.get(key);
  if (!promise) {
    promise = loadJsonDataFile<{
      schemaVersion?: number;
      entry?: ContentEntry;
    }>(`entries/${category}/${slug}.json`)
      .then((payload) => {
        const entry = payload.entry ?? null;
        if (!entry) entryDetailPromises.delete(key);
        return entry;
      })
      .catch(() => {
        entryDetailPromises.delete(key);
        return null;
      });
    if (entryDetailPromises.size >= MAX_ENTRY_DETAIL_CACHE_SIZE) {
      const oldestKey = entryDetailPromises.keys().next().value;
      if (oldestKey) entryDetailPromises.delete(oldestKey);
    }
    entryDetailPromises.set(key, promise);
  }

  return promise;
}

export async function getAllEntries(): Promise<ContentEntry[]> {
  const directoryEntries = await loadDirectoryIndex();
  const details = await Promise.all(
    directoryEntries.map((entry) => loadEntryDetail(entry.category, entry.slug)),
  );
  return applySourceRepoSignals(details.filter((entry): entry is ContentEntry => Boolean(entry)));
}

export async function getDirectoryEntries(): Promise<DirectoryEntry[]> {
  return applySourceRepoSignals(await loadDirectoryIndex());
}

export async function getEntry(category: string, slug: string) {
  return applySourceRepoSignalToEntry(await loadEntryDetail(category, slug));
}

export const getEntryLlmsText = cache(async (category: string, slug: string) => {
  if (!isSafeContentPathPart(category) || !isSafeContentPathPart(slug)) {
    return null;
  }

  try {
    return await loadTextDataFile(`llms/${category}/${slug}.txt`);
  } catch {
    return null;
  }
});

export const getRegistryManifest = cache(async () => {
  return loadJsonDataFile<ArtifactManifestV2>("registry-manifest.json");
});

export const getRegistryChangelog = cache(async () => {
  return loadJsonDataFile<{
    schemaVersion: number;
    kind: "registry-changelog";
    generatedAt: string;
    count: number;
    signature?: string;
    entries: Array<{
      key: string;
      type: "added" | "updated" | "removed";
      category: string;
      slug: string;
      title: string;
      dateAdded: string;
      canonicalUrl: string;
      artifactHash: string;
    }>;
  }>("registry-changelog.json");
});

export const getContentQualityReport = cache(async () => {
  return loadJsonDataFile<{
    schemaVersion: number;
    kind: "content-quality-report";
    generatedAt: string;
    count: number;
    summary: {
      averageScore: number;
      noExternalSourceCount: number;
      firstPartyEditorialCount: number;
      unprovenancedSourceCount: number;
      missingSeoCount: number;
      duplicateBodyGroupCount: number;
    };
    categoryBreakdown: Record<
      string,
      { count: number; averageScore: number; warningCount: number }
    >;
    entries: Array<{
      key: string;
      category: string;
      slug: string;
      title: string;
      scores: { total: number };
      warnings: string[];
    }>;
  }>("content-quality-report.json");
});

export const getRegistryTrustReport = cache(async () => {
  return loadJsonDataFile<RegistryTrustReport>("registry-trust-report.json");
});

export async function getSearchIndex() {
  return applySourceRepoSignals(await loadSearchIndex());
}

export async function getEntriesByCategory(category: string) {
  const entries = (await loadDirectoryIndex()).filter((entry) => entry.category === category);
  const details = await Promise.all(entries.map((entry) => getEntry(entry.category, entry.slug)));
  return details.filter((entry): entry is ContentEntry => Boolean(entry));
}

export async function getDirectoryEntriesByCategory(category: string) {
  const entries = await getDirectoryEntries();
  return entries.filter((entry) => entry.category === category);
}

export const getCategorySummaries = cache(async (): Promise<CategorySummary[]> => {
  const entries = await loadDirectoryIndex();
  return siteConfig.categoryOrder
    .map((category) => {
      const count = entries.filter((entry) => entry.category === category).length;
      return {
        category,
        label: categoryLabels[category],
        count,
        description: categoryDescriptions[category],
      };
    })
    .filter((entry) => entry.count > 0);
});

export async function getRecentEntries() {
  const entries = await getDirectoryEntries();
  return [...entries]
    .filter((entry) => entry.dateAdded)
    .sort((left, right) => String(right.dateAdded).localeCompare(String(left.dateAdded)))
    .slice(0, 12);
}
