import { describe, expect, it } from "vitest";

import {
  COMPARE_DECISION_ROWS,
  compareSignalToneClass,
  reviewCompareSignal,
} from "@/lib/compare-entry-signals";

describe("compare-entry-signals re-export surface", () => {
  it("keeps the public import path wired to the extracted lib", () => {
    expect(COMPARE_DECISION_ROWS).toHaveLength(4);
    expect(compareSignalToneClass("verified")).toBe("text-trust-trusted");
    expect(reviewCompareSignal({ reviewed: true }).label).toBe("Reviewed");
  });
});
