// Pure path-safety guard behind scripts/build-content-index.mjs: resolving a
// generated artifact's output path and refusing any path that escapes the public
// data directory. Split out - with the data directory injected - so the
// traversal guard can be unit-tested without the build pipeline.

import path from "node:path";

/**
 * Resolve `artifactPath` under `dataDir` and return the absolute path, throwing
 * if it would land outside `dataDir` (path traversal). The data dir itself is a
 * valid target; anything above or beside it is rejected.
 */
export function artifactOutputPath(artifactPath, dataDir) {
  const dataRoot = path.resolve(dataDir);
  const outputPath = path.resolve(dataRoot, artifactPath);
  const dataRootPrefix = `${dataRoot}${path.sep}`;

  if (outputPath !== dataRoot && !outputPath.startsWith(dataRootPrefix)) {
    throw new Error(
      `Refusing to write artifact outside public data dir: ${artifactPath}`,
    );
  }

  return outputPath;
}
