import { describe, expect, it } from "vitest";

import {
  SearchRegistryInputSchema,
  parseToolArguments,
} from "../packages/mcp/src/schemas.js";

describe("mcp schemas re-export", () => {
  it("re-exports SearchRegistryInputSchema from schemas-lib", () => {
    const result = SearchRegistryInputSchema.safeParse({ query: "mcp" });
    expect(result.success).toBe(true);
  });

  it("re-exports parseToolArguments through the public schemas surface", () => {
    expect(parseToolArguments("registry.stats", {})).toEqual({});
  });
});
