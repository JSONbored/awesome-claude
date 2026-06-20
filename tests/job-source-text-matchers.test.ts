import { describe, expect, it } from "vitest";

import {
  containsClosurePhrase,
  hasApplySignal,
  includesToken,
} from "../scripts/check-d1-job-sources.mjs";

describe("containsClosurePhrase", () => {
  it("detects phrases that signal a job listing has closed", () => {
    expect(containsClosurePhrase("Sorry, this role is closed now")).toBe(true);
    expect(containsClosurePhrase("no longer accepting applications")).toBe(
      true,
    );
  });

  it("is false for an active listing", () => {
    expect(containsClosurePhrase("We are hiring engineers")).toBe(false);
  });
});

describe("hasApplySignal", () => {
  it("detects apply affordances in the page text", () => {
    expect(hasApplySignal("Click here to apply now")).toBe(true);
  });

  it("is false when no apply signal is present", () => {
    expect(hasApplySignal("Just some random text")).toBe(false);
  });
});

describe("includesToken", () => {
  it("matches when the page text contains the first meaningful token", () => {
    expect(includesToken("the engineer role", "engineer")).toBe(true);
    expect(includesToken("the manager role", "engineer")).toBe(false);
  });

  it("returns true when the value has no token of at least three characters", () => {
    // With nothing specific to look for, the check is permissive.
    expect(includesToken("anything", "ab")).toBe(true);
  });
});
