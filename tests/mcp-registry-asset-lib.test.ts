import { describe, expect, it } from "vitest";

import {
  categoryPrimaryAsset,
  contentAsset,
  entryInstallComplexity,
} from "../packages/mcp/src/registry-asset-lib.js";

describe("registry-asset-lib content assets", () => {
  it("builds typed assets and skips empty content", () => {
    expect(contentAsset("usage", "Usage snippet", "Run `npm test`")).toEqual({
      type: "usage",
      label: "Usage snippet",
      format: "markdown",
      content: "Run `npm test`",
      length: 14,
    });
    expect(contentAsset("items", "Collection items", null)).toBeNull();
    expect(contentAsset("usage", "Usage snippet", "   ")).toBeNull();
  });
});

describe("registry-asset-lib category primary asset", () => {
  it("prefers category-specific asset types", () => {
    const entry = {
      category: "skills",
      installCommand: "npm install -g skill",
      body: "Skill body",
    };
    expect(categoryPrimaryAsset(entry)).toMatchObject({
      type: "install_command",
      content: "npm install -g skill",
    });
  });

  it("falls back to full content when preferred types are missing", () => {
    const entry = {
      category: "guides",
      body: "Guide content",
    };
    expect(categoryPrimaryAsset(entry)).toMatchObject({
      type: "full_content",
      content: "Guide content",
    });
  });
});

describe("registry-asset-lib install complexity", () => {
  it("scores install complexity from available setup fields", () => {
    expect(entryInstallComplexity({})).toBe("unknown");
    expect(
      entryInstallComplexity({ installCommand: "npm install -g tool" }),
    ).toBe("low");
    expect(
      entryInstallComplexity({
        installCommand: "npm install -g tool",
        configSnippet: "export KEY=1",
      }),
    ).toBe("medium");
    expect(
      entryInstallComplexity({
        installCommand: "npm install -g tool",
        configSnippet: "export KEY=1",
        downloadUrl: "https://example.com/pkg.tgz",
      }),
    ).toBe("higher");
  });
});

describe("registry-asset-lib object content and empty entries", () => {
  it("serializes object content as pretty JSON", () => {
    const asset = contentAsset("items", "Items", { a: 1 }, "json");
    expect(asset.content).toBe(JSON.stringify({ a: 1 }, null, 2));
    expect(asset.format).toBe("json");
  });

  it("returns null primary asset when the entry has no copyable content", () => {
    expect(categoryPrimaryAsset({ category: "mcp" })).toBeNull();
  });
});
