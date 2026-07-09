// Pure helpers for the registry integrity API route: normalize an artifact key
// and compare its manifest hash. Split out of the route so the normalization and
// status decision can be unit-tested without the handler.

export type Contract = { path: string; type: string; sha256: string };
export type ArtifactContract = Contract & { name: string };
export type IntegrityStatus = "snapshot" | "unknown" | "match" | "mismatch";

/** Normalize an artifact key: decode %2f, strip leading slashes and a data/ prefix. */
export function normalizeArtifact(value: string): string {
  return value
    .replace(/%2f/gi, "/")
    .replace(/^\/+/, "")
    .replace(/^data\//, "");
}

/**
 * Decide the integrity status: "snapshot" when no artifact was requested,
 * "unknown" when it is not in the manifest, else "match"/"mismatch" on the hash.
 */
export function determineIntegrityStatus(
  artifact: string,
  current: ArtifactContract | null,
  hash: string,
): IntegrityStatus {
  if (!artifact) return "snapshot";
  if (!current) return "unknown";
  return current.sha256 === hash ? "match" : "mismatch";
}
