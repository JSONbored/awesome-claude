import { describe, expect, it } from "vitest";
import { compareShareOrigin } from "@/lib/compare-share-origin";

describe("compare share origin", () => {
  it("returns an empty origin during server-side rendering", () => {
    expect(compareShareOrigin()).toBe("");
  });
});
