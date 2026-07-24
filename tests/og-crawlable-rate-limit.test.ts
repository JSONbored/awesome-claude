import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getApiRouteDefinition } from "@/lib/api/contracts";

const root = resolve(import.meta.dirname, "..");

function readRoute(rel: string) {
  return readFileSync(resolve(root, rel), "utf8");
}

const enforceApiRateLimit = vi.fn();

vi.mock("@/lib/api/router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api/router")>();
  return {
    ...actual,
    enforceApiRateLimit: (...args: unknown[]) => enforceApiRateLimit(...args),
  };
});

describe("crawlable /og routes share the og.render rate-limit contract (#5452)", () => {
  beforeEach(() => {
    enforceApiRateLimit.mockReset();
  });

  it("og.render is the same contract /api/og uses (shared ceiling)", () => {
    const route = getApiRouteDefinition("og.render");
    expect(route.path).toBe("/api/og");
    expect(route.rateLimit?.scope).toBe("og-image");
    expect(route.rateLimit?.limit).toBe(90);
  });

  it("returns a 429 rate_limited Response when the shared ceiling is hit", async () => {
    enforceApiRateLimit.mockResolvedValue(true);
    const { maybeOgRateLimitedResponse } =
      await import("@/lib/og-rate-limit-lib");
    const res = await maybeOgRateLimitedResponse(
      new Request("https://heyclau.de/og?title=x"),
    );
    expect(res).not.toBeNull();
    expect(res!.status).toBe(429);
    const body = (await res!.json()) as { error: { code: string } };
    expect(body.error.code).toBe("rate_limited");
    expect(enforceApiRateLimit).toHaveBeenCalledTimes(1);
    const [definition] = enforceApiRateLimit.mock.calls[0]!;
    expect(definition).toMatchObject({ id: "og.render" });
  });

  it("returns null when under the ceiling so callers can render", async () => {
    enforceApiRateLimit.mockResolvedValue(false);
    const { maybeOgRateLimitedResponse } =
      await import("@/lib/og-rate-limit-lib");
    const res = await maybeOgRateLimitedResponse(
      new Request("https://heyclau.de/og?title=x"),
    );
    expect(res).toBeNull();
  });

  it("og.index and og.$category.$slug call the shared gate before rendering", () => {
    for (const rel of [
      "apps/web/src/routes/og.index.ts",
      "apps/web/src/routes/og.$category.$slug.ts",
    ]) {
      const src = readRoute(rel);
      expect(src).toContain("maybeOgRateLimitedResponse(request)");
      expect(src.indexOf("maybeOgRateLimitedResponse")).toBeLessThan(
        src.indexOf("renderOgPng"),
      );
    }
  });
});
