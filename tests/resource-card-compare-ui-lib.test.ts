import { describe, expect, it } from "vitest";
import {
  resourceCardCompareFullMessage,
  resourceCardCompareWouldBlock,
} from "@/lib/resource-card-compare-ui-lib";

describe("resource card compare ui lib", () => {
  it("detects when compare is full for new additions", () => {
    expect(resourceCardCompareWouldBlock(false, 4)).toBe(true);
    expect(resourceCardCompareWouldBlock(true, 4)).toBe(false);
    expect(resourceCardCompareWouldBlock(false, 2)).toBe(false);
  });

  it("returns a tray-full message for blocked compare adds", () => {
    expect(resourceCardCompareFullMessage()).toBe(
      "Compare is full (4/4). Remove an entry to add this one.",
    );
  });
});
