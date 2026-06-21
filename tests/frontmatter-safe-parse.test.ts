import { describe, expect, it } from "vitest";

import {
  parseSafeFrontmatter,
  UNSAFE_FRONTMATTER_LANGUAGE_ERROR,
} from "@heyclaude/registry/frontmatter";

describe("parseSafeFrontmatter", () => {
  it("separates frontmatter data from body content", () => {
    const result = parseSafeFrontmatter(
      "---\ntitle: Hello\ntags: [a, b]\n---\nBody text",
    );
    expect(result.data).toEqual({ title: "Hello", tags: ["a", "b"] });
    expect(result.content.trim()).toBe("Body text");
  });

  it("strips a leading byte-order mark before parsing", () => {
    // A BOM ahead of the opening fence would otherwise hide the frontmatter.
    const result = parseSafeFrontmatter("﻿---\ntitle: BOM\n---\nx");
    expect(result.data.title).toBe("BOM");
  });

  it("rejects executable JavaScript frontmatter as a security boundary", () => {
    // The whole point of the safe parser: a `js` engine must never run.
    expect(() =>
      parseSafeFrontmatter('---js\nmodule.exports = { title: "x" }\n---\nbody'),
    ).toThrow(UNSAFE_FRONTMATTER_LANGUAGE_ERROR);
  });

  it("returns a safe fallback for malformed YAML when fallbackOnError is set", () => {
    const malformed = '---\ntitle: "unclosed\n  bad: : :\n---\nx';
    const result = parseSafeFrontmatter(malformed, { fallbackOnError: true });
    expect(result.data).toEqual({});
    expect(result.error).toBeTruthy();
    // The original content is preserved so callers can recover/log it.
    expect(result.content).toBe(malformed);
  });

  it("rethrows malformed YAML when no fallback is requested", () => {
    const malformed = '---\ntitle: "unclosed\n  bad: : :\n---\nx';
    expect(() => parseSafeFrontmatter(malformed)).toThrow();
  });

  it("treats nullish input as empty frontmatter and body", () => {
    // The published signature is `value: unknown`, so passing `null` is
    // type-safe by contract; the runtime coerces it via `String(value ?? "")`.
    const result = parseSafeFrontmatter(null);
    expect(result.data).toEqual({});
    expect(result.content).toBe("");

    const undefinedResult = parseSafeFrontmatter(undefined);
    expect(undefinedResult.data).toEqual({});
    expect(undefinedResult.content).toBe("");
  });
});
