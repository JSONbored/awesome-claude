import { describe, expect, it } from "vitest";

import {
  argValue,
  envelopeEntries,
  hasFlag,
} from "../scripts/lib/weekly-brief-cli.mjs";

describe("argValue", () => {
  it("reads the value of a --name=value flag", () => {
    expect(argValue("--format", ["--format=json", "--days=7"])).toBe("json");
    expect(argValue("--days", ["--format=json", "--days=7"])).toBe("7");
  });

  it("returns the fallback (default '') when the flag is absent", () => {
    expect(argValue("--format", ["--days=7"], "markdown")).toBe("markdown");
    expect(argValue("--format", [])).toBe("");
  });

  it("returns an empty string for a flag given with an empty value", () => {
    expect(argValue("--format", ["--format="], "markdown")).toBe("");
  });
});

describe("hasFlag", () => {
  it("detects a boolean flag", () => {
    expect(hasFlag("--help", ["--help"])).toBe(true);
    expect(hasFlag("-h", ["--format=json", "-h"])).toBe(true);
    expect(hasFlag("--help", ["--format=json"])).toBe(false);
    expect(hasFlag("--help", [])).toBe(false);
  });
});

describe("envelopeEntries", () => {
  it("returns the entries array from a payload envelope", () => {
    const entries = [{ slug: "a" }];
    expect(envelopeEntries({ entries }, "directory-index.json")).toBe(entries);
  });

  it("throws a labelled error when entries is missing or not an array", () => {
    expect(() => envelopeEntries({}, "directory-index.json")).toThrow(
      /directory-index\.json must contain an entries array/,
    );
    expect(() => envelopeEntries(null, "changelog.json")).toThrow(
      /changelog\.json must contain an entries array/,
    );
    expect(() => envelopeEntries({ entries: "nope" }, "x.json")).toThrow(
      /x\.json must contain an entries array/,
    );
  });
});
