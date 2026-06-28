import { describe, expect, it } from "vitest";

import {
  expandedTokenCandidates,
  expandedTokenSet,
  queryAliasExpansions,
  SEARCH_QUERY_ALIASES,
} from "../apps/web/src/lib/search-query-aliases";

describe("search query aliases", () => {
  it("expands common shorthand tokens", () => {
    expect(queryAliasExpansions("gh")).toEqual(["github"]);
    expect(queryAliasExpansions("mcp")).toEqual(["model-context-protocol"]);
    expect(queryAliasExpansions("cc")).toEqual(["claude", "claude-code"]);
    expect(queryAliasExpansions("automation")).toEqual([
      "automate",
      "automated",
      "qa",
      "testing",
    ]);
    expect(queryAliasExpansions("msteams")).toEqual([
      "teams",
      "microsoft-teams",
    ]);
  });

  it("returns empty expansions for unknown tokens", () => {
    expect(queryAliasExpansions("spreadsheet")).toEqual([]);
    expect(queryAliasExpansions("")).toEqual([]);
  });

  it("does not inherit prototype property names as alias keys", () => {
    expect(queryAliasExpansions("constructor")).toEqual([]);
    expect(queryAliasExpansions("__proto__")).toEqual([]);
    expect(expandedTokenCandidates("constructor")).toEqual(["constructor"]);
    expect(expandedTokenCandidates("__proto__")).toEqual(["__proto__"]);
  });

  it("includes the normalized token before alias expansions", () => {
    expect(expandedTokenCandidates("GH")).toEqual(["gh", "github"]);
    expect(expandedTokenCandidates("skill")).toEqual(["skill", "skills"]);
  });

  it("deduplicates expanded token sets", () => {
    expect(expandedTokenSet(["gh", "github"])).toEqual(
      new Set(["gh", "github"]),
    );
    expect(expandedTokenSet(["safe", "security"])).toEqual(
      new Set(["safe", "safety", "security", "secure", "trust", "privacy"]),
    );
  });

  it("keeps registry and entry search alias maps aligned", () => {
    expect(Object.keys(SEARCH_QUERY_ALIASES).sort()).toEqual(
      [
        "automation",
        "browser",
        "cc",
        "claude",
        "design",
        "gh",
        "mcp",
        "ms",
        "msteams",
        "repo",
        "repos",
        "safe",
        "security",
        "skill",
        "skills",
        "statusline",
        "statuslines",
      ].sort(),
    );
  });
});
