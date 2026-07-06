import { describe, expect, it } from "vitest";

import { csvEscape } from "../apps/web/src/lib/csv-lib";

describe("csvEscape", () => {
  it("passes plain values through unchanged", () => {
    expect(csvEscape("hello")).toBe("hello");
    expect(csvEscape("simple value")).toBe("simple value");
    expect(csvEscape("123")).toBe("123");
    expect(csvEscape(42)).toBe("42");
    expect(csvEscape(true)).toBe("true");
  });

  it("neutralizes formula-injection prefixes with a leading quote", () => {
    expect(csvEscape("=SUM(A1:A2)")).toBe("'=SUM(A1:A2)");
    expect(csvEscape("+1")).toBe("'+1");
    expect(csvEscape("-1")).toBe("'-1");
    expect(csvEscape("@cmd")).toBe("'@cmd");
  });

  it("detects formula prefixes after leading whitespace but preserves the raw value", () => {
    expect(csvEscape("  =SUM(A1)")).toBe("'  =SUM(A1)");
    expect(csvEscape("\t+danger")).toBe("'\t+danger");
  });

  it("wraps values containing a comma in quotes", () => {
    expect(csvEscape("a,b")).toBe('"a,b"');
  });

  it("wraps and doubles embedded quotes", () => {
    expect(csvEscape('say "hi"')).toBe('"say ""hi"""');
    expect(csvEscape('"')).toBe('""""');
  });

  it("wraps values containing newlines and carriage returns", () => {
    expect(csvEscape("line1\nline2")).toBe('"line1\nline2"');
    expect(csvEscape("line1\rline2")).toBe('"line1\rline2"');
    expect(csvEscape("line1\r\nline2")).toBe('"line1\r\nline2"');
  });

  it("maps null and undefined to an empty string", () => {
    expect(csvEscape(null)).toBe("");
    expect(csvEscape(undefined)).toBe("");
  });

  it("handles a formula-prefixed value that also needs quoting", () => {
    expect(csvEscape("=1,2")).toBe(`"'=1,2"`);
    expect(csvEscape('=say "hi"')).toBe(`"'=say ""hi"""`);
    expect(csvEscape("=a\nb")).toBe(`"'=a\nb"`);
  });
});
