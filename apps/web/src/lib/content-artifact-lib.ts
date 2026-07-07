import type { ContentEntry, RegistryEnvelope } from "@heyclaude/registry";

export const DATA_ORIGIN = "https://heyclau.de";

type EntryDetailPayload = {
  schemaVersion?: number;
  entry?: ContentEntry;
  trustSignals?: ContentEntry["trustSignals"];
};

export function normalizeEntryDetailPayload(payload: EntryDetailPayload): ContentEntry | null {
  const entry = payload.entry ?? null;
  if (!entry) return null;
  if (!payload.trustSignals || entry.trustSignals) return entry;
  return { ...entry, trustSignals: payload.trustSignals };
}

function joinDataPath(...parts: string[]) {
  return parts.join("/").replace(/\/+/g, "/");
}

export function localDataFilePaths(fileName: string) {
  const cwd = process.cwd();
  return [
    joinDataPath(cwd, "public", "data", fileName),
    joinDataPath(cwd, "apps", "web", "public", "data", fileName),
  ].filter((filePath, index, paths) => paths.indexOf(filePath) === index);
}

export function isSafeContentPathPart(value: string) {
  return /^[a-z0-9-]+$/.test(value);
}

export function safeDataArtifactPath(fileName: string) {
  const normalized = String(fileName || "").replace(/\\/g, "/");
  const parts = normalized.split("/");
  if (!parts.length || parts.some((part) => !part || part === "." || part === "..")) {
    throw new Error(`Unsafe data artifact path: ${fileName}`);
  }
  return parts.join("/");
}

export function normalizeRegistryEntries<T>(payload: RegistryEnvelope<T>): T[] {
  if (!Array.isArray(payload?.entries)) {
    throw new Error("Invalid registry artifact: expected entries envelope");
  }
  return payload.entries;
}
