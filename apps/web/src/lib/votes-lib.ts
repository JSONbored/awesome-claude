export function isValidEntryKey(key: string) {
  return /^[a-z0-9-]+:[a-z0-9-]+$/.test(key);
}

export function getFallbackVoteCounts(keys: string[]) {
  const counts: Record<string, number> = {};
  for (const key of keys) counts[key] = 0;
  return counts;
}

export function getFallbackClientVotes(keys: string[]) {
  const voted: Record<string, boolean> = {};
  for (const key of keys) voted[key] = false;
  return voted;
}
