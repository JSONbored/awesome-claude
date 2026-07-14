import { describe, expect, it } from "vitest";

import { escapeTableCell } from "../scripts/lib/table-cell.mjs";

describe("escapeTableCell", () => {
  it("escapes pipes and backslashes (backslash first)", () => {
    expect(escapeTableCell("a|b")).toBe("a\\|b");
    expect(escapeTableCell("a\\b")).toBe("a\\\\b");
    expect(escapeTableCell("a\\|b")).toBe("a\\\\\\|b");
  });

  it("collapses each run of whitespace to a single space", () => {
    expect(escapeTableCell("a   b\t\tc")).toBe("a b c");
    expect(escapeTableCell("line1\nline2\r\nline3")).toBe("line1 line2 line3");
  });

  it("trims leading and trailing whitespace", () => {
    expect(escapeTableCell("  hi  ")).toBe("hi");
  });

  it("coerces nullish and non-string values", () => {
    expect(escapeTableCell(null)).toBe("");
    expect(escapeTableCell(undefined)).toBe("");
    expect(escapeTableCell(42)).toBe("42");
  });
});
