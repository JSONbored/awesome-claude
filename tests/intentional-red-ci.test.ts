import { describe, expect, it } from "vitest";

// INTENTIONAL FAILURE — reviewbot pipeline test (red-CI path). This PR is mergeable
// but its CI is red; reviewbot should post an advisory but WITHHOLD approval until green.
describe("intentional red-ci probe", () => {
  it("fails on purpose to exercise the all-green CI gate", () => {
    expect(1 + 1).toBe(3);
  });
});
