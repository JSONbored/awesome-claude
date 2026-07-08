import { describe, expect, it } from "vitest";

import { severityClass } from "../apps/web/src/lib/compare-evidence-severity-lib";

describe("severityClass", () => {
  it("maps high/medium/low to blocked/amber/trusted classes", () => {
    expect(severityClass("high")).toContain("text-trust-blocked");
    expect(severityClass("medium")).toContain("text-amber-900");
    expect(severityClass("low")).toContain("text-trust-trusted");
  });
});
