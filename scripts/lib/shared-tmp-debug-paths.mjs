// Pure hygiene check behind scripts/validate-content.mjs: find predictable,
// shared /tmp debug/startup paths in a submitted script body. A fixed path under
// the world-writable /tmp is a symlink/race risk, so submissions should use a
// randomized path ($$, $RANDOM, mktemp's XXXX). Split out so the detection can be
// unit-tested without walking the content tree.

const sharedTmpDebugPathPattern =
  /(^|[^A-Za-z0-9_$\/{.-])(\/tmp\/[A-Za-z0-9_.$\/{}-]*(?:debug|startup)[A-Za-z0-9_.$\/{}-]*)/gi;
const nonPredictableTmpPathPattern = /\$\$|\$RANDOM|\$\{RANDOM\}|X{3,}/i;

/**
 * Return the distinct predictable /tmp debug/startup paths referenced in
 * `scriptBody`. Paths that include a randomizing token ($$, $RANDOM, ${RANDOM},
 * or 3+ X placeholders) are treated as non-predictable and excluded.
 */
export function findPredictableSharedTmpDebugPaths(scriptBody) {
  const paths = new Set();
  for (const match of String(scriptBody || "").matchAll(
    sharedTmpDebugPathPattern,
  )) {
    const tmpPath = match[2];
    if (!tmpPath || nonPredictableTmpPathPattern.test(tmpPath)) continue;
    paths.add(tmpPath);
  }
  return [...paths];
}
