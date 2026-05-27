import { registryDiffQuerySchema } from "@/lib/api/contracts";
import { createApiHandler, type InferApiQuery } from "@/lib/api/router";
import { getRegistryChangelog } from "@/lib/content";
import { cachedJsonResponse } from "@/lib/http-cache";

type ChangelogEntry = Awaited<
  ReturnType<typeof getRegistryChangelog>
>["entries"][number];

function parseSinceDate(value: string | null) {
  if (!value) return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function looksLikeHash(value: string | null) {
  return Boolean(value && /^[a-f0-9]{32,128}$/i.test(value));
}

// Filter `added` entries to those at or after the cursor. `dateAdded` is the
// only per-entry timestamp recorded in `registry-changelog.json`, and it only
// has meaning for entries whose `type === "added"`.
function entriesAddedSince(entries: ChangelogEntry[], sinceDate: number) {
  return entries.filter((entry) => {
    if (entry.type !== "added") return false;
    const added = Date.parse(entry.dateAdded);
    return Number.isFinite(added) && added >= sinceDate;
  });
}

// `updated` and `removed` entries carry no per-entry `updatedAt` / `removedAt`,
// so a date cursor cannot honor them. Surface every such entry on a date-cursor
// fetch, preserving the "edited entries are not missed" guarantee.
function entriesUpdatedOrRemoved(entries: ChangelogEntry[]) {
  return entries.filter((entry) => entry.type !== "added");
}

// Merge two slices of the same changelog in original-order, deduping by `key`
// (the changelog generator already enforces one row per key; the dedupe is a
// defensive belt-and-suspenders in case overlap is ever introduced).
function mergeChangelogEntries(
  all: ChangelogEntry[],
  selected: ChangelogEntry[],
) {
  const keepKeys = new Set(selected.map((entry) => entry.key));
  const seen = new Set<string>();
  const merged: ChangelogEntry[] = [];
  for (const entry of all) {
    if (!keepKeys.has(entry.key)) continue;
    if (seen.has(entry.key)) continue;
    seen.add(entry.key);
    merged.push(entry);
  }
  return merged;
}

export const GET = createApiHandler(
  "registry.diff",
  async ({ request, query: parsedQuery }) => {
    const { since, limit } = parsedQuery as InferApiQuery<
      typeof registryDiffQuerySchema
    >;
    const sinceDate = parseSinceDate(since);
    const changelog = await getRegistryChangelog();
    const currentSignature = changelog.signature ?? "";

    let entries: ChangelogEntry[];
    if (since && since === currentSignature) {
      entries = [];
    } else if (sinceDate) {
      // Date-cursor fetch: include `added` entries at or after the cursor plus
      // every `updated`/`removed` row (un-date-filterable). Merge in changelog
      // order, deduped by key.
      const addedSince = entriesAddedSince(changelog.entries, sinceDate);
      const editsAndRemovals = entriesUpdatedOrRemoved(changelog.entries);
      entries = mergeChangelogEntries(changelog.entries, [
        ...addedSince,
        ...editsAndRemovals,
      ]);
    } else {
      entries = changelog.entries;
    }

    return cachedJsonResponse(
      request,
      {
        schemaVersion: 1,
        kind: "registry-diff",
        generatedAt: changelog.generatedAt,
        since: since || null,
        currentSignature,
        hasChanges: entries.length > 0,
        count: Math.min(entries.length, limit),
        totalAvailable: entries.length,
        note:
          since && looksLikeHash(since) && since !== currentSignature
            ? "Unknown hash for this static registry snapshot; returning latest available changes."
            : sinceDate
              ? "Date cursors filter `added` entries by the cursor and include every `updated`/`removed` entry so edited entries are not missed; use currentSignature for precise polling."
              : undefined,
        entries: entries.slice(0, limit),
      },
      {
        headers: {
          "cache-control": "public, max-age=60, stale-while-revalidate=600",
        },
      },
    );
  },
);
