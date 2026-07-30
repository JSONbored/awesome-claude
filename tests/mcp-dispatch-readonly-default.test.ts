import { describe, expect, it } from "vitest";

import { dispatchReadOnlyTool } from "../packages/mcp/src/registry-tool-orchestration-lib.js";

describe("dispatchReadOnlyTool default branch", () => {
  it("returns a domain invalid error for allowlisted names missing a switch case", async () => {
    const result = await dispatchReadOnlyTool(
      "registry.synthetic-missing-case",
      {},
      {},
    );

    expect(result).toEqual({
      ok: false,
      error: {
        code: "invalid_request",
        message:
          "Unknown read-only HeyClaude MCP tool: registry.synthetic-missing-case",
      },
    });
    // CallTool handlers check `result.ok === false`; undefined would throw.
    expect(result.ok).toBe(false);
  });
});
