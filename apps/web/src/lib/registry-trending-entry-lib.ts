// Pure per-entry derivations for the registry trending API route: canonical URL,
// source status, and first-party package flag. Split out of the route so the
// embedded-legacy-field fallbacks can be unit-tested without the handler.

import type { Entry } from "@/types/registry";

type LegacyGeneratedFields = {
  canonicalUrl?: unknown;
  downloadTrust?: unknown;
  trustSignals?: { sourceStatus?: unknown };
};

/** Embedded canonical URL when present, else the derived entry detail URL. */
export function entryCanonicalUrl(entry: Entry): string {
  const embedded = (entry as LegacyGeneratedFields).canonicalUrl;
  return typeof embedded === "string" && embedded.trim()
    ? embedded
    : `https://heyclau.de/entry/${entry.category}/${entry.slug}`;
}

/** Embedded source status when present, else derived from the source field. */
export function entrySourceStatus(entry: Entry): string {
  const embedded = (entry as LegacyGeneratedFields).trustSignals?.sourceStatus;
  if (typeof embedded === "string" && embedded.trim()) return embedded;
  return entry.source === "unverified" ? "missing" : "available";
}

/** True for a first-party download or a verified package with a download URL. */
export function isFirstPartyPackage(entry: Entry): boolean {
  const legacyTrust = (entry as LegacyGeneratedFields).downloadTrust;
  return legacyTrust === "first-party" || Boolean(entry.downloadUrl && entry.packageVerified);
}
