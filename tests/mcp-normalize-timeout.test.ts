import { describe, expect, it } from "vitest";

import {
  normalizeTimeoutMs,
  DEFAULT_REQUEST_TIMEOUT_MS,
} from "../packages/mcp/src/endpoint-url.js";

describe("normalizeTimeoutMs", () => {
  it("returns the fallback for nullish/empty input", () => {
    // Unset values fall back rather than erroring, so callers can pass through
    // optional config without special-casing it.
    expect(normalizeTimeoutMs(undefined, 5000)).toBe(5000);
    expect(normalizeTimeoutMs(null, 5000)).toBe(5000);
    expect(normalizeTimeoutMs("", 5000)).toBe(5000);
  });

  it("defaults to DEFAULT_REQUEST_TIMEOUT_MS when no fallback is given", () => {
    expect(normalizeTimeoutMs(undefined)).toBe(DEFAULT_REQUEST_TIMEOUT_MS);
  });

  it("accepts in-range numbers and numeric strings, truncating fractions", () => {
    expect(normalizeTimeoutMs(2500)).toBe(2500);
    expect(normalizeTimeoutMs("3000")).toBe(3000);
    expect(normalizeTimeoutMs(2500.9)).toBe(2500);
  });

  it("accepts the inclusive boundary values 1000 and 300000", () => {
    expect(normalizeTimeoutMs(1000)).toBe(1000);
    expect(normalizeTimeoutMs(300000)).toBe(300000);
  });

  it("throws for out-of-range or non-numeric values", () => {
    const message = "Timeout must be between 1000 and 300000 milliseconds.";
    expect(() => normalizeTimeoutMs(999)).toThrow(message);
    expect(() => normalizeTimeoutMs(300001)).toThrow(message);
    expect(() => normalizeTimeoutMs("abc")).toThrow(message);
  });
});
