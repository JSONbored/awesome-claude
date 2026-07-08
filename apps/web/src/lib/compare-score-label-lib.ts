// Pure label for a compared entry's score delta vs the baseline, split out of
// the entry-detail decision playbook so it can be unit-tested without React.

/**
 * Human label for a score delta against the selected baseline: null when no
 * baseline is chosen, `+N vs baseline` / `-N vs baseline` for a difference, and
 * a parity message when the delta is exactly 0.
 */
export function compareScoreLabel(scoreDelta: number | null): string {
  if (scoreDelta === null) return "No baseline selected";
  if (scoreDelta > 0) return `+${scoreDelta} vs baseline`;
  if (scoreDelta < 0) return `${scoreDelta} vs baseline`;
  return "Score parity with baseline";
}
