// Pure helpers behind scripts/scan-download-packages.mjs: parsing the summary
// footer of `unzip -Z -l` output and detecting dependency-manifest files in an
// archive's entry list. Split out from the execFileSync callers so the parsing
// and matching can be unit-tested without invoking unzip.

import path from "node:path";

// Lockfiles / manifests whose presence means an archive ships resolved
// dependencies worth scanning with the external tools.
export const DEPENDENCY_FILES = new Set([
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock",
  "npm-shrinkwrap.json",
  "go.sum",
  "Cargo.lock",
  "Gemfile.lock",
  "requirements.txt",
  "poetry.lock",
  "Pipfile.lock",
]);

/**
 * Parse the trailing summary line of `unzip -Z -l` output into file/byte counts.
 * Returns all-zero counts when the footer does not match the expected shape.
 */
export function parseUnzipSummary(output) {
  const summary =
    String(output || "")
      .trim()
      .split("\n")
      .at(-1) || "";
  const match = summary.match(
    /(\d+)\s+files?,\s+(\d+)\s+bytes uncompressed,\s+(\d+)\s+bytes compressed/i,
  );
  return match
    ? {
        fileCount: Number(match[1]),
        uncompressedBytes: Number(match[2]),
        compressedBytes: Number(match[3]),
      }
    : { fileCount: 0, uncompressedBytes: 0, compressedBytes: 0 };
}

/** True when any archive entry basename is a known dependency manifest. */
export function hasDependencyManifest(names) {
  return names.some((name) => DEPENDENCY_FILES.has(path.basename(name)));
}
