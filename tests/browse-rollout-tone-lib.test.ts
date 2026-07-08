import { describe, expect, it } from "vitest";

import { toneClass } from "../apps/web/src/lib/browse-rollout-tone-lib";

describe("toneClass", () => {
  it("maps good/watch/risk to distinct trust/amber/blocked classes", () => {
    expect(toneClass("good")).toContain("text-trust-trusted");
    expect(toneClass("watch")).toContain("text-amber-900");
    expect(toneClass("risk")).toContain("text-trust-blocked");
  });
});
