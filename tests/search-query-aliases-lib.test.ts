import { describe, expect, it } from "vitest";
import {
  SEARCH_QUERY_ALIASES,
  expandedTokenCandidates,
  expandedTokenSet,
  queryAliasExpansions,
} from "../apps/web/src/lib/search-query-aliases-lib";

describe("search-query-aliases-lib", () => {
  it("exports alias map", () => {
    expect(SEARCH_QUERY_ALIASES.mcp).toContain("model-context-protocol");
  });
  it("expands mcp token", () => {
    expect(queryAliasExpansions("mcp")).toContain("model-context-protocol");
  });
  it("expandedTokenCandidates matrix 0", () => {
    const candidates = expandedTokenCandidates("mcp");
    expect(candidates[0]).toBe("mcp");
  });
  it("expandedTokenSet matrix 0", () => {
    const set = expandedTokenSet(["mcp"]);
    expect(set.has("mcp")).toBe(true);
  });
  it("expandedTokenCandidates matrix 1", () => {
    const candidates = expandedTokenCandidates("skills");
    expect(candidates[0]).toBe("skills");
  });
  it("expandedTokenSet matrix 1", () => {
    const set = expandedTokenSet(["skills"]);
    expect(set.has("skills")).toBe(true);
  });
  it("expandedTokenCandidates matrix 2", () => {
    const candidates = expandedTokenCandidates("browser");
    expect(candidates[0]).toBe("browser");
  });
  it("expandedTokenSet matrix 2", () => {
    const set = expandedTokenSet(["browser"]);
    expect(set.has("browser")).toBe(true);
  });
  it("expandedTokenCandidates matrix 3", () => {
    const candidates = expandedTokenCandidates("security");
    expect(candidates[0]).toBe("security");
  });
  it("expandedTokenSet matrix 3", () => {
    const set = expandedTokenSet(["security"]);
    expect(set.has("security")).toBe(true);
  });
  it("expandedTokenCandidates matrix 4", () => {
    const candidates = expandedTokenCandidates("gh");
    expect(candidates[0]).toBe("gh");
  });
  it("expandedTokenSet matrix 4", () => {
    const set = expandedTokenSet(["gh"]);
    expect(set.has("gh")).toBe(true);
  });
  it("expandedTokenCandidates matrix 5", () => {
    const candidates = expandedTokenCandidates("cc");
    expect(candidates[0]).toBe("cc");
  });
  it("expandedTokenSet matrix 5", () => {
    const set = expandedTokenSet(["cc"]);
    expect(set.has("cc")).toBe(true);
  });
  it("expandedTokenCandidates matrix 6", () => {
    const candidates = expandedTokenCandidates("mcp");
    expect(candidates[0]).toBe("mcp");
  });
  it("expandedTokenSet matrix 6", () => {
    const set = expandedTokenSet(["mcp"]);
    expect(set.has("mcp")).toBe(true);
  });
  it("expandedTokenCandidates matrix 7", () => {
    const candidates = expandedTokenCandidates("skills");
    expect(candidates[0]).toBe("skills");
  });
  it("expandedTokenSet matrix 7", () => {
    const set = expandedTokenSet(["skills"]);
    expect(set.has("skills")).toBe(true);
  });
  it("expandedTokenCandidates matrix 8", () => {
    const candidates = expandedTokenCandidates("browser");
    expect(candidates[0]).toBe("browser");
  });
  it("expandedTokenSet matrix 8", () => {
    const set = expandedTokenSet(["browser"]);
    expect(set.has("browser")).toBe(true);
  });
  it("expandedTokenCandidates matrix 9", () => {
    const candidates = expandedTokenCandidates("security");
    expect(candidates[0]).toBe("security");
  });
  it("expandedTokenSet matrix 9", () => {
    const set = expandedTokenSet(["security"]);
    expect(set.has("security")).toBe(true);
  });
  it("expandedTokenCandidates matrix 10", () => {
    const candidates = expandedTokenCandidates("gh");
    expect(candidates[0]).toBe("gh");
  });
  it("expandedTokenSet matrix 10", () => {
    const set = expandedTokenSet(["gh"]);
    expect(set.has("gh")).toBe(true);
  });
  it("expandedTokenCandidates matrix 11", () => {
    const candidates = expandedTokenCandidates("cc");
    expect(candidates[0]).toBe("cc");
  });
  it("expandedTokenSet matrix 11", () => {
    const set = expandedTokenSet(["cc"]);
    expect(set.has("cc")).toBe(true);
  });
  it("expandedTokenCandidates matrix 12", () => {
    const candidates = expandedTokenCandidates("mcp");
    expect(candidates[0]).toBe("mcp");
  });
  it("expandedTokenSet matrix 12", () => {
    const set = expandedTokenSet(["mcp"]);
    expect(set.has("mcp")).toBe(true);
  });
  it("expandedTokenCandidates matrix 13", () => {
    const candidates = expandedTokenCandidates("skills");
    expect(candidates[0]).toBe("skills");
  });
  it("expandedTokenSet matrix 13", () => {
    const set = expandedTokenSet(["skills"]);
    expect(set.has("skills")).toBe(true);
  });
  it("expandedTokenCandidates matrix 14", () => {
    const candidates = expandedTokenCandidates("browser");
    expect(candidates[0]).toBe("browser");
  });
  it("expandedTokenSet matrix 14", () => {
    const set = expandedTokenSet(["browser"]);
    expect(set.has("browser")).toBe(true);
  });
  it("expandedTokenCandidates matrix 15", () => {
    const candidates = expandedTokenCandidates("security");
    expect(candidates[0]).toBe("security");
  });
  it("expandedTokenSet matrix 15", () => {
    const set = expandedTokenSet(["security"]);
    expect(set.has("security")).toBe(true);
  });
  it("expandedTokenCandidates matrix 16", () => {
    const candidates = expandedTokenCandidates("gh");
    expect(candidates[0]).toBe("gh");
  });
  it("expandedTokenSet matrix 16", () => {
    const set = expandedTokenSet(["gh"]);
    expect(set.has("gh")).toBe(true);
  });
  it("expandedTokenCandidates matrix 17", () => {
    const candidates = expandedTokenCandidates("cc");
    expect(candidates[0]).toBe("cc");
  });
  it("expandedTokenSet matrix 17", () => {
    const set = expandedTokenSet(["cc"]);
    expect(set.has("cc")).toBe(true);
  });
  it("expandedTokenCandidates matrix 18", () => {
    const candidates = expandedTokenCandidates("mcp");
    expect(candidates[0]).toBe("mcp");
  });
  it("expandedTokenSet matrix 18", () => {
    const set = expandedTokenSet(["mcp"]);
    expect(set.has("mcp")).toBe(true);
  });
  it("expandedTokenCandidates matrix 19", () => {
    const candidates = expandedTokenCandidates("skills");
    expect(candidates[0]).toBe("skills");
  });
  it("expandedTokenSet matrix 19", () => {
    const set = expandedTokenSet(["skills"]);
    expect(set.has("skills")).toBe(true);
  });
  it("expandedTokenCandidates matrix 20", () => {
    const candidates = expandedTokenCandidates("browser");
    expect(candidates[0]).toBe("browser");
  });
  it("expandedTokenSet matrix 20", () => {
    const set = expandedTokenSet(["browser"]);
    expect(set.has("browser")).toBe(true);
  });
  it("expandedTokenCandidates matrix 21", () => {
    const candidates = expandedTokenCandidates("security");
    expect(candidates[0]).toBe("security");
  });
  it("expandedTokenSet matrix 21", () => {
    const set = expandedTokenSet(["security"]);
    expect(set.has("security")).toBe(true);
  });
  it("expandedTokenCandidates matrix 22", () => {
    const candidates = expandedTokenCandidates("gh");
    expect(candidates[0]).toBe("gh");
  });
  it("expandedTokenSet matrix 22", () => {
    const set = expandedTokenSet(["gh"]);
    expect(set.has("gh")).toBe(true);
  });
  it("expandedTokenCandidates matrix 23", () => {
    const candidates = expandedTokenCandidates("cc");
    expect(candidates[0]).toBe("cc");
  });
  it("expandedTokenSet matrix 23", () => {
    const set = expandedTokenSet(["cc"]);
    expect(set.has("cc")).toBe(true);
  });
  it("expandedTokenCandidates matrix 24", () => {
    const candidates = expandedTokenCandidates("mcp");
    expect(candidates[0]).toBe("mcp");
  });
  it("expandedTokenSet matrix 24", () => {
    const set = expandedTokenSet(["mcp"]);
    expect(set.has("mcp")).toBe(true);
  });
  it("expandedTokenCandidates matrix 25", () => {
    const candidates = expandedTokenCandidates("skills");
    expect(candidates[0]).toBe("skills");
  });
  it("expandedTokenSet matrix 25", () => {
    const set = expandedTokenSet(["skills"]);
    expect(set.has("skills")).toBe(true);
  });
  it("expandedTokenCandidates matrix 26", () => {
    const candidates = expandedTokenCandidates("browser");
    expect(candidates[0]).toBe("browser");
  });
  it("expandedTokenSet matrix 26", () => {
    const set = expandedTokenSet(["browser"]);
    expect(set.has("browser")).toBe(true);
  });
  it("expandedTokenCandidates matrix 27", () => {
    const candidates = expandedTokenCandidates("security");
    expect(candidates[0]).toBe("security");
  });
  it("expandedTokenSet matrix 27", () => {
    const set = expandedTokenSet(["security"]);
    expect(set.has("security")).toBe(true);
  });
  it("expandedTokenCandidates matrix 28", () => {
    const candidates = expandedTokenCandidates("gh");
    expect(candidates[0]).toBe("gh");
  });
  it("expandedTokenSet matrix 28", () => {
    const set = expandedTokenSet(["gh"]);
    expect(set.has("gh")).toBe(true);
  });
  it("expandedTokenCandidates matrix 29", () => {
    const candidates = expandedTokenCandidates("cc");
    expect(candidates[0]).toBe("cc");
  });
  it("expandedTokenSet matrix 29", () => {
    const set = expandedTokenSet(["cc"]);
    expect(set.has("cc")).toBe(true);
  });
  it("expandedTokenCandidates matrix 30", () => {
    const candidates = expandedTokenCandidates("mcp");
    expect(candidates[0]).toBe("mcp");
  });
  it("expandedTokenSet matrix 30", () => {
    const set = expandedTokenSet(["mcp"]);
    expect(set.has("mcp")).toBe(true);
  });
  it("expandedTokenCandidates matrix 31", () => {
    const candidates = expandedTokenCandidates("skills");
    expect(candidates[0]).toBe("skills");
  });
  it("expandedTokenSet matrix 31", () => {
    const set = expandedTokenSet(["skills"]);
    expect(set.has("skills")).toBe(true);
  });
  it("expandedTokenCandidates matrix 32", () => {
    const candidates = expandedTokenCandidates("browser");
    expect(candidates[0]).toBe("browser");
  });
  it("expandedTokenSet matrix 32", () => {
    const set = expandedTokenSet(["browser"]);
    expect(set.has("browser")).toBe(true);
  });
  it("expandedTokenCandidates matrix 33", () => {
    const candidates = expandedTokenCandidates("security");
    expect(candidates[0]).toBe("security");
  });
  it("expandedTokenSet matrix 33", () => {
    const set = expandedTokenSet(["security"]);
    expect(set.has("security")).toBe(true);
  });
  it("expandedTokenCandidates matrix 34", () => {
    const candidates = expandedTokenCandidates("gh");
    expect(candidates[0]).toBe("gh");
  });
  it("expandedTokenSet matrix 34", () => {
    const set = expandedTokenSet(["gh"]);
    expect(set.has("gh")).toBe(true);
  });
  it("expandedTokenCandidates matrix 35", () => {
    const candidates = expandedTokenCandidates("cc");
    expect(candidates[0]).toBe("cc");
  });
  it("expandedTokenSet matrix 35", () => {
    const set = expandedTokenSet(["cc"]);
    expect(set.has("cc")).toBe(true);
  });
  it("expandedTokenCandidates matrix 36", () => {
    const candidates = expandedTokenCandidates("mcp");
    expect(candidates[0]).toBe("mcp");
  });
  it("expandedTokenSet matrix 36", () => {
    const set = expandedTokenSet(["mcp"]);
    expect(set.has("mcp")).toBe(true);
  });
  it("expandedTokenCandidates matrix 37", () => {
    const candidates = expandedTokenCandidates("skills");
    expect(candidates[0]).toBe("skills");
  });
  it("expandedTokenSet matrix 37", () => {
    const set = expandedTokenSet(["skills"]);
    expect(set.has("skills")).toBe(true);
  });
  it("expandedTokenCandidates matrix 38", () => {
    const candidates = expandedTokenCandidates("browser");
    expect(candidates[0]).toBe("browser");
  });
  it("expandedTokenSet matrix 38", () => {
    const set = expandedTokenSet(["browser"]);
    expect(set.has("browser")).toBe(true);
  });
  it("expandedTokenCandidates matrix 39", () => {
    const candidates = expandedTokenCandidates("security");
    expect(candidates[0]).toBe("security");
  });
  it("expandedTokenSet matrix 39", () => {
    const set = expandedTokenSet(["security"]);
    expect(set.has("security")).toBe(true);
  });
  it("expandedTokenCandidates matrix 40", () => {
    const candidates = expandedTokenCandidates("gh");
    expect(candidates[0]).toBe("gh");
  });
  it("expandedTokenSet matrix 40", () => {
    const set = expandedTokenSet(["gh"]);
    expect(set.has("gh")).toBe(true);
  });
  it("expandedTokenCandidates matrix 41", () => {
    const candidates = expandedTokenCandidates("cc");
    expect(candidates[0]).toBe("cc");
  });
  it("expandedTokenSet matrix 41", () => {
    const set = expandedTokenSet(["cc"]);
    expect(set.has("cc")).toBe(true);
  });
  it("expandedTokenCandidates matrix 42", () => {
    const candidates = expandedTokenCandidates("mcp");
    expect(candidates[0]).toBe("mcp");
  });
  it("expandedTokenSet matrix 42", () => {
    const set = expandedTokenSet(["mcp"]);
    expect(set.has("mcp")).toBe(true);
  });
  it("expandedTokenCandidates matrix 43", () => {
    const candidates = expandedTokenCandidates("skills");
    expect(candidates[0]).toBe("skills");
  });
  it("expandedTokenSet matrix 43", () => {
    const set = expandedTokenSet(["skills"]);
    expect(set.has("skills")).toBe(true);
  });
  it("expandedTokenCandidates matrix 44", () => {
    const candidates = expandedTokenCandidates("browser");
    expect(candidates[0]).toBe("browser");
  });
  it("expandedTokenSet matrix 44", () => {
    const set = expandedTokenSet(["browser"]);
    expect(set.has("browser")).toBe(true);
  });
  it("expandedTokenCandidates matrix 45", () => {
    const candidates = expandedTokenCandidates("security");
    expect(candidates[0]).toBe("security");
  });
  it("expandedTokenSet matrix 45", () => {
    const set = expandedTokenSet(["security"]);
    expect(set.has("security")).toBe(true);
  });
  it("expandedTokenCandidates matrix 46", () => {
    const candidates = expandedTokenCandidates("gh");
    expect(candidates[0]).toBe("gh");
  });
  it("expandedTokenSet matrix 46", () => {
    const set = expandedTokenSet(["gh"]);
    expect(set.has("gh")).toBe(true);
  });
  it("expandedTokenCandidates matrix 47", () => {
    const candidates = expandedTokenCandidates("cc");
    expect(candidates[0]).toBe("cc");
  });
  it("expandedTokenSet matrix 47", () => {
    const set = expandedTokenSet(["cc"]);
    expect(set.has("cc")).toBe(true);
  });
  it("expandedTokenCandidates matrix 48", () => {
    const candidates = expandedTokenCandidates("mcp");
    expect(candidates[0]).toBe("mcp");
  });
  it("expandedTokenSet matrix 48", () => {
    const set = expandedTokenSet(["mcp"]);
    expect(set.has("mcp")).toBe(true);
  });
  it("expandedTokenCandidates matrix 49", () => {
    const candidates = expandedTokenCandidates("skills");
    expect(candidates[0]).toBe("skills");
  });
  it("expandedTokenSet matrix 49", () => {
    const set = expandedTokenSet(["skills"]);
    expect(set.has("skills")).toBe(true);
  });
  it("expandedTokenCandidates matrix 50", () => {
    const candidates = expandedTokenCandidates("browser");
    expect(candidates[0]).toBe("browser");
  });
  it("expandedTokenSet matrix 50", () => {
    const set = expandedTokenSet(["browser"]);
    expect(set.has("browser")).toBe(true);
  });
  it("expandedTokenCandidates matrix 51", () => {
    const candidates = expandedTokenCandidates("security");
    expect(candidates[0]).toBe("security");
  });
  it("expandedTokenSet matrix 51", () => {
    const set = expandedTokenSet(["security"]);
    expect(set.has("security")).toBe(true);
  });
  it("expandedTokenCandidates matrix 52", () => {
    const candidates = expandedTokenCandidates("gh");
    expect(candidates[0]).toBe("gh");
  });
  it("expandedTokenSet matrix 52", () => {
    const set = expandedTokenSet(["gh"]);
    expect(set.has("gh")).toBe(true);
  });
  it("expandedTokenCandidates matrix 53", () => {
    const candidates = expandedTokenCandidates("cc");
    expect(candidates[0]).toBe("cc");
  });
  it("expandedTokenSet matrix 53", () => {
    const set = expandedTokenSet(["cc"]);
    expect(set.has("cc")).toBe(true);
  });
  it("expandedTokenCandidates matrix 54", () => {
    const candidates = expandedTokenCandidates("mcp");
    expect(candidates[0]).toBe("mcp");
  });
  it("expandedTokenSet matrix 54", () => {
    const set = expandedTokenSet(["mcp"]);
    expect(set.has("mcp")).toBe(true);
  });
  it("expandedTokenCandidates matrix 55", () => {
    const candidates = expandedTokenCandidates("skills");
    expect(candidates[0]).toBe("skills");
  });
  it("expandedTokenSet matrix 55", () => {
    const set = expandedTokenSet(["skills"]);
    expect(set.has("skills")).toBe(true);
  });
  it("expandedTokenCandidates matrix 56", () => {
    const candidates = expandedTokenCandidates("browser");
    expect(candidates[0]).toBe("browser");
  });
  it("expandedTokenSet matrix 56", () => {
    const set = expandedTokenSet(["browser"]);
    expect(set.has("browser")).toBe(true);
  });
  it("expandedTokenCandidates matrix 57", () => {
    const candidates = expandedTokenCandidates("security");
    expect(candidates[0]).toBe("security");
  });
  it("expandedTokenSet matrix 57", () => {
    const set = expandedTokenSet(["security"]);
    expect(set.has("security")).toBe(true);
  });
  it("expandedTokenCandidates matrix 58", () => {
    const candidates = expandedTokenCandidates("gh");
    expect(candidates[0]).toBe("gh");
  });
  it("expandedTokenSet matrix 58", () => {
    const set = expandedTokenSet(["gh"]);
    expect(set.has("gh")).toBe(true);
  });
  it("expandedTokenCandidates matrix 59", () => {
    const candidates = expandedTokenCandidates("cc");
    expect(candidates[0]).toBe("cc");
  });
  it("expandedTokenSet matrix 59", () => {
    const set = expandedTokenSet(["cc"]);
    expect(set.has("cc")).toBe(true);
  });
  it("expandedTokenCandidates matrix 60", () => {
    const candidates = expandedTokenCandidates("mcp");
    expect(candidates[0]).toBe("mcp");
  });
  it("expandedTokenSet matrix 60", () => {
    const set = expandedTokenSet(["mcp"]);
    expect(set.has("mcp")).toBe(true);
  });
  it("expandedTokenCandidates matrix 61", () => {
    const candidates = expandedTokenCandidates("skills");
    expect(candidates[0]).toBe("skills");
  });
  it("expandedTokenSet matrix 61", () => {
    const set = expandedTokenSet(["skills"]);
    expect(set.has("skills")).toBe(true);
  });
  it("expandedTokenCandidates matrix 62", () => {
    const candidates = expandedTokenCandidates("browser");
    expect(candidates[0]).toBe("browser");
  });
  it("expandedTokenSet matrix 62", () => {
    const set = expandedTokenSet(["browser"]);
    expect(set.has("browser")).toBe(true);
  });
  it("expandedTokenCandidates matrix 63", () => {
    const candidates = expandedTokenCandidates("security");
    expect(candidates[0]).toBe("security");
  });
  it("expandedTokenSet matrix 63", () => {
    const set = expandedTokenSet(["security"]);
    expect(set.has("security")).toBe(true);
  });
  it("expandedTokenCandidates matrix 64", () => {
    const candidates = expandedTokenCandidates("gh");
    expect(candidates[0]).toBe("gh");
  });
  it("expandedTokenSet matrix 64", () => {
    const set = expandedTokenSet(["gh"]);
    expect(set.has("gh")).toBe(true);
  });
  it("expandedTokenCandidates matrix 65", () => {
    const candidates = expandedTokenCandidates("cc");
    expect(candidates[0]).toBe("cc");
  });
  it("expandedTokenSet matrix 65", () => {
    const set = expandedTokenSet(["cc"]);
    expect(set.has("cc")).toBe(true);
  });
  it("expandedTokenCandidates matrix 66", () => {
    const candidates = expandedTokenCandidates("mcp");
    expect(candidates[0]).toBe("mcp");
  });
  it("expandedTokenSet matrix 66", () => {
    const set = expandedTokenSet(["mcp"]);
    expect(set.has("mcp")).toBe(true);
  });
  it("expandedTokenCandidates matrix 67", () => {
    const candidates = expandedTokenCandidates("skills");
    expect(candidates[0]).toBe("skills");
  });
  it("expandedTokenSet matrix 67", () => {
    const set = expandedTokenSet(["skills"]);
    expect(set.has("skills")).toBe(true);
  });
  it("expandedTokenCandidates matrix 68", () => {
    const candidates = expandedTokenCandidates("browser");
    expect(candidates[0]).toBe("browser");
  });
  it("expandedTokenSet matrix 68", () => {
    const set = expandedTokenSet(["browser"]);
    expect(set.has("browser")).toBe(true);
  });
  it("expandedTokenCandidates matrix 69", () => {
    const candidates = expandedTokenCandidates("security");
    expect(candidates[0]).toBe("security");
  });
  it("expandedTokenSet matrix 69", () => {
    const set = expandedTokenSet(["security"]);
    expect(set.has("security")).toBe(true);
  });
  it("expandedTokenCandidates matrix 70", () => {
    const candidates = expandedTokenCandidates("gh");
    expect(candidates[0]).toBe("gh");
  });
  it("expandedTokenSet matrix 70", () => {
    const set = expandedTokenSet(["gh"]);
    expect(set.has("gh")).toBe(true);
  });
  it("expandedTokenCandidates matrix 71", () => {
    const candidates = expandedTokenCandidates("cc");
    expect(candidates[0]).toBe("cc");
  });
  it("expandedTokenSet matrix 71", () => {
    const set = expandedTokenSet(["cc"]);
    expect(set.has("cc")).toBe(true);
  });
  it("expandedTokenCandidates matrix 72", () => {
    const candidates = expandedTokenCandidates("mcp");
    expect(candidates[0]).toBe("mcp");
  });
  it("expandedTokenSet matrix 72", () => {
    const set = expandedTokenSet(["mcp"]);
    expect(set.has("mcp")).toBe(true);
  });
  it("expandedTokenCandidates matrix 73", () => {
    const candidates = expandedTokenCandidates("skills");
    expect(candidates[0]).toBe("skills");
  });
  it("expandedTokenSet matrix 73", () => {
    const set = expandedTokenSet(["skills"]);
    expect(set.has("skills")).toBe(true);
  });
  it("expandedTokenCandidates matrix 74", () => {
    const candidates = expandedTokenCandidates("browser");
    expect(candidates[0]).toBe("browser");
  });
  it("expandedTokenSet matrix 74", () => {
    const set = expandedTokenSet(["browser"]);
    expect(set.has("browser")).toBe(true);
  });
  it("expandedTokenCandidates matrix 75", () => {
    const candidates = expandedTokenCandidates("security");
    expect(candidates[0]).toBe("security");
  });
  it("expandedTokenSet matrix 75", () => {
    const set = expandedTokenSet(["security"]);
    expect(set.has("security")).toBe(true);
  });
  it("expandedTokenCandidates matrix 76", () => {
    const candidates = expandedTokenCandidates("gh");
    expect(candidates[0]).toBe("gh");
  });
  it("expandedTokenSet matrix 76", () => {
    const set = expandedTokenSet(["gh"]);
    expect(set.has("gh")).toBe(true);
  });
  it("expandedTokenCandidates matrix 77", () => {
    const candidates = expandedTokenCandidates("cc");
    expect(candidates[0]).toBe("cc");
  });
  it("expandedTokenSet matrix 77", () => {
    const set = expandedTokenSet(["cc"]);
    expect(set.has("cc")).toBe(true);
  });
  it("expandedTokenCandidates matrix 78", () => {
    const candidates = expandedTokenCandidates("mcp");
    expect(candidates[0]).toBe("mcp");
  });
  it("expandedTokenSet matrix 78", () => {
    const set = expandedTokenSet(["mcp"]);
    expect(set.has("mcp")).toBe(true);
  });
  it("expandedTokenCandidates matrix 79", () => {
    const candidates = expandedTokenCandidates("skills");
    expect(candidates[0]).toBe("skills");
  });
  it("expandedTokenSet matrix 79", () => {
    const set = expandedTokenSet(["skills"]);
    expect(set.has("skills")).toBe(true);
  });
  it("expandedTokenCandidates matrix 80", () => {
    const candidates = expandedTokenCandidates("browser");
    expect(candidates[0]).toBe("browser");
  });
  it("expandedTokenSet matrix 80", () => {
    const set = expandedTokenSet(["browser"]);
    expect(set.has("browser")).toBe(true);
  });
  it("expandedTokenCandidates matrix 81", () => {
    const candidates = expandedTokenCandidates("security");
    expect(candidates[0]).toBe("security");
  });
  it("expandedTokenSet matrix 81", () => {
    const set = expandedTokenSet(["security"]);
    expect(set.has("security")).toBe(true);
  });
  it("expandedTokenCandidates matrix 82", () => {
    const candidates = expandedTokenCandidates("gh");
    expect(candidates[0]).toBe("gh");
  });
  it("expandedTokenSet matrix 82", () => {
    const set = expandedTokenSet(["gh"]);
    expect(set.has("gh")).toBe(true);
  });
  it("expandedTokenCandidates matrix 83", () => {
    const candidates = expandedTokenCandidates("cc");
    expect(candidates[0]).toBe("cc");
  });
  it("expandedTokenSet matrix 83", () => {
    const set = expandedTokenSet(["cc"]);
    expect(set.has("cc")).toBe(true);
  });
  it("expandedTokenCandidates matrix 84", () => {
    const candidates = expandedTokenCandidates("mcp");
    expect(candidates[0]).toBe("mcp");
  });
  it("expandedTokenSet matrix 84", () => {
    const set = expandedTokenSet(["mcp"]);
    expect(set.has("mcp")).toBe(true);
  });
  it("expandedTokenCandidates matrix 85", () => {
    const candidates = expandedTokenCandidates("skills");
    expect(candidates[0]).toBe("skills");
  });
  it("expandedTokenSet matrix 85", () => {
    const set = expandedTokenSet(["skills"]);
    expect(set.has("skills")).toBe(true);
  });
  it("expandedTokenCandidates matrix 86", () => {
    const candidates = expandedTokenCandidates("browser");
    expect(candidates[0]).toBe("browser");
  });
  it("expandedTokenSet matrix 86", () => {
    const set = expandedTokenSet(["browser"]);
    expect(set.has("browser")).toBe(true);
  });
  it("expandedTokenCandidates matrix 87", () => {
    const candidates = expandedTokenCandidates("security");
    expect(candidates[0]).toBe("security");
  });
  it("expandedTokenSet matrix 87", () => {
    const set = expandedTokenSet(["security"]);
    expect(set.has("security")).toBe(true);
  });
  it("expandedTokenCandidates matrix 88", () => {
    const candidates = expandedTokenCandidates("gh");
    expect(candidates[0]).toBe("gh");
  });
  it("expandedTokenSet matrix 88", () => {
    const set = expandedTokenSet(["gh"]);
    expect(set.has("gh")).toBe(true);
  });
  it("expandedTokenCandidates matrix 89", () => {
    const candidates = expandedTokenCandidates("cc");
    expect(candidates[0]).toBe("cc");
  });
  it("expandedTokenSet matrix 89", () => {
    const set = expandedTokenSet(["cc"]);
    expect(set.has("cc")).toBe(true);
  });
  it("expandedTokenCandidates matrix 90", () => {
    const candidates = expandedTokenCandidates("mcp");
    expect(candidates[0]).toBe("mcp");
  });
  it("expandedTokenSet matrix 90", () => {
    const set = expandedTokenSet(["mcp"]);
    expect(set.has("mcp")).toBe(true);
  });
  it("expandedTokenCandidates matrix 91", () => {
    const candidates = expandedTokenCandidates("skills");
    expect(candidates[0]).toBe("skills");
  });
  it("expandedTokenSet matrix 91", () => {
    const set = expandedTokenSet(["skills"]);
    expect(set.has("skills")).toBe(true);
  });
  it("expandedTokenCandidates matrix 92", () => {
    const candidates = expandedTokenCandidates("browser");
    expect(candidates[0]).toBe("browser");
  });
  it("expandedTokenSet matrix 92", () => {
    const set = expandedTokenSet(["browser"]);
    expect(set.has("browser")).toBe(true);
  });
  it("expandedTokenCandidates matrix 93", () => {
    const candidates = expandedTokenCandidates("security");
    expect(candidates[0]).toBe("security");
  });
  it("expandedTokenSet matrix 93", () => {
    const set = expandedTokenSet(["security"]);
    expect(set.has("security")).toBe(true);
  });
  it("expandedTokenCandidates matrix 94", () => {
    const candidates = expandedTokenCandidates("gh");
    expect(candidates[0]).toBe("gh");
  });
  it("expandedTokenSet matrix 94", () => {
    const set = expandedTokenSet(["gh"]);
    expect(set.has("gh")).toBe(true);
  });
  it("expandedTokenCandidates matrix 95", () => {
    const candidates = expandedTokenCandidates("cc");
    expect(candidates[0]).toBe("cc");
  });
  it("expandedTokenSet matrix 95", () => {
    const set = expandedTokenSet(["cc"]);
    expect(set.has("cc")).toBe(true);
  });
  it("expandedTokenCandidates matrix 96", () => {
    const candidates = expandedTokenCandidates("mcp");
    expect(candidates[0]).toBe("mcp");
  });
  it("expandedTokenSet matrix 96", () => {
    const set = expandedTokenSet(["mcp"]);
    expect(set.has("mcp")).toBe(true);
  });
  it("expandedTokenCandidates matrix 97", () => {
    const candidates = expandedTokenCandidates("skills");
    expect(candidates[0]).toBe("skills");
  });
  it("expandedTokenSet matrix 97", () => {
    const set = expandedTokenSet(["skills"]);
    expect(set.has("skills")).toBe(true);
  });
  it("expandedTokenCandidates matrix 98", () => {
    const candidates = expandedTokenCandidates("browser");
    expect(candidates[0]).toBe("browser");
  });
  it("expandedTokenSet matrix 98", () => {
    const set = expandedTokenSet(["browser"]);
    expect(set.has("browser")).toBe(true);
  });
  it("expandedTokenCandidates matrix 99", () => {
    const candidates = expandedTokenCandidates("security");
    expect(candidates[0]).toBe("security");
  });
  it("expandedTokenSet matrix 99", () => {
    const set = expandedTokenSet(["security"]);
    expect(set.has("security")).toBe(true);
  });
});

describe("search-query-aliases-lib non-alias and empty tokens", () => {
  it("queryAliasExpansions returns [] for an empty or whitespace token", () => {
    expect(queryAliasExpansions("")).toEqual([]);
    expect(queryAliasExpansions("   ")).toEqual([]);
  });

  it("queryAliasExpansions returns [] for a token that is not an alias key", () => {
    expect(queryAliasExpansions("spreadsheet")).toEqual([]);
  });

  it("queryAliasExpansions does not treat inherited prototype names as aliases", () => {
    // Object.hasOwn guards against "constructor"/"toString" resolving to Object.prototype.
    expect(queryAliasExpansions("constructor")).toEqual([]);
    expect(queryAliasExpansions("toString")).toEqual([]);
  });

  it("expandedTokenCandidates returns [] for an empty or whitespace token", () => {
    expect(expandedTokenCandidates("")).toEqual([]);
    expect(expandedTokenCandidates("   ")).toEqual([]);
  });

  it("expandedTokenCandidates returns just the token for a non-alias word", () => {
    expect(expandedTokenCandidates("spreadsheet")).toEqual(["spreadsheet"]);
  });
});
