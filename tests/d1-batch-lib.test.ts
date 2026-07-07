import { describe, expect, it } from "vitest";

import {
  D1_SAFE_VARIABLE_BATCH_SIZE,
  chunk,
  inPlaceholders,
  targetPairConditions,
} from "../apps/web/src/lib/d1-batch-lib";

describe("D1_SAFE_VARIABLE_BATCH_SIZE", () => {
  it("is a conservative positive batch size", () => {
    expect(D1_SAFE_VARIABLE_BATCH_SIZE).toBe(25);
  });
});

describe("chunk", () => {
  it("returns an empty array for empty input", () => {
    expect(chunk([])).toEqual([]);
  });

  it("keeps a single batch when input fits the size", () => {
    expect(chunk([1, 2, 3], 5)).toEqual([[1, 2, 3]]);
  });

  it("splits input larger than the size into contiguous batches", () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it("produces evenly sized batches for an exact multiple", () => {
    expect(chunk([1, 2, 3, 4], 2)).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  it("uses the default batch size when size is omitted", () => {
    const items = Array.from(
      { length: D1_SAFE_VARIABLE_BATCH_SIZE + 3 },
      (_, i) => i,
    );
    const batches = chunk(items);
    expect(batches).toHaveLength(2);
    expect(batches[0]).toHaveLength(D1_SAFE_VARIABLE_BATCH_SIZE);
    expect(batches[1]).toHaveLength(3);
  });

  it("throws a RangeError for a zero size", () => {
    expect(() => chunk([1, 2], 0)).toThrow(RangeError);
  });

  it("throws a RangeError for a negative size", () => {
    expect(() => chunk([1, 2], -1)).toThrow(RangeError);
  });

  it("does not mutate the input array", () => {
    const items = [1, 2, 3];
    chunk(items, 2);
    expect(items).toEqual([1, 2, 3]);
  });
});

describe("inPlaceholders", () => {
  it("returns an empty string for a zero count", () => {
    expect(inPlaceholders(0)).toBe("");
  });

  it("returns a single placeholder for count 1", () => {
    expect(inPlaceholders(1)).toBe("?");
  });

  it("joins multiple placeholders with a comma and space", () => {
    expect(inPlaceholders(3)).toBe("?, ?, ?");
  });
});

describe("targetPairConditions", () => {
  it("returns an empty string for a zero count", () => {
    expect(targetPairConditions(0, "target_kind", "target_key")).toBe("");
  });

  it("builds a single pair condition", () => {
    expect(targetPairConditions(1, "target_kind", "target_key")).toBe(
      "(target_kind = ? AND target_key = ?)",
    );
  });

  it("joins multiple pair conditions with OR and uses the given columns", () => {
    expect(targetPairConditions(2, "k", "v")).toBe(
      "(k = ? AND v = ?) OR (k = ? AND v = ?)",
    );
  });
});
