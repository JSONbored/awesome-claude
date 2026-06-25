import { describe, expect, it } from "vitest";
import { z } from "zod";

// Deep-relative test imports use the `.js` specifier across this repo's suite;
// the bundler maps it to the TypeScript source.
import {
  jsonSchemaForToolOutput,
  formatZodError,
} from "../packages/mcp/src/schemas.js";

describe("jsonSchemaForToolOutput", () => {
  it("returns a JSON-schema object for a known tool", () => {
    const schema = jsonSchemaForToolOutput("entry.compare");
    expect(schema.type).toBe("object");
    expect(schema.properties).toHaveProperty("ok");
    expect(schema.required).toContain("ok");
  });

  it("throws for an unknown tool name", () => {
    // The exact message is part of the helper's contract: callers/log scrapers
    // key on it, so the test pins it against the current implementation.
    expect(() => jsonSchemaForToolOutput("not_a_real_tool")).toThrow(
      "Unknown HeyClaude MCP tool output schema",
    );
  });
});

describe("formatZodError", () => {
  it("flattens a ZodError into path/message/code issues", () => {
    const result = z.object({ a: z.string() }).safeParse({ a: 123 });
    expect(result.success).toBe(false);
    if (result.success) return;
    const issues = formatZodError(result.error);
    expect(issues).not.toBeNull();
    expect(issues![0]).toMatchObject({ path: "a", code: "invalid_type" });
    expect(typeof issues![0].message).toBe("string");
  });

  it("returns null for a non-Zod error", () => {
    // Only ZodErrors are formatted; anything else is passed back as null.
    expect(formatZodError(new Error("boom"))).toBeNull();
  });
});
