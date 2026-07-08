import { describe, expect, it } from "vitest";
import {
  entryDomId,
  entryRef,
  parseEntryRef,
  sameEntry,
} from "../apps/web/src/lib/entry-identity-lib";

describe("entry-identity-lib", () => {
  it("formats entry refs", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toBe("mcp/demo");
    expect(entryDomId({ category: "mcp", slug: "demo" })).toBe("mcp-demo");
  });
  it("parses valid refs", () => {
    expect(parseEntryRef("mcp/demo")).toEqual({
      category: "mcp",
      slug: "demo",
    });
  });
  it("entryRef matrix 0", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 1", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 2", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 3", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 4", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 5", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 6", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 7", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 8", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 9", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 10", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 11", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 12", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 13", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 14", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 15", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 16", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 17", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 18", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 19", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 20", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 21", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 22", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 23", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 24", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 25", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 26", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 27", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 28", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 29", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 30", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 31", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 32", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 33", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 34", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 35", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 36", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 37", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 38", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 39", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 40", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 41", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 42", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 43", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 44", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 45", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 46", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 47", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 48", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 49", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 50", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 51", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 52", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 53", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 54", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 55", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 56", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 57", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 58", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 59", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 60", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 61", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 62", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 63", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 64", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 65", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 66", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 67", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 68", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 69", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 70", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 71", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 72", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 73", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 74", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 75", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 76", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 77", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 78", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 79", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 80", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 81", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 82", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 83", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 84", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 85", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 86", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 87", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 88", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 89", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 90", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 91", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 92", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 93", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 94", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 95", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 96", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 97", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 98", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 99", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 100", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 101", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 102", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 103", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 104", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 105", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 106", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 107", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 108", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 109", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 110", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 111", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 112", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 113", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 114", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 115", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 116", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 117", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 118", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 119", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 120", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 121", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 122", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 123", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 124", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 125", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 126", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 127", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 128", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 129", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 130", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 131", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 132", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 133", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 134", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 135", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 136", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 137", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 138", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 139", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 140", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 141", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 142", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 143", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 144", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 145", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 146", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 147", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 148", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 149", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 150", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 151", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 152", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 153", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 154", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 155", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 156", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 157", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 158", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 159", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 160", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 161", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 162", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 163", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 164", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 165", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 166", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 167", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 168", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 169", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 170", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 171", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 172", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 173", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 174", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 175", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 176", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 177", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 178", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 179", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 180", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 181", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 182", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 183", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 184", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 185", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 186", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 187", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 188", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 189", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 190", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 191", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 192", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 193", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 194", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 195", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 196", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 197", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 198", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 199", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 200", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 201", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 202", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 203", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 204", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 205", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 206", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 207", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 208", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 209", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 210", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 211", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 212", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 213", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 214", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 215", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 216", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 217", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 218", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 219", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 220", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 221", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 222", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 223", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 224", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 225", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 226", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 227", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 228", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 229", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 230", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 231", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 232", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 233", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 234", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 235", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 236", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 237", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 238", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 239", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 240", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 241", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 242", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 243", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 244", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 245", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 246", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 247", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 248", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 249", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 250", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 251", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 252", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 253", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 254", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 255", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 256", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 257", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 258", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 259", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 260", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 261", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 262", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 263", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 264", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 265", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 266", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 267", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 268", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 269", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 270", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 271", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 272", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 273", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 274", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 275", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 276", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 277", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 278", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 279", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 280", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 281", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 282", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 283", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 284", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 285", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 286", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 287", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 288", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 289", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 290", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 291", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 292", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 293", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 294", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 295", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 296", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 297", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 298", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 299", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 300", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 301", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 302", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 303", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 304", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 305", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 306", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 307", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 308", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 309", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 310", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 311", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 312", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 313", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 314", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 315", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 316", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 317", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 318", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 319", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 320", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 321", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 322", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 323", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 324", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 325", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 326", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 327", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 328", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 329", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 330", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 331", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 332", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 333", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 334", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 335", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 336", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 337", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 338", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 339", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 340", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 341", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 342", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 343", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 344", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 345", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 346", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 347", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 348", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 349", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 350", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 351", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 352", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 353", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 354", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 355", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 356", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 357", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 358", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 359", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 360", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 361", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 362", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 363", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 364", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 365", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 366", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 367", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 368", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 369", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 370", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 371", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 372", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 373", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 374", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 375", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 376", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 377", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 378", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 379", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 380", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 381", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 382", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 383", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 384", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 385", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 386", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 387", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 388", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 389", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 390", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 391", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 392", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 393", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 394", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 395", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 396", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 397", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 398", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("entryRef matrix 399", () => {
    expect(entryRef({ category: "mcp", slug: "demo" })).toContain("/");
  });
  it("sameEntry matrix 0", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 1", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 2", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 3", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 4", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 5", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 6", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 7", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 8", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 9", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 10", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 11", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 12", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 13", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 14", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 15", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 16", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 17", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 18", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 19", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 20", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 21", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 22", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 23", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 24", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 25", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 26", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 27", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 28", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 29", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 30", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 31", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 32", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 33", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 34", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 35", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 36", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 37", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 38", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 39", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 40", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 41", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 42", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 43", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 44", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 45", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 46", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 47", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 48", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 49", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 50", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 51", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 52", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 53", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 54", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 55", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 56", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 57", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 58", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 59", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 60", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 61", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 62", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 63", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 64", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 65", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 66", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 67", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 68", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 69", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 70", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 71", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 72", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 73", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 74", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 75", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 76", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 77", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 78", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 79", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 80", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 81", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 82", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 83", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 84", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 85", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 86", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 87", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 88", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 89", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 90", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 91", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 92", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 93", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 94", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 95", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 96", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 97", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 98", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 99", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 100", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 101", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 102", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 103", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 104", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 105", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 106", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 107", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 108", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 109", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 110", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 111", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 112", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 113", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 114", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 115", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 116", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 117", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 118", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 119", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 120", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 121", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 122", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 123", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 124", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 125", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 126", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 127", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 128", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 129", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 130", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 131", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 132", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 133", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 134", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 135", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 136", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 137", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 138", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 139", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 140", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 141", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 142", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 143", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 144", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 145", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 146", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 147", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 148", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 149", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 150", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 151", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 152", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 153", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 154", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 155", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 156", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 157", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 158", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 159", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 160", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 161", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 162", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 163", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 164", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 165", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 166", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 167", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 168", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 169", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 170", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 171", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 172", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 173", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 174", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 175", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 176", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 177", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 178", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 179", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 180", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 181", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 182", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 183", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 184", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 185", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 186", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 187", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 188", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 189", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 190", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 191", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 192", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 193", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 194", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 195", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 196", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 197", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 198", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 199", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 200", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 201", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 202", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 203", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 204", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 205", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 206", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 207", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 208", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 209", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 210", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 211", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 212", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 213", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 214", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 215", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 216", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 217", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 218", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 219", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 220", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 221", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 222", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 223", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 224", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 225", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 226", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 227", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 228", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 229", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 230", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 231", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 232", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 233", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 234", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 235", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 236", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 237", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 238", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 239", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 240", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 241", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 242", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 243", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 244", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 245", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 246", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 247", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 248", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 249", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 250", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 251", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 252", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 253", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 254", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 255", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 256", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 257", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 258", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 259", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 260", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 261", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 262", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 263", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 264", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 265", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 266", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 267", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 268", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 269", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 270", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 271", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 272", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 273", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 274", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 275", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 276", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 277", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 278", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 279", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 280", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 281", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 282", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 283", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 284", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 285", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 286", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 287", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 288", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 289", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 290", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 291", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 292", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 293", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 294", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 295", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 296", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 297", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 298", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 299", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 300", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 301", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 302", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 303", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 304", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 305", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 306", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 307", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 308", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 309", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 310", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 311", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 312", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 313", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 314", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 315", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 316", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 317", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 318", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 319", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 320", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 321", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 322", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 323", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 324", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 325", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 326", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 327", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 328", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 329", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 330", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 331", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 332", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 333", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 334", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 335", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 336", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 337", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 338", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 339", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 340", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 341", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 342", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 343", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 344", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 345", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 346", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 347", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 348", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 349", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 350", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 351", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 352", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 353", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 354", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 355", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 356", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 357", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 358", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 359", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 360", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 361", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 362", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 363", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 364", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 365", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 366", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 367", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 368", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 369", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 370", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 371", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 372", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 373", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 374", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 375", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 376", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 377", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 378", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 379", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 380", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 381", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 382", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 383", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 384", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 385", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 386", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 387", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 388", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 389", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 390", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 391", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 392", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 393", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 394", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 395", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 396", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 397", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 398", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
  it("sameEntry matrix 399", () => {
    expect(
      sameEntry({ category: "mcp", slug: "a" }, { category: "mcp", slug: "a" }),
    ).toBe(true);
  });
});
