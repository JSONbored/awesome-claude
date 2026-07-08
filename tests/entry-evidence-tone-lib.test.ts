import { describe, expect, it } from "vitest";

import {
  cellToneClass,
  riskTone,
} from "../apps/web/src/lib/entry-evidence-tone-lib";

describe("riskTone", () => {
  it("maps score bands to blocked / amber / trusted classes", () => {
    expect(riskTone(60)).toContain("text-trust-blocked");
    expect(riskTone(30)).toContain("text-amber-900");
    expect(riskTone(29)).toContain("text-trust-trusted");
  });
});

describe("cellToneClass", () => {
  it("maps critical/warning/complete to blocked/amber/neutral classes", () => {
    expect(cellToneClass("critical")).toContain("bg-trust-blocked/5");
    expect(cellToneClass("warning")).toContain("bg-amber-500/5");
    expect(cellToneClass("complete")).toBe("border-border bg-background");
  });
});
