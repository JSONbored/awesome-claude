import { describe, expect, it } from "vitest";

import { applyMcpHeaders } from "../apps/web/src/lib/mcp-headers-lib";

describe("applyMcpHeaders", () => {
  it("applies the MCP CORS headers and no-store caching", () => {
    const res = applyMcpHeaders(new Response("hi", { status: 200 }));
    expect(res.headers.get("access-control-allow-origin")).toBe("*");
    expect(res.headers.get("access-control-allow-methods")).toBe(
      "POST, DELETE, OPTIONS",
    );
    expect(res.headers.get("access-control-expose-headers")).toContain(
      "mcp-session-id",
    );
    expect(res.headers.get("cache-control")).toBe("no-store");
  });

  it("preserves status, status text, and body", async () => {
    const res = applyMcpHeaders(
      new Response("payload", { status: 202, statusText: "Accepted" }),
    );
    expect(res.status).toBe(202);
    expect(res.statusText).toBe("Accepted");
    expect(await res.text()).toBe("payload");
  });

  it("carries incoming headers through", () => {
    const res = applyMcpHeaders(
      new Response(null, { status: 204, headers: { "x-keep": "1" } }),
    );
    expect(res.headers.get("x-keep")).toBe("1");
  });
});
