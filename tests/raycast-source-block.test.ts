import { describe, expect, it } from "vitest";

import {
  escapeRegExp,
  objectBlock,
  objectDefinesKey,
} from "../scripts/lib/raycast-source-block.mjs";

describe("objectBlock", () => {
  const source = [
    "const categoryLabels = {",
    '  mcp: "MCP servers",',
    "  hooks: 'Hooks',",
    "};",
    "export const other = 1;",
  ].join("\n");

  it("extracts the body of a const object block", () => {
    const body = objectBlock(source, "categoryLabels");
    expect(body).toContain('mcp: "MCP servers"');
    expect(body).toContain("hooks: 'Hooks'");
  });

  it("also matches an `export const` block", () => {
    const exported = ["export const icons = {", "  mcp: Icon.Box,", "};"].join(
      "\n",
    );
    expect(objectBlock(exported, "icons")).toContain("mcp: Icon.Box");
  });

  it("returns '' when the named block is absent", () => {
    expect(objectBlock(source, "missing")).toBe("");
  });
});

describe("escapeRegExp", () => {
  it("escapes regex metacharacters", () => {
    expect(escapeRegExp("a.b*c")).toBe("a\\.b\\*c");
    expect(escapeRegExp("plain")).toBe("plain");
  });
});

describe("objectDefinesKey", () => {
  const block = [
    '  mcp: "MCP",',
    "  'state-of-ai': 1,",
    "  nested: { x: 1 },",
  ].join("\n");

  it("detects a bare key", () => {
    expect(objectDefinesKey(block, "mcp")).toBe(true);
    expect(objectDefinesKey(block, "nested")).toBe(true);
  });

  it("detects a quoted key (with regex-special characters escaped)", () => {
    expect(objectDefinesKey(block, "state-of-ai")).toBe(true);
  });

  it("is false for a key the block does not define", () => {
    expect(objectDefinesKey(block, "hooks")).toBe(false);
    // 'x' only appears nested, not as a top-of-line key of this block
    expect(objectDefinesKey("  mcp: 1,", "state")).toBe(false);
  });
});
