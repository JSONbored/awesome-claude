import { describe, expect, it } from "vitest";

import { stringHasLoneSurrogate } from "../scripts/lib/lone-surrogate.mjs";

const HIGH = String.fromCharCode(0xd800);
const LOW = String.fromCharCode(0xdc00);
const PAIR = String.fromCharCode(0xd83d, 0xde00); // 😀

describe("stringHasLoneSurrogate", () => {
  it("is false for BMP text, a valid surrogate pair, and an empty string", () => {
    expect(stringHasLoneSurrogate("hello world")).toBe(false);
    expect(stringHasLoneSurrogate(`emoji ${PAIR} ok`)).toBe(false);
    expect(stringHasLoneSurrogate("")).toBe(false);
  });

  it("detects a high surrogate not followed by a low surrogate", () => {
    expect(stringHasLoneSurrogate(`${HIGH}A`)).toBe(true);
    // high surrogate at end of string (no next code unit)
    expect(stringHasLoneSurrogate(`a${HIGH}`)).toBe(true);
  });

  it("detects a standalone low surrogate", () => {
    expect(stringHasLoneSurrogate(`x${LOW}y`)).toBe(true);
  });

  it("does not flag a low surrogate that completes a pair", () => {
    expect(stringHasLoneSurrogate(`${HIGH}${LOW}`)).toBe(false);
  });
});
