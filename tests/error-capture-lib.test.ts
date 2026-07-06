import { describe, expect, it } from "vitest";

import {
  CAPTURE_TTL_MS,
  isCaptureFresh,
} from "../apps/web/src/lib/error-capture-lib";

describe("isCaptureFresh", () => {
  it("is fresh while within the ttl window", () => {
    expect(isCaptureFresh(1_000, 1_000 + (CAPTURE_TTL_MS - 1))).toBe(true);
  });

  it("is fresh exactly at the ttl boundary", () => {
    expect(isCaptureFresh(1_000, 1_000 + CAPTURE_TTL_MS)).toBe(true);
  });

  it("is stale beyond the ttl window", () => {
    expect(isCaptureFresh(1_000, 1_000 + CAPTURE_TTL_MS + 1)).toBe(false);
  });

  it("honours a custom ttl argument", () => {
    expect(isCaptureFresh(0, 100, 100)).toBe(true);
    expect(isCaptureFresh(0, 101, 100)).toBe(false);
  });

  it("exposes a 5000ms default ttl", () => {
    expect(CAPTURE_TTL_MS).toBe(5000);
  });
});
