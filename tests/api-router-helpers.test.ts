import { describe, expect, it } from "vitest";

import { apiError, withApiHeaders, getApiRequestId } from "@/lib/api/router";

describe("apiError", () => {
  it("builds a JSON error response with the given code and status", async () => {
    const response = apiError("not_found", 404, {
      message: "Missing",
      requestId: "req-1",
    });
    expect(response.status).toBe(404);
    expect(response.headers.get("content-type")).toContain("application/json");
    const body = await response.json();
    expect(body).toMatchObject({
      ok: false,
      error: { code: "not_found", message: "Missing" },
      requestId: "req-1",
    });
  });

  it("applies the standard security headers to error responses", () => {
    const response = apiError("bad_request", 400);
    // Error responses go through the shared security-header layer.
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
  });

  it("carries optional structured details when provided", async () => {
    const response = apiError("invalid", 422, {
      details: { field: "slug" },
    });
    const body = await response.json();
    expect(body.error.details).toEqual({ field: "slug" });
  });
});

describe("withApiHeaders", () => {
  it("adds the security headers to an existing response", () => {
    const response = withApiHeaders(new Response("ok"));
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
  });
});

describe("getApiRequestId", () => {
  it("returns the incoming x-request-id header when present", () => {
    const request = new Request("https://heyclau.de/api/x", {
      headers: { "x-request-id": "abc-123" },
    });
    expect(getApiRequestId(request)).toBe("abc-123");
  });

  it("generates a non-empty id when no header is present", () => {
    // A stable id is always returned so responses can be correlated in logs.
    const id = getApiRequestId(new Request("https://heyclau.de/api/x"));
    expect(typeof id).toBe("string");
    expect(id.length).toBeGreaterThan(0);
  });
});
