import { describe, expect, it } from "vitest";

import { MCP_PUBLIC_POLICY } from "../packages/mcp/src/registry-tools-lib.js";
import {
  invalid,
  invalidWithDetails,
  notFound,
  notes,
  unavailable,
  withPublicPolicy,
} from "../packages/mcp/src/registry-response-lib.js";

describe("registry-response-lib note normalization", () => {
  it("trims and drops empty note values", () => {
    expect(notes(["  safety first  ", "", "  privacy  "])).toEqual([
      "safety first",
      "privacy",
    ]);
    expect(notes("not-an-array")).toEqual([]);
  });
});

describe("registry-response-lib error envelopes", () => {
  it("builds not_found and invalid_request envelopes", () => {
    expect(notFound("missing entry")).toEqual({
      ok: false,
      error: { code: "not_found", message: "missing entry" },
    });
    expect(invalid("bad args")).toEqual({
      ok: false,
      error: { code: "invalid_request", message: "bad args" },
    });
    expect(invalidWithDetails("bad args", { field: "slug" })).toEqual({
      ok: false,
      error: {
        code: "invalid_request",
        message: "bad args",
        details: { field: "slug" },
      },
    });
  });

  it("builds unavailable envelopes with optional details", () => {
    expect(unavailable("upstream failed")).toEqual({
      ok: false,
      error: { code: "unavailable", message: "upstream failed" },
    });
    expect(unavailable("upstream failed", "timeout")).toEqual({
      ok: false,
      error: {
        code: "unavailable",
        message: "upstream failed",
        details: "timeout",
      },
    });
  });
});

describe("registry-response-lib policy attachment", () => {
  it("adds the public MCP policy to object payloads once", () => {
    expect(withPublicPolicy({ ok: true, kind: "registry.search" })).toEqual({
      ok: true,
      kind: "registry.search",
      policy: MCP_PUBLIC_POLICY,
    });
    expect(
      withPublicPolicy({
        ok: true,
        policy: { readOnly: true },
      }),
    ).toEqual({
      ok: true,
      policy: { readOnly: true },
    });
  });

  it("returns non-object payloads unchanged", () => {
    expect(withPublicPolicy(null)).toBeNull();
    expect(withPublicPolicy("plain")).toBe("plain");
    expect(withPublicPolicy([1, 2])).toEqual([1, 2]);
  });
});
