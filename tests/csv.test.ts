import { describe, expect, it } from "vitest";

import { csvDocument, csvEscape, csvRow } from "@/lib/csv";

describe("csvEscape", () => {
  it("returns plain values unchanged", () => {
    expect(csvEscape("hello")).toBe("hello");
    expect(csvEscape(42)).toBe("42");
    expect(csvEscape(true)).toBe("true");
    expect(csvEscape("")).toBe("");
  });

  it("double-quotes cells that contain a comma", () => {
    expect(csvEscape("a,b")).toBe('"a,b"');
  });

  it("double-quotes cells that contain a double-quote, escaping the inner quote", () => {
    expect(csvEscape('say "hi"')).toBe('"say ""hi"""');
  });

  it("double-quotes cells that contain newlines", () => {
    expect(csvEscape("line1\nline2")).toBe('"line1\nline2"');
    expect(csvEscape("line1\r\nline2")).toBe('"line1\r\nline2"');
  });

  it("prefixes formula-injection characters with a literal apostrophe", () => {
    expect(csvEscape("=SUM(A1)")).toBe("'=SUM(A1)");
    expect(csvEscape("+1 555 123")).toBe("'+1 555 123");
    expect(csvEscape("-profit")).toBe("'-profit");
    expect(csvEscape("@user")).toBe("'@user");
  });

  it("does not prefix formula characters that appear after leading whitespace", () => {
    // trimStart is used, so "   =cmd" is still formula-injection
    expect(csvEscape("   =cmd")).toBe("'   =cmd");
  });

  it("stringifies null and undefined as empty cells", () => {
    expect(csvEscape(null)).toBe("");
    expect(csvEscape(undefined)).toBe("");
  });
});

describe("csvRow", () => {
  it("escapes each cell and joins with a comma", () => {
    expect(csvRow(["Alice", "Smith", 95])).toBe("Alice,Smith,95");
    expect(csvRow(['He said "hello"', "a,b"])).toBe('"He said ""hello""","a,b"');
  });

  it("handles an empty array", () => {
    expect(csvRow([])).toBe("");
  });

  it("stringifies non-string values", () => {
    expect(csvRow([true, false, null, 0])).toBe("true,false,,0");
  });
});

describe("csvDocument", () => {
  it("produces a header row followed by data rows separated by newlines", () => {
    const out = csvDocument(
      ["name", "score"],
      [
        ["Alice", 95],
        ["Bob", 87],
      ],
    );
    expect(out).toBe("name,score\nAlice,95\nBob,87");
  });

  it("returns only the header when rows is empty", () => {
    expect(csvDocument(["id", "title"], [])).toBe("id,title");
  });

  it("escapes values in both header and data rows", () => {
    const out = csvDocument(['col,"header"'], [['val,with,commas']]);
    expect(out).toBe('"col,""header"""\n"val,with,commas"');
  });

  it("does not add a trailing newline", () => {
    const out = csvDocument(["a"], [["b"]]);
    expect(out.endsWith("\n")).toBe(false);
  });
});
