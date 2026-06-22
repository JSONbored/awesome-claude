import { describe, expect, it } from "vitest";

import {
  compactCount,
  parseAbbreviatedCount,
  firstUsefulLine,
  extractConfigCommand,
} from "@heyclaude/registry";

describe("compactCount", () => {
  it("returns the plain string for values below 1000", () => {
    expect(compactCount(0)).toBe("0");
    expect(compactCount(42)).toBe("42");
    expect(compactCount(999)).toBe("999");
  });

  it("uses one decimal place for the thousands range below 10k", () => {
    expect(compactCount(1000)).toBe("1.0k");
    expect(compactCount(1500)).toBe("1.5k");
    expect(compactCount(9999)).toBe("10.0k");
  });

  it("drops the decimal once the value reaches 10k", () => {
    expect(compactCount(10000)).toBe("10k");
    expect(compactCount(12345)).toBe("12k");
    expect(compactCount(999999)).toBe("1000k");
  });
});

describe("parseAbbreviatedCount", () => {
  it("parses plain integers", () => {
    expect(parseAbbreviatedCount("500")).toBe(500);
    expect(parseAbbreviatedCount("0")).toBe(0);
  });

  it("applies k/m/b multipliers and rounds the result", () => {
    expect(parseAbbreviatedCount("1.5k")).toBe(1500);
    expect(parseAbbreviatedCount("2m")).toBe(2_000_000);
    expect(parseAbbreviatedCount("3b")).toBe(3_000_000_000);
    expect(parseAbbreviatedCount("1.2345k")).toBe(1235);
  });

  it("is case-insensitive and trims surrounding whitespace", () => {
    expect(parseAbbreviatedCount(" 1.2K ")).toBe(1200);
    expect(parseAbbreviatedCount("4M")).toBe(4_000_000);
  });

  it("returns null for empty, nullish, or unparseable input", () => {
    expect(parseAbbreviatedCount("")).toBeNull();
    expect(parseAbbreviatedCount("   ")).toBeNull();
    expect(parseAbbreviatedCount(null)).toBeNull();
    expect(parseAbbreviatedCount(undefined)).toBeNull();
    expect(parseAbbreviatedCount("abc")).toBeNull();
    expect(parseAbbreviatedCount("1.2.3k")).toBeNull();
    expect(parseAbbreviatedCount("10x")).toBeNull();
  });

  it("round-trips compactCount output for whole-thousand values", () => {
    expect(parseAbbreviatedCount(compactCount(2000))).toBe(2000);
    expect(parseAbbreviatedCount(compactCount(10000))).toBe(10000);
  });
});

describe("firstUsefulLine", () => {
  it("returns an empty string for falsy input", () => {
    expect(firstUsefulLine("")).toBe("");
    expect(firstUsefulLine(null as unknown as string)).toBe("");
  });

  it("skips code fences, headings, comments, and lone brackets", () => {
    expect(firstUsefulLine("```js\n# Title\nactual content\nmore")).toBe(
      "actual content",
    );
    expect(firstUsefulLine("{\nreal line")).toBe("real line");
    expect(firstUsefulLine("// comment\n/* block */\n* bullet\nkeep me")).toBe(
      "keep me",
    );
    expect(firstUsefulLine("<!-- html comment -->\nvisible")).toBe("visible");
  });

  it("returns an empty string when no useful line remains", () => {
    expect(firstUsefulLine("```\n#\n{\n}\n[\n]")).toBe("");
  });
});

describe("extractConfigCommand", () => {
  it("extracts a quoted command field from JSON-ish config", () => {
    expect(extractConfigCommand('{"command": "npx foo"}')).toBe("npx foo");
    expect(extractConfigCommand("{ 'command': 'run bar' }")).toBe("run bar");
  });

  it("falls back to the first useful line when no command field exists", () => {
    expect(extractConfigCommand("just text")).toBe("just text");
    expect(extractConfigCommand("```\nmy command")).toBe("my command");
  });

  it("returns an empty string for empty or nullish input", () => {
    expect(extractConfigCommand("")).toBe("");
    expect(extractConfigCommand(null)).toBe("");
    expect(extractConfigCommand(undefined)).toBe("");
  });
});
