import { describe, expect, it } from "vitest";

import { cn } from "@/lib/utils";

describe("cn", () => {
  it("joins plain class name strings", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("drops falsy/conditional values", () => {
    // clsx ignores false/undefined/null, so conditional classes collapse out.
    expect(cn("a", false && "b", undefined, "c")).toBe("a c");
  });

  it("flattens arrays and resolves object maps by truthiness", () => {
    expect(cn(["a", "b"], "c")).toBe("a b c");
    expect(cn({ a: true, b: false })).toBe("a");
  });

  it("dedupes conflicting tailwind utilities, keeping the last one", () => {
    // tailwind-merge resolves same-axis conflicts to the final value.
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("keeps tailwind utilities on different axes", () => {
    expect(cn("px-2", "py-4")).toBe("px-2 py-4");
  });

  it("returns an empty string for no/empty input", () => {
    expect(cn()).toBe("");
    expect(cn(false, null, undefined)).toBe("");
  });
});
