import { describe, expect, it } from "vitest";

import { parseGitContentUpdatedAt } from "../scripts/lib/git-content-updated-at.mjs";

describe("parseGitContentUpdatedAt", () => {
  it("maps each content .mdx path to its commit timestamp", () => {
    const output = [
      "@@heyclaude:2026-02-02T00:00:00Z",
      "content/agents/a.mdx",
      "content/mcp/b.mdx",
    ].join("\n");
    expect([...parseGitContentUpdatedAt(output).entries()]).toEqual([
      ["content/agents/a.mdx", "2026-02-02T00:00:00Z"],
      ["content/mcp/b.mdx", "2026-02-02T00:00:00Z"],
    ]);
  });

  it("keeps the first (most recent) timestamp for a repeated path", () => {
    const output = [
      "@@heyclaude:2026-02-02T00:00:00Z",
      "content/agents/a.mdx",
      "@@heyclaude:2026-01-01T00:00:00Z",
      "content/agents/a.mdx",
    ].join("\n");
    expect(parseGitContentUpdatedAt(output).get("content/agents/a.mdx")).toBe(
      "2026-02-02T00:00:00Z",
    );
  });

  it("skips non-content paths and non-mdx files", () => {
    const output = [
      "@@heyclaude:2026-02-02T00:00:00Z",
      "content/agents/a.mdx",
      "README.md",
      "content/agents/a.json",
    ].join("\n");
    expect([...parseGitContentUpdatedAt(output).keys()]).toEqual([
      "content/agents/a.mdx",
    ]);
  });

  it("skips file lines that appear before any commit marker", () => {
    const output = ["content/agents/orphan.mdx"].join("\n");
    expect(parseGitContentUpdatedAt(output).size).toBe(0);
  });

  it("resets on a blank commit marker so later files are skipped", () => {
    const output = ["@@heyclaude:", "content/agents/a.mdx"].join("\n");
    expect(parseGitContentUpdatedAt(output).size).toBe(0);
  });

  it("returns an empty map for empty/nullish output", () => {
    expect(parseGitContentUpdatedAt("").size).toBe(0);
    expect(parseGitContentUpdatedAt(null).size).toBe(0);
  });
});
