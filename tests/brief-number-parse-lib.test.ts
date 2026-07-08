import { describe, expect, it } from "vitest";

import { parseBriefNumber } from "../apps/web/src/lib/brief-number-parse-lib";

describe("parseBriefNumber", () => {
  it("parses an all-digit string to a number", () => {
    expect(parseBriefNumber("123")).toBe(123);
    expect(parseBriefNumber("007")).toBe(7);
  });

  it("returns NaN for non-digit, empty, signed, or decimal input", () => {
    expect(parseBriefNumber("12a")).toBeNaN();
    expect(parseBriefNumber("")).toBeNaN();
    expect(parseBriefNumber("-5")).toBeNaN();
    expect(parseBriefNumber("1.5")).toBeNaN();
  });
});
