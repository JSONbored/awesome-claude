/** Shared search query alias map for registry API filters and entry search. */
export const SEARCH_QUERY_ALIASES: Record<string, readonly string[]> = {
  automation: ["automate", "automated", "qa", "testing"],
  browser: ["chrome", "playwright", "web"],
  cc: ["claude", "claude-code"],
  claude: ["claude-code"],
  design: ["ux", "ui"],
  gh: ["github"],
  ms: ["microsoft"],
  mcp: ["model-context-protocol"],
  msteams: ["teams", "microsoft-teams"],
  repo: ["repository", "github"],
  repos: ["repository", "github"],
  safe: ["safety", "security", "secure", "trust", "privacy"],
  security: ["safe", "safety", "secure", "trust"],
  skill: ["skills"],
  skills: ["skill"],
  statusline: ["statuslines", "status"],
  statuslines: ["statusline", "status"],
};

function normalizeAliasKey(token: string) {
  return token.trim().toLowerCase();
}

/** Return alias expansions for a token without inheriting prototype property names. */
export function queryAliasExpansions(token: string): string[] {
  const key = normalizeAliasKey(token);
  if (!key || !Object.hasOwn(SEARCH_QUERY_ALIASES, key)) return [];
  return [...SEARCH_QUERY_ALIASES[key]];
}

/** Return the token plus any alias expansions used by search matching. */
export function expandedTokenCandidates(token: string): string[] {
  const key = normalizeAliasKey(token);
  if (!key) return [];
  return [key, ...queryAliasExpansions(key)];
}

/** Flatten alias expansions for a token list. */
export function expandedTokenSet(tokens: ReadonlyArray<string>): Set<string> {
  return new Set(tokens.flatMap((token) => expandedTokenCandidates(token)));
}
