import { describe, expect, it } from "vitest";

import {
  looksLikeHash,
  parseSinceDate,
} from "../apps/web/src/lib/registry-diff-lib";

describe("parseSinceDate", () => {
  it("parses an ISO date to epoch ms", () => {
    expect(parseSinceDate("2026-01-02T00:00:00Z")).toBe(
      Date.parse("2026-01-02T00:00:00Z"),
    );
  });

  it("returns null for absent or unparseable values", () => {
    expect(parseSinceDate(null)).toBeNull();
    expect(parseSinceDate("")).toBeNull();
    expect(parseSinceDate("not-a-date")).toBeNull();
  });
});

describe("looksLikeHash", () => {
  it("accepts 32–128 char hex, case-insensitively", () => {
    expect(looksLikeHash("a".repeat(32))).toBe(true);
    expect(looksLikeHash("ABCDEF0123".padEnd(64, "0"))).toBe(true);
  });

  it("rejects too-short, too-long, non-hex, or empty values", () => {
    expect(looksLikeHash("a".repeat(31))).toBe(false);
    expect(looksLikeHash("a".repeat(129))).toBe(false);
    expect(looksLikeHash("z".repeat(40))).toBe(false);
    expect(looksLikeHash(null)).toBe(false);
    expect(looksLikeHash("")).toBe(false);
  });
});
