import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(import.meta.dirname, "..");

function readRoute(rel: string) {
  return readFileSync(resolve(root, rel), "utf8");
}

describe("crawlable /og routes rate-limit the Satori render (#5452)", () => {
  it("og.index enforces the og.render ceiling before rendering", () => {
    const src = readRoute("apps/web/src/routes/og.index.ts");
    expect(src).toContain('getApiRouteDefinition("og.render")');
    expect(src).toContain("enforceRateLimit(ogRoute, request)");
    expect(src).toContain('apiError("rate_limited", 429');
    expect(src.indexOf("enforceRateLimit")).toBeLessThan(src.indexOf("renderOgPng"));
  });

  it("og.$category.$slug enforces the og.render ceiling before rendering", () => {
    const src = readRoute("apps/web/src/routes/og.$category.$slug.ts");
    expect(src).toContain('getApiRouteDefinition("og.render")');
    expect(src).toContain("enforceRateLimit(ogRoute, request)");
    expect(src).toContain('apiError("rate_limited", 429');
    expect(src.indexOf("enforceRateLimit")).toBeLessThan(src.indexOf("renderOgPng"));
  });
});
