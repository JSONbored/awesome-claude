import { describe, expect, it } from "vitest";

import {
  CATEGORY_SCHEMAS,
  headingId,
  validateEntry,
} from "@heyclaude/registry/content-schema";

describe("registry content-schema re-export", () => {
  it("re-exports schema constants from content-schema-lib", () => {
    expect(CATEGORY_SCHEMAS.mcp).toBeDefined();
    expect(CATEGORY_SCHEMAS.mcp.required).toContain("slug");
  });

  it("re-exports headingId through the public registry surface", () => {
    expect(headingId("MCP Server Setup")).toBe("mcp-server-setup");
  });

  it("re-exports validateEntry through the public registry surface", () => {
    const result = validateEntry("mcp", {
      slug: "demo-mcp",
      title: "Demo MCP",
      description: "Test MCP server.",
      cardDescription: "Test MCP server.",
      author: "JSONbored",
      dateAdded: "2026-01-01",
    });
    expect(result.missingRequired).toEqual([]);
  });
});
