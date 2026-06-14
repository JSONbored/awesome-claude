import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { applyEdgeCacheHeaders } from "@/lib/security-headers";
import { repoRoot } from "./helpers/registry-fixtures";

function htmlHeaders(extra: Record<string, string> = {}) {
  return new Headers({ "content-type": "text/html; charset=utf-8", ...extra });
}

describe("edge cache policy", () => {
  it("caches a plain 200 text/html GET response at the edge", () => {
    const headers = applyEdgeCacheHeaders(htmlHeaders(), 200, "GET");
    expect(headers.get("cache-control")).toContain("s-maxage=300");
    expect(headers.get("cache-control")).toContain("stale-while-revalidate");
  });

  it("never overrides a route's own Cache-Control (e.g. no-store)", () => {
    const headers = applyEdgeCacheHeaders(
      htmlHeaders({ "cache-control": "no-store" }),
      200,
      "GET",
    );
    expect(headers.get("cache-control")).toBe("no-store");
  });

  it("does not cache personalized responses that set a cookie", () => {
    const headers = applyEdgeCacheHeaders(
      htmlHeaders({ "set-cookie": "session=abc" }),
      200,
      "GET",
    );
    expect(headers.has("cache-control")).toBe(false);
  });

  it("does not cache non-GET, non-200, or non-HTML responses", () => {
    expect(applyEdgeCacheHeaders(htmlHeaders(), 200, "POST").has("cache-control")).toBe(false);
    expect(applyEdgeCacheHeaders(htmlHeaders(), 404, "GET").has("cache-control")).toBe(false);
    expect(applyEdgeCacheHeaders(htmlHeaders(), 500, "GET").has("cache-control")).toBe(false);
    const json = new Headers({ "content-type": "application/json" });
    expect(applyEdgeCacheHeaders(json, 200, "GET").has("cache-control")).toBe(false);
  });

  it("sets Cache-Control on the /data/* static-asset rule", () => {
    const headersFile = fs.readFileSync(
      path.join(repoRoot, "apps/web/public/_headers"),
      "utf8",
    );
    const dataBlock = headersFile.split("/data/*")[1]?.split(/\n\/\S/)[0] ?? "";
    expect(dataBlock).toContain("Cache-Control: public");
    expect(dataBlock).toContain("stale-while-revalidate");
  });
});
