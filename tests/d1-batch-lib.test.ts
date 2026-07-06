import { describe, expect, it } from "vitest";

import {
  chunk,
  D1_SAFE_VARIABLE_BATCH_SIZE,
  inPlaceholders,
  targetPairConditions,
} from "../apps/web/src/lib/d1-batch-lib";

describe("D1_SAFE_VARIABLE_BATCH_SIZE", () => {
  it("is the conservative default of 25", () => {
    expect(D1_SAFE_VARIABLE_BATCH_SIZE).toBe(25);
  });
});

describe("chunk", () => {
  it("returns an empty array for empty input", () => {
    expect(chunk([])).toEqual([]);
  });

  it("splits into contiguous batches of at most `size`", () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it("keeps a single batch when input fits within `size`", () => {
    expect(chunk([1, 2], 5)).toEqual([[1, 2]]);
  });

  it("produces even batches for an exact multiple", () => {
    expect(chunk([1, 2, 3, 4], 2)).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  it("defaults to the safe batch size", () => {
    const items = Array.from({ length: 55 }, (_, i) => i);
    const batches = chunk(items);
    expect(batches).toHaveLength(3);
    expect(batches[0]).toHaveLength(25);
    expect(batches[1]).toHaveLength(25);
    expect(batches[2]).toHaveLength(5);
  });

  it("throws a RangeError for a non-positive size", () => {
    expect(() => chunk([1], 0)).toThrow(RangeError);
    expect(() => chunk([1], -3)).toThrow(RangeError);
  });
});

describe("inPlaceholders", () => {
  it("builds a comma-separated placeholder list", () => {
    expect(inPlaceholders(3)).toBe("?, ?, ?");
    expect(inPlaceholders(1)).toBe("?");
  });

  it("returns an empty string for a zero count", () => {
    expect(inPlaceholders(0)).toBe("");
  });
});

describe("targetPairConditions", () => {
  it("joins per-pair conditions with OR", () => {
    expect(targetPairConditions(2, "target_kind", "target_key")).toBe(
      "(target_kind = ? AND target_key = ?) OR (target_kind = ? AND target_key = ?)",
    );
  });

  it("emits a single group for a count of one", () => {
    expect(targetPairConditions(1, "k", "v")).toBe("(k = ? AND v = ?)");
  });

  it("returns an empty string for an empty batch", () => {
    expect(targetPairConditions(0, "k", "v")).toBe("");
  });
});
