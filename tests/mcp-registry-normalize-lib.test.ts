import { describe, expect, it } from "vitest";

import {
  normalizeLimit,
  normalizeOffset,
  normalizePlatform,
  normalizeText,
} from "../packages/mcp/src/registry-normalize-lib.js";

describe("registry-normalize-lib text and pagination", () => {
  it("normalizes text to trimmed lowercase", () => {
    expect(normalizeText("  Skills  ")).toBe("skills");
    expect(normalizeText("")).toBe("");
  });

  it("clamps registry list limits and offsets", () => {
    expect(normalizeLimit(3)).toBe(3);
    expect(normalizeLimit(100)).toBe(25);
    expect(normalizeLimit("not-a-number")).toBe(10);
    expect(normalizeOffset(10)).toBe(10);
    expect(normalizeOffset(9000)).toBe(5000);
    expect(normalizeOffset(-5)).toBe(0);
  });
});

describe("registry-normalize-lib platform aliases", () => {
  it("resolves common platform aliases to canonical registry IDs", () => {
    expect(normalizePlatform("Claude")).toBe("claude-code");
    expect(normalizePlatform("openai")).toBe("codex");
    expect(normalizePlatform("VS Code")).toBe("vscode");
    expect(normalizePlatform("generic-agents")).toBe("cli");
  });

  it("returns empty string for blank platform filters", () => {
    expect(normalizePlatform("   ")).toBe("");
  });

  it("resolves antigravity and rejects unrecognized platforms (#5685)", () => {
    expect(normalizePlatform("Antigravity")).toBe("antigravity");
    expect(normalizePlatform("Cluade Code")).toBe("");
  });
});
