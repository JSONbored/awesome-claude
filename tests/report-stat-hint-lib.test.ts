import { describe, expect, it } from "vitest";

import { statHint } from "../apps/web/src/lib/report-stat-hint-lib";

const stat = (over: { hint: string; value?: string | number }) =>
  ({ value: "42", ...over }) as Parameters<typeof statHint>[0];

describe("statHint", () => {
  it("renders '<value>%' when the hint is the '%' token", () => {
    expect(statHint(stat({ hint: "%", value: "63" }))).toBe("63%");
  });

  it("returns the hint verbatim when it is not the '%' token", () => {
    expect(statHint(stat({ hint: "of teams surveyed" }))).toBe(
      "of teams surveyed",
    );
  });

  it("does not treat a hint that merely contains '%' as the token", () => {
    expect(statHint(stat({ hint: "up 5% YoY", value: "5" }))).toBe("up 5% YoY");
  });
});
