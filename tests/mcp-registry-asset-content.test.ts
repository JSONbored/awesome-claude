import { describe, expect, it } from "vitest";

import {
  categoryPrimaryAsset,
  contentAsset,
} from "../packages/mcp/src/registry-asset-lib.js";

describe("registry-asset-lib object content", () => {
  it("serializes object content as pretty JSON", () => {
    const asset = contentAsset("items", "Items", { a: 1 }, "json");
    expect(asset.content).toBe(JSON.stringify({ a: 1 }, null, 2));
    expect(asset.format).toBe("json");
    expect(asset.length).toBe(asset.content.length);
  });

  it("skips assets whose content is empty after trimming", () => {
    expect(contentAsset("usage", "Usage", "   ")).toBeNull();
  });
});

describe("registry-asset-lib primary asset selection", () => {
  it("returns null when the entry has no copyable content", () => {
    expect(categoryPrimaryAsset({ category: "mcp" })).toBeNull();
  });

  it("falls back to the first available asset for unknown categories", () => {
    const primary = categoryPrimaryAsset({
      category: "not-a-real-category",
      installCommand: "npx -y demo",
    });
    expect(primary.type).toBe("install_command");
  });
});
