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

  it("treats empty arrays and objects as absent content", () => {
    expect(contentAsset("items", "Collection items", [], "json")).toBeNull();
    expect(contentAsset("items", "Collection items", {}, "json")).toBeNull();
  });

  it("still serializes non-empty array and object content", () => {
    expect(
      contentAsset("items", "Collection items", ["a", "b"], "json"),
    ).toMatchObject({
      type: "items",
      format: "json",
      content: '[\n  "a",\n  "b"\n]',
    });
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

describe("registry-asset-lib categoryPrimaryAsset fallbacks", () => {
  it("falls back to full_content preference for an unrecognized category", () => {
    expect(
      categoryPrimaryAsset({
        category: "mystery",
        fullCopyableContent: "hello world",
      }),
    ).toMatchObject({ type: "full_content", content: "hello world" });
  });

  it("returns the first available asset when no preferred type is present", () => {
    // mcp prefers config_snippet/install_command/usage; only full_content exists,
    // so the response falls through to the first available asset.
    expect(
      categoryPrimaryAsset({ category: "mcp", body: "just the body" }),
    ).toMatchObject({ type: "full_content", content: "just the body" });
  });

  it("returns null when the entry has no copyable assets", () => {
    expect(categoryPrimaryAsset({ category: "mcp" })).toBeNull();
  });
});
