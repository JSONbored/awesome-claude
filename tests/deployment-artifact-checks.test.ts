import { describe, expect, it } from "vitest";

import {
  canonicalOrigin,
  isCanonicalSubmitUrl,
  normalizeBaseUrl,
  readEntries,
} from "../scripts/lib/deployment-artifact-checks.mjs";

describe("normalizeBaseUrl", () => {
  it("returns '' for empty/whitespace/nullish input", () => {
    expect(normalizeBaseUrl("")).toBe("");
    expect(normalizeBaseUrl("   ")).toBe("");
    expect(normalizeBaseUrl(null)).toBe("");
    expect(normalizeBaseUrl(undefined)).toBe("");
  });

  it("trims and strips trailing slashes", () => {
    expect(normalizeBaseUrl("  https://x.dev/  ")).toBe("https://x.dev");
    expect(normalizeBaseUrl("https://x.dev///")).toBe("https://x.dev");
  });

  it("leaves a clean URL unchanged", () => {
    expect(normalizeBaseUrl("https://x.dev/base")).toBe("https://x.dev/base");
  });
});

describe("isCanonicalSubmitUrl", () => {
  it("accepts exactly the canonical /submit URL", () => {
    expect(isCanonicalSubmitUrl(`${canonicalOrigin}/submit`)).toBe(true);
  });

  it("rejects a different origin", () => {
    expect(isCanonicalSubmitUrl("https://evil.example/submit")).toBe(false);
  });

  it("rejects a different path", () => {
    expect(isCanonicalSubmitUrl(`${canonicalOrigin}/submitx`)).toBe(false);
    expect(isCanonicalSubmitUrl(`${canonicalOrigin}/`)).toBe(false);
  });

  it("rejects an unparseable value", () => {
    expect(isCanonicalSubmitUrl("not a url")).toBe(false);
    expect(isCanonicalSubmitUrl("")).toBe(false);
    expect(isCanonicalSubmitUrl(null)).toBe(false);
  });
});

describe("readEntries", () => {
  it("returns the entries array when present", () => {
    const entries = [{ slug: "a" }];
    expect(readEntries({ entries })).toBe(entries);
  });

  it("returns null when entries is missing or not an array", () => {
    expect(readEntries({})).toBeNull();
    expect(readEntries({ entries: "nope" })).toBeNull();
    expect(readEntries(null)).toBeNull();
    expect(readEntries(undefined)).toBeNull();
  });
});
