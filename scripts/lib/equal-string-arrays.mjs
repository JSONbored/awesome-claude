// Pure ordered-equality check behind scripts/validate-raycast-feed.mjs: used to
// verify that an entry's mcpInstallTargets exactly match its detail payload's
// (same values in the same order). Split out so the comparison can be
// unit-tested in isolation.

/** True when two arrays have the same length and equal items at each index. */
export function equalStringArrays(left, right) {
  return (
    left.length === right.length &&
    left.every((item, index) => item === right[index])
  );
}
