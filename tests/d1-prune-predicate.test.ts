import { describe, expect, it } from "vitest";

import {
  expectedKeyExclusionPredicate,
  sqlString,
} from "../scripts/lib/d1-prune-predicate.mjs";

describe("sqlString", () => {
  it("wraps a value in single quotes", () => {
    expect(sqlString("agents/example")).toBe("'agents/example'");
  });

  it("doubles embedded single quotes", () => {
    expect(sqlString("o'brien")).toBe("'o''brien'");
    expect(sqlString("a'b'c")).toBe("'a''b''c'");
  });
});

describe("expectedKeyExclusionPredicate", () => {
  it("throws for an empty key set", () => {
    expect(() => expectedKeyExclusionPredicate([])).toThrow(
      /empty content key set/,
    );
  });

  it("sorts keys and builds a single NOT IN clause", () => {
    expect(expectedKeyExclusionPredicate(["b", "a"])).toBe(
      "entry_key NOT IN ('a', 'b')",
    );
  });

  it("escapes quotes inside the IN list", () => {
    expect(expectedKeyExclusionPredicate(["o'brien"])).toBe(
      "entry_key NOT IN ('o''brien')",
    );
  });

  it("chunks into ANDed clauses beyond 200 keys", () => {
    const keys = Array.from({ length: 201 }, (_, i) =>
      String(i).padStart(4, "0"),
    );
    const predicate = expectedKeyExclusionPredicate(keys);
    const clauses = predicate.split(" AND ");
    expect(clauses).toHaveLength(2);
    // first chunk holds 200 keys, second holds the remaining one
    expect(clauses[0].match(/'/g)).toHaveLength(400);
    expect(clauses[1]).toBe("entry_key NOT IN ('0200')");
  });

  it("accepts a Set of keys", () => {
    expect(expectedKeyExclusionPredicate(new Set(["z", "a"]))).toBe(
      "entry_key NOT IN ('a', 'z')",
    );
  });
});
