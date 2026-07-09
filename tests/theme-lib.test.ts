import { describe, expect, it } from "vitest";

import { isTheme } from "../apps/web/src/lib/theme-lib";

describe("isTheme", () => {
  it("accepts the two supported themes", () => {
    expect(isTheme("light")).toBe(true);
    expect(isTheme("dark")).toBe(true);
  });

  it("rejects unknown values", () => {
    expect(isTheme("system")).toBe(false);
    expect(isTheme("Dark")).toBe(false);
    expect(isTheme("")).toBe(false);
  });

  it("is null/undefined safe", () => {
    expect(isTheme(null)).toBe(false);
    expect(isTheme(undefined)).toBe(false);
  });
});
